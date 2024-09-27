<script>
	import Devis from './devis/Devis.svelte';
	export let title;
	export let global_vars;
</script>

{#if (title == "Devis2")}
	<Devis {...global_vars} />
{/if}

