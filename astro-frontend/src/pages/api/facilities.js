export const prerender = false;

export async function GET({ request }) {
    // Endpoint from user provided spec
    const API_KEY = import.meta.env.GO_DATA_API_KEY_COMMERCIAL;
    // Correct Operation Name: getFacilitesInfo (Note the spelling in spec)
    // Removed lcduty filter to fetch ALL facilities (both duty-free and general)
    const BASE_URL = `https://apis.data.go.kr/B551177/FacilitiesInformation/getFacilitesInfo?serviceKey=${API_KEY}&numOfRows=1000&pageNo=1&type=json&lang=K`;

    try {
        // Attempt Live Fetch
        const response = await fetch(BASE_URL, {
            headers: { 'Accept': 'application/json' }
        });

        let data = null;
        if (response.ok) {
            // Try parsing JSON
            try {
                const rawData = await response.json();

                if (rawData.response?.body?.items) {
                    let items = rawData.response.body.items;
                    if (!Array.isArray(items) && items.item) {
                        items = Array.isArray(items.item) ? items.item : [items.item];
                    }

                    // Map to frontend-friendly format with additional fields for filtering
                    const mappedItems = items.map(item => ({
                        name: item.facilitynm,
                        location: item.lcnm,
                        items: item.facilityitem,
                        servicetime: item.servicetime,
                        tel: item.tel,
                        arrordep: item.arrordep,
                        // New fields for filtering
                        terminal: item.terminalid, // P01, P03
                        floor: item.floorinfo,     // 1F, 2F, 3F, 4F
                        area: item.lcduty,         // Y=면세, N=일반
                        category: item.lcategorynm // 대분류
                    }));

                    data = {
                        response: {
                            header: rawData.response.header,
                            body: {
                                items: mappedItems,
                                totalCount: rawData.response.body.totalCount
                            }
                        }
                    };
                }
            } catch (e) {
                console.warn('[API] Facilities: Failed to parse JSON or Map Data, falling back to Mock.');
                // console.error(e); // Debug
                data = null;
            }
        } else {
            console.warn(`[API] Facilities: Upstream error ${response.status}. Falling back to Mock Data.`);
            if (response.status === 403) {
                console.error('[API] Facilities: 403 Forbidden. The API Key may not be authorized for "FacilitiesInformation/getFacilitesInfo".');
            }
        }

        if (!data) {
            data = getMockData();
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' // Cache for 1 hour, stale for 24h (Facilities change rarely)
            }
        });

    } catch (error) {
        console.error('[API] Facilities Exception:', error);
        // Even on crash, try to return Mock Data as last resort
        return new Response(JSON.stringify(getMockData()), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Mock Data based on API Spec fields: 
// entrpskoreannm (Name), trtmntprdlstkoreannm (Menu), lckoreannm (Location), servicetime (Time), tel
// Locations mapped to nearby gates (Heuristic):
// Gate 2 (West) -> Near Entrance 5-6 (General Area West)
// Gate 3 (Center West) -> Near Entrance 7-8
// Gate 4 (Center East) -> Near Entrance 9-10
// Gate 5 (East) -> Near Entrance 11-12
function getMockData() {
    return {
        response: {
            header: { resultCode: '00', resultMsg: 'NORMAL SERVICE (MOCK)' },
            body: {
                totalCount: 16,
                items: [
                    // West (Near Gate 2) - Entrance 5/6 area
                    {
                        entrpskoreannm: '스타벅스 T1입국',
                        lckoreannm: '제1여객터미널 1층 일반지역 5번 출입구 부근',
                        trtmntprdlstkoreannm: '커피, 디저트',
                        servicetime: '06:00 ~ 22:00',
                        tel: '032-743-0000',
                        arrordep: 'D'
                    },
                    {
                        entrpskoreannm: '롯데리아 버거랩',
                        lckoreannm: '제1여객터미널 3층 일반지역 5번 출입구 부근',
                        trtmntprdlstkoreannm: '햄버거, 감자튀김',
                        servicetime: '24시간',
                        tel: '032-743-1000'
                    },
                    {
                        entrpskoreannm: '파리바게뜨',
                        lckoreannm: '제1여객터미널 3층 일반지역 체크인카운터 F 인근', // Near Gate 2/3
                        trtmntprdlstkoreannm: '베이커리, 샌드위치',
                        servicetime: '05:00 ~ 23:00',
                        tel: '032-743-2000'
                    },

                    // Center (Near Gate 3/4) - Entrance 7/8/9 area
                    {
                        entrpskoreannm: '플레이팅 (가업식당)',
                        lckoreannm: '제1여객터미널 1층 일반지역 8번 출입구 부근',
                        trtmntprdlstkoreannm: '한식, 돈까스, 찌개',
                        servicetime: '06:00 ~ 22:00',
                        tel: '032-743-3000'
                    },
                    {
                        entrpskoreannm: '투썸플레이스',
                        lckoreannm: '제1여객터미널 3층 일반지역 8번 출입구 부근 (H체크인카운터)',
                        trtmntprdlstkoreannm: '커피, 케이크',
                        servicetime: '06:00 ~ 22:00',
                        tel: '032-743-4000'
                    },
                    {
                        entrpskoreannm: '약국 (W-Store)',
                        lckoreannm: '제1여객터미널 3층 일반지역 G 체크인카운터 인근',
                        trtmntprdlstkoreannm: '의약품, 마스크',
                        servicetime: '06:00 ~ 22:00',
                        tel: '032-743-5000'
                    },

                    // East (Near Gate 4/5) - Entrance 10/11/12
                    {
                        entrpskoreannm: '잠바주스',
                        lckoreannm: '제1여객터미널 3층 일반지역 10번 출입구 부근',
                        trtmntprdlstkoreannm: '스무디, 주스',
                        servicetime: '06:00 ~ 21:00',
                        tel: '032-743-6000'
                    },
                    {
                        entrpskoreannm: '모스버거',
                        lckoreannm: '제1여객터미널 1층 일반지역 11번 출입구 부근',
                        trtmntprdlstkoreannm: '햄버거',
                        servicetime: '07:00 ~ 22:00',
                        tel: '032-743-7000'
                    },
                    {
                        entrpskoreannm: '던킨도너츠',
                        lckoreannm: '제1여객터미널 3층 일반지역 12번 출입구 부근', // Near Gate 5
                        trtmntprdlstkoreannm: '도넛, 커피',
                        servicetime: '24시간',
                        tel: '032-743-8000'
                    },

                    // Public/Rest Areas
                    {
                        entrpskoreannm: '냅존 (Rest Zone)',
                        lckoreannm: '제1여객터미널 4층 면세지역 25번 게이트 부근', // Airside example
                        trtmntprdlstkoreannm: '휴식공간',
                        servicetime: '24시간',
                        tel: ''
                    }
                ]
            }
        }
    };
}
