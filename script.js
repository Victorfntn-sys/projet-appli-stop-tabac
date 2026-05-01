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
const STORAGE_IS_PREMIUM = 'stop-smoking-is-premium';
const STORAGE_APP_OPEN_COUNT = 'stop-smoking-app-open-count';
const STORAGE_LAST_LAUNCH_AD_AT = 'stop-smoking-last-launch-ad-at';
const STORAGE_ONBOARDING_DONE = 'stop-smoking-onboarding-done';
const STORAGE_CRAVING_SESSION_COUNT = 'stop-smoking-craving-session-count';
const STORAGE_NOTIFICATION_PREFS = 'stop-smoking-notification-preferences';
const STORAGE_ANALYTICS_EVENTS = 'stop-smoking-analytics-events';
const STORAGE_AUTH_TOKEN = 'stop-smoking-auth-token';
const STORAGE_ENTRY_CHOICE = 'stop-smoking-entry-choice';
const STORAGE_SAVINGS_POT = 'stop-smoking-savings-pot';
const STORAGE_METRICS_HISTORY = 'stop-smoking-metrics-history';
const STORAGE_RELAPSE_EVENTS = 'stop-smoking-relapse-events';
const STORAGE_CRAVING_PLAN = 'stop-smoking-craving-plan';
const STORAGE_WELLBEING_LOG = 'stop-smoking-wellbeing-log';
const STORAGE_LAST_ACCOUNT_SYNC_AT = 'stop-smoking-last-account-sync-at';
const cigarettesPerDay = document.getElementById('cigarettesPerDay');
const pricePerPack = document.getElementById('pricePerPack');
const cigarettesPerPack = document.getElementById('cigarettesPerPack');
const quitDate = document.getElementById('quitDate');
const calculateButton = document.getElementById('calculateButton');
const pauseToggleButton = document.getElementById('pauseToggleButton');
const relapseButton = document.getElementById('relapseButton');
const trackingStatus = document.getElementById('trackingStatus');
const relapseStatus = document.getElementById('relapseStatus');
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
const realSavingsAmount = document.getElementById('realSavingsAmount');
const savingsDepositAmount = document.getElementById('savingsDepositAmount');
const addSavingsDepositButton = document.getElementById('addSavingsDepositButton');
const savingsPotStatus = document.getElementById('savingsPotStatus');
const nextFinancialMilestone = document.getElementById('nextFinancialMilestone');
const financialMilestoneHint = document.getElementById('financialMilestoneHint');
const trendSavedMoney = document.getElementById('trendSavedMoney');
const trendCigarettes = document.getElementById('trendCigarettes');
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
const notificationFrequency = document.getElementById('notificationFrequency');
const notificationReminderTime = document.getElementById('notificationReminderTime');
const notificationQuietStart = document.getElementById('notificationQuietStart');
const notificationQuietEnd = document.getElementById('notificationQuietEnd');
const notificationTone = document.getElementById('notificationTone');
const notificationMode = document.getElementById('notificationMode');
const notificationWeeklyDay = document.getElementById('notificationWeeklyDay');
const resultCard = document.querySelector('.result-card');
const savingsProjection = document.getElementById('savingsProjection');
const appLoadingScreen = document.getElementById('appLoadingScreen');
const appLoadingProgress = document.getElementById('appLoadingProgress');
const appLoadingLabel = document.getElementById('appLoadingLabel');
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');
const feedbackContact = document.getElementById('feedbackContact');
const feedbackStatus = document.getElementById('feedbackStatus');
const launchAdModal = document.getElementById('launchAdModal');
const launchAdClose = document.getElementById('launchAdClose');
const launchAdCountdown = document.getElementById('launchAdCountdown');
const launchAdSlot = document.getElementById('launchAdSlot');
const onboardingModal = document.getElementById('onboardingModal');
const onboardingProgressLabel = document.getElementById('onboardingProgressLabel');
const onboardingProgressFill = document.getElementById('onboardingProgressFill');
const onboardingSkipButton = document.getElementById('onboardingSkipButton');
const onboardingBackButton = document.getElementById('onboardingBackButton');
const onboardingNextButton = document.getElementById('onboardingNextButton');
const onboardingNotificationOptIn = document.getElementById('onboardingNotificationOptIn');
const onboardingCigarettesPerDay = document.getElementById('onboardingCigarettesPerDay');
const onboardingPricePerPack = document.getElementById('onboardingPricePerPack');
const onboardingQuitDate = document.getElementById('onboardingQuitDate');
const onboardingGoalName = document.getElementById('onboardingGoalName');
const onboardingGoalAmount = document.getElementById('onboardingGoalAmount');
const onboardingNotificationFrequency = document.getElementById('onboardingNotificationFrequency');
const onboardingNotificationMode = document.getElementById('onboardingNotificationMode');
const onboardingSteps = Array.from(document.querySelectorAll('.onboarding-step'));
const firstLaunchModal = document.getElementById('firstLaunchModal');
const firstLaunchCreateAccountBtn = document.getElementById('firstLaunchCreateAccountBtn');
const firstLaunchGuestBtn = document.getElementById('firstLaunchGuestBtn');
const startCravingButton = document.getElementById('startCravingButton');
const cravingDoneButton = document.getElementById('cravingDoneButton');
const cravingTimer = document.getElementById('cravingTimer');
const cravingStatus = document.getElementById('cravingStatus');
const cravingTip = document.getElementById('cravingTip');
const cravingSessionCount = document.getElementById('cravingSessionCount');
const cravingAction1 = document.getElementById('cravingAction1');
const cravingAction2 = document.getElementById('cravingAction2');
const cravingAction3 = document.getElementById('cravingAction3');
const wellbeingEnergy = document.getElementById('wellbeingEnergy');
const wellbeingBreath = document.getElementById('wellbeingBreath');
const wellbeingSleep = document.getElementById('wellbeingSleep');
const saveWellbeingButton = document.getElementById('saveWellbeingButton');
const wellbeingStatus = document.getElementById('wellbeingStatus');
const accountSyncStatus = document.getElementById('accountSyncStatus');
const accountRestoreButton = document.getElementById('accountRestoreButton');
const ADMOB_APP_ID = 'ca-app-pub-4442230652158494~6410750898';
const ADMOB_UNIT_ID = 'ca-app-pub-4442230652158494/1158424217';
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
let launchAdAutoCloseTimeoutId = null;
let launchAdCountdownIntervalId = null;
let onboardingStepIndex = 0;
let cravingIntervalId = null;
let cravingSecondsLeft = 180;
let pendingStartupFlowAfterAccountModal = false;
let hasLaunchedStartupFlow = false;
const PUSH_STATE_SYNC_INTERVAL_MS = 5 * 60 * 1000;
const SERVICE_WORKER_UPDATE_CHECK_INTERVAL_MS = 60 * 1000;
const LAUNCH_AD_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const LAUNCH_AD_SHOW_EVERY_N_OPENS = 3;
const LAUNCH_AD_AUTO_CLOSE_SECONDS = 5;
const CRAVING_SESSION_DURATION_SECONDS = 180;
const MAX_ANALYTICS_EVENTS = 200;
const SAVINGS_NOTIFICATION_PACK_STEP = 3;
const METRICS_HISTORY_MAX_DAYS = 120;
const WELLBEING_HISTORY_MAX_ENTRIES = 52;
const ACCOUNT_SYNC_INTERVAL_MS = 3 * 60 * 1000;
let trackingState = {
  isPaused: false,
  pauseStartedAt: null,
  pausedDaysTotal: 0,
};

const pauseEncouragementMessagesByMode = {
  progress: [
    'Chaque jour sans cigarette est une victoire. Tu en es capable.',
    'Respire, garde le cap : ton corps te remercie deja.',
    'Une envie passe en quelques minutes. Tiens bon, tu avances.',
    'Rappelle-toi pourquoi tu as commence. Aujourd\'hui compte vraiment.',
    'Tu construis une meilleure version de toi, un jour apres l\'autre.',
  ],
  save: [
    'Un rappel suffit : garde le cap et mets l\'equivalent de tes cigarettes dans une enveloppe cette semaine.',
    'Chaque envie evitee peut devenir une petite somme mise de cote. Continue doucement, mais regulierement.',
    'Ton progres vaut plus qu\'un craquage. Garde ce montant pour ton objectif plutot que pour un paquet.',
    'Fais simple aujourd\'hui : pas de cigarette, et l\'argent economise reste pour toi.',
    'Une semaine apres l\'autre, ta reserve grimpe. Tiens bon et transforme l\'envie en economie.',
  ],
};

const cravingTips = [
  'Bois un verre d\'eau lentement puis respire 4 fois profondement.',
  'Marche 3 minutes, meme dans la piece. Le pic d\'envie baisse vite.',
  'Occupe tes mains: stylo, balle antistress, ou notes sur ton objectif.',
  'Repete: "Cette envie va passer". Attends simplement 180 secondes.',
  'Fais 10 respirations lentes: 4 secondes inspiration, 6 secondes expiration.',
];

const defaultNotificationPrefs = {
  frequency: 'weekly',
  reminderTime: '18:30',
  quietStart: '21:30',
  quietEnd: '08:00',
  tone: 'supportive',
  mode: 'save',
  weeklyDay: '5',
};

const legacyDefaultNotificationPrefs = {
  frequency: 'daily',
  reminderTime: '09:00',
  quietStart: '21:30',
  quietEnd: '08:00',
  tone: 'supportive',
  weeklyDay: '1',
};

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

function getStoredJson(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallbackValue;
    }
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function saveStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function clampScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.min(10, Math.round(numeric)));
}

function getCurrentIsoWeekKey(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getStoredSavingsPot() {
  const parsed = getStoredJson(STORAGE_SAVINGS_POT, null);
  if (!parsed || typeof parsed !== 'object') {
    return { total: 0, deposits: [] };
  }
  return {
    total: Number(parsed.total) || 0,
    deposits: Array.isArray(parsed.deposits) ? parsed.deposits.slice(-200) : [],
  };
}

function saveSavingsPot(pot) {
  saveStoredJson(STORAGE_SAVINGS_POT, {
    total: Number(pot?.total) || 0,
    deposits: Array.isArray(pot?.deposits) ? pot.deposits.slice(-200) : [],
  });
}

function getStoredMetricsHistory() {
  const parsed = getStoredJson(STORAGE_METRICS_HISTORY, []);
  return Array.isArray(parsed) ? parsed.slice(-METRICS_HISTORY_MAX_DAYS) : [];
}

function saveMetricsHistory(history) {
  saveStoredJson(STORAGE_METRICS_HISTORY, Array.isArray(history) ? history.slice(-METRICS_HISTORY_MAX_DAYS) : []);
}

function getStoredRelapseEvents() {
  const parsed = getStoredJson(STORAGE_RELAPSE_EVENTS, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return Array.from(new Set(parsed.filter(value => /^\d{4}-\d{2}-\d{2}$/.test(String(value))))).sort();
}

function saveRelapseEvents(events) {
  const normalized = Array.from(new Set((Array.isArray(events) ? events : [])
    .filter(value => /^\d{4}-\d{2}-\d{2}$/.test(String(value))))).sort();
  saveStoredJson(STORAGE_RELAPSE_EVENTS, normalized);
}

function getDefaultCravingPlan() {
  return [
    'Boire un verre d\'eau lentement',
    'Marcher 3 minutes',
    'Respirer 4 secondes / expirer 6 secondes',
  ];
}

function getStoredCravingPlan() {
  const parsed = getStoredJson(STORAGE_CRAVING_PLAN, getDefaultCravingPlan());
  if (!Array.isArray(parsed)) {
    return getDefaultCravingPlan();
  }
  const normalized = parsed.map(value => String(value || '').trim()).slice(0, 3);
  while (normalized.length < 3) {
    normalized.push('');
  }
  return normalized;
}

function saveCravingPlan(plan) {
  const normalized = (Array.isArray(plan) ? plan : []).map(value => String(value || '').trim()).slice(0, 3);
  while (normalized.length < 3) {
    normalized.push('');
  }
  saveStoredJson(STORAGE_CRAVING_PLAN, normalized);
}

function getStoredWellbeingLog() {
  const parsed = getStoredJson(STORAGE_WELLBEING_LOG, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.slice(-WELLBEING_HISTORY_MAX_ENTRIES);
}

function saveWellbeingLog(entries) {
  saveStoredJson(STORAGE_WELLBEING_LOG, Array.isArray(entries) ? entries.slice(-WELLBEING_HISTORY_MAX_ENTRIES) : []);
}

function getStoredLastAccountSyncAt() {
  try {
    return localStorage.getItem(STORAGE_LAST_ACCOUNT_SYNC_AT) || '';
  } catch {
    return '';
  }
}

function saveLastAccountSyncAt(value) {
  try {
    localStorage.setItem(STORAGE_LAST_ACCOUNT_SYNC_AT, String(value || ''));
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

function trackEvent(name, meta = {}) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_ANALYTICS_EVENTS) || '[]');
    const next = Array.isArray(current) ? current : [];
    next.push({
      name,
      meta,
      clientId,
      at: new Date().toISOString(),
    });
    if (next.length > MAX_ANALYTICS_EVENTS) {
      next.splice(0, next.length - MAX_ANALYTICS_EVENTS);
    }
    localStorage.setItem(STORAGE_ANALYTICS_EVENTS, JSON.stringify(next));
  } catch {
    // ignore analytics storage failures
  }
}

function getStoredNotificationPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATION_PREFS);
    if (!raw) {
      return { ...defaultNotificationPrefs };
    }
    const parsed = JSON.parse(raw);
    const normalized = {
      frequency: parsed.frequency || defaultNotificationPrefs.frequency,
      reminderTime: parsed.reminderTime || defaultNotificationPrefs.reminderTime,
      quietStart: parsed.quietStart || defaultNotificationPrefs.quietStart,
      quietEnd: parsed.quietEnd || defaultNotificationPrefs.quietEnd,
      tone: parsed.tone || defaultNotificationPrefs.tone,
      mode: parsed.mode || defaultNotificationPrefs.mode,
      weeklyDay: String(parsed.weeklyDay ?? defaultNotificationPrefs.weeklyDay),
    };

    const isLegacyDefault = Object.entries(legacyDefaultNotificationPrefs)
      .every(([key, value]) => String(normalized[key]) === String(value));

    if (isLegacyDefault) {
      saveNotificationPrefs(defaultNotificationPrefs);
      return { ...defaultNotificationPrefs };
    }

    return normalized;
  } catch {
    return { ...defaultNotificationPrefs };
  }
}

function saveNotificationPrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_NOTIFICATION_PREFS, JSON.stringify(prefs));
  } catch {
    // ignore storage errors
  }
}

function parseTimeStringToMinutes(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value || '').trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return (hours * 60) + minutes;
}

function isWithinQuietHours(nowDate, quietStart, quietEnd) {
  const startMinutes = parseTimeStringToMinutes(quietStart);
  const endMinutes = parseTimeStringToMinutes(quietEnd);
  if (startMinutes === null || endMinutes === null || startMinutes === endMinutes) {
    return false;
  }

  const nowMinutes = (nowDate.getHours() * 60) + nowDate.getMinutes();
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

function isNotificationTimeAllowed(nowDate = new Date()) {
  const prefs = getCurrentNotificationPrefs();
  if (!prefs) {
    return true;
  }

  if (isWithinQuietHours(nowDate, prefs.quietStart, prefs.quietEnd)) {
    return false;
  }

  const day = nowDate.getDay();
  if (prefs.frequency === 'weekdays' && (day === 0 || day === 6)) {
    return false;
  }
  if (prefs.frequency === 'weekly' && String(day) !== String(prefs.weeklyDay)) {
    return false;
  }

  return true;
}

function isWithinReminderWindow(nowDate = new Date()) {
  const prefs = getCurrentNotificationPrefs();
  const reminderMinutes = parseTimeStringToMinutes(prefs.reminderTime);
  if (reminderMinutes === null) {
    return true;
  }
  const nowMinutes = (nowDate.getHours() * 60) + nowDate.getMinutes();
  return Math.abs(nowMinutes - reminderMinutes) <= 10;
}

function getCurrentNotificationPrefs() {
  return {
    frequency: notificationFrequency?.value || defaultNotificationPrefs.frequency,
    reminderTime: notificationReminderTime?.value || defaultNotificationPrefs.reminderTime,
    quietStart: notificationQuietStart?.value || defaultNotificationPrefs.quietStart,
    quietEnd: notificationQuietEnd?.value || defaultNotificationPrefs.quietEnd,
    tone: notificationTone?.value || defaultNotificationPrefs.tone,
    mode: notificationMode?.value || defaultNotificationPrefs.mode,
    weeklyDay: notificationWeeklyDay?.value || defaultNotificationPrefs.weeklyDay,
  };
}

function applyNotificationPrefsToInputs() {
  const prefs = getStoredNotificationPrefs();
  if (notificationFrequency) {
    notificationFrequency.value = prefs.frequency;
  }
  if (notificationReminderTime) {
    notificationReminderTime.value = prefs.reminderTime;
  }
  if (notificationQuietStart) {
    notificationQuietStart.value = prefs.quietStart;
  }
  if (notificationQuietEnd) {
    notificationQuietEnd.value = prefs.quietEnd;
  }
  if (notificationTone) {
    notificationTone.value = prefs.tone;
  }
  if (notificationMode) {
    notificationMode.value = prefs.mode;
  }
  if (notificationWeeklyDay) {
    notificationWeeklyDay.value = prefs.weeklyDay;
  }
}

function persistNotificationPrefsFromInputs() {
  const prefs = getCurrentNotificationPrefs();
  saveNotificationPrefs(prefs);
  updateNotificationStatus('Notification' in window ? Notification.permission : 'unsupported');
  syncPushState();
  trackEvent('notification_preferences_updated', prefs);
}

function getStoredBoolean(key, fallbackValue = false) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return fallbackValue;
    }
    return rawValue === 'true' || rawValue === '1';
  } catch {
    return fallbackValue;
  }
}

function getStoredInteger(key, fallbackValue = 0) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) {
      return fallbackValue;
    }
    const parsedValue = Number.parseInt(rawValue, 10);
    return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function saveInteger(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore storage errors
  }
}

function isPremiumUser() {
  try {
    const rawValue = localStorage.getItem(STORAGE_IS_PREMIUM);
    return rawValue === 'true' || rawValue === '1';
  } catch {
    return false;
  }
}

function clearLaunchAdTimers() {
  if (launchAdAutoCloseTimeoutId) {
    clearTimeout(launchAdAutoCloseTimeoutId);
    launchAdAutoCloseTimeoutId = null;
  }
  if (launchAdCountdownIntervalId) {
    clearInterval(launchAdCountdownIntervalId);
    launchAdCountdownIntervalId = null;
  }
}

function closeLaunchAd() {
  if (!launchAdModal) {
    return;
  }
  clearLaunchAdTimers();
  launchAdModal.classList.remove('open');
  launchAdModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function saveOnboardingDone(value) {
  try {
    localStorage.setItem(STORAGE_ONBOARDING_DONE, value ? 'true' : 'false');
  } catch {
    // ignore storage errors
  }
}

function shouldShowOnboarding() {
  if (!onboardingModal || getStoredBoolean(STORAGE_ONBOARDING_DONE, false)) {
    return false;
  }

  const hasExistingData = Boolean(
    getStoredQuitDate()
    || getStoredFieldValue(STORAGE_CIGARETTES_PER_DAY)
    || getStoredFieldValue(STORAGE_PRICE_PER_PACK)
    || getStoredFieldValue(STORAGE_CIGARETTES_PER_PACK)
    || getStoredFieldValue(STORAGE_GOAL_NAME)
    || getStoredFieldValue(STORAGE_GOAL_AMOUNT)
  );

  if (hasExistingData) {
    saveOnboardingDone(true);
    return false;
  }

  return true;
}

function getStoredEntryChoice() {
  try {
    return localStorage.getItem(STORAGE_ENTRY_CHOICE) || '';
  } catch {
    return '';
  }
}

function saveEntryChoice(value) {
  try {
    localStorage.setItem(STORAGE_ENTRY_CHOICE, value);
  } catch {
    // ignore storage errors
  }
}

function shouldShowFirstLaunchChoice() {
  if (!firstLaunchModal || getStoredEntryChoice()) {
    return false;
  }

  const hasExistingData = Boolean(
    getStoredQuitDate()
    || getStoredFieldValue(STORAGE_CIGARETTES_PER_DAY)
    || getStoredFieldValue(STORAGE_PRICE_PER_PACK)
    || getStoredFieldValue(STORAGE_CIGARETTES_PER_PACK)
    || getStoredFieldValue(STORAGE_GOAL_NAME)
    || getStoredFieldValue(STORAGE_GOAL_AMOUNT)
    || getStoredAuthToken()
  );

  if (hasExistingData) {
    saveEntryChoice('existing-user');
    return false;
  }

  return true;
}

function openFirstLaunchChoiceModal() {
  if (!firstLaunchModal) {
    return;
  }
  firstLaunchModal.classList.add('open');
  firstLaunchModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeFirstLaunchChoiceModal() {
  if (!firstLaunchModal) {
    return;
  }
  firstLaunchModal.classList.remove('open');
  firstLaunchModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function launchStartupFlow() {
  if (hasLaunchedStartupFlow) {
    return;
  }
  hasLaunchedStartupFlow = true;

  if (shouldShowLaunchAdOnStartup()) {
    if (!shouldShowOnboarding()) {
      window.setTimeout(() => {
        openLaunchAd();
      }, 220);
    }
  }

  if (shouldShowOnboarding()) {
    window.setTimeout(() => {
      openOnboarding();
    }, 180);
  }
}

function handleFirstLaunchCreateAccount() {
  saveEntryChoice('account');
  pendingStartupFlowAfterAccountModal = true;
  closeFirstLaunchChoiceModal();
  openAccountModal();
  showAccountTab('register');
  trackEvent('entry_choice_account');
}

function handleFirstLaunchGuest() {
  saveEntryChoice('guest');
  closeFirstLaunchChoiceModal();
  launchStartupFlow();
  trackEvent('entry_choice_guest');
}

function renderOnboardingStep() {
  if (!onboardingSteps.length) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(onboardingSteps.length - 1, onboardingStepIndex));
  onboardingStepIndex = safeIndex;

  onboardingSteps.forEach((step, index) => {
    const isActive = index === safeIndex;
    step.classList.toggle('active', isActive);
    step.hidden = !isActive;
  });

  const total = onboardingSteps.length;
  const current = safeIndex + 1;
  if (onboardingProgressLabel) {
    onboardingProgressLabel.textContent = `Etape ${current} sur ${total}`;
  }
  if (onboardingProgressFill) {
    onboardingProgressFill.style.width = `${Math.round((current / total) * 100)}%`;
  }

  if (onboardingBackButton) {
    onboardingBackButton.hidden = safeIndex === 0;
  }

  if (onboardingNextButton) {
    onboardingNextButton.textContent = safeIndex >= total - 1 ? 'Commencer' : 'Continuer';
  }
}

function applyOnboardingValues() {
  const cigsPerDayValue = String(onboardingCigarettesPerDay?.value || '').trim();
  const pricePerPackValue = String(onboardingPricePerPack?.value || '').trim();
  const quitDateValue = String(onboardingQuitDate?.value || '').trim();
  const goalNameValue = String(onboardingGoalName?.value || '').trim();
  const goalAmountValue = String(onboardingGoalAmount?.value || '').trim();

  if (cigsPerDayValue) {
    cigarettesPerDay.value = cigsPerDayValue;
    saveFieldValue(STORAGE_CIGARETTES_PER_DAY, cigsPerDayValue);
  }

  if (pricePerPackValue) {
    const normalizedPriceValue = pricePerPackValue.replace(/[^0-9,]/g, '');
    pricePerPack.value = normalizedPriceValue;
    saveFieldValue(STORAGE_PRICE_PER_PACK, normalizedPriceValue);
  }

  if (quitDateValue) {
    quitDate.value = quitDateValue;
    saveQuitDate(quitDateValue);
  }

  if (goalNameValue) {
    goalNameInput.value = goalNameValue;
    saveFieldValue(STORAGE_GOAL_NAME, goalNameValue);
  }

  if (goalAmountValue) {
    const normalizedGoalAmountValue = goalAmountValue.replace(/[^0-9,]/g, '');
    goalAmountInput.value = normalizedGoalAmountValue;
    saveFieldValue(STORAGE_GOAL_AMOUNT, normalizedGoalAmountValue);
  }

  if (onboardingNotificationFrequency && notificationFrequency) {
    notificationFrequency.value = onboardingNotificationFrequency.value;
  }
  if (onboardingNotificationMode && notificationMode) {
    notificationMode.value = onboardingNotificationMode.value;
  }
  persistNotificationPrefsFromInputs();

  if (onboardingNotificationOptIn?.checked) {
    notificationsEnabled = true;
    saveNotificationsEnabled(true);
    if (notificationToggle) {
      notificationToggle.checked = true;
    }
    requestNotificationPermission();
  }

  calculateSavings();
}

function openOnboarding() {
  if (!onboardingModal) {
    return;
  }

  onboardingStepIndex = 0;
  const todayIso = new Date().toISOString().split('T')[0];
  if (onboardingCigarettesPerDay) {
    onboardingCigarettesPerDay.value = String(cigarettesPerDay.value || '10');
  }
  if (onboardingPricePerPack) {
    onboardingPricePerPack.value = String(pricePerPack.value || '13,00');
  }
  if (onboardingQuitDate) {
    onboardingQuitDate.value = String(quitDate.value || todayIso);
  }
  if (onboardingGoalName) {
    onboardingGoalName.value = String(goalNameInput.value || '');
  }
  if (onboardingGoalAmount) {
    onboardingGoalAmount.value = String(goalAmountInput.value || '500,00');
  }
  if (onboardingNotificationFrequency) {
    onboardingNotificationFrequency.value = notificationFrequency?.value || defaultNotificationPrefs.frequency;
  }
  if (onboardingNotificationMode) {
    onboardingNotificationMode.value = notificationMode?.value || defaultNotificationPrefs.mode;
  }

  renderOnboardingStep();
  onboardingModal.classList.add('open');
  onboardingModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeOnboarding({ completed = false } = {}) {
  if (!onboardingModal) {
    return;
  }

  if (completed) {
    applyOnboardingValues();
    syncAccountStateToServer();
    trackEvent('onboarding_completed');
  } else {
    trackEvent('onboarding_skipped');
  }

  saveOnboardingDone(true);
  onboardingModal.classList.remove('open');
  onboardingModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateCravingSessionCountLabel() {
  if (!cravingSessionCount) {
    return;
  }
  const sessions = getStoredInteger(STORAGE_CRAVING_SESSION_COUNT, 0);
  cravingSessionCount.textContent = `${sessions} session${sessions > 1 ? 's' : ''} reussie${sessions > 1 ? 's' : ''}`;
}

function formatCravingTimer(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function clearCravingTimer() {
  if (cravingIntervalId) {
    clearInterval(cravingIntervalId);
    cravingIntervalId = null;
  }
}

function updateCravingUiIdle(message = 'Pret a demarrer une session anti-craving.') {
  if (cravingTimer) {
    cravingTimer.textContent = formatCravingTimer(CRAVING_SESSION_DURATION_SECONDS);
  }
  if (cravingStatus) {
    cravingStatus.textContent = message;
  }
  if (startCravingButton) {
    startCravingButton.disabled = false;
    startCravingButton.textContent = 'Demarrer 3 minutes';
  }
  if (cravingDoneButton) {
    cravingDoneButton.hidden = true;
  }
}

function finishCravingSession({ success }) {
  clearCravingTimer();
  cravingSecondsLeft = CRAVING_SESSION_DURATION_SECONDS;

  if (success) {
    const sessions = getStoredInteger(STORAGE_CRAVING_SESSION_COUNT, 0) + 1;
    saveInteger(STORAGE_CRAVING_SESSION_COUNT, sessions);
    updateCravingSessionCountLabel();
    updateCravingUiIdle('Excellent. Cette envie est passee, tu gardes le controle.');
    sendNotification('Bravo ! Une envie de plus depassee sans cigarette.');
    trackEvent('craving_session_completed');
  } else {
    updateCravingUiIdle();
    trackEvent('craving_session_cancelled');
  }
}

function startCravingSession() {
  if (!startCravingButton || cravingIntervalId) {
    return;
  }

  trackEvent('craving_session_started');

  cravingSecondsLeft = CRAVING_SESSION_DURATION_SECONDS;
  startCravingButton.disabled = true;
  startCravingButton.textContent = 'Session en cours...';
  if (cravingDoneButton) {
    cravingDoneButton.hidden = false;
  }
  if (cravingTip) {
    const customActions = getCravingPlanActions();
    const source = customActions.length ? customActions : cravingTips;
    const tip = source[Math.floor(Math.random() * source.length)];
    cravingTip.textContent = `Action: ${tip}`;
  }

  if (cravingStatus) {
    cravingStatus.textContent = 'Respire et laisse passer le pic. Tu geres minute par minute.';
  }

  if (cravingTimer) {
    cravingTimer.textContent = formatCravingTimer(cravingSecondsLeft);
  }

  clearCravingTimer();
  cravingIntervalId = window.setInterval(() => {
    cravingSecondsLeft -= 1;

    if (cravingTimer) {
      cravingTimer.textContent = formatCravingTimer(cravingSecondsLeft);
    }

    if (cravingSecondsLeft <= 0) {
      finishCravingSession({ success: true });
    }
  }, 1000);
}

function openLaunchAd() {
  if (!launchAdModal) {
    return;
  }

  if (launchAdSlot) {
    launchAdSlot.setAttribute('data-ad-provider', 'admob');
    launchAdSlot.setAttribute('data-admob-app-id', ADMOB_APP_ID);
    launchAdSlot.setAttribute('data-admob-unit-id', ADMOB_UNIT_ID);
    launchAdSlot.textContent = `Bloc AdMob: ${ADMOB_APP_ID} / ${ADMOB_UNIT_ID}`;
  }

  saveInteger(STORAGE_LAST_LAUNCH_AD_AT, Date.now());
  launchAdModal.classList.add('open');
  launchAdModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  let secondsLeft = LAUNCH_AD_AUTO_CLOSE_SECONDS;
  if (launchAdCountdown) {
    launchAdCountdown.textContent = `Fermeture automatique dans ${secondsLeft} s`;
  }

  clearLaunchAdTimers();
  launchAdCountdownIntervalId = window.setInterval(() => {
    secondsLeft -= 1;
    if (launchAdCountdown) {
      launchAdCountdown.textContent = secondsLeft > 0
        ? `Fermeture automatique dans ${secondsLeft} s`
        : 'Fermeture...';
    }
  }, 1000);

  launchAdAutoCloseTimeoutId = window.setTimeout(() => {
    closeLaunchAd();
  }, LAUNCH_AD_AUTO_CLOSE_SECONDS * 1000);
}

function shouldShowLaunchAdOnStartup() {
  if (!launchAdModal) {
    return false;
  }
  if (isPremiumUser()) {
    return false;
  }

  const nextOpenCount = getStoredInteger(STORAGE_APP_OPEN_COUNT, 0) + 1;
  saveInteger(STORAGE_APP_OPEN_COUNT, nextOpenCount);
  if (nextOpenCount % LAUNCH_AD_SHOW_EVERY_N_OPENS !== 0) {
    return false;
  }

  const lastShownAt = getStoredInteger(STORAGE_LAST_LAUNCH_AD_AT, 0);
  if (lastShownAt > 0 && (Date.now() - lastShownAt) < LAUNCH_AD_COOLDOWN_MS) {
    return false;
  }

  return true;
}

function getPauseEncouragementMessage(dateIso) {
  const mode = getCurrentNotificationPrefs().mode === 'save' ? 'save' : 'progress';
  const pauseEncouragementMessages = pauseEncouragementMessagesByMode[mode] || pauseEncouragementMessagesByMode.progress;
  const hash = Array.from(dateIso).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return pauseEncouragementMessages[hash % pauseEncouragementMessages.length];
}

function getSavingsNotificationCheckpoint(packsSaved) {
  return Math.max(0, Math.floor((Number(packsSaved) || 0) / SAVINGS_NOTIFICATION_PACK_STEP) * SAVINGS_NOTIFICATION_PACK_STEP);
}

function getReminderDispatchKey(nowDate = new Date(), prefs = getCurrentNotificationPrefs()) {
  if (prefs.frequency === 'weekly') {
    return getCurrentIsoWeekKey(nowDate);
  }
  return nowDate.toISOString().split('T')[0];
}

function buildSavingsNotificationMessage(newlyUnlockedPacks, amountToSave, goalName, mode) {
  const formattedAmount = formatCurrency(amountToSave);
  const packLabel = `${newlyUnlockedPacks} paquet${newlyUnlockedPacks > 1 ? 's' : ''}`;
  const goalSuffix = goalName ? ` pour ${goalName}` : '';
  const estimatedMonthlyPotential = formatCurrency(Math.max(0, parseFrenchNumber(pricePerPack.value) * (Number(cigarettesPerDay.value) || 0) * (30 / Math.max(1, Number(cigarettesPerPack.value) || 1))));
  if (mode === 'save') {
    return `Recap hebdo: ${packLabel} economises. Mets de cote ${formattedAmount}${goalSuffix}. Potentiel mensuel: ${estimatedMonthlyPotential}.`;
  }
  return `Recap hebdo: ${packLabel} economises depuis le dernier palier. Tu continues a avancer${goalSuffix}.`;
}

function setFeedbackStatus(message, type = '') {
  if (!feedbackStatus) return;
  feedbackStatus.textContent = message;
  feedbackStatus.classList.remove('success', 'error');
  if (type) {
    feedbackStatus.classList.add(type);
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
      body: JSON.stringify({ message, contact, clientId }),
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
  const savingsPot = getStoredSavingsPot();
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
    notificationPrefs: getCurrentNotificationPrefs(),
    relapseEvents: getStoredRelapseEvents(),
    savingsPot,
    cravingPlan: getStoredCravingPlan(),
    wellbeingLog: getStoredWellbeingLog(),
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
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

  if (!isNotificationTimeAllowed(new Date())) {
    return;
  }

  if (!isWithinReminderWindow(new Date())) {
    return;
  }

  const now = new Date();
  const prefs = getCurrentNotificationPrefs();
  const dispatchKey = getReminderDispatchKey(now, prefs);
  const lastSentDate = getStoredLastPauseEncouragement();
  if (lastSentDate === dispatchKey) {
    return;
  }
  const message = getPauseEncouragementMessage(dispatchKey);
  const title = prefs.frequency === 'weekly' ? 'Recap hebdo :' : 'Encouragement du jour :';
  sendNotification(`${title} ${message}`);
  saveLastPauseEncouragement(dispatchKey);
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
    syncAccountStateToServer();
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

function getRelapseDaysCountUntil(today) {
  const events = getStoredRelapseEvents();
  const todayIso = today.toISOString().split('T')[0];
  return events.filter(value => value <= todayIso).length;
}

function renderRelapseStatus(today = new Date()) {
  if (!relapseStatus) {
    return;
  }
  const count = getRelapseDaysCountUntil(today);
  if (!count) {
    relapseStatus.textContent = 'Aucune rechute enregistrée. Un écart ponctuel peut être géré sans culpabiliser.';
    return;
  }
  relapseStatus.textContent = `${count} jour${count > 1 ? 's' : ''} de rechute enregistrés. Votre progression continue sans remise à zéro brutale.`;
}

function buildFinancialMilestones(goalTarget) {
  if (goalTarget > 0) {
    const percentMilestones = [0.1, 0.25, 0.5, 0.75, 1].map(ratio => Math.round(goalTarget * ratio));
    const fixedMilestones = [50, 100, 250, 500, 1000, 1500, 2500];
    return Array.from(new Set([...percentMilestones, ...fixedMilestones]))
      .filter(value => value > 0)
      .sort((a, b) => a - b);
  }
  return [50, 100, 250, 500, 1000, 1500, 2500];
}

function renderFinancialMilestones(savedMoney) {
  if (!nextFinancialMilestone || !financialMilestoneHint) {
    return;
  }
  const goalTarget = parseFrenchNumber(goalAmountInput?.value || '0');
  const milestones = buildFinancialMilestones(goalTarget);
  const nextMilestone = milestones.find(value => value > savedMoney);
  if (!nextMilestone) {
    nextFinancialMilestone.textContent = 'Tous les paliers atteints';
    financialMilestoneHint.textContent = 'Excellent. Vous avez dépassé tous les seuils proposés.';
    return;
  }
  const remaining = Math.max(0, nextMilestone - savedMoney);
  nextFinancialMilestone.textContent = `${formatCurrency(nextMilestone)}`;
  financialMilestoneHint.textContent = `Encore ${formatCurrency(remaining)} pour atteindre ce palier.`;
}

function renderSavingsPot(savedMoney = 0) {
  if (!realSavingsAmount || !savingsPotStatus) {
    return;
  }
  const pot = getStoredSavingsPot();
  realSavingsAmount.textContent = formatCurrency(pot.total);
  const gap = savedMoney - pot.total;
  if (pot.deposits.length === 0) {
    savingsPotStatus.textContent = 'Aucun dépôt pour le moment.';
    return;
  }
  const lastDeposit = pot.deposits[pot.deposits.length - 1];
  const gapText = gap > 0
    ? `Il reste ${formatCurrency(gap)} estimé(s) à mettre de côté.`
    : 'Votre cagnotte réelle rattrape ou dépasse l\'estimé. Bravo.';
  savingsPotStatus.textContent = `Dernier dépôt: ${formatCurrency(Number(lastDeposit.amount) || 0)} le ${formatDateHuman(lastDeposit.at)}. ${gapText}`;
}

function recordMetricsSnapshot(metrics) {
  const todayIso = getTodayIso();
  const history = getStoredMetricsHistory();
  const nextEntry = {
    date: todayIso,
    savedMoney: Number(metrics.savedMoney) || 0,
    savedCigarettes: Number(metrics.savedCigarettes) || 0,
  };
  const existingIndex = history.findIndex(entry => entry.date === todayIso);
  if (existingIndex >= 0) {
    history[existingIndex] = nextEntry;
  } else {
    history.push(nextEntry);
  }
  saveMetricsHistory(history);
}

function computeTrendDelta(history, key, daysWindow) {
  if (!Array.isArray(history) || history.length === 0) {
    return 0;
  }
  const latest = history[history.length - 1];
  const latestDate = new Date(`${latest.date}T00:00:00`);
  if (!Number.isFinite(latestDate.getTime())) {
    return 0;
  }
  const thresholdDate = new Date(latestDate.getTime() - ((daysWindow - 1) * 86400000));
  const baseline = history.find(entry => {
    const date = new Date(`${entry.date}T00:00:00`);
    return Number.isFinite(date.getTime()) && date >= thresholdDate;
  }) || history[0];
  return (Number(latest[key]) || 0) - (Number(baseline[key]) || 0);
}

function renderTrends() {
  const history = getStoredMetricsHistory();
  const saved7 = computeTrendDelta(history, 'savedMoney', 7);
  const saved30 = computeTrendDelta(history, 'savedMoney', 30);
  const cigs7 = Math.max(0, Math.round(computeTrendDelta(history, 'savedCigarettes', 7)));
  const cigs30 = Math.max(0, Math.round(computeTrendDelta(history, 'savedCigarettes', 30)));

  if (trendSavedMoney) {
    trendSavedMoney.textContent = `7j: ${formatCurrency(Math.max(0, saved7))} · 30j: ${formatCurrency(Math.max(0, saved30))}`;
  }
  if (trendCigarettes) {
    trendCigarettes.textContent = `Cigarettes évitées · 7j: ${cigs7.toLocaleString(locale)} · 30j: ${cigs30.toLocaleString(locale)}`;
  }
}

function applyCravingPlanInputs() {
  const plan = getStoredCravingPlan();
  if (cravingAction1) cravingAction1.value = plan[0] || '';
  if (cravingAction2) cravingAction2.value = plan[1] || '';
  if (cravingAction3) cravingAction3.value = plan[2] || '';
}

function persistCravingPlanFromInputs() {
  saveCravingPlan([
    cravingAction1?.value || '',
    cravingAction2?.value || '',
    cravingAction3?.value || '',
  ]);
  syncAccountStateToServer();
}

function getCravingPlanActions() {
  return getStoredCravingPlan().map(value => String(value || '').trim()).filter(Boolean);
}

function renderWellbeingStatus() {
  if (!wellbeingStatus) {
    return;
  }
  const entries = getStoredWellbeingLog();
  if (entries.length === 0) {
    wellbeingStatus.textContent = 'Aucune auto-évaluation enregistrée.';
    return;
  }
  const latest = entries[entries.length - 1];
  const previous = entries.length > 1 ? entries[entries.length - 2] : null;
  const latestAvg = ((Number(latest.energy) || 0) + (Number(latest.breath) || 0) + (Number(latest.sleep) || 0)) / 3;
  const previousAvg = previous
    ? ((Number(previous.energy) || 0) + (Number(previous.breath) || 0) + (Number(previous.sleep) || 0)) / 3
    : null;
  const trend = previousAvg === null
    ? 'première mesure'
    : latestAvg > previousAvg
      ? 'en amélioration'
      : latestAvg < previousAvg
        ? 'en léger recul'
        : 'stable';
  wellbeingStatus.textContent = `Semaine ${latest.weekKey}: énergie ${latest.energy}/10, souffle ${latest.breath}/10, sommeil ${latest.sleep}/10 (${trend}).`;
}

function saveWeeklyWellbeingAssessment() {
  const weekKey = getCurrentIsoWeekKey();
  const nextEntry = {
    weekKey,
    at: new Date().toISOString(),
    energy: clampScore(wellbeingEnergy?.value),
    breath: clampScore(wellbeingBreath?.value),
    sleep: clampScore(wellbeingSleep?.value),
  };
  const entries = getStoredWellbeingLog();
  const existingIndex = entries.findIndex(entry => entry.weekKey === weekKey);
  if (existingIndex >= 0) {
    entries[existingIndex] = nextEntry;
  } else {
    entries.push(nextEntry);
  }
  saveWellbeingLog(entries);
  renderWellbeingStatus();
  trackEvent('wellbeing_saved', nextEntry);
  syncAccountStateToServer();
}

function updateAccountSyncStatusLabel() {
  if (!accountSyncStatus) {
    return;
  }
  const value = getStoredLastAccountSyncAt();
  if (!value) {
    accountSyncStatus.textContent = 'Dernière synchro : -';
    return;
  }
  accountSyncStatus.textContent = `Dernière synchro : ${new Date(value).toLocaleString(locale)}`;
}

function registerRelapseForToday() {
  const todayIso = getTodayIso();
  const events = getStoredRelapseEvents();
  if (events.includes(todayIso)) {
    renderRelapseStatus(new Date());
    return false;
  }
  events.push(todayIso);
  saveRelapseEvents(events);
  refreshTrackingUI(new Date());
  calculateSavings();
  syncAccountStateToServer();
  trackEvent('relapse_registered', { at: todayIso });
  return true;
}

function addSavingsDeposit() {
  const value = parseFrenchNumber(savingsDepositAmount?.value || '0');
  if (!value || value <= 0) {
    if (savingsPotStatus) {
      savingsPotStatus.textContent = 'Entrez un montant valide pour ajouter un dépôt.';
    }
    return;
  }
  const pot = getStoredSavingsPot();
  const nowIso = new Date().toISOString();
  pot.total = Math.max(0, pot.total + value);
  pot.deposits.push({ amount: value, at: nowIso });
  saveSavingsPot(pot);
  if (savingsDepositAmount) {
    savingsDepositAmount.value = '20,00';
  }
  calculateSavings();
  syncAccountStateToServer();
  trackEvent('savings_deposit_added', { amount: value, at: nowIso });
}

function getTrackingStatusText(today) {
  const relapseDays = getRelapseDaysCountUntil(today);
  if (trackingState.isPaused && trackingState.pauseStartedAt) {
    return `Suivi en pause depuis le ${formatDateHuman(trackingState.pauseStartedAt)}${relapseDays ? ` · ${relapseDays} jour${relapseDays > 1 ? 's' : ''} de rechute géré${relapseDays > 1 ? 's' : ''}` : ''}.`;
  }
  return relapseDays
    ? `Suivi actif · ${relapseDays} jour${relapseDays > 1 ? 's' : ''} de rechute enregistré${relapseDays > 1 ? 's' : ''} sans remise à zéro.`
    : 'Suivi actif.';
}

function refreshTrackingUI(today = new Date()) {
  if (pauseToggleButton) {
    pauseToggleButton.textContent = trackingState.isPaused ? 'Reprendre le suivi' : 'Mettre en pause';
  }
  if (trackingStatus) {
    trackingStatus.textContent = getTrackingStatusText(today);
  }
  renderRelapseStatus(today);
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
  const relapseDays = getRelapseDaysCountUntil(today);
  const days = Math.max(0, elapsedDays - pausedDays - relapseDays);

  const dailyCost = cigsPerPack > 0 ? (price / cigsPerPack) * cigsPerDay : 0;
  const savedMoney = dailyCost * days;
  const savedCigarettes = cigsPerDay * days;
  const goalTarget = parseFrenchNumber(goalAmountInput.value);

  moneySaved.textContent = formatCurrency(savedMoney);
  cigarettesSaved.textContent = savedCigarettes.toLocaleString(locale);

  milestoneText.textContent = getHealthMilestone(days);
  updateGoalDisplay(savedMoney, dailyCost);
  renderFinancialMilestones(savedMoney);
  updateBadges(days, savedMoney, goalTarget);
  createSavingsProjection(days, dailyCost, savedMoney);
  renderSavingsPot(savedMoney);
  recordMetricsSnapshot({ savedMoney, savedCigarettes });
  renderTrends();
  syncPushState();
  queueUserStateExcelSync({
    daysWithoutSmoking: days,
    savedMoney,
    savedCigarettes,
    dailyCost,
  });

  const packsSaved = cigsPerPack > 0 ? Math.floor(savedCigarettes / cigsPerPack) : 0;
  const previousCheckpoint = getSavingsNotificationCheckpoint(lastPackCount);
  const nextCheckpoint = getSavingsNotificationCheckpoint(packsSaved);
  if (nextCheckpoint > previousCheckpoint) {
    if (!pushSubscriptionEndpoint) {
      const newlyUnlockedPacks = nextCheckpoint - previousCheckpoint;
      const amountToSave = price * newlyUnlockedPacks;
      sendNotification(buildSavingsNotificationMessage(newlyUnlockedPacks, amountToSave, goalNameInput.value.trim(), getCurrentNotificationPrefs().mode));
    }
    lastPackCount = nextCheckpoint;
    saveLastPackCount(lastPackCount);
  } else if (packsSaved < lastPackCount) {
    lastPackCount = getSavingsNotificationCheckpoint(packsSaved);
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

  const prefs = getCurrentNotificationPrefs();
  const frequencyLabel = prefs.frequency === 'weekdays'
    ? 'jours ouvres'
    : prefs.frequency === 'weekly'
      ? `hebdo (${['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][Number(prefs.weeklyDay) || 0]})`
      : 'quotidienne';
  const modeLabel = prefs.mode === 'save' ? 'mise de cote' : 'progression';

  if (permission === 'granted') {
    setNotificationMessage(`Notifications actives (${frequencyLabel}, mode ${modeLabel}, rappel ${prefs.reminderTime}, silence ${prefs.quietStart}-${prefs.quietEnd}).`);
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
    trackEvent('notification_toggle_enabled');
    requestNotificationPermission();
    subscribeToPushNotifications().then(syncPushState);
    maybeSendPauseEncouragement();
  } else {
    notificationsEnabled = false;
    saveNotificationsEnabled(false);
    trackEvent('notification_toggle_disabled');
    updateNotificationStatus(Notification.permission);
    unsubscribeFromPushNotifications();
  }
});

async function sendNotification(message) {
  if (!notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  if (!isNotificationTimeAllowed(new Date())) {
    return;
  }

  const prefs = getCurrentNotificationPrefs();
  const finalMessage = prefs.tone === 'direct' ? message.replace('Bravo', 'Continue') : message;

  try {
    if (serviceWorkerRegistration) {
      await serviceWorkerRegistration.showNotification('Calculateur d\'economies', {
        body: finalMessage,
        tag: 'stop-smoking-app',
        renotify: true,
        badge: './icon-192.svg',
        icon: './icon-512.svg',
      });
      return;
    }
    new Notification(finalMessage);
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

savingsDepositAmount?.addEventListener('input', () => {
  savingsDepositAmount.value = savingsDepositAmount.value.replace(/[^0-9,]/g, '');
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
relapseButton?.addEventListener('click', () => {
  const created = registerRelapseForToday();
  if (!created && relapseStatus) {
    relapseStatus.textContent = 'Rechute déjà enregistrée aujourd\'hui. Vous pouvez repartir dès maintenant.';
  }
});
feedbackForm?.addEventListener('submit', handleFeedbackSubmit);
addSavingsDepositButton?.addEventListener('click', addSavingsDeposit);
launchAdClose?.addEventListener('click', closeLaunchAd);
launchAdModal?.addEventListener('click', event => {
  if (event.target === launchAdModal) {
    closeLaunchAd();
  }
});
onboardingSkipButton?.addEventListener('click', () => closeOnboarding({ completed: false }));
onboardingBackButton?.addEventListener('click', () => {
  onboardingStepIndex -= 1;
  renderOnboardingStep();
});
onboardingNextButton?.addEventListener('click', () => {
  if (onboardingStepIndex >= onboardingSteps.length - 1) {
    closeOnboarding({ completed: true });
    return;
  }
  onboardingStepIndex += 1;
  renderOnboardingStep();
});
startCravingButton?.addEventListener('click', startCravingSession);
cravingDoneButton?.addEventListener('click', () => finishCravingSession({ success: true }));
cravingAction1?.addEventListener('input', persistCravingPlanFromInputs);
cravingAction2?.addEventListener('input', persistCravingPlanFromInputs);
cravingAction3?.addEventListener('input', persistCravingPlanFromInputs);
saveWellbeingButton?.addEventListener('click', saveWeeklyWellbeingAssessment);
notificationFrequency?.addEventListener('change', persistNotificationPrefsFromInputs);
notificationReminderTime?.addEventListener('change', persistNotificationPrefsFromInputs);
notificationQuietStart?.addEventListener('change', persistNotificationPrefsFromInputs);
notificationQuietEnd?.addEventListener('change', persistNotificationPrefsFromInputs);
notificationTone?.addEventListener('change', persistNotificationPrefsFromInputs);
notificationMode?.addEventListener('change', persistNotificationPrefsFromInputs);
notificationWeeklyDay?.addEventListener('change', persistNotificationPrefsFromInputs);
onboardingNotificationFrequency?.addEventListener('change', () => {
  if (onboardingNotificationFrequency && onboardingNotificationFrequency.value === 'weekly' && onboardingNotificationMode) {
    onboardingNotificationMode.value = onboardingNotificationMode.value || 'save';
  }
});

// -----------------------------------------------------------------------
// Auth & account helpers
// -----------------------------------------------------------------------

let currentUser = null;

function getStoredAuthToken() { return localStorage.getItem(STORAGE_AUTH_TOKEN) || null; }
function saveAuthToken(token) { localStorage.setItem(STORAGE_AUTH_TOKEN, token); }
function clearAuthToken() { localStorage.removeItem(STORAGE_AUTH_TOKEN); }
function getAuthHeaders() {
  const token = getStoredAuthToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function updateAccountUI() {
  const btn = document.getElementById('accountButton');
  if (!btn) return;
  if (currentUser) {
    btn.classList.add('is-authenticated');
    btn.innerHTML = '<span class="account-avatar" aria-hidden="true"></span><span>Mon compte</span>';
    btn.title = currentUser.email;
    btn.setAttribute('aria-label', `Mon compte (connecte: ${currentUser.email})`);
  } else {
    btn.classList.remove('is-authenticated');
    btn.innerHTML = '<span class="account-avatar" aria-hidden="true"></span><span>Connexion</span>';
    btn.title = '';
    btn.setAttribute('aria-label', 'Connexion');
  }
}

function openAccountModal() {
  const modal = document.getElementById('accountModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  const loggedInPanel = modal.querySelector('.account-modal-logged-in');
  const authPanel = modal.querySelector('.account-modal-auth');
  if (currentUser) {
    if (loggedInPanel) loggedInPanel.hidden = false;
    if (authPanel) authPanel.hidden = true;
    const emailLabel = modal.querySelector('#accountEmailLabel');
    if (emailLabel) emailLabel.textContent = currentUser.email;
    updateAccountSyncStatusLabel();
  } else {
    if (loggedInPanel) loggedInPanel.hidden = true;
    if (authPanel) authPanel.hidden = false;
    showAccountTab('login');
  }
}

function closeAccountModal() {
  const modal = document.getElementById('accountModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');

  if (pendingStartupFlowAfterAccountModal) {
    pendingStartupFlowAfterAccountModal = false;
    window.setTimeout(() => {
      launchStartupFlow();
    }, 140);
  }
}

function showAccountTab(tab) {
  const loginTab = document.getElementById('accountLoginTab');
  const registerTab = document.getElementById('accountRegisterTab');
  const loginForm = document.getElementById('accountLoginForm');
  const registerForm = document.getElementById('accountRegisterForm');
  if (tab === 'login') {
    loginTab?.classList.add('active');
    registerTab?.classList.remove('active');
    if (loginForm) loginForm.hidden = false;
    if (registerForm) registerForm.hidden = true;
  } else {
    registerTab?.classList.add('active');
    loginTab?.classList.remove('active');
    if (registerForm) registerForm.hidden = false;
    if (loginForm) loginForm.hidden = true;
  }
  document.getElementById('accountFormError')?.textContent && (document.getElementById('accountFormError').textContent = '');
}

function restoreAccountState(state) {
  if (!state) return;
  if (state.quitDate) {
    localStorage.setItem(STORAGE_QUIT_DATE, state.quitDate);
    const quitDateInput = document.getElementById('quitDate');
    if (quitDateInput) quitDateInput.value = state.quitDate;
  }
  if (state.cigsPerDay) {
    localStorage.setItem(STORAGE_CIGARETTES_PER_DAY, String(state.cigsPerDay));
    const cpdEl = document.getElementById('cigarettesPerDay');
    if (cpdEl) cpdEl.value = state.cigsPerDay;
  }
  if (state.pricePerPack) {
    localStorage.setItem(STORAGE_PRICE_PER_PACK, String(state.pricePerPack));
    const pppEl = document.getElementById('pricePerPack');
    if (pppEl) pppEl.value = state.pricePerPack;
  }
  if (state.cigsPerPack) {
    localStorage.setItem(STORAGE_CIGARETTES_PER_PACK, String(state.cigsPerPack));
    const cppEl = document.getElementById('cigarettesPerPack');
    if (cppEl) cppEl.value = state.cigsPerPack;
  }
  if (state.goalName) {
    localStorage.setItem(STORAGE_GOAL_NAME, state.goalName);
    const gnEl = document.getElementById('goalName');
    if (gnEl) gnEl.value = state.goalName;
  }
  if (state.goalAmount) {
    localStorage.setItem(STORAGE_GOAL_AMOUNT, String(state.goalAmount));
    const gaEl = document.getElementById('goalAmount');
    if (gaEl) gaEl.value = state.goalAmount;
  }

  if (state.trackingState && typeof state.trackingState === 'object') {
    trackingState = {
      isPaused: Boolean(state.trackingState.isPaused),
      pauseStartedAt: state.trackingState.pauseStartedAt || null,
      pausedDaysTotal: Number(state.trackingState.pausedDaysTotal) || 0,
    };
    saveTrackingState();
  }

  if (state.notificationPrefs && typeof state.notificationPrefs === 'object') {
    saveNotificationPrefs({ ...defaultNotificationPrefs, ...state.notificationPrefs });
    applyNotificationPrefsToInputs();
    updateNotificationStatus('Notification' in window ? Notification.permission : 'unsupported');
  }

  if (state.relapseEvents && Array.isArray(state.relapseEvents)) {
    saveRelapseEvents(state.relapseEvents);
  }

  if (state.savingsPot && typeof state.savingsPot === 'object') {
    saveSavingsPot(state.savingsPot);
  }

  if (state.cravingPlan && Array.isArray(state.cravingPlan)) {
    saveCravingPlan(state.cravingPlan);
    applyCravingPlanInputs();
  }

  if (state.wellbeingLog && Array.isArray(state.wellbeingLog)) {
    saveWellbeingLog(state.wellbeingLog);
    renderWellbeingStatus();
  }

  if (state.metricsHistory && Array.isArray(state.metricsHistory)) {
    saveMetricsHistory(state.metricsHistory);
    renderTrends();
  }

  if (state.updatedAt) {
    saveLastAccountSyncAt(state.updatedAt);
    updateAccountSyncStatusLabel();
  }

  refreshTrackingUI(new Date());
  calculateSavings();
}

async function pullAccountStateFromServer() {
  if (!currentUser) {
    return null;
  }
  const stateRes = await fetch('/api/account/state', { headers: getAuthHeaders() });
  if (!stateRes.ok) {
    return null;
  }
  const stateData = await stateRes.json();
  if (stateData.state) {
    restoreAccountState(stateData.state);
    return stateData.state;
  }
  return null;
}

async function syncAccountStateToServer() {
  if (!currentUser) return;
  try {
    const trackingStatePayload = JSON.parse(localStorage.getItem(STORAGE_TRACKING_STATE) || '{}');
    const notificationPrefs = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATION_PREFS) || '{}');
    const statePayload = {
      quitDate: localStorage.getItem(STORAGE_QUIT_DATE) || '',
      cigsPerDay: Number(localStorage.getItem(STORAGE_CIGARETTES_PER_DAY)) || 0,
      cigsPerPack: Number(localStorage.getItem(STORAGE_CIGARETTES_PER_PACK)) || 0,
      pricePerPack: parseFrenchNumber(localStorage.getItem(STORAGE_PRICE_PER_PACK) || '0'),
      goalName: localStorage.getItem(STORAGE_GOAL_NAME) || '',
      goalAmount: parseFrenchNumber(localStorage.getItem(STORAGE_GOAL_AMOUNT) || '0'),
      trackingState: trackingStatePayload,
      notificationPrefs,
      relapseEvents: getStoredRelapseEvents(),
      savingsPot: getStoredSavingsPot(),
      cravingPlan: getStoredCravingPlan(),
      wellbeingLog: getStoredWellbeingLog(),
      metricsHistory: getStoredMetricsHistory(),
      updatedAt: new Date().toISOString(),
    };
    await fetch('/api/account/state', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(statePayload),
    });
    saveLastAccountSyncAt(statePayload.updatedAt);
    updateAccountSyncStatusLabel();
  } catch { /* non-blocking */ }
}

async function handleAccountLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const errorEl = document.getElementById('accountFormError');
  const submitBtn = document.getElementById('loginSubmitBtn');
  if (!emailInput || !passwordInput) return;
  if (submitBtn) submitBtn.disabled = true;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (errorEl) errorEl.textContent = data.error === 'invalid-credentials' ? 'Email ou mot de passe incorrect.' : 'Erreur de connexion, réessayez.';
      return;
    }
    saveAuthToken(data.token);
    currentUser = data.user;
    updateAccountUI();
    await pullAccountStateFromServer();
    closeAccountModal();
    trackEvent('account_login');
  } catch {
    if (errorEl) errorEl.textContent = 'Erreur réseau. Vérifiez votre connexion.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

async function handleAccountRegister(event) {
  event.preventDefault();
  const emailInput = document.getElementById('registerEmail');
  const passwordInput = document.getElementById('registerPassword');
  const errorEl = document.getElementById('accountFormError');
  const submitBtn = document.getElementById('registerSubmitBtn');
  if (!emailInput || !passwordInput) return;
  if (submitBtn) submitBtn.disabled = true;
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (errorEl) {
        if (data.error === 'email-already-used') errorEl.textContent = 'Cet email est déjà utilisé.';
        else if (data.error === 'invalid-email') errorEl.textContent = 'Email invalide.';
        else if (data.error === 'invalid-password') errorEl.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
        else errorEl.textContent = 'Erreur lors de la création du compte.';
      }
      return;
    }
    saveAuthToken(data.token);
    currentUser = data.user;
    updateAccountUI();
    // Save current local state to the new account
    await syncAccountStateToServer();
    closeAccountModal();
    trackEvent('account_register');
  } catch {
    if (errorEl) errorEl.textContent = 'Erreur réseau. Vérifiez votre connexion.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

async function handleAccountLogout() {
  try {
    const token = getStoredAuthToken();
    if (token) {
      await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
    }
  } catch { /* non-blocking */ }
  clearAuthToken();
  currentUser = null;
  updateAccountUI();
  closeAccountModal();
  trackEvent('account_logout');
}

async function initAccount() {
  const token = getStoredAuthToken();
  if (!token) return;
  try {
    const res = await fetch('/api/auth/me', { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      updateAccountUI();
      await pullAccountStateFromServer();
      updateAccountSyncStatusLabel();
    } else {
      clearAuthToken();
    }
  } catch { /* non-blocking */ }
}

async function flushAnalyticsToServer() {
  try {
    const raw = localStorage.getItem(STORAGE_ANALYTICS_EVENTS);
    if (!raw) return;
    const events = JSON.parse(raw);
    if (!Array.isArray(events) || events.length === 0) return;
    const res = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });
    if (res.ok) {
      localStorage.removeItem(STORAGE_ANALYTICS_EVENTS);
    }
  } catch { /* non-blocking */ }
}

// -----------------------------------------------------------------------
// PDF export
// -----------------------------------------------------------------------

function exportProgressionPdf() {
  const quitDateVal = localStorage.getItem(STORAGE_QUIT_DATE);
  const cigsPerDayVal = Number(localStorage.getItem(STORAGE_CIGARETTES_PER_DAY)) || 0;
  const pricePerPackVal = Number(localStorage.getItem(STORAGE_PRICE_PER_PACK)) || 0;
  const cigsPerPackVal = Number(localStorage.getItem(STORAGE_CIGARETTES_PER_PACK)) || 20;
  const goalNameVal = localStorage.getItem(STORAGE_GOAL_NAME) || '';
  const goalAmountVal = Number(localStorage.getItem(STORAGE_GOAL_AMOUNT)) || 0;

  const moneySavedEl = document.getElementById('moneySaved');
  const cigarettesSavedEl = document.getElementById('cigarettesSaved');
  const milestoneEl = document.getElementById('milestoneText');

  const moneySaved = moneySavedEl ? moneySavedEl.textContent : '–';
  const cigarettesSaved = cigarettesSavedEl ? cigarettesSavedEl.textContent : '–';
  const milestone = milestoneEl ? milestoneEl.textContent : '';

  let daysSmokeFree = 0;
  if (quitDateVal) {
    const diff = Date.now() - new Date(quitDateVal).getTime();
    daysSmokeFree = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  const goalProgress = goalAmountVal > 0
    ? `${Math.min(100, Math.round((parseFloat(moneySaved.replace(/[^\d.,]/g, '').replace(',', '.')) / goalAmountVal) * 100))} %`
    : '–';

  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Ma progression – Arrêt du tabac</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; margin: 0; padding: 32px; max-width: 680px; }
    h1 { color: #4a90d9; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }
    .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #f0f6ff; border-radius: 12px; padding: 16px 20px; }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-value { font-size: 28px; font-weight: 700; color: #4a90d9; margin-top: 4px; }
    .milestone { background: #e8f5e9; border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; font-size: 15px; }
    .goal-section { background: #fff8e1; border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; }
    .footer { font-size: 12px; color: #aaa; margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Ma progression sans tabac</h1>
  <p class="subtitle">Généré le ${today}</p>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Jours sans tabac</div>
      <div class="stat-value">${daysSmokeFree}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Argent économisé</div>
      <div class="stat-value">${moneySaved}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Cigarettes évitées</div>
      <div class="stat-value">${cigarettesSaved}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Cigarettes / jour (avant)</div>
      <div class="stat-value">${cigsPerDayVal}</div>
    </div>
  </div>
  ${milestone ? `<div class="milestone"><strong>🫁 Avantages santé :</strong> ${milestone}</div>` : ''}
  ${goalNameVal ? `<div class="goal-section"><strong>🎯 Objectif :</strong> ${goalNameVal} (${goalAmountVal} €)<br><strong>Progression :</strong> ${goalProgress}</div>` : ''}
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Prix du paquet</div>
      <div class="stat-value">${pricePerPackVal} €</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Cigarettes / paquet</div>
      <div class="stat-value">${cigsPerPackVal}</div>
    </div>
  </div>
  <div class="footer">Calculateur d'économies – Arrêt du tabac &nbsp;·&nbsp; Généré automatiquement</div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
  trackEvent('pdf_export');
}

window.addEventListener('DOMContentLoaded', async () => {
  const startedAt = performance.now();
  updateAppLoading(10, 'Initialisation de l\'application...');
  const today = new Date();
  const serviceWorkerReadyPromise = registerServiceWorker();
  updateAppLoading(28, 'Restauration de vos données...');
  notificationsEnabled = getStoredNotificationsEnabled();
  applyNotificationPrefsToInputs();
  applyCravingPlanInputs();
  renderWellbeingStatus();
  renderTrends();
  updateAccountSyncStatusLabel();
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
  renderRelapseStatus(today);
  updateAccountUI();
  initAccount().catch(() => undefined);
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
  updateCravingSessionCountLabel();
  updateCravingUiIdle();
  trackEvent('app_opened', { notificationsEnabled });
  flushAnalyticsToServer();
  syncAccountStateToServer();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      maybeSendPauseEncouragement();
      syncPushState();
      pullAccountStateFromServer().catch(() => undefined);
      syncAccountStateToServer();
      serviceWorkerRegistration?.update().catch(() => undefined);
    }
  });

  window.addEventListener('online', async () => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      await subscribeToPushNotifications();
      await syncPushState();
    }
    await pullAccountStateFromServer().catch(() => undefined);
    await syncAccountStateToServer();
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
    if (event.key === 'Escape' && launchAdModal?.classList.contains('open')) {
      closeLaunchAd();
    }
    if (event.key === 'Escape' && badgeModal.classList.contains('open')) {
      closeBadgeModal();
    }
    if (event.key === 'Escape' && badgesModal?.classList.contains('open')) {
      closeBadgesModal();
    }
    if (event.key === 'Escape' && updateModal?.classList.contains('open')) {
      closeUpdateModal();
    }
    if (event.key === 'Escape' && document.getElementById('accountModal')?.classList.contains('open')) {
      closeAccountModal();
    }
  });

  document.getElementById('accountButton')?.addEventListener('click', openAccountModal);
  document.getElementById('accountModalClose')?.addEventListener('click', closeAccountModal);
  document.getElementById('accountModalOverlay')?.addEventListener('click', closeAccountModal);
  document.getElementById('accountLoginTab')?.addEventListener('click', () => showAccountTab('login'));
  document.getElementById('accountRegisterTab')?.addEventListener('click', () => showAccountTab('register'));
  document.getElementById('accountLoginForm')?.addEventListener('submit', handleAccountLogin);
  document.getElementById('accountRegisterForm')?.addEventListener('submit', handleAccountRegister);
  document.getElementById('accountLogoutButton')?.addEventListener('click', handleAccountLogout);
  document.getElementById('accountRestoreButton')?.addEventListener('click', async () => {
    await pullAccountStateFromServer();
    updateAccountSyncStatusLabel();
    trackEvent('account_state_restored');
  });
  document.getElementById('exportPdfButton')?.addEventListener('click', exportProgressionPdf);
  firstLaunchCreateAccountBtn?.addEventListener('click', handleFirstLaunchCreateAccount);
  firstLaunchGuestBtn?.addEventListener('click', handleFirstLaunchGuest);

  // Initialize Flatpickr for date input
  flatpickr(quitDate, {
    locale: (typeof flatpickr !== 'undefined' && flatpickr.l10ns && flatpickr.l10ns.fr) ? flatpickr.l10ns.fr : 'fr',
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

  if (shouldShowFirstLaunchChoice()) {
    openFirstLaunchChoiceModal();
  } else {
    launchStartupFlow();
  }

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
