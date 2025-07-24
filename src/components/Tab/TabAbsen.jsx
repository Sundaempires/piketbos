"use client";

import { FiPlus, FiClock, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import TabSlug from "./TabSlug";
import LoadingIndicator from "../Loading/load";
import { NotifSubmit } from "../Loading/NotifSubmit";

const TabAbsen = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [kelas, setKelas] = useState("7A");
    const [sesi, setSesi] = useState("pagi");
    const [hari, setHari] = useState(getHariIndo(new Date())); // Fungsi untuk ambil nama hari
    const [siswa, setSiswa] = useState([]);
    const [notif, setNotif] = useState(null);
    const [guru, setGuru] = useState([]);
    const [idGuru, setIdGuru] = useState("");
    const [statusGuru, setStatusGuru] = useState("H"); // default Hadir
    const [keteranganGuru, setKeteranganGuru] = useState("");
    const [kehadiranSiswa, setKehadiranSiswa] = useState({});
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataAbsensi, setDataAbsensi] = useState([]);


    // Ambil data siswa saat kelas/sesi/hari berubah
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/data/kelas?kelas=${kelas}&sesi=${sesi}&hari=${hari}`);
                const json = await res.json();
                if (json.success) {
                    setSiswa(json.data.siswa);
                    setNotif(`Data berhasil diperbarui untuk kelas ${kelas} sesi ${sesi}`);
                    setGuru(json.data.guru);
                    // Auto clear notif setelah 3 detik
                    setTimeout(() => setNotif(null), 3000);
                } else {
                    console.error("Gagal ambil data siswa:", json.message);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        }

        fetchData();
    }, [kelas, sesi, hari]);

    function getHariIndo(date = new Date()) {
        const hariIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return hariIndo[date.getDay()];
    }

    function formatTanggal(date = new Date()) {
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    const handleSubmit = async () => {
        const today = new Date();
        const tanggal = today.toISOString().split("T")[0]; // ex: "2025-07-21"

        const petugas = JSON.parse(localStorage.getItem("user"))?.nama || "TIDAK DIKETAHUI";

        const guruTerpilih = guru.find((g) => g.id.toString() === idGuru);
        if (!guruTerpilih) {
            alert("Guru belum dipilih!");
            return;
        }

        // Format guru sesuai struktur
        const guruPayload = [{
            id: guruTerpilih.id,
            nama: guruTerpilih.nama,
            status: statusGuru === "H" ? "hadir" : "tidak hadir",
            keterangan: statusGuru === "T" ? keteranganGuru : ""
        }];

        // Filter siswa tidak hadir
        const siswaTidakHadir = siswa
            .filter((s) => kehadiranSiswa[s.id] && kehadiranSiswa[s.id] !== "H")
            .map((s) => ({
                id: s.id,
                nama: s.nama,
                kelamin: s.kelamin,
                keterangan:
                    kehadiranSiswa[s.id] === "S"
                        ? "Sakit"
                        : kehadiranSiswa[s.id] === "I"
                            ? "Izin"
                            : "Alpha"
            }));

        const payload = {
            tanggal,
            sesi,
            kelas,
            petugas,
            siswa: siswaTidakHadir,
            guru: guruPayload
        };

        // console.log("Payload yang dikirim:", payload);
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/absensi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            // console.log("Respon API:", result);
            if (result.success) {
                setNotification({
                    type: 'success',
                    message: 'Absensi berhasil dikirim!'
                });
                setIsSubmitting(false);
                setShowPopup(false)
            } else {
                setNotification({
                    type: 'error',
                    message: `Gagal menyimpan absensi: ${result.message}`
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Terjadi kesalahan saat mengirim data'
            });
        }
    };

    const [dataSlug, setDataSlug] = useState([]);
    const [selectedData, setSelectedData] = useState(null);

    const fetchAllData = async () => {
        const res = await fetch("/api/data/all");
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
            setDataSlug(json.data);
            setDataAbsensi(json.data);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // proses perbaikan
    const uniqueDataByTanggalSesi = Array.from(
        new Map(
            dataAbsensi.map((item) => [`${item.tanggal}-${item.sesi}`, item])
        ).values()
    );

    const handleClick = (item) => {
        fetchAllData();
        const { tanggal, sesi } = item;

        // Ambil semua data yang memiliki tanggal & sesi sama
        const filtered = dataSlug.filter(
            (d) => d.tanggal === tanggal && d.sesi === sesi
        );

        // Gabungkan seluruh data siswa dan guru dari seluruh kelas
        const allSiswa = filtered.flatMap((d) => d.siswa);

        // Gabungkan guru sekaligus sertakan nama kelasnya
        const allGuru = filtered.flatMap((d) =>
            d.guru.map((g) => ({
                ...g,
                kelas: d.kelas, // sertakan kelas asal guru tersebut
            }))
        );

        setSelectedData({
            tanggal,
            sesi,
            petugas: item.petugas,
            siswa: allSiswa,
            guru: allGuru,
        });
    };

    console.log(selectedData);
    



    return (
        <div className="p-4">
            {/* Form Tambah Absensi */}
            <div className="mb-6">
                <div className="mb-4 mt-2 flex justify-center">
                    <p className="text-sm text-gray-600">
                        <strong>Hari ini:</strong> {hari}, {formatTanggal(new Date())}
                    </p>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-1">
                    <FiPlus size={14} /> Tambahkan Absensi
                </p>
                <button
                    onClick={() => setShowPopup(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md w-full flex items-center justify-center gap-2 transition-colors"
                >
                    <FiPlus /> Tambah Absen
                </button>
            </div>

            {/* Riwayat Absensi */}
            <div>
                <p className="text-gray-500 text-sm font-medium mb-3 flex items-center gap-1">
                    <FiClock size={14} /> Riwayat Absensi
                </p>
                {uniqueDataByTanggalSesi.length === 0 &&
                    <LoadingIndicator />
                }
                <div className="space-y-3">
                    {uniqueDataByTanggalSesi.map((items, index) => (
                        <button
                            onClick={() => handleClick(items)}
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-700 font-medium">{items.tanggal}</p>
                                <span className={`px-3 py-1 text-xs rounded-full ${items.sesi === "pagi"
                                    ? "bg-blue-100 text-blue-800"
                                    : items.sesi === "siang"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-orange-100 text-orange-800"
                                    }`}>
                                    {items.sesi.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-600 flex items-center gap-1">
                                <FiUser size={14} /> {items.petugas}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Popups Slug Data */}
            {selectedData && (
                <TabSlug data={selectedData} onClose={() => setSelectedData(null)} />
            )}

            {/* Popup Form (akan diimplementasikan nanti) */}
            <AnimatePresence>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 500 }}
                            className="bg-white w-full max-w-2xl max-h-screen overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white p-6 flex justify-between items-center z-10">
                                <h2 className="text-xl font-bold text-gray-800">Form Tambah Absensi</h2>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="text-white hover:text-gray-700 bg-red-500 p-2 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {/* Notifikasi */}
                                {notif && (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-2/3"
                                        >
                                            <div className="flex items-center p-4 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200 shadow-lg">
                                                <svg
                                                    className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span>{notif}</span>
                                                {/* <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setNotif(null)}
                                                    className="ml-3 text-green-500 hover:text-green-700"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </motion.button> */}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Form Content */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sesi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sesi</label>
                                        <select
                                            value={sesi}
                                            onChange={(e) => setSesi(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                            <option value="pagi">Pagi</option>
                                            <option value="siang">Siang</option>
                                            <option value="akhir">Akhir</option>
                                        </select>
                                    </div>

                                    {/* Kelas */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                                        <select
                                            value={kelas}
                                            onChange={(e) => setKelas(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                            <option value="7A">7A</option>
                                            <option value="7B">7B</option>
                                            <option value="7C">7C</option>
                                            <option value="7D">7D</option>
                                            <option value="8A">8A</option>
                                            <option value="8B">8B</option>
                                            <option value="8C">8C</option>
                                            <option value="8D">8D</option>
                                            <option value="8E">8E</option>
                                            <option value="9A">9A</option>
                                            <option value="9B">9B</option>
                                            <option value="9C">9C</option>
                                            <option value="9D">9D</option>
                                            <option value="9E">9E</option>
                                            <option value="9F">9F</option>
                                        </select>
                                    </div>

                                    {/* Guru Pengajar */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pengajar</label>
                                        <select
                                            value={idGuru}
                                            onChange={(e) => setIdGuru(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                            <option value="">-- Pilih Guru --</option>
                                            {guru.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.nama} - {g.id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Status Kehadiran Guru */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Kehadiran Guru</label>
                                        <select
                                            value={statusGuru}
                                            onChange={(e) => setStatusGuru(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                            <option value="H">Hadir</option>
                                            <option value="T">Tidak Hadir</option>
                                        </select>
                                    </div>

                                    {/* Keterangan Guru */}
                                    {statusGuru === "T" && (
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Guru</label>
                                            <input
                                                type="text"
                                                value={keteranganGuru}
                                                onChange={(e) => setKeteranganGuru(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Contoh: Sakit, Izin, dll"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Daftar Siswa */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Daftar Siswa</label>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th> */}
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {siswa.length > 0 ? (
                                                    siswa.map((item, idx) => (
                                                        <tr key={idx}>
                                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td> */}
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.kelas}</td>
                                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <select
                                                                    value={kehadiranSiswa[item.id] || "H"}
                                                                    onChange={(e) =>
                                                                        setKehadiranSiswa((prev) => ({
                                                                            ...prev,
                                                                            [item.id]: e.target.value
                                                                        }))
                                                                    }
                                                                    className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                                >
                                                                    <option value="H">Hadir</option>
                                                                    <option value="S">Sakit</option>
                                                                    <option value="I">Izin</option>
                                                                    <option value="A">Alpha</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center px-6 py-4 text-gray-400">Tidak ada data siswa</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-white p-2 flex">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-75 cursor-wait' : ''
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sedang Mengirim...
                                        </>
                                    ) : (
                                        'Simpan Data'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Notif Succes Submit */}
            {notification && (
                <NotifSubmit
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default TabAbsen;