export const prerender = false;

export async function GET({ request }) {
    // NEW Corrected API Key provided by user
    const API_KEY = '3VQy09yAoEDW9vaJMuhcuAA1m5H%2BwFx17E%2FzHlM0HtiS32TisxVMbRfrGfSaU%2Bk5BHczuT%2Bc19Jt9VUl7qkAbA%3D%3D';

    // Construct URL by string concatenation to preserve the key format
    // User provided endpoint: https://apis.data.go.kr/B551177/statusOfDepartureCongestion
    // We append the operation name: /getDepartureCongestion
    // Also updated casing 'Status' -> 'status' based on user input, though standard is often 'Status'.
    // Let's try the user's provided casing 'statusOfDepartureCongestion'.
    const TARGET_URL = `https://apis.data.go.kr/B551177/statusOfDepartureCongestion/getDepartureCongestion?serviceKey=${API_KEY}&numOfRows=20&pageNo=1&type=json`;

    try {
        const response = await fetch(TARGET_URL, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('[API] Upstream Status:', response.status);
            console.error('[API] Upstream Body:', text);
            return new Response(JSON.stringify({ error: `Upstream error ${response.status}`, details: text }), {
                status: 502, // Bad Gateway
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();

        // Validate data structure
        if (!data.response || !data.response.body) {
            console.error('[API] Invalid JSON structure:', data);
            throw new Error('Invalid API response structure');
        }

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
