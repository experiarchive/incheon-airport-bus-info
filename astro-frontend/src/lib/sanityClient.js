import {createClient} from '@sanity/client';

export const client = createClient({
  projectId: '2os1gn84', // 이전에 확인한 Sanity 프로젝트 ID
  dataset: 'production',   // Sanity 데이터셋 이름
  apiVersion: '2023-05-03', // API 버전 (Sanity 문서에서 권장하는 최신 날짜 형식)
  useCdn: true, // 배포 환경에서는 true가 성능에 유리, 개발 중에는 false로 할 수도 있음
}); 