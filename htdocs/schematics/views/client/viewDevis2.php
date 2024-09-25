<div id="svelte-app"></div>

<script>
    window.global_vars = {
        "default_articles": <?=json_encode($default_articles)?>
    }
    const default_articles =  <?=json_encode($default_articles)?>;
    <?php if (isset($devis_data)):?>
        const devis_data = <?=json_encode($devis_data)?>;
    <?php endif;?>
    document.addEventListener('DOMContentLoaded', function() {
        Category.set_categories(<?=json_encode($categories)?>);
        Devis.articles = <?=json_encode($articles)?>;
    });
    
</script>