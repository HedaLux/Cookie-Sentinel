import { filterCookies, sortCookies, createCookieElement } from './cookie-manager.js';

let currentHostname = "";

function displayCookies() {
  const container = document.getElementById("cookieList");
  container.innerHTML = "Loading...";

  chrome.cookies.getAll({}, allCookies => {
    const contextOnly = document.getElementById("contextOnly").checked;
    const filterType = document.getElementById("filterType").value;
    const filterValue = document.getElementById("searchFilter").value;

    const filtered = filterCookies(allCookies, currentHostname, contextOnly, filterType, filterValue);
    const sorted = sortCookies(filtered);

    container.innerHTML = "";
    if (sorted.length === 0) {
      container.innerText = "No cookies found.";
      return;
    }

    sorted.forEach(cookie => {
      const el = createCookieElement(cookie);
      container.appendChild(el);
    });
  });
}

function init() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    try {
      const url = new URL(tabs[0].url);
      currentHostname = url.hostname;
      displayCookies();

      document.getElementById("contextOnly").addEventListener("change", displayCookies);
      document.getElementById("filterType").addEventListener("change", displayCookies);
      document.getElementById("searchFilter").addEventListener("input", debounce(displayCookies, 200));
    } catch (e) {
      console.error("Could not parse active tab URL", e);
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

document.addEventListener("DOMContentLoaded", init);
