export async function POST(request) {
    const GAS_URL = process.env.NEXT_PUBLIC_GAS_API;
    const body = await request.json();

    try {
        const response = await fetch(`${GAS_URL}?route=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Login route error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal Server Error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
