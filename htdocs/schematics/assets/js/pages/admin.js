// --- Import articles ---

const file_input = document.querySelector("#fileInput");
const dropzone   = document.querySelector("#dropzone");
const status     = document.querySelector("#status");
const result_el  = document.querySelector("#result");

dropzone.addEventListener("dragover", (e) => { e.preventDefault(); });

dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    upload_file(event.dataTransfer.files[0]);
});

file_input.addEventListener("change", () => {
    upload_file(file_input.files[0]);
});

async function upload_file(file) {
    result_el.innerHTML = "";
    status.innerHTML = `<span class="loading-text"><span class="spinner"></span> Lecture du fichier…</span>`;

    let data;
    try {
        data = await read_csv_or_xlsx_file(file);
    } catch(e) {
        show_error(`Erreur de lecture : ${e.message}`);
        status.innerHTML = "";
        return;
    }

    status.innerHTML = `<span class="loading-text"><span class="spinner"></span> Envoi en cours… (${data.length} lignes)</span>`;

    try {
        const response = await fetch(`${BASE_URL}api/articles`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        status.innerHTML = "";

        if (!response.ok) {
            show_error(json.error || json.message || `Erreur HTTP ${response.status}`);
        } else {
            show_success(json, file.name);
        }
    } catch (e) {
        status.innerHTML = "";
        show_error("Erreur lors de la requête API");
    }
}

function show_success(json, filename) {
    result_el.innerHTML = `
        <div class="result-card success">
            <div class="result-header">✔ ${json.message}</div>
            <div class="result-body">
                <div class="stat-badge total">
                    <span class="stat-number">${json.total_processed}</span>
                    <span class="stat-label">lignes traitées</span>
                </div>
                <div class="stat-badge created">
                    <span class="stat-number">${json.insert_count}</span>
                    <span class="stat-label">nouveaux articles</span>
                </div>
                <div class="stat-badge updated">
                    <span class="stat-number">${json.update_count}</span>
                    <span class="stat-label">mis à jour</span>
                </div>
                <div class="stat-badge disabled">
                    <span class="stat-number">${json.disabled_count}</span>
                    <span class="stat-label">désactivés</span>
                </div>
            </div>
            <div class="result-file">📄 ${filename}</div>
        </div>`;
}

function show_error(message) {
    result_el.innerHTML = `
        <div class="result-card error">
            <div class="result-header">✖ Échec de l'import</div>
            <div class="result-body" style="color:#721c24;">${message}</div>
        </div>`;
}

async function read_csv_or_xlsx_file(file) {
    if (!file) throw new Error("Aucun fichier fourni");
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
        throw new Error("Format invalide");
    }

    const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = err => reject(err);
        reader.readAsBinaryString(file);
    });

    const workbook = XLSX.read(fileData, { type: "binary" });
    const sheet_name = workbook.SheetNames[0];
    const work_sheet = workbook.Sheets[sheet_name];

    let json_data = XLSX.utils.sheet_to_json(work_sheet, { defval: null, blankrows: false });

    json_data = json_data.map(row => {
        const new_row = {};
        for (const [key, value] of Object.entries(row)) {
            if (key === "__rowNum__") continue;
            const new_key = key.toUpperCase().trim();
            const new_value = typeof value === "string" ? value.trim() : value;
            new_row[new_key] = new_value;
        }
        return new_row;
    });

    return json_data;
}

// --- Export devis ---

const btn_simple    = document.querySelector('#btn-export-simple');
const btn_articles  = document.querySelector('#btn-export-articles');
const export_status = document.querySelector('#export-status');

btn_simple.addEventListener('click',   () => download_devis(false));
btn_articles.addEventListener('click', () => download_devis(true));

async function download_devis(include_articles) {
    const url = 'api/devis' + (include_articles ? '?include_articles=1' : '');
    btn_simple.disabled   = true;
    btn_articles.disabled = true;
    export_status.innerHTML = `<span class="loading-text"><span class="spinner"></span> Export en cours…</span>`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + API_KEY }
        });

        if (!response.ok) {
            const json = await response.json().catch(() => ({}));
            throw new Error(json.error || `Erreur HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = include_articles ? 'devis_export_articles.csv' : 'devis_export.csv';
        a.click();
        URL.revokeObjectURL(a.href);

        export_status.innerHTML = `<span style="color:#2e7d32">✔ Export téléchargé</span>`;
    } catch (e) {
        export_status.innerHTML = `<span style="color:#721c24">✖ ${e.message}</span>`;
    } finally {
        btn_simple.disabled   = false;
        btn_articles.disabled = false;
    }
}
