/**
 * @typedef {Object} Rule
 * @property {(ctx: Object<string, string>) => boolean} when
 * @property {Object<string, string[]>} allow
 * @property {string} reason
 */

/**
 * @typedef {Object} EventRule
 * @property {(ctx: Object<string, string>, updated_field: string) => boolean} when
 * @property {Object<string, string>} force
 * @property {string} reason
 */


const EXCLUDE_FLAG = "__EXCLUDE__";

/** @type {Object<string, Rule>} */
const __RULES = {
    ////////////////////////////////////////////////////////////////////////////
    //                          BALLON ECS
    ////////////////////////////////////////////////////////////////////////////
    "becs-for-sc1z": {
        when: (ctx) => ctx.typeInstallation !== "SC1Z",
        allow: {
            ballonECS: [
                EXCLUDE_FLAG,
                "ballon ECS 2 échangeurs",
                "ballon ECS 2 échangeurs avec bouclage sanitaire",
                "Aucun"
            ]
        },
        reason: "Nécessite une installation différente d'un SC1Z"
    },
    "becs-required-for-re": {
        when: (ctx) => ctx.ballonECS !== "Aucun",
        allow: { resistanceElectriqueBECS: ["on"] },
        reason: "Nécessite un ballon ECS."
    },

    ////////////////////////////////////////////////////////////////////////////
    //                          BALLON TAMPON
    ////////////////////////////////////////////////////////////////////////////

    "type2-required-for-bt": {
        when: (ctx) => /2/i.test(ctx.typeInstallation),
        allow: {
            ballonTampon: [EXCLUDE_FLAG, "Aucun"]
        },
        reason: "Nécessite une installation de type 2."
    },
    "3bt-for-re-ech": {
        when: (ctx) => !/3/i.test(ctx.ballonTampon),
        allow: {
            resistanceElectriqueBT: ["on"],
            EchangeurDansBT: ["on"],
        },
        reason: "Incompatible avec 3 ballon tampon en série."
    },
    "bt-ecs": {
        when: (ctx) => ctx.ballonTampon !== "ballon tampon en eau chaude sanitaire",
        allow: {
            EchangeurDansBT: ["off"],
        },
        reason: "un BT en ECS à toujours un échangeur."
    },
    "bt-required-for-re-ech": {
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
    "hydraubox-for-aucun-capteurs": {
        when: (ctx) => /hydraubox/i.test(ctx.typeInstallation),
        allow: { champCapteur: ["Aucun"] },
        reason: "Nécessite une installation HydrauBox."
    },
    "no-hydraubox-for-capteurs": {
        when: (ctx) => !/hydraubox/i.test(ctx.typeInstallation),
        allow: {
            champCapteur: [EXCLUDE_FLAG, "Aucun"]
        },
        reason: "Nécessite une installation autre qu'une HydrauBox."
    },
    "T16-enabled-T15": {
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
    "app1-required-for-detail": {
        when: (ctx) => ctx.appoint1 !== "Aucun",
        allow: {
            puissanceApp1: ["*"],
            Zone: ["Zone non chauffée", "Zone chauffée"]
        },
        reason: "Nécessite un appoint 1."
    },
    "aucun-app1": {
        when: (ctx) => ctx.locAppoint2 !== "En cascade d'appoint 1",
        allow: {
            appoint1: ["Aucun"]
        },
        reason: "Incompatible avec un appoint 2 en cascade de l'appoint 1."
    },
    "app1-rdr": {
        when: (ctx) => /casse pression|échangeur/i.test(ctx.raccordementHydraulique),
        allow: {
            RDH_appoint1: ["on", "off"]
        },
        reason: "Nécessite un appoint 1 sur casse pression ou échangeur"
    },
    "pos-rdb-app1": {
        when: (ctx) => /réchauffeur de boucle/i.test(ctx.raccordementHydraulique),
        allow: {
            Gauche_droite: ["Gauche", "Droite"]
        },
        reason: "Nécessite un appoint 1 sur réchauffeur de boucle"
    },
    "app1-aucun": {
        when: (ctx) => ctx.appoint1 === "Aucun",
        allow: {
            raccordementHydraulique: [
                "En direct",
                "Aucun"
            ],
        },
        reason: "Nécessite aucun appoint 1."
    },
    "app1-bois": {
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
    "pac-disabled-simple": {
        when: (ctx) => ctx.appoint1 != "Pompe à chaleur" && ctx.locAppoint2 !== "En cascade d'appoint 1",
        allow: { raccordementHydraulique: ["Appoint simple"] },
        reason: "Nécessite un appoint 1 différent d'un PAC."
    },
    "app1-standard": {
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
    "app2-c7": {
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
    "app2-casade": {
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
    "app2-aucun": {
        when: (ctx) => ctx.locAppoint2 === "Aucun",
        allow: {
            appoint2: ["Aucun"]
        },
        reason: "Nécessite aucun appoint 2."
    },
    "app2-precision": {
        when: (ctx) => ctx.appoint2 !== "Aucun",
        allow: {
            puissanceApp1Multiple: ["*"],
            ZoneMultiple: ["Zone non chauffée", "Zone chauffée"]
        },
        reason: "Nécessite un appoint 2."
    },
    "app2-rh": {
        when: (ctx) => ctx.appoint2 !== "Appoint multiple",
        allow: {
            RH_appoint2: ["simple"]
        },
        reason: "Nécessite un appoint 2 bois ou granulé."
    },
    "rdr-app2": {
        when: (ctx) => /casse pression|échangeur/i.test(ctx.RH_appoint2),
        allow: {
            RDH_appoint2: ["on", "off"]
        },
        reason: "Nécessite une casse pression ou un échangeur."
    },
    ////////////////////////////////////////////////////////////////////////////
    //                          CIRCULATEURS
    ////////////////////////////////////////////////////////////////////////////
    "pc-zone2": {
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
    "pc-zone3": {
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
    "pc-zone4": {
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
    "idem-zone2": {
        when: (ctx) => ctx.circulateurC1 !== "Aucun",
        allow: {
            circulateurC2: ["Idem zone N-1"]
        },
        reason: "Nécessite une zone 1 de chauffage."
    },
    "idem-zone3": {
        when: (ctx) => ctx.circulateurC2 !== "Aucun",
        allow: {
            circulateurC3: ["Idem zone N-1"]
        },
        reason: "Nécessite une zone 2 de chauffage."
    },
    "idem-zone4": {
        when: (ctx) => ctx.circulateurC3 !== "Aucun",
        allow: {
            circulateurC7: ["Idem zone N-1"]
        },
        reason: "Nécessite une zone 3 de chauffage."
    },
    ////////////////////////////////////////////////////////////////////////////
    //                          APPOINT C7
    ////////////////////////////////////////////////////////////////////////////
    "app2-on-c7": {
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
    "app-bois-c7": {
        when: (ctx) => ctx.appoint2 !== "Appoint bois",
        allow: {
            circulateurC7: [EXCLUDE_FLAG, "Appoint bois"]
        },
        reason: "Contraint par l'appoint 2 sur C7"
    },
    "app-granule-c7": {
        when: (ctx) => ctx.appoint2 !== "Appoint granulé",
        allow: {
            circulateurC7: [EXCLUDE_FLAG, "Appoint granulé"]
        },
        reason: "Contraint par l'appoint 2 sur C7"
    },
    "app-multiple-c7": {
        when: (ctx) => ctx.appoint2 !== "Appoint multiple",
        allow: {
            circulateurC7: [EXCLUDE_FLAG, "Appoint multiple"]
        },
        reason: "Contraint par l'appoint 2 sur C7"
    },
    ////////////////////////////////////////////////////////////////////////////
    //                          OPTION S10 + S11
    ////////////////////////////////////////////////////////////////////////////
    "opt-aquastat": {
        when: (ctx) => ctx.EchangeurDansBT === "on" && ctx.divers !== "Aucun",
        allow: {
            optionS10: ["Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC"],
            optionS11: ["Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC"],
        },
        reason: "Nécessite :\n - Un ballon tampon avec échangeur\n - Une pompe ou une deshu dans divers"
    },
    "opt-charge-btc": {
        when: (ctx) => ctx.EchangeurDansBT === "on" && /(casse pression|échangeur).*T16/.test(ctx.raccordementHydraulique),
        allow: {
            optionS10: [
                "charge BTC si excédent APP1 sur T16 & T6 < T5",
                "charge BTC si excédent APP1 sur T16 & T6 > T5",
            ],
            optionS11: [
                "charge BTC si excédent APP1 sur T16 & T6 < T5",
                "charge BTC si excédent APP1 sur T16 & T6 > T5",
            ],
        },
        reason: "Nécessite :\n - Un ballon tampon avec échangeur\n - un appoint 1 sur T16 avec casse pression ou échangeur"
    },
    ...Object.fromEntries(Object.entries({
        "Free Cooling Zone 1": "circulateurC1",
        "Free Cooling Zone 2": "circulateurC2",
        "Free Cooling Zone 3": "circulateurC3",
        "Free Cooling Zone 4": "circulateurC7",
    }).map(([opt, circ]) => [`opt-free-cooling-${circ}`, {
        when: (ctx) => /plancher chauffant|pc/i.test(ctx[circ]),
        allow: {
            optionS10: [opt],
            optionS11: [opt]
        },
        reason: `Nécessite un plancher chauffant sur ${circ}.`
    }])),
    ...Object.fromEntries(["C1", "C2", "C3", "C7"].map(c => [
        `opt-idem-${c}`,
        {
            when: (ctx) => ctx[`circulateur${c}`] !== "Aucun",
            allow: {
                optionS10: [`Sortie Idem ${c}`],
                optionS11: [`Sortie Idem ${c}`],
            },
            reason: `Nécessite une zone de chauffage sur ${c}`
        }
    ])),
    "opt-piscine-deporte-T6": {
        when: (ctx) => /T15/i.test(ctx.champCapteur),
        allow: { optionS10: ["Piscine déportée T6"] },
        reason: "Activable seulement si la sonde T15 est déjà prise."
    },
    "opt-recharge-napp-geo-ech": {
        when: (ctx) => ctx.EchangeurDansBT === "on" && ctx.ballonTampon === "Ballon tampon" && ctx.appoint1 === "Pompe à chaleur",
        allow: {
            optionS10: ["recharge nappes goethermiques sur T15 sur échangeur BTC"],
            optionS11: ["recharge nappes goethermiques sur T15 sur échangeur BTC"]
        },
        reason: "Nécessite :\n - Un ballon tampon avec échangeur\n - Un appoint 1 PAC"
    },
    "opt-recharge-napp-geo-serp": {
        when: (ctx) => ctx.EchangeurDansBT === "off" && ctx.ballonTampon === "Ballon tampon" && ctx.appoint1 === "Pompe à chaleur",
        allow: {
            optionS10: ["recharge nappes goethermiques sur T15 sur serpentin BTC"],
            optionS11: ["recharge nappes goethermiques sur T15 sur serpentin BTC"]
        },
        reason: "Nécessite :\n - Un ballon tampon sans échangeur\n - Un appoint 1 PAC"
    },
    "opt-v3v-retour-bouclage": {
        when: (ctx) => /bouclage sanitaire/i.test(ctx.ballonECS),
        allow: {
            optionS10: ["V3V retour bouclage sanitaire solaire"],
            optionS11: ["V3V retour bouclage sanitaire solaire"]
        },
        reason: "Nécessite une bouclage sanitaire sur le ballon ECS."
    }

}

/** @type {Object<string, EventRule>} */
const __EVENT_RULES = {
    "default-bt": {
        when: (ctx, updated_field) =>
            updated_field === "typeInstallation" &&
            /2/.test(ctx.typeInstallation) &&
            ctx.ballonTampon === "Aucun",
        force: { ballonTampon: "Ballon tampon" },
        reason: "Par défaut on choisit un ballon tampon pour une installation de type 2."
    },
    "default-ech-dans-bt": {
        when: (ctx, updated_field) =>
            updated_field === "ballonTampon" &&
            ctx.ballonTampon !== "Aucun",
        force: { EchangeurDansBT: "on" },
        reason: "Par défaut on met un échangeur dans le ballon tampon."
    }
};

class RulesConfig {
    constructor() {
        this._rules = __RULES
        this._compiled = false;
        this._event_rules = __EVENT_RULES;
    }

    /**
     * @returns {Object<string, Rule>}
     */
    get rules() {
        if (!this._compiled) {
            throw new Error("The rules need to be compiled first");
        }
        return this._rules;
    }

    /**
     * @returns {Object<string, EventRule>}
     */
    get event_rules() {
        return this._event_rules;
    }

    /**
     * Compile rules by resolving EXCLUDE_FLAG syntax.
     * @param {Options} all_options 
     * @param {string} str_flag 
     */
    compile_rules(all_options, str_flag = EXCLUDE_FLAG) {
        const compiled = {};

        for (const [id, rule] of Object.entries(this._rules)) {

            compiled[id] = {
                ...rule,
                allow: structuredClone(rule.allow)
            };

            for (const [field, options] of Object.entries(rule.allow)) {

                if (!Array.isArray(options)) continue;
                if (options.length === 0) continue;
                if (options[0] !== str_flag) continue;

                const allowed = new Set(
                    Object.keys(all_options[field].options)
                );

                for (const opt of options.slice(1)) {
                    allowed.delete(opt);
                }

                compiled[id].allow[field] = [...allowed];
            }
        }
        this._rules = compiled;
        this._compiled = true;
    }
}

const rule_config = new RulesConfig();

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

