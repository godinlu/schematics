class ListeChamp{
    static list_div = [];

    constructor(id_panel, id, type_choix){
        //on commence par récupérer tous les éléments
        this.panel = document.getElementById(id_panel);
        this.template = document.getElementById("tp_" + id);
        this.div = document.getElementById("div_" + id);
        this.button = document.getElementById("bt_add_" + id);
        this.type_choix = type_choix;
        this.nombre = 0;

        //ensuite on vérifie qu'ils existent bien sinon on renvoie une erreur
        if (!this.panel) throw new Error(`Le panel avec l'id ${id_panel} n'existe pas`);
        if (!this.template) throw new Error(`Le template avec l'id tp_${id} n'existe pas`);
        if (!this.div) throw new Error(`Le div avec l'id div_${id} n'existe pas`);
        if (!this.button) throw new Error(`Le bouton avec l'id bt_add_${id} n'existe pas`);

        this.button.addEventListener("click",(event) => {
            event.preventDefault(); //ici on enlève le comportement par défaut des button qui est de valider le formulaire
            this.ajouter();
        });
        ListeChamp.list_div.push(this.div);

    }

    ajouter(){
        this.nombre++;
        let element = new this.type_choix(this.nombre, this.template);
        this.div.appendChild(element.clone);
        if (this.panel.style.maxHeight) this.panel.style.maxHeight = this.panel.scrollHeight + "px";
    }

    /**
     * cette fonction statique renvoie les donées bien formaté de toute les ListeChamp
     */
    static getAllContent(){
        let data = {};
        ListeChamp.list_div.forEach((div) =>{
            const key = div.id.replace("div_","");
            data[key] = [];

            div.querySelectorAll("div").forEach((champ)=>{
                let obj = {};
                champ.querySelectorAll("select,input, textarea").forEach((element) =>{
                    const elem_key = element.id.replace(/_\d+/,"");
                    obj[elem_key] = getValue(element);
                });
                data[key].push(obj);
            });
        });
        return data;

    }
    /**
     * cette fonction initialise le ListeChamp identifié par son id avec le contenu passé
     * en paramètre
     * @param {string} id
     * @param {array} content
     */
    static setContent(id, content){
        let div = document.getElementById("div_" + id);
        if (!div) return;
        const button_add = div.nextElementSibling;
        const click = new Event("click");
    
        while (div.childElementCount !== content.length){
            //ici on est dans le cas ou il y a plus de champs qui est indiqué dans la variable de session
            //donc on supprime le dernière éléments en simulant un clique sur la croix
            if (div.childElementCount > content.length){
                div.lastElementChild.querySelector("i").dispatchEvent(click);
            //sinon on est dans le cas ou il faut rajouter un élément donc on simule un clique sur le boutton d'ajout
            }else{
                button_add.dispatchEvent(click);
            }
        }

        //ensuite on ajoute autant de champ qu'indique content pour ça on simule un clique sur le bouton d'ajout
        content.forEach((champ_data, i)=>{
            
            for (const key in champ_data){
                let element = document.getElementById(key+"_"+(i+1));
                setElementValue(element, champ_data[key], id);
            }
        });

    }


}

class Champ{
    constructor(num, template){
        this.num = num;
        this.clone = template.content.cloneNode(true);
        this.nodes = {};

        //ajout du numéro de l'id pour chaque éléments
        this.clone.querySelectorAll("[id]").forEach(element => {
            this.nodes[element.id] = element;
            element.id += "_" + this.num;
        });

        //ajout du bon label for pour chaque label 
        this.clone.querySelectorAll("[for]").forEach(element => {
            element.setAttribute("for", element.getAttribute("for") + "_" + this.num);
        });

        //ajout du l'ecouteur pour supprimer une ligne
        let i = this.clone.querySelector("i");
        if (!i) throw new Error("Le template doit contenir un élément <i> pour supprimer la ligne");
        i.addEventListener("click", () => {
            i.parentElement.remove();
            this.supprimer();
        });

    }

    supprimer(){}


}

/**
 * la class filtrage permet de gérer des applications de filtre sur des éléments
 * par exemple les champs capteurs utilise plusieurs couche de filtre avant de générer le bon capteur
 * chose à retenir la ligne ajouter au devis est identifé par l'id du dernier select
 */
class Filtrage{
    /**
     * 
     * @param {array} devis_row correspond aux ligne de devis qui doivent être filtré
     * @param {HTMLSelectElement[]} selects correspond à la liste dans l'odre des selects qui doivent filtrer
     * @param {string[]} filters_column correspond à la liste dans l'ordre des colonnes à filtrer dans le fichierCSV
     * @param {function[]} filters_functions correspond à la liste dans l'ordre des fonctions à appliquer sur les colonnes
     * @param {function[]} labelisation correspond à la liste dans l'ordre des labelisation des selects (les fonction peuvent être undefined)
     * @param {function[]} sort_functions correspond à la liste dans l'ordre des fonctions pour trier les select (les fonction peuvent être undefined)
     */
    constructor(devis_row ,selects, filters_column, filters_functions, labelisation, sort_functions = undefined){
        //on commence par vérifier que toute les listes sont de même taille
        if (selects.length != filters_column.length || selects.length != filters_functions.length || selects.length != labelisation.length){
            throw new Error("Les listes doivent être de même taille");
        } 

        //on initialise les variables
        this.devis_row = devis_row;
        this.selects = selects;
        this.filters_column = filters_column;
        this.filters_functions = filters_functions;
        this.labelisation = labelisation;
        this.sort_functions = sort_functions;

        //on initalise le premier select avec le premier filtre
        this.setSelectOption(0);
        //on ajout les handlerChange sur les selects
        this.selects.forEach((select, index) => {
            select.addEventListener("change", ()=>{
                this.handlerChange(index);
            });
        });

        this.handlerChange(0);



    }

    /**
     * cette fonction est appelé à chaque fois qu'un select change de valeur
     * @param {number} index 
     */
    handlerChange(index){

        if (index === this.selects.length - 1){
            //on est sur le dernier select donc on a appliqué toute les couches de filtre
            //on peut donc ajouter l'article au devis 
            //on récupère la ligne correspondante on utilise getSelectRows(index + 1) malgrès le fait que 
            //index soit le dernier car on a besoin de la ligne filtré par tout les filtres
            const lignes = this.getSelectRows(index + 1);
            if (lignes.length > 1){
                console.log(lignes);
                throw new Error("Il y a plus d'une ligne correspondante à tout les filtres");
            }
            const id = this.selects[index].id;
            devis.add( id, lignes[0]);
            VisualDevis.show();
        }else{
            //si ce n'est pas le dernier select on met à jour les options du select suivant et on appele sa fonction handlerChange
            this.setSelectOption(index + 1);

            let event = new Event("change");
            this.selects[index + 1].dispatchEvent(event);
        }
        
    }

    /**
     * cette fonction met à jour les options du select en fonction des filtres
     * @param {number} index 
     */
    setSelectOption(index){
        //on récupère les lignes filtré du select en question
        const selectRows =  this.getSelectRows(index);

        //console.log(selectRows);
        //ensuite on construit une liste avec les valeurs de la colonne correspondante qu'on applique à la fonction de filtre
        const values = selectRows.map((row) => this.filters_functions[index](row[this.filters_column[index]]));
        //puis on enlève les doublons et on trie la liste (que si les valeurs sont des nombres)
        let unique_values = [...new Set(values)];
        if (this.sort_functions !== undefined && this.sort_functions[index] !== undefined){
            unique_values.sort((a,b) =>{
                return this.sort_functions[index](a) - this.sort_functions[index](b);
            }); 
        }

        //une fois qu'on a bien la liste des valeurs on peut mettre à jour les options du select
        //en prennant en compte la labelisation si il y en a une
        let select = this.selects[index];
        select.innerHTML = "";
        unique_values.forEach((value) => {
            if (this.labelisation[index]) 
                select.addOption(this.labelisation[index](value), value);
            else
                select.addOption(value, value);
            
            
        });
        

    }

    /**
     * renvoie les lignes de devis pour le select identifié par son index
     * le fonction applique au lignes du devis tout le filtres des selects précédents
     * @param {number} index 
     * @returns {array} retourne les lignes filtré par les filtres précédent
     */
    getSelectRows(index){
        if (index === 0) return this.devis_row;

        const previous_rows = this.getSelectRows(index - 1);
        return previous_rows.filter((row) => {
            //on récupère la bonne valeur de la colonne grâce à filters_column
            const value = row[this.filters_column[index - 1]];

            //ensuite on applique la fonction de filtre à la valeur et on compare avec la valeur du select précédent
            return this.filters_functions[index - 1](value) === this.selects[index - 1].value;
        });
    }


    
}





//==================================================================================================
//=====================================  FONCTION UTILITAIRE  =====================================
//==================================================================================================

/**
 * 
 * @param {HTMLInputElement} checkbox input de type checkbox
 * @param {string} message message à afficher si la checkbox est désactivé
 * @param {boolean} checked valeur à mettre dans la checkbox
 */
function disabledCheckbox(checkbox, message = "",checked = undefined){
    //on réupère le checkbox et son label associé
    let label = checkbox.nextElementSibling;
    if (label.tagName != "LABEL") label = checkbox.previousElementSibling;
    if (label.tagName != "LABEL") throw new Error("Le label n'a pas été trouvé");

    //on désactive le checkbox
    checkbox.disabled = true;
    //on coche ou décoche le checkbox
    if (checked != undefined) checkbox.checked = checked;
    //on ajoute une classe pour le griser
    checkbox.classList.add("disabled");
    
    //on ajoute une classe pour griser le label
    label.classList.add("disabled");

    label.title = message; 
}

/**
 * 
 * @param {HTMLInputElement} checkbox input de type checkbox
 * @param {boolean} checked valeur à mettre dans la checkbox
 */
function enableCheckbox(checkbox, checked = undefined){
    //on récupère le checkbox et son label associé
    //on réupère le checkbox et son label associé
    let label = checkbox.nextElementSibling;
    if (label.tagName != "LABEL") label = checkbox.previousElementSibling;
    if (label.tagName != "LABEL") throw new Error("Le label n'a pas été trouvé");

    //on active le checkbox
    checkbox.disabled = false;
    //on coche ou décoche le checkbox
    if (checked != undefined) checkbox.checked = checked;
    //on ajoute une classe pour le griser
    checkbox.classList.remove("disabled");
    
    //on ajoute une classe pour griser le label
    label.classList.remove("disabled");
    label.title = ""; 
}

/**
 * cette fonction met à jour la valeur de l'élément qui peut soit être un input checkbox ou autre
 * ou alors être un select. Si la nouvelle valeur est différente de l'ancienne alors on simule un event 
 * sur l'élément
 * @param {HTMLSelectElement|HTMLInputElement} element 
 * @param {string|boolean} value 
 * @param {?string} id_champ
 */
function setElementValue(element, value, id_champ = undefined){
    const change = new Event("change");
    const input = new Event("input");
    const keyup = new Event("keyup");

    if (element.tagName === "SELECT")
    {
        const oldvalue = element.value;
        element.value = value;
        if (element.value === ""){
            if (id_champ){
                const id = element.id.replace(/_\d+/,'');
                element.value = default_devis_index[id_champ][0][id];
      
            }else{
                element.value = default_devis_index[element.id];
            }
            
        } 
        if (element.value === "") element.selectedIndex = 0;
        if (oldvalue !== value) 
            element.dispatchEvent(change);
    }
    else if (element.tagName === "INPUT" && element.type === "checkbox")
    {
        const oldvalue = element.checked;
        element.checked = value;
        if (oldvalue !== value)
            element.dispatchEvent(input);
    }
    else if (element.tagName === "INPUT")
    {
        const oldvalue = element.value;
        element.value = value;
        if (oldvalue !== value)
            element.dispatchEvent(input);
    }
    else if (element.tagName === "TEXTAREA"){
        const oldvalue = element.value;
        element.value = value;
        if (oldvalue !== value)
            element.dispatchEvent(keyup);
    }
}

/**
 * cette fonction met à jour les options du select avec le contenue de rows
 * si none_choice = true alors l'option aucun est ajouté
 * @param {HTMLSelectElement} select 
 * @param {JSON[]} rows 
 * @param {boolean} none_choice
 */
function set_options(select, rows, none_choice = false){
    // supprime toute les options du select
    while (select.options.length > 0) {
        select.remove(0);
    }

    // ajoute toutes les options avec comme valeur la ref de rows et comme label les label de rows
    for (var i = 0 ; i < rows.length ; i++){
        select.addOption(rows[i].label, rows[i].ref);
    }

    // si none_choice est vrai alors on rajoute l'option aucun en dernière option
    if (none_choice) select.addOption("Aucun","Aucun");
}

/**
 * Cette fonction complémente set_options pour aussi ajouter un event listener "change" avec 
 * comme fonction handler : eventSelectUpdateDevis
 * Et appele une fois eventSelectUpdateDevis.
 * Si none_choice = true alors l'option aucun est ajouté.
 * @param {HTMLSelectElement} select 
 * @param {JSON[]} rows 
 */
function activate_select(select, rows, none_choice = false){
    set_options(select, rows, none_choice)
    select.addEventListener("change", eventSelectUpdateDevis)
    eventSelectUpdateDevis.call(select)
}





