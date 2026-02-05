/**
 * @typedef {import('../../public/modal')}
 */

class SaveDevisModal{
    constructor(){
        /** @type {Modal} */
        this._modal = new Modal();

        this._modal.modal_div.id = "modal-confirm-save-bd";

        /** @type {HTMLDivElement}*/
        this._root = this._modal.content_div;

        /** @type {(event: MouseEvent) => void} */
        this._on_click = this._handle_click.bind(this);

        /** @type {Function} */
        this._resolve = null;

        /** @type {Object<string, any>} */
        this._devis_data = null;
    }

    /**
     * Opens the modal and waits for user action.
     *
     * Resolves when the user either:
     * - finishes the save flow
     * - or chooses to continue without saving
     *
     * @param {Object<string, any>} devis_data - Quote data to send to the API
     * @returns {Promise<void>}
     */
    async open(devis_data){
        this._devis_data = devis_data;
        this._render_confirm();
        this._modal.show();

        this._root.addEventListener("click", this._on_click);

        return new Promise( resolve =>{
            this._resolve = resolve;
        });
    }

    /**
     * Handles all click events inside the modal using event delegation.
     *
     * @param {MouseEvent} event
     * @private
     */
    async _handle_click(event){
        const btn = event.target.closest("button");

        if (!btn) return;

        if (btn.dataset.handler === "save-devis"){
            this._render_loading();

            try{
                const start = Date.now();

                const json = await this.save_devis(this._devis_data);

                const elapsed = Date.now() - start;
                const minDelay = 500;

                if (elapsed < minDelay){
                    await this._delay(minDelay - elapsed);
                }

                this._render_success(json.reference);
            } catch (e){
                this._render_error(e.message);
            }
        }
        if (btn.dataset.handler === "no-save-devis" || btn.dataset.handler === "continue"){
            this._cleanup();
            this._resolve();
        }
    }

    /**
     * Cleans up listeners and closes the modal.
     *
     * @private
     */
    _cleanup() {
        this._root.removeEventListener("click", this._on_click);
        this._modal.hide();
    }

    /**
     * Renders the initial confirmation view.
     *
     * @private
     */
    _render_confirm(){
        this._root.innerHTML = `
            <p>Voulez-vous enregistrer ce devis dans la base ?</p>
            <div>
                <button data-handler="save-devis">Oui</button>
                <button data-handler="no-save-devis">Non</button>
            </div>
        `;
    }

    /**
     * Renders the loading state.
     *
     * @private
     */
    _render_loading(){
        this._root.innerHTML = `
            <p>Chargement <i class="fa-solid fa-spinner fa-spin-pulse"></i></p>
        `;
    }

    /**
     * Renders the success state.
     *
     * @param {string} reference - Generated quote reference
     * @private
     */
    _render_success(reference){
        this._root.innerHTML = `
            <p style="color:#27ae60;">
                <i class="fa-regular fa-circle-check"></i>
                <strong>Devis enregistré avec succès</strong>
            </p>
            <p>Réf : <strong>${reference}</strong></p>
            <button data-handler="continue">Continuer vers le téléchargement</button>
        `;
    }

    /**
     * Renders the error state.
     *
     * @param {string} message - Error message to display
     * @private
     */
    _render_error(message){
        this._root.innerHTML = `
            <p style="color:#c0392b;">
                <i class="fa-solid fa-xmark"></i>
                <strong>Impossible d’enregistrer le devis</strong>
            </p>
            <p>${message}</p>
            <button data-handler="save-devis">Réessayer</button>
            <button data-handler="continue">Continuer vers le téléchargement</button>
        `;
    }

    /**
     * Sends the quote data to the backend API.
     *
     * @param {Object<string, any>} devis_data
     * @returns {Promise<{success: boolean, reference: string}>}
     * @throws {Error} If the API response indicates a failure
     */
    async save_devis(devis_data){
        const response = await fetch('../api/save_devis.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(devis_data)
        });

        const json = await response.json();

        if (!response.ok || !json.success) {
            throw new Error(json.error ?? "Erreur serveur");
        }

        return json;
    }

    _delay(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}