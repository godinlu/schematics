class Utils{
    /**
     * 
     * @param {string} text 
     * @param {string} value 
     * @param {Function} click_function 
     * @param {string} type 
     * @returns {HTMLButtonElement} button
     */
    static create_button(text, value, click_function = undefined, type = "button"){
        let button = document.createElement("button");
        button.innerText = text;
        button.value = value;
        if (click_function) button.addEventListener("click", click_function);
        button.type = type;
        return button;
    }
}