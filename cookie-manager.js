import { formatExpirationDate, suspiciousCookies } from './utils.js';

/**
 * Filters cookies by the selected filter type and value.
 */
export function filterCookies(cookies, hostname, contextOnly, filterType, filterValue) {
  let result = cookies;

  if (contextOnly) {
    result = result.filter(cookie =>
      cookie.domain.includes(hostname) ||
      hostname.includes(cookie.domain.replace(/^\./, ""))
    );
  }

  if (filterValue.trim() !== '') {
    const lowerValue = filterValue.toLowerCase();
    result = result.filter(cookie => {
      if (filterType === 'domain') {
        return cookie.domain.toLowerCase().includes(lowerValue);
      } else if (filterType === 'name') {
        return cookie.name.toLowerCase().includes(lowerValue);
      }
      return true;
    });
  }

  return result;
}

/**
 * Sorts cookies: suspicious ones first, then alphabetically by name.
 */
export function sortCookies(cookies) {
  return cookies.sort((a, b) => {
    const aSuspicious = suspiciousCookies.hasOwnProperty(a.name) ? 1 : 0;
    const bSuspicious = suspiciousCookies.hasOwnProperty(b.name) ? 1 : 0;
    if (bSuspicious - aSuspicious !== 0) return bSuspicious - aSuspicious;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Creates and returns a DOM element representing one cookie.
 */
export function createCookieElement(cookie) {
  const div = document.createElement("div");
  div.className = "cookie";
  const isSuspicious = suspiciousCookies.hasOwnProperty(cookie.name);

  div.innerHTML = `
    <div class="name" style="${isSuspicious ? 'color:red;font-weight:bold;' : ''}">${cookie.name}</div>
    <div><strong>Domain:</strong> ${cookie.domain}</div>
    <div><strong>Value:</strong> ${cookie.value}</div>
    <div><strong>Path:</strong> ${cookie.path}</div>
    <div><strong>Expiration:</strong> ${formatExpirationDate(cookie.expirationDate)}</div>
    <div><strong>Secure:</strong> ${cookie.secure}</div>
    <div><strong>HttpOnly:</strong> ${cookie.httpOnly}</div>
    <div><strong>SameSite:</strong> ${cookie.sameSite || 'N/A'}</div>
    ${isSuspicious ? `<div style="color:red;"><strong>Watch out:</strong> ${suspiciousCookies[cookie.name]}</div>` : ''}
    <button class="delete-btn">Delete</button>
  `;

  const deleteBtn = div.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    chrome.cookies.remove({
      name: cookie.name,
      url: `http${cookie.secure ? 's' : ''}://${cookie.domain.replace(/^\./, '')}${cookie.path}`
    }, (details) => {
      if (details) {
        console.log(`Cookie deleted: ${cookie.name}`);
        div.remove();
      } else {
        console.warn(`Failed to delete cookie: ${cookie.name}`);
      }
    });
  });

  return div;
}
