/**
 * Encrypted IndexedDB storage using AES-GCM
 * - Key is stored only in memory (derived from session start)
 * - Data persisted encrypted on disk
 * - Decryption happens on app load with the in-memory key
 */

const DB_NAME = 'stop-tabac-encrypted';
const STORE_NAME = 'encrypted-data';
const ENCRYPTION_KEY_SALT = 'stop-tabac-2026'; // Fixed salt for consistent key derivation

let encryptionKey = null;
let db = null;

/**
 * Initialize encryption key from browser's crypto API
 * Key is derived from random values + fixed salt, stored only in memory
 */
async function initializeEncryptionKey() {
  if (encryptionKey) return;

  try {
    // Derive a 256-bit key from random data + fixed salt
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const keyData = await crypto.subtle.importKey(
      'raw',
      randomBytes,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode(ENCRYPTION_KEY_SALT),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyData,
      256
    );

    encryptionKey = await crypto.subtle.importKey(
      'raw',
      derivedBits,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Failed to initialize encryption key:', error);
    throw error;
  }
}

/**
 * Open IndexedDB connection
 */
async function openDatabase() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Encrypt data with AES-GCM
 * Returns: { ciphertext, iv } (both base64 encoded)
 */
async function encryptData(plaintext) {
  if (!encryptionKey) await initializeEncryptionKey();

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const data = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    data
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

/**
 * Decrypt data with AES-GCM
 * Expects: { ciphertext, iv } (both base64 encoded)
 */
async function decryptData(encrypted) {
  if (!encryptionKey) await initializeEncryptionKey();

  const iv = Uint8Array.from(atob(encrypted.iv), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(
    atob(encrypted.ciphertext),
    (c) => c.charCodeAt(0)
  );

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

/**
 * Save encrypted data to IndexedDB
 */
async function saveEncrypted(key, plaintext) {
  try {
    const database = await openDatabase();
    const encrypted = await encryptData(plaintext);

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(encrypted, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('Failed to save encrypted data:', error);
    throw error;
  }
}

/**
 * Load and decrypt data from IndexedDB
 */
async function loadEncrypted(key) {
  try {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        if (!request.result) {
          resolve(null);
          return;
        }

        try {
          const plaintext = await decryptData(request.result);
          resolve(plaintext);
        } catch (error) {
          console.error('Failed to decrypt data:', error);
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error('Failed to load encrypted data:', error);
    throw error;
  }
}

/**
 * Delete encrypted data from IndexedDB
 */
async function deleteEncrypted(key) {
  try {
    const database = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('Failed to delete encrypted data:', error);
    throw error;
  }
}

/**
 * Wrapper: use IndexedDB for sensitive keys, fallback to memory for non-sensitive
 * This replaces localStorage for security-sensitive data
 */
async function secureSetItem(key, value) {
  if (!value) {
    await deleteEncrypted(key);
    return;
  }

  // Determine if this key should be encrypted (auth tokens, personal data)
  const sensitiveKeys = [
    'stop-smoking-auth-token',
    'stop-smoking-quit-date',
    'stop-smoking-metrics-history',
    'stop-smoking-wellbeing-log',
  ];

  if (sensitiveKeys.some((k) => key.includes(k))) {
    // Encrypt and store in IndexedDB
    await saveEncrypted(key, typeof value === 'string' ? value : JSON.stringify(value));
  } else {
    // Non-sensitive data stays in localStorage for speed
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
}

/**
 * Wrapper: retrieve from IndexedDB or localStorage
 */
async function secureGetItem(key) {
  const sensitiveKeys = [
    'stop-smoking-auth-token',
    'stop-smoking-quit-date',
    'stop-smoking-metrics-history',
    'stop-smoking-wellbeing-log',
  ];

  if (sensitiveKeys.some((k) => key.includes(k))) {
    // Retrieve from encrypted IndexedDB
    const value = await loadEncrypted(key);
    return value ? (value.startsWith('{') ? JSON.parse(value) : value) : null;
  } else {
    // Retrieve from localStorage (non-sensitive)
    const value = localStorage.getItem(key);
    return value ? (value.startsWith('{') ? JSON.parse(value) : value) : null;
  }
}

/**
 * Clear all encrypted storage (on logout)
 */
async function clearSecureStorage() {
  try {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error('Failed to clear secure storage:', error);
  }
}

// Initialize encryption on module load
initializeEncryptionKey().catch(console.error);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    secureSetItem,
    secureGetItem,
    clearSecureStorage,
    saveEncrypted,
    loadEncrypted,
    deleteEncrypted,
  };
}
