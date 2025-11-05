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
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.addEventListener('click', () => {
            const alreadyExpanded = item.classList.contains('expanded');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('expanded'));
            if (!alreadyExpanded) {
                item.classList.add('expanded');
            }
        });
    });

   

});