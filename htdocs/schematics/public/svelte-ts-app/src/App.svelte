<script>
	/**
	   * Svelte DND Action draggable handle example
	   */
	import ArticleRow from './ArticleRow.svelte';
	  import { dndzone } from 'svelte-dnd-action';
	  import { flip } from 'svelte/animate';
  
	  let items = [
		  {
			  id: 1,
			  text: 'Item 1',
		  },
		  {
			  id: 2,
			  text: 'Item 2',
		  },
		  {
			  id: 3,
			  text: 'Item 3',
		  },		{
			  id: 4,
			  text: 'Item 4',
		  },
		  {
			  id: 5,
			  text: 'Item 5',
		  },
		  {
			  id: 6,
			  text: 'Item 6',
		  },
	  ];
	  
	  const flipDurationMs = 200;
	  
	const handleConsider = evt => {
		items = evt.detail.items;
	};
	const handleFinalize = evt => {
		items = evt.detail.items;
	};
	  
  </script>

  <table
	use:dndzone="{{ items, flipDurationMs }}"
	on:consider="{handleConsider}"
	on:finalize="{handleFinalize}"
  >
	{#each items as item (item.id)}
		<tr animate:flip={{ duration: flipDurationMs }}>
			<ArticleRow {item}/>
		</tr>
  		
	{/each}
  </table>
  

  <style>

</style>