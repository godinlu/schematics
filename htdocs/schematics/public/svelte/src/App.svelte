<script>
	import Devis2 from './pages/devis2/Devis2.svelte';
	export let title;
	export let global_vars;
</script>

{#if (title == "Devis2")}
	<Devis2 {...global_vars}/>
{/if}
