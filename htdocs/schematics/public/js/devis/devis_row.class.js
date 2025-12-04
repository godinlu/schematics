class DevisRow{

    /**
     * Create a DevisRow
     * @param {Object} options - DevisRow properties
     * @param {string} options.ref
     * @param {string} options.label
     * @param {number} options.prix
     * @param {number} options.categorie_id
     * @param {number} options.priority
     * @param {number} options.base_categorie_id
     */
    constructor({ref, label, prix, categorie_id, priority, base_categorie_id}){
        this.ref = ref;
        this.label = label;
        this.prix = prix;
        this.categorie_id = categorie_id;
        this.priority = priority;
        this.base_categorie_id = base_categorie_id;
        
    }

    /**
     * Generate HTML element for this article
     * @returns {HTMLElement} The article div element
     */
    html_element(edit_handler, up_handler, down_handler, remove_handler) {
        // Main container
        let article_div = document.createElement("div");
        article_div.classList.add("devis-article");

        // Sub-divs
        let ref_div = document.createElement("div");
        let label_div = document.createElement("div");
        let prix_div = document.createElement("div");
        
        // Set classes
        ref_div.classList.add("devis-ref");
        label_div.classList.add("devis-label");
        prix_div.classList.add("devis-prix");
        
        // Set text content
        ref_div.textContent = this.ref;
        label_div.textContent = this.label;
        prix_div.textContent = this.prix.toFixed(2) + " €";

        // Append sub-divs to main container
        article_div.appendChild(ref_div);
        article_div.appendChild(label_div);
        article_div.appendChild(prix_div);
        article_div.appendChild(this.#create_edit_div(edit_handler, up_handler, down_handler, remove_handler));

        return article_div;
    }

    #create_edit_div(edit_handler, up_handler, down_handler, remove_handler){
        // create the div with a class name
        let edit_div = document.createElement("div");
        edit_div.classList.add("devis-edit");

        // create all button 
        let edit_button = document.createElement("button");
        let remove_button = document.createElement("button");
        let up_button = document.createElement("button");
        let down_button = document.createElement("button");

        // add icon for each button
        edit_button.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        remove_button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        up_button.innerHTML = '<i class="fa-solid fa-angle-up"></i>';
        down_button.innerHTML = '<i class="fa-solid fa-angle-down"></i>'

        // add handler to button
        edit_button.addEventListener("click", () => edit_handler(this.ref));
        up_button.addEventListener("click", () => up_handler(this.ref));
        down_button.addEventListener("click", () => down_handler(this.ref));
        remove_button.addEventListener("click", () => remove_handler(this.ref));

        // add a subdiv for the up/down buttons and add the 2 buttons
        let move_div = document.createElement("div");
        move_div.appendChild(up_button);
        move_div.appendChild(down_button);

        // add all buttons to the div 
        edit_div.appendChild(edit_button);
        edit_div.appendChild(move_div);
        edit_div.appendChild(remove_button);

        return edit_div;
    }

}