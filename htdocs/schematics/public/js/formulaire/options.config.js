/**
 * @typedef {Object<string, {
 *  default: string,
 *  options: string[]
 * }>} Options
 */

/** @type {Options} */
const options = {
    typeInstallation: {
        default: "SC2",
        options: [
            "SC1Z",
            "SC1",
            "SC2",
            "SC1K",
            "SC2K",
            "HydrauBox 1",
            "HydrauBox 2"
        ]
    },
    ballonECS: {
        default: "ballon ECS 2 échangeurs",
        options: [
            "ballon ECS 2 échangeurs",
            "ballon ECS 2 échangeurs avec bouclage sanitaire",
            "ballon ECS et ballon appoint en série",
            "ballon ECS et ballon appoint en série avec bouclage sanitaire",
            "ballon ECS tank in tank",
            "ballon d'eau chaude sur échangeur",
            "ballon elec en sortie ballon solaire avec bouclage sanitaire",
            "Ballon hygiénique avec 1 echangeur",
            "Ballon hygiénique avec 2 echangeurs",
            "Aucun"
        ]
    },
    resistanceElectriqueBECS: {
        default: "off", 
        options: ["on", "off"]
    },
    ballonTampon: {
        default: "Ballon tampon",
        options: [
            "Ballon tampon",
            "2 ballons tampons en série",
            "3 ballons tampons en série",
            "ballon tampon en eau chaude sanitaire",
            "Aucun"
        ]
    },
    resistanceElectriqueBT: {
        default: "off",
        options: ["on", "off"]
    },
    EchangeurDansBT: {
        default: "on",
        options: ["on", "off"]
    },
    appoint1: {
        default: "Chaudière fioul",
        options: [
            "Chaudière fioul",
            "Chaudière gaz",
            "Chaudière condensation fioul",
            "Chaudière condensation gaz",
            "Electrique",
            "Pompe à chaleur",
            "Bois granulés sur T16",
            "Bois sur T16",
            "Aucun"
        ]
    },
    puissanceApp1:{
        default: "",
        options: ["*"]
    },
    Zone: {
        default: "Zone non chauffée",
        options: [
            "Zone non chauffée",
            "Zone chauffée"
        ]
    },
    raccordementHydraulique: {
        default: "Appoint simple",
        options: [
            "Appoint simple",
            "Appoint sur casse pression",
            "Appoint sur échangeur",
            "Appoint simple T16",
            "Appoint sur casse pression T16",
            "Appoint sur échangeur T16",
            "Appoint sur tampon avec échangeur T16 S10",
            "Appoint double en cascade sur casse pression",
            "Appoint double en cascade sur casse pression T16",
            "Appoint sur casse pression et réchauffeur de boucle",
            "Appoint sur casse pression et réchauffeur de boucle T16",
            "Appoint sur échangeur et réchauffeur de boucle",
            "Appoint sur échangeur et réchauffeur de boucle T16",
            "Appoint double sur échangeur",
            "Appoint double sur échangeur T16",
            "Appoint double",
            "En direct"
        ]
    },
    Gauche_droite: {
        default: "Gauche",
        options: [
            "Gauche",
            "Droite"
        ]
    },
    RDH_appoint1: {
        default: "off",
        options: ["on", "off"]
    },
    locAppoint2: {
        default: "Aucun",
        options: ["En cascade d'appoint 1", "Sur circulateur C7", "Aucun"]
    },
    appoint2: {
        default: "Aucun",
        options: [
            "Electrique",
            "Gaz",
            "Gaz condensation",
            "Fioul",
            "Fioul condensation",
            "PAC",
            "Granulé",
            "Granulé condensation",
            "Bois",
            "Appoint bois",
            "Appoint granulé",
            "Appoint multiple",
            "Aucun"
        ]
    },
    puissanceApp1Multiple:{
        default: "",
        options: ["*"]
    },
    ZoneMultiple: {
        default: "Zone non chauffée",
        options: [
            "Zone non chauffée",
            "Zone chauffée"
        ]
    },
    RH_appoint2: {
        default: "simple",
        options: [
            "simple",
            "sur casse pression",
            "sur échangeur"
        ]
    },
    RDH_appoint2: {
        default: "off",
        options: ["on", "off"]
    },
    champCapteur: {
        default: "1 champ capteurs",
        options: [
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
            "Aucun"
        ]
    },
    circulateurC1: {
        default: "Plancher chauffant",
        options: [
            "Plancher chauffant",
            "Plancher chauffant sur V3V",
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
            "Multi zones PC sur V3V",
            "Process",
            "Process sur échangeur V3V",
            "Aucun"
        ]
    },
    circulateurC2: {
        default: "Aucun",
        options: [
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
            "Aucun"
        ]
    },
    circulateurC3: {
        default: "Aucun",
        options: [
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
            "Aucun"
        ]
    },
    circulateurC7: {
        default: "Aucun",
        options: [
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
            "Appoint multiple",
            "Aucun"
        ]
    },
    optionS10: {
        default: "Aucun",
        options: [
            "Activable par case à cocher",
            "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC",
            "CESI déportée sur T15",
            "charge BTC si excédent APP1 sur T16 & T6 < T5",
            "charge BTC si excédent APP1 sur T16 & T6 > T5",
            "Circulateur chaudière 1",
            "Circulateur chaudière 2",
            "Décharge sur zone 1",
            "Electrovanne Appoint 1 ou Flow Switch",
            "Free Cooling Zone 1",
            "Free Cooling Zone 2",
            "Free Cooling Zone 3",
            "Free Cooling Zone 4",
            "Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h",
            "Horloge ON de 7h à 10h et 18h à 22h",
            "ON buches en demande",
            "ON en mode excédent d'énergie l'été",
            "ON en mode solaire",
            "Piscine déportée T15",
            "Piscine déportée T6",
            "recharge nappes goethermiques sur T15 sur échangeur BTC",
            "recharge nappes goethermiques sur T15 sur serpentin BTC",
            "Sortie Idem C1",
            "Sortie Idem C2",
            "Sortie Idem C3",
            "Sortie Idem C4",
            "Sortie Idem C5",
            "Sortie Idem C6",
            "Sortie Idem C7",
            "Sortie Idem S11",
            "V3V bypass appoint 1",
            "V3V décharge zone 1",
            "V3V retour bouclage sanitaire solaire",
            "Aucun"
        ]
    },
    optionS11: {
        default: "Aucun",
        options: [
            "Activable par case à cocher",
            "Aquastat différentiel ON si T5>T15 ou Rehaussement des retours sur BTC",
            "CESI déportée sur T16",
            "charge BTC si excédent APP1 sur T16 & T6 < T5",
            "charge BTC si excédent APP1 sur T16 & T6 > T5",
            "Circulateur chaudière 1",
            "Circulateur chaudière 2",
            "Décharge sur zone 1",
            "Electrovanne Appoint 1 ou Flow Switch",
            "Free Cooling Zone 1",
            "Free Cooling Zone 2",
            "Free Cooling Zone 3",
            "Free Cooling Zone 4",
            "Horloge ON de 5h à 8h, 11h30 à 14h et 16h30 à 23h",
            "Horloge ON de 7h à 10h et 18h à 22h",
            "ON buches en demande",
            "ON en mode excédent d'énergie l'été",
            "ON en mode solaire",
            "recharge nappes goethermiques sur T15 sur échangeur BTC",
            "recharge nappes goethermiques sur T15 sur serpentin BTC",
            "Sortie Idem C1",
            "Sortie Idem C2",
            "Sortie Idem C3",
            "Sortie Idem C4",
            "Sortie Idem C5",
            "Sortie Idem C6",
            "Sortie Idem C7",
            "Sortie Idem S10",
            "V3V bypass appoint 1",
            "V3V décharge zone 1",
            "V3V retour bouclage sanitaire solaire",
            "Aucun"
        ]
    },
    D3: {
        default: "off",
        options: ["on", "off"]
    },
    D5: {
        default: "off",
        options: ["on", "off"]
    },
    divers: {
        default: "Aucun",
        options: [
            "deshu sur appoint 1",
            "pompe double droite",
            "pompe double gauche",
            "radiateur sur appoint 1",
            "Aucun"
        ]
    }
};