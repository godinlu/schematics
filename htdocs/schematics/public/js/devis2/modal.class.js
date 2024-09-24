/**
 * CLass statique permettant de gérer l'apparition et le
 * contenu de la fenêtre modale
 */
class Modal{
    /**
     * @type {HTMLDivElement} modal_window
     */
    static modal_window;
    /**
     * @type {HTMLDivElement} modal_content
     */
    static modal_content;


    static update(){
        if (window.location.href == Url.default_url){
            // on cache la fenêtre modale
            modal_window.style.display = "none";
        }else{
            // on affiche la fenêtre modale et on met à jour son contenue
            modal_window.style.display = "block";
            this.#update_content();
        }
    }

    /**
     * 
     * @param {HTMLDivElement} modal_window 
     */
    static init(modal_window){
        this.modal_window = modal_window;
        this.modal_content = this.modal_window.querySelector("#modal_content");

        // Fermer la modale en cliquant en dehors
        window.onclick = function(event) {
            if (event.target == modal_window) {
            modal_window.style.display = "none";
            Url.reset();
            }
        }

        // Fermer la modal_window
        this.modal_window.querySelector("span").onclick = function() {
            modal_window.style.display = "none";
            Url.reset();
        }
    }

    static #update_content(){
        this.modal_content.innerHTML = "";
        const category_path = Url.get_category_path();
        const category_id = category_path[category_path.length - 1];
        const sub_categories = Category.get_sub_categories(category_id);

        let title = document.createElement("h3");
        title.innerText = Category.get(category_id).name;
        this.modal_content.appendChild(title);

        if (sub_categories.length > 0 && Category.get(category_id).type == "categ"){
            this.#create_categories_view(sub_categories);
        } 
        else if (Category.get(category_id).type == "categ") this.#create_articles_view(category_id);
        else if (Category.get(category_id).type == "custom") new CustomWindow(this.modal_content, category_id);
        
    }

    static #create_categories_view(sub_categories){
        let table = document.createElement("table");

        for (let sub_categ of sub_categories){
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let button = Utils.create_button(sub_categ.name, sub_categ.short_name, (e) =>{
                Url.add("/"+e.target.value);
            });
            
            td.appendChild(button);
            tr.appendChild(td);
            table.appendChild(tr);
        }

        this.modal_content.appendChild(table);
    }

    static #create_articles_view(category_id){
        const articles = Devis.get_articles_by_categ(category_id);
        this.modal_content.appendChild(this.get_table_articles(articles));
    }

    /**
     * 
     * @param {article[]} articles 
     * @returns {HTMLTableElement}
     */
    static get_table_articles(articles){
        const keys = ["ref", "label", "prix"];
        let table = document.createElement("table");
        
        // on créer l'entête du tableau avec des th
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        for (const key of keys) {
            let th = document.createElement("th");
            th.innerText = key;
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        // ensuite on ajoute les lignes du tableau avec les articles trouvées
        let tbody = document.createElement("tbody");
        for (const article of articles) {
            let tr = document.createElement("tr");
            tr.addEventListener("click",this.#handler_article_click);
            tr.dataset.ref = article.ref;
            tr.dataset.category_id = article.category_id;
            for (const key of keys) {
                let td = document.createElement("td");
                td.innerText = article[key];
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        return table;
    }

    /**
     * 
     * @param {Event} e 
     */
    static #handler_article_click(e){
        let tr = e.target.parentElement;

        if (Url.get_info()[0] == "ajouter"){
            const action_add = {"type":"add", "ref":tr.dataset.ref};
            Actions.push(action_add);
        }else if (Url.get_info()[0] == "modifier"){
            const action_edit = {"type":"edit", "old_ref":Url.get_info()[1], "new_ref":tr.dataset.ref};
            Actions.push(action_edit);
        }
        Url.reset();
    }

}

class CustomWindow{
    /**
     * @param {HTMLDivElement} modal_content
     * @param {int} category_id 
     */
    constructor(modal_content, category_id){
        this.template = document.getElementById(`tp_categ_${category_id}`);
        this.articles = Devis.get_articles_by_categ(category_id);
        this.modal_content = modal_content;
        if (category_id == 12) this.champ_capteur();
        else if (category_id == 19) this.flexible_inox();
        else if (category_id == 20) this.kit_raccordement();
    }

    champ_capteur(){
        this.modal_content.appendChild(this.template.content.cloneNode(true));
        this.capteur_filters = document.getElementsByClassName("capteur-filter");
        this.div_articles = document.getElementById("div_12_articles");

        // Lors d'un modification d'un des filtre alors on appelle la fonction 
        // #set_filtered_capteurs
        for (const capteur_filter of this.capteur_filters) {
            if (capteur_filter.tagName === "INPUT") {
                capteur_filter.addEventListener("input",this.#set_filtered_capteurs.bind(this));
            }
            if (capteur_filter.tagName === "SELECT"){
                capteur_filter.addEventListener("change",this.#set_filtered_capteurs.bind(this));
            }
            
        }
        // on appelle une fois cette fonction pour initialiser les articles
        this.#set_filtered_capteurs();
    }

    /**
     * Cette fonction est appelé lorsqu'un filtre change de valeur.
     * Elle filtres les capteurs en fonction de tous les filtres qui ne sont pas à
     * zéro ou à aucun, puis elle met à jour les capteurs.
     */
    #set_filtered_capteurs(){
        let articles = this.articles;
        for (const capteur_filter of this.capteur_filters) {
            if (capteur_filter.value != "Aucun" && capteur_filter.value != 0){
                // on récupère la fonction de filtre associé 
                const filter_func =  CapteurFilter[capteur_filter.dataset.filter_func];
                // on filtre les capteurs avec la fonction associé et la valeur du filtre 
                articles = articles.filter(row => filter_func(row.ref) == capteur_filter.value);
            }
        }
        this.div_articles.innerHTML = "";
        this.div_articles.appendChild(Modal.get_table_articles(articles));
    }

    flexible_inox(){
        this.modal_content.appendChild(this.template.content.cloneNode(true));
        this.flexible_filters = document.getElementsByClassName("flexible-filter");
        this.div_articles = document.getElementById("div_19_articles");
        for (const flexible_filter of this.flexible_filters) {
            flexible_filter.addEventListener("change",this.#set_filtered_flexible.bind(this));
        }
        this.#set_filtered_flexible();
    }

    #set_filtered_flexible(){
        let articles = this.articles;
        for (const flexible_filter of this.flexible_filters) {
            if (flexible_filter.value != "Aucun"){
                // on filtre les capteurs avec la fonction associé et la valeur du filtre 
                articles = articles.filter(row => (new RegExp(flexible_filter.value)).test(row.label));
            }
        }
        this.div_articles.innerHTML = "";
        this.div_articles.appendChild(Modal.get_table_articles(articles));
    }

    kit_raccordement(){
        console.log("kit");
    }
}

class CapteurFilter{
    static get_type(ref){
        return ref.match(/^([^-]+)/)[1];
    }

    static get_nb_capteur(ref){
        return ref.match(/\d+(?=-0)|[1-9]+$/)[0];
    }

    /**
     * Renvoie le nombre de rangé de capteurs d'une référence
     * @param {string} ref 
     * @returns {string}
     */
    static get_nb_range(ref){
        let nb_range = 0;
        ref.split("-").forEach(sub_str => {
            let int_str = parseInt(sub_str);
            if (!isNaN(int_str) && int_str > 0 && int_str < 45) nb_range ++;
        });
        return String(nb_range);
    }

    /**
     * Renvoie l'inclinaison en fonction de la ref ou "Aucun"
     * si l'inclinaison n'existe pas.
     * @param {string} ref 
     * @returns {string}
     */
    static get_inclinaison(ref){
        if (/45/.test(ref)) return "45 degrés";
        else if (/70/.test(ref)) return "70 degrés";
        else return "Aucun";
    }

    static get_type_pose(ref){
        try{
            return ref.match(/.*?-(ST|CT|CS|CM|V)-/)[1];
        }catch(e){
            //si le type de pose n'est pas trouvé alors c'est que c'est un capteur intégré
            return "I";
        }
    }

    static get_type_toiture(ref){
        try{
            return ref.match(/-(A|T|TO|R)-/)[1];
        }catch{
            return "Aucun";
        }
    }
}