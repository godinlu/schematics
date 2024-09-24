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


    /**
     * 
     * @param {string} name 
     * @param {string} value 
     * @returns {HTMLInputElement}
     */
    static create_hide_input(name, value){
        let input = document.createElement("input");
        input.name = name;
        input.value = value;
        input.type = "hidden";
        return input;
    }

    /**
     * Renvoie la distance de levenshtein entre 2 mots a et b
     * @param {string} a 
     * @param {string} b 
     * @returns {int}
     */
    static levenshtein(a, b) {
        const matrix = [];

        // Initialisation de la première ligne et colonne de la matrice
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Remplissage de la matrice avec les distances
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // suppression
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * trouve la meilleur distance de levenshtein possible entre l'input est une partie 
     * de la phrase, et renvoie ce minimum
     * @param {string} input 
     * @param {string} phrase 
     * @returns {int}
     */
    static min_levenshtein(input, phrase) {
        const inputLength = input.length;
        let minDistance = Infinity;
        let bestMatch = '';
    
        // Parcourt la phrase et compare chaque sous-chaîne de la taille de l'entrée
        for (let i = 0; i <= phrase.length - inputLength; i++) {
            const subPhrase = phrase.substr(i, inputLength);
            const distance = this.levenshtein(input.toLowerCase(), subPhrase.toLowerCase());
    
            // Si la distance est meilleure, on garde cette sous-chaîne
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = subPhrase;
            }
        }
    
        return minDistance;
    }
}