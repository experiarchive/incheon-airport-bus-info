export const prerender = false;

export async function GET({ request }) {
    const API_KEY = '3VQy09yAoEDW9vaJMuhcuAA1m5H%2BwFx17E%2FzHlM0HtiS32TisxVMbRfrGfSaU%2Bk5BHczuT%2Bc19Jt9VUl7qkAbA%3D%3D';

    const BASE_URL = `https://apis.data.go.kr/B551177/statusOfDepartureCongestion/getDepartureCongestion?serviceKey=${API_KEY}&numOfRows=20&pageNo=1&type=json`;

    try {
        // Fetch T1 (P01) and T2 (P02) in parallel
        const urlT1 = `${BASE_URL}&terminalId=P01`;
        const urlT2 = `${BASE_URL}&terminalId=P02`;

        const [resT1, resT2] = await Promise.all([
            fetch(urlT1, { headers: { 'Accept': 'application/json' } }),
            fetch(urlT2, { headers: { 'Accept': 'application/json' } })
        ]);

        const dataT1 = await resT1.json();
        const dataT2 = await resT2.json();

        // Merge items
        let items = [];
        if (dataT1.response?.body?.items) items = items.concat(dataT1.response.body.items);
        if (dataT2.response?.body?.items) items = items.concat(dataT2.response.body.items);

        // Construct merged response
        // Use T1 header as base if available
        const mergedData = {
            response: {
                header: dataT1.response?.header || { resultCode: '00', resultMsg: 'NORMAL SERVICE' },
                body: {
                    items: items,
                    totalCount: items.length
                }
            }
        };

        return new Response(JSON.stringify(mergedData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
            }
        });

    } catch (error) {
        console.error('[API] Exception:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
