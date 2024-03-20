// script for determining browser theme preferences and setting manifest and favicon accordingly

const usesDarkMode =
  window.matchMedia("(prefers-color-scheme: dark)").matches || false;
const favicon = document.querySelector('[rel="icon"]');
const manifest = document.querySelector('[rel="manifest"]');

function switchIcon(usesDarkMode) {
  if (usesDarkMode) {
    favicon.href = "%PUBLIC_URL%/favicon-dark.ico";
    manifest.href = "%PUBLIC_URL%/manifest-dark.json";
  } else {
    // default
    favicon.href = "%PUBLIC_URL%/favicon.ico";
    manifest.href = "%PUBLIC_URL%/manifest.json";
  }
}

// setup onchange listener
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => switchIcon(e.matches));

// call on page load
switchIcon(usesDarkMode);
