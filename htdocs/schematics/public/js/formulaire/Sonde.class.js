class Sonde{
    static sondePrise = new Map();

    /**
    * renvoie vrai si les sondes sont compatible entre elle c'est à dire si il y a pas la même sondes dans les 2 listes
    * @param {string} sondes1 
    * @param {string} sondes2 
    * @returns {boolean}
    */
     static compareSonde(sondes1, sondes2) {
       var res = true;
       if (sondes1 == "" || sondes2 == "") return true; //si une des deux sondes est vide forcément elles sont compatible
       var list_sonde = sondes1.split(" ");
       list_sonde.forEach( str =>{
           if (sondes2.includes(str)) res = false;
           
       });
       return res;
   }
    /**
     * @returns {string} renvoie un concaténation des sondes prise
     */
    static getSondes(){
        var sondes = "";
        this.sondePrise.forEach(str =>{
            sondes = sondes + str +" ";
        });
        return sondes;
        
    }
}