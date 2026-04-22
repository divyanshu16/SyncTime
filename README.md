# SyncTime

A Chrome extension for teams working across timezones. See who's awake, convert meeting times, and copy times to share — all from one popup.

## Install

1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `SyncTime` folder

The extension icon appears in your toolbar. Click it to open the popup.

> To generate the icon PNG files (required once before loading): `python3 generate-icons.py`

---

## What it does

### World clock

The popup opens with your pinned timezones as cards. Each card shows:

- **Status emoji** — 🟢 business hours (9am–7pm), 🌅 early/late fringe (7–9am, 7–10pm), 🌙 sleeping
- **City name** and timezone abbreviation (e.g. EDT, IST, JST)
- **Current time** — click to copy
- **Relative offset** from your local timezone (e.g. `−6h`, `+3:30`)
- **Date** — shows the next or previous day when relevant (Mumbai and Tokyo are already Thursday when Berlin is still Wednesday night)

Cards for sleeping timezones are dimmed so you can see at a glance who's available.

### Add timezones

Click **+ Add** at the bottom. Type a city, country, or timezone abbreviation. Results appear instantly with live times. Click a result to pin it.

Keyboard navigation works: arrow keys to move through results, Enter to add, Escape to close.

### Remove a timezone

Hover over any card — a small **×** button appears in the top-left corner. Click it to remove.

### Reorder

Drag cards up or down to reorder them.

### Rename a timezone

Click directly on the city name in a card. It becomes editable. Type a custom label (e.g. "NY Office", "Home"). Press **Enter** to save or **Escape** to cancel. Delete the label to restore the default city name.

---

## Convert a time

The converter at the bottom of the popup is always visible.

1. Click the **time field** (shows `--:--`) and type or pick a time
2. Select the **source timezone** from the dropdown (defaults to your local timezone; pinned zones appear at the top)
3. All cards update instantly to show what that time is in each timezone, with a `+1d` / `−1d` badge when the day changes

Click the **×** next to the converter to clear it and return to live time.

### Right-click to convert

Select any time text on a webpage (e.g. "3pm", "15:30", "3:30 PM EST") and right-click → **Convert with SyncTime**. The popup pre-fills the converter with that time when you open it.

Supported formats: `3pm`, `3:30 PM`, `15:30`, `09:00`, `10:30am`, ISO timestamps.

---

## Copy times

- **Click any time** on a card to copy that single time to your clipboard
- **Copy all** button (bottom-right) copies all pinned times as text, e.g.:

```
Berlin (CEST): 10:30 PM
New York (EDT): 4:30 PM
London (BST): 9:30 PM
Mumbai / Delhi (IST): 2:00 AM
Tokyo (JST): 5:30 AM
```

Paste directly into Slack, email, or a calendar invite.

---

## Settings

### 12h / 24h

Click the **12h** / **24h** pill in the top-left of the header to toggle between 12-hour (with AM/PM) and 24-hour format. Applies everywhere: cards, converter results, and search previews.

### Theme

Three buttons in the top-right:

- ☀️ **Light** — always light
- 🖥 **System** — follows your OS dark/light mode setting (default)
- 🌙 **Dark** — always dark

---

## Badge clock

The extension icon shows your current local hour in the toolbar badge (e.g. `10a`, `3p`). Updates every minute. No need to open the popup just to check the time.

---

## Permissions

| Permission | Why |
|-----------|-----|
| `storage` | Saves your pinned timezones, theme, and format preference |
| `contextMenus` | Adds "Convert with SyncTime" to the right-click menu |
| `alarms` | Updates the badge clock every minute |

No network requests. No data leaves your browser.
