class RessourceEngine{
    /**
     * 
     * @param {Options} all_options 
     */
    constructor(all_options){
        this._all_options = all_options;
    }


    /**
     * 
     * @param {Object<string, string>} context 
     */
    compute_state(context){
        // first init default state
        let states = {};
        let ressources = {};
        for (const [field, field_date] of Object.entries(this._all_options)){
            states[field] = {};
            ressources[field] = field_date.options?.[context?.[field]] ?? [];
            for (const opt of Object.keys(field_date.options)){
                states[field][opt] = {disabled:false, hidden:false, reason:""};
            }
        }

        console.log(ressources);
    }
}