<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { autoResize } from '../../lib/actions/autoResize';

  export let todo: {
    id: number;
    title: string;
    description: string;
    done: boolean;
    owner_id: number;
  };

  const dispatch = createEventDispatcher();

  function toggleDone() {
    dispatch('toggle', todo.id);
  }

  function updateTodo() {
    dispatch('update', { ...todo });
  }
</script>

<div
  class="card p-2 border-none rounded-4xl mb-2 flex items-stretch bg-surface-200"
>
  {#if todo.done}
    <button class="btn btn-primary min-h-15 h-full mr-4" on:click={toggleDone}
      >←</button
    >
  {/if}

  <div class="flex flex-col w-full">
    <input
      class="text-3xl"
      bind:value={todo.title}
      placeholder="Title"
      on:blur={updateTodo}
      on:keydown={(e) =>
        e.key === 'Enter' &&
        e.target instanceof HTMLInputElement &&
        e.target.blur()}
    />
    <textarea
      class="text-xl mt-2 block"
      bind:value={todo.description}
      use:autoResize
      rows="1"
      placeholder="Type something..."
      style="overflow:hidden; resize:none"
      on:blur={updateTodo}
    ></textarea>
  </div>

  {#if !todo.done}
    <button class="btn btn-primary min-h-15 h-full ml-4" on:click={toggleDone}
      >→</button
    >
  {/if}
</div>
