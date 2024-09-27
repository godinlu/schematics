<div id="svelte-app"></div>

<script>
    window.global_vars = {
        "default_articles": <?=json_encode($default_articles)?>,
        <?php if (isset($devis_data)):?>
            "devis_data": <?=json_encode($devis_data)?>,
        <?php endif;?>
        "categories": <?=json_encode($categories)?>,
        "all_articles": <?=json_encode($articles)?>
    };
</script>