class ArticleRow{
    /**
     * 
     * @param {JSON} article 
     * @param {string} tree_path 
     * @param {string} tag 
     * @param {int} qte 
     * @param {boolean} editable_qte 
     * @param {boolean} editable_price 
     * @param {boolean} editable 
     * @param {boolean} removeable 
     * @returns {HTMLTableRowElement}
     */
    constructor(
        article,
        tree_path,
        tag="default",
        qte=1,
        editable_qte = true,
        editable_price = false,
        editable = true,
        removeable = true
    ){
        console.log(article);
        this.tr = document.createElement("tr");
        this.tr.id = "article_" + article.ref;
        this.ref = article.ref;

        this.#create_ref_col(article.ref);
        this.#create_label_col(article.label);
        this.#create_qte_col(qte, editable_qte);
        this.#create_price_col(article.prix, editable_price);
        this.#create_edit_col(editable, removeable);

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
     * @param {int} qte 
     * @param {boolean} editable_qte 
     */
    #create_qte_col(qte, editable_qte){
        let td = document.createElement("td");
        td.classList.add("qte");
        if (editable_qte){
            let input = document.createElement("input");
            input.type = "number";
            input.name = "qte_" + this.ref;
            input.min = 1;
            input.value = qte;
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
    #create_edit_col(editable, removeable){
        let td = document.createElement("td");
        td.classList.add("edit");
        if (editable){
            let button = document.createElement("button");
            button.type = "button";
            button.innerText = "edit";
            td.appendChild(button);
        }
        if (removeable){
            let button = document.createElement("button");
            button.type = "button";
            button.innerText = "supprimer";
            td.appendChild(button);
        }
        this.tr.appendChild(td);
    }



}