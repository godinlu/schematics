<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- met le title  -->
    <title><?= $t ?></title>
    <!-- charge l'icon de solisart -->
    <link rel="icon" href="<?=$dependencyLoader->get_url()?>/public/img/cropped-solisart-mini-32x32.png" sizes="32x32">
    <!-- charge font-awesome -->
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- charge la police de charactère Comfortaa -->
    <link href='https://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet'>
    

    <!-- inclusion des feuilles de style -->
    <?php
        $dependencyLoader->includeCSS();
    ?>
    <script>
        /*to prevent Firefox FOUC, this must be here*/
        let FF_FOUC_FIX;
    </script>
</head>
<body>
    <header>
        <nav>
            <div>
                <img src="<?=$dependencyLoader->get_url()?>/public/img/Solisart-menue.png" alt="logo solisart" width="200">
                <br>
                <a href="version">Version <?=VERSION?></a>
            </div>
            
            <ul>
                <li><a href="<?=$dependencyLoader->get_url()?>/client/formulaire" rel="noopener" class="saveForm <?=($t === "Formulaire")? "jaune": NULL?>">Formulaire</a></li>
                <li class="dropdown" style="float:left;">
                    <a href="#" class="dropbtn <?=($t === "Schema_hydrau" || $t === "Schema_exe")? "jaune": NULL?>">Schéma <i class="fa fa-chevron-down" aria-hidden="true"></i></a>
                    <div class="dropdown-content">
                        <a href="<?=$dependencyLoader->get_url()?>/client/schema_hydrau" rel="noopener" class=" saveForm">Schéma hydraulique</a>
                        <a href="<?=$dependencyLoader->get_url()?>/client/schema_exe" rel="noopener" class=" saveForm">Schéma d'exe</a>
                        
                    </div> 
                    
                </li>
                <li><a href="<?=$dependencyLoader->get_url()?>/client/fiche_prog" rel="noopener" class="<?=($t === "Fiche_prog")? "jaune": NULL?> saveForm">Fiche de programmation</a></li>
                <li><a href="<?=$dependencyLoader->get_url()?>/client/devis" rel="noopener" class="<?=($t === "Devis")? "jaune": NULL?> saveForm">Devis</a></li>
                <li class="dropdown" style="float:right;">
                    <a href="#" class="dropbtn bleue"><i class="fa fa-file-text" aria-hidden="true"></i>  fichier <i class="fa fa-chevron-down" aria-hidden="true"></i></a>
                    <div class="dropdown-content">
                        <a href="<?=$dependencyLoader->get_url()?>/client/formulaire?action=reinit" id="TB_reinitialisation"><i class="fa fa-refresh" aria-hidden="true"></i> réinitialiser</a>
                        <a href="?action=save" id="TB_sauvegarder"><i class="fa-regular fa-floppy-disk"></i> sauvegarder</a>
                        <a href="#" id="TB_charger" ><i class="fa-regular fa-folder-open"></i>   ouvrir</a>
                        <a href="#" id="TB_télécharger_dossier" ><i class="fa fa-download" aria-hidden="true"></i> dossier</a>
                        <!-- <a href="#" id="TB_power_point" ><i class="fa fa-file-powerpoint-o" aria-hidden="true"></i></i> power point</a> -->
                        
                    </div>
                </li>
            </ul>
        </nav>
        <div id="popupImport" class="popup_content">
        <span class="helper"></span>
        <div>
            <div class="popupCloseButton">&times;</div>
                <form action="#" method="POST" enctype="multipart/form-data">
                    <p>Choisissez le fichier que vous voulez importer</p>
                    <input type="file" name="fichier" accept="application/JSON" id="import_fichier" required>
                    <label for="import_fichier"><i class="fa fa-upload" aria-hidden="true"></i><span>Choisissez un fichier</span> </label>
                    <button id="charger"> Ouvrir <i class="fa fa-check" aria-hidden="true"></i></button>
                </form>
            </div>
        </div>
    </header>
    
    <?= $content ?>

    <footer>
        <div>
            <h3>Me contacter<i class="fa fa-phone fa-lg" aria-hidden="true"></i></h3>
            <p><a href="https://github.com/godinlu/schematics/issues">signaler un problème</a></p>
        </div>
        <div>
            <h3>Aide<i class="fa fa-question fa-lg" aria-hidden="true"></i></h3>
            <p>Voici une documentation pour vous aider à utiliser l'outil</p>
            <a href="./documentation.php">Documentation</a>
        </div>
        <div>
            <h3>Admin</h3>
            <a href="../admin/login">page admin</a>
            
        </div>
    </footer>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<?php
$dependencyLoader->includeJS();
?>
</body>

<!-- inclusion du javascript -->







</html>