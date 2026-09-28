/* ============================================================
   app.js — entry point.
   Sets up the theme and navigation, then loads data.json and
   renders the content. If the fetch fails (e.g. the page was
   opened via file:// instead of a local server), shows a
   helpful error instead of a blank page.
   ============================================================ */
(function () {
  'use strict';

  function showLoadError(err) {
    var desktop = document.getElementById('desktop');
    if (!desktop) return;
    desktop.innerHTML = [
      '<section class="window">',
      '  <header class="titlebar"><h2 class="window-title">portfolio.exe — error</h2></header>',
      '  <div class="window-body">',
      '    <h3 style="margin-top:0">Couldn’t load content</h3>',
      '    <p>This site loads its content from <code>data.json</code>, which browsers block',
      '       when a page is opened directly from the file system (file://).</p>',
      '    <p>Run a small local server from this folder and open the page again:</p>',
      '    <pre class="code-block">python -m http.server 8000\n# then visit http://localhost:8000</pre>',
      '    <p class="error-detail"></p>',
      '  </div>',
      '</section>'
    ].join('\n');
    var detail = desktop.querySelector('.error-detail');
    if (detail) detail.textContent = 'Details: ' + String((err && err.message) || err);
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.Theme.init();
    window.Navigation.init();

    fetch('data.json')
      .then(function (response) {
        if (!response.ok) throw new Error('data.json returned HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        window.Renderer.renderAll(data);
      })
      .catch(showLoadError);
  });
})();