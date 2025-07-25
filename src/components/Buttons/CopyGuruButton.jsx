"use client";
import { useState } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiCopy } from 'react-icons/fi';

export function CopyGuruButton({ data }) {
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        isError: false
    });

    const handleCopyGuru = async () => {
        if (!data || !Array.isArray(data.guru) || data.guru.length === 0) {
            setNotification({
                show: true,
                message: 'Tidak ada data guru untuk disalin.',
                isError: true
            });
            return;
        }

        const kapitalisasi = (str) =>
            str ? str.charAt(0).toUpperCase() + str.slice(1) : 'Sesi Tidak Ada';

        const formatTanggal = (tanggalString) => {
            if (!tanggalString) return 'Tanggal Tidak Ada';
            const bulanIndonesia = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            const tgl = new Date(tanggalString);
            const hari = tgl.getDate();
            const bulan = bulanIndonesia[tgl.getMonth()];
            const tahun = tgl.getFullYear();
            return `${hari} ${bulan} ${tahun}`;
        };

        const judul = `Absensi ${formatTanggal(data.tanggal)} - ${kapitalisasi(data.sesi)}`;

        // Urutkan data guru berdasarkan kelas (angka lalu huruf)
        const sortedGuru = [...data.guru].sort((a, b) => {
            const extractKelas = (kelas) => {
                const match = kelas?.match(/^(\d+)([A-Za-z]*)$/);
                return match ? [parseInt(match[1]), match[2] || ''] : [Infinity, ''];
            };
            const [angkaA, hurufA] = extractKelas(a.kelas || '');
            const [angkaB, hurufB] = extractKelas(b.kelas || '');
            if (angkaA !== angkaB) return angkaA - angkaB;
            return hurufA.localeCompare(hurufB);
        });

        const daftarGuru = sortedGuru.map((g) => {
            const kelas = g.kelas || 'Kelas Tidak Ada';
            const nama = g.nama || 'Nama Tidak Ada';
            const statusIcon = g.status === "hadir" ? "✅" : "❌";
            const keterangan = g.status === "hadir" ? "" : (g.keterangan ? ` - ${g.keterangan}` : "");
            return `${kelas}  ${nama} ${statusIcon}${keterangan}`;
        });

        const hasil = [judul, ...daftarGuru].join("\n");

        try {
            await navigator.clipboard.writeText(hasil);
            setNotification({
                show: true,
                message: 'Data berhasil disalin!',
                isError: false
            });
        } catch (error) {
            setNotification({
                show: true,
                message: 'Gagal menyalin data',
                isError: true
            });
        } finally {
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        }
    };



    return (
        <div className="relative inline-block">
            <button
                onClick={handleCopyGuru}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors flex items-center gap-1"
                disabled={!Array.isArray(data?.guru) || data.guru.length === 0}
                aria-label="Salin data guru"
            >
                <FiCopy className="text-xl" />
            </button>

            <AnimatePresence>
                {notification.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className={`w-50 absolute left-24 text-sm -translate-x-1/2 top-0 ml-24 px-4 py-2 rounded-lg shadow-md z-10 ${notification.isError
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {notification.isError ? (
                                <FiCheck className='mt-1 text-sm' />
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            <span>{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
