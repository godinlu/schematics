/**
 * Initialize accordion behavior on a container
 * @param {HTMLElement} root
 */
function init_accordion(root = document) {
    const accordions = root.querySelectorAll(".accordion");

    accordions.forEach(acc => {
        acc.addEventListener("click", () => {
            acc.classList.toggle("active");

            const panel = acc.nextElementSibling;
            if (!panel) return;

            const isOpen = panel.style.maxHeight;

            panel.style.maxHeight = isOpen
                ? null
                : `${panel.scrollHeight}px`;
        });
    });
}