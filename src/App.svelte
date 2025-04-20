<script lang="ts">
  import Router from 'svelte-spa-router';
  import Login from './routes/Login.svelte';
  import Tasks from './routes/Tasks.svelte';
  import Register from './routes/Register.svelte';
  import { Toaster } from '@skeletonlabs/skeleton-svelte';
  import { toaster } from './lib/toaster-svelte';

  const routes = {
    '/': Login,
    '/register': Register,
    '/tasks': Tasks,
  };
</script>

<Router {routes} />
<Toaster {toaster} classes="toasts"></Toaster>
