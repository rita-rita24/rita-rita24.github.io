import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages用の設定
  site: 'https://rita-rita24.github.io',
  base: '/',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
