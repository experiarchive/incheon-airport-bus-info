# 인천국제공항공사 상업시설 정보 조회 OpenAPI 명세서

## 1. 기본 정보 (General Info)
- **Base URL**: `http://apis.data.go.kr/B551177/StatusOfFacility`
- **Service ID**: `StatusOfFacility`
- **데이터 포맷**: XML (기본값), JSON 지원
- **통신 방식**: REST (GET)
- **인코딩**: 한글 검색어 입력 시 **UTF-8 인코딩** 필수
- **갱신 주기**: 수시 (상업시설 정보 변경 시)

## 2. API 엔드포인트 (Endpoints)

### 2.1. 상업시설 정보 조회 (국문)
- **Operation**: `getFacilityKR`
- **Description**: 인천국제공항 내 입점 매장의 국문 정보(위치, 영업시간, 취급품목 등)를 조회합니다.
- **Full URL**: `{Base URL}/getFacilityKR`

### 2.2. 상업시설 정보 조회 (영문)
- **Operation**: `getFacilityEN`
- **Description**: 인천국제공항 내 입점 매장의 영문 정보를 조회합니다.
- **Full URL**: `{Base URL}/getFacilityEN`

## 3. 요청 파라미터 (Request Parameters)
두 오퍼레이션(`getFacilityKR`, `getFacilityEN`) 모두 동일한 파라미터 구조를 가집니다.

| 항목명 (Key) | 설명 | 필수 | 타입 | 기본값 | 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `serviceKey` | 공공데이터포털 인증키 | **Y** | String | - | Decoding된 키 사용 권장 |
| `numOfRows` | 한 페이지 결과 수 | **Y** | Integer | 10 | |
| `pageNo` | 페이지 번호 | **Y** | Integer | 1 | |
| `type` | 응답 유형 | N | String | xml | `xml` 또는 `json` |
| `facility_nm` | 상업시설명 검색어 | N | String | - | **UTF-8 인코딩 필수** |

## 4. 응답 데이터 (Response Fields)

### 4.1. 공통 코드 (Common Codes)
응답 데이터 중 `arrordep` 필드는 시설의 위치 구역을 나타냅니다.
- **A**: 입국장 (Arrival)
- **D**: 출국장 (Departure)

### 4.2. 국문 조회 결과 (`getFacilityKR`)
| 필드명 (XML Tag) | 설명 | 타입 | 비고 |
| :--- | :--- | :--- | :--- |
| `entrpskoreannm` | 상업시설명 (한글) | String | 예: 와이파이도시락 |
| `trtmntprdlstkoreannm` | 취급품목 (한글) | String | 예: 포켓와이파이, 데이터로밍 |
| `lckoreannm` | 위치 (한글) | String | 예: 제1여객터미널 1층... |
| `servicetime` | 영업시간 | String | 예: 06:00 ~ 22:00 |
| `tel` | 전화번호 | String | 예: 1566-9070 |
| `arrordep` | 입/출국구역 구분 | String | **A**: 입국장, **D**: 출국장 |

### 4.3. 영문 조회 결과 (`getFacilityEN`)
| 필드명 (XML Tag) | 설명 | 타입 | 비고 |
| :--- | :--- | :--- | :--- |
| `entrpsengnm` | 상업시설명 (영어) | String | 예: WiFi Take out |
| `trtmntprdlstengnm` | 취급품목 (영어) | String | 예: Wi-Fi Router |
| `lcengm` | 위치 (영어) | String | **주의**: 태그명이 `lcengm` 임 (lcengnm 아님) |
| `servicetime` | 영업시간 | String | 예: 06:00 ~ 22:00 |
| `tel` | 전화번호 | String | |
| `arrordep` | 입/출국구역 구분 | String | **A**: Arrival, **D**: Departure |

## 5. 결과 및 에러 코드 (Result Codes)

### 응답 헤더 (`header`)
- `resultCode`: 결과 코드 (정상: "00")
- `resultMsg`: 결과 메시지 (정상: "NORMAL SERVICE.")

### 주요 에러 코드
| 코드 | 메시지 | 설명 |
| :--- | :--- | :--- |
| `00` | NORMAL SERVICE | 정상 처리 |
| `30` | SERVICE_KEY_IS_NOT_REGISTERED_ERROR | 등록되지 않은 서비스키 |
| `31` | DEADLINE_HAS_EXPIRED_ERROR | 활용기간 만료 |
| `22` | LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR | 트래픽 초과 |
| `99` | INVALID_REQUEST_PARAMETER_ERROR | 잘못된 요청 파라미터 (제공기관 에러) |

## 6. 데이터 예시 (Example)

### 요청 (Request)
```http
GET /StatusOfFacility/getFacilityKR?serviceKey={KEY}&facility_nm={Encoded_Name}&type=xml

## XML Structure
<response>
    <header>
        <resultCode>00</resultCode>
        <resultMsg>NORMAL SERVICE.</resultMsg>
    </header>
    <body>
        <items>
            <item>
                <arrordep>D</arrordep>
                <entrpskoreannm>와이파이도시락</entrpskoreannm>
                <lckoreannm>제1여객터미널 1층 일반지역 7번 출입구 부근</lckoreannm>
                <servicetime>06:00 ~ 22:00</servicetime>
                <tel>1566-9070</tel>
                <trtmntprdlstkoreannm>국내/해외 포켓와이파이</trtmntprdlstkoreannm>
            </item>
        </items>
        <numOfRows>10</numOfRows>
        <pageNo>1</pageNo>
        <totalCount>5</totalCount>
    </body>
</response>