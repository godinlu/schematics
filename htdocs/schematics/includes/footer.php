<footer>
    <div>
        <h3>Me contacter<i class="fa fa-phone fa-lg" aria-hidden="true"></i></h3>
        <p><a href="https://github.com/godinlu/schematics/issues">signaler un problème</a></p>
    </div>
</footer>

<!-- Default JS import -->
<?= asset_tag(JS . "components/modal.js", "js") ?>
<?= asset_tag(JS . "components/header.js", "js") ?>
<?= asset_tag(JS . "core/session.store.js", "js") ?>
<?= asset_tag(JS . "core/utils.js", "js") ?>

<!-- Specific JS import -->
<?php 
if (isset($page_js)) {
    if (is_array($page_js)) {
        foreach ($page_js as $js) {
            echo asset_tag(JS . $js, "js") . PHP_EOL;
        }
    } else {
        echo asset_tag(JS . $page_js, "js") . PHP_EOL;
    }
}
?>