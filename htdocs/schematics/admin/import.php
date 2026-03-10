<?php
$USER = "admin";
$PW = "ILoveSolisart!";

$auth = $_SERVER['PHP_AUTH_USER'] ?? null;
$pass = $_SERVER['PHP_AUTH_PW'] ?? null;

if (!$auth && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    [$auth,$pass] = explode(':', base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'],6)),2);
}

if ($auth!==$USER || $pass!==$PW) {
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
    </main>
</body>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" integrity="sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
    const file_input = document.querySelector("#fileInput");
    const dropzone = document.querySelector("#dropzone");
    const status = document.querySelector("#status");

    dropzone.addEventListener("dragover", (e)=>{
        e.preventDefault();
    });

    dropzone.addEventListener("drop", (event) =>{
        event.preventDefault();
        upload_file(event.dataTransfer.files[0]);
    })

    file_input.addEventListener("change", () =>{
        upload_file(file_input.files[0]);
    });

    async function upload_file(file){
        const data = await read_csv_or_xlsx_file(file);

        status.innerText = "upload en cours...";
        const form_data = new FormData();
        form_data.append("file", file);

        try{
            const response = await fetch("../api/updateArticle.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.text();
            status.innerText = result;
        } catch (e){
            status.innerText = "Erreur lors de la requête API";
        }

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