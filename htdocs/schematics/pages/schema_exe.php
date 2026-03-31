<?php
require_once __DIR__ . '/../config/config.php';

$page_css = ["pages/schema_exe.css"];
$page_js = [
    "pages/schema_exe.js"
]

?>
<!DOCTYPE html>
<html lang="fr">
<?php require_once ROOT_PATH . '/includes/head.php'; ?>

<body>
    <?php require_once ROOT_PATH . '/includes/header.php'; ?>
    <main>

        <div class="flex">
            <!--canvas ou est déssiné la schématèque il fait la taille de de base schema -->
            <div id="img_container">
                <div id="schema_loader">
                    <div class="loader-spinner"></div>
                </div>
                <img id="schema_exe" style="display: none;" alt="Schéma d'EXE">
                <img id="etiquetage" style="display: none;" alt="Etiquetage">
            </div>
            <aside>
                <button type="button" id="btn_toggle_etiquetage">étiquetage module<i class="fa-regular fa-square"></i></button>
                <button type="button" id="btn_download_png">télécharger (png)<i class="fa-regular fa-file-image"></i></button>
                <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa-regular fa-file-pdf"></i></button>
            </aside>
        </div>
    </main>
    <?php require_once ROOT_PATH . '/includes/footer.php'; ?>
</body>

</html>