class ArticleRow{
    /**
     * 
     * @param {article} article 
     * @param {boolean} editable_qte 
     * @param {boolean} editable_price 
     * @param {boolean} editable 
     * @param {boolean} removeable 
     * @returns {HTMLTableRowElement}
     */
    constructor(
        article,
        editable_qte = true,
        editable_price = false,
        editable = true,
        removeable = true
    ){
        this.tr = document.createElement("tr");
        this.tr.id = "article_" + article.ref;
        this.tr.classList.add("article");
        this.tr.dataset.ref = article.ref;
        this.ref = article.ref;

        this.#create_ref_col(article.ref);
        this.#create_label_col(article.label);
        this.#create_qte_col(editable_qte);
        this.#create_price_col(article.prix, editable_price);
        this.#create_edit_col(editable, removeable, article.ref, article.category_id);

        return this.tr;

    }

    /**
     * Ajoute la colone ref dans la ligne.
     * @param {string} ref 
     */
    #create_ref_col(ref){
        let td = document.createElement("td");
        td.classList.add("ref");
        td.innerText = ref;
        this.tr.appendChild(td);
    }

    /**
     * Ajoute la colone label dans la ligne.
     * @param {string} label 
     */
    #create_label_col(label){
        let td = document.createElement("td");
        td.classList.add("label");
        td.innerText = label;
        this.tr.appendChild(td);
    }

    /**
     * Ajoute la colone quantité dans la ligne.
     * Si editable_qte = true alors ajoute un input type number pour mettre à jour la quantité.
     * @param {boolean} editable_qte 
     */
    #create_qte_col(editable_qte){
        let td = document.createElement("td");
        td.classList.add("qte");
        if (editable_qte){
            let input = document.createElement("input");
            input.type = "number";
            input.name = "qte_" + this.ref;
            input.min = 1;
            input.value = 1;
            td.appendChild(input);
        }else{
            td.innerText = qte;
        }
        this.tr.appendChild(td);
    }

    /**
     * Ajoute la colone prix dans la ligne.
     * Si editable_price = true alors ajoute un input type number pour mettre à jour le prix.
     * @param {Float32Array} price 
     * @param {boolean} editable_price 
     */
    #create_price_col(price, editable_price){
        let td = document.createElement("td");
        td.classList.add("price");
        if (editable_price){
            let input = document.createElement("input");
            input.type = "number";
            input.name = "price_" + this.ref;
            input.min = 0;
            input.value = price;
            input.step = "0.01";
            td.appendChild(input);
        }else{
            td.innerText = price;
        }
        this.tr.appendChild(td);
    }

    /**
     * Ajoute la colone edit dans la ligne.
     * Si editable = true alors ajoute un boutton d'edition.
     * Si removeable = true alors ajoute un boutton de suppression.
     * @param {boolean} editable 
     * @param {boolean} removeable 
     */
    #create_edit_col(editable, removeable, ref , category){
        let td = document.createElement("td");
        td.classList.add("edit");
        let up = Utils.create_button("up",ref,(e) => {Actions.move_article(e.target.value, -1);});
        let down = Utils.create_button("down",ref,(e) => {Actions.move_article(e.target.value, 1);});

        td.appendChild(up);
        td.appendChild(down);

        if (editable){
            let button = Utils.create_button("edit", category, event_edit);
            button.dataset.ref = ref;
            td.appendChild(button);
        }
        if (removeable){
            let button = Utils.create_button("supprimer", "", event_remove);
            td.appendChild(button);
        }
        this.tr.appendChild(td);
    }

}

function event_edit(e){
    const category_id = parseInt(e.target.value);
    const ref = e.target.dataset.ref;
    Url.edit_article(category_id, ref);
}

/**
 * Cette fonction est appelé lors d'un clique sur le bouton de suppression
 * Elle supprimer la ligne en question
 * @param {Event} e 
 */
function event_remove(e){
    let ref = e.target.closest('tr').dataset.ref;
    const action_remove = {"type":"remove","ref":ref};
    Actions.push(action_remove);
}
