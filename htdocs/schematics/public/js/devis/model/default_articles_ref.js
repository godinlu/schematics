/**
 * this module contains the function get_default_articles_ref() which will return all ref and their base_category_id
 * depends on formulaire input.
 * To work this function use several mapping rules which conditions on formulaire data and
 * if all conditions of a rule is respected then add all refs of the rule.
 * The engine to resolve rules is the function resolve_mapping
 */


/**
 * @typedef {Object} MappingRule
 * @property {Object<string, RegExp>} [when] - Optional conditions to match formulaire fields
 * @property {string[]} refs - List of references to add if rule matches
 * @property {string} [reason] - Optional reason of the article to be added
 */

/**@type {MappingRule[]} */
const SC_MAPPING = [
    {
        when: { typeInstallation: /^SC1Z$/ },
        refs: ["SC1ZBMOD500", "SC1ZKIT50"],
        reason: "L'installation est un SC1Z."
    },
    {
        when: { typeInstallation: /^SC1$/ },
        refs: ["SC1BMOD", "SC1KIT50"],
        reason: "L'installation est un SC1."
    },
    {
        when: { typeInstallation: /^SC2$/ },
        refs: ["SC2BMOD", "SC2KIT5050"],
        reason: "L'installation est un SC2."
    },
    {
        when: { typeInstallation: /^SC1K$/ },
        refs: ["SC1K1,5BMOD", "SC1K1KIT5"],
        reason: "L'installation est un SC1K."
    },
    {
        when: { typeInstallation: /^SC2K$/ },
        refs: ["SC2K1BMOD", "SC2K1KIT5"],
        reason: "L'installation est un SC2K"
    },
    {
        when: { typeInstallation: /^HydrauBox 1$/ },
        refs: ["HYBX1MOD", "HYBXKIT"],
        reason: "L'installation est une HydrauBox 1."
    },
    {
        when: { typeInstallation: /^HydrauBox 2$/ },
        refs: ["HYBX2MOD", "HYBXKIT"],
        reason: "L'installation est une HydrauBox 2."
    },
    {
        when: {
            typeInstallation: /K$/,
            circulateurC1: /Plancher chauffant/
        },
        refs: ["KITSSC049"],
        reason: "Un plancher chauffant est présent en zone 1 et l'installation est collective."
    },
    {
        when: {
            typeInstallation: /[^K]$/,
            circulateurC1: /^Plancher chauffant$/
        },
        refs: ["KITSSC006"],
        reason: "Un plancher chauffant est présent en zone 1"
    },
    {
        when: {
            typeInstallation: /[^K]$/,
            circulateurC1: /^Plancher chauffant sur V3V$/
        },
        refs: ["KITSSC060"],
        reason: "Un plancher chauffant sur V3V est présent en zone 1"
    },
    {
        when: {
            zone2: /^(?!Aucun$)(?!.*piscine).*$/i,
        },
        refs: ["OPT0016"],
        reason: "La zone 2 et/ou 3 sont raccordées."
    },
    {
        when: {
            zone3: /^(?!Aucun$)(?!.*piscine)(?!.*appoint).*$/i
        },
        refs: ["OPT0016"],
        reason: "La zone 2 et/ou 3 sont raccordées."
    },
    {
        when: {
            zone2: /piscine/i
        },
        refs: ["OPT0030"],
        reason: "La zone 2 et/ou 3 sont raccordées avec une piscine"
    },
    {
        when: {
            zone3: /piscine/i
        },
        refs: ["OPT0030"],
        reason: "La zone 2 et/ou 3 sont raccordées avec une piscine"
    },
    
    {
        when: {
            zoneSupplementaire: /^(?!Aucun$)(?!.*piscine)(?!.*appoint).*$/i,
        },
        refs: ["OPT0018"],
        reason: "Toute les zones sont raccordées (3 pour SC1Z, 4 sinon)."
    },
    {
        when: {
            zoneSupplementaire: /piscine/i
        },
        refs: ["OPT0027"],
        reason: "Toute les zones sont raccordées (3 pour SC1Z, 4 sinon) et la zone supplémentaire est une piscine."
    },
    {
        when: {
            circulateurC7: /appoint/i,
            zoneSupplementaire: /^aucun$/i
        },
        refs: ["OPT0017"],
        reason: "Un appoint bois est présent sur C7."
    },
    {
        when: {
            circulateurC7: /appoint/i,
            zoneSupplementaire: /appoint/i
        },
        refs: ["OPT0019"],
        reason: "Toute les zones sont raccordées (3 pour SC1Z, 4 sinon) et la zone supplémentaire est un appoint bois."
    },
];



/**@type {MappingRule[]} */
const BAL_MAPPING = [
    {
        when: {
            typeInstallation : /^(?!SC1Z$).*$/,
            ballonECS: /^ballon ECS 2/
        },
        refs:["BAL0001"],
        reason: "Le ballon sanitaire selectionné a 2 échangeurs."
    },
    {
        when: {
            typeInstallation : /^(?!SC1Z$).*$/,
            ballonECS: /^ballon ECS et/
        },
        refs:["BAL0001", "BAL0001"],
        reason: "Le ballon sanitaire selectionné a 2 échangeurs et est en série."
    },
    {
        when: {
            typeInstallation : /^(?!SC1Z$).*$/,
            ballonECS: /^ballon elec en sortie ballon solaire avec bouclage sanitaire$/
        },
        refs:["BAL0001", "BAL0001"],
        reason: "Le ballon sanitaire selectionné a 2 échangeurs et est en série."
    },
    {
        when: {
            ballonECS: /^Ballon hygiénique avec 2 echangeurs$/
        },
        refs:["BAL0098"],
        reason: "Le ballon sanitaire est hygiénique et a 2 échangeurs."
    },
    {
        when: {
            ballonECS: /^Ballon hygiénique avec 1 echangeur$/
        },
        refs:["BAL0094"],
        reason: "Le ballon sanitaire est hygiénique et a 1 échangeurs."
    },
    {
        when: {
            ballonTampon: /^(?!aucun$).*$/i,
            EchangeurDansBT: /on/,
        },
        refs:["BAL0085"],
        reason: "Il y a un ballon tampon avec échangeur."
    },
    {
        when: {
            ballonTampon: /^(?!aucun$).*$/i,
            EchangeurDansBT: /off/,
        },
        refs:["BAL0103"],
        reason: "Il y a un ballon tampon sans échangeur."
    },
];

/**@type {MappingRule[]} */
const CAPTEURS_MAPPING = [
    {
        refs: ["S7 2,5-CS-45-6", "MOD0757", "KITCAP015", "KITCAP012"],
        reason: "Articles ajoutées par défaut."
    }
];

/**@type {MappingRule[]} */
const SERV_PORT_MAPPING = [
    {
        refs: ["MISE001", "TRANS001"],
        reason: "Articles ajoutées par défaut."
    }
];

/**@type {Object<string, MappingRule[]> } */
const GLOBAL_MAPPING = {
    "SC part": SC_MAPPING,
    "ballon part": BAL_MAPPING,
    "capteur part": CAPTEURS_MAPPING,
    "service transport": SERV_PORT_MAPPING
};


/**
 * This function returns all default article references (`ref`) along with their 
 * associated `base_category_id`, based on the provided `formulaire` input.
 * 
 * It uses multiple mapping rules defined in `GLOBAL_MAPPING`. For each rule:
 * - If `when` is not defined, the rule always applies.
 * - If `when` is defined, all conditions must match the corresponding fields in `formulaire`.
 * - Each field condition is a RegExp; if a field is missing from `formulaire`, 
 *   a warning is logged and the rule is skipped.
 * - When a rule matches, all `refs` in the rule are added to the results with the rule's `base_category_id`.
 *
 * @param {Object} formulaire - The input data containing fields like `typeInstallation`, `circulateurC1`, etc.
 * @returns {Array<{ref: string, base_category_id: string}>} 
 *          An array of objects containing `ref` and `base_category_id` for all rules that matched the input.
 */
function get_default_articles_ref(formulaire){
    const enhanced_formulaire = enhance_formulaire(formulaire);
    console.log(enhanced_formulaire)
    let results = [];
    for (const [base_category_id, mapping] of Object.entries(GLOBAL_MAPPING)){
        const resolved = resolve_mapping(enhanced_formulaire, mapping);

        results.push(...resolved.map(({ref, reason}) => ({ref, base_category_id, reason})));
    }
    return results;
}

/**
 * Resolves references from a set of mapping rules for a given `formulaire`.
 *
 * For each `MappingRule`:
 * - If `when` is undefined, the rule always applies.
 * - If `when` is defined, each key is a field name from `formulaire` and its value is a RegExp
 *   that the field must match for the rule to apply.
 * - If a field in `when` does not exist in `formulaire`, a warning is logged and the rule is considered non-matching.
 * - When a rule matches, all its `refs` are returned along with the rule `reason` (if any).
 *
 * @param {Object} formulaire - The input object containing various fields.
 * @param {MappingRule[]} mapping - An array of mapping rules to evaluate.
 * @returns {Array<{ ref: string, reason?: string }>}
 */
function resolve_mapping(formulaire, mapping){
    let refs = [];
    for (const rule of mapping){
        const match = !rule.when || Object.entries(rule.when).every(([field, regex]) =>{
            if (!(field in formulaire)){
                console.warn(`[MAPPING] Field ${field} not found in formulaire`, { field, rule, formulaire });
                return false;
            }
            return regex.test(formulaire[field]);
            
            
        })

        if (match) refs.push(...rule.refs.map(ref => ({ref, reason: rule.reason})));
    }
    return refs;
}


/**
 * 
 * @param {Object<string, string>} formulaire 
 * @returns {Object<string, string>}
 */
function enhance_formulaire(formulaire){
    const copy = { ...formulaire };

    const circulators = [
        copy.circulateurC1,
        copy.circulateurC2,
        copy.circulateurC3,
        copy.circulateurC7
    ];

    const zones = ["zone1", "zone2", "zone3", "zoneSupplementaire"];

    // Keep only active circulators
    const activeZones = circulators.filter(v => v !== "Aucun");

    // Fill zones sequentially, pad with "Aucun"
    zones.forEach((zone, index) => {
        copy[zone] = activeZones[index] ?? "Aucun";
    });

    // SC1Z special rule
    if (copy.typeInstallation === "SC1Z") {
        copy.zoneSupplementaire = copy.zone3;
        copy.zone3 = "Aucun";
    }

    return copy;
}


