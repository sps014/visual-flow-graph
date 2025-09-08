import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'FlowGraph',
      fileName: 'flowgraph',
      formats: ['es']
    },
    rollupOptions: {
      // Don't externalize Lit - bundle it all together
      external: [],
      output: {
        globals: {
          'lit': 'Lit',
          'lit/': 'Lit',
          '@lit/reactive-element': 'ReactiveElement',
          '@lit/reactive-element/': 'ReactiveElement',
          'lit-html': 'litHtml',
          'lit-html/': 'litHtml'
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
