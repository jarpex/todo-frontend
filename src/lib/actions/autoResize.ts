export function autoResize(node: HTMLTextAreaElement) {
  const resize = () => {
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight}px`;
  };

  resize();
  node.addEventListener('input', resize);

  return {
    destroy() {
      node.removeEventListener('input', resize);
    },
  };
}
