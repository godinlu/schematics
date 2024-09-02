<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- charge l'icon de solisart -->
    <link rel="icon" href="../public/img/cropped-solisart-mini-32x32.png" sizes="32x32">
    <!-- charge font-awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- charge la police de charactère Comfortaa -->
    <link href='https://fonts.googleapis.com/css?family=Comfortaa' rel='stylesheet'>
    <!-- met le title  -->
    <title><?= $t ?></title>

    <!-- inclusion des feuilles de style -->
    <?php $dependencyLoader->includeCSS();?>
</head>
<body>
    <header>
        <?php
            if ($t !== "Login"){
                require_once ("views/admin/header.php");
            }
        ?>

    </header>
    
    <?= $content ?>

    <footer>
    </footer>

</body>

<?php $dependencyLoader->includeJS();?>



</html>