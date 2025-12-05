
<div id="main-content">
    <table id="devis-container" class="devis-container articles-table"></table>
    <aside id="sidebar">

    </aside>
</div>
<form id="devis" action="" method="post">
</form>


<script id="data-articles" type="application/json">
<?= json_encode($articles, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-categories" type="application/json">
<?= json_encode($categories, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-actions-saved" type="application/json">
<?= json_encode($actions_saved, JSON_UNESCAPED_UNICODE) ?>
</script>

