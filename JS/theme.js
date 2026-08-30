/* ============================================================
   VIBE — GLOBAL THEME CONTROLLER
   Shared by every page.
   Storage key: vibeTheme
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "vibeTheme";

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;

    // Respect the user's OS preference the first time.
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyVibeTheme(theme) {
    const safeTheme = theme === "light" ? "light" : "dark";
    document.body.dataset.theme = safeTheme;

    // Keep compatibility with the existing Artist and Playlist CSS.
    document.body.classList.toggle("light-mode", safeTheme === "light");
    document.body.classList.toggle("light-theme", safeTheme === "light");

    document.querySelectorAll("[data-vibe-theme-toggle]").forEach((button) => {
      const icon = button.querySelector("i");

      if (icon) {
        icon.className =
          safeTheme === "dark"
            ? "bi bi-sun-fill"
            : "bi bi-moon-stars-fill";
      }

      button.setAttribute(
        "aria-label",
        safeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );

      button.setAttribute("title", safeTheme === "dark" ? "Light mode" : "Dark mode");
    });

    // Supports the project's existing button IDs.
    ["themeToggle", "themeButton", "theme-toggle"].forEach((id) => {
      document.querySelectorAll("#" + id).forEach((button) => {
        const icon = button.querySelector("i");

        if (icon) {
          icon.className =
            safeTheme === "dark"
              ? "bi bi-sun-fill"
              : "bi bi-moon-stars-fill";
        }

        button.setAttribute(
          "aria-label",
          safeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );

        button.setAttribute(
          "title",
          safeTheme === "dark" ? "Light mode" : "Dark mode"
        );
      });
    });
  }

  function showThemeToast(theme) {
    const message =
      theme === "light" ? "Light mode enabled ☀️" : "Dark mode enabled 🌙";

    if (typeof window.showVibeToast === "function") {
      window.showVibeToast(message);
      return;
    }

    const toast = document.getElementById("toastMessage");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__vibeThemeToastTimer);
    window.__vibeThemeToastTimer = setTimeout(
      () => toast.classList.remove("show"),
      1900
    );
  }

  function toggleVibeTheme() {
    const nextTheme =
      document.body.dataset.theme === "dark" ? "light" : "dark";

    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyVibeTheme(nextTheme);
    showThemeToast(nextTheme);
  }

  function initThemeControls() {
    applyVibeTheme(getSavedTheme());

    const buttons = new Set();

    ["themeToggle", "themeButton", "theme-toggle"].forEach((id) => {
      document.querySelectorAll("#" + id).forEach((button) => buttons.add(button));
    });

    document
      .querySelectorAll("[data-vibe-theme-toggle]")
      .forEach((button) => buttons.add(button));

    buttons.forEach((button) => {
      // Prevent duplicate listeners if a page includes more than one theme button.
      if (button.dataset.vibeThemeBound === "true") return;

      button.dataset.vibeThemeBound = "true";
      button.addEventListener("click", toggleVibeTheme);
    });
  }

  // Make the saved theme available immediately after body exists.
  if (document.body) {
    applyVibeTheme(getSavedTheme());
  }

  document.addEventListener("DOMContentLoaded", initThemeControls);

  // Expose small API for teammates.
  window.VibeTheme = {
    get: getSavedTheme,
    set: function (theme) {
      const safeTheme = theme === "light" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, safeTheme);
      applyVibeTheme(safeTheme);
    },
    toggle: toggleVibeTheme,
  };
})();
