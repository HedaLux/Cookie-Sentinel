function getBaseDomain(hostname) {
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}

function formatExpirationDate(expiration) {
  if (!expiration) return "Session";
  const date = new Date(expiration * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const suspiciousCookies = {
  "_fbp": "Facebook Pixel tracking",
  "_fbc": "Facebook Click tracking",
  "_ga": "Google Analytics client ID",
  "_gid": "Google Analytics session ID",
  "_gat": "Google Analytics rate limiter",
  "_gcl_au": "Google AdSense conversion",
  "IDE": "DoubleClick ads",
  "test_cookie": "DoubleClick bot detection",
  "ajs_anonymous_id": "Segment.io tracking",
  "amplitude_id": "Amplitude analytics",
  "yandexuid": "Yandex analytics ID",
  "1P_JAR": "Google tracking & consent",
  "NID": "Google user ID",
  "datr": "Facebook fingerprint",
  "fr": "Facebook ad personalization"
};

let currentHostname = ""; // global access

function displayCookies(hostname) {
  currentHostname = hostname;
  const container = document.getElementById("cookieList");
  container.innerHTML = "Loading...";

  chrome.cookies.getAll({}, allCookies => {
    const showContextOnly = document.getElementById("contextOnly").checked;
    let relevantCookies = allCookies;

    if (showContextOnly) {
      relevantCookies = allCookies.filter(cookie =>
        cookie.domain.includes(hostname) ||
        hostname.includes(cookie.domain.replace(/^\./, ""))
      );
    }

    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();

    if (searchValue !== "") {
      relevantCookies = relevantCookies.filter(cookie =>
        cookie.domain.toLowerCase().includes(searchValue)
      );
    }

    container.innerHTML = "";

    if (relevantCookies.length === 0) {
      container.innerText = "No cookies found.";
      return;
    }

    relevantCookies.sort((a, b) => {
      const aSuspicious = suspiciousCookies.hasOwnProperty(a.name) ? 1 : 0;
      const bSuspicious = suspiciousCookies.hasOwnProperty(b.name) ? 1 : 0;
      return bSuspicious - aSuspicious;
    });

    relevantCookies.forEach(cookie => {
      const div = document.createElement("div");
      div.className = "cookie";
      const isSuspicious = suspiciousCookies.hasOwnProperty(cookie.name);

      div.innerHTML = `
        <div class="name" style="${isSuspicious ? 'color:red;font-weight:bold;' : ''}">
          ${cookie.name}
        </div>
        <div><strong>Value:</strong> ${cookie.value}</div>
        <div><strong>Domain:</strong> ${cookie.domain}</div>
        <div><strong>Path:</strong> ${cookie.path}</div>
        <div><strong>Expiration:</strong> ${formatExpirationDate(cookie.expirationDate)}</div>
        <div><strong>Secure:</strong> ${cookie.secure}</div>
        <div><strong>HttpOnly:</strong> ${cookie.httpOnly}</div>
        ${isSuspicious ? `<div style="color:red;"><strong>⚠️ Watch out:</strong> ${suspiciousCookies[cookie.name]}</div>` : ''}
        <button class="delete-btn">Delete</button>
      `;

      const deleteBtn = div.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        chrome.cookies.remove({
          name: cookie.name,
          url: `http${cookie.secure ? 's' : ''}://${cookie.domain.replace(/^\./, '')}${cookie.path}`
        }, (details) => {
          if (details) {
            console.log(`✅ Cookie deleted: ${cookie.name}`);
            div.remove();
          } else {
            console.warn(`❌ Failed to delete cookie: ${cookie.name}`);
          }
        });
      });

      container.appendChild(div);
    });
  });
}

// Main initialization
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const url = new URL(tabs[0].url);
  currentHostname = url.hostname;
  displayCookies(currentHostname);

  const checkbox = document.getElementById("contextOnly");
  checkbox.addEventListener("change", () => {
    displayCookies(currentHostname);
  });

  document.getElementById("searchInput").addEventListener("input", () => {
    displayCookies(currentHostname);
  });
});
