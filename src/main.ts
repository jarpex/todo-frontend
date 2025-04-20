import { mount } from 'svelte';
import App from './App.svelte';
import '../src/app.css';

mount(App, {
  target: document.getElementById('app')!,
});
