const STORAGE_ADMIN_KEY = 'admin-dashboard-key';

function getStoredAdminKey() {
  return sessionStorage.getItem(STORAGE_ADMIN_KEY) || null;
}

function saveAdminKey(key) {
  sessionStorage.setItem(STORAGE_ADMIN_KEY, key);
}

function clearAdminKey() {
  sessionStorage.removeItem(STORAGE_ADMIN_KEY);
}

async function makeAdminRequest(path, method = 'GET', body = null) {
  const key = getStoredAdminKey();
  if (!key) throw new Error('No admin key');

  const options = {
    method,
    headers: { 'x-admin-key': key, 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(path, options);
  if (res.status === 403) {
    clearAdminKey();
    location.reload();
    throw new Error('Admin key invalid');
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function handleLogin() {
  const keyInput = document.getElementById('adminKey');
  const errorDiv = document.getElementById('loginError');
  errorDiv.textContent = '';

  try {
    const key = keyInput.value.trim();
    if (!key) {
      errorDiv.textContent = 'Veuillez entrer une cle admin.';
      return;
    }

    saveAdminKey(key);
    await makeAdminRequest('/api/admin/status');
    showDashboard();
    await loadAllData();
  } catch (e) {
    clearAdminKey();
    errorDiv.textContent = e.message || 'Cle admin invalide';
  }
}

function handleLogout() {
  clearAdminKey();
  location.reload();
}

function showDashboard() {
  document.getElementById('loginPanel').hidden = true;
  document.getElementById('dashboard').hidden = false;
}

async function loadAllData() {
  try {
    const users = await makeAdminRequest('/api/admin/users');
    displayUsers(users);

    const sessions = await makeAdminRequest('/api/admin/sessions');
    displaySessions(sessions);

    const eventsData = await makeAdminRequest('/api/analytics/export');
    displayEvents(eventsData.events || []);

    const feedback = await makeAdminRequest('/api/admin/feedback');
    displayFeedback(feedback);

    document.getElementById('userCount').textContent = users.length;
    document.getElementById('sessionCount').textContent = sessions.length;
    document.getElementById('eventCount').textContent = (eventsData.events || []).length;
    document.getElementById('feedbackCount').textContent = feedback.length;
  } catch (e) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = `<div class="error-message">Erreur: ${e.message}</div>`;
  }
}

function displayUsers(users) {
  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = users
    .slice(0, 50)
    .map(u => `
      <tr>
        <td>${u.email}</td>
        <td><code style="font-size:0.8em;background:#f5f5f5;padding:2px 4px;border-radius:3px;">${u.id.slice(0, 12)}</code></td>
        <td>${new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
      </tr>
    `)
    .join('');
  document.getElementById('usersLoading').hidden = true;
  document.getElementById('usersTable').hidden = false;
}

function displaySessions(sessions) {
  const tbody = document.getElementById('sessionsBody');
  const now = Date.now();
  tbody.innerHTML = sessions
    .slice(0, 50)
    .map(s => {
      const createdDate = new Date(s.createdAt);
      const expiresDate = new Date(s.expiresAt);
      const ageMs = now - createdDate.getTime();
      const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
      const ageDays = Math.floor(ageHours / 24);
      const ageStr = ageDays > 0 ? `${ageDays}j` : `${ageHours}h`;
      return `
        <tr>
          <td><code style="font-size:0.8em;background:#f5f5f5;padding:2px 4px;border-radius:3px;">${s.userId.slice(0, 12)}</code></td>
          <td>${createdDate.toLocaleString('fr-FR')}</td>
          <td>${expiresDate.toLocaleString('fr-FR')}</td>
          <td>${ageStr}</td>
        </tr>
      `;
    })
    .join('');
  document.getElementById('sessionsLoading').hidden = true;
  document.getElementById('sessionsTable').hidden = false;
}

function displayEvents(events) {
  const tbody = document.getElementById('eventsBody');
  tbody.innerHTML = events
    .slice(-50)
    .reverse()
    .map(e => `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td><code style="font-size:0.8em;background:#f5f5f5;padding:2px 4px;border-radius:3px;">${(e.clientId || '').slice(0, 12)}</code></td>
        <td>${new Date(e.receivedAt).toLocaleString('fr-FR')}</td>
        <td>${JSON.stringify(e.meta || {}).slice(0, 50)}${JSON.stringify(e.meta || {}).length > 50 ? '...' : ''}</td>
      </tr>
    `)
    .join('');
  document.getElementById('eventsLoading').hidden = true;
  document.getElementById('eventsTable').hidden = false;
}

function displayFeedback(items) {
  const tbody = document.getElementById('feedbackBody');
  tbody.innerHTML = items
    .slice(-50)
    .reverse()
    .map(f => `
      <tr>
        <td>${(f.message || '').slice(0, 80)}${(f.message || '').length > 80 ? '...' : ''}</td>
        <td>${f.contact || '-'}</td>
        <td>${new Date(f.timestamp).toLocaleString('fr-FR')}</td>
      </tr>
    `)
    .join('');
  document.getElementById('feedbackLoading').hidden = true;
  document.getElementById('feedbackTable').hidden = false;
}

function downloadEventsJson() {
  const key = getStoredAdminKey();
  if (!key) {
    alert('Cle admin manquante');
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/analytics/export');
  xhr.setRequestHeader('x-admin-key', key);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const data = xhr.response || {};
    const json = JSON.stringify(data.events || [], null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  xhr.onerror = () => alert('Erreur lors du telechargement');
  xhr.send();
}

window.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const exportButton = document.getElementById('exportEventsButton');
  const keyInput = document.getElementById('adminKey');

  loginButton?.addEventListener('click', handleLogin);
  logoutButton?.addEventListener('click', handleLogout);
  exportButton?.addEventListener('click', downloadEventsJson);

  if (getStoredAdminKey()) {
    showDashboard();
    loadAllData();
    setInterval(loadAllData, 30000);
  }

  keyInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });
});
