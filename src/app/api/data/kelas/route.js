export async function GET(request) {
    const GAS_URL = process.env.NEXT_PUBLIC_DATA_API;
    const { searchParams } = new URL(request.url);

    const kelas = searchParams.get("kelas");
    const sesi = searchParams.get("sesi");
    const hari = searchParams.get("hari");

    if (!kelas || !sesi || !hari) {
        return new Response(JSON.stringify({
            success: false,
            message: "Parameter kelas, sesi, dan hari wajib diisi"
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const url = `${GAS_URL}?route=data_kelas&kelas=${kelas}&sesi=${sesi}&hari=${hari}`;
        const response = await fetch(url);
        const result = await response.json();

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Error GET /api/data/kelas:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Gagal mengambil data kelas",
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
