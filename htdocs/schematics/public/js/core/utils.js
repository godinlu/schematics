/**
 * Send POST request
 * @param {string} endpoint
 * @param {Object} payload
 * @param {string} base_url
 * @returns {Promise<Object>}
 */
async function post_data(endpoint, payload, base_url = "../api/") {
    const response = await fetch(`${base_url}${endpoint}`, {
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