/* ============================================================
   renderer.js — renders every section from data.json into the
   static window shells in index.html. All JSON text is escaped
   before insertion. Icons are inline SVG, so no icon files or
   font downloads are needed.
   ============================================================ */
(function () {
  'use strict';

  /* Escape any content coming from the JSON file. */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  }

  /* Inline SVG icon set (stroke-based, currentColor). */
  var ICONS = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>',
    mail:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2.5" y="3.5" width="11" height="9" rx="1.5"/><path d="m3 5 5 3.5L13 5"/></svg>',
    pin:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 14.5S3.5 10.9 3.5 7a4.5 4.5 0 0 1 9 0c0 3.9-4.5 7.5-4.5 7.5z"/><circle cx="8" cy="7" r="1.8"/></svg>',
    download:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 3v8m0 0 3-3m-3 3-3-3"/><path d="M3.5 12.5v1A1.5 1.5 0 0 0 5 15h6a1.5 1.5 0 0 0 1.5-1.5v-1"/></svg>',
    external:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10 3h3.5A1.5 1.5 0 0 1 15 4.5V8"/><path d="M14.5 2.5 8 9"/><path d="M12.5 9.5v3A1.5 1.5 0 0 1 11 14H4.5A1.5 1.5 0 0 1 3 12.5V6a1.5 1.5 0 0 1 1.5-1.5h3"/></svg>'
  };

  function icon(name, size) {
    var svg = ICONS[name] || '';
    if (size) svg = svg.replace('<svg ', '<svg width="' + size + '" height="' + size + '" ');
    return svg;
  }

  function setHTML(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function externalAttrs(url) {
    return /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
  }

  /* ---------- About (hero) ---------- */

  function renderProfile(profile) {
    var links = [
      { label: 'GitHub', href: profile.github, ic: 'github' },
      { label: 'LinkedIn', href: profile.linkedin, ic: 'linkedin' },
      { label: 'Email', href: 'mailto:' + profile.email, ic: 'mail' }
    ];
    if (profile.resume) links.push({ label: 'Resume', href: profile.resume, ic: 'download' });

    var html =
      '<h1 class="hero-name">' + esc(profile.name) + '</h1>' +
      '<p class="hero-role">' + esc(profile.role) + '</p>' +
      '<blockquote class="hero-tagline">' + esc(profile.tagline) + '</blockquote>' +
      '<p class="hero-location">' + icon('pin', 13) + esc(profile.location) + '</p>' +
      '<div class="hero-links">' +
      links.map(function (l) {
        return '<a class="btn" href="' + esc(l.href) + '"' + externalAttrs(l.href) + '>' +
          icon(l.ic, 14) + esc(l.label) + '</a>';
      }).join('') +
      '</div>';

    setHTML('about-content', html);
  }

  function renderAbout(about) {
    var paragraphs = (about.paragraphs || []).map(function (p) {
      return '<p>' + esc(p) + '</p>';
    }).join('');
    setHTML('about-content', document.getElementById('about-content').innerHTML +
      '<hr class="hero-divider">' +
      '<div class="about-text">' + paragraphs + '</div>');
  }

  /* ---------- Experience ---------- */

  function renderExperience(jobs) {
    var html = jobs.map(function (job) {
      var type = job.type ? ' <span class="job-type">(' + esc(job.type) + ')</span>' : '';
      var badge = job.current ? '<span class="badge-current">Current</span>' : '';
      var points = (job.points || []).map(function (p) {
        return '<li>' + esc(p) + '</li>';
      }).join('');
      return (
        '<article class="job">' +
          '<div class="job-head">' +
            '<div>' +
              '<h3 class="job-role">' + esc(job.role) + type + badge + '</h3>' +
              '<p class="job-company">' + esc(job.company) + '</p>' +
            '</div>' +
            '<p class="job-period">' + esc(job.period) + '</p>' +
          '</div>' +
          '<ul class="job-points">' + points + '</ul>' +
        '</article>'
      );
    }).join('');
    setHTML('experience-content', html);
  }

  /* ---------- Projects ---------- */

  function renderProjects(projects) {
    var html = '<div class="projects-grid">' + projects.map(function (p) {
      var chips = (p.tech || []).map(function (t) {
        return '<li class="chip">' + esc(t) + '</li>';
      }).join('');
      var links = '';
      if (p.github) {
        links += '<a class="text-link" href="' + esc(p.github) + '"' + externalAttrs(p.github) + '>' +
          icon('github', 13) + ' GitHub</a>';
      }
      if (p.demo) {
        links += '<a class="text-link" href="' + esc(p.demo) + '"' + externalAttrs(p.demo) + '>' +
          icon('external', 13) + ' Demo</a>';
      }
      return (
        '<article class="project">' +
          '<div class="project-titlebar"><span>' + esc(p.name) + '</span>' +
            '<span class="project-dots" aria-hidden="true"><i></i><i></i><i></i></span></div>' +
          '<div class="project-body">' +
            '<p class="project-desc">' + esc(p.description) + '</p>' +
            '<ul class="chip-row">' + chips + '</ul>' +
            (links ? '<p class="project-links">' + links + '</p>' : '') +
          '</div>' +
        '</article>'
      );
    }).join('') + '</div>';
    setHTML('projects-content', html);
  }

  /* ---------- Freelance ---------- */

  function renderFreelance(f) {
    var services = (f.services || []).map(function (s) {
      return '<li>' + esc(s) + '</li>';
    }).join('');
    var html =
      '<p class="freelance-intro">' + esc(f.intro) + '</p>' +
      '<ul class="dash-list">' + services + '</ul>' +
      '<div class="cta-box">' +
        '<h3 class="cta-title">' + esc(f.ctaTitle) + '</h3>' +
        '<a class="btn btn-primary" href="' + esc(f.ctaUrl) + '">' + esc(f.ctaLabel) + '</a>' +
      '</div>';
    setHTML('freelance-content', html);
  }

  /* ---------- Skills & education ---------- */

  function renderSkills(skills, education) {
    var groups = skills.map(function (g) {
      var chips = (g.items || []).map(function (item) {
        return '<li class="chip">' + esc(item) + '</li>';
      }).join('');
      return (
        '<div class="skill-group">' +
          '<h3>' + esc(g.group) + '</h3>' +
          '<ul class="chip-row">' + chips + '</ul>' +
        '</div>'
      );
    }).join('');

    var edu = '';
    if (education) {
      var eduChips = [education.period, education.gcpa, education.note]
        .filter(Boolean)
        .map(function (item) { return '<li class="chip">' + esc(item) + '</li>'; })
        .join('');
      edu =
        '<div class="education">' +
          '<h3 class="education-title">Education</h3>' +
          '<p class="edu-inst">' + esc(education.institution) + '</p>' +
          '<p class="edu-degree">' + esc(education.degree) + ' — ' + esc(education.field) + '</p>' +
          '<ul class="chip-row">' + eduChips + '</ul>' +
        '</div>';
    }

    setHTML('skills-content', groups + edu);
  }

  /* ---------- Contact ---------- */

  function renderContact(profile, contact) {
    var rows = [
      { label: 'Email', ic: 'mail', href: 'mailto:' + profile.email, text: profile.email },
      { label: 'GitHub', ic: 'github', href: profile.github, text: profile.githubLabel || profile.github },
      { label: 'LinkedIn', ic: 'linkedin', href: profile.linkedin, text: profile.linkedinLabel || profile.linkedin }
    ];
    if (profile.resume) {
      rows.push({ label: 'Resume', ic: 'download', href: profile.resume, text: 'Download resume' });
    }

    var html =
      '<h3 class="contact-heading">' + esc(contact.heading) + '</h3>' +
      '<p class="contact-sub">' + esc(contact.sub) + '</p>' +
      '<ul class="contact-list">' +
      rows.map(function (r) {
        return (
          '<li>' +
            '<span class="contact-label">' + icon(r.ic, 15) + esc(r.label) + '</span>' +
            '<a href="' + esc(r.href) + '"' + externalAttrs(r.href) + '>' + esc(r.text) + '</a>' +
          '</li>'
        );
      }).join('') +
      '</ul>';
    setHTML('contact-content', html);
  }

  function renderFooter(data) {
    var el = document.getElementById('site-footer');
    if (el && data.footer) el.textContent = data.footer;
  }

  /* ---------- Entry point ---------- */

  function renderAll(data) {
    renderProfile(data.profile);
    renderAbout(data.about);
    renderExperience(data.experience || []);
    renderProjects(data.projects || []);
    renderFreelance(data.freelance);
    renderSkills(data.skills || [], data.education);
    renderContact(data.profile, data.contact);
    renderFooter(data);
  }

  window.Renderer = { renderAll: renderAll };
})();