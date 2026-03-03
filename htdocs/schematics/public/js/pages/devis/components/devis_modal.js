/**
 * @type {import('../utils.js').format_number}
 * @type {import('../store/devis_store.js').devisStore}
 * @type {import('./modal_filters/devis_capteurs_filter.js').DevisCapteurFilter}
 * @type {import("../model/data_manager.class.js").article_dict}
 * @type {import("../../public/modal.js").Modal}
 */

/**
 * 
 */
class DevisModal extends Modal{
    constructor(){
        super();

        this.pending_action = null;
    }

    set_content({category_id, pending_action = null, force_articles = false}){
        if (pending_action !== null) this.pending_action = pending_action;

        const sub_categs = devisStore.data_manager.get_childrens_categories(category_id);

        this.content_div.innerHTML = "";
        this.content_div.appendChild(this.#breadcrumb_div(category_id));
        if (force_articles || sub_categs.length === 0){
            let articles = devisStore.data_manager.get_articles_by_category_tree(category_id);
            // sort articles by ref if all articles are shown
            if (force_articles){
                articles = articles.sort((a, b) => a.ref.localeCompare(b.ref));
            }

            this._add_events = false; // ensure to add only once article events
            if (category_id === "capteurs"){
                this.content_div.appendChild((new DevisCapteurFilter(this, articles)).HTML_div_element());

            }else{
                this.content_div.appendChild(this.articles_table(articles));
            }
            
        }else{
            this.content_div.appendChild(this.#category_div(category_id, sub_categs));
        }
        
        this.show();
    }

    /**
     * 
     * @param {string} category_id 
     * @param {import("../model/data_manager.class.js").category_dict[]} sub_categs 
     * @returns {HTMLDivElement}
     */
    #category_div(category_id, sub_categs){
        let div = document.createElement("div");
        const categ = devisStore.data_manager.get_category(category_id);
        div.classList.add("modal-category");

        div.innerHTML = `
            ${sub_categs.map(cat => `
                <button data-categ="${cat.id}">
                    ${cat.name}
                </button>
            `).join("")}
            <button data-categ="${categ.id}" data-handler="all-categ">
                Tout(e)s les ${categ.name}
            </button>
        `;

        div.addEventListener("click", (event) =>{
            const btn = event.target.closest("button");
            if (!btn) return;
            if (btn.dataset.handler === "all-categ"){
                devisStore.dispatch("show-modal", {category_id: btn.dataset.categ, force_articles: true});
            }else{
                devisStore.dispatch("show-modal", {category_id: btn.dataset.categ});
            }
            
        });
        return div;
    }

    /**
     * 
     * @param {import("../model/data_manager.class.js").article_dict[]} articles 
     */
    articles_table(articles){
        let div = document.createElement("div");
        div.classList.add("table-scroll");

        div.innerHTML = `
        <table class="articles-table">
            <thead>
                <tr>
                    <th>Ref <input type="text" 
                                    placeholder="Filtrer par réf."
                                    data-type="ref" 
                                    ></th>
                    <th>Désignation <input type="text" 
                                    placeholder="Filtrer par désignation."
                                    data-type="label" 
                                    ></th>
                    <th>Prix</th>
                </tr>
            </thead>
            <tbody data-zone="articles-body"></tbody>
        </table>
        `;

        let filters = {ref:"", label:""};
        div.addEventListener("input", (event) =>{
            const input = event.target;
            filters[input.dataset.type] = input.value;
            const filtered_articles = articles.filter(art => 
                art.ref.toLowerCase().includes(filters.ref.toLowerCase()) && 
                art.label.toLowerCase().includes(filters.label.toLowerCase())
            );
            this.mount_articles(tbody, filtered_articles);
        });
        let tbody = div.querySelector("tbody");
        this.mount_articles(tbody, articles);
        return div;
    }

    /**
     * 
     * @param {HTMLTableElement} tbody 
     * @param {article_dict[]} articles 
     */
    mount_articles(tbody, articles){
        tbody.innerHTML = articles.map(art => `
            <tr data-ref="${art.ref}" data-category_id="${art.category_id}">
                <td>${art.ref}</td>
                <td>${art.label}</td>
                <td>${format_number(art.prix)} €</td>
            </tr>
        `).join("");

        // avoid stacking events if this method is called multiple time
        if (!this._add_events){
            this._add_events = true;
            // add the click event listener on each article tr
            // the click will submit the pending action with the clicked article ref
            // then hide the modal and rerender the devis
            tbody.addEventListener("click", (event) =>{
                const tr = event.target.closest("tr");
                if (!tr) return;
                let action = {...this.pending_action};
                action.payload.base_category_id = devisStore.data_manager.get_base_category_id(tr.dataset.category_id).id;
                action.payload.category_id = tr.dataset.category_id;
                if (action.type === "body-add") action.payload.ref = tr.dataset.ref;
                if (action.type === "body-edit") action.payload.new_ref = tr.dataset.ref;
                devisStore.submit_action(action);
                devisStore.dispatch("render");
                this.hide();
            });
        }
        
        
    }

    /**
     * 
     * @param {category_dict[]} parents_categ 
     * @returns {string}
     */
    #breadcrumb_div(category_id){
        const parents_categ = devisStore.data_manager.get_parents_categories(category_id);

        let div = document.createElement("div");
        div.classList.add("breadcrumb");

        div.innerHTML = `
            ${parents_categ.map(cat => `
                <button data-categ="${cat.id}">
                    ${cat.id}
                </button>
            `).join("")}
        `;

        div.addEventListener("click", (event) =>{
            const btn = event.target.closest("button");
            if (!btn) return;
            devisStore.dispatch("show-modal", {category_id: btn.dataset.categ});
        });
        return div;
    }
}