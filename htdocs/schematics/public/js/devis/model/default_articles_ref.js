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
 * @property {Object<string, string[]>} refs - List of references to add if rule matches
 * @property {string} [reason] - Optional reason of the article to be added
 */

/**@type {MappingRule[]} */
const SC_MAPPING = [
    // -------------------- MODULE + KIT --------------------
    {
        when: { typeInstallation: /^SC1Z$/ },
        refs: {"module SC1Z": ["SC1ZBMOD500"], "kit SC1Z": ["SC1ZKIT50"]},
        reason: "L'installation est un SC1Z."
    },
    {
        when: { typeInstallation: /^SC1$/ },
        refs: {"module SC1": ["SC1BMOD"], "kit SC1": ["SC1KIT50"]},
        reason: "L'installation est un SC1."
    },
    {
        when: { typeInstallation: /^SC2$/ },
        refs: {"module SC2": ["SC2BMOD"], "kit SC2": ["SC2KIT5050"]},
        reason: "L'installation est un SC2."
    },
    {
        when: { typeInstallation: /^SC1K$/ },
        refs: {"module SC1K": ["SC1K1,5BMOD"], "kit SC1K": ["SC1K1KIT5"]},
        reason: "L'installation est un SC1K."
    },
    {
        when: { typeInstallation: /^SC2K$/ },
        refs: {"module SC2K": ["SC2K1BMOD"], "kit SC2K": ["SC2K1KIT5"]},
        reason: "L'installation est un SC2K"
    },
    {
        when: { typeInstallation: /^HydrauBox 1$/ },
        refs: {"module Hydraubox 1": ["HYBX1MOD"], "kit Hydraubox": ["HYBXKIT"]},
        reason: "L'installation est une HydrauBox 1."
    },
    {
        when: { typeInstallation: /^HydrauBox 2$/ },
        refs: {"module Hydraubox 2": ["HYBX2MOD"], "kit Hydraubox": ["HYBXKIT"]},
        reason: "L'installation est une HydrauBox 2."
    },
    // -------------------- OPTIONS DE ZONES --------------------
    {
        when: {
            typeInstallation: /K$/,
            circulateurC1: /Plancher chauffant/
        },
        refs: {"options": ["KITSSC049"]},
        reason: "Un plancher chauffant est présent en zone 1 et l'installation est collective."
    },
    {
        when: {
            typeInstallation: /[^K]$/,
            circulateurC1: /^Plancher chauffant$/
        },
        refs: {"options": ["KITSSC006"]},
        reason: "Un plancher chauffant est présent en zone 1"
    },
    {
        when: {
            typeInstallation: /[^K]$/,
            circulateurC1: /^Plancher chauffant sur V3V$/
        },
        refs: {"options": ["KITSSC060"]},
        reason: "Un plancher chauffant sur V3V est présent en zone 1"
    },
    {
        when: {
            zone2: /^(?!Aucun$)(?!.*piscine)(?!.*appoint).*$/i,
        },
        refs: {"options": ["OPT0016"]},
        reason: "La zone 2 et/ou 3 sont raccordées."
    },
    {
        when: {
            zone3: /^(?!Aucun$)(?!.*piscine)(?!.*appoint).*$/i
        },
        refs: {"options": ["OPT0016"]},
        reason: "La zone 2 et/ou 3 sont raccordées."
    },
    {
        when: {
            zone2: /piscine/i
        },
        refs: {"options": ["OPT0030"]},
        reason: "La zone 2 et/ou 3 sont raccordées avec une piscine"
    },
    {
        when: {
            zone3: /piscine/i
        },
        refs: {"options": ["OPT0030"]},
        reason: "La zone 2 et/ou 3 sont raccordées avec une piscine"
    },
    {
        when: {
            zoneSupplementaire: /^(?!Aucun$)(?!.*piscine)(?!.*appoint).*$/i,
        },
        refs: {"options": ["OPT0018"]},
        reason: "Toute les zones sont raccordées (3 pour SC1Z, 4 sinon)."
    },
    {
        when: {
            zoneSupplementaire: /piscine/i
        },
        refs: {"options": ["OPT0027"]},
        reason: "Toute les zones sont raccordées (3 pour SC1Z, 4 sinon) et la zone supplémentaire est une piscine."
    },
    {
        when: {
            circulateurC7: /appoint/i,
            zoneSupplementaire: /^aucun$/i
        },
        refs: {"options": ["OPT0017"]},
        reason: "Un appoint bois est présent sur C7."
    },
    {
        when: {
            circulateurC7: /appoint/i,
            zoneSupplementaire: /appoint/i
        },
        refs: {"options": ["OPT0019"]},
        reason: "Toute les zones sont raccordées (3 pour SC1Z, 4 sinon) et la zone supplémentaire est un appoint bois."
    },

    // -------------------- OPTIONS PISCINE --------------------

    {
        when: {
            circulateurC1: /piscine/i
        },
        refs: {"accessoires piscine": ["MOD0023", "MOD0045"]},
        reason: "Une piscine est raccordée sur un circulateurs."
    },
    {
        when: {
            circulateurC2: /piscine/i
        },
        refs: {"accessoires piscine": ["MOD0023", "MOD0045"]},
        reason: "Une piscine est raccordée sur un circulateurs."
    },
    {
        when: {
            circulateurC3: /piscine/i
        },
        refs: {"accessoires piscine": ["MOD0023", "MOD0045"]},
        reason: "Une piscine est raccordée sur un circulateurs."
    },
    {
        when: {
            circulateurC7: /piscine/i
        },
        refs: {"accessoires piscine": ["MOD0023", "MOD0045"]},
        reason: "Une piscine est raccordée sur un circulateurs."
    },
];


/** @type {MappingRule[]} */
const APPOINT_MAPPING = [
    {
        when: {raccordementHydraulique: /casse pression/i},
        refs: {"decouplage CP": ["KITSSC059"]},
        reason: "Il y a une casse pression en appoint 1."
    },
    {
        when: {raccordementHydraulique: /échangeur/i},
        refs: {"decouplage ech": ["MOD0459"]},
        reason: "Il y a un échangeur à plaque en appoint 1."
    },
    {
        when: {RH_appoint2: /casse pression/i},
        refs: {"decouplage CP": ["KITSSC059"]},
        reason: "Il y a une casse pression en appoint 1."
    },
    {
        when: {RH_appoint2: /échangeur/i},
        refs: {"decouplage ech": ["MOD0459"]},
        reason: "Il y a un échangeur à plaque en appoint 1."
    }
];



/**@type {MappingRule[]} */
const BAL_MAPPING = [
    {
        when: {
            typeInstallation : /^(?!SC1Z$).*$/,
            ballonECS: /^ballon ECS 2/
        },
        refs: {"bal double ech": ["BAL0002"]},
        reason: "Le ballon sanitaire selectionné a 2 échangeurs."
    },
    {
        when: {
            typeInstallation : /^(?!SC1Z$).*$/,
            ballonECS: /^ballon ECS et/
        },
        refs: {"bal double ech": ["BAL0002", "BAL0002"]},
        reason: "Le ballon sanitaire selectionné a 2 échangeurs et est en série."
    },
    {
        when: {
            typeInstallation : /^(?!SC1Z$).*$/,
            ballonECS: /^ballon elec en sortie ballon solaire avec bouclage sanitaire$/
        },
        refs: {"bal double ech": ["BAL0002", "BAL0002"]},
        reason: "Le ballon sanitaire selectionné a 2 échangeurs et est en série."
    },
    {
        when: {
            ballonECS: /^Ballon hygiénique avec 2 echangeurs$/
        },
        refs: {"bal tamp inox": ["BAL0098"]},
        reason: "Le ballon sanitaire est hygiénique et a 2 échangeurs."
    },
    {
        when: {
            ballonECS: /^Ballon hygiénique avec 1 echangeur$/
        },
        refs:{"bal tamp inox": ["BAL0094"]} ,
        reason: "Le ballon sanitaire est hygiénique et a 1 échangeurs."
    },
    {
        when: {
            ballonTampon: /^(?!aucun$).*$/i,
            EchangeurDansBT: /on/,
        },
        refs:{"bal tamp ech total": ["BAL0085"]},
        reason: "Il y a un ballon tampon avec échangeur."
    },
    {
        when: {
            ballonTampon: /2/i,
            EchangeurDansBT: /on/,
        },
        refs:{"bal tamp ech total": ["BAL0085"]},
        reason: "Il y a 2 ballon tampon avec échangeur."
    },
    {
        when: {
            ballonTampon: /^(?!aucun$).*$/i,
            EchangeurDansBT: /off/,
        },
        refs:{"bal tamp sans ech": ["BAL0103"]},
        reason: "Il y a un ballon tampon sans échangeur."
    },
    {
        when: {
            ballonTampon: /2/i,
            EchangeurDansBT: /off/,
        },
        refs:{"bal tamp sans ech": ["BAL0103"]},
        reason: "Il y a 2 ballon tampon sans échangeur."
    },
    {
        when: {
            ballonTampon: /3/i,
            EchangeurDansBT: /off/,
        },
        refs:{"bal tamp sans ech": ["BAL0103", "BAL0103"]},
        reason: "Il y a 3 ballon tampon sans échangeur."
    },
    {
        when: {ballonTampon: /2/i},
        refs:{"SSC divers": ["KITSSC157"]},
        reason: "Il y a 2 ballon tampons."
    },
    {
        when: {ballonTampon: /3/i},
        refs:{"SSC divers": ["KITSSC157", "KITSSC157"]},
        reason: "Il y a 3 ballon tampons."
    },
    {
        when: {resistanceElectriqueBECS: /on/i},
        refs: {"resistance": ["BAL0158"]},
        reason: "Il y a une résistance dans le ballon ECS ou tampon."
    },
    {
        when: {resistanceElectriqueBT: /on/i},
        refs: {"resistance": ["BAL0158"]},
        reason: "Il y a une résistance dans le ballon ECS ou tampon."
    }
    
];


/**@type {MappingRule[]} */
const CAPTEURS_MAPPING = [
    {
        when: {
            champCapteur: /^(?!aucun$).*$/i,
        },
        refs: {
            "bitube DN20": ["MOD0757"],
        },
        reason: "présence de champ capteur"
    },
    {
        when: {
            champCapteur: /1/i,
        },
        refs: {
            "capteurs": ["S7 2,5-CS-45-6"],
            "kit DN20": ["KITCAP015", "KITCAP012"]
        },
        reason: "présence d'un champ capteur"
    },
    {
        when: {
            champCapteur: /2/i,
        },
        refs: {
            "capteurs": ["S7 2,5-CS-45-6", "S7 2,5-CS-45-6"],
            "kit DN20": ["KITCAP015", "KITCAP015", "KITCAP012", "KITCAP012"]
        },
        reason: "présence de deux champ capteur."
    },
    {
        when: {champCapteur: /casse pression/i},
        refs: {"mod sol 1 col": ["kitSSC197"]},
        reason: "Présence d'une casse pression sur champ capteur."
    },
    {
        when: {champCapteur: /échangeur/i},
        refs: {"mod sol 2 col": ["kitSSC199"]},
        reason: "Présence d'un échangeur sur champ capteur."
    },
    {
        when: {champCapteur: /V3V/i},
        refs: {"kit V3V": ["KITSSC018"]},
        reason: "Présence d'une V3V sur champ capteur."
    }
];



/**@type {MappingRule[]} */
const SERV_PORT_MAPPING = [
    {
        refs: {"assistance ind": ["MISE001"]},
        reason: "Articles ajoutées par défaut."
    },
    {
        when: {typeInstallation: /1/i},
        refs: {"transport": ["TRANS001"]},
        reason: "Le module choisit est un SC1 ou SC1Z ou hydraubox 1."
    },
    {
        when: {typeInstallation: /2/i},
        refs: {"transport": ["TRANS002"]},
        reason: "Le module choisit appartient à la gamme des SC2"
    }
];


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
 * @returns {Array<{ref: string, category_id: string, reason?: string}>} 
 *          An array of objects containing `ref` and `base_category_id` for all rules that matched the input.
 */
function get_default_articles_ref(formulaire){
    const enhanced_formulaire = enhance_formulaire(formulaire);
    let results = [];
    for (const mapping of [SC_MAPPING, APPOINT_MAPPING, BAL_MAPPING, CAPTEURS_MAPPING, SERV_PORT_MAPPING]){
        results.push(...resolve_mapping(enhanced_formulaire, mapping));
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
 * @returns {Array<{ ref: string, category_id: string, reason?: string }>}
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

        if (match){
            refs.push(
                ...Object.entries(rule.refs).flatMap(([category_id, refs]) => refs.map(ref => ({
                    ref, category_id, reason: rule.reason
                })))
            );
        }
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


