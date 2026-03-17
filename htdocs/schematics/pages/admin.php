<?php
require_once __DIR__ . '/../config/config.php';

$auth = $_SERVER['PHP_AUTH_USER'] ?? null;
$pass = $_SERVER['PHP_AUTH_PW'] ?? null;

if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    [$auth,$pass] = explode(':', base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'],6)),2);
}

if ($auth!==$_ENV['ADMIN_USER'] || $pass!==$_ENV['ADMIN_PASS']) {
    header('WWW-Authenticate: Basic realm="Admin"');
    header('HTTP/1.1 401 Unauthorized');
    exit("Access denied");
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour du Tarif</title>
    <style>
        body {
            background-color: #ededed;
            font-family: 'Roboto', sans-serif;
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        main {
            background: white;
            padding: 2em;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: fit-content;
        }

        .dropzone {
            display: block;
            border: 1px solid #ccc;
            padding: 1em;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
        }

        .dropzone:hover {
            border-color: c#444;
            background: #ededed;
        }

        input[type="file"] {
            display: none;
        }

        #status {
            margin-top: 20px;
            font-size: 14px;
        }

        .result-card {
            margin-top: 20px;
            border-radius: 8px;
            overflow: hidden;
            text-align: left;
            font-size: 14px;
            border: 1px solid #e0e0e0;
        }

        .result-card .result-header {
            padding: 12px 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
        }

        .result-card.success .result-header {
            background: #d4edda;
            color: #155724;
        }

        .result-card.error .result-header {
            background: #f8d7da;
            color: #721c24;
        }

        .result-card .result-body {
            padding: 12px 16px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            background: #f9f9f9;
        }

        .stat-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px 16px;
            border-radius: 6px;
            min-width: 80px;
            border: 1px solid rgba(0,0,0,0.08);
        }

        .stat-badge .stat-number {
            font-size: 22px;
            font-weight: bold;
            line-height: 1;
        }

        .stat-badge .stat-label {
            font-size: 11px;
            margin-top: 4px;
            opacity: 0.75;
            text-align: center;
        }

        .stat-badge.total   { background: #e8f4fd; color: #1565c0; }
        .stat-badge.created { background: #e8f5e9; color: #2e7d32; }
        .stat-badge.updated { background: #fff8e1; color: #f57f17; }
        .stat-badge.disabled{ background: #fce4ec; color: #880e4f; }

        .result-card .result-file {
            padding: 8px 16px;
            font-size: 12px;
            color: #666;
            background: #f1f1f1;
            border-top: 1px solid #e0e0e0;
        }

        .loading-text {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #555;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
            width: 16px; height: 16px;
            border: 2px solid #ccc;
            border-top-color: #555;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            display: inline-block;
        }
    </style>
</head>

<body>
    <main>
        <h2>Importer un fichier</h2>

        <label class="dropzone" id="dropzone" for="fileInput">
            Glissez un fichier ici<br>ou cliquez pour sélectionner<br><small>.xlsx ou .csv</small>
        </label>
        <input type="file" id="fileInput" accept=".xlsx,.csv">
        <div id="status"></div>
        <div id="result"></div>
    </main>
</body>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" integrity="sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
    const file_input = document.querySelector("#fileInput");
    const dropzone = document.querySelector("#dropzone");
    const status = document.querySelector("#status");
    const result_el = document.querySelector("#result");

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
            const response = await fetch("api/updateArticle.php", {
                method: "POST",
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

        // FileReader renvoie une Promise
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

        // Nettoyage : supprimer __rowNum__, majuscules, trim
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

        return json_data; // renvoie proprement les données
    }
</script>

</html>