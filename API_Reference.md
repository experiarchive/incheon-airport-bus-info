# 인천국제공항공사 출국장 혼잡도 조회 OpenAPI 명세서

## 1. 기본 정보
- [cite_start]**Base URL**: `http://apis.data.go.kr/B551177/statusOfDepartureCongestion` [cite: 25]
- [cite_start]**서비스 ID**: `statusOfDepartureCongestion` [cite: 20]
- [cite_start]**데이터 포맷**: XML (기본값), JSON 지원 [cite: 25, 31]
- [cite_start]**통신 방식**: REST (GET) [cite: 25]
- [cite_start]**갱신 주기**: 실시간 (1~2분) [cite: 25]

## 2. API 엔드포인트
### [cite_start]오퍼레이션: 출국장 혼잡도 조회 (`getDepartureCongestion`) [cite: 27]
- [cite_start]**설명**: 제1여객터미널 출국장의 대기 인원, 대기 시간, 운영 시간 등의 데이터를 제공. [cite: 29]
- [cite_start]**URL**: `{Base URL}/getDepartureCongestion` [cite: 29]

## 3. 요청 파라미터 (Request)
| 항목명 (Key) | 설명 | 필수 | 타입 | 비고 |
| :--- | :--- | :--- | :--- | :--- |
| `serviceKey` | 공공데이터포털 인증키 | Y | String | [cite_start]Decoding된 키 사용 권장 [cite: 31] |
| `pageNo` | 페이지 번호 | Y | Integer | [cite_start]기본값: 1 [cite: 31] |
| `numOfRows` | 한 페이지 결과 수 | Y | Integer | [cite_start]기본값: 10 [cite: 31] |
| `type` | 응답 유형 | N | String | [cite_start]`xml` 또는 `json` (Default: xml) [cite: 31] |
| `terminalId` | 터미널 구분 | N | String | [cite_start]`P01`: 제1터미널 (현재 T1만 제공) [cite: 31, 40] |
| `gateId` | 출국장 ID | N | String | [cite_start]특정 게이트 조회 시 사용 (하단 코드표 참조) [cite: 31] |

### [cite_start]Gate ID 코드표 (제1터미널) [cite: 31]
- `DG1_E`: 2번 출국장 동쪽
- `DG1_W`: 1번 출국장 서쪽
- `DG2_E`: 2번 출국장 동쪽 (스마트패스 전용)
- `DG2_W`: 2번 출국장 서쪽
- `DG3_E`: 3번 출국장 동쪽
- `DG3_W`: 3번 출국장 서쪽
- `DG4_E`: 4번 출국장 동쪽
- `DG4_W`: 4번 출국장 서쪽
- `DG5_E`: 5번 출국장 동쪽
- `DG5_W`: 5번 출국장 서쪽
- `DG6_E`: 6번 출국장 동쪽
- `DG6_W`: 6번 출국장 서쪽

## 4. 응답 데이터 (Response)
| 항목명 (Key) | 설명 | 타입 | 비고 |
| :--- | :--- | :--- | :--- |
| `gateId` | 출국장 ID | String | [cite_start]예: DG1_E [cite: 36] |
| `waitLength` | 대기 인원수 (명) | Number | [cite_start]IoT 센서 측정값 [cite: 36] |
| `waitTime` | 예상 대기 시간 (분) | Number | [cite_start]출국장+보안검색+법무부 합산 시간 [cite: 36, 43] |
| `operatingTime` | 운영 시간 | String | [cite_start]예: 05:00~22:00 [cite: 36] |
| `occurtime` | 데이터 발생 일시 | String | [cite_start]YYYYMMDDHHMMSS 형식 [cite: 36] |
| `terminalId` | 터미널 ID | String | [cite_start]P01 (T1) [cite: 36] |

## 5. 비즈니스 로직 및 기준
### [cite_start]A. 대기 시간 (`waitTime`) 산출 방식 [cite: 43]
`waitTime` = ①출국장 대기시간 + ②보안검색 대기시간 + ③법무부 대기시간
* [cite_start]**①, ②**: 대기인원 ÷ 유출속도 (IoT 센서 측정) [cite: 44]
* [cite_start]**③ (법무부 심사)**: 보안검색 지역 혼잡도에 따른 추정치 적용 [cite: 46]
    * [cite_start]대기인원 100명 이하: **6분** [cite: 48]
    * [cite_start]대기인원 200명 이하: **8분** [cite: 48]
    * [cite_start]대기인원 200명 초과: **10분** [cite: 48]

### [cite_start]B. 혼잡도 레벨 기준 (UI 표시용) [cite: 56]
| 구분 | 기준 (분) |
| :--- | :--- |
| **원활** (Smooth) | 20분 미만 |
| **보통** (Normal) | 20분 이상 ~ 30분 미만 |
| **혼잡** (Crowded) | 30분 이상 ~ 40분 미만 |
| **매우 혼잡** (Very Crowded) | 40분 이상 |

## 6. 에러 코드 (Error Handling)
* [cite_start]`00`: 정상 (NORMAL SERVICE) [cite: 36]
* [cite_start]`30`: 등록되지 않은 서비스키 (SERVICE_KEY_IS_NOT_REGISTERED_ERROR) [cite: 59]
* [cite_start]`31`: 활용기간 만료 (DEADLINE_HAS_EXPIRED_ERROR) [cite: 59]
* [cite_start]`22`: 일일 트래픽 초과 (LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR) [cite: 59]

## 7. JSON 응답 예시
```json
{
  "response": {
    "header": {
      "resultCode": "00",
      "resultMsg": "NORMAL SERVICE."
    },
    "body": {
      "items": [
        {
          "gateId": "DG1_E",
          "occurtime": "20250811500100",
          "operatingTime": "08:00~20:00",
          "terminalId": "P01",
          "waitLength": "777",
          "waitTime": "333"
        }
      ],
      "numOfRows": 10,
      "pageNo": 1,
      "totalCount": 12
    }
  }
}