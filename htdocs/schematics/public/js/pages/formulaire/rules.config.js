/**
 * @typedef {Object} Rule
 * @property {string} id
 * @property {(ctx: Object<string, string>) => boolean} when
 * @property {Object<string, string[]>} allow
 * @property {string} reason
 */

/**
 * @type {Rule[]}
 */
const RULES = [
    ////////////////////////////////////////////////////////////////////////////
    //                          BALLON ECS
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "becs-for-sc1z",
        when: (ctx) => ctx.typeInstallation !== "SC1Z",
        allow: {
            ballonECS: [
                "ballon ECS et ballon appoint en série",
                "ballon ECS et ballon appoint en série avec bouclage sanitaire",
                "ballon ECS tank in tank",
                "ballon d'eau chaude sur échangeur",
                "ballon elec en sortie ballon solaire avec bouclage sanitaire",
                "Ballon hygiénique avec 1 echangeur",
                "Ballon hygiénique avec 2 echangeurs",
            ]
        },
        reason: "Nécessite une installation différente d'un SC1Z"
    },
    {
        id: "becs-required-for-re",
        when: (ctx) => ctx.ballonECS !== "Aucun",
        allow: { resistanceElectriqueBECS: ["on"] },
        reason: "Nécessite un ballon ECS."
    },
    ////////////////////////////////////////////////////////////////////////////
    //                          BALLON TAMPON
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "type2-required-for-bt",
        when: (ctx) => /2/i.test(ctx.typeInstallation),
        allow: {
            ballonTampon: [
                "Ballon tampon",
                "2 ballons tampons en série",
                "3 ballons tampons en série",
                "ballon tampon en eau chaude sanitaire",
            ]
        },
        reason: "Nécessite une installation de type 2."
    },
    {
        id: "3bt-for-re-ech",
        when: (ctx) => !/3/i.test(ctx.ballonTampon),
        allow: {
            resistanceElectriqueBT: ["on"],
            EchangeurDansBT: ["on"],
        },
        reason: "Incompatible avec 3 ballon tampon en série."
    },
    {
        id: "bt-ecs",
        when: (ctx) => ctx.ballonTampon !== "ballon tampon en eau chaude sanitaire",
        allow: {
            EchangeurDansBT: ["off"],
        },
        reason: "un BT en ECS à toujours un échangeur."
    },
    {
        id: "bt-required-for-re-ech",
        when: (ctx) => ctx.ballonTampon !== "Aucun",
        allow: {
            resistanceElectriqueBT: ["on"],
            EchangeurDansBT: ["on"],
        },
        reason: "Nécessite un ballon tampon."
    },

    ////////////////////////////////////////////////////////////////////////////
    //                          CAPTEURS
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "hydraubox-for-aucun-capteurs",
        when: (ctx) => /hydraubox/i.test(ctx.typeInstallation),
        allow: { champCapteur: ["Aucun"] },
        reason: "Nécessite une installation HydrauBox."
    },
    {
        id: "no-hydraubox-for-capteurs",
        when: (ctx) => !/hydraubox/i.test(ctx.typeInstallation),
        allow: {
            champCapteur: [
                "1 champ capteurs",
                "2 champs capteurs en série",
                "2 champs capteurs en parallèle",
                "1 champ capteurs découplé sur casse pression sur T16",
                "1 champ capteurs découplé sur échangeur sur T16",
                "1 champ capteurs sur double circulateur sur échangeur sur T16",
                "1 champ capteurs découplé sur casse pression sur T15",
                "1 champ capteurs découplé sur échangeur sur T15",
                "2 champs capteurs sur V3V",
                "2 champs capteurs découplés sur casse pression",
                "2 champs capteurs découplés sur échangeur",
            ]
        },
        reason: "Nécessite une installation autre qu'une HydrauBox."
    },
    {
        id: "T16-enabled-T15",
        when: (ctx) => /T16/i.test(ctx.raccordementHydraulique),
        allow: {
            champCapteur: [
                "1 champ capteurs découplé sur casse pression sur T15",
                "1 champ capteurs découplé sur échangeur sur T15",
            ]
        },
        reason: "Nécessite que la sonde T16 soit déjà prise."
    },
    ////////////////////////////////////////////////////////////////////////////
    //                          APP 1
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "app1-required-for-detail",
        when: (ctx) => ctx.appoint1 !== "Aucun",
        allow: {
            puissanceApp1: ["*"],
            Zone: ["Zone non chauffée", "Zone chauffée"]
        },
        reason: "Nécessite un appoint 1."
    },
    {
        id: "aucun-app1",
        when: (ctx) => ctx.locAppoint2 !== "En cascade d'appoint 1",
        allow: {
            appoint1: ["Aucun"]
        },
        reason: "Incompatible avec un appoint 2 en cascade de l'appoint 1."
    },
    {
        id: "app1-rdr",
        when: (ctx) => /casse pression|échangeur/i.test(ctx.raccordementHydraulique),
        allow: {
            RDH_appoint1: ["on", "off"]
        },
        reason: "Nécessite un appoint 1 sur casse pression ou échangeur"
    },
    {
        id: "pos-rdb-app1",
        when: (ctx) => /réchauffeur de boucle/i.test(ctx.raccordementHydraulique),
        allow: {
            Gauche_droite: ["Gauche", "Droite"]
        },
        reason: "Nécessite un appoint 1 sur réchauffeur de boucle"
    },
    {
        id: "app1-aucun",
        when: (ctx) => ctx.appoint1 === "Aucun",
        allow: {
            raccordementHydraulique: [
                "En direct",
                "Aucun"
            ],
        },
        reason: "Nécessite aucun appoint 1."
    },
    {
        id: "app1-bois",
        when: (ctx) => /bois/i.test(ctx.appoint1) && ctx.locAppoint2 !== "En cascade d'appoint 1",
        allow: {
            raccordementHydraulique: [
                "Appoint simple T16",
                "Appoint sur casse pression T16",
                "Appoint sur échangeur T16",
                "Appoint sur tampon avec échangeur T16 S10",
            ],
        },
        reason: "Nécessite un appoint 1 bois ou granulé"
    },
    {
        id: "pac-disabled-simple",
        when: (ctx) => ctx.appoint1 != "Pompe à chaleur" && ctx.locAppoint2 !== "En cascade d'appoint 1",
        allow: { raccordementHydraulique: ["Appoint simple"] },
        reason: "Nécessite un appoint 1 différent d'un PAC."
    },
    {
        id: "app1-standard",
        when: (ctx) => !/bois|aucun/i.test(ctx.appoint1) && ctx.locAppoint2 !== "En cascade d'appoint 1",
        allow: {
            raccordementHydraulique: [
                "Appoint simple",
                "Appoint sur casse pression",
                "Appoint sur échangeur",
            ],
        },
        reason: "Nécessite un appoint 1 standard."
    },

    ////////////////////////////////////////////////////////////////////////////
    //                          APP 2
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "app2-c7",
        when: (ctx) => ctx.locAppoint2 === "Sur circulateur C7",
        allow: {
            appoint2: [
                "Appoint bois",
                "Appoint granulé",
                "Appoint multiple",
            ],
            RH_appoint2: [
                "simple",
                "sur casse pression",
                "sur échangeur"
            ]
        },
        reason: "Nécessite un appoint 2 sur C7."
    },
    {
        id: "app2-casade",
        when: (ctx) => ctx.locAppoint2 === "En cascade d'appoint 1",
        allow: {
            appoint2: [
                "Electrique",
                "Gaz",
                "Gaz condensation",
                "Fioul",
                "Fioul condensation",
                "PAC",
                "Granulé",
                "Granulé condensation",
                "Bois",
            ],
            raccordementHydraulique: [
                "Appoint double en cascade sur casse pression",
                "Appoint double en cascade sur casse pression T16",
                "Appoint sur casse pression et réchauffeur de boucle",
                "Appoint sur casse pression et réchauffeur de boucle T16",
                "Appoint sur échangeur et réchauffeur de boucle",
                "Appoint sur échangeur et réchauffeur de boucle T16",
                "Appoint double sur échangeur",
                "Appoint double sur échangeur T16",
                "Appoint double",
            ]
        },
        reason: "Nécessite un appoint 2 en cascade de l'appoint 1."
    },
    {
        id: "app2-aucun",
        when: (ctx) => ctx.locAppoint2 === "Aucun",
        allow: {
            appoint2: ["Aucun"]
        },
        reason: "Nécessite aucun appoint 2."
    },
    {
        id: "app2-precision",
        when: (ctx) => ctx.appoint2 !== "Aucun",
        allow: {
            puissanceApp1Multiple: ["*"],
            ZoneMultiple: ["Zone non chauffée", "Zone chauffée"]
        },
        reason: "Nécessite un appoint 2."
    },
    {
        id: "app2-rh",
        when: (ctx) => ctx.appoint2 !== "Appoint multiple",
        allow: {
            RH_appoint2: ["simple"]
        },
        reason: "Nécessite un appoint 2 bois ou granulé."
    },
    {
        id: "rdr-app2",
        when: (ctx) => /casse pression|échangeur/i.test(ctx.RH_appoint2),
        allow: {
            RDH_appoint2: ["on", "off"]
        },
        reason: "Nécessite une casse pression ou un échangeur."
    },

    ////////////////////////////////////////////////////////////////////////////
    //                          CIRCULATEURS
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "pc-zone2",
        when: (ctx) => /plancher chauffant|pc/i.test(ctx.circulateurC1),
        allow: {
            circulateurC2: [
                "Plancher chauffant",
                "Décharge sur zone PC",
                "Multi zones PC",
            ]
        },
        reason: "Nécessite un plancher chauffant sur C1."
    },
    {
        id: "pc-zone3",
        when: (ctx) => /plancher chauffant|pc/i.test(ctx.circulateurC2) ||
            (/plancher chauffant|pc/i.test(ctx.circulateurC1) && ctx.circulateurC2 === "Idem zone N-1"),
        allow: {
            circulateurC3: [
                "Plancher chauffant",
                "Décharge sur zone PC",
                "Multi zones PC",
            ]
        },
        reason: "Nécessite un plancher chauffant sur C2."
    },
    {
        id: "pc-zone4",
        when: (ctx) => /plancher chauffant|pc/i.test(ctx.circulateurC3) ||
            (/plancher chauffant|pc/i.test(ctx.circulateurC2) && ctx.circulateurC3 === "Idem zone N-1") ||
            (/plancher chauffant|pc/i.test(ctx.circulateurC1) && ctx.circulateurC2 === "Idem zone N-1" && ctx.circulateurC3 === "Idem zone N-1"),
        allow: {
            circulateurC7: [
                "Plancher chauffant",
                "Décharge sur zone PC",
                "Multi zones PC",
            ]
        },
        reason: "Nécessite un plancher chauffant sur C3."
    },
    {
        id: "idem-zone2",
        when: (ctx) => ctx.circulateurC1 !== "Aucun",
        allow: {
            circulateurC2: ["Idem zone N-1"]
        },
        reason: "Nécessite une zone 1 de chauffage."
    },
    {
        id: "idem-zone3",
        when: (ctx) => ctx.circulateurC2 !== "Aucun",
        allow: {
            circulateurC3: ["Idem zone N-1"]
        },
        reason: "Nécessite une zone 2 de chauffage."
    },
    {
        id: "idem-zone4",
        when: (ctx) => ctx.circulateurC3 !== "Aucun",
        allow: {
            circulateurC7: ["Idem zone N-1"]
        },
        reason: "Nécessite une zone 3 de chauffage."
    },

    ////////////////////////////////////////////////////////////////////////////
    //                          APPOINT C7
    ////////////////////////////////////////////////////////////////////////////
    {
        id: "app2-on-c7",
        when: (ctx) => ctx.locAppoint2 === "Sur circulateur C7",
        allow: {
            circulateurC7: [
                "Appoint bois",
                "Appoint granulé",
                "Appoint multiple",
            ]
        },
        reason: "Nécesssite un appoint 2 en C7"
    },
    {
        id: "app-bois-c7",
        when: (ctx) => ctx.appoint2 !== "Appoint bois",
        allow: {
            circulateurC7: [
                "Plancher chauffant",
                "Radiateurs",
                "Radiateurs sur échangeur à plaques",
                "Radiateurs sur casse pression",
                "Piscine sur échangeur multi tubulaire",
                "Piscine sur échangeur à plaques",
                "Ventilo convecteur",
                "Décharge sur zone",
                "Décharge sur zone PC",
                "Multi zones radiateurs",
                "Multi zones PC",
                "Process",
                "Process sur échangeur V3V",
                "Idem zone N-1",
                "Appoint granulé",
                "Appoint multiple",
                "Aucun"
            ]
        },
        reason: "Contraint par l'appoint 2 sur C7"
    },
    {
        id: "app-granule-c7",
        when: (ctx) => ctx.appoint2 !== "Appoint granulé",
        allow: {
            circulateurC7: [
                "Plancher chauffant",
                "Radiateurs",
                "Radiateurs sur échangeur à plaques",
                "Radiateurs sur casse pression",
                "Piscine sur échangeur multi tubulaire",
                "Piscine sur échangeur à plaques",
                "Ventilo convecteur",
                "Décharge sur zone",
                "Décharge sur zone PC",
                "Multi zones radiateurs",
                "Multi zones PC",
                "Process",
                "Process sur échangeur V3V",
                "Idem zone N-1",
                "Appoint bois",
                "Appoint multiple",
                "Aucun"
            ]
        },
        reason: "Contraint par l'appoint 2 sur C7"
    },
    {
        id: "app-multiple-c7",
        when: (ctx) => ctx.appoint2 !== "Appoint multiple",
        allow: {
            circulateurC7: [
                "Plancher chauffant",
                "Radiateurs",
                "Radiateurs sur échangeur à plaques",
                "Radiateurs sur casse pression",
                "Piscine sur échangeur multi tubulaire",
                "Piscine sur échangeur à plaques",
                "Ventilo convecteur",
                "Décharge sur zone",
                "Décharge sur zone PC",
                "Multi zones radiateurs",
                "Multi zones PC",
                "Process",
                "Process sur échangeur V3V",
                "Idem zone N-1",
                "Appoint bois",
                "Appoint granulé",
                "Aucun"
            ]
        },
        reason: "Contraint par l'appoint 2 sur C7"
    },

    ////////////////////////////////////////////////////////////////////////////
    //                          SORTIE S10
    ////////////////////////////////////////////////////////////////////////////
    

];


function verify_rules() {
    const ids = new Set();
    const mandatory_keys = ["id", "when", "allow", "reason"];

    RULES.forEach((rule, i) => {
        // Check mandatory keys
        for (const key of mandatory_keys) {
            if (rule[key] === undefined) {
                console.warn(`[verify_rules] Rule #${i} (id="${rule.id || "undefined"}") is missing the key "${key}"`);
            }
        }

        // Check id uniqueness
        if (rule.id) {
            if (ids.has(rule.id)) {
                console.warn(`[verify_rules] Duplicate id detected: "${rule.id}"`);
            }
            ids.add(rule.id);
        }

        // Check `when` type
        if (rule.when && typeof rule.when !== "function") {
            console.warn(`[verify_rules] Rule "${rule.id}" -> "when" should be a function`);
        }

        // Check `allow` structure
        if (rule.allow) {
            if (typeof rule.allow !== "object") {
                console.warn(`[verify_rules] Rule "${rule.id}" -> "allow" should be an object`);
            } else {
                for (const [field, opts] of Object.entries(rule.allow)) {
                    if (!Array.isArray(opts)) {
                        console.warn(`[verify_rules] Rule "${rule.id}" -> "allow.${field}" should be an array`);
                    } else {
                        opts.forEach((opt, idx) => {
                            if (typeof opt !== "string") {
                                console.warn(`[verify_rules] Rule "${rule.id}" -> "allow.${field}[${idx}]" should be a string`);
                            }

                            // check if the field and the option exist
                            if (options?.[field]?.options?.[opt] === undefined) {
                                console.warn(
                                    `[verify_rules] Rule "${rule.id}" -> option "${opt}" for field "${field}" does not exist in the options configuration`
                                );
                            }
                        });
                    }
                }
            }
        }

        // Check reason
        if (rule.reason && typeof rule.reason !== "string") {
            console.warn(`[verify_rules] Rule "${rule.id}" -> "reason" should be a string`);
        }
    });

    console.log(`[verify_rules] Checked ${RULES.length} rules, found ${ids.size} unique ids`);
}

