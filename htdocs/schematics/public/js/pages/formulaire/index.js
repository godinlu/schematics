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





