class Ligne{

    /**
     * 
     * @param {HTMLSelectElement} select
     * @param {Object} listOption 
     * @param {boolean} isSonde 
     */
    constructor(select ,DATA_LIST, list_forbidMessage, defaultIndex){
        this.select = select;
        this.DATA_LIST = DATA_LIST;
        this.setListOption();
        this.isSonde = this.select.classList.contains("sonde");
        this.list_forbidMessage = list_forbidMessage;
        this.defaultIndex = defaultIndex;

        this.manageSonde = this.manageSonde.bind(this); //sert à garder le même this peut importe qui appelle drawSchema
    }
}