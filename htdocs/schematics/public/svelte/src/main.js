import App from './App.svelte';

const app = new App({
	target: document.getElementById('svelte-app'),
	props: {
	  title: document.title	
	},
  });

export default app;