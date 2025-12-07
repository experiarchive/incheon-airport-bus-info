export const prerender = false;

export async function GET({ request }) {
    const API_KEY = '3VQy09yAoEDW9vaJMuhcuAA1m5H%2BwFx17E%2FzHlM0HtiS32TisxVMbRfrGfSaU%2Bk5BHczuT%2Bc19Jt9VUl7qkAbA%3D%3D';

    // Fetch ALL data (100 rows) to ensure we get T1 and T2 if provided in single list.
    // The API might return P01 and P02 mixed or separated by page. 
    // Given previous duplicates, it implies P01 is default if terminalId is wrong.
    // We will trust the single '100 rows' call first.
    const TARGET_URL = `https://apis.data.go.kr/B551177/statusOfDepartureCongestion/getDepartureCongestion?serviceKey=${API_KEY}&numOfRows=100&pageNo=1&type=json`;

    try {
        const response = await fetch(TARGET_URL, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('[API] Upstream Status:', response.status);
            return new Response(JSON.stringify({ error: `Upstream ${response.status}`, details: text }), { status: 502 });
        }

        const data = await response.json();

        // Safety check
        if (!data.response?.body?.items) {
            return new Response(JSON.stringify(data), { status: 200 });
        }

        let items = data.response.body.items;

        // Deduplication logic (Key: gateId)
        // Sometimes API returns duplicates for same gate?
        const uniqueItems = [];
        const seen = new Set();

        items.forEach(item => {
            // Normalize gateId (sometimes might differ by spacing?)
            const key = item.gateId;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueItems.push(item);
            }
        });

        data.response.body.items = uniqueItems;
        data.response.body.totalCount = uniqueItems.length;

        return new Response(JSON.stringify(data), {
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
