/* ============================================================
   form.js — project request page.
   Language toggle (EN / BM) plus Netlify Forms submission with
   an inline success state. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  var LANG_KEY = 'xpfolio-lang';
  var FORM_NAME = 'project-request';

  /* ---------- Translations ---------- */

  var I18N = {
    en: {
      title: 'Project Request',
      lede: 'Tell me about the project and I\'ll reply with a quote, a rough timeline and next steps. No obligation.',
      step1Title: 'You fill in this form',
      step1Body: 'About three minutes. Only what matters.',
      step2Title: 'I reply within a day or two',
      step2Body: 'By email or WhatsApp, whichever you prefer.',
      step3Title: 'We agree on scope',
      step3Body: 'Clear price, timeline and deliverables before any work starts.',
      back: 'Portfolio',
      backLabel: 'Back to portfolio',
      langGroupLabel: 'Choose language',
      closeLabel: 'Close and go back',
      themeToDark: 'Switch to dark mode',
      themeToLight: 'Switch to light mode',
      grpContact: 'Contact details',
      fFullName: 'Full name',
      phName: 'e.g. Ahmad Rahman',
      fEmail: 'Email address',
      phEmail: 'you@company.com',
      fPhone: 'WhatsApp / phone number',
      phPhone: '+60 12-345 6789',
      optional: 'Optional',
      grpProject: 'Project & goals',
      fBusiness: 'Business or product name',
      phBusiness: 'e.g. Yadd\'s Cafe',
      fGoal: 'Main goal of this landing page',
      goalPick: 'Choose one…',
      goalLeads: 'Collect leads',
      goalSell: 'Sell a product',
      goalBook: 'Book calls or appointments',
      goalShowcase: 'Showcase work or portfolio',
      goalOther: 'Something else',
      grpContent: 'Content & assets',
      fCopy: 'Do you have the copy / text ready?',
      copyYes: 'Yes, I have it ready',
      copyNo: 'No, I need help',
      fBrand: 'Do you have brand assets (logo, colour scheme)?',
      brandYes: 'Yes, I have them',
      brandNo: 'No, need help designing',
      grpTech: 'Technical add-ons',
      fContactForm: 'Contact form connected to email or Google Sheets?',
      fSocial: 'Social media links or analytics embedded?',
      yes: 'Yes',
      no: 'No',
      grpTimeline: 'Timeline',
      fLaunch: 'Expected target launch date',
      fBrief: 'Anything else I should know?',
      phBrief: 'Pages you need, references you like, pages you already have…',
      submit: 'Send project request',
      note: 'Your details are only used to reply to this enquiry.',
      error: 'Something went wrong sending the form. Please try again, or email me directly.',
      successTitle: 'Request received',
      successBody: 'Thanks — your brief is in. I\'ll get back to you within a day or two. You can close this tab.',
      successMeta: 'Sent from the project request form.',
      successBack: 'Back to portfolio',
      footer: 'Built with Vanilla JS.'
    },

    bm: {
      title: 'Permintaan Projek',
      lede: 'Ceritakan tentang projek anda dan saya akan membalas dengan sebut harga, anggaran masa dan langkah seterusnya. Tanpa sebarang obligasi.',
      step1Title: 'Anda isi borang ini',
      step1Body: 'Kira-kira tiga minit. Hanya perkara yang penting.',
      step2Title: 'Saya balas dalam satu hingga dua hari',
      step2Body: 'Melalui e-mel atau WhatsApp, mana-mana yang anda suka.',
      step3Title: 'Kita bersetuju tentang skop',
      step3Body: 'Harga, jadual dan hasil yang jelas sebelum kerja bermula.',
      back: 'Portfolio',
      backLabel: 'Kembali ke laman portfolio',
      langGroupLabel: 'Pilih bahasa',
      closeLabel: 'Tutup dan kembali',
      themeToDark: 'Tukar ke mod gelap',
      themeToLight: 'Tukar ke mod cerah',
      grpContact: 'Maklumat hubungan',
      fFullName: 'Nama penuh',
      phName: 'cth. Ahmad Rahman',
      fEmail: 'Alamat e-mel',
      phEmail: 'anda@syarikat.com',
      fPhone: 'WhatsApp / nombor telefon',
      phPhone: '+60 12-345 6789',
      optional: 'Pilihan',
      grpProject: 'Projek & matlamat',
      fBusiness: 'Nama perniagaan atau produk',
      phBusiness: 'cth. Yadd\'s Cafe',
      fGoal: 'Matlamat utama laman pendaratan ini',
      goalPick: 'Pilih satu…',
      goalLeads: 'Mengumpul leads',
      goalSell: 'Menjual produk',
      goalBook: 'Membuat tempahan panggilan atau temujanji',
      goalShowcase: 'Memaparkan kerja atau portfolio',
      goalOther: 'Perkara lain',
      grpContent: 'Kandungan & aset',
      fCopy: 'Adakah teks / copy sudah sedia?',
      copyYes: 'Ya, sudah sedia',
      copyNo: 'Tidak, saya perlukan bantuan',
      fBrand: 'Adakah anda ada aset jenama (logo, warna)?',
      brandYes: 'Ya, ada',
      brandNo: 'Tidak, perlukan bantuan reka bentuk',
      grpTech: 'Tambahan teknikal',
      fContactForm: 'Borang hubungi disambungkan ke e-mel atau Google Sheets?',
      fSocial: 'Pautan media sosial atau analitik disertakan?',
      yes: 'Ya',
      no: 'Tidak',
      grpTimeline: 'Jadual masa',
      fLaunch: 'Sasaran tarikh pelancaran',
      fBrief: 'Ada apa-apa lagi yang saya perlu tahu?',
      phBrief: 'Halaman yang diperlukan, contoh yang anda suka, halaman yang anda sudah ada…',
      submit: 'Hantar permintaan projek',
      note: 'Maklumat anda hanya digunakan untuk membalas pertanyaan ini.',
      error: 'Ada masalah menghantar borang ini. Sila cuba lagi, atau e-mel saya terus.',
      successTitle: 'Permintaan diterima',
      successBody: 'Terima kasih — ringkasan anda telah diterima. Saya akan membalas dalam satu hingga dua hari. Anda boleh menutup tab ini.',
      successMeta: 'Dihantar dari borang permintaan projek.',
      successBack: 'Kembali ke portfolio',
      footer: 'Dibina dengan JavaScript tulen.'
    }
  };

  /* ---------- Helpers ---------- */

  function pick(lang) {
    return I18N[lang] || I18N.en;
  }

  function savedLang() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) { /* private mode */ }
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  /* ---------- Language ---------- */

  function applyLang(lang) {
    var dict = pick(lang);

    each(document.querySelectorAll('[data-i18n]'), function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    each(document.querySelectorAll('[data-i18n-placeholder]'), function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    each(document.querySelectorAll('[data-i18n-label]'), function (el) {
      var key = el.getAttribute('data-i18n-label');
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });

    document.documentElement.setAttribute('lang', lang === 'bm' ? 'ms' : 'en');

    each(document.querySelectorAll('.lang-btn'), function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    var langField = document.getElementById('lang-field');
    if (langField) langField.value = lang;

    applyThemeLabel(dict);
    saveLang(lang);
  }

  /* theme.js writes its own English aria-label, so we re-apply the
     localised one after it whenever the toggle is used. */
  function applyThemeLabel(dict) {
    dict = dict || pick(document.querySelector('.lang-btn[aria-pressed="true"]').getAttribute('data-lang'));
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-label', isDark() ? dict.themeToLight : dict.themeToDark);
  }

  function initLangToggle() {
    var initial = savedLang() === 'bm' ? 'bm' : 'en';

    each(document.querySelectorAll('.lang-btn'), function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
      });
    });

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        setTimeout(function () { applyThemeLabel(); }, 0);
      });
    }

    applyLang(initial);
  }

  /* ---------- Netlify Forms ---------- */

  function showError() {
    var box = document.getElementById('form-error');
    if (box) box.hidden = false;
  }

  function showSuccess() {
    var form = document.getElementById('request-form');
    var panel = document.getElementById('success');

    if (form) form.hidden = true;
    if (panel) panel.hidden = false;

    var heading = document.getElementById('success-title');
    if (heading) heading.focus();
  }

  function initForm() {
    var form = document.getElementById('request-form');
    if (!form) return;

    var btn = document.getElementById('submit-btn');
    var dateField = document.getElementById('launch-date');

    /* Don't let people pick a launch date in the past. */
    if (dateField && !dateField.value) {
      var now = new Date();
      var iso = now.getFullYear() + '-' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
        ('0' + now.getDate()).slice(-2);
      dateField.setAttribute('min', iso);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var errorBox = document.getElementById('form-error');
      if (errorBox) errorBox.hidden = true;
      if (btn) btn.disabled = true;

      /* Honeypot filled means a bot: pretend it worked, send nothing. */
      var trap = form.querySelector('[name="bot-field"]');
      if (trap && trap.value) {
        showSuccess();
        return;
      }

      /* form-name is sent explicitly; skip the hidden field in the loop. */
      var body = 'form-name=' + encodeURIComponent(FORM_NAME);
      each(form.querySelectorAll('input[name], select[name], textarea[name]'), function (field) {
        if (field.name === 'bot-field' || field.name === 'form-name') return;
        if (field.disabled || field.type === 'submit') return;
        body += '&' + encodeURIComponent(field.name) + '=' +
          encodeURIComponent(field.value == null ? '' : field.value);
      });

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          showSuccess();
        })
        .catch(function () {
          showError();
          if (btn) btn.disabled = false;
        });
    });
  }

  function initClose() {
    var closeBtn = document.getElementById('close-win');
    if (closeBtn) closeBtn.addEventListener('click', function () { window.location.href = '/'; });
  }

  function init() {
    /* theme.js only defines window.Theme — on index.html app.js starts it.
       This page has no app.js, so start it here before the language pass
       re-labels the toggle button. */
    if (window.Theme && typeof window.Theme.init === 'function') window.Theme.init();

    initLangToggle();
    initForm();
    initClose();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();