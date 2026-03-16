/**
 * @typedef {import('./formulaire_app.js')}
 */ 
/**
 * 
 */
document.addEventListener("DOMContentLoaded", () =>{
    // init accordion
    init_accordion();

    let app = new FormulaireApp();


    //////////////////////////////////////////////////////////////////////
    //                       HIGHLIGHT FIELD
    //////////////////////////////////////////////////////////////////////
    const highlight_field = (hash) => {
        document.querySelector("#AC_descriptionAffaire").click();
        const el = document.querySelector(`[data-field="${hash.slice(1)}"]`);
        if (el){
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
        }
    };
    if (location.hash){
        highlight_field(location.hash);
    }
    window.addEventListener("hashchange", () =>{
        highlight_field(location.hash);
    })

});


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





