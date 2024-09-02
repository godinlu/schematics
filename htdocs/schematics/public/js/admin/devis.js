//=====================================================================================
//                      VARIABLE GLOBAL
var client_installateur = document.getElementById("client_installateur");
var articles = document.getElementById("articles");
const CLIENT = 'client';
const INSTALLATEUR = 'installateur';
const ARTICLES = 'articles';
//=====================================================================================

/**
 * cette fonction créer et renvoie un HTMLFieldSetElement avec comme contenue 
 * l'objetc passé en paramètre
 * @param {object} content 
 */
function createFieldSet(title, content){
    let fielset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    let ul = document.createElement("ul");

    legend.textContent = title;

    for (const key in content){
        let li = document.createElement("li");
        let mark = document.createElement("strong");
        mark.textContent = key + " : ";

        let text = document.createTextNode(content[key]);


        li.appendChild(mark);
        li.appendChild(text);
        ul.appendChild(li);
    }

    fielset.appendChild(legend);
    fielset.appendChild(ul);
    return fielset;

}

/**
 * 
 * @param {object[]} articles 
 */
function createTableArticles(articles){

    function createTr(array, type = "td"){
        let tr = document.createElement("tr");
        array.forEach(cell_text =>{
            let line = document.createElement(type);
            line.textContent = cell_text;
            tr.appendChild(line);
        });
        return tr;
    }

    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    //création du header
    let article_info = Object.keys(articles[0].article);
    article_info.push("Quantité");
    const header = createTr(article_info, "th");
    thead.appendChild(header);

    //création du tbody
    articles.forEach(line =>{
        let cells_value = Object.values(line.article);
        cells_value.push(line.quantity);

        const tr = createTr(cells_value);
        tbody.appendChild(tr);
    }); 

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;


}




/**
 * cette fonction affiche dans 
 * @param {HTMLTableRowElement} trElement 
 */
function showAdditionalData(trElement){
    //on récupère le json des données supplémentaires
    const data_additional = JSON.parse( trElement.getAttribute("data-additional") );

    //partie client et installateur
    const fieldset_client = createFieldSet(CLIENT, data_additional[CLIENT]);
    const fieldset_installateur = createFieldSet(INSTALLATEUR, data_additional[INSTALLATEUR]);

    client_installateur.innerHTML = "";
    client_installateur.appendChild(fieldset_client);
    client_installateur.appendChild(fieldset_installateur);

    //partie articles
    const fieldset_articles = createTableArticles(data_additional[ARTICLES]);
    articles.innerHTML = "";
    articles.appendChild(fieldset_articles);

}
//MAIN
function main(){
    document.querySelectorAll(".devis-row").forEach(trElement =>{
        trElement.addEventListener("click",() =>showAdditionalData(trElement));  
    });
}

document.addEventListener('DOMContentLoaded',main);