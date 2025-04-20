import { push } from 'svelte-spa-router';

export default function goto(path: string) {
  push(path);
}
