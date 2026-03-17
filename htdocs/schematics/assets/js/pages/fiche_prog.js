/**
 * @typedef {import('../core/session.store')}
 * @typedef {import('../core/utils')}
 */

document.addEventListener("DOMContentLoaded", () =>{
    // load data for the sessionStore
    const data = static_fiche_prog_data(sessionStore.formulaire, sessionStore.fiche_prog);

    // query DOM elements
    const fp_header = document.querySelector("#fp-header");
    const fp_title = document.querySelector("#fp-title");
    const fp_body = document.querySelector("#fp-body");

    // render title
    fp_title.innerText = data.title;

    // render header 
    fp_header.innerHTML = data.header.map(row => {
        return `<tr><td>${row[0]}</td><td>${get_html_field(row[0], row[1])}</td></tr>`;        
    }).join("");

    // render body
    fp_body.innerHTML = data.body.map(row =>{
        if (row.length === 1){
            return `<tr><td colspan="2">${row[0]}</td></tr>`
        }else{
            return `<tr><td>${row[0]}</td><td>${get_html_field(row[0], row[1])}</td></tr>`;
        }
    }).join("");


    // get all none static fields
    const fields = Object.fromEntries(
        [...document.querySelectorAll("[data-field]")]
            .map(el => [el.dataset.field, el])
    );

    // add blur event on each fields to save into session
    for (const [_, field] of Object.entries(fields)){
        field.addEventListener("blur", () =>{

            // save value of all fields into session
            sessionStore.fiche_prog = Object.fromEntries(
                Object.entries(fields).map(([_field_name, _field]) => [_field_name, _field.value])
            );
        });
    }

    // add the download pdf event
    document.querySelector("#btn_download_pdf").addEventListener("click", async () => {
        const response = await post_data(`generateSchema.php?image=fiche_prog&format=pdf`, static_fiche_prog_data(sessionStore.formulaire, sessionStore.fiche_prog));
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `fiche_prog-${sessionStore.name}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    });

});



/**
 * 
 * @param {string} field_name 
 * @param {string} field_value 
 * @returns {string}
 */
function get_html_field(field_name, field_value){
    switch(field_name){
        case "Délai":
            return `<input type="text" data-field="delai" value="${field_value}">`;
        case "N° de commande":
            return `<input type="text" data-field="numCommande" value="${field_value}">`;
        case "N° de série":
            return `<input type="text" data-field="numSerie" value="${field_value}">`;
        case "Commentaire":
            return `<textarea data-field="commentaire" placeholder="Écrivez ici...">${field_value}</textarea>`;
        default:
            return field_value;
    }
}