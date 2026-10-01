/* ============================================================
   navigation.js — start menu, taskbar links, window controls
   (minimize / close / restore), active-window state, scroll
   spy, and the taskbar clock.
   ============================================================ */
(function () {
  'use strict';

  var SECTION_IDS = ['about', 'experience', 'projects', 'freelance', 'skills', 'contact'];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var menu = null;
  var menuBtn = null;

  function openMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.classList.toggle('open', open);
  }

  function windowTitle(win) {
    var t = win.querySelector('.window-title');
    return t ? t.textContent.trim() : 'window';
  }

  function setMinimized(win, btn, minimized) {
    win.classList.toggle('minimized', minimized);
    btn.setAttribute('aria-pressed', String(minimized));
    btn.setAttribute('aria-label', (minimized ? 'Restore ' : 'Minimize ') + windowTitle(win) + ' window');
  }

  /* Only one "active" window at a time, like a real desktop. */
  function setActiveWindow(win) {
    document.querySelectorAll('.window.active').forEach(function (w) {
      if (w !== win) w.classList.remove('active');
    });
    if (win && !win.classList.contains('closed')) win.classList.add('active');
  }

  function initStartMenu() {
    menu = document.getElementById('start-menu');
    menuBtn = document.getElementById('start-btn');

    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openMenu(menu.hidden);
    });

    // Close when clicking anywhere outside the menu or the start button.
    document.addEventListener('pointerdown', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        openMenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        openMenu(false);
        menuBtn.focus();
      }
    });

    document.getElementById('restore-all').addEventListener('click', function () {
      SECTION_IDS.forEach(function (id) {
        var win = document.getElementById(id);
        if (win) win.classList.remove('closed', 'minimized');
      });
      document.querySelectorAll('.win-btn[data-action="minimize"]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', 'false');
      });
      openMenu(false);
    });
  }

  function initSectionLinks() {
    document.querySelectorAll('[data-target]').forEach(function (el) {
      el.addEventListener('click', function () {
        var win = document.getElementById(el.getAttribute('data-target'));
        if (!win) return;
        win.classList.remove('closed'); // reopen if it was closed
        setActiveWindow(win);
        openMenu(false);
        win.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        win.focus({ preventScroll: true });
      });
    });
  }

  function initWindowControls() {
    var desktop = document.getElementById('desktop');

    // Make windows focusable so navigation can move focus to them.
    SECTION_IDS.forEach(function (id) {
      var win = document.getElementById(id);
      if (win) win.setAttribute('tabindex', '-1');
    });

    desktop.addEventListener('click', function (e) {
      var btn = e.target.closest('.win-btn');
      if (!btn) return;
      var win = btn.closest('.window');
      if (!win) return;
      var action = btn.getAttribute('data-action');
      if (action === 'minimize') {
        setMinimized(win, btn, !win.classList.contains('minimized'));
      } else if (action === 'close') {
        win.classList.add('closed');
        win.classList.remove('active');
      }
    });

    // Double-clicking a title bar toggles minimize, like a real window.
    desktop.addEventListener('dblclick', function (e) {
      var bar = e.target.closest('.titlebar');
      if (!bar || e.target.closest('.win-btn')) return;
      var win = bar.closest('.window');
      var btn = win.querySelector('.win-btn[data-action="minimize"]');
      if (btn) setMinimized(win, btn, !win.classList.contains('minimized'));
    });
  }

  function initActiveWindow() {
    document.addEventListener('pointerdown', function (e) {
      var win = e.target.closest('.window');
      if (win) setActiveWindow(win);
    });
  }

  /* Highlight the taskbar button of the section in view. */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.task-link'));
    if (!('IntersectionObserver' in window) || links.length === 0) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('data-target') === entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    SECTION_IDS.forEach(function (id) {
      var win = document.getElementById(id);
      if (win) spy.observe(win);
    });
  }

  /* "Show more" toggle in the Freelance showcase. Rendered by renderer.js,
     so use delegation on #desktop. */
  function initWorksToggle() {
    document.getElementById('desktop').addEventListener('click', function (e) {
      var btn = e.target.closest('#works-toggle');
      if (!btn) return;
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open
        ? (window.WORKS_TOGGLE_LABELS && window.WORKS_TOGGLE_LABELS.less) || 'Show less'
        : (window.WORKS_TOGGLE_LABELS && window.WORKS_TOGGLE_LABELS.more) || 'Show more';
      if (open && !reduceMotion) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* If a content image is missing, swap its frame for a tidy placeholder
     tile instead of a broken-image icon. Delegated via capture so it also
     catches lazy-loaded images. */
  function initImageFallback() {
    document.addEventListener('error', function (e) {
      var img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (img.hasAttribute('data-avatar-img')) {
        var avatar = img.closest('.hero-avatar');
        if (avatar) avatar.parentNode.removeChild(avatar);
      } else if (img.hasAttribute('data-media-img')) {
        var frame = img.closest('[data-media]');
        if (frame) {
          frame.classList.add('media-missing');
          frame.removeChild(img);
          frame.setAttribute('role', 'img');
        }
      }
    }, true);
  }

  function initClock() {
    var clock = document.getElementById('clock');
    if (!clock) return;
    function tick() {
      var now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      clock.title = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
    tick();
    window.setInterval(tick, 1000);
  }

  function init() {
    initStartMenu();
    initSectionLinks();
    initWindowControls();
    initActiveWindow();
    initScrollSpy();
    initWorksToggle();
    initImageFallback();
    initClock();
  }

  window.Navigation = { init: init };
})();