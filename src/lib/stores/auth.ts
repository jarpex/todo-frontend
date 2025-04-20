import { writable } from 'svelte/store';

const storedToken = localStorage.getItem('access_token');
export const token = writable<string | null>(storedToken);

token.subscribe((value) => {
  if (value) {
    localStorage.setItem('access_token', value);
  } else {
    localStorage.removeItem('access_token');
  }
});
