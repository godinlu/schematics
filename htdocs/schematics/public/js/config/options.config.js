
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
            "SC1Z": [],
            "SC1": [],
            "SC2": [],
            "SC1K": [],
            "SC2K": [],
            "HydrauBox 1": [],
            "HydrauBox 2": []
        }

    },
    installateur:{
        default:"",
        options: { "*": [] }
    },
    "Prénom/nom":{
        default:"",
        options: { "*": [] }
    },
    adresse_mail:{
        default:"",
        options: { "*": [] }
    },
    commercial:{
        default:"",
        options: { "*": [] }
    },
    nom_client:{
        default:"",
        options: { "*": [] }
    },
    prenom_client:{
        default:"",
        options: { "*": [] }
    },
    adresse_client:{
        default:"",
        options: { "*": [] }
    },
    code_postale_client:{
        default:"",
        options: { "*": [] }
    },
    ville_client:{
        default:"",
        options: { "*": [] }
    },
    tel_client:{
        default:"",
        options: { "*": [] }
    },
    mail_client:{
        default:"",
        options: { "*": [] }
    },
    ballonECS: {
        default: "ballon ECS 2 échangeurs",
        options: {
            "ballon ECS 2 échangeurs": [],
            "ballon ECS 2 échangeurs avec bouclage sanitaire": [],
            "ballon ECS et ballon appoint en série": [],
            "ballon ECS et ballon appoint en série avec bouclage sanitaire": [],
            "ballon ECS tank in tank": [],
            "ballon d'eau chaude sur échangeur": [],
            "ballon Appoint en sortie ballon solaire avec bouclage sanitaire": [],
            "ballon Appoint en sortie de 2 ballons solaires avec bouclage sanitaire": [],
            "Ballon hygiénique avec 1 echangeur": [],
            "Ballon hygiénique avec 2 echangeurs": [],
            "Aucun": []
        }
    },
    resistanceElectriqueBECS: {
        default: "off",
        options: {
            "on": [],
            "off": []
        }
    },
    ballonTampon: {
        default: "Ballon tampon",
        options: {
            "Ballon tampon": [],
            "2 ballons tampons en série": [],
            "3 ballons tampons en série": [],
            "ballon tampon en eau chaude sanitaire": [],
            "Aucun": []
        }
    },
    resistanceElectriqueBT: {
        default: "off",
        options: {
            "on": [],
            "off": []
        }
    },
    EchangeurDansBT: {
        default: "on",
        options: {
            "on": [],
            "off": []
        }
    },
    appoint1: {
        default: "Chaudière fioul",
        options: {
            "Chaudière fioul": [],
            "Chaudière gaz": [],
            "Chaudière condensation fioul": [],
            "Chaudière condensation gaz": [],
            "Electrique": [],
            "Pompe à chaleur": [],
            "Bois granulés sur T16": ["T16"],
            "Bois sur T16": ["T16"],
            "Aucun": []
        }
    },
    puissanceApp1: {
        default: "",
        options: { "*": [] }
    },
    Zone: {
        default: "Zone non chauffée",
        options: {
            "Zone non chauffée": [],
            "Zone chauffée": []
        }
    },
    raccordementHydraulique: {
        default: "Appoint simple",
        options: {
            "Appoint simple": [],
            "Appoint sur casse pression": [],
            "Appoint sur échangeur": [],
            "Appoint simple T16": [],
            "Appoint sur casse pression T16": [],
            "Appoint sur échangeur T16": [],
            "Appoint sur tampon avec échangeur T16 S10": ["S10"],
            "Appoint double en cascade sur casse pression": [],
            "Appoint double en cascade sur casse pression T16": ["T16"],
            "Appoint sur casse pression et réchauffeur de boucle": [],
            "Appoint sur casse pression et réchauffeur de boucle T16": ["T16"],
            "Appoint sur échangeur et réchauffeur de boucle": [],
            "Appoint sur échangeur et réchauffeur de boucle T16": ["T16"],
            "Appoint double sur échangeur": [],
            "Appoint double sur échangeur T16": ["T16"],
            "Appoint double": [],
            "En direct": [],
            "Aucun": []
        }
    },
    Gauche_droite: {
        default: "Gauche",
        options: {
            "Gauche": [],
            "Droite": []
        }
    },
    RDH_appoint1: {
        default: "off",
        options: {
            "on": [],
            "off": []
        }
    },
    locAppoint2: {
        default: "Aucun",
        options: {
            "En cascade d'appoint 1": [],
            "Sur circulateur C7": [],
            "Aucun": []
        }
    },
    appoint2: {
        default: "Aucun",
        options: {
            "Electrique": [],
            "Gaz": [],
            "Gaz condensation": [],
            "Fioul": [],
            "Fioul condensation": [],
            "PAC": [],
            "Granulé": [],
            "Granulé condensation": [],
            "Bois": [],
            "Appoint bois": [],
            "Appoint granulé": [],
            "Appoint multiple": [],
            "Aucun": []
        }
    },
    puissanceApp1Multiple: {
        default: "",
        options: { "*": [] }
    },
    ZoneMultiple: {
        default: "Zone non chauffée",
        options: {
            "Zone non chauffée": [],
            "Zone chauffée": []
        }
    },
    RH_appoint2: {
        default: "simple",
        options: {
            "simple": [],
            "sur casse pression": [],
            "sur échangeur": []
        }
    },
    RDH_appoint2: {
        default: "off",
        options: {
            "on": [],
            "off": []
        }
    },
    champCapteur: {
        default: "1 champ capteurs",
        options: {
            "1 champ capteurs": ["T1", "T2"],
            "2 champs capteurs en série": ["T1", "T2", "T10"],
            "2 champs capteurs en parallèle": ["T1", "T2", "T10"],
            "1 champ capteurs découplé sur casse pression sur T16": ["T1", "T2", "T10", "T16", "S11"],
            "1 champ capteurs découplé sur échangeur sur T16": ["T1", "T2", "T10", "T16", "S11"],
            "1 champ capteurs sur double circulateur sur échangeur sur T16": ["T1", "T2", "T10", "T16", "S11"],
            "1 champ capteurs découplé sur casse pression sur T15": ["T1", "T2", "T10", "T15", "S11"],
            "1 champ capteurs découplé sur échangeur sur T15": ["T1", "T2", "T10", "T15", "S11"],
            "2 champs capteurs sur V3V": ["T1", "T2", "T10"],
            "2 champs capteurs découplés sur casse pression": ["T1", "T2", "T10", "T15", "T16", "S10", "S11"],
            "2 champs capteurs découplés sur échangeur": ["T1", "T2", "T10", "T15", "T16", "S10", "S11"],
            "Aucun": []
        }
    },
    circulateurC1: {
        default: "Plancher chauffant",
        options: {
            "Plancher chauffant": ["C1"],
            "Plancher chauffant sur V3V": ["C1"],
            "Radiateurs": ["C1"],
            "Radiateurs sur échangeur à plaques": ["C1"],
            "Radiateurs sur casse pression": ["C1"],
            "Piscine sur échangeur multi tubulaire": ["C1"],
            "Piscine sur échangeur à plaques": ["C1"],
            "Ventilo convecteur": ["C1"],
            "Décharge sur zone": ["C1"],
            "Décharge sur zone PC": ["C1"],
            "Multi zones radiateurs": ["C1"],
            "Multi zones PC": ["C1"],
            "Multi zones PC sur V3V": ["C1"],
            "Process": ["C1"],
            "Process sur échangeur V3V": ["C1"],
            "Aucun": []
        }
    },
    circulateurC2: {
        default: "Aucun",
        options: {
            "Plancher chauffant": ["C2"],
            "Radiateurs": ["C2"],
            "Radiateurs sur échangeur à plaques": ["C2"],
            "Radiateurs sur casse pression": ["C2"],
            "Piscine sur échangeur multi tubulaire": ["C2"],
            "Piscine sur échangeur à plaques": ["C2"],
            "Ventilo convecteur": ["C2"],
            "Décharge sur zone": ["C2"],
            "Décharge sur zone PC": ["C2"],
            "Multi zones radiateurs": ["C2"],
            "Multi zones PC": ["C2"],
            "Process": ["C2"],
            "Process sur échangeur V3V": ["C2"],
            "Idem zone N-1": ["C2"],
            "Aucun": []
        }
    },
    circulateurC3: {
        default: "Aucun",
        options: {
            "Plancher chauffant": ["C3"],
            "Radiateurs": ["C3"],
            "Radiateurs sur échangeur à plaques": ["C3"],
            "Radiateurs sur casse pression": ["C3"],
            "Piscine sur échangeur multi tubulaire": ["C3"],
            "Piscine sur échangeur à plaques": ["C3"],
            "Ventilo convecteur": ["C3"],
            "Décharge sur zone": ["C3"],
            "Décharge sur zone PC": ["C3"],
            "Multi zones radiateurs": ["C3"],
            "Multi zones PC": ["C3"],
            "Process": ["C3"],
            "Process sur échangeur V3V": ["C3"],
            "Idem zone N-1": ["C3"],
            "Aucun": []
        }
    },
    circulateurC7: {
        default: "Aucun",
        options: {
            "Plancher chauffant": ["C7"],
            "Radiateurs": ["C7"],
            "Radiateurs sur échangeur à plaques": ["C7"],
            "Radiateurs sur casse pression": ["C7"],
            "Piscine sur échangeur multi tubulaire": ["C7"],
            "Piscine sur échangeur à plaques": ["C7"],
            "Ventilo convecteur": ["C7"],
            "Décharge sur zone": ["C7"],
            "Décharge sur zone PC": ["C7"],
            "Multi zones radiateurs": ["C7"],
            "Multi zones PC": ["C7"],
            "Process": ["C7"],
            "Process sur échangeur V3V": ["C7"],
            "Idem zone N-1": ["C7"],
            "Appoint bois": ["C7"],
            "Appoint granulé": ["C7"],
            "Appoint multiple": ["C7"],
            "Aucun": []
        }
    },
    optionS10: {
        default: "Aucun",
        options: {
            "Activable par case à cocher": ["S10"],
            "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC": ["S10"],
            "CESI déportée sur T15": ["S10", "T15"],
            "charge BTC si excédent APP1 sur T16 & T6 < T5": ["S10"],
            "charge BTC si excédent APP1 sur T16 & T6 > T5": ["S10"],
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
            "Piscine déportée T15": ["S10", "T15"],
            "Piscine déportée T6": ["S10", "T6"],
            "recharge nappes goethermiques sur T15 sur échangeur BTC": ["S10", "T15"],
            "recharge nappes goethermiques sur T15 sur serpentin BTC": ["S10", "T15"],
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
            "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC": ["S11"],
            "CESI déportée sur T16": ["S11", "T16"],
            "charge BTC si excédent APP1 sur T16 & T6 < T5": ["S11"],
            "charge BTC si excédent APP1 sur T16 & T6 > T5": ["S11"],
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
            "on": [],
            "off": []
        }
    },
    D5: {
        default: "off",
        options: {
            "on": [],
            "off": []
        }
    },
    divers: {
        default: "Aucun",
        options: {
            "deshu sur appoint 1": [],
            "pompe double droite": [],
            "pompe double gauche": [],
            "radiateur sur appoint 1": [],
            "Aucun": []
        }
    }
};


/**
 * default context
 * @type {Object<string, string>}
 */
const DEFAULT_CONTEXT = Object.fromEntries(
    Object.keys(options).map(key => [key, options[key].default])
);

/**
 * Circulateurs, sondes, and sorties are extracted from the options
 * based on the value of each form field.
 *
 * @param {Object<string, string>} form_data - The current form data.
 * @return {Object<string, any>} The enriched form data.
 */
function get_equipment_from_form(form_data) {
    const categories = { c: {}, t: {}, s: {} };

    for (const [key, value] of Object.entries(form_data)) {
        const values_array = options[key]?.options?.[value];
        if (!values_array) continue;

        for (const v of values_array) {
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
