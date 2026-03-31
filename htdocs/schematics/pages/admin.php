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
    <title>Admin — Schématèque</title>
    <?= asset_tag(CSS . 'pages/admin.css') ?>
</head>

<body>
    <main class="card">
        <h2>Importer un fichier</h2>

        <label class="dropzone" id="dropzone" for="fileInput">
            Glissez un fichier ici<br>ou cliquez pour sélectionner<br><small>.xlsx ou .csv</small>
        </label>
        <input type="file" id="fileInput" accept=".xlsx,.csv">
        <div id="status"></div>
        <div id="result"></div>
    </main>

    <section class="card">
        <h2>Exporter les devis</h2>
        <p style="color:#555; font-size:14px; margin: 0 0 0.5em;">Télécharge tous les devis enregistrés au format CSV.</p>
        <div class="export-buttons">
            <button class="btn-export primary" id="btn-export-simple">
                ⬇ Devis (sans articles)
            </button>
            <button class="btn-export secondary" id="btn-export-articles">
                ⬇ Devis + articles
            </button>
        </div>
        <div id="export-status"></div>
    </section>
</body>

<script>const API_KEY = <?= json_encode($_ENV['API_KEY']) ?>;</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" integrity="sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<?= asset_tag(JS . 'pages/admin.js', 'js') ?>

</html>
