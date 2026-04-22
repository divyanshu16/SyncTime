'use strict';

// ── Timezone Database ──────────────────────────────────────────────────────
// id: IANA name | city: display | region: country/area | search: extra terms
const TZ_DB = [
  // Americas
  { id: 'America/New_York',               city: 'New York',           region: 'USA East',          search: 'et est edt eastern boston miami washington philadelphia' },
  { id: 'America/Chicago',                city: 'Chicago',            region: 'USA Central',        search: 'ct cst cdt houston dallas minneapolis' },
  { id: 'America/Denver',                 city: 'Denver',             region: 'USA Mountain',       search: 'mt mst mdt salt lake phoenix' },
  { id: 'America/Los_Angeles',            city: 'Los Angeles',        region: 'USA West',           search: 'pt pst pdt pacific seattle san francisco sf portland' },
  { id: 'America/Anchorage',              city: 'Anchorage',          region: 'Alaska',             search: 'akt akst alaska' },
  { id: 'Pacific/Honolulu',               city: 'Honolulu',           region: 'Hawaii',             search: 'hst hawaii' },
  { id: 'America/Toronto',                city: 'Toronto',            region: 'Canada East',        search: 'montreal ottawa ontario' },
  { id: 'America/Vancouver',              city: 'Vancouver',          region: 'Canada West',        search: 'bc british columbia calgary' },
  { id: 'America/Sao_Paulo',              city: 'São Paulo',          region: 'Brazil',             search: 'brt rio brasilia' },
  { id: 'America/Mexico_City',            city: 'Mexico City',        region: 'Mexico',             search: 'cdmx guadalajara monterrey' },
  { id: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires',       region: 'Argentina',          search: 'art' },
  { id: 'America/Bogota',                 city: 'Bogotá',             region: 'Colombia',           search: 'cot' },
  { id: 'America/Lima',                   city: 'Lima',               region: 'Peru',               search: 'pet' },
  { id: 'America/Santiago',               city: 'Santiago',           region: 'Chile',              search: 'clt' },
  // Europe
  { id: 'Europe/London',                  city: 'London',             region: 'UK',                 search: 'gmt bst wet dublin edinburgh belfast' },
  { id: 'Europe/Paris',                   city: 'Paris',              region: 'France',             search: 'cet cest' },
  { id: 'Europe/Berlin',                  city: 'Berlin',             region: 'Germany',            search: 'cet cest frankfurt munich hamburg' },
  { id: 'Europe/Amsterdam',               city: 'Amsterdam',          region: 'Netherlands',        search: 'cet cest holland' },
  { id: 'Europe/Rome',                    city: 'Rome',               region: 'Italy',              search: 'cet cest milan' },
  { id: 'Europe/Madrid',                  city: 'Madrid',             region: 'Spain',              search: 'cet cest barcelona' },
  { id: 'Europe/Stockholm',               city: 'Stockholm',          region: 'Sweden',             search: 'cet cest norway oslo copenhagen denmark' },
  { id: 'Europe/Warsaw',                  city: 'Warsaw',             region: 'Poland',             search: 'cet cest' },
  { id: 'Europe/Zurich',                  city: 'Zurich',             region: 'Switzerland',        search: 'cet cest bern geneva' },
  { id: 'Europe/Lisbon',                  city: 'Lisbon',             region: 'Portugal',           search: 'wet west' },
  { id: 'Europe/Athens',                  city: 'Athens',             region: 'Greece',             search: 'eet eest' },
  { id: 'Europe/Helsinki',                city: 'Helsinki',           region: 'Finland',            search: 'eet eest estonia latvia lithuania' },
  { id: 'Europe/Kiev',                    city: 'Kyiv',               region: 'Ukraine',            search: 'eet eest' },
  { id: 'Europe/Moscow',                  city: 'Moscow',             region: 'Russia',             search: 'msk st petersburg' },
  { id: 'Europe/Istanbul',                city: 'Istanbul',           region: 'Turkey',             search: 'trt ankara' },
  { id: 'Europe/Prague',                  city: 'Prague',             region: 'Czech Republic',     search: 'cet cest vienna budapest slovakia' },
  // Middle East & Africa
  { id: 'Asia/Dubai',                     city: 'Dubai',              region: 'UAE',                search: 'gst abu dhabi gulf' },
  { id: 'Asia/Riyadh',                    city: 'Riyadh',             region: 'Saudi Arabia',       search: 'ast ksa jeddah' },
  { id: 'Asia/Qatar',                     city: 'Doha',               region: 'Qatar',              search: 'ast' },
  { id: 'Asia/Beirut',                    city: 'Beirut',             region: 'Lebanon',            search: 'eet eest' },
  { id: 'Asia/Jerusalem',                 city: 'Tel Aviv',           region: 'Israel',             search: 'ist idt' },
  { id: 'Africa/Cairo',                   city: 'Cairo',              region: 'Egypt',              search: 'eet' },
  { id: 'Africa/Lagos',                   city: 'Lagos',              region: 'Nigeria',            search: 'wat west africa' },
  { id: 'Africa/Nairobi',                 city: 'Nairobi',            region: 'Kenya',              search: 'eat east africa' },
  { id: 'Africa/Johannesburg',            city: 'Johannesburg',       region: 'South Africa',       search: 'sast cape town' },
  { id: 'Africa/Casablanca',              city: 'Casablanca',         region: 'Morocco',            search: 'wet' },
  // South & Central Asia
  { id: 'Asia/Kolkata',                   city: 'Mumbai / Delhi',     region: 'India (IST)',        search: 'ist india bangalore bengaluru hyderabad pune chennai kolkata' },
  { id: 'Asia/Colombo',                   city: 'Colombo',            region: 'Sri Lanka',          search: 'slst' },
  { id: 'Asia/Karachi',                   city: 'Karachi',            region: 'Pakistan',           search: 'pkt lahore islamabad' },
  { id: 'Asia/Dhaka',                     city: 'Dhaka',              region: 'Bangladesh',         search: 'bst' },
  { id: 'Asia/Kathmandu',                 city: 'Kathmandu',          region: 'Nepal',              search: 'npt' },
  { id: 'Asia/Tehran',                    city: 'Tehran',             region: 'Iran',               search: 'irst' },
  { id: 'Asia/Tashkent',                  city: 'Tashkent',           region: 'Uzbekistan',         search: 'uzt' },
  { id: 'Asia/Almaty',                    city: 'Almaty',             region: 'Kazakhstan',         search: 'almt astana' },
  // East & Southeast Asia
  { id: 'Asia/Singapore',                 city: 'Singapore',          region: 'Singapore',          search: 'sgt' },
  { id: 'Asia/Tokyo',                     city: 'Tokyo',              region: 'Japan',              search: 'jst osaka' },
  { id: 'Asia/Seoul',                     city: 'Seoul',              region: 'South Korea',        search: 'kst busan' },
  { id: 'Asia/Shanghai',                  city: 'Shanghai / Beijing', region: 'China',              search: 'cst shenzhen guangzhou' },
  { id: 'Asia/Hong_Kong',                 city: 'Hong Kong',          region: 'Hong Kong',          search: 'hkt' },
  { id: 'Asia/Taipei',                    city: 'Taipei',             region: 'Taiwan',             search: 'cst' },
  { id: 'Asia/Bangkok',                   city: 'Bangkok',            region: 'Thailand',           search: 'ict' },
  { id: 'Asia/Ho_Chi_Minh',               city: 'Ho Chi Minh City',   region: 'Vietnam',            search: 'ict hanoi saigon' },
  { id: 'Asia/Jakarta',                   city: 'Jakarta',            region: 'Indonesia',          search: 'wib bali surabaya' },
  { id: 'Asia/Manila',                    city: 'Manila',             region: 'Philippines',        search: 'pht' },
  { id: 'Asia/Kuala_Lumpur',              city: 'Kuala Lumpur',       region: 'Malaysia',           search: 'myt kl' },
  // Pacific & Oceania
  { id: 'Australia/Sydney',               city: 'Sydney',             region: 'Australia East',     search: 'aest aedt new south wales canberra' },
  { id: 'Australia/Melbourne',            city: 'Melbourne',          region: 'Australia East',     search: 'aest aedt victoria' },
  { id: 'Australia/Brisbane',             city: 'Brisbane',           region: 'Australia QLD',      search: 'aest queensland' },
  { id: 'Australia/Adelaide',             city: 'Adelaide',           region: 'Australia Central',  search: 'acst south australia' },
  { id: 'Australia/Perth',                city: 'Perth',              region: 'Australia West',     search: 'awst western australia' },
  { id: 'Pacific/Auckland',               city: 'Auckland',           region: 'New Zealand',        search: 'nzst nzdt wellington' },
  { id: 'Pacific/Fiji',                   city: 'Suva',               region: 'Fiji',               search: 'fjt' },
  // UTC
  { id: 'UTC',                            city: 'UTC',                region: 'Universal Time',     search: 'utc gmt zulu universal' },
];

// ── State ──────────────────────────────────────────────────────────────────
// pinned: [{id: string, label?: string}]
let state = {
  pinned: [],
  theme: 'system',
  format24h: false,
  converterFrom: '',
};
let convTime = '';   // HH:MM from <input type="time"> — not persisted

let tickTimer = null;

// ── Storage ────────────────────────────────────────────────────────────────
function save() {
  chrome.storage.local.set({ st2: JSON.stringify(state) });
}

function load(cb) {
  chrome.storage.local.get('st2', (d) => {
    if (d.st2) {
      try {
        const parsed = JSON.parse(d.st2);
        // Validate shape before merging — corrupt storage should not brick the popup
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.pinned)) state.pinned = parsed.pinned.filter(p => p && typeof p.id === 'string');
          if (parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system') state.theme = parsed.theme;
          if (typeof parsed.format24h === 'boolean') state.format24h = parsed.format24h;
          if (typeof parsed.converterFrom === 'string') state.converterFrom = parsed.converterFrom;
        }
      } catch (_) {}
    }
    cb();
  });
}

// ── Timezone helpers ───────────────────────────────────────────────────────
function localTz() { return Intl.DateTimeFormat().resolvedOptions().timeZone; }

function tzInfo(id) {
  return TZ_DB.find(t => t.id === id) || { id, city: id, region: '', search: '' };
}

function fmtTime(date, tzId, fmt24) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tzId, hour: 'numeric', minute: '2-digit', hour12: !fmt24,
    }).format(date);
  } catch (_) { return '--:--'; }
}

function fmtDate(date, tzId) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tzId, weekday: 'short', month: 'short', day: 'numeric',
    }).format(date);
  } catch (_) { return ''; }
}

function getAbbr(date, tzId) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tzId, timeZoneName: 'short',
    }).formatToParts(date);
    return parts.find(p => p.type === 'timeZoneName')?.value || '';
  } catch (_) { return ''; }
}

function getOffsetStr(date, tzId) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tzId, timeZoneName: 'shortOffset',
    }).formatToParts(date);
    const raw = parts.find(p => p.type === 'timeZoneName')?.value || 'UTC';
    return raw.replace('GMT', 'UTC').replace(/^UTC$/, 'UTC+0');
  } catch (_) { return ''; }
}

function parseOffsetMinutes(offsetStr) {
  const m = offsetStr.match(/([+-])(\d+)(?::(\d+))?/);
  if (!m) return 0;
  return (m[1] === '+' ? 1 : -1) * (parseInt(m[2]) * 60 + parseInt(m[3] || '0'));
}

// Returns "+5:30 from you", "-8h", "local", etc.
function relativeOffset(date, tzId) {
  const myTz = localTz();
  if (tzId === myTz) return 'local';
  try {
    const myOff = parseOffsetMinutes(getOffsetStr(date, myTz));
    const theirOff = parseOffsetMinutes(getOffsetStr(date, tzId));
    const diff = theirOff - myOff; // positive = ahead of me
    if (diff === 0) return 'same as you';
    const sign = diff > 0 ? '+' : '−'; // use minus sign, not hyphen
    const absDiff = Math.abs(diff);
    const h = Math.floor(absDiff / 60);
    const m = absDiff % 60;
    return m === 0 ? `${sign}${h}h` : `${sign}${h}:${String(m).padStart(2,'0')}`;
  } catch (_) { return ''; }
}

// Status: hour-of-day in given timezone → emoji + CSS class
function statusFor(date, tzId) {
  try {
    const hStr = new Intl.DateTimeFormat('en-US', {
      timeZone: tzId, hour: 'numeric', hour12: false,
    }).format(date);
    const h = parseInt(hStr);
    if (h >= 9 && h < 19) return { emoji: '🟢', cls: 'status-awake' };
    if ((h >= 7 && h < 9) || (h >= 19 && h < 22)) return { emoji: '🌅', cls: 'status-edge' };
    return { emoji: '🌙', cls: 'status-asleep' };
  } catch (_) { return { emoji: '⏰', cls: '' }; }
}

// ── Converter math ─────────────────────────────────────────────────────────
function convertedDate(timeStr, fromTzId) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  try {
    const now = new Date();
    // Get today's date in the source timezone
    const localDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTzId, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(now);
    const [yr, mo, dy] = localDate.split('-').map(Number);
    // First pass: offset at current moment
    const offsetMin1 = parseOffsetMinutes(getOffsetStr(now, fromTzId));
    const asIfUtc = Date.UTC(yr, mo - 1, dy, h, m, 0);
    const candidate = new Date(asIfUtc - offsetMin1 * 60000);
    // Second pass: re-check offset at the candidate instant (handles DST boundaries)
    const offsetMin2 = parseOffsetMinutes(getOffsetStr(candidate, fromTzId));
    if (offsetMin2 !== offsetMin1) {
      return new Date(asIfUtc - offsetMin2 * 60000);
    }
    return candidate;
  } catch (_) { return null; }
}

// Day difference relative to source timezone "today"
function dayDiff(convDate, targetTzId, fromTzId) {
  try {
    const fromParts = new Intl.DateTimeFormat('en-CA', { timeZone: fromTzId }).format(convDate).split('-').map(Number);
    const toParts   = new Intl.DateTimeFormat('en-CA', { timeZone: targetTzId }).format(convDate).split('-').map(Number);
    const fromMs = Date.UTC(fromParts[0], fromParts[1]-1, fromParts[2]);
    const toMs   = Date.UTC(toParts[0], toParts[1]-1, toParts[2]);
    return Math.round((toMs - fromMs) / 86400000);
  } catch (_) { return 0; }
}

// ── Theme ──────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
}

// ── Copy to clipboard helper ───────────────────────────────────────────────
function copyText(text, el) {
  navigator.clipboard.writeText(text).then(() => {
    if (el) {
      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1200);
    }
    showToast('Copied!');
  }).catch(() => showToast('Copy failed'));
}

let toastTimer = null;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
}

// ── Render cards ───────────────────────────────────────────────────────────
function renderCards() {
  const container = document.getElementById('cards');
  const now = new Date();
  const fromTz = state.converterFrom || localTz();
  const convDate = convertedDate(convTime, fromTz);
  const displayDate = convDate || now;
  const isConverting = !!convDate;

  container.innerHTML = '';

  if (state.pinned.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="currentColor" stroke-width="1.5"/>
          <path d="M14 8v6.5L18 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <div>Click <strong>Add</strong> below to add timezones</div>
      </div>`;
    return;
  }

  state.pinned.forEach(({ id: tzId, label }, idx) => {
    const info = tzInfo(tzId);
    const isLocal = tzId === localTz();
    const displayLabel = label || info.city;
    const abbr = getAbbr(displayDate, tzId);
    const timeStr = fmtTime(displayDate, tzId, state.format24h);
    const dateStr = fmtDate(displayDate, tzId);
    const relOff = relativeOffset(now, tzId);
    const { emoji, cls } = statusFor(displayDate, tzId);
    const dd = isConverting ? dayDiff(convDate, tzId, fromTz) : 0;
    const ddHtml = dd > 0
      ? `<span class="card-daydiff next">+${dd}d</span>`
      : dd < 0
        ? `<span class="card-daydiff prev">${dd}d</span>`
        : '';

    const card = document.createElement('div');
    card.className = `card ${cls}${isLocal ? ' local' : ''}`;
    card.draggable = true;
    card.dataset.idx = idx;

    // Build DOM to avoid innerHTML with user-editable label
    card.innerHTML = `
      <button class="card-remove" data-tz="${tzId}" aria-label="Remove">
        <svg viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
      <div class="card-status">${emoji}</div>
      <div class="card-label-row">
        <span class="card-label" contenteditable="true" spellcheck="false" data-tz="${tzId}" title="Double-click to rename"></span>
        <span class="card-abbr">${abbr}</span>
        ${isLocal ? '<span class="card-local-badge">YOU</span>' : ''}
      </div>
      <div class="card-date">${dateStr}</div>
      <div class="card-time-col">
        <span class="card-time${isConverting ? ' is-converted' : ''}" data-tz="${tzId}" data-time="${timeStr}">${timeStr}</span>
        <div class="card-time-meta">
          <span class="card-offset">${relOff}</span>
          ${ddHtml}
        </div>
      </div>`;

    // Set label text safely (no XSS)
    card.querySelector('.card-label').textContent = displayLabel;

    container.appendChild(card);
  });

  attachCardHandlers(container);
  setupDragAndDrop();
}

function attachCardHandlers(container) {
  // Remove buttons
  container.querySelectorAll('.card-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const tzId = btn.dataset.tz;
      state.pinned = state.pinned.filter(p => p.id !== tzId);
      save();
      renderCards();
      refreshConverterSelect();
    });
  });

  // Click time → copy
  container.querySelectorAll('.card-time').forEach(el => {
    el.addEventListener('click', () => {
      copyText(el.dataset.time, el);
    });
    el.title = 'Click to copy';
  });

  // Label inline rename
  container.querySelectorAll('.card-label').forEach(el => {
    const tzId = el.dataset.tz;

    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
      if (e.key === 'Escape') {
        const orig = state.pinned.find(p => p.id === tzId);
        el.textContent = (orig?.label) || tzInfo(tzId).city;
        el.blur();
      }
    });

    el.addEventListener('blur', () => {
      const newLabel = el.textContent.trim();
      const pin = state.pinned.find(p => p.id === tzId);
      if (!pin) return;
      const defaultLabel = tzInfo(tzId).city;
      if (newLabel === defaultLabel || newLabel === '') {
        delete pin.label;
        el.textContent = defaultLabel;
      } else {
        pin.label = newLabel;
      }
      save();
    });

    // Prevent drag when editing
    el.addEventListener('mousedown', e => e.stopPropagation());
    el.addEventListener('click', e => e.stopPropagation());
  });
}

// ── Drag & Drop ────────────────────────────────────────────────────────────
function setupDragAndDrop() {
  const cards = document.querySelectorAll('#cards .card');
  let dragIdx = null;

  cards.forEach(card => {
    card.addEventListener('dragstart', e => {
      dragIdx = parseInt(card.dataset.idx);
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('#cards .card').forEach(c => c.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', e => {
      e.preventDefault();
      if (card.dataset.idx !== String(dragIdx)) {
        document.querySelectorAll('#cards .card').forEach(c => c.classList.remove('drag-over'));
        card.classList.add('drag-over');
      }
    });
    card.addEventListener('drop', e => {
      e.preventDefault();
      const dropIdx = parseInt(card.dataset.idx);
      if (dragIdx !== null && dragIdx !== dropIdx) {
        const [removed] = state.pinned.splice(dragIdx, 1);
        state.pinned.splice(dropIdx, 0, removed);
        save();
        renderCards();
      }
    });
  });
}

// ── Search ─────────────────────────────────────────────────────────────────
function setupSearch() {
  const toggleBtn = document.getElementById('search-toggle');
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const closeBtn = document.getElementById('search-close');
  let focusedIdx = -1;

  function openSearch() {
    panel.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    input.value = '';
    results.innerHTML = '';
    setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    panel.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    focusedIdx = -1;
  }

  toggleBtn.addEventListener('click', () => {
    panel.hidden ? openSearch() : closeSearch();
  });
  closeBtn.addEventListener('click', closeSearch);

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) closeSearch();
  });

  function renderResults(q) {
    if (!q) { results.innerHTML = ''; return; }
    const lower = q.toLowerCase();
    const matches = TZ_DB.filter(tz => {
      if (state.pinned.some(p => p.id === tz.id)) return false;
      return tz.city.toLowerCase().includes(lower) ||
             tz.region.toLowerCase().includes(lower) ||
             tz.search.includes(lower) ||
             tz.id.toLowerCase().includes(lower);
    }).slice(0, 7);

    if (!matches.length) {
      results.innerHTML = '<div class="no-results">No timezones found</div>';
      return;
    }

    const now = new Date();
    results.innerHTML = '';
    matches.forEach((tz, i) => {
      const div = document.createElement('div');
      div.className = 'search-result';
      div.dataset.ridx = i;
      div.dataset.id = tz.id;
      div.setAttribute('role', 'option');
      const abbr = getAbbr(now, tz.id);
      const time = fmtTime(now, tz.id, state.format24h);
      div.innerHTML = `
        <div class="result-left">
          <div class="result-city"></div>
          <div class="result-region"></div>
        </div>
        <div class="result-right">
          <div class="result-time">${time}</div>
          <div class="result-abbr">${abbr}</div>
        </div>`;
      div.querySelector('.result-city').textContent = tz.city;
      div.querySelector('.result-region').textContent = tz.region;
      div.addEventListener('click', () => addPin(tz.id));
      results.appendChild(div);
    });
    focusedIdx = -1;
  }

  input.addEventListener('input', () => renderResults(input.value.trim()));

  input.addEventListener('keydown', e => {
    const items = [...results.querySelectorAll('.search-result')];
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); focusedIdx = Math.min(focusedIdx+1, items.length-1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusedIdx = Math.max(focusedIdx-1, 0); }
    else if (e.key === 'Enter' && focusedIdx >= 0) { e.preventDefault(); addPin(items[focusedIdx].dataset.id); return; }
    else if (e.key === 'Escape') { closeSearch(); return; }
    items.forEach((it, i) => it.classList.toggle('focused', i === focusedIdx));
  });
}

function addPin(tzId) {
  if (!tzId || state.pinned.some(p => p.id === tzId)) return;
  state.pinned.push({ id: tzId });
  save();
  renderCards();
  refreshConverterSelect();
  // close search
  const panel = document.getElementById('search-panel');
  if (panel) panel.hidden = true;
  const input = document.getElementById('search-input');
  if (input) { input.value = ''; document.getElementById('search-results').innerHTML = ''; }
}

// ── Converter ──────────────────────────────────────────────────────────────
function refreshConverterSelect() {
  const sel = document.getElementById('conv-from');
  if (!sel) return;
  const myTz = localTz();
  const cur = state.converterFrom || myTz;

  const pinned = state.pinned.map(p => tzInfo(p.id));
  const others = TZ_DB.filter(tz => !state.pinned.some(p => p.id === tz.id));

  const opt = (tz, selected) => {
    const o = document.createElement('option');
    o.value = tz.id;
    o.textContent = (tz.city) + ' (' + tz.region + ')';
    if (tz.id === cur) o.selected = true;
    return o;
  };

  sel.innerHTML = '';
  if (pinned.length) {
    const g = document.createElement('optgroup');
    g.label = 'Pinned';
    pinned.forEach(tz => g.appendChild(opt(tz)));
    sel.appendChild(g);
  }
  const g2 = document.createElement('optgroup');
  g2.label = 'All timezones';
  others.forEach(tz => g2.appendChild(opt(tz)));
  sel.appendChild(g2);
}

function updateConverterHint() {
  const hint = document.getElementById('conv-hint');
  if (!hint) return;
  if (!convTime) {
    hint.textContent = 'Enter a time to see it in all your zones.';
    hint.className = 'conv-hint';
    return;
  }
  const fromTz = state.converterFrom || localTz();
  const info = tzInfo(fromTz);
  const abbr = getAbbr(new Date(), fromTz);
  const cd = convertedDate(convTime, fromTz);
  if (!cd) { hint.textContent = ''; return; }
  const label = state.pinned.find(p => p.id === fromTz)?.label || info.city;
  hint.textContent = `Showing ${fmtTime(cd, fromTz, state.format24h)} ${abbr} (${label}) in all zones`;
  hint.className = 'conv-hint active';
}

function setupConverter() {
  const timeInput = document.getElementById('conv-time');
  const fromSel = document.getElementById('conv-from');
  const clearBtn = document.getElementById('conv-clear');

  refreshConverterSelect();

  timeInput.addEventListener('input', () => {
    convTime = timeInput.value;
    clearBtn.hidden = !convTime;
    renderCards();
    updateConverterHint();
  });

  fromSel.addEventListener('change', () => {
    state.converterFrom = fromSel.value;
    save();
    renderCards();
    updateConverterHint();
  });

  clearBtn.addEventListener('click', () => {
    convTime = '';
    timeInput.value = '';
    clearBtn.hidden = true;
    renderCards();
    updateConverterHint();
  });

  // Check for pending conversion from context menu
  chrome.storage.session.get('pendingConversion', (d) => {
    if (!d.pendingConversion) return;
    const parsed = parseTimeText(d.pendingConversion);
    // Only consume (delete) the pending value if we could parse it
    if (parsed) {
      chrome.storage.session.remove('pendingConversion');
      timeInput.value = parsed;
      convTime = parsed;
      clearBtn.hidden = false;
      renderCards();
      updateConverterHint();
    }
  });

  // React to context menu arriving while popup is open
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'session' && changes.pendingConversion?.newValue) {
      const text = changes.pendingConversion.newValue;
      const parsed = parseTimeText(text);
      if (parsed) {
        chrome.storage.session.remove('pendingConversion');
        timeInput.value = parsed;
        convTime = parsed;
        clearBtn.hidden = false;
        renderCards();
        updateConverterHint();
      }
    }
  });
}

// Parse selected text like "3pm", "3:30 PM", "15:30", "9 AM" → "HH:MM" (24h for input)
function parseTimeText(text) {
  // Priority 1: HH:MM with optional am/pm — catches "15:30", "3:30 PM", ISO datetimes.
  // Using this first prevents date strings like "2026-03-08 15:30" from matching "03".
  let m = text.match(/(?:^|[^\d])(\d{1,2}):(\d{2})\s*(am|pm)?\b/i);
  if (m) {
    let h = parseInt(m[1]);
    const min = parseInt(m[2]);
    const period = (m[3] || '').toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    if (h > 23 || min > 59) return null;
    return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
  }
  // Priority 2: bare number with explicit am/pm — catches "3pm", "9 AM".
  m = text.match(/\b(\d{1,2})\s*(am|pm)\b/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const period = m[2].toLowerCase();
  if (period === 'pm' && h < 12) h += 12;
  if (period === 'am' && h === 12) h = 0;
  if (h > 23) return null;
  return `${String(h).padStart(2,'0')}:00`;
}

// ── Copy All ───────────────────────────────────────────────────────────────
function setupCopyAll() {
  document.getElementById('copy-all').addEventListener('click', () => {
    if (state.pinned.length === 0) { showToast('No timezones pinned'); return; }
    const now = new Date();
    const fromTz = state.converterFrom || localTz();
    const displayDate = convertedDate(convTime, fromTz) || now;
    const parts = state.pinned.map(({ id, label }) => {
      const info = tzInfo(id);
      const displayLabel = label || info.city;
      const abbr = getAbbr(displayDate, id);
      const time = fmtTime(displayDate, id, state.format24h);
      return `${displayLabel} (${abbr}): ${time}`;
    });
    copyText(parts.join('\n'));
  });
}

// ── Clock tick ─────────────────────────────────────────────────────────────
// Aligned to the next minute boundary for accurate minute-level display.
function scheduleTick() {
  const now = Date.now();
  const msUntilNextMinute = 60000 - (now % 60000);
  setTimeout(() => {
    renderCards();
    updateConverterHint();
    tickTimer = setInterval(() => { renderCards(); updateConverterHint(); }, 60000);
  }, msUntilNextMinute);
}

// ── Init ───────────────────────────────────────────────────────────────────
function init() {
  // Theme
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.theme;
      applyTheme(state.theme);
      save();
    });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.theme === 'system') applyTheme('system');
  });
  applyTheme(state.theme);

  // Format toggle
  const fmtBtn = document.getElementById('format-toggle');
  fmtBtn.textContent = state.format24h ? '24h' : '12h';
  fmtBtn.classList.toggle('active', state.format24h);
  fmtBtn.addEventListener('click', () => {
    state.format24h = !state.format24h;
    fmtBtn.textContent = state.format24h ? '24h' : '12h';
    fmtBtn.classList.toggle('active', state.format24h);
    save();
    renderCards();
    refreshConverterSelect();
    updateConverterHint();
  });

  // Default pins on first run
  if (state.pinned.length === 0) {
    const myTz = localTz();
    const defaults = ['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo'];
    state.pinned = [{ id: myTz }, ...defaults.filter(id => id !== myTz).map(id => ({ id }))];
    save();
  }
  if (!state.converterFrom) {
    state.converterFrom = localTz();
  }

  renderCards();
  setupSearch();
  setupConverter();
  setupCopyAll();
  updateConverterHint();
  scheduleTick();
}

// ── Boot ───────────────────────────────────────────────────────────────────
load(init);
