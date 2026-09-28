/* ============================================================
   theme.js — light/dark theme toggle with localStorage.
   Reads the theme set by the inline script in <head> and
   syncs the toggle button icon/label.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'xpfolio-theme';

  var SUN = '<svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"/></svg>';
  var MOON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7z"/></svg>';

  function preferred() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function saved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null; // e.g. private mode
    }
  }

  function apply(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) { /* ignore */ }
    }
    var holder = document.getElementById('theme-icon');
    var btn = document.getElementById('theme-toggle');
    if (holder) holder.innerHTML = theme === 'dark' ? SUN : MOON;
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function init() {
    apply(saved() || preferred(), false);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        apply(current === 'dark' ? 'light' : 'dark', true);
      });
    }

    // Follow the OS theme only while the user hasn't chosen explicitly.
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) {
      if (!saved()) apply(e.matches ? 'dark' : 'light', false);
    };
    if (media.addEventListener) media.addEventListener('change', onChange);
  }

  window.Theme = { init: init };
})();