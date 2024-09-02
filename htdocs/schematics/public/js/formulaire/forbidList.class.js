/**
 * ajoute l'élément dans la list si il n'existe pas déja
 * @param {Any} element 
 */
 Array.prototype.addUnique = function(element){
    if (!this.includes(element)){
          this.push(element);
      }
  };
  
  /**
   * ajoute l'array passé en paramètre sans les doublons
   * @param {Array} array 
   * @returns {Array}
   */
  Array.prototype.concatUnique = function(array){
      array.forEach(element =>{
          this.addUnique(element);
      });
      return this;
  }

/**
 * class statique qui permet de gérer les interdicitons d'options
 * les options sont stockées dans la variable static list_forbid_option
 * cette variable est une map qui fonctionne avec 2 index l'id du l'envoyeur de l'interdiction et
 * l'id de celui qui va subir l'interdicition
 */
class ForbidOption{
    /*list_forbid_option qui est du type
    "id_envoyeur|id_receveur" => ["options1",...];
    la clé est sous forme de string car on ne peut pas mettre d'objet en clé
    */
   /**
    * @type {Map<"string",string[]>} "id_envoyeur|id_receveur" => ["options1",...];
    */
   static list_forbid_option = new Map();

  
    /**
     * ajoute la list passé en paramètre à la clé passé en paramètre 
     * possibilité d'ajouter un message pour expliquer pourquoi on interdit cette valeur
     * @param {{envoyeur:string,receveur:string}} key 
     * @param {string[]} list_options 
     * @param {string} message
     */
    static forbid(key,list_options){
        var stringKey = key.envoyeur + "|" + key.receveur;
        this.list_forbid_option.set(stringKey,list_options);
    }

    /**
     * supprime l'interdiction associé à la clé passé en paramètre
     * @param {{envoyeur, receveur}} key 
     * 
     */
    static enable(key){
        var stringKey = key.envoyeur + "|" + key.receveur;
        this.list_forbid_option.delete(stringKey);
    }

    /**
     * methode privé qui renvoie la list de toute les interdiction associé à l'id passé en paramètre
     * @param {string} id 
     */
    static getListForbid(id){
        var res = [];
        for (var [key, value] of this.list_forbid_option.entries()){
            //TOD
            var id_receveur = key.split('|')[1]; //on récupère l'id du receveur de l'interdicition
            if (id_receveur.includes(id)){ //et on récupère ces interdictions
                res = res.concatUnique(value);
            }
        }
        return res;
    }

    /**
     * renvoie la list passé en paramètre sans les interdictions contenue dans list_forbid_option associé à l'id passé 
     * en paramètre
     * @param {string} id 
     * @param {object} list 
     */
    static getListAllowed(id, list){
        var L = this.getListForbid(id);
        if (L == []) return list; //si il n'y a pas d'interdiction alors on renvoie la list tel-quelle
        var res ={};
        for (var key in list){
            if (!L.includes(key)){
                res[key] = ""; //pour cette list seul la clé nous interesse.
            }
        }
        return res;

    }

}