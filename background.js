'use strict';

// ── Context Menu ───────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'synctime-convert',
    title: 'Convert with SyncTime',
    contexts: ['selection'],
  });

  // Set up the badge alarm
  chrome.alarms.create('badge-tick', { periodInMinutes: 1 });
  updateBadge();
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== 'synctime-convert') return;
  const selected = (info.selectionText || '').trim();
  if (!selected) return;

  // Store the selected text for the popup to pick up on next open.
  // chrome.storage.session is cleared when the browser is closed.
  chrome.storage.session.set({ pendingConversion: selected });

  // Open the popup by simulating an action click (not possible from service
  // worker in MV3 without activeTab; instead we just set the pending text
  // and the user opens the popup naturally, which will pre-fill the converter).
  // If the popup is already open it will pick this up via a storage listener.
});

// ── Badge Clock ────────────────────────────────────────────────────────────
// Show the current local hour in the extension badge so users can glance
// without even opening the popup.

function updateBadge() {
  try {
    const now = new Date();
    const h = now.getHours();
    const suffix = h < 12 ? 'a' : 'p';
    const display = String(h % 12 || 12) + suffix; // "10a", "3p", "12p"
    chrome.action.setBadgeText({ text: display });
    chrome.action.setBadgeBackgroundColor({ color: '#5856d6' });
  } catch (e) {
    // Badge is a nice-to-have; never let it crash anything.
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'badge-tick') updateBadge();
});

// Also update badge when service worker starts (covers first-run case).
updateBadge();
