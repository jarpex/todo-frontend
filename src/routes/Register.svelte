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

  async function handleRegister(): Promise<void> {
    try {
      const payload = { email, password };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorText = errorResponse.detail[0].msg || 'Registration failed';
        toaster.error({ title: errorText });
        return;
      }

      const data = await response.json();
      if (data.access_token) {
        token.set(data.access_token);
      }
      goto('/tasks');
    } catch (error) {
      console.error('Error during registration:', error);
      toaster.error({
        title: 'Registration Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  }
</script>

<main class="center">
  <div class="p-4 min-w-48 max-w-md mx-auto">
    <h1 class="text-2xl mb-5 select-none">Registration</h1>
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
      on:click={handleRegister}
      class="btn btn-primary w-full select-none bg-tertiary-300"
    >
      Register
    </button>
    <span class="mt-4 select-none inline-block">
      Have an account?
      <a href="/" role="button" on:click|preventDefault={() => goto('/')}>
        Log In
      </a>
    </span>
  </div>
</main>
