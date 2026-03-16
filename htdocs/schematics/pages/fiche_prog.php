<?php
require_once __DIR__ . '/../config/config.php';

$page_css = ["pages/fiche_prog.css"];
$page_js = [
    "pages/fiche_prog.js"
]

?>
<!DOCTYPE html>
<html lang="fr">
<?php require_once ROOT_PATH . '/includes/head.php'; ?>

<body>
    <?php require_once ROOT_PATH . '/includes/header.php'; ?>
    <main>
        <div class="flex">
            <div id="fp-container">
                <table id="fp-table">
                    <thead>
                        <tr>
                            <td>
                                <table id="fp-header">
                                </table>
                            </td>
                            <td id="fp-title"></td>
                        </tr>
                    </thead>
                    <tbody id="fp-body">
                    </tbody>
                </table>
            </div>
            <aside>
                <button type="button" id="btn_download_pdf">télécharger (pdf)<i class="fa fa-file-pdf-o" aria-hidden="true"></i></button>
            </aside>
        </div>
    </main>
    <?php require_once ROOT_PATH . '/includes/footer.php'; ?>
</body>

</html>