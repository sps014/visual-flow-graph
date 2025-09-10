/**
 * @fileoverview Vite configuration for FlowGraph library
 * 
 * This configuration builds the FlowGraph library as a standalone ES module
 * with bundled dependencies and proper CSS handling.
 * 
 * @version 1.0.0
 * @author FlowGraph Team
 */

import { defineConfig } from 'vite';

/**
 * Vite configuration for building the FlowGraph library.
 * 
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'FlowGraph',
      fileName: 'flowgraph.es',
      formats: ['es']
    },
    rollupOptions: {
      // Don't externalize Lit - bundle it all together
      external: [],
      output: {
        assetFileNames: 'flowgraph.css',
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
