export async function GET() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_GETALL_API}?route=absensi_all`);

        if (!res.ok) {
            throw new Error("Gagal mengambil data dari Apps Script");
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
