
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
            ["Sortie 48 (option)", formulaire.optionS10],
            ["Sortie 49 (option)", formulaire.optionS11],
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
 * @param {string} endpoint - endpoint path (e.g. "schemas/hydrau/brut?format=png")
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
        let message = `Erreur serveur (HTTP ${response.status})`;
        try {
            const json = await response.json();
            if (json.error) message = json.error;
        } catch { /* réponse non-JSON, on garde le message par défaut */ }
        throw new Error(message);
    }

    return response;
}

/**
 * Envoie une requête POST à l'API et retourne le résultat sous forme de Blob.
 * Vérifie que le Content-Type correspond au type attendu avant de consommer le body,
 * ce qui permet de détecter les erreurs PHP émises avec un HTTP 200 (HTML d'erreur).
 *
 * @param {string} endpoint - endpoint path (e.g. "schemas/hydrau/brut?format=png")
 * @param {Object} payload
 * @param {string} expected_type - Content-Type attendu (e.g. "image/png", "application/pdf")
 * @returns {Promise<Blob>}
 */
async function fetch_schema_blob(endpoint, payload, expected_type) {
    const response = await post_data(endpoint, payload);

    const content_type = response.headers.get("Content-Type") ?? "";
    if (!content_type.includes(expected_type)) {
        let message = `Réponse inattendue du serveur (type reçu : ${content_type || "inconnu"})`;
        const raw = await response.text();
        try {
            const json = JSON.parse(raw);
            if (json.error) message = json.error;
        } catch {
            console.error(`[fetch_schema_blob] Réponse PHP brute pour "${endpoint}" :`, raw);
        }
        throw new Error(message);
    }

    return response.blob();
}

/**
 * Affiche un toast d'erreur visible pendant 5 secondes.
 * @param {string} message
 */
function show_error_toast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = [
        "position:fixed", "bottom:24px", "left:50%", "transform:translateX(-50%)",
        "background:#c0392b", "color:#fff", "padding:12px 24px",
        "border-radius:6px", "font-size:14px", "z-index:9999",
        "max-width:80%", "text-align:center", "box-shadow:0 2px 10px rgba(0,0,0,.35)"
    ].join(";");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}