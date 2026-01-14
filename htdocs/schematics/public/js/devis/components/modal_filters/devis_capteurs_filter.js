/**
 * @type {import('../../model/data_manager.class.js').article_dict}
 * @type {import('../devis_modal.js').DevisModal}
 */

/**
 * This class is used to manage and filters capteur in the modal of articles selection
 */
class DevisCapteurFilter{
    /** @type {DevisModal} */
    devis_modal
    /** @type {article_dict[]} */
    articles

    /**
     * @param {DevisModal} devis_modal
     * @param {article_dict[]} articles 
     */
    constructor(devis_modal, articles){
        this.devis_modal = devis_modal;

        this.articles = articles.map(article => ({...article, filters:this.#parse_ref(article.ref)}));
    }

    /**
     * @returns {HTMLDivElement}
     */
    HTML_div_element(){
        // Create the table wrapper div which will contain filters and the articles table
        let div = document.createElement("div");
        div.classList.add("table-wrapper"); // important for the CSS

        div.innerHTML = `
            <div>
            <table class="filters">
                <tr>
                    <td>Type</td>
                    <td>
                        <select data-filter="type">
                            <option value="S7 2,5">S7 2,5</option>
                            <option value="S7 2,5B">S7 2,5B</option>
                            <option value="S7">S7</option>
                            <option value="SH 2">SH 2</option>
                            <option value="SH 2,5">SH 2,5</option>
                            <option value="SID2,5">SID2,5</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Type de pose</td>
                    <td>
                        <select data-filter="pose">
                            <option value="ST">surtoiture</option>
                            <option value="CT">chassis de toit</option>
                            <option value="CS">chassis au sol</option>
                            <option value="CM">chassis sur mur</option>
                            <option value="V">vertical</option>
                            <option value=""></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Inclinaison</td>
                    <td>
                        <select data-filter="inclinaison">
                            <option value="45">pose à 45°</option>
                            <option value="60">pose à 60°</option>
                            <option value="70">pose à 70°</option>
                            <option value=""></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Type toiture</td>
                    <td>
                        <select data-filter="toiture">
                            <option value="TO">tôle ondulée</option>
                            <option value="A">ardoise</option>
                            <option value="R">Tuile romane ou forte ondulation</option>
                            <option value="T">Autre</option>
                        </select>
                    </td>
                </tr>
            </table>
            </div>
            <div class="table-scroll">
                <table class="articles-table">
                    <thead>
                        <tr>
                            <th>Ref</th>
                            <th>Désignation</th>
                            <th>Prix</th>
                        </tr>
                    </thead>
                    <tbody data-zone="articles-body"></tbody>
                </table>
            </div>
        `;
        this.#attach_event_listeners(div);
        return div;
    }

    /** * attach all event listeners for * @param {HTMLDivElement} div */ 
    #attach_event_listeners(div){ 
        const selects = div.querySelectorAll("select"); 
        selects.forEach((select, i) =>{ 
            select.addEventListener("change", () =>{ 
                let articles_filtered = this.articles; 

                for (let j = 0; j < selects.length; j++) { 
                    const value = selects[j].selectedOptions[0].value; 
                    const filter_name = selects[j].dataset.filter; 
                    articles_filtered = articles_filtered.filter(article => article.filters[filter_name] === value); 

                    if (j+1 < selects.length){ 
                        const next_select = selects[j+1]; 
                        const next_filter_name = next_select.dataset.filter; 
                        const next_filters_valid = new Set(articles_filtered.map(art => art.filters[next_filter_name])); 
                        console.log(next_filters_valid);
                        const options = Array.from(next_select.options); 

                        options.forEach(option => { 
                            option.style.display = next_filters_valid.has(option.value) ? "block" : "none"; 
                        }); 
                        // changer la sélection si l’option actuelle est cachée 
                        if (next_select.selectedOptions[0].style.display === "none") { 
                            const firstVisible = options.find(opt => opt.style.display !== "none");
                            if (firstVisible) { firstVisible.selected = true; } 
                        } 

                        // désactiver le select si toutes les options sont cachées 
                        const visibleCount = options.filter(opt => opt.style.display !== "none").length;
                        next_select.disabled = visibleCount <= 1; 
                    } 
                } 

                this.devis_modal.mount_articles(div.querySelector(".articles-table tbody"), articles_filtered);
            }); 
        }); 
    }


    /**
     * 
     * @param {string} ref 
     */
    #parse_ref(ref) {
        const match = ref.match(/^([^-]+)(?:-(ST|CT|CS|CM|V))?(?:-(45|60|70))?(?:-(TO|A|R|T))?(?:-|$)/);
        return {
            type: match[1] ?? "",
            pose: match[2] ?? "",
            inclinaison: match[3] ?? "",
            toiture: match[4] ?? ""
        };
    }
}


