// Ensure all DOM manipulation happens after the document is fully loaded
document.addEventListener('DOMContentLoaded', async () => {

    /**
     * Asynchronously loads an HTML fragment into a specified DOM element.
     * @param {string} id The ID of the target HTML element.
     * @param {string} file The path to the HTML fragment file.
     */
    const loadHtmlFragment = async (id, file) => {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.innerHTML = html;
            } else {
                console.error(`Error: Element with ID '${id}' not found for file '${file}'.`);
            }
        } catch (error) {
            console.error(`Failed to load HTML fragment '${file}':`, error);
        }
    };

    // Load all HTML fragments sequentially
    await loadHtmlFragment('panel', '/components/panel.html');
    await loadHtmlFragment('footer', '/components/footer.html');

    // --- Theme Toggle (Dark Mode) Logic ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const bodyElement = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        bodyElement.classList.add('dark-mode');
    } else {
        bodyElement.classList.remove('dark-mode');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-mode');
            localStorage.setItem('theme', bodyElement.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    } else {
        console.warn("Warning: Theme toggle button with ID 'themeToggle' not found.");
    }

    // --- Accordion Logic ---
    // --- Projects accordion (single-open, uses .active) ---
const accordion = document.getElementById("projectAccordion");
if (accordion) {
  accordion.querySelectorAll(".accordion-item").forEach((item) => {
    item.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      accordion.querySelectorAll(".accordion-item").forEach((i) => i.classList.remove("active"));
      if (!isOpen) item.classList.add("active");
    });
  });
}

// --- Scroll reveal for any [data-reveal] element (scales to new panels) ---
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// --- Optional: dark mode toggle (wire a button with id="themeToggle") ---
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => document.body.classList.toggle("dark"));
}

   

});

