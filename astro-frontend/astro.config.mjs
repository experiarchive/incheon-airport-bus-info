// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://your-vercel-domain.vercel.app', // 배포 후 실제 도메인으로 변경
  integrations: [tailwind()],
  build: {
    assets: '_astro'
  }
});