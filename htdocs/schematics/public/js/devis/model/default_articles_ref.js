
/**
 * return all default ref and base category id, ref will depend on the input formulaire data.
 * @param {Object} formulaire 
 * @returns {Object[]} - list of Object with key `ref` and `base_category_id`
 */
function get_default_articles_ref(formulaire){
    return [
        ...get_default_SC_refs(formulaire),
        ...get_default_ballons_refs(formulaire),
        ...get_default_capteurs_refs(formulaire),
        ...get_default_serve_port_refs(formulaire)
    ];
}


/**
 * return all default ref and base category id for the SC part, ref will depend on the input formulaire data.
 * @param {Object} formulaire 
 * @returns {Object[]} - list of Object with key `ref` and `base_category_id`
 */
function get_default_SC_refs(formulaire) {
    const mapping = {
        "SC1Z": ["SC1ZBMOD500", "SC1ZKIT50"],
        "SC1": ["SC1BMOD", "SC1KIT50"],
        "SC2": ["SC2BMOD", "SC2KIT5050"],
        "SC1K": ["SC1K1,5BMOD", "SC1K1KIT5"],
        "SC2K": ["SC2K1BMOD", "SC2K1KIT5"],
        "HydrauBox 1": ["HYBX1MOD", "HYBXKIT"],
        "HydrauBox 2": ["HYBX2MOD", "HYBXKIT"],
    };

    const refs = mapping[formulaire.typeInstallation] ?? [];

    return refs.map(ref => ({
        ref,
        base_category_id: "SC part",
    }));
}


/**
 * Return all default balloon refs.
 * @param {Object} formulaire
 * @returns {Object[]} - list of objects with keys `ref` and `base_category_id`
 */
function get_default_ballons_refs(formulaire) {
    const { ballonECS, typeInstallation } = formulaire;
    const refs = [];

    if (ballonECS === "Ballon hygiénique avec 2 echangeurs") {
        refs.push("BAL0098");
    }

    // Add one double heat exchanger balloon
    if (typeInstallation !== "SC1Z" && /ballon ECS (2|et)/.test(ballonECS)) {
        refs.push("BAL0001");
    }

    // Add a second double heat exchanger balloon
    if (/ballon ECS et/.test(ballonECS)) {
        refs.push("BAL0001");
    }

    // Add two double heat exchanger balloons
    if (ballonECS === "ballon elec en sortie ballon solaire avec bouclage sanitaire") {
        refs.push("BAL0001", "BAL0001");
    }

    return refs.map(ref => ({
        ref,
        base_category_id: "ballon part",
    }));
}

/**
 * Return all default capteurs refs.
 * @param {Object} formulaire
 * @returns {Object[]} - list of objects with keys `ref` and `base_category_id`
 */
function get_default_capteurs_refs(formulaire){
    const refs = ["S7 2,5-CS-45-6", "MOD0757", "KITCAP015", "KITCAP012"];
    
    return refs.map(ref => ({ref, base_category_id: "capteur part"}));
}


function get_default_serve_port_refs(formulaire){
    const refs = ["MISE001", "TRANS001"];
    return refs.map(ref => ({ref, base_category_id: "service transport"}));
}



