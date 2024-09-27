<script>
    import { each } from "svelte/internal";
    import {Devis} from "./devis.class.js";
    import {Categ} from './categ.class.js';
    import { ArticleManager } from "./article_manager.class.js";
    import Modal from "./Modal.svelte";

    export let default_articles;
    export let categories;
    export let all_articles;

    
    
    let categ = new Categ(categories);
    let article_manager = new ArticleManager(all_articles, categ);
    let devis = new Devis(article_manager);
    let articles = devis.article_manager.list_articles;

    // url managing
    let default_url = window.location.href.match(/(.*\/devis2)(?:\/.*)?/)[1];
    let current_url = window.location.href;

    function set_url(url){
        window.history.pushState({}, '', default_url +"/"+ url);
        current_url = window.location.href;
    }

    function add_article(ref){
        article_manager.add_article(ref);
        articles = devis.article_manager.list_articles;
    }
</script>
<table>
    <thead>
        <tr>
            <td>Référence</td>
            <td>Désignation</td>
            <td>Quantité</td>
            <td>Prix Tarif</td>
            <td>Édition</td>
        </tr>
    </thead>
    <tbody>
        {#each categ.get_base() as categorie}
            <tr>
                <th colspan="2">{categorie.name}</th>
            </tr>
            {#each articles as article}
                {#if article.base_category_id == categorie.id}
                    <tr>
                        <td>{article.name}</td>
                    </tr>
                {/if}
            {/each}

        {/each}
    </tbody>
</table>
<button on:click={()=>{ window.history.pushState({}, '', default_url + "/ajouter") }}>ajouter</button>
{#if current_url != default_url}
    <Modal/>
{/if}