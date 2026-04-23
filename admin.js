const STORAGE_ADMIN_KEY = 'admin-dashboard-key';

let allUsers = [];
let allSessions = [];
let allEvents = [];
let allFeedback = [];

function getStoredAdminKey() {
  return sessionStorage.getItem(STORAGE_ADMIN_KEY) || null;
}

function saveAdminKey(key) {
  sessionStorage.setItem(STORAGE_ADMIN_KEY, key);
}

function clearAdminKey() {
  sessionStorage.removeItem(STORAGE_ADMIN_KEY);
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toCsvValue(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename, headers, rows) {
  const csv = [
    headers.map(toCsvValue).join(','),
    ...rows.map(row => row.map(toCsvValue).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
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

function usersFiltered() {
  const term = (document.getElementById('usersSearch')?.value || '').toLowerCase().trim();
  if (!term) return allUsers;
  return allUsers.filter(u => (u.email || '').toLowerCase().includes(term) || (u.id || '').toLowerCase().includes(term));
}

function sessionsFiltered() {
  const term = (document.getElementById('sessionsSearch')?.value || '').toLowerCase().trim();
  if (!term) return allSessions;
  return allSessions.filter(s => (s.userId || '').toLowerCase().includes(term));
}

function eventsFiltered() {
  const term = (document.getElementById('eventsSearch')?.value || '').toLowerCase().trim();
  const type = (document.getElementById('eventsTypeFilter')?.value || '').trim();
  return allEvents.filter(e => {
    if (type && e.name !== type) return false;
    if (!term) return true;
    const metaText = JSON.stringify(e.meta || {}).toLowerCase();
    return (e.name || '').toLowerCase().includes(term)
      || (e.clientId || '').toLowerCase().includes(term)
      || metaText.includes(term);
  });
}

function feedbackFiltered() {
  const term = (document.getElementById('feedbackSearch')?.value || '').toLowerCase().trim();
  if (!term) return allFeedback;
  return allFeedback.filter(f => (f.message || '').toLowerCase().includes(term) || (f.contact || '').toLowerCase().includes(term));
}

function refreshEventTypeFilter() {
  const select = document.getElementById('eventsTypeFilter');
  if (!select) return;
  const previous = select.value;
  const types = [...new Set(allEvents.map(e => e.name).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  select.innerHTML = '<option value="">Tous les événements</option>' + types.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  if (types.includes(previous)) {
    select.value = previous;
  }
}

async function loadAllData() {
  try {
    allUsers = await makeAdminRequest('/api/admin/users');
    allSessions = await makeAdminRequest('/api/admin/sessions');
    const eventsData = await makeAdminRequest('/api/analytics/export');
    allEvents = eventsData.events || [];
    allFeedback = await makeAdminRequest('/api/admin/feedback');

    refreshEventTypeFilter();
    renderUsers();
    renderSessions();
    renderEvents();
    renderFeedback();

    document.getElementById('userCount').textContent = allUsers.length;
    document.getElementById('sessionCount').textContent = allSessions.length;
    document.getElementById('eventCount').textContent = allEvents.length;
    document.getElementById('feedbackCount').textContent = allFeedback.length;
  } catch (e) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerHTML = `<div class="error-message">Erreur: ${escapeHtml(e.message)}</div>`;
  }
}

function renderUsers() {
  const users = usersFiltered();
  const tbody = document.getElementById('usersBody');
  tbody.innerHTML = users
    .slice(0, 200)
    .map(u => `
      <tr>
        <td>${escapeHtml(u.email)}</td>
        <td><code style="font-size:0.8em;background:#f5f5f5;padding:2px 4px;border-radius:3px;">${escapeHtml((u.id || '').slice(0, 12))}</code></td>
        <td>${new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
      </tr>
    `)
    .join('');
  document.getElementById('usersLoading').hidden = true;
  document.getElementById('usersTable').hidden = false;
}

function renderSessions() {
  const sessions = sessionsFiltered();
  const tbody = document.getElementById('sessionsBody');
  const now = Date.now();
  tbody.innerHTML = sessions
    .slice(0, 200)
    .map(s => {
      const createdDate = new Date(s.createdAt);
      const expiresDate = new Date(s.expiresAt);
      const ageMs = now - createdDate.getTime();
      const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
      const ageDays = Math.floor(ageHours / 24);
      const ageStr = ageDays > 0 ? `${ageDays}j` : `${ageHours}h`;
      return `
        <tr>
          <td><code style="font-size:0.8em;background:#f5f5f5;padding:2px 4px;border-radius:3px;">${escapeHtml((s.userId || '').slice(0, 12))}</code></td>
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

function renderEvents() {
  const events = eventsFiltered();
  const tbody = document.getElementById('eventsBody');
  tbody.innerHTML = events
    .slice(-200)
    .reverse()
    .map(e => `
      <tr>
        <td><strong>${escapeHtml(e.name)}</strong></td>
        <td><code style="font-size:0.8em;background:#f5f5f5;padding:2px 4px;border-radius:3px;">${escapeHtml((e.clientId || '').slice(0, 12))}</code></td>
        <td>${new Date(e.receivedAt).toLocaleString('fr-FR')}</td>
        <td>${escapeHtml(JSON.stringify(e.meta || {}).slice(0, 120))}${JSON.stringify(e.meta || {}).length > 120 ? '...' : ''}</td>
      </tr>
    `)
    .join('');
  document.getElementById('eventsLoading').hidden = true;
  document.getElementById('eventsTable').hidden = false;
}

function renderFeedback() {
  const items = feedbackFiltered();
  const tbody = document.getElementById('feedbackBody');
  tbody.innerHTML = items
    .slice(-200)
    .reverse()
    .map(f => `
      <tr>
        <td>${escapeHtml((f.message || '').slice(0, 140))}${(f.message || '').length > 140 ? '...' : ''}</td>
        <td>${escapeHtml(f.contact || '-')}</td>
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

function exportUsersCsv() {
  const users = usersFiltered();
  downloadCsv(`users-${new Date().toISOString().split('T')[0]}.csv`, ['email', 'id', 'createdAt'], users.map(u => [u.email, u.id, u.createdAt]));
}

function exportSessionsCsv() {
  const sessions = sessionsFiltered();
  downloadCsv(`sessions-${new Date().toISOString().split('T')[0]}.csv`, ['userId', 'createdAt', 'expiresAt'], sessions.map(s => [s.userId, s.createdAt, s.expiresAt]));
}

function exportEventsCsv() {
  const events = eventsFiltered();
  downloadCsv(`events-${new Date().toISOString().split('T')[0]}.csv`, ['name', 'clientId', 'receivedAt', 'meta'], events.map(e => [e.name, e.clientId, e.receivedAt, JSON.stringify(e.meta || {})]));
}

function exportFeedbackCsv() {
  const items = feedbackFiltered();
  downloadCsv(`feedback-${new Date().toISOString().split('T')[0]}.csv`, ['message', 'contact', 'timestamp'], items.map(f => [f.message, f.contact, f.timestamp]));
}

window.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const exportEventsJsonButton = document.getElementById('exportEventsButton');
  const exportUsersCsvButton = document.getElementById('exportUsersCsvButton');
  const exportSessionsCsvButton = document.getElementById('exportSessionsCsvButton');
  const exportEventsCsvButton = document.getElementById('exportEventsCsvButton');
  const exportFeedbackCsvButton = document.getElementById('exportFeedbackCsvButton');
  const keyInput = document.getElementById('adminKey');

  loginButton?.addEventListener('click', handleLogin);
  logoutButton?.addEventListener('click', handleLogout);
  exportEventsJsonButton?.addEventListener('click', downloadEventsJson);
  exportUsersCsvButton?.addEventListener('click', exportUsersCsv);
  exportSessionsCsvButton?.addEventListener('click', exportSessionsCsv);
  exportEventsCsvButton?.addEventListener('click', exportEventsCsv);
  exportFeedbackCsvButton?.addEventListener('click', exportFeedbackCsv);

  document.getElementById('usersSearch')?.addEventListener('input', renderUsers);
  document.getElementById('sessionsSearch')?.addEventListener('input', renderSessions);
  document.getElementById('eventsSearch')?.addEventListener('input', renderEvents);
  document.getElementById('eventsTypeFilter')?.addEventListener('change', renderEvents);
  document.getElementById('feedbackSearch')?.addEventListener('input', renderFeedback);

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
