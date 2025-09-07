import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'FlowGraph',
      fileName: 'flowgraph',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
