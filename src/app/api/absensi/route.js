export async function GET(request) {
    const GAS_URL = process.env.NEXT_PUBLIC_ABSEN_API;
    const { searchParams } = new URL(request.url);

    const tanggal = searchParams.get("tanggal");
    const sesi = searchParams.get("sesi");
    const kelas = searchParams.get("kelas");

    if (!tanggal || !sesi || !kelas) {
        return new Response(JSON.stringify({
            success: false,
            message: "Parameter tidak lengkap"
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const url = `${GAS_URL}?route=absen&tanggal=${tanggal}&sesi=${sesi}&kelas=${kelas}`;
        const response = await fetch(url);
        const result = await response.json();

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Gagal mengambil data absensi',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


export async function POST(request) {
    const GAS_URL = process.env.NEXT_PUBLIC_ABSEN_API;

    if (!GAS_URL) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Link GAS_API belum disetting di .env.local'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();

        const response = await fetch(`${GAS_URL}?route=absen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        return new Response(JSON.stringify(result), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('POST /api/absensi error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Gagal mengirim absensi ke server',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
