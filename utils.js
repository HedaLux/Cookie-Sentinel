/**
 * Returns the base domain from a full hostname.
 */
export function getBaseDomain(hostname) {
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}

/**
 * Formats a cookie expiration date.
 */
export function formatExpirationDate(expiration) {
  if (!expiration) return "Session";
  const date = new Date(expiration * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Known suspicious cookies and their descriptions.
 */
export const suspiciousCookies = {
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
