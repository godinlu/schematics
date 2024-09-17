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

        if (sub_categories.length > 0) this.#create_categories_view(sub_categories);
        else if (Category.get(category_id).type == "categ") this.#create_articles_view(category_id);
        else if (Category.get(category_id).type == "custom") console.log("custom");
        
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
        this.modal_content.appendChild(this.#get_table_articles(articles));
    }

    /**
     * 
     * @param {article[]} articles 
     * @returns {HTMLTableElement}
     */
    static #get_table_articles(articles){
        const keys = ["ref", "label", "prix"];
        let table = document.createElement("table");

        // on créer l'entête du tableau avec des th
        let tr = document.createElement("tr");
        for (const key of keys) {
            let th = document.createElement("th");
            th.innerText = key;
            tr.appendChild(th);
        }
        table.appendChild(tr);

        // ensuite on ajoute les lignes du tableau avec les articles trouvées
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
            
            table.appendChild(tr);
        }
        return table;
    }

    /**
     * 
     * @param {Event} e 
     */
    static #handler_article_click(e){
        let tr = e.target.parentElement;

        if (Url.get_info()[0] == "ajouter"){
            const virtual_article = {"ref":tr.dataset.ref, "category_id":parseInt(tr.dataset.category_id),"tag":"added"};
            Devis.add_article(virtual_article);
        }
        Url.reset();
    }

}