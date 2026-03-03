
/**
 * La variable `options` contient la liste de tous les champs ainsi que
 * les options disponibles pour chacun d’eux.
 *
 * Chaque option est associée à un tableau de règles (`string[]`).
 * Il existe 3 types de règles :
 *
 * - Envoi de signal (">SIGNAL") :
 *   Lorsque cette option est sélectionnée, le signal est émis.
 *
 * - Réception de signal ("<SIGNAL") :
 *   Lorsque ce signal est émis par une autre option, celle-ci devient interdite.
 *
 * - Envoi + réception ("SIGNAL") :
 *   L’option émet le signal pour les autres champs
 *   et réagit également à ce même signal lorsqu’il est émis ailleurs.
 * @typedef {Object<string, {
 *  default: string,
 *  options: Object<string, string[]>
 * }>} Options
 */

/** @type {Options} */
const options = {
    typeInstallation: {
        default: "SC2",
        options: {
            "SC1Z": [">installation_1", ">SC1Z"],
            "SC1": [">installation_1"],
            "SC2": [],
            "SC1K": [">installation_1"],
            "SC2K": [],
            "HydrauBox 1": [">installation_1", ">hydraubox"],
            "HydrauBox 2":[">hydraubox"]
        }
            
    },
    ballonECS: {
        default: "ballon ECS 2 échangeurs",
        options: {
            "ballon ECS 2 échangeurs": [],
            "ballon ECS 2 échangeurs avec bouclage sanitaire": [],
            "ballon ECS et ballon appoint en série": ["<SC1Z"],
            "ballon ECS et ballon appoint en série avec bouclage sanitaire": ["<SC1Z"],
            "ballon ECS tank in tank": ["<SC1Z"],
            "ballon d'eau chaude sur échangeur": ["<SC1Z"],
            "ballon elec en sortie ballon solaire avec bouclage sanitaire": ["<SC1Z"],
            "Ballon hygiénique avec 1 echangeur": ["<SC1Z"],
            "Ballon hygiénique avec 2 echangeurs": ["<SC1Z"],
            "Aucun": [">no_BECS"]
        }
    },
    resistanceElectriqueBECS: {
        default: "off", 
        options: {
            "on":["<no_BECS"],
            "off":[]
        }
    },
    ballonTampon: {
        default: "Ballon tampon",
        options: {
            "Ballon tampon": ["<installation_1"],
            "2 ballons tampons en série": ["<installation_1"],
            "3 ballons tampons en série": ["<installation_1"],
            "ballon tampon en eau chaude sanitaire": ["<installation_1"],
            "Aucun": [">no_BT"]
        }
    },
    resistanceElectriqueBT: {
        default: "off",
        options: {
            "on":["<no_BT"],
            "off":[]
        }
    },
    EchangeurDansBT: {
        default: "on",
        options: {
            "on":["<no_BT"],
            "off":[">no_bt_ech"]
        }
    },
    appoint1: {
        default: "Chaudière fioul",
        options: {
            "Chaudière fioul": [">no_app1_t16", ">app1"],
            "Chaudière gaz": [">no_app1_t16", ">app1"],
            "Chaudière condensation fioul": [">no_app1_t16", ">app1"],
            "Chaudière condensation gaz": [">no_app1_t16", ">app1"],
            "Electrique": [">no_app1_t16", ">app1"],
            "Pompe à chaleur": [">no_app1_t16", ">app1", ">pac_app1"],
            "Bois granulés sur T16": ["T16", ">app1", ">app1_t16"],
            "Bois sur T16": ["T16", ">app1", ">app1_t16"],
            "Aucun": [">no_app1", ">no_app1_t16"]
        }
    },
    puissanceApp1:{
        default: "",
        options: {"*":["<no_app1"]}
    },
    Zone: {
        default: "Zone non chauffée",
        options: {
            "Zone non chauffée":["<no_app1"],
            "Zone chauffée":["<no_app1"]
        }
    },
    raccordementHydraulique: {
        default: "Appoint simple",
        options: {
            "Appoint simple": ["<pac_app1", "<app2_cascade", "<app1_t16", "<no_app1"],
            "Appoint sur casse pression": ["<app2_cascade", "<app1_t16", "<no_app1"],
            "Appoint sur échangeur": ["<app2_cascade", "<app1_t16", "<no_app1"],
            "Appoint simple T16": ["<no_app1_t16", "<app2_cascade"],
            "Appoint sur casse pression T16": ["<no_app1_t16", "<app2_cascade", ">!no_t16_cp_ech"],
            "Appoint sur échangeur T16": ["<no_app1_t16", "<app2_cascade", ">!no_t16_cp_ech"],
            "Appoint sur tampon avec échangeur T16 S10": ["<no_app1_t16", "<app2_cascade", ">!no_t16_cp_ech"],
            "Appoint double en cascade sur casse pression": ["<no_app2_cascade"],
            "Appoint double en cascade sur casse pression T16": ["<no_app2_cascade", ">!no_t16_cp_ech"],
            "Appoint sur casse pression et réchauffeur de boucle": ["<no_app2_cascade"],
            "Appoint sur casse pression et réchauffeur de boucle T16": ["<no_app2_cascade", ">!no_t16_cp_ech"],
            "Appoint sur échangeur et réchauffeur de boucle": ["<no_app2_cascade"],
            "Appoint sur échangeur et réchauffeur de boucle T16": ["<no_app2_cascade", ">!no_t16_cp_ech"],
            "Appoint double sur échangeur": ["<no_app2_cascade"],
            "Appoint double sur échangeur T16": ["<no_app2_cascade", ">!no_t16_cp_ech"],
            "Appoint double": ["<no_app2_cascade"],
            "En direct": ["<app1", "<app2_cascade"],
            "Aucun": ["<app1", "<app2_cascade"]
        }
    },
    Gauche_droite: {
        default: "Gauche",
        options: {
            "Gauche":[],
            "Droite":[]
        }   
    },
    RDH_appoint1: {
        default: "off",
        options: {
            "on":[],
            "off":[]
        }
    },
    locAppoint2: {
        default: "Aucun",
        options: {
            "En cascade d'appoint 1": [">!no_app2_cascade", ">app2_cascade"],
            "Sur circulateur C7": [">!no_app2_c7"],
            "Aucun": [">no_app2", ">!app2"]
        }
    },
    appoint2: {
        default: "Aucun",
        options: {
            "Electrique": ["<no_app2_cascade"],
            "Gaz": ["<no_app2_cascade"],
            "Gaz condensation": ["<no_app2_cascade"],
            "Fioul": ["<no_app2_cascade"],
            "Fioul condensation": ["<no_app2_cascade"],
            "PAC": ["<no_app2_cascade"],
            "Granulé": ["<no_app2_cascade"],
            "Granulé condensation": ["<no_app2_cascade"],
            "Bois": ["<no_app2_cascade"],
            "Appoint bois": ["<no_app2_c7"],
            "Appoint granulé": ["<no_app2_c7"],
            "Appoint multiple": ["<no_app2_c7", ">app1_c7_multiple"],
            "Aucun": ["<app2"]
        }
    },
    puissanceApp1Multiple:{
        default: "",
        options: {"*":[]}
    },
    ZoneMultiple: {
        default: "Zone non chauffée",
        options: {
            "Zone non chauffée":[],
            "Zone chauffée":[]
        }
    },
    RH_appoint2: {
        default: "simple",
        options: {
            "simple": ["<app1_c7_multiple", "<no_app2_c7", ">rh_app2_simple"],
            "sur casse pression": ["<no_app2_c7"],
            "sur échangeur": ["<no_app2_c7"]
        }
    },
    RDH_appoint2: {
        default: "off",
        options: {
            "on":["<rh_app2_simple", "<no_app2"],
            "off":[]
        }
    },
    champCapteur: {
        default: "1 champ capteurs",
        options: {
            "1 champ capteurs": ["T1", "T2", "<hydraubox"],
            "2 champs capteurs en série": ["T1", "T2", "T10", "<hydraubox"],
            "2 champs capteurs en parallèle": ["T1", "T2", "T10", "<hydraubox"],
            "1 champ capteurs découplé sur casse pression sur T16": ["T1", "T2", "T10", "T16", "S11", "<hydraubox"],
            "1 champ capteurs découplé sur échangeur sur T16": ["T1", "T2", "T10", "T16", "S11", "<hydraubox"],
            "1 champ capteurs sur double circulateur sur échangeur sur T16": ["T1", "T2", "T10", "T16", "S11", "<hydraubox"],
            "1 champ capteurs découplé sur casse pression sur T15": ["T1", "T2", "T10", "T15", "S11", "<hydraubox"],
            "1 champ capteurs découplé sur échangeur sur T15": ["T1", "T2", "T10", "T15", "S11", "<hydraubox"],
            "2 champs capteurs sur V3V": ["T1", "T2", "T10", "<hydraubox"],
            "2 champs capteurs découplés sur casse pression": ["T1", "T2", "T10", "T15", "T16", "S10", "S11", "<hydraubox"],
            "2 champs capteurs découplés sur échangeur": ["T1", "T2", "T10", "T15", "T16", "S10", "S11", "<hydraubox"],
            "Aucun": []
        }
    },
    circulateurC1: {
        default: "Plancher chauffant",
        options: {
            "Plancher chauffant": ["C1"],
            "Plancher chauffant sur V3V": ["C1"],
            "Radiateurs": ["C1", ">no_pc_c1"],
            "Radiateurs sur échangeur à plaques": ["C1", ">no_pc_c1"],
            "Radiateurs sur casse pression": ["C1", ">no_pc_c1"],
            "Piscine sur échangeur multi tubulaire": ["C1", ">no_pc_c1"],
            "Piscine sur échangeur à plaques": ["C1", ">no_pc_c1"],
            "Ventilo convecteur": ["C1", ">no_pc_c1"],
            "Décharge sur zone": ["C1", ">no_pc_c1"],
            "Décharge sur zone PC": ["C1"],
            "Multi zones radiateurs": ["C1", ">no_pc_c1"],
            "Multi zones PC": ["C1"],
            "Multi zones PC sur V3V": ["C1"],
            "Process": ["C1", ">no_pc_c1"],
            "Process sur échangeur V3V": ["C1", ">no_pc_c1"],
            "Aucun": [">no_c1", ">no_pc_c1"]
        }
    },
    circulateurC2: {
        default: "Aucun",
        options: {
            "Plancher chauffant": ["C2", "<no_pc_c1"],
            "Radiateurs": ["C2", ">no_pc_c2"],
            "Radiateurs sur échangeur à plaques": ["C2", ">no_pc_c2"],
            "Radiateurs sur casse pression": ["C2", ">no_pc_c2"],
            "Piscine sur échangeur multi tubulaire": ["C2", ">no_pc_c2"],
            "Piscine sur échangeur à plaques": ["C2", ">no_pc_c2"],
            "Ventilo convecteur": ["C2", ">no_pc_c2"],
            "Décharge sur zone": ["C2", ">no_pc_c2"],
            "Décharge sur zone PC": ["C2", "<no_pc_c1"],
            "Multi zones radiateurs": ["C2", ">no_pc_c2"],
            "Multi zones PC": ["C2", "<no_pc_c1"],
            "Process": ["C2", ">no_pc_c2"],
            "Process sur échangeur V3V": ["C2", ">no_pc_c2"],
            "Idem zone N-1": ["C2", "<no_c1"],
            "Aucun": [">no_c2", ">no_pc_c2"]
        }
    },
    circulateurC3: {
        default: "Aucun",
        options: {
            "Plancher chauffant": ["C3", "<no_pc_c2", "<no_pc_c1"],
            "Radiateurs": ["C3", ">no_pc_c3"],
            "Radiateurs sur échangeur à plaques": ["C3", ">no_pc_c3"],
            "Radiateurs sur casse pression": ["C3", ">no_pc_c3"],
            "Piscine sur échangeur multi tubulaire": ["C3", ">no_pc_c3"],
            "Piscine sur échangeur à plaques": ["C3", ">no_pc_c3"],
            "Ventilo convecteur": ["C3", ">no_pc_c3"],
            "Décharge sur zone": ["C3", ">no_pc_c3"],
            "Décharge sur zone PC": ["C3", "<no_pc_c2", "<no_pc_c1"],
            "Multi zones radiateurs": ["C3", ">no_pc_c3"],
            "Multi zones PC": ["C3", "<no_pc_c2", "<no_pc_c1"],
            "Process": ["C3", ">no_pc_c3"],
            "Process sur échangeur V3V": ["C3", ">no_pc_c3"],
            "Idem zone N-1": ["C3", "<no_c2"],
            "Aucun": [">no_c3", ">no_pc_c3"]
        }
    },
    circulateurC7: {
        default: "Aucun",
        options: {
            "Plancher chauffant": ["C7", "<no_pc_c3", "<no_pc_c2"],
            "Radiateurs": ["C7", ">no_pc_c7"],
            "Radiateurs sur échangeur à plaques": ["C7", ">no_pc_c7"],
            "Radiateurs sur casse pression": ["C7", ">no_pc_c7"],
            "Piscine sur échangeur multi tubulaire": ["C7", ">no_pc_c7"],
            "Piscine sur échangeur à plaques": ["C7", ">no_pc_c7"],
            "Ventilo convecteur": ["C7", ">no_pc_c7"],
            "Décharge sur zone": ["C7", ">no_pc_c7"],
            "Décharge sur zone PC": ["C7", "<no_pc_c3", "<no_pc_c2"],
            "Multi zones radiateurs": ["C7", ">no_pc_c7"],
            "Multi zones PC": ["C7", "<no_pc_c3", "<no_pc_c2"],
            "Process": ["C7", ">no_pc_c7"],
            "Process sur échangeur V3V": ["C7", ">no_pc_c7"],
            "Idem zone N-1": ["C7", "<no_c3"],
            "Appoint bois": ["C7", ">no_pc_c7"],
            "Appoint granulé": ["C7", ">no_pc_c7"],
            "Appoint multiple": ["C7", ">no_pc_c7"],
            "Aucun": [">no_c7", ">no_pc_c7"]
        }
    },
    optionS10: {
        default: "Aucun",
        options: {
            "Activable par case à cocher": ["S10"],
            "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC": ["S10", "<no_bt_ech", "<no_divers"],
            "CESI déportée sur T15": ["S10"],
            "charge BTC si excédent APP1 sur T16 & T6 < T5": ["S10", "<no_bt_ech", "<no_t16_cp_ech"],
            "charge BTC si excédent APP1 sur T16 & T6 > T5": ["S10", "<no_bt_ech", "<no_t16_cp_ech"],
            "Circulateur chaudière 1": ["S10"],
            "Circulateur chaudière 2": ["S10"],
            "Décharge sur zone 1": ["S10"],
            "Electrovanne Appoint 1 ou Flow Switch": ["S10"],
            "Free Cooling Zone 1": ["S10"],
            "Free Cooling Zone 2": ["S10"],
            "Free Cooling Zone 3": ["S10"],
            "Free Cooling Zone 4": ["S10"],
            "Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h": ["S10"],
            "Horloge ON de 7h à 10h et 18h à 22h": ["S10"],
            "ON buches en demande": ["S10"],
            "ON en mode excédent d'énergie l'été": ["S10"],
            "ON en mode solaire": ["S10"],
            "Piscine déportée T15": ["S10"],
            "Piscine déportée T6": ["S10"],
            "recharge nappes goethermiques sur T15 sur échangeur BTC": ["S10"],
            "recharge nappes goethermiques sur T15 sur serpentin BTC": ["S10"],
            "Sortie Idem C1": ["S10"],
            "Sortie Idem C2": ["S10"],
            "Sortie Idem C3": ["S10"],
            "Sortie Idem C4": ["S10"],
            "Sortie Idem C5": ["S10"],
            "Sortie Idem C6": ["S10"],
            "Sortie Idem C7": ["S10"],
            "Sortie Idem S11": ["S10"],
            "V3V bypass appoint 1": ["S10"],
            "V3V décharge zone 1": ["S10"],
            "V3V retour bouclage sanitaire solaire": ["S10"],
            "Aucun": []
        }
    },
    optionS11: {
        default: "Aucun",
        options: {
            "Activable par case à cocher": ["S11"],
            "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC": ["S11", "<no_bt_ech", "<no_divers"],
            "CESI déportée sur T16": ["S11"],
            "charge BTC si excédent APP1 sur T16 & T6 < T5": ["S11", "<no_bt_ech"],
            "charge BTC si excédent APP1 sur T16 & T6 > T5": ["S11", "<no_bt_ech"],
            "Circulateur chaudière 1": ["S11"],
            "Circulateur chaudière 2": ["S11"],
            "Décharge sur zone 1": ["S11"],
            "Electrovanne Appoint 1 ou Flow Switch": ["S11"],
            "Free Cooling Zone 1": ["S11"],
            "Free Cooling Zone 2": ["S11"],
            "Free Cooling Zone 3": ["S11"],
            "Free Cooling Zone 4": ["S11"],
            "Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h": ["S11"],
            "Horloge ON de 7h à 10h et 18h à 22h": ["S11"],
            "ON buches en demande": ["S11"],
            "ON en mode excédent d'énergie l'été": ["S11"],
            "ON en mode solaire": ["S11"],
            "recharge nappes goethermiques sur T15 sur échangeur BTC": ["S11"],
            "recharge nappes goethermiques sur T15 sur serpentin BTC": ["S11"],
            "Sortie Idem C1": ["S11"],
            "Sortie Idem C2": ["S11"],
            "Sortie Idem C3": ["S11"],
            "Sortie Idem C4": ["S11"],
            "Sortie Idem C5": ["S11"],
            "Sortie Idem C6": ["S11"],
            "Sortie Idem C7": ["S11"],
            "Sortie Idem S10": ["S11"],
            "V3V bypass appoint 1": ["S11"],
            "V3V décharge zone 1": ["S11"],
            "V3V retour bouclage sanitaire solaire": ["S11"],
            "Aucun": []
        }
    },
    D3: {
        default: "off",
        options: {
            "on":[],
            "off":[]
        }
    },
    D5: {
        default: "off",
        options: {
            "on":[],
            "off":[]
        }
    },
    divers: {
        default: "Aucun",
        options: {
            "deshu sur appoint 1": [],
            "pompe double droite": [],
            "pompe double gauche": [],
            "radiateur sur appoint 1": [],
            "Aucun": [">no_divers"]
        }
    }
};

/**
 * @type {Object<string, {
 *  reason: string,
 *  desc: string,
 * }>}
 */
const signal_reasons = {
    installation_1: {
        reason: "Nécessite une installation de type 2.",
        desc: "Une installation de type 1 interdit le ballon tampon."
    },
    hydraubox: {
        reason: "Nécessite une installation autre qu'une HydrauBox.",
        desc: "Une installation HydrauBox interdit le champ capteur."
    },
    no_BT:{
        reason: "Nécesssite un ballon tampon.",
        desc: "L'absence d'un BT interdit le résistance electrique dans le BT."
    },
    no_BECS:{
        reason: "Nécessite un ballon ECS.",
        desc: "L'absence d'un BECS interdit la résistance electrique dans le BECS."
    },
    app1:{
        reason: "Nécessite aucun appoint 1.",
        desc: "Un appoint 1 interdit les raccordements hydraulique 'en directe' et 'aucun'."
    },
    no_app1:{
        reason: "Nécessite un appoint 1.",
        desc: "L'absence d'un appoint 1 interdit les champs puissance_app1 et la zone chauffé de l'app1."
    },
    no_app1_t16:{
        reason: "Nécessite un appoint 1 bois ou granulé.",
        desc: "L'absence d'un appoint 1 bois ou granulé interdit les raccordement hydraulique sur T16."
    },
    app1_t16:{
        reason: "Nécessite un appoint 1 autre que bois ou granulé.",
        desc: "Un appoint bois ou granulé interdit les raccordement simple, sur CP ou sur ECH."
    },
    pac_app1:{
        reason: "Nécessite un appoint 1 autre que PAC.",
        desc: "Un appoint 1 PAC interdit le raccordement simple."
    },
    no_app2: {
        reason: "Nécessite un appoint 2",
        desc: "L'absence d'appoint 2 interdit le réhaussemenet des retours sur app2."
    },
    app2: {
        reason: "Nécessite aucun appoint 2.",
        desc: "Un appoint 2 interdit le choix aucun pour le type d'app2."
    },
    no_app2_cascade: {
        reason: "Nécessite un appoint 2 en cascade de l'appoint 1.",
        desc: "L'absence d'appoint 2 en cascade interdit les raccordement multiple de l'appoint 1 + certaines options du type de l'appoint 2."
    },
    app2_cascade: {
        reason: "Nécessite un appoint 2 pas en cascade de l'appoint 1.",
        desc: "Un appoint 2 en cascade interdit pleins d'options du raccordement hydraulique de l'app 1."
    },
    no_app2_c7:{
        reason: "Nécessite un appoint 2 sur C7.",
        desc: "L'abscence d'un appoint 2 sur C7 interdit des options de la précision de l'app 2 + interdit le raccordement hydraulique de l'app 2."
    },    
    rh_app2_simple: {
        reason: "Nécessite une casse pression ou un échangeur en raccordement de l'appoint 2.",
        desc: "Un raccordement hydraulique simple de l'app 2 interdit le réhaussement des retours sur app2."
    },
    no_c1: {
        reason: "Nécessite quelque chose sur C1.",
        desc: "L'absence de C1 interdit l'option Idem zone n-1 de C2."
    },
    no_c2: {
        reason: "Nécessite quelque chose sur C2.",
        desc: "L'absence de C2 interdit l'option Idem zone n-1 de C3."
    },
    no_c3: {
        reason: "Nécessite quelque chose sur C3.",
        desc: "L'absence de C3 interdit l'option Idem zone n-1 de C7."
    },
    no_c7: {
        reason: "Nécessite quelque chose sur C7.",
        desc:""
    },
    no_pc_c1: {
        reason: "Nécessite un plancher chauffant sur C1",
        desc: ""
    },
    no_pc_c2: {
        reason: "Nécessite un plancher chauffant sur C2"
    },
    no_pc_c3: {
        reason: "Nécessite un plancher chauffant sur C3"
    },
    no_pc_c7: {
        reason: "Nécessite un plancher chauffant sur C7"
    },
    no_bt_ech:{
        reason: "Nécessite un ballon tampon avec échangeur."
    },
    no_divers:{
        reason: "Nécessite un deshu, un radiateur ou une pompe en divers."
    }

}

/**
 * @type {Object<string, Object<string, true>>}
 */
const hide_signales = {

}

/**
 * default context
 * @type {Object<string, string>}
 */
const DEFAULT_CONTEXT = Object.fromEntries(
  Object.keys(options).map(key => [key, options[key].default])
);


/**
 * Get current formulaire from sessionStorage
 * @returns {Object<string, any>} form data
 */
function get_formulaire() {
    const stored = sessionStorage.getItem("formulaire");

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (err) {
            console.warn("Corrupted sessionStorage formulaire, using default.", err);
        }
    }

    // Return a clone of DEFAULT_CONTEXT to avoid accidental mutation
    return { ...DEFAULT_CONTEXT };
}

/**
 * Circulateurs, sondes, and sorties are extracted from the options
 * based on the value of each form field.
 *
 * @param {Object<string, string>} form_data - The current form data.
 * @return {Object<string, any>} The enriched form data.
 */
function get_equipment_from_form(form_data) {
    const categories = { c: {}, t: {}, s: {} };

    for (const [key, value] of Object.entries(form_data)){
        const values_array = options[key]?.options?.[value];
        if (!values_array) continue;

        for (const v of values_array){
            const category = Object.keys(categories).find(cat => new RegExp(cat, 'i').test(v));
            if (category) categories[category][v] = value;
        }
    }

    return {
        circulateurs: categories.c,
        sondes: categories.t,
        sorties: categories.s
    };
}
