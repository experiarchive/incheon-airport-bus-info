// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://air.koreabusinfo.com', // 정식 도메인으로 업데이트
  integrations: [tailwind(), sitemap()],
  build: {
    assets: '_astro'
  }
});