class Url{
    static default_url = window.location.href.match(/(.*\/devis2)(?:\/.*)?/)[1];

    /**
     * met à jour l'url avec l'url par défaut + l'url passé en paramètre
     * @param {string} url 
     */
    static set(url = undefined){
        if (url){
            window.history.pushState({}, '', this.default_url + url);
        }else{
            window.history.pushState({}, '', this.default_url);
        }
        Modal.update();
        
    }

    /**
     * 
     * @param {string|int} category_id 
     */
    static add_article(category_id){
        const category_path = Category.get_category_path(parseInt(category_id));
        const url = Category.get_url_from_category_path(category_path);
        this.set("/ajouter/"+url);
    }

    /**
     * renvoie une liste des mots clés après l'url par défault.
     * ex : http://localhost/schematics/htdocs/schematics/client/devis2/ajouter/articles/module 
     * -> [ "ajouter", "articles", "module" ]
     * @returns {string[]}
     */
    static get_info(){
        const responsive_url = window.location.href.replace(this.default_url,"");
        return responsive_url.split("/").filter(item => item !== "");
    }

    /**
     * cette method renvoie le chemin de category en fonction de l'url
     */
    static get_category_path(){
        let list_str = this.get_info();
        if (list_str[0] == "ajouter") list_str.splice(0,1);
        else if (list_str[0] == "edit") list_str.splice(0,2);
        else throw new Error(`l'action ${list_str[0]} n'est pas reconnu`);
        try{
            return Category.get_category_path_from_short_names(list_str);
        }catch{
            this.set();
        }
        
    }
}