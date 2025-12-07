// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: 'static', // Astro 5: static is default, use prerender=false for dynamic routes
  adapter: vercel(),
  site: 'https://air.koreabusinfo.com', // 정식 도메인으로 업데이트
  integrations: [tailwind(), sitemap()],
  build: {
    assets: '_astro'
  }
});