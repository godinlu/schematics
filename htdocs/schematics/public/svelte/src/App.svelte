<script>
	import Devis from './devis/Devis.svelte';
	export let title;
</script>

{#if (title == "Devis2")}
	<Devis default_articles={window.global_vars["default_articles"]}/>
{/if}

