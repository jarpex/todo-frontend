<script lang="ts">
  import { token } from '../lib/stores/auth';
  import goto from '../lib/router/goto';
  import { toaster } from '../lib/toaster-svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { API_BASE_URL } from '../lib/config';

  onMount(() => {
    if (get(token)) {
      goto('/tasks');
    }
  });

  let email: string = '';
  let password: string = '';

  async function handleLogin(): Promise<void> {
    try {
      const formData = new URLSearchParams({ username: email, password });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorText = errorResponse.detail || 'Authentication failed';
        toaster.error({
          title: errorText,
        });
        return;
      }

      const data = await response.json();
      token.set(data.access_token);
      goto('/tasks');
    } catch (error) {
      console.error('Error during login:', error);
      toaster.error({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  }
</script>

<main class="center">
  <div class="p-4 min-w-48 max-w-md mx-auto">
    <h1 class="text-2xl mb-5 select-none">ToDo App</h1>
    <input
      bind:value={email}
      placeholder="Email"
      class="input input-bordered w-full mb-2 select-none"
    />
    <input
      type="password"
      bind:value={password}
      placeholder="Password"
      class="input input-bordered w-full mb-2 select-none outline-red"
    />
    <button
      type="button"
      on:click={handleLogin}
      class="btn btn-primary w-full select-none bg-tertiary-300"
    >
      Log In
    </button>
    <span class="mt-4 select-none inline-block">
      No account?
      <a
        href="/register"
        role="button"
        on:click|preventDefault={() => goto('/register')}
      >
        Register
      </a>
    </span>
  </div>
</main>
