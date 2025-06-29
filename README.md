# 🍪 Cookie-Sentinel (Cookie-Viewer)

Cookie Sentinel is a lightweight Chrome Extension that lets you inspect, filter, and manage cookies stored in the browser, with a focus on those related to the current website.


## Features

* View all cookies stored in the browser.
* Focus optionally on cookies from the current tab.
* Filter by cookie name or domain.
* Highlight suspicious tracking cookies (Facebook, Google, etc.).
* Sort by relevance (suspicious first, then alphabetical).
* Delete individual cookies in one click.
* Supports SameSite, Secure, HttpOnly, and expiration info.


## Project Structure

```
.
├── popup.html             # Extension popup HTML
├── popup.js               # Main UI logic (as ES6 module)
├── cookie-manager.js      # Cookie rendering and filtering logic
├── utils.js               # Shared utility functions and constants
├── styles/
│   └── popup.css          # UI styling
├── icons/
│   └── icon.png           # Extension icon
└── manifest.json          # Chrome extension manifest
```

---

## Installation

1. Clone or download this repository.
2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project directory.
5. The Cookie Viewer icon will appear in your toolbar.


## Known Limitations

* Chrome-only (Manifest v3).

