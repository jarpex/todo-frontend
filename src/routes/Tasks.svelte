<script lang="ts">
  import { onMount } from 'svelte';
  import { token } from '../lib/stores/auth';
  import { get } from 'svelte/store';
  import goto from '../lib/router/goto';
  import TodoItem from '../lib/components/TodoItem.svelte';
  import { autoResize } from '../lib/actions/autoResize';
  import { API_BASE_URL } from '../lib/config';

  type Todo = {
    id: number;
    title: string;
    description: string;
    done: boolean;
    owner_id: number;
  };

  let todos: Todo[] = [];
  let newTitle = '';
  let newDescription = '';

  // ───────────────── helpers ─────────────────
  const authFetch = (t: string, init: RequestInit = {}) =>
    fetch(`${API_BASE_URL}/todos`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${t}`,
        'Content-Type': 'application/json',
      },
    });

  async function loadTodos(t: string) {
    try {
      const res = await authFetch(t);
      todos = await res.json();
    } catch (e) {
      console.error('Failed to load todos', e);
    }
  }

  async function addTodo() {
    const t = get(token);
    if (!t || !newTitle.trim()) return;

    await authFetch(t, {
      method: 'POST',
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });

    newTitle = '';
    newDescription = '';
    await loadTodos(t);
  }

  async function toggleTodo(id: number) {
    const t = get(token);
    if (!t) return;

    const tgt = todos.find((t) => t.id === id);
    if (!tgt) return;
    const url = `${API_BASE_URL}/todos/${id}`;

    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({
        title: tgt.title,
        description: tgt.description ?? '',
        done: !tgt.done,
      }),
    });

    await loadTodos(t);
  }

  async function updateTodo(updated: Todo) {
    const t = get(token);
    if (!t) return;

    await fetch(`${API_BASE_URL}/todos/${updated.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({
        title: updated.title,
        description: updated.description ?? '',
        done: updated.done,
      }),
    });

    await loadTodos(t);
  }

  function logOut() {
    token.set(null);
    goto('/');
  }

  // ───────────────── lifecycle ─────────────────
  onMount(() => {
    const t = get(token);
    if (!t) {
      goto('/');
    } else {
      loadTodos(t);
    }
  });

  // ───────────────── derived state ─────────────────
  $: pending = todos.filter((t) => !t.done);
  $: completed = todos.filter((t) => t.done);
</script>

<main class="w-full h-lvh max-w-full">
  <!-- Header -->
  <header class="h-1/10 w-full flex items-center p-0">
    <h1 class="text-2xl select-none flex-1 text-left">ToDo</h1>
    <button class="btn btn-primary select-none" on:click={logOut}>
      Log Out
    </button>
  </header>

  <!-- Body (flex) -->
  <div class="w-full h-9/10 flex absolute top-0 left-0 mt-10 pt-2">
    <!-- Left column – new + pending -->
    <section class="flex-1 p-4 mx-2 overflow-y-scroll scroll-rtl">
      <!-- New todo card -->
      <div
        class="card p-2 border-none rounded-4xl mb-2 flex items-stretch bg-surface-200"
      >
        <div class="flex flex-col w-full">
          <input class="text-3xl" bind:value={newTitle} placeholder="Title" />
          <textarea
            class="text-xl mt-2 block"
            bind:value={newDescription}
            rows="1"
            placeholder="Type something..."
            use:autoResize
            style="overflow:hidden; resize:none"
          ></textarea>
        </div>
        <button class="btn btn-primary min-h-15 h-full" on:click={addTodo}>
          ➕
        </button>
      </div>

      {#each pending as todo (todo.id)}
        <TodoItem
          {todo}
          on:toggle={(e) => toggleTodo(e.detail)}
          on:update={(e) => updateTodo(e.detail)}
        />
      {/each}
    </section>

    <div class="divider"></div>

    <!-- Right column – completed -->
    <section class="flex-1 p-4 mx-2 overflow-y-scroll">
      {#each completed as todo (todo.id)}
        <TodoItem
          {todo}
          on:toggle={(e) => toggleTodo(e.detail)}
          on:update={(e) => updateTodo(e.detail)}
        />
      {/each}
    </section>
  </div>
</main>
