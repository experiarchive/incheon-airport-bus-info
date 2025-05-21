# **프로젝트: 인천공항 공항버스 정보 웹사이트 구축**

**목표:** 사용자가 인천공항을 오가는 공항버스의 노선, 시간표, 정류장 위치, 실시간 버스 위치(초기 iframe, 향후 API) 및 기타 유용한 공항 정보를 쉽게 찾아볼 수 있는 빠르고 SEO 친화적인 웹사이트를 구축한다. 최종적으로 Google AdSense를 통한 광고 수익 창출을 목표로 한다.

---

## **개발 환경:**
*   **AI 개발 도우미:** Cursor AI
*   **사용자:** 비개발자 (AI의 도움을 받아 직접 구축)

## **핵심 기술 스택:**
*   **프론트엔드 프레임워크:** Astro
*   **콘텐츠 관리 시스템 (CMS):** Sanity.io (무료 플랜 사용)
*   **UI/UX 스타일링:** Tailwind CSS
*   **호스팅:** Vercel (무료 티어 사용)
*   **데이터 (정류장 위치):** 제공될 JSON 파일
*   **데이터 (실시간 버스 위치):** 초기에는 노선별 KakaoMap iframe URL 제공, 향후 공공데이터포털 API 연동 고려

---

## **Cursor AI를 위한 단계별 구축 프롬프트 (요청 사항)**

**주의:** 각 단계는 Cursor AI에게 한 번에 하나씩 또는 작은 그룹으로 나누어 요청하는 것이 좋습니다. AI가 생성한 코드를 검토하고, 필요한 경우 수정 요청을 반복하세요.

### **Phase 1: 프로젝트 초기 설정 및 핵심 연동**

1.  **Astro 프로젝트 생성 및 Tailwind CSS 설정:**
    *   "새로운 Astro 프로젝트를 생성해줘. 이름은 `incheon-airport-bus-info`로 하고, Tailwind CSS를 자동으로 설정해줘."
    *   "기본적인 Astro 레이아웃 파일(`src/layouts/Layout.astro`)을 만들고, Tailwind CSS가 적용될 수 있도록 설정해줘. 이 레이아웃에는 간단한 헤더와 푸터 영역을 포함해줘."

2.  **Sanity.io 연동 준비 (사용자 수동 작업 후 AI 요청):**
    *   *(사용자 작업)*: Sanity.io 웹사이트에서 계정을 만들고, 새 프로젝트를 생성합니다. (예: 프로젝트명 `my-bus-info-cms`). 프로젝트 ID와 데이터셋 이름(보통 `production`)을 기록해둡니다.
    *   "Astro 프로젝트에서 Sanity.io 데이터를 가져올 수 있도록 `@sanity/client` 라이브러리를 설치하고, Sanity 클라이언트 설정 파일을 만들어줘. 프로젝트 ID는 `[사용자가 기록한 Sanity 프로젝트 ID]`이고, 데이터셋은 `production`이야. API 버전은 최신으로 설정해줘."

3.  **Sanity.io 스키마(콘텐츠 모델) 정의 코드 생성:**
    *   "Sanity.io 프로젝트를 위한 스키마 코드를 생성해줘. 다음 모델들이 필요해:"
        *   **`busRoute` (버스 노선):**
            *   `routeName` (텍스트, 예: "6001번 공항버스") - 필수
            *   `routeNumber` (문자열, 예: "6001") - 필수, 고유값
            *   `description` (간단한 텍스트, 노선 설명)
            *   `mainStops` (문자열 배열, 주요 경유지 목록)
            *   `timetableNotes` (블록 콘텐츠/Rich Text, 시간표 관련 참고사항)
            *   `kakaoMapIframeUrl` (URL, 해당 노선의 카카오맵 실시간 위치 iframe URL)
        *   **`timetableEntry` (시간표 항목):**
            *   `route` (참조, `busRoute` 모델 연결) - 필수
            *   `dayType` (문자열 선택, 옵션: "평일", "주말/공휴일") - 필수
            *   `direction` (문자열 선택, 옵션: "공항행", "시내행") - 필수
            *   `departureTime` (문자열, 예: "05:30") - 필수
            *   `stopName` (문자열, 출발 정류장 이름)
        *   **`generalInfoPage` (일반 정보 페이지):**
            *   `title` (텍스트, 페이지 제목) - 필수
            *   `slug` (슬러그, URL 경로로 사용될 값, 예: `ticket-machine-guide`) - 필수, 고유값
            *   `content` (블록 콘텐츠/Rich Text, 페이지 본문 내용)
    *   *(사용자 작업)*: Cursor AI가 생성해준 스키마 코드를 실제 Sanity.io 프로젝트의 스키마 폴더(보통 `schemas/` 또는 `sanity.config.js` 내)에 적용하고, Sanity Studio를 배포하거나 로컬에서 실행하여 모델이 잘 생성되었는지 확인합니다. 이후 Sanity Studio에서 테스트용 데이터를 몇 개 입력합니다.

### **Phase 2: 주요 페이지 및 기능 구현**

1.  **홈페이지 (`src/pages/index.astro`):**
    *   "홈페이지를 만들어줘. 간단한 사이트 소개 문구와 함께 '전체 노선 보기', '공항 정보 안내' 섹션으로 이동할 수 있는 링크나 버튼을 포함해줘. Tailwind CSS를 사용해서 깔끔하게 디자인해줘."

2.  **전체 버스 노선 목록 페이지 (`src/pages/routes/index.astro`):**
    *   "Sanity.io에서 모든 `busRoute` 데이터를 가져와서 목록으로 보여주는 페이지를 만들어줘. 각 노선은 카드 형태로 표시하고, 카드에는 `routeName`, `routeNumber`, `description`의 일부를 보여줘. 각 카드를 클릭하면 해당 노선의 상세 페이지로 이동해야 해. Tailwind CSS로 스타일링해줘."

3.  **버스 노선 상세 페이지 (`src/pages/routes/[routeNumber].astro` - 동적 라우팅):**
    *   "버스 노선 번호(`routeNumber`)를 파라미터로 받는 동적 상세 페이지를 만들어줘."
    *   "페이지 상단에는 Sanity.io에서 가져온 해당 `busRoute`의 `routeName`, `description`, `mainStops`, `timetableNotes` 정보를 표시해줘."
    *   **시간표 표시:** "Sanity.io에서 해당 `routeNumber`에 연결된 모든 `timetableEntry` 데이터를 가져와서 '공항행'과 '시내행', '평일'과 '주말/공휴일'로 구분하여 시간표를 테이블 형태로 깔끔하게 보여줘."
    *   **정류장 위치 (JSON 데이터 활용):**
        *   *(사용자 작업)*: 노선별 정류장 위도/경도 정보가 담긴 JSON 파일을 준비합니다. (예: `public/data/bus_stops.json` 또는 노선별 파일 `public/data/stops_6001.json`) 파일 구조 예시: `[{ "routeNumber": "6001", "stopName": "인천공항T1", "latitude": 37.xxxx, "longitude": 126.xxxx }, ...]`
        *   "제공된 JSON 파일(`public/data/bus_stops.json`)에서 현재 노선 번호에 해당하는 정류장 목록을 필터링해서 보여줘. 정류장 이름과 함께 위도, 경도 값도 (개발자 확인용으로) 표시해줘. 향후 이 위치를 지도에 표시할 예정이야."
    *   **실시간 버스 위치 (iframe):** "Sanity.io의 `busRoute` 데이터에서 `kakaoMapIframeUrl`을 가져와서 해당 iframe을 페이지 내에 적절한 크기로 표시해줘."
    *   "모든 정보는 Tailwind CSS를 사용해서 가독성 좋고 깔끔하게 디자인해줘."

4.  **일반 정보 페이지 목록 및 상세 페이지 (`src/pages/info/[slug].astro` - 동적 라우팅):**
    *   "공항 내 정보(예: 버스 정류장 위치 안내), 무인 발권기 사용 방법 등을 위한 일반 정보 페이지를 만들 거야. Sanity.io의 `generalInfoPage` 데이터를 사용할 거야."
    *   "먼저, 모든 `generalInfoPage`의 `title`과 `slug`를 가져와 목록으로 보여주는 페이지(`src/pages/info/index.astro`)를 만들어줘. 각 항목을 클릭하면 해당 `slug`의 상세 페이지로 이동해야 해."
    *   "`slug`를 파라미터로 받는 동적 상세 페이지(`src/pages/info/[slug].astro`)를 만들고, 해당 `slug`에 맞는 `generalInfoPage`의 `title`과 `content`(블록 콘텐츠)를 가져와서 표시해줘. 블록 콘텐츠가 올바르게 렌더링되도록 `@portabletext/to-html` (또는 Astro용 라이브러리)를 사용해줘. Tailwind CSS로 가독성 좋게 스타일링해줘."

### **Phase 3: UI/UX 개선 및 추가 기능**

1.  **전체적인 디자인 및 반응형 UI:**
    *   "웹사이트 전체적으로 모던하고 깔끔하며 사용자 친화적인 디자인을 적용해줘. Tailwind CSS를 적극 활용하고, 모바일, 태블릿, 데스크톱 환경 모두에서 잘 보이는 반응형 디자인을 구현해줘."
    *   "내비게이션 바(헤더)에는 로고(또는 사이트 이름), 전체 노선, 공항 정보 메뉴를 포함하고, 모든 페이지에 일관되게 표시되도록 해줘."
    *   "푸터에는 저작권 정보나 간단한 사이트맵 링크를 포함해줘."

2.  **검색 기능 (선택적, 초기에는 제외 가능):**
    *   "버스 노선 번호나 이름으로 검색할 수 있는 간단한 검색 기능을 추가하는 것을 고려해줘. (초기에는 이 기능을 제외하고, 나중에 추가할 수도 있어.)"

3.  **AdSense 연동 준비:**
    *   "Google AdSense 코드를 삽입할 수 있도록 `Layout.astro`의 `<head>` 태그나 `<body>` 태그 내 적절한 위치에 주석으로 표시를 남겨줘. (예: `<!-- Google AdSense Code Goes Here -->`)"

### **Phase 4: 배포 및 최종 점검**

1.  **Vercel 배포 설정 확인:**
    *   "Astro 프로젝트가 Vercel에 정상적으로 배포될 수 있도록 필요한 설정이 올바르게 되어 있는지 확인해줘."
    *   *(사용자 작업)*: GitHub 저장소를 만들고 코드를 푸시한 후, Vercel에 해당 저장소를 연결하여 배포합니다. Sanity.io의 CORS 설정에 Vercel 배포 URL을 추가해야 할 수 있습니다.

2.  **최종 테스트:**
    *   모든 페이지가 정상적으로 로드되는지, 데이터가 올바르게 표시되는지, 링크가 잘 작동하는지, 모바일 환경에서 UI가 깨지지 않는지 등을 꼼꼼히 테스트합니다.

---

**사용자를 위한 추가 가이드:**

*   **Sanity.io 콘텐츠 입력:** 스키마 정의 후, 실제 버스 노선 정보, 시간표, iframe URL, 일반 정보 페이지 내용 등을 Sanity Studio를 통해 직접 입력해야 합니다.
*   **JSON 데이터 준비:** 버스 정류장 위치 정보 JSON 파일을 정확한 형식으로 준비해야 합니다.
*   **KakaoMap iframe URL 확보:** 각 노선별 실시간 위치를 보여주는 카카오맵 iframe URL을 미리 확보해야 합니다.
*   **반복적인 AI 소통:** Cursor AI가 한 번에 완벽한 결과물을 주지 않을 수 있습니다. 생성된 코드를 (이해하지 못하더라도) 실행해보고, 문제가 있거나 원하는 대로 작동하지 않으면 구체적으로 어떤 부분이 문제인지, 어떻게 수정하고 싶은지 다시 요청하세요. "이 부분 색깔이 마음에 안 들어, 파란색 계열로 바꿔줘" 또는 "시간표 테이블이 모바일에서 너무 넓게 나와, 스크롤 가능하게 하거나 다르게 표시해줘" 와 같이 구체적으로 요청하는 것이 좋습니다.
