/**
 * @type {import('vite').UserConfig}
 */
export default {
  base: './',
  build: {
    // minify: false,
    // sourcemap: true,
  },
  esbuild: {
    keepNames: true,
  },
}
