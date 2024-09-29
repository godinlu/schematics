import { escape } from "svelte/internal";
import {articles_in_devis} from "./store.js";
import { get_article_by_ref } from "./utils";


export class Actions{
    /**
     * @type {Action[]} action_queue
     */
    static action_queue = [];

    /**
     * 
     * @param {Action} action 
     */
    static push(action){
        if (action.execute()){
            this.action_queue.push(action);
        }
    }
}


class Action {
    /**
     * 
     * @param {string} type 
     */
    constructor(type) {
      this.type = type; // Par exemple, l'entité sur laquelle l'action sera effectuée
    }
  
    /**
     * @return {boolean}
     */
    execute() {
        throw new Error("Cette method est abstraite");
    }
  
    // Méthode générique pour annuler une action
    undo() {
        throw new Error("Cette method est abstraite");
    }

    tojson(){
        throw new Error("Cette method est abstraite");
    }

    static fromjson(action_json){
        if (action_json.type === "add"){
            return new AddAction(action_json.ref);
        }
    }
}
  
export class AddAction extends Action{
    /**
     * 
     * @param {string} ref 
     */
    constructor(ref){
        super("add");
        this.ref = ref;
    }

    /**
     * 
     * @returns {boolean}
     */
    execute(){
        try{
            const new_article = get_article_by_ref(this.ref);
            articles_in_devis.update(a => {
                let exist_article = a.find(article => article.ref === this.ref);
                if (exist_article){
                    exist_article.quantity++;
                    return a;
                }else{
                    let new_articles = [...a, new_article];
                    new_articles.sort((a, b) => a.priority - b.priority);
                    return new_articles;
                }
                
            })
            return true;
        }catch (e){
            return false;
        }
        
    }

    tojson(){
        return {"type":this.type, "ref":this.ref};
    }
}

export class RemoveAction extends Action{
    /**
     * 
     * @param {string} ref 
     */
    constructor(ref){
        super("remove");
        this.ref = ref;
    }

    execute(){
        articles_in_devis.update(a =>(a.filter(article => article.ref !== this.ref)));
        return true;
    }

    tojson(){
        return {type:this.type, ref:this.ref};
    }
}

export class EditAction extends Action{
    /**
     * 
     * @param {string} old_ref 
     * @param {string} new_ref 
     */
    constructor(old_ref, new_ref){
        super("edit");
        this.old_ref = old_ref;
        this.new_ref = new_ref;
    }

    execute(){
        articles_in_devis.update(a =>{
            const index = a.findIndex(article => article.ref === this.old_ref);
            if (index === -1) throw new Error(`L'article ${this.old_ref} n'existe pas !`);
            const old_qte = a[index].quantity;
            let new_article = get_article_by_ref(this.new_ref);
            new_article.quantity = old_qte;
            a[index] = new_article;
            return a;
        });
    }
}

export class MoveAction extends Action{
    /**
     * 
     * @param {string} ref 
     * @param {number} index 
     */
    constructor(ref, index){
        super("move");
        this.ref = ref;
        this.index = index;
    }

    execute(){
        try{
            articles_in_devis.update(old_articles =>{
                let article = old_articles.find(article => article.ref === this.ref);
                if (!article) throw new Error(`L'article ${this.ref} n'existe pas !`);

                this.#swap(old_articles);
                
                article.priority = this.#calculate_new_priority(old_articles);
                return old_articles;
            });
            return true;
        }catch (e){
            return false;
        }   
    }

    /**
     * Cette méthode effectue un changement dans les lignes avec l'élément this.ref
     * à l'index this.index
     * @param {import("./utils").article[]} old_articles 
     */
    #swap(articles){
        const i = articles.findIndex(article => article.ref == this.ref);
        const article = articles.splice(i,1)[0];
        articles.splice(this.index, 0, article);  // Insère l'élément 
    }

    /**
     * Méthode pour calculer la nouvelle priorité en fonction de la position dans le tableau
     * @param {array} articles
     * @returns {number} nouvelle priorité
     */
    #calculate_new_priority(articles) {
        if (this.index === 0) {
            return articles[this.index + 1].priority - 10;
        } else if (this.index + 1 >= articles.length) {
            return articles[this.index - 1].priority + 10;
        } else {
            return (articles[this.index - 1].priority + articles[this.index + 1].priority) / 2;
        }
    }
}

