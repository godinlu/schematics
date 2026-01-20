
/**
 * Simple modal component with overlay click and Escape key handling.
 */
class Modal{
    /** @type {HTMLDivElement} - Outer modal container (overlay element).*/
    modal_div
    /** @type {HTMLDivElement} - Inner modal content container.*/
    content_div
    /** @type {boolean} - Indicates whether the modal is currently open.*/
    is_open


    /**
     * Create a Modal instance.
     *
     * If `modal_div` is provided, the modal content element is searched
     * inside it using the `.modal-content` selector.
     * If no parameter is provided, the modal DOM structure is created
     * and appended to the document body automatically.
     *
     * @param {HTMLDivElement} [modal_div] - Existing modal container element
     *
     * @throws {Error} If the modal content element cannot be found
     */
    constructor(modal_div) {

        if (modal_div) {
            this.modal_div = modal_div;
            this.content_div = modal_div.querySelector(".modal-content");

            if (!this.content_div) {
                throw new Error(
                    "Modal: .modal-content element not found inside modal_div"
                );
            }
        } else {
            this.modal_div = document.createElement("div");
            this.modal_div.classList.add("modal");

            this.content_div = document.createElement("div");
            this.content_div.classList.add("modal-content");

            this.modal_div.appendChild(this.content_div);
            document.body.appendChild(this.modal_div);
        }

        this.is_open = false;
        this.#attach_events();
    }

    /**
     * Attach internal event listeners:
     * - Close the modal when clicking on the overlay
     * - Close the modal when pressing the Escape key
     * 
     * @private
     */
    #attach_events(){
        this.modal_div.addEventListener("click", (event) =>{
            if (event.target === this.modal_div){
                this.hide();
            }
        });

        this._on_key_down = (event) => {
            if (event.key === "Escape" && this.is_open){
                this.hide();
            }
        };

        document.addEventListener("keydown", this._on_key_down);
    }

    /**
     * Display the modal and update its internal state.
     * Also moves focus to the modal container.
     */
    show(){
        this.modal_div.style.display = "flex";
        this.is_open = true;
        this.modal_div.focus();
    }

    /**
     * Hide the modal and update its internal state.
     */
    hide(){
        this.modal_div.style.display = "none";
        this.is_open = false;
    }

    /**
     * Destroy the modal instance.
     * 
     * Removes event listeners and deletes the modal element
     * from the DOM.
     */
    destroy(){
        document.removeEventListener("keydown", this._on_key_down);
        this.modal_div.remove();
    }
}