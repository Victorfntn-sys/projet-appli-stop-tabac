const locale = 'fr-FR';
const STORAGE_QUIT_DATE = 'stop-smoking-quitDate';
const STORAGE_CIGARETTES_PER_DAY = 'stop-smoking-cigarettesPerDay';
const STORAGE_PRICE_PER_PACK = 'stop-smoking-pricePerPack';
const STORAGE_CIGARETTES_PER_PACK = 'stop-smoking-cigarettesPerPack';
const STORAGE_GOAL_NAME = 'stop-smoking-goalName';
const STORAGE_GOAL_AMOUNT = 'stop-smoking-goalAmount';
const STORAGE_LAST_PACK_COUNT = 'stop-smoking-lastPackCount';
const STORAGE_TRACKING_STATE = 'stop-smoking-tracking-state';
const STORAGE_LAST_PAUSE_ENCOURAGEMENT = 'stop-smoking-last-pause-encouragement';
const STORAGE_NOTIFICATIONS_ENABLED = 'stop-smoking-notifications-enabled';
const STORAGE_CLIENT_ID = 'stop-smoking-clientId';
const cigarettesPerDay = document.getElementById('cigarettesPerDay');
const pricePerPack = document.getElementById('pricePerPack');
const cigarettesPerPack = document.getElementById('cigarettesPerPack');
const quitDate = document.getElementById('quitDate');
const calculateButton = document.getElementById('calculateButton');
const pauseToggleButton = document.getElementById('pauseToggleButton');
const trackingStatus = document.getElementById('trackingStatus');
const installAppButton = document.getElementById('installAppButton');
const moneySaved = document.getElementById('moneySaved');
const cigarettesSaved = document.getElementById('cigarettesSaved');
const milestoneText = document.getElementById('milestoneText');
const goalNameInput = document.getElementById('goalName');
const goalAmountInput = document.getElementById('goalAmount');
const goalNameText = document.getElementById('goalNameText');
const goalProgressText = document.getElementById('goalProgressText');
const goalTimeText = document.getElementById('goalTimeText');
const goalProgressBar = document.getElementById('goalProgressBar');
const openBadgesModalButton = document.getElementById('openBadgesModalButton');
const badgesModal = document.getElementById('badgesModal');
const badgesModalClose = document.getElementById('badgesModalClose');
const badgesList = document.getElementById('badgesList');
const badgeModal = document.getElementById('badgeModal');
const badgeModalTitle = document.getElementById('badgeModalTitle');
const badgeModalStatus = document.getElementById('badgeModalStatus');
const badgeModalDescription = document.getElementById('badgeModalDescription');
const badgeModalIcon = document.getElementById('badgeModalIcon');
const badgeModalClose = document.getElementById('badgeModalClose');
const updateModal = document.getElementById('updateModal');
const updateReloadButton = document.getElementById('updateReloadButton');
const updateLaterButton = document.getElementById('updateLaterButton');
const notificationToggle = document.getElementById('notificationToggle');
const notificationStatus = document.getElementById('notificationStatus');
const resultCard = document.querySelector('.result-card');
const savingsProjection = document.getElementById('savingsProjection');
const appLoadingScreen = document.getElementById('appLoadingScreen');
const appLoadingProgress = document.getElementById('appLoadingProgress');
const appLoadingLabel = document.getElementById('appLoadingLabel');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackContact = document.getElementById('feedbackContact');
const feedbackStatus = document.getElementById('feedbackStatus');
const downloadUserCsvButton = document.getElementById('downloadUserCsvButton');
const downloadUserCsvStatus = document.getElementById('downloadUserCsvStatus');
let lastPackCount = 0;
let pauseReminderIntervalId = null;
let pushStateSyncIntervalId = null;
let serviceWorkerUpdateIntervalId = null;
let serviceWorkerRegistration = null;
let waitingServiceWorker = null;
let deferredInstallPrompt = null;
let pushSubscriptionEndpoint = '';
let notificationsEnabled = false;
let userExcelSyncTimeoutId = null;
let lastUserExcelPayloadKey = '';
const PUSH_STATE_SYNC_INTERVAL_MS = 5 * 60 * 1000;
const SERVICE_WORKER_UPDATE_CHECK_INTERVAL_MS = 60 * 1000;
let trackingState = {
  isPaused: false,
  pauseStartedAt: null,
  pausedDaysTotal: 0,
};

const pauseEncouragementMessages = [
  'Chaque jour sans cigarette est une victoire. Tu en es capable.',
  'Respire, garde le cap : ton corps te remercie deja.',
  'Une envie passe en quelques minutes. Tiens bon, tu avances.',
  'Rappelle-toi pourquoi tu as commence. Aujourd\'hui compte vraiment.',
  'Tu construis une meilleure version de toi, un jour apres l\'autre.',
];

const healthMilestones = [
  { days: 0, message: 'Chaque heure compte. Votre corps commence déjà à réparer.' },
  { days: 1, message: '24 h : Le sang est mieux oxygéné. Vous êtes déjà sur la bonne pente.' },
  { days: 2, message: '2-3 jours : Goût et odorat reviennent. Les plaisirs du quotidien changent.' },
  { days: 3, message: '72 h : Respirer devient un peu plus facile. Continuez comme ça.' },
  { days: 7, message: '1 semaine : La circulation s\'améliore. Vous gagnez en énergie.' },
  { days: 14, message: '2 semaines : Les poumons repartent. Votre souffle progresse.' },
  { days: 30, message: '1 mois : Votre récupération est meilleure. Le cap est solide.' },
  { days: 60, message: '2 mois : Moins de fatigue, plus d\'endurance. Vous voyez la différence.' },
  { days: 90, message: '3 mois : Toux et essoufflement diminuent nettement. Bravo.' },
  { days: 120, message: '4 mois : Les voies respiratoires s\'apaisent. Le rythme devient naturel.' },
  { days: 180, message: '6 mois : Votre immunité se renforce. Votre base santé est plus forte.' },
  { days: 270, message: '9 mois : Les poumons se nettoient mieux. Votre progression est remarquable.' },
  { days: 365, message: '1 an : Le risque cardiaque est déjà fortement réduit. Immense victoire.' },
  { days: 730, message: '2 ans : Le risque d\'infarctus continue de baisser. Vous protégez votre futur.' },
  { days: 1825, message: '5 ans : Le risque de cancer du poumon recule nettement. Continuez.' },
  { days: 3650, message: '10 ans : Le risque de cancers ORL diminue à son tour. Cap maintenu.' },
  { days: 5475, message: '15 ans : Le risque cardiovasculaire se rapproche d\'un non-fumeur. Exceptionnel.' },
];

const badgeDefinitions = [
  { id: 'jour-1', title: '1 jour', description: 'Vous avez commencé votre arrêt du tabac.', emblem: '1', finish: 'bronze', condition: ({ days }) => days >= 1 },
  { id: 'jour-3', title: '3 jours', description: 'Trois jours sans tabac, excellent départ.', emblem: '3', finish: 'bronze', condition: ({ days }) => days >= 3 },
  { id: 'jour-7', title: '7 jours', description: 'Une semaine complète sans tabac.', emblem: '7', finish: 'steel', condition: ({ days }) => days >= 7 },
  { id: 'jour-14', title: '14 jours', description: 'Deux semaines de constance.', emblem: '14', finish: 'steel', condition: ({ days }) => days >= 14 },
  { id: 'jour-30', title: '1 mois', description: 'Vous avez tenu 30 jours.', emblem: '30', finish: 'gold', condition: ({ days }) => days >= 30 },
  { id: 'jour-90', title: '3 mois', description: 'Cap des 90 jours atteint.', emblem: '90', finish: 'gold', condition: ({ days }) => days >= 90 },
  { id: 'jour-180', title: '6 mois', description: 'Six mois de progression continue.', emblem: '180', finish: 'royal', condition: ({ days }) => days >= 180 },
  { id: 'jour-365', title: '1 an', description: 'Une année complète sans tabac.', emblem: '365', finish: 'royal', condition: ({ days }) => days >= 365 },

  { id: 'euro-50', title: '50 €', description: 'Premières économies visibles.', emblem: '50', finish: 'bronze', condition: ({ savedMoney }) => savedMoney >= 50 },
  { id: 'euro-100', title: '100 €', description: 'Première grosse économie réalisée.', emblem: '100', finish: 'bronze', condition: ({ savedMoney }) => savedMoney >= 100 },
  { id: 'euro-250', title: '250 €', description: 'Un vrai palier financier atteint.', emblem: '250', finish: 'steel', condition: ({ savedMoney }) => savedMoney >= 250 },
  { id: 'euro-500', title: '500 €', description: 'Un demi-millier économisé.', emblem: '500', finish: 'gold', condition: ({ savedMoney }) => savedMoney >= 500 },
  { id: 'euro-1000', title: '1000 €', description: 'Le cap des 1000 € est franchi.', emblem: '1000', finish: 'royal', condition: ({ savedMoney }) => savedMoney >= 1000 },

  { id: 'objectif-50', title: 'Objectif 50 %', description: 'Vous avez atteint la moitié de votre objectif.', emblem: '50%', finish: 'steel', condition: ({ savedMoney, goalTarget }) => goalTarget > 0 && savedMoney >= goalTarget * 0.5 },
  { id: 'objectif-100', title: 'Objectif atteint', description: 'Votre objectif est atteint.', emblem: '100%', finish: 'royal', condition: ({ savedMoney, goalTarget }) => goalTarget > 0 && savedMoney >= goalTarget }
];

function getStoredQuitDate() {
  try {
    return localStorage.getItem(STORAGE_QUIT_DATE);
  } catch {
    return null;
  }
}

function saveQuitDate(value) {
  try {
    localStorage.setItem(STORAGE_QUIT_DATE, value);
  } catch {
    // ignore storage errors
  }
}

function getStoredFieldValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveFieldValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors
  }
}

function getOrCreateClientId() {
  try {
    const existing = localStorage.getItem(STORAGE_CLIENT_ID);
    if (existing) {
      return existing;
    }
    const nextId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_CLIENT_ID, nextId);
    return nextId;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

const clientId = getOrCreateClientId();

function getStoredLastPackCount() {
  try {
    return Number(localStorage.getItem(STORAGE_LAST_PACK_COUNT)) || 0;
  } catch {
    return 0;
  }
}

function saveLastPackCount(value) {
  try {
    localStorage.setItem(STORAGE_LAST_PACK_COUNT, String(value));
  } catch {
    // ignore storage errors
  }
}

function getStoredTrackingState() {
  try {
    const raw = localStorage.getItem(STORAGE_TRACKING_STATE);
    if (!raw) return { ...trackingState };
    const parsed = JSON.parse(raw);
    return {
      isPaused: Boolean(parsed.isPaused),
      pauseStartedAt: parsed.pauseStartedAt || null,
      pausedDaysTotal: Number(parsed.pausedDaysTotal) || 0,
    };
  } catch {
    return { ...trackingState };
  }
}

function saveTrackingState() {
  try {
    localStorage.setItem(STORAGE_TRACKING_STATE, JSON.stringify(trackingState));
  } catch {
    // ignore storage errors
  }
}

function getTodayIso() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
}

function getStoredLastPauseEncouragement() {
  try {
    return localStorage.getItem(STORAGE_LAST_PAUSE_ENCOURAGEMENT) || '';
  } catch {
    return '';
  }
}

function saveLastPauseEncouragement(value) {
  try {
    localStorage.setItem(STORAGE_LAST_PAUSE_ENCOURAGEMENT, value);
  } catch {
    // ignore storage errors
  }
}

function getStoredNotificationsEnabled() {
  try {
    const storedValue = localStorage.getItem(STORAGE_NOTIFICATIONS_ENABLED);
    if (storedValue === null) {
      return 'Notification' in window && Notification.permission === 'granted';
    }
    return storedValue === 'true';
  } catch {
    return 'Notification' in window && Notification.permission === 'granted';
  }
}

function saveNotificationsEnabled(value) {
  try {
    localStorage.setItem(STORAGE_NOTIFICATIONS_ENABLED, String(value));
  } catch {
    // ignore storage errors
  }
}

function getPauseEncouragementMessage(dateIso) {
  const hash = Array.from(dateIso).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return pauseEncouragementMessages[hash % pauseEncouragementMessages.length];
}

function setFeedbackStatus(message, type = '') {
  if (!feedbackStatus) return;
  feedbackStatus.textContent = message;
  feedbackStatus.classList.remove('success', 'error');
  if (type) {
    feedbackStatus.classList.add(type);
  }
}

function setDownloadCsvStatus(message, type = '') {
  if (!downloadUserCsvStatus) return;
  downloadUserCsvStatus.textContent = message;
  downloadUserCsvStatus.classList.remove('success', 'error');
  if (type) {
    downloadUserCsvStatus.classList.add(type);
  }
}

async function handleDownloadUserCsv() {
  if (!downloadUserCsvButton) return;

  downloadUserCsvButton.classList.add('is-loading');
  downloadUserCsvButton.disabled = true;
  setDownloadCsvStatus('Préparation du fichier...');

  try {
    const response = await fetch('/api/user-state/export');
    if (!response.ok) {
      throw new Error('csv-download-failed');
    }

    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'user-states.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileUrl);

    setDownloadCsvStatus('Téléchargement lancé. Ouvrez le fichier avec Excel.', 'success');
  } catch {
    setDownloadCsvStatus('Impossible de télécharger le fichier pour le moment.', 'error');
  } finally {
    downloadUserCsvButton.classList.remove('is-loading');
    downloadUserCsvButton.disabled = false;
  }
}

async function handleFeedbackSubmit(event) {
  event.preventDefault();
  if (!feedbackForm || !feedbackMessage) return;

  const message = feedbackMessage.value.trim();
  const contact = feedbackContact?.value.trim() || '';

  if (!message) {
    setFeedbackStatus('Ajoutez votre idée avant l\'envoi.', 'error');
    feedbackMessage.focus();
    return;
  }

  setFeedbackStatus('Envoi en cours...');

  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, contact }),
    });

    if (!response.ok) {
      throw new Error('feedback-failed');
    }

    setFeedbackStatus('Merci ! Votre idée a bien été envoyée.', 'success');
    feedbackMessage.value = '';
    if (feedbackContact) {
      feedbackContact.value = '';
    }
  } catch {
    setFeedbackStatus('Impossible d\'envoyer pour le moment. Réessayez dans un instant.', 'error');
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function getCurrentUserState() {
  return {
    clientId,
    cigsPerDay: Number(cigarettesPerDay.value) || 0,
    pricePerPack: parseFrenchNumber(pricePerPack.value),
    cigsPerPack: Number(cigarettesPerPack.value) || 1,
    quitDate: quitDate.value,
    goalName: goalNameInput.value || '',
    goalAmount: parseFrenchNumber(goalAmountInput.value),
    isPaused: trackingState.isPaused,
    pauseStartedAt: trackingState.pauseStartedAt,
    pausedDaysTotal: trackingState.pausedDaysTotal,
  };
}

async function fetchPushPublicKey() {
  const response = await fetch('/api/push/public-key');
  if (!response.ok) {
    throw new Error('public-key-unavailable');
  }
  const data = await response.json();
  return data.publicKey;
}

async function subscribeToPushNotifications() {
  if (!notificationsEnabled || !serviceWorkerRegistration || Notification.permission !== 'granted') {
    return null;
  }
  try {
    let subscription = await serviceWorkerRegistration.pushManager.getSubscription();
    if (!subscription) {
      const publicKey = await fetchPushPublicKey();
      subscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }
    pushSubscriptionEndpoint = subscription.endpoint;
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        userState: getCurrentUserState(),
        lastPausePushAt: getStoredLastPauseEncouragement(),
        lastNotifiedPackCount: lastPackCount,
      }),
    });
    return subscription;
  } catch (error) {
    console.warn('Abonnement push indisponible', error);
    return null;
  }
}

async function syncPushState() {
  if (!notificationsEnabled || !pushSubscriptionEndpoint || Notification.permission !== 'granted') {
    return;
  }
  try {
    await fetch('/api/push/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: pushSubscriptionEndpoint, userState: getCurrentUserState() }),
    });
  } catch (error) {
    console.warn('Synchronisation push impossible', error);
  }
}

function queueUserStateExcelSync(metrics) {
  const payload = {
    ...getCurrentUserState(),
    daysWithoutSmoking: Number(metrics.daysWithoutSmoking) || 0,
    savedMoney: Number(metrics.savedMoney) || 0,
    savedCigarettes: Number(metrics.savedCigarettes) || 0,
    dailyCost: Number(metrics.dailyCost) || 0,
  };

  const payloadKey = JSON.stringify(payload);
  if (payloadKey === lastUserExcelPayloadKey) {
    return;
  }

  if (userExcelSyncTimeoutId) {
    clearTimeout(userExcelSyncTimeoutId);
  }

  userExcelSyncTimeoutId = window.setTimeout(async () => {
    try {
      await fetch('/api/user-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      lastUserExcelPayloadKey = payloadKey;
    } catch (error) {
      console.warn('Export Excel impossible', error);
    }
  }, 700);
}

async function unsubscribeFromPushNotifications() {
  if (!serviceWorkerRegistration) {
    return;
  }
  try {
    const subscription = await serviceWorkerRegistration.pushManager.getSubscription();
    if (!subscription) {
      return;
    }
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    pushSubscriptionEndpoint = '';
    await subscription.unsubscribe();
  } catch (error) {
    console.warn('Desabonnement push impossible', error);
  }
}

function maybeSendPauseEncouragement() {
  if (!notificationsEnabled) {
    return;
  }
  if (!trackingState.isPaused) {
    return;
  }
  if (pushSubscriptionEndpoint) {
    return;
  }
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  const todayIso = getTodayIso();
  const lastSentDate = getStoredLastPauseEncouragement();
  if (lastSentDate === todayIso) {
    return;
  }
  const message = getPauseEncouragementMessage(todayIso);
  sendNotification(`Encouragement du jour : ${message}`);
  saveLastPauseEncouragement(todayIso);
}

function startPauseReminderScheduler() {
  if (pauseReminderIntervalId) {
    clearInterval(pauseReminderIntervalId);
  }
  pauseReminderIntervalId = window.setInterval(maybeSendPauseEncouragement, 60 * 1000);
}

function startPushStateSyncScheduler() {
  if (pushStateSyncIntervalId) {
    clearInterval(pushStateSyncIntervalId);
  }
  pushStateSyncIntervalId = window.setInterval(() => {
    if (document.hidden || !navigator.onLine) {
      return;
    }
    syncPushState();
  }, PUSH_STATE_SYNC_INTERVAL_MS);
}

function formatDateHuman(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getPausedDaysToday(today) {
  if (!trackingState.isPaused || !trackingState.pauseStartedAt) return 0;
  const pauseStart = new Date(trackingState.pauseStartedAt);
  if (!Number.isFinite(pauseStart.getTime())) return 0;
  pauseStart.setHours(0, 0, 0, 0);
  const diffMs = today - pauseStart;
  return diffMs >= 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0;
}

function getTrackingStatusText(today) {
  if (trackingState.isPaused && trackingState.pauseStartedAt) {
    return `Suivi en pause depuis le ${formatDateHuman(trackingState.pauseStartedAt)}.`;
  }
  return 'Suivi actif.';
}

function refreshTrackingUI(today = new Date()) {
  if (pauseToggleButton) {
    pauseToggleButton.textContent = trackingState.isPaused ? 'Reprendre le suivi' : 'Mettre en pause';
  }
  if (trackingStatus) {
    trackingStatus.textContent = getTrackingStatusText(today);
  }
}

function togglePauseTracking() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!trackingState.isPaused) {
    trackingState.isPaused = true;
    trackingState.pauseStartedAt = today.toISOString().split('T')[0];
    maybeSendPauseEncouragement();
  } else {
    trackingState.pausedDaysTotal += getPausedDaysToday(today);
    trackingState.isPaused = false;
    trackingState.pauseStartedAt = null;
  }
  saveTrackingState();
  refreshTrackingUI(today);
  calculateSavings();
  syncPushState();
}

function formatCurrency(value) {
  return value.toLocaleString(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseFrenchNumber(value) {
  const normalized = String(value).trim().replace(/\s+/g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function getHealthMilestone(days) {
  for (let i = healthMilestones.length - 1; i >= 0; i--) {
    if (days >= healthMilestones[i].days) {
      return healthMilestones[i].message;
    }
  }
  return healthMilestones[0].message;
}

function getGoalTimeText(remainingMoney, dailyCost) {
  if (dailyCost <= 0) {
    return 'Calculez avec un prix et une consommation valides.';
  }
  const daysLeft = Math.ceil(remainingMoney / dailyCost);
  if (daysLeft <= 0) {
    return 'Objectif atteint !';
  }

  // Approximation calendar: 1 an = 365 jours, 1 mois = 30 jours.
  let remainingDays = daysLeft;
  const years = Math.floor(remainingDays / 365);
  remainingDays %= 365;
  const months = Math.floor(remainingDays / 30);
  remainingDays %= 30;
  const weeks = Math.floor(remainingDays / 7);
  const days = remainingDays % 7;

  const parts = [];
  if (years > 0) {
    parts.push(`${years} an${years > 1 ? 's' : ''}`);
  }
  if (months > 0) {
    parts.push(`${months} mois`);
  }
  if (weeks > 0) {
    parts.push(`${weeks} semaine${weeks > 1 ? 's' : ''}`);
  }
  if (days > 0) {
    parts.push(`${days} jour${days > 1 ? 's' : ''}`);
  }

  return parts.length ? parts.join(' ') : 'Moins d\'un jour';
}

function updateGoalDisplay(savedMoney, dailyCost) {
  const goalName = goalNameInput.value.trim() || 'Objectif personnel';
  const goalTarget = parseFrenchNumber(goalAmountInput.value);
  const percent = goalTarget > 0 ? Math.min(100, Math.round((savedMoney / goalTarget) * 100)) : 0;

  goalNameText.textContent = goalTarget > 0 ? goalName : 'Aucun objectif défini.';
  goalProgressText.textContent = goalTarget > 0 ? `${percent} %` : '0 %';
  goalProgressBar.style.width = `${percent}%`;

  if (goalTarget <= 0) {
    goalTimeText.textContent = 'Définissez un montant cible pour voir le temps restant.';
  } else if (savedMoney >= goalTarget) {
    goalTimeText.textContent = 'Objectif atteint !';
  } else {
    goalTimeText.textContent = getGoalTimeText(goalTarget - savedMoney, dailyCost);
  }
}

function updateBadges(days, savedMoney, goalTarget) {
  if (!badgesList) return;
  const badges = badgeDefinitions.map(badge => {
    const earned = badge.condition({ days, savedMoney, goalTarget });
    return { ...badge, earned };
  });

  badgesList.innerHTML = badges.map(badge => `
    <div class="badge-item ${badge.earned ? 'earned' : 'locked'}" data-badge-id="${badge.id}" data-badge-emblem="${badge.emblem}" data-badge-finish="${badge.finish}" tabindex="0" role="button" aria-label="${badge.title} - ${badge.earned ? 'Gagné' : 'À débloquer'}">
      <div class="badge-icon badge-finish-${badge.finish}">
        <span class="badge-icon-emblem ${badge.emblem.length >= 4 ? 'is-xwide' : badge.emblem.length >= 3 ? 'is-wide' : ''}">${badge.earned ? badge.emblem : '•'}</span>
      </div>
      <div class="badge-info">
        <strong class="badge-title">${badge.title}</strong>
        <span class="badge-status ${badge.earned ? 'badge-status-earned' : 'badge-status-locked'}">${badge.earned ? 'Gagné' : 'À débloquer'}</span>
        <div class="badge-description">${badge.description}</div>
      </div>
    </div>
  `).join('');
}

function openBadgeModal(title, status, description, emoji) {
  if (!badgeModal) return;
  badgeModalTitle.textContent = title;
  badgeModalStatus.textContent = status;
  badgeModalDescription.textContent = description;
  badgeModalIcon.textContent = emoji;
  badgeModal.classList.add('open');
  badgeModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  badgeModalClose?.focus();
}

function closeBadgeModal() {
  if (!badgeModal) return;
  badgeModal.classList.remove('open');
  badgeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openBadgesModal() {
  if (!badgesModal) return;
  badgesModal.classList.add('open');
  badgesModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  badgesModalClose?.focus();
}

function closeBadgesModal() {
  if (!badgesModal) return;
  badgesModal.classList.remove('open');
  badgesModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function activateTab(targetId, options = {}) {
  const { scrollToPanel = false } = options;
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === targetId);
  });

  if (scrollToPanel && resultCard) {
    window.requestAnimationFrame(() => {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function updateAppLoading(progress, label) {
  if (appLoadingProgress) {
    const safeProgress = Math.max(0, Math.min(100, progress));
    appLoadingProgress.style.width = `${safeProgress}%`;
  }
  if (appLoadingLabel && label) {
    appLoadingLabel.textContent = label;
  }
}

async function hideAppLoadingScreen() {
  if (!appLoadingScreen) {
    return;
  }
  appLoadingScreen.classList.add('is-hidden');
  await wait(240);
  appLoadingScreen.remove();
}

function createSavingsProjection(days, dailyCost, savedMoney) {
  if (!savingsProjection) return;

  const daysDone = Math.max(0, days);
  const cigsPerDay = Number(cigarettesPerDay?.value) || 0;

  // Motivational messages based on streak length
  const messages = [
    [0,   'Lance-toi, tu peux le faire !'],
    [1,   'Premier jour — bravo ! 💪'],
    [3,   'Tu tiens déjà 3 jours !'],
    [7,   'Une semaine entière ! 🙌'],
    [14,  'Deux semaines — tu es en feu !'],
    [30,  'Un mois sans tabac — incroyable ! 🏆'],
    [90,  'Trois mois ! Tes poumons te remercient.'],
    [180, 'Six mois — tu es une inspiration !'],
    [365, '🎉 Un an sans tabac. Tu es un héros !'],
  ];
  const msg = [...messages].reverse().find(([d]) => daysDone >= d)?.[1] || messages[0][1];

  // Next milestone
  const milestones = [7, 30, 90, 180, 365];
  const nextMilestone = milestones.find(m => m > daysDone);

  savingsProjection.innerHTML = `
    <div class="chain-header">
      <span class="chain-flame">${daysDone >= 7 ? '🔥' : '✨'}</span>
      <span class="chain-count">${daysDone}</span>
      <span class="chain-subtitle">jour${daysDone > 1 ? 's' : ''} sans tabac</span>
      <span class="chain-message">${msg}</span>
    </div>
    <div class="chain-stats">
      <div class="chain-stat">
        <span class="chain-stat-icon">🎯</span>
        <span class="chain-stat-value">${nextMilestone ? nextMilestone - daysDone + 'j' : '🏆'}</span>
        <span class="chain-stat-label">${nextMilestone ? 'avant ' + (nextMilestone >= 365 ? '1 an' : nextMilestone >= 180 ? '6 mois' : nextMilestone >= 90 ? '3 mois' : nextMilestone >= 30 ? '1 mois' : '1 sem.') : 'tous atteints'}</span>
      </div>
    </div>`;
}

function calculateSavings() {
  const cigsPerDay = Number(cigarettesPerDay.value) || 0;
  const price = parseFrenchNumber(pricePerPack.value);
  const cigsPerPack = Number(cigarettesPerPack.value) || 1;
  const selectedDate = new Date(quitDate.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = Number.isFinite(selectedDate.getTime()) ? selectedDate : today;
  const diffMs = today - startDate;
  const elapsedDays = diffMs >= 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0;
  const pausedDays = trackingState.pausedDaysTotal + getPausedDaysToday(today);
  const days = Math.max(0, elapsedDays - pausedDays);

  const dailyCost = cigsPerPack > 0 ? (price / cigsPerPack) * cigsPerDay : 0;
  const savedMoney = dailyCost * days;
  const savedCigarettes = cigsPerDay * days;
  const goalTarget = parseFrenchNumber(goalAmountInput.value);

  moneySaved.textContent = formatCurrency(savedMoney);
  cigarettesSaved.textContent = savedCigarettes.toLocaleString(locale);

  milestoneText.textContent = getHealthMilestone(days);
  updateGoalDisplay(savedMoney, dailyCost);
  updateBadges(days, savedMoney, goalTarget);
  createSavingsProjection(days, dailyCost, savedMoney);
  syncPushState();
  queueUserStateExcelSync({
    daysWithoutSmoking: days,
    savedMoney,
    savedCigarettes,
    dailyCost,
  });

  const packsSaved = cigsPerPack > 0 ? Math.floor(savedCigarettes / cigsPerPack) : 0;
  const newPacks = packsSaved - lastPackCount;
  if (newPacks > 0) {
    if (!pushSubscriptionEndpoint) {
      const amountToSave = price * newPacks;
      sendNotification(`Bravo ! Vous avez économisé ${newPacks} paquet${newPacks > 1 ? 's' : ''} de plus. Pensez à mettre de côté ${formatCurrency(amountToSave)}.`);
    }
    lastPackCount = packsSaved;
    saveLastPackCount(lastPackCount);
  } else if (packsSaved < lastPackCount) {
    lastPackCount = packsSaved;
    saveLastPackCount(lastPackCount);
  }
}

async function handleCalculateButtonClick() {
  if (!calculateButton) {
    calculateSavings();
    activateTab('detailsTab', { scrollToPanel: true });
    return;
  }

  const originalLabel = calculateButton.textContent;
  calculateButton.classList.add('is-loading');
  calculateButton.disabled = true;
  calculateButton.textContent = 'Calcul en cours...';

  await wait(650);

  calculateSavings();
  activateTab('detailsTab', { scrollToPanel: true });

  calculateButton.classList.remove('is-loading');
  calculateButton.disabled = false;
  calculateButton.textContent = originalLabel;
}

function updateNotificationStatus(permission) {
  const setNotificationMessage = message => {
    if (notificationStatus) {
      notificationStatus.textContent = message;
    }
  };

  if (!('Notification' in window)) {
    setNotificationMessage('Notifications non supportées.');
    notificationToggle.checked = false;
    notificationToggle.disabled = true;
    return;
  }
  if (!notificationsEnabled) {
    setNotificationMessage(permission === 'denied'
      ? 'Refusées par le navigateur et désactivées dans l’application.'
      : 'Notifications désactivées dans l’application.');
    notificationToggle.checked = false;
    notificationToggle.disabled = false;
    return;
  }
  if (permission === 'granted') {
    setNotificationMessage('Notifications actives, y compris via le service worker si le push est configuré.');
    notificationToggle.checked = true;
    notificationToggle.disabled = false;
  } else if (permission === 'denied') {
    setNotificationMessage('Refusées. Autorisez les notifications dans le navigateur.');
    notificationToggle.checked = false;
    notificationToggle.disabled = false;
  } else {
    setNotificationMessage('En attente de permission.');
    notificationToggle.checked = false;
    notificationToggle.disabled = false;
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    updateNotificationStatus('unsupported');
    return;
  }
  if (!notificationsEnabled) {
    updateNotificationStatus(Notification.permission);
    return;
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        notificationsEnabled = false;
        saveNotificationsEnabled(false);
      }
      updateNotificationStatus(permission);
      if (permission === 'granted') {
        subscribeToPushNotifications().then(syncPushState);
      }
    });
  } else {
    updateNotificationStatus(Notification.permission);
    if (Notification.permission === 'granted') {
      subscribeToPushNotifications().then(syncPushState);
    }
  }
}

function openUpdateModal(worker) {
  waitingServiceWorker = worker;
  if (!updateModal) {
    return;
  }
  updateModal.classList.add('open');
  updateModal.setAttribute('aria-hidden', 'false');
}

function closeUpdateModal() {
  waitingServiceWorker = null;
  if (!updateModal) {
    return;
  }
  updateModal.classList.remove('open');
  updateModal.setAttribute('aria-hidden', 'true');
}

function watchInstallingWorker(worker) {
  if (!worker) {
    return;
  }
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
      const nextWorker = serviceWorkerRegistration?.waiting || worker;
      openUpdateModal(nextWorker);
    }
  });
}

function startServiceWorkerUpdateScheduler() {
  if (!serviceWorkerRegistration) {
    return;
  }
  if (serviceWorkerUpdateIntervalId) {
    clearInterval(serviceWorkerUpdateIntervalId);
  }
  serviceWorkerUpdateIntervalId = window.setInterval(() => {
    if (document.hidden || !navigator.onLine) {
      return;
    }
    serviceWorkerRegistration.update().catch(() => undefined);
  }, SERVICE_WORKER_UPDATE_CHECK_INTERVAL_MS);
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  try {
    serviceWorkerRegistration = await navigator.serviceWorker.register('./sw.js');
    if (serviceWorkerRegistration.waiting) {
      openUpdateModal(serviceWorkerRegistration.waiting);
    }
    serviceWorkerRegistration.addEventListener('updatefound', () => {
      watchInstallingWorker(serviceWorkerRegistration.installing);
    });
    serviceWorkerRegistration.update().catch(() => undefined);
    startServiceWorkerUpdateScheduler();
    return serviceWorkerRegistration;
  } catch (error) {
    console.warn('Service worker non enregistre', error);
    return null;
  }
}

notificationToggle.addEventListener('change', () => {
  if (notificationToggle.checked) {
    notificationsEnabled = true;
    saveNotificationsEnabled(true);
    requestNotificationPermission();
    subscribeToPushNotifications().then(syncPushState);
    maybeSendPauseEncouragement();
  } else {
    notificationsEnabled = false;
    saveNotificationsEnabled(false);
    updateNotificationStatus(Notification.permission);
    unsubscribeFromPushNotifications();
  }
});

async function sendNotification(message) {
  if (!notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  try {
    if (serviceWorkerRegistration) {
      await serviceWorkerRegistration.showNotification('Calculateur d\'economies', {
        body: message,
        tag: 'stop-smoking-app',
        renotify: true,
        badge: './icon-192.svg',
        icon: './icon-512.svg',
      });
      return;
    }
    new Notification(message);
  } catch (error) {
    console.warn('Notification non envoyée', error);
  }
}

pricePerPack.addEventListener('input', () => {
  const value = pricePerPack.value.replace(/[^0-9,]/g, '');
  pricePerPack.value = value;
  saveFieldValue(STORAGE_PRICE_PER_PACK, value);
  calculateSavings();
});

goalNameInput.addEventListener('input', () => {
  saveFieldValue(STORAGE_GOAL_NAME, goalNameInput.value);
  calculateSavings();
});

goalAmountInput.addEventListener('input', () => {
  const value = goalAmountInput.value.replace(/[^0-9,]/g, '');
  goalAmountInput.value = value;
  saveFieldValue(STORAGE_GOAL_AMOUNT, value);
  calculateSavings();
});

cigarettesPerDay.addEventListener('input', () => {
  saveFieldValue(STORAGE_CIGARETTES_PER_DAY, cigarettesPerDay.value);
  calculateSavings();
});

cigarettesPerPack.addEventListener('input', () => {
  saveFieldValue(STORAGE_CIGARETTES_PER_PACK, cigarettesPerPack.value);
  calculateSavings();
});
calculateButton.addEventListener('click', handleCalculateButtonClick);
pauseToggleButton.addEventListener('click', togglePauseTracking);
feedbackForm?.addEventListener('submit', handleFeedbackSubmit);
downloadUserCsvButton?.addEventListener('click', handleDownloadUserCsv);

window.addEventListener('DOMContentLoaded', async () => {
  const startedAt = performance.now();
  updateAppLoading(10, 'Initialisation de l\'application...');
  const today = new Date();
  const serviceWorkerReadyPromise = registerServiceWorker();
  updateAppLoading(28, 'Restauration de vos données...');
  notificationsEnabled = getStoredNotificationsEnabled();
  const storedDate = getStoredQuitDate();
  const storedCigarettesPerDay = getStoredFieldValue(STORAGE_CIGARETTES_PER_DAY);
  const storedPricePerPack = getStoredFieldValue(STORAGE_PRICE_PER_PACK);
  const storedCigarettesPerPack = getStoredFieldValue(STORAGE_CIGARETTES_PER_PACK);
  const storedGoalName = getStoredFieldValue(STORAGE_GOAL_NAME);
  const storedGoalAmount = getStoredFieldValue(STORAGE_GOAL_AMOUNT);

  if (storedCigarettesPerDay !== null) {
    cigarettesPerDay.value = storedCigarettesPerDay;
  }

  if (storedPricePerPack !== null) {
    pricePerPack.value = storedPricePerPack;
  }

  if (storedCigarettesPerPack !== null) {
    cigarettesPerPack.value = storedCigarettesPerPack;
  }

  if (storedGoalName !== null) {
    goalNameInput.value = storedGoalName;
  }

  if (storedGoalAmount !== null) {
    goalAmountInput.value = storedGoalAmount;
  }

  quitDate.value = storedDate || today.toISOString().split('T')[0];
  lastPackCount = getStoredLastPackCount();
  trackingState = getStoredTrackingState();
  updateAppLoading(54, 'Calcul de votre progression...');
  refreshTrackingUI(today);
  calculateSavings();
  updateNotificationStatus(Notification.permission);
  updateAppLoading(74, 'Configuration des notifications...');
  if (notificationsEnabled && Notification.permission === 'granted') {
    serviceWorkerReadyPromise
      .then(() => subscribeToPushNotifications())
      .then(() => syncPushState())
      .catch(() => undefined);
  } else if (!notificationsEnabled) {
    serviceWorkerReadyPromise
      .then(() => unsubscribeFromPushNotifications())
      .catch(() => undefined);
  }
  updateAppLoading(88, 'Finalisation de l\'interface...');
  startPushStateSyncScheduler();
  startPauseReminderScheduler();
  maybeSendPauseEncouragement();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      maybeSendPauseEncouragement();
      syncPushState();
      serviceWorkerRegistration?.update().catch(() => undefined);
    }
  });

  window.addEventListener('online', async () => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      await subscribeToPushNotifications();
      await syncPushState();
    }
    serviceWorkerRegistration?.update().catch(() => undefined);
  });

  badgesList.addEventListener('click', event => {
    const badgeItem = event.target.closest('.badge-item');
    if (!badgeItem) return;
    closeBadgesModal();
    const title = badgeItem.querySelector('.badge-title')?.textContent || '';
    const status = badgeItem.classList.contains('earned') ? 'Gagné' : 'À débloquer';
    const description = badgeItem.querySelector('.badge-description')?.textContent || '';
    const emoji = badgeItem.dataset.badgeEmblem || '✦';
    openBadgeModal(title, status, description, emoji);
  });

  badgesList.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      const badgeItem = event.target.closest('.badge-item');
      if (!badgeItem) return;
      event.preventDefault();
      closeBadgesModal();
      const title = badgeItem.querySelector('.badge-title')?.textContent || '';
      const status = badgeItem.classList.contains('earned') ? 'Gagné' : 'À débloquer';
      const description = badgeItem.querySelector('.badge-description')?.textContent || '';
      const emoji = badgeItem.dataset.badgeEmblem || '✦';
      openBadgeModal(title, status, description, emoji);
    }
  });

  openBadgesModalButton?.addEventListener('click', openBadgesModal);
  badgesModalClose?.addEventListener('click', closeBadgesModal);
  badgesModal?.addEventListener('click', event => {
    if (event.target === badgesModal) {
      closeBadgesModal();
    }
  });

  badgeModalClose.addEventListener('click', closeBadgeModal);
  badgeModal.addEventListener('click', event => {
    if (event.target === badgeModal) {
      closeBadgeModal();
    }
  });

  updateLaterButton?.addEventListener('click', closeUpdateModal);
  updateModal?.addEventListener('click', event => {
    if (event.target === updateModal) {
      closeUpdateModal();
    }
  });
  updateReloadButton?.addEventListener('click', () => {
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      return;
    }
    window.location.reload();
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && badgeModal.classList.contains('open')) {
      closeBadgeModal();
    }
    if (event.key === 'Escape' && badgesModal?.classList.contains('open')) {
      closeBadgesModal();
    }
    if (event.key === 'Escape' && updateModal?.classList.contains('open')) {
      closeUpdateModal();
    }
  });

  // Initialize Flatpickr for date input
  flatpickr(quitDate, {
    locale: 'fr',
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'd/m/Y',
    defaultDate: quitDate.value,
    maxDate: 'today',
    onChange: function(selectedDates, dateStr, instance) {
      saveQuitDate(dateStr);
      calculateSavings();
    }
  });

  updateAppLoading(100, 'Prêt');
  const elapsed = performance.now() - startedAt;
  const minimumVisibleMs = 700;
  if (elapsed < minimumVisibleMs) {
    await wait(minimumVisibleMs - elapsed);
  }
  await hideAppLoadingScreen();

});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installAppButton) {
    installAppButton.hidden = false;
  }
});

installAppButton?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) {
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installAppButton.hidden = true;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  if (installAppButton) {
    installAppButton.hidden = true;
  }
});
