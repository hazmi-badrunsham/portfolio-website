fetch('/components/intro.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('intro').innerHTML = data;
  });
  
fetch('/components/projects.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('projects').innerHTML = data;
  });

fetch('/components/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  });




// Load HTML fragments into placeholders
document.addEventListener('DOMContentLoaded', async () => {
  const load = async (id, file) => {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  };

  await load('chapter-nav', 'components/nav.html');

  // Theme toggle (dark mode)
  const toggleBtn = document.getElementById('themeToggle');
  const body = document.body;
  if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
});


