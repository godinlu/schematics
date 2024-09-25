import App from './App.svelte';

const app = new App({
	target: document.getElementById('svelte-app'),
	props: {
	  title: document.title,
	  global_vars: window.global_vars
	},
  });

export default app;