const images = import.meta.glob('./assets/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function productImage(name) {
  return images[`./assets/${name}`];
}
