<div id="main-content">
    <div id = "devis-container" class="devis-container"></div>
    <aside id="sidebar">

    </aside>
</div>


<script id="data-articles" type="application/json">
<?= json_encode($articles, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-categories" type="application/json">
<?= json_encode($categories, JSON_UNESCAPED_UNICODE) ?>
</script>

<script id="data-article-categories" type="application/json">
<?= json_encode($article_categories, JSON_UNESCAPED_UNICODE) ?>
</script>

