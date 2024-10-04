<script>
	import Quotation from './devis/Quotation.svelte';
	export let title;
</script>

{#if (title == "Devis2")}
	<Quotation/>
{/if}

