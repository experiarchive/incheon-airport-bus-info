# 기술 컨텍스트: 인천공항 공항버스 정보 웹사이트

## 기술 스택 개요

### 프론트엔드 프레임워크
**Astro v5.8.0**
- **선택 이유:**
  - 정적 사이트 생성에 최적화
  - 뛰어난 성능과 SEO 친화적
  - TypeScript 네이티브 지원
  - 다양한 프레임워크 통합 가능

- **주요 특징:**
  - Islands 아키텍처
  - 빌드 타임 데이터 페칭
  - 파일 기반 라우팅
  - 컴포넌트 기반 개발

### 스타일링
**Tailwind CSS v4.1.7**
- **선택 이유:**
  - 유틸리티 퍼스트 접근법
  - 빠른 프로토타이핑
  - 일관된 디자인 시스템
  - 반응형 디자인 간편성

- **설정:**
  ```javascript
  // tailwind.config.cjs
  module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  ```

### 콘텐츠 관리 시스템
**Sanity.io**
- **플랜:** 무료 티어
- **프로젝트 ID:** 2os1gn84
- **데이터셋:** production
- **API 버전:** 2023-05-03

- **클라이언트 설정:**
  ```javascript
  import {createClient} from '@sanity/client';
  
  export const client = createClient({
    projectId: '2os1gn84',
    dataset: 'production',
    apiVersion: '2023-05-03',
    useCdn: true
  });
  ```

### 추가 라이브러리
**@portabletext/to-html v2.0.14**
- Rich Text 콘텐츠 렌더링
- Sanity.io Portable Text 변환

## 개발 환경 설정

### Node.js 환경
- **버전:** Node.js 18+ 권장
- **패키지 매니저:** npm

### 프로젝트 구조
```
incheon-airport-bus-info/
├── astro-frontend/           # Astro 프론트엔드
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── layouts/          # 페이지 레이아웃
│   │   ├── pages/            # 페이지 파일 (라우팅)
│   │   ├── lib/              # 유틸리티 및 설정
│   │   ├── styles/           # 전역 스타일
│   │   └── assets/           # 정적 에셋
│   ├── public/               # 정적 파일
│   └── package.json
├── my-sanity-studio/         # Sanity CMS 스튜디오
├── data/                     # JSON 데이터 파일
│   └── timetables/           # 시간표 NDJSON 파일
└── memory-bank/              # 프로젝트 문서
```

### 스크립트 명령어
```json
{
  "scripts": {
    "dev": "astro dev",           # 개발 서버 (포트 4321)
    "build": "astro build",       # 프로덕션 빌드
    "preview": "astro preview",   # 빌드 결과 미리보기
    "astro": "astro"             # Astro CLI
  }
}
```

## 호스팅 및 배포

### Vercel
- **플랜:** 무료 티어
- **배포 방식:** Git 연동 자동 배포
- **도메인:** Vercel 제공 또는 커스텀 도메인
- **환경 변수:** Sanity.io 설정값 관리

### 배포 설정
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',  // 정적 사이트 생성
});
```

## 데이터 관리

### JSON 데이터 파일
**위치:** `/data/timetables/`
**형식:** NDJSON (Newline Delimited JSON)
**파일 명명:** `{routeNumber}_timetable_eff_{date}.ndjson`

**데이터 구조:**
```json
{
  "_id": "unique-id",
  "_type": "timetableEntry",
  "route": {"_type": "reference", "_ref": "route-reference-id"},
  "dayType": "everyday",
  "direction": "공항행|시내행",
  "stopName": "정류장명",
  "departureTimes": ["04:05", "04:30", "05:00"],
  "effectiveDate": "2025-05-01",
  "status": "current"
}
```

### Sanity.io 스키마
**콘텐츠 모델:**
1. `busRoute` - 버스 노선 정보
2. `timetableEntry` - 시간표 항목
3. `generalInfoPage` - 일반 정보 페이지

## 성능 최적화

### 빌드 최적화
- **정적 사이트 생성:** 모든 페이지 사전 렌더링
- **트리 쉐이킹:** 사용하지 않는 코드 제거
- **CSS 퍼지:** Tailwind CSS 미사용 클래스 제거

### 런타임 최적화
- **CDN 활용:** Sanity.io CDN으로 데이터 캐싱
- **이미지 최적화:** Astro 내장 이미지 최적화 활용 가능
- **코드 분할:** 페이지별 번들 분리

### 로딩 최적화
- **프리로딩:** 중요한 리소스 우선 로딩
- **지연 로딩:** 필요시 콘텐츠 지연 로딩
- **압축:** Gzip/Brotli 압축 활용

## SEO 최적화

### 메타 태그 관리
- 동적 제목 및 설명 생성
- Open Graph 태그 지원
- Twitter Card 지원
- 구조화된 데이터 마크업

### URL 구조
- **홈페이지:** `/`
- **노선 목록:** `/routes`
- **노선 상세:** `/routes/{routeNumber}`
- **정보 페이지:** `/info/{slug}`

### 사이트맵 및 RSS
- 자동 사이트맵 생성 (필요시 설정)
- 검색 엔진 최적화된 URL 구조

## 보안 고려사항

### 클라이언트 사이드
- **XSS 방지:** 입력 데이터 검증 및 이스케이프
- **HTTPS 강제:** 모든 통신 암호화
- **CSP 헤더:** 콘텐츠 보안 정책 설정

### API 보안
- **읽기 전용 토큰:** Sanity.io 퍼블릭 읽기 권한만 사용
- **CORS 설정:** 허용된 도메인에서만 접근
- **환경 변수:** 민감 정보 환경 변수로 관리

## 모니터링 및 분석

### 성능 모니터링
- **Lighthouse:** 성능 점수 정기 확인
- **Web Vitals:** 핵심 웹 바이탈 모니터링
- **번들 분석:** 번들 크기 최적화

### 사용자 분석
- **Google Analytics:** 사용자 행동 분석 (향후 추가)
- **Search Console:** 검색 성능 모니터링
- **Error Tracking:** 에러 로깅 시스템 (필요시)

## 확장 가능성

### 기술적 확장
- **다국어 지원:** Astro i18n 플러그인 활용 가능
- **PWA 지원:** Service Worker 및 웹 앱 매니페스트 추가 가능
- **API 통합:** 외부 API 연동 준비됨

### 콘텐츠 확장
- **추가 콘텐츠 타입:** Sanity.io 스키마 확장 용이
- **미디어 관리:** Sanity.io 이미지/비디오 관리 활용
- **다국어 콘텐츠:** Sanity.io 다국어 필드 지원

## 개발 워크플로우

### 로컬 개발
1. **환경 설정:** Node.js 설치 및 의존성 설치
2. **개발 서버 실행:** `npm run dev`
3. **변경사항 확인:** 브라우저에서 실시간 미리보기
4. **빌드 테스트:** `npm run build && npm run preview`

### 배포 프로세스
1. **코드 커밋:** Git으로 변경사항 커밋
2. **자동 배포:** Vercel에서 자동 빌드 및 배포
3. **배포 확인:** 프로덕션 환경에서 테스트
4. **모니터링:** 성능 및 오류 모니터링

## 제약사항 및 고려사항

### 예산 제약
- **무료 서비스만 사용:** Vercel, Sanity.io 무료 플랜
- **트래픽 제한:** 무료 플랜 제한 내에서 운영
- **스토리지 제한:** 콘텐츠 및 에셋 크기 관리 필요

### 기술적 제약
- **정적 사이트:** 실시간 서버 기능 제한
- **클라이언트 사이드 처리:** 복잡한 로직은 클라이언트에서 처리
- **외부 의존성:** Sanity.io 서비스 의존성

### 확장 시 고려사항
- **트래픽 증가:** 유료 플랜 전환 필요성
- **기능 추가:** 서버 사이드 기능 필요시 하이브리드 모드 고려
- **데이터 증가:** 대용량 데이터 처리 최적화 필요 