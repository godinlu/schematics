class Devis{
    
    constructor(name){
        this.name = name;
        /**
         * @type {Map<string, Article>}
         */
        this.lignes_devis = new Map();
        this.categories = {
            "Module de chauffage solaire et ballon ECS":["SC_part","ballon_part"],
            "Capteurs solaires thermiques":["capteur_part","tubeInox_part"],
            "Gestion de l'appoint PAC":["appoint_part"],
            "Appoint électrique ecs en option":["elecAnode_part"],
            "Services":["service_part"],
            "Chaudière en option hors commande SolisArt":[null]
            
        };
    }

    get map(){
        return this.lignes_devis;
    }
    set map(map){
        this.lignes_devis = map;
    }
    /**
     * ajoute une ligne au devis, la ligne est identifié par key 
     * @param {string} key 
     * @param {string[]} array [FAMILLE,REF,LABEL,PRIX,...]
     */
    add(key , array){
        if (!array) throw new Error("array undefined for key : " + key);
        //on récupère la catégorie à partir de la famille de l'article
        const categ = (this.isCateg(array.famille))? array.famille : this.getCategByFamily(array.famille);
        let article = new Article(array.ref , categ , array.label , array.prix);
        this.lignes_devis.set(key, article);  
    }

    /**
     * 
     * @param {string} key 
     * @param {string} commentaire 
     * @param {string} categ 
     */
    addCommentaire(key, commentaire, categ, prix = 0){
        let article = new Article('TEXT' , categ, commentaire , prix);
        this.lignes_devis.set(key , article);
    }

    /**
     * supprime une ligne du devis grâce à sa clé
     * @param {string} key 
     */
    removeRow(key){
        this.lignes_devis.delete(key);
    }

    /**
     * 
     * @param {string} key 
     * @param {int} quantity 
     */
    updateQuantity(key, quantity){
        var article = this.lignes_devis.get(key);
        if (article === undefined) return false;
        article.setQuantity(quantity);
        this.lignes_devis.set(key,article);
        return true;
    }
    /**
     * met à jour le prix d'un article identifé par la clé de la map
     * @param {string} key 
     * @param {int} price 
     */
    updatePrice(key, price){
        var newLine = this.lignes_devis.get(key);
        newLine._price = price;
        this.lignes_devis.set(key,newLine);
    }

    /**
     * cette fonction tranforme la devis.map pour prendre en compte l'ordre et les différentes catégories
     * pour l'ordre cette fonction utilise devis.ordre
     * pour les catégorie cette fonction utilise les id des articles ainsi que VisualDevis.categories
     * @returns {obj} objet avec comme clé les noms des catégories et comme valeur une liste des articles 
     */
    getDevisFormat(){
            var obj = {};       //obj final que l'on rempli tout au long de la fonction
            var arr = [];       //array intérmedière qui facilite la transformation (c'est lui qui va prendre en compte l'ordre)
            var i = 0;
            //on commence par créer un array où les articles sont ajouter dans leurs ordre 
            this.map.forEach( (article , key) => {
                arr.push( article.copie() );
            });
            this.enleverDoublon(arr);   
            this.trierParPrix(arr);
            //ensuite on boucle dans la variable VisualDevis.categories pour regrouper les articles selon leurs catégorie
            this.getListCateg().forEach(categ =>{
                obj[categ] = arr.filter(article => article.getCateg() === categ);
            });
            return obj;
    }
    /**
     * renvoie le prix total hors taxe du devis
     * @returns {float} total hors taxe 
     */
    getTotal(){
        var res = 0;
        this.map.forEach(article => {
            res += article.getFinalPrice();
        });
        return res;
    }

    /**
     * renvoie un tableau d'ojet avec les articles du devis
     * chaque objet contient les informations suivantes :
     * ref, qte 
     * cette fonction est utilisé pour sauvegarder le devis dans la base de donnée
     * @returns {Array}
     */
    getArticles(){
        var arr = [];       //array intérmedière qui facilite la transformation (c'est lui qui va prendre en compte l'ordre)
        var i = 0;
        //on commence par créer un array où les articles sont ajouter dans leurs ordre 
        this.map.forEach( (article , key) => {
            arr.push( article.copie() );
        });
        this.enleverDoublon(arr);
        arr.forEach( (article, i) => {
            arr[i] = {ref : article.getRef() , qte : article.getQuantity()};
        });
        return arr;
    }
    
    /**
     * cette fonction modifie le tableau passé en paramètre pour enlever les doublons
     * et ajouter +1 en quantité pour chaque doublon
     * @param {Article[]} tableau 
     */
    enleverDoublon(tableau) {
        const references = {}; // Objet pour stocker les références trouvées
        for (let i = 0; i < tableau.length; i++) {
          const article = tableau[i];
          const ref = article.getRef();
          if (ref === "TEXT") continue; 
      
          if (references[ref]) {
            // Si la référence existe déjà, on supprime l'article et on incrémente la quantité
            references[ref].setQuantity( references[ref].getQuantity() + article.getQuantity());
            tableau.splice(i, 1);
            i--; // Décrémente i pour compenser la suppression de l'élément
          } else {
            // Si la référence n'existe pas encore, on l'ajoute à l'article de références
            references[ref] = article;
          }
        }
    }

    /**
     * cette fonction trie le tableau passé en paramètre par ordre croissant de prix
     * @param {Article[]} tableau 
     */
    trierParPrix(tableau) {
        tableau.sort((a, b) => b.getUnitPrice() - a.getUnitPrice());
    }
    //constante de TVA pour le devis
    get CODE_TVA(){ return 3; } 
    get TAUX_TVA(){ return 20; }

    /**
     * renvoie la liste des catégories
     * @returns {string[]}
     */
    getListCateg(){
        return Object.keys(this.categories);
    }
    /**
     * renvoie la catégorie de l'article par rapport à sa famille 
     * ex : getCategByFamily("SC_part") -> "Module de chauffage solaire et ballon ECS"
     * @param {string} famille 
     * @return {string}
     */
    getCategByFamily(famille){
        for (const categ in this.categories){
            if (this.categories[categ].includes(famille)){
                return categ;
            }
        }
        return "inutiliser";
    }

    /**
     * renvoie vrai si la famille passé en paramètre est une catégorie ex : 
     * isCateg("Module de chauffage solaire et ballon ECS") -> true
     * isCateg("SC_part") -> false
     * @param {string} famille 
     * @param {boolean}
     */
    isCateg(famille){
        return (this.getListCateg().includes(famille));
    }
    



}

class Article{
    static discount = 0;

    constructor(ref , categ , label , price , quantity = 1){
        this._ref = ref;
        this._categ = categ;
        this._label = label;
        this._price = price;
        this._quantity = quantity;
    }
    /**
     * set the discount with a verification of the integrity of the discount
     * @param {string} discount 
     */
    static setDiscount(discount){
        discount = parseInt(discount);
        Article.discount = (!isNaN(discount))? discount : 0 ;
    }

    copie(){
        return new Article(this._ref , this._categ , this._label , this._price , this._quantity);
    }

    getRef(){
        return this._ref;
    }
    getCateg(){
        return this._categ;
    }
    getLabel(){
        return this._label;
    }
    getUnitPrice(){
        return this._price;
    }
    /**
     * return the discount of the article (always 0 for the services part)
     * @returns {int} discount
     */
    getDiscount(){
        if (this._categ === 'Services') return 0;
        else return Article.discount;
    }
    /**
     * return the unitary price with the discount
     * @returns {float}
     */
    getDiscountUnitPrice(){
        return this._price * (100 - this.getDiscount()) / 100
        
    }

    /**
     * return the final price with the discount and the quantity
     * @returns {float} price
     */
    getFinalPrice(){
        return this.getDiscountUnitPrice() * this._quantity;
    }

    getQuantity(){
        return this._quantity;
    }
    /**
     * @param {int} quantity 
     */
    setQuantity(quantity){
        this._quantity = quantity;
    }
}