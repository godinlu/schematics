const BASE_URL = "../api/";

/**
 * Send POST request
 * @param {string} endpoint
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
async function post_data(endpoint, payload) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // On peut quand même récupérer le texte brut pour debug
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // On renvoie la response brute
    return response;
}

/**
 * Get schema
 * @param {"SchemaHydrau"|"SchemaHydrauWithLegend"|"SchemaExe"|"Etiquetage"|"ImageFicheProg"} image
 * @param {"PDF"|"PNG"} format
 * @returns {Promise<Object|Blob>} JSON pour PNG, Blob pour PDF
 */
async function get_schema(image = "SchemaHydrau", format = "PNG") {
    const endpoint = `getSchema.php?image=${encodeURIComponent(image)}&format=${encodeURIComponent(format)}&debug`;

    const response = await post_data(endpoint, get_formulaire());

    const contentType = response.headers.get("Content-Type") || "";
    
    if (!contentType.includes("application/pdf") && !contentType.includes("image/")){
        const text = await response.text();
        throw new Error(`Server Error:\n${text}`);
    }

    return response.blob();
}