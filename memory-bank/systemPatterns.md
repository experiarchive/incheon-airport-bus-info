# 시스템 패턴: 인천공항 공항버스 정보 웹사이트

## 아키텍처 개요

### 전체 시스템 구조
```
User Request → Astro Frontend → Sanity.io CMS → JSON Data → Response
                ↓
            Static Site Generation (SSG)
```

### 핵심 아키텍처 패턴
1. **JAMstack 아키텍처**
   - **JavaScript:** Astro + TypeScript
   - **APIs:** Sanity.io Headless CMS
   - **Markup:** Static HTML 생성

2. **정적 사이트 생성 (SSG)**
   - 빌드 타임에 모든 페이지 사전 생성
   - 빠른 로딩 속도 보장
   - SEO 최적화

## 데이터 흐름 패턴

### 1. 콘텐츠 관리 시스템 (Sanity.io)
```javascript
// 클라이언트 설정
export const client = createClient({
  projectId: '2os1gn84',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true
});
```

### 2. 데이터 모델 구조
**버스 노선 (`busRoute`)**
- `routeName`: 노선 이름
- `routeNumber`: 노선 번호 (고유 식별자)
- `description`: 노선 설명
- `mainStops`: 주요 정류장 배열

**시간표 (`timetableEntry`)**
- NDJSON 형식으로 관리
- 노선별 파일 분리 (`{routeNumber}_timetable_eff_{date}.ndjson`)
- 구조:
  ```json
  {
    "route": {"_type": "reference", "_ref": "route-id"},
    "dayType": "everyday",
    "direction": "공항행|시내행",
    "stopName": "정류장명",
    "departureTimes": ["04:05", "04:30", ...],
    "effectiveDate": "2025-05-01",
    "status": "current"
  }
  ```

### 3. 데이터 페칭 패턴
```javascript
// Astro 컴포넌트에서 빌드 타임 데이터 페칭
const routes = await client.fetch(`
  *[_type == "busRoute"]{
    routeName, 
    routeNumber, 
    description, 
    mainStops
  }
`);
```

## 컴포넌트 아키텍처

### 1. 레이아웃 패턴
- **기본 레이아웃 (`Layout.astro`)**
  - 공통 HTML 구조
  - 메타 태그 관리
  - 다크 모드 지원

### 2. 페이지 구조 패턴
```
src/pages/
├── index.astro          # 홈페이지
├── routes.astro         # 전체 노선 목록
└── routes/
    └── [routeNumber].astro  # 동적 노선 상세 페이지
```

### 3. 동적 라우팅 패턴
- 파일 기반 라우팅 (`[routeNumber].astro`)
- URL 매개변수를 통한 콘텐츠 로딩
- 정적 생성 시 모든 경로 사전 생성

## UI/UX 패턴

### 1. 디자인 시스템
**컬러 팔레트:**
- Primary: Blue-600 (#2563eb)
- Secondary: Gray 색상군
- 다크 모드 지원

**레이아웃 패턴:**
- Grid 기반 반응형 레이아웃
- Mobile-first 접근법
- 카드 기반 정보 표시

### 2. 상호작용 패턴
**호버 효과:**
```css
transform hover:scale-105
transition-all duration-300
```

**상태 표시:**
- 로딩 상태 (빈 상태 처리)
- 에러 상태 대응
- 성공 상태 피드백

### 3. 접근성 패턴
- 시맨틱 HTML 구조
- ARIA 레이블 적용
- 키보드 내비게이션 지원
- 색상 대비 준수

## 성능 최적화 패턴

### 1. 빌드 타임 최적화
- Astro의 정적 사이트 생성 활용
- 트리 쉐이킹을 통한 번들 크기 최소화
- 이미지 최적화 (필요시)

### 2. 런타임 최적화
- CDN 활용 (Sanity.io)
- 지연 로딩 (Lazy Loading)
- 코드 분할 (Code Splitting)

### 3. 캐싱 전략
- Sanity.io CDN 캐싱 활용
- 정적 에셋 캐싱
- 브라우저 캐싱 최적화

## 반응형 디자인 패턴

### 1. 브레이크포인트 전략
```css
/* Tailwind CSS 기본 브레이크포인트 */
sm: 640px   /* 모바일 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 데스크톱 */
```

### 2. 그리드 시스템
```css
/* 노선 카드 그리드 */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### 3. 모바일 우선 접근법
- 기본 스타일을 모바일 기준으로 설정
- 점진적 향상 (Progressive Enhancement)
- 터치 친화적 인터페이스

## 에러 처리 패턴

### 1. 데이터 부재 처리
```javascript
{routes && routes.length > 0 ? (
  // 정상 콘텐츠
) : (
  // 빈 상태 UI
)}
```

### 2. 사용자 피드백
- 명확한 에러 메시지
- 대안 행동 제시
- 시각적 상태 표시

## 확장성 고려사항

### 1. 컴포넌트 재사용성
- 단일 책임 원칙 적용
- Props 기반 설정 가능
- 일관된 인터페이스

### 2. 데이터 확장성
- Sanity.io 스키마 확장 가능
- JSON 데이터 구조 유연성
- API 연동 준비

### 3. 기능 확장성
- 검색 기능 추가 준비
- 필터링 기능 대응
- 다국어 지원 고려

## 보안 패턴

### 1. 클라이언트 사이드 보안
- XSS 방지를 위한 데이터 검증
- HTTPS 전용 통신
- 입력 데이터 검증

### 2. API 보안
- Sanity.io 읽기 전용 토큰 사용
- CORS 설정 적절히 관리
- 민감 정보 환경 변수 처리

## 개발 워크플로우 패턴

### 1. 개발 환경
```bash
npm run dev     # 개발 서버 실행
npm run build   # 프로덕션 빌드
npm run preview # 빌드 결과 미리보기
```

### 2. 배포 패턴
- Vercel 자동 배포
- Git 기반 워크플로우
- 환경별 설정 분리

### 3. 콘텐츠 관리 워크플로우
- Sanity Studio를 통한 콘텐츠 관리
- 실시간 미리보기 (필요시)
- 버전 관리 및 백업 