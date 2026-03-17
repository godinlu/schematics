
/**
 * 
 * @param {Object<string, any>} formulaire 
 * @param {Object<string, string> | null} fiche_prog 
 */
function static_fiche_prog_data(formulaire, fiche_prog) {
    const ecs_count_mapping = {
        "ballon ECS 2 échangeurs": 1,
        "ballon ECS 2 échangeurs avec bouclage sanitaire": 1,
        "ballon ECS et ballon appoint en série": 2,
        "ballon ECS et ballon appoint en série avec bouclage sanitaire": 2,
        "ballon ECS tank in tank": 1,
        "ballon d'eau chaude sur échangeur": 2,
        "ballon Appoint en sortie ballon solaire avec bouclage sanitaire": 2,
        "ballon Appoint en sortie de 2 ballons solaires avec bouclage sanitaire": 3,
        "Ballon hygiénique avec 1 echangeur": 1,
        "Ballon hygiénique avec 2 echangeurs": 1,
        "Aucun": 0
    };
    return {
        title: `Module ${formulaire.typeInstallation}`,
        header: [
            ["Date", (new Date()).toLocaleDateString('fr-FR')],
            ["Délai", fiche_prog?.delai ?? ""],
            ["N° de commande", fiche_prog?.numCommande ?? ""],
            ["N° de série", fiche_prog?.numSerie ?? ""],
        ],
        body: [
            ["Installateur", formulaire.installateur],
            ["Prénom/Nom", formulaire['Prénom/nom']],
            ["Adresse mail", formulaire.adresse_mail],
            ["Commercial", formulaire.commercial],
            ["Client"],
            ["Nom", formulaire.nom_client],
            ["Prénom", formulaire.prenom_client],
            ["Adress", formulaire.adresse_client],
            ["Code postale", formulaire.code_postale_client],
            ["Ville", formulaire.ville_client],
            ["Tél", formulaire.tel_client],
            ["Mail", formulaire.mail_client],
            ["Installation"],
            ["Ballon tampon", (formulaire.ballonTampon !== "Aucun") ? "oui" : "non"],
            ["Nombre de ballon ECS", ecs_count_mapping?.[formulaire.ballonECS] ?? ""],
            ["Nombre de champs capteurs", formulaire.champCapteur],
            ["Surface capteurs", formulaire.champCapteur_surface === "" ? "": `${formulaire.champCapteur_surface} m²`],
            ["Type d\'appoint 1", formulaire.appoint1 + (formulaire.Zone ? `, ${formulaire.Zone}`: "")],
            ["Type d\'appoint 2", formulaire.appoint2 + (formulaire.ZoneMultiple ? `, ${formulaire.ZoneMultiple}`:"" )],
            ["Sortie 48 (option)", formulaire?.sorties?.S10 ?? ""],
            ["Sortie 49 (option)", formulaire?.sorties?.S11 ?? ""],
            ["Type d\'émetteur"],
            ["Circulateur C1", formulaire.circulateurC1],
            ["Circulateur C2", formulaire.circulateurC2],
            ["Circulateur C3", formulaire.circulateurC3],
            ["Circulateur C7", formulaire.circulateurC7],
            ["Commentaire", fiche_prog?.commentaire ?? ""]
        ]
    }
}



/**
 * Send POST request to the API
 * @param {string} endpoint - endpoint name (e.g. "generateSchema.php?image=foo&format=png")
 * @param {Object} payload
 * @returns {Promise<Response>}
 */
async function post_data(endpoint, payload) {
    const response = await fetch(`${BASE_URL}api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response;
}