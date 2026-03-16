<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= $page_title ?? "Schematèque" ?></title>
    <!-- load solisart icon -->
    <link rel="icon" href="<?= IMG ?>cropped-solisart-mini-32x32.png" sizes="32x32">

    <!-- font-awesome -->
    <link rel="stylesheet" href="<?= ASSETS ?>fonts/fontawesome/css/all.min.css">

    <!-- Global CSS -->
    <?= asset_tag(CSS . "main.css") ?>
    <?= asset_tag(CSS . "components/header.css") ?>
    <?= asset_tag(CSS . "components/footer.css") ?>
    <?= asset_tag(CSS . "components/modal.css") ?>
    
    <!-- specific CSS -->
    <?php 
    if (isset($page_css)) {
        if (is_array($page_css)) {
            foreach ($page_css as $css) {
                echo asset_tag(CSS . $css) . PHP_EOL;
            }
        } else {
            echo asset_tag(CSS . $page_css) . PHP_EOL;
        }
    }
    ?>

    
</head>