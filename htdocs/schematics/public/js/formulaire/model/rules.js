/**
 * @typedef {Object} OptionsEffect
 * @property {"disabled-options"|"disabled-other-options"|"hide-options"|"hide-other-options"} type
 * @property {string} field
 * @property {RegExp} regex
 * @property {string} reason
 */

/**
 * @typedef {Object} ForceDefaultEffect
 * @property {"force-default"} type
 * @property {string} field
 * @property {string} value
 */

/**
 * @typedef {OptionsEffect} Effect
 */

/**
 * @typedef {ForceDefaultEffect} EventEffect
 */

/**
 * @param {string} changed_field
 * @param {Object<string, string>} ctx 
 * @returns {Effect[]}
 */
const evaluate_rules = (ctx) => [
    ctx.typeInstallation === "SC1Z" && 
        disable_other("ballonECS", /^ballon ecs 2|^aucun$/i, "Les installations SC1Z ne permettent pas ce ballon ECS."),
    /1/i.test(ctx.typeInstallation) &&
        disable_other("ballonTampon", /^aucun$/i, "Les installations SC1Z, SC1, SC1K, HydrauBox 1 ne permettent pas de ballon tampon."),
    /hydraubox/i.test(ctx.typeInstallation) &&
        disable_other("champCapteur", /^aucun$/i, "Les installations Hydraubox ne permettent pas de champ capteurs"),
    !/hydraubox/i.test(ctx.typeInstallation) &&
        disable("champCapteur", /^aucun$/i, "Seule les installations Hydraubox ne permettent pas de champ capteurs "),

    // ballon ECS
    ctx.ballonECS === "Aucun" &&
        disable("resistanceElectriqueBECS", /^on$/, "Une résistance électrique ne peut pas être activée sans ballon ECS."),

    // ballon tampon
    ctx.ballonTampon === "Aucun" && [
        disable("resistanceElectriqueBT", /^on$/, "Une résistance électrique ne peut pas être activée sans ballon tampon."),
        disable("EchangeurDansBT", /^on$/, "Un échangeur dans le ballon tampon ne peut pas être activée sans ballon tampon.")
    ],
    /3/.test(ctx.ballonTampon) && [
        disable("EchangeurDansBT", /^on$/, "Un échangeur dans le ballon tampon ne peut pas être activée avec 3 ballons tampons en série."),
        disable("resistanceElectriqueBT", /^on$/, "Une résistance électrique ne peut pas être activée avec 3 ballons tampons en série."),
    ],
    /sanitaire/i.test(ctx.ballonTampon) &&
        disable("EchangeurDansBT", /^off$/, "L'échangeur est obligatoire pour un ballon tampon en eau chaude sanitaire."),

    // Appoint 1
    /^chaudière|^electrique$/i.test(ctx.appoint1) && ctx.locAppoint2 !== "cascade" &&
        hide_other("raccordementHydraulique", /^Appoint simple$|^Appoint sur casse pression$|^Appoint sur échangeur$/),
    /^pompe à chaleur$/i.test(ctx.appoint1) && ctx.locAppoint2 !== "cascade" &&
        hide_other("raccordementHydraulique", /^Appoint sur casse pression$|^Appoint sur échangeur$/),
    /T16/i.test(ctx.appoint1) && ctx.locAppoint2 !== "cascade" &&
        hide_other("raccordementHydraulique", /^Appoint simple T16$|^Appoint sur casse pression T16$|^Appoint sur échangeur T16$|^Appoint sur tampon avec échangeur T16 S10$/),
    /aucun/i.test(ctx.appoint1) && [
        hide_other("raccordementHydraulique", /^En direct$/i),
        hide("puissanceApp1", /\*/),
        hide("Zone", /.*/),

        // Si aucun appoint 1 interdire toute les options de divers + le comptage D5
        disable_other("divers", /aucun/i, "Option activable seulement si il y a un appoint 1."),
        disable("D5", /on/i, "Option activable seulement si il y a un appoint 1.")
    ],

    // raccordement Hydraulique
    /T16/i.test(ctx.raccordementHydraulique) &&
        disable("champCapteur", /T16|2.*(casse pression|échangeur)/i, "La sonde T16 est déjà prise par l'appoint 1"),
    !/T16/i.test(ctx.raccordementHydraulique) && 
        disable("champCapteur", /T15/i, "Option activable seulement si la sonde T16 est déjà prise par l'appoint 1."),
    /S10/i.test(ctx.raccordementHydraulique) &&
        disable("champCapteur", /v3v/i, "La sonde S10 est déjà prise par l'appoint 1."),
    !/casse pression|échangeur/i.test(ctx.raccordementHydraulique) &&
        disable("RDH_appoint1", /on/, "Disponible seulement si le raccordement de l'appoint 1 contient une casse pression ou un échangeur."),
    !/réchauffeur de boucle/i.test(ctx.raccordementHydraulique) &&
        hide("Gauche_droite", /.*/),

    // locAppoint2
    ctx.locAppoint2 !== "Aucun" &&
        disable("appoint2", /aucun/i, "Disponible seulement si il n'y a pas d'appoint 2."),
    ctx.locAppoint2 !== "C7" &&
        disable("appoint2", /appoint/i, "Disponible seulement si l'appoint 2 est en cascade de l'appoint 1."),
    ctx.locAppoint2 !== "cascade" && 
        disable_other("appoint2", /appoint|aucun/i, "Disponible seulement si l'appoint 2 est sur C7."),
    ctx.locAppoint2 === "cascade" && [
        hide_other("raccordementHydraulique", /double|et/i),
        disable("appoint1", /aucun/i, "Indisponible lorsque l'appoint 2 est en cascade de l'appoint 1."),
    ],
        

    // Apoint 2
    ctx.appoint2 === "Appoint bois" &&
        disable_other("circulateurC7", /^Appoint bois$/i, "Un appoint est sur C7."),
    ctx.appoint2 === "Appoint granulé" &&
        disable_other("circulateurC7", /^Appoint granulé$/i, "Un appoint est sur C7."),
    ctx.appoint2 === "Appoint multiple" &&
        disable_other("circulateurC7", /^Appoint multiple$/i, "Un appoint est sur C7."),
    !/appoint/i.test(ctx.appoint2) && [
        disable("circulateurC7", /appoint/i, "Option activable seulement avec une appoint 2 sur C7."),
        hide("RH_appoint2", /.*/)
    ],
    ctx.appoint2 === "Aucun" && [
        hide("ZoneMultiple", /.*/),
        hide("puissanceApp1Multiple", /.*/)
    ],
    // RH_appoint2
    !/casse pression|échangeur/i.test(ctx.RH_appoint2) && 
        disable("RDH_appoint2", /on/, "Option activable seulement si il y a un appoint 2 sur C7 avec un raccordement sur casse pression ou échangeur."),

    // CirculateurC1
    !/plancher chauffant|PC/i.test(ctx.circulateurC1) &&
        disable("circulateurC2", /plancher chauffant|PC/i, "Option activable seulement si un plancher chauffant est présent sur le circulateur 1."),
    ctx.circulateurC1 === "Aucun" &&
        disable("circulateurC2", /idem zone n-1/i, "Option activable seulement si quelque chose est présent sur le circulateur 1."),
    
    // CirculateurC2
    !/plancher chauffant|PC/i.test(ctx.circulateurC2) &&
        disable("circulateurC3", /plancher chauffant|PC/i, "Option activable seulement si un plancher chauffant est présent sur le circulateur 2."),
    ctx.circulateurC2 === "Aucun" &&
        disable("circulateurC3", /idem zone n-1/i, "Option activable seulement si quelque chose est présent sur le circulateur 2."),
    
    // CirculateurC3
    !/plancher chauffant|PC/i.test(ctx.circulateurC3) &&
        disable("circulateurC7", /plancher chauffant|PC/i, "Option activable seulement si un plancher chauffant est présent sur le circulateur 3."),
    ctx.circulateurC3 === "Aucun" &&
        disable("circulateurC7", /idem zone n-1/i, "Option activable seulement si quelque chose est présent sur le circulateur 3."),


    // =============================================================================
    //                              OPTIONS S10 + S11
    // =============================================================================

    // Options activable soir sur S10 soit sur S11
    [
        "Décharge sur zone 1",
        "ON en mode solaire",
        "Sortie Idem C4",
        "V3V décharge zone 1",
        "Electrovanne Appoint 1 ou Flow Switch",
        "Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h",
        "Sortie Idem C1",
        "Sortie Idem C2",
        "Sortie Idem C3",
        "ON en mode excédent d'énergie l'été",
        "Circulateur chaudière 1",
        "Circulateur chaudière 2",
        "Sortie Idem C5",
        "Sortie Idem C6",
        "Sortie Idem C7",
        "ON buches en demande",
        "Free Cooling Zone 1",
        "Free Cooling Zone 2",
        "Free Cooling Zone 3",
        "Free Cooling Zone 4",
        "Horloge ON de 7h à 10h et 18h à 22h"
    ].flatMap(opt => {
        const regex = new RegExp(opt, "i");
        return [
            regex.test(ctx.optionS10) && disable("optionS11", regex, `L'option : '${opt}' est déjà prise par S10.`),
            regex.test(ctx.optionS11) && disable("optionS10", regex, `L'option : '${opt}' est déjà prise par S11.`)
        ];
    }),

    // V3V retour du bouclage sanitaire nécessite un bouclage sanitaire sur le ballon ECS
    !/bouclage sanitaire/i.test(ctx.ballonECS) && [
        disable("optionS10", /bouclage sanitaire/i, "Nécessite une bouclage sanitaire sur le ballon ECS."),
        disable("optionS11", /bouclage sanitaire/i, "Nécessite une bouclage sanitaire sur le ballon ECS.")
    ],
    // Piscine déporté T6 nécessite que la sonde T15 soit prise 
    !/T15/i.test(ctx.champCapteur) && 
        disable("optionS10", /piscine déportée T6/i, "option activable seulement si la sonde T15 est déjà prise par le champ capteur."),
    
    // Piscine déporté T15 nécessite que la sonde T15 soit libre
    /T15/i.test(ctx.champCapteur) &&
        disable("optionS10", /piscine déportée T15/i, "option activable seulement si la sonde T15 n'est pas prise par le champ capteur."),

    // C1, C2, C3, C7 activable seulement si les circulateurs corespondant sont différent de Aucun
    ["C1", "C2", "C3", "C7"].flatMap(c =>{
        const regex = new RegExp(`sortie idem ${c}`, "i");
        return ctx[`circulateur${c}`] === "Aucun" && [
            disable("optionS10", regex, `Nécessite quelque chose sur le circulateur ${c}`),
            disable("optionS11", regex, `Nécessite quelque chose sur le circulateur ${c}`)
        ];
    }),

    // free cooling activable seulement si un plancher chauffant est présent dans la zone correspondante.
    Object.entries({
        "zone 1" : "circulateurC1",
        "zone 2" : "circulateurC2",
        "zone 3" : "circulateurC3",
        "zone 4" : "circulateurC7"
    }).flatMap(([zone, circ]) =>{
        const regex = new RegExp(`free cooling ${zone}`, "i");

        return !/plancher chauffant|PC/i.test(ctx[circ]) && [
            disable("optionS10", regex, `Nécessite un plancher chauffant sur ${circ}.`),
            disable("optionS11", regex, `Nécessite un plancher chauffant sur ${circ}.`)
        ];
    }),

].flat().filter(Boolean);


/**
 * 
 * @param {string} changed_field 
 * @param {Object<string, string>} ctx 
 * @returns {EventEffect[]}
 */
const evaluate_event_rules = (changed_field, ctx) => [
    changed_field === "typeInstallation" && /2/.test(ctx.typeInstallation) && ctx.ballonTampon === "Aucun" &&
        force_default("ballonTampon", "Ballon tampon"),
    changed_field === "ballonTampon" && ctx.ballonTampon !== "Aucun" &&
        force_default("EchangeurDansBT", "on")
].flat().filter(Boolean);


/**
 * Disable matching options
 *
 * @param {string} field
 * @param {RegExp} regex
 * @param {string} [reason]
 * @returns {OptionsEffect}
 */
function disable(field, regex, reason){
    return {
        type: "disabled-options",
        field,
        regex,
        reason: reason ?? ""
    };
}


/**
 * Disable all options except matching ones
 *
 * @param {string} field
 * @param {RegExp} regex
 * @param {string} [reason]
 * @returns {OptionsEffect}
 */
function disable_other(field, regex, reason){
    return {
        type: "disabled-other-options",
        field,
        regex,
        reason: reason ?? ""
    };
}


/**
 * Hide matching options
 *
 * @param {string} field
 * @param {RegExp} regex
 * @param {string} [reason]
 * @returns {OptionsEffect}
 */
function hide(field, regex, reason){
    return {
        type: "hide-options",
        field,
        regex,
        reason: reason ?? ""
    };
}


/**
 * Hide all options except matching ones
 *
 * @param {string} field
 * @param {RegExp} regex
 * @param {string} [reason]
 * @returns {OptionsEffect}
 */
function hide_other(field, regex, reason){
    return {
        type: "hide-other-options",
        field,
        regex,
        reason: reason ?? ""
    };
}


/**
 * Force selection of a specific option
 *
 * @param {string} field
 * @param {string} value
 * @returns {ForceDefaultEffect}
 */
function force_default(field, value){
    return {
        type: "force-default",
        field,
        value,
    };
}



