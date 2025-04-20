const { skeleton } = require('@skeletonlabs/tw-plugin');

module.exports = {
  content: [
    './index.html',
    './src//*.{svelte,js,ts}',
    './node_modules/@skeletonlabs/skeleton-svelte//*.{svelte,js,ts}',
  ],
  plugins: [require('@tailwindcss/forms'), require('@skeletonlabs/tw-plugin')],
};
