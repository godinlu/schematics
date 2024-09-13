class Category{

    /**
     * Un objet représentant une categorie.
     * @typedef {Object} categorie
     * @property {number} id - identifiant de la catégorie
     * @property {string} name - nom complet de la catégorie
     * @property {string} short_name - nom court de la catégorie
     * @property {string} type - type de la catégorie
     * @property {int} priority - ordre de priority de la catégorie
     * @property {int} parent_id - id de la catégorie parent
    */
    /**
     * @type {categorie[]} categories
     */
    static categories;

    /**
     * renvoie la catégorie identifier par son id
     * @param {int|string} category_id 
     * @returns {categorie}
     */
    static get(category_id){
        const categories = this.categories.filter(raw =>raw.id == category_id);
        if (categories.length == 0){
            throw new Error(`La catégorie d'id ${category_id} n'existe pas`);
        }
        return categories[0];
    }

    /**
     * Cette fonction renvoie toute l'arborescence parentale de la categorie
     * passé en paramètre
     * @param {int} category_id 
     * @returns {int[]}
     */
    static get_category_path(category_id) {
        let category_map = new Map(this.categories.map(category => [category.id, category.parent_id]));
        const path = [];
        let i = 1000; // limite pour éviter une récursion infinie
      
        while (category_id !== null && i>0) {
            path.unshift(category_id); // Ajouter l'ID au début du tableau
            category_id = category_map.get(category_id); // Monter au parent
            i--;
        }
        if (i == 0) throw new Error(`Categorie erreur recursion infini.`);
      
        return path; // Joindre les IDs avec "/"
    }

    /**
     * Cette fonction sauvegarde la catégorie dans une Map statique
     * @param {categorie[]} categorie 
     */
    static set_categories(categories){
        this.categories = categories;
    }

    /**
     * renvoie l'url en fonction du category_path
     * @param {int[]} category_path 
     * @returns {string}
     */
    static get_url_from_category_path(category_path){
        let short_names = [];
        for (const category_id of category_path) {
            const short_name = this.get(category_id)["short_name"];
            short_names.push(short_name);
        }
        return short_names.join("/");
    }

    /**
     * renvoie le catégory_path depuis une liste de short_names
     * ex: [ "articles", "module" ] -> [0,1]
     * @param {string[]} keywords 
     * @returns {int[]}
     */
    static get_category_path_from_short_names(short_names){
        let category_path = [];
        let parent_id = null;
        for (const short_name of short_names) {
            let category = this.categories.filter(category => {
                return category.short_name == short_name && category.parent_id == parent_id;
            })[0];
            category_path.push(category.id)
            parent_id = category.id;
        }
        return category_path;
    }

    /**
     * Renvoie la liste des sous catégorie de la catégorie passé en paramètre
     * @param {int} category_id 
     * @returns {categorie[]}
     */
    static get_sub_categories(category_id){
        return this.categories.filter(category => category.parent_id == category_id);
    }
}