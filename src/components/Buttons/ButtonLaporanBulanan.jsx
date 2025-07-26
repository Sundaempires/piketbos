import { useState } from "react";

const ButtonLaporanBulanan = ({ data }) => {
    const [showModal, setShowModal] = useState(false);
    const [bulanDipilih, setBulanDipilih] = useState("");

    const bulanList = [
        { value: "01", label: "Jan" },
        { value: "02", label: "Feb" },
        { value: "03", label: "Mar" },
        { value: "04", label: "Apr" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Jun" },
        { value: "07", label: "Jul" },
        { value: "08", label: "Agu" },
        { value: "09", label: "Sep" },
        { value: "10", label: "Okt" },
        { value: "11", label: "Nov" },
        { value: "12", label: "Des" },
    ];

    const handleBulanChange = (e) => {
        setBulanDipilih(e.target.value);
    };

    const handleProses = () => {
        const dataBulan = data.filter(item => item.tanggal.split("-")[1] === bulanDipilih);
        console.log(`Data untuk bulan ${bulanDipilih}:`, dataBulan);
        setShowModal(false);
    };

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Rekap Bulanan</button>

            {showModal && (
                <div className="fixed inset-0 p-3 bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-lg font-bold mb-3">Pilih Bulan</h2>
                        <div
                            value={bulanDipilih}
                            className="flex flex-wrap justify-center items-center gap-3 bg-red-500 p-2 rounded-md w-50 mb-4"
                        >
                            {bulanList.map((bulan, i) => (
                                <button key={i} className=" border w-12 h-12 text-center rounded border-green-500">
                                    {bulan.label}
                                </button>
                            ))}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-400 rounded-md">
                            Batal
                        </button>
                        <button
                            onClick={handleProses}
                            disabled={!bulanDipilih}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md"
                        >
                            Proses
                        </button>
                    </div>
                </div>
                </div>
    )
}
        </div >
    );
};

export default ButtonLaporanBulanan;
