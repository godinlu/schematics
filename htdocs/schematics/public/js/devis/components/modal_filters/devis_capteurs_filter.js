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

        if (this.devis_modal.pending_action.type === "body-edit"){
            this.filter_values = this.#parse_ref(this.devis_modal.pending_action.payload.old_ref);
        }
        this.articles = articles.map(article => ({...article, filters:this.#parse_ref(article.ref)}));

    }

    /**
     * Create and return the main HTML container for the articles table.
     *
     * This method builds a DOM structure containing:
     * - A set of filter controls (select elements) used to filter articles
     * - A scrollable table displaying the filtered articles
     *
     * The returned element is fully initialized:
     * - All required event listeners are attached
     * - Filters are automatically applied on initialization
     *
     * @returns {HTMLDivElement} A fully initialized container element
     *                          holding filters and the articles table.
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
                            <option value=""></option>
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

    /**
     * Attach all `change` event listeners to the <select> elements contained
     * within the given div and handle cascading filtering logic.
     *
     * Each select filters the available articles based on its selected value.
     * Subsequent selects are dynamically updated to show only valid options
     * according to the currently filtered articles.
     *
     * @param {HTMLDivElement} div - Container element holding the filter selects
     *                              and the articles table.
     */
    #attach_event_listeners(div){ 
        const selects = div.querySelectorAll("select"); 
        selects.forEach((select, i) =>{ 
            select.addEventListener("change", () =>{ 

                // Start with the full list of articles
                let articles_filtered = this.articles; 

                // Iterate through all selects to apply filters progressively
                for (let j = 0; j < selects.length; j++) { 
                    const value = selects[j].selectedOptions[0].value; 
                    const filter_name = selects[j].dataset.filter; 

                    // Filter articles based on the current select
                    articles_filtered = articles_filtered.filter(article => article.filters[filter_name] === value); 

                    // If there is a next select, update its available options
                    if (j+1 < selects.length){ 
                        const next_select = selects[j+1]; 
                        const next_filter_name = next_select.dataset.filter;
                        
                        // Compute valid filter values for the next select
                        const next_filters_valid = new Set(articles_filtered.map(art => art.filters[next_filter_name])); 

                        // Convert options collection to an array for easier handling
                        const options = Array.from(next_select.options); 

                        // Show or hide options depending on their validity
                        options.forEach(option => { 
                            option.style.display = next_filters_valid.has(option.value) ? "block" : "none"; 
                        }); 

                        // If the currently selected option is hidden,
                        // automatically select the first visible option
                        if (next_select.selectedOptions[0].style.display === "none") { 
                            const firstVisible = options.find(opt => opt.style.display !== "none");
                            if (firstVisible) { firstVisible.selected = true; } 
                        } 

                        // Disable the select if there are no meaningful visible options
                        const visibleCount = options.filter(opt => opt.style.display !== "none").length;
                        next_select.disabled = visibleCount <= 1; 
                    } 
                } 

                // Re-render the articles table using the filtered results
                this.devis_modal.mount_articles(div.querySelector(".articles-table tbody"), articles_filtered);
            }); 
        }); 

        // init selects values to match filter of the old_ref in case of edit an article.
        if (this.filter_values){
            for (let i = 0; i < selects.length; i++) {
                selects[i].value = this.filter_values[selects[i].dataset.filter];
            }
        }

        // init filter by simulate a change of the first select
        selects[0].dispatchEvent(new Event("change"));
    }


    /**
     * Parse a reference string (ex: "S7 2,5-CS-45-6")and extract its structured components.
     * Parsed fields:
     * - type: mandatory base reference (before the first hyphen)
     * - pose: optional mounting type (ST, CT, CS, CM, V)
     * - inclinaison: optional inclination angle (45, 60, 70)
     * - toiture: optional roof type (TO, A, R, T)
     *
     * Missing segments are returned as empty strings.
     *
     * @param {string} ref - Reference string to parse.
     * @returns {{
     *   type: string,
     *   pose: string,
     *   inclinaison: string,
     *   toiture: string
     * }} Parsed reference components.
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


