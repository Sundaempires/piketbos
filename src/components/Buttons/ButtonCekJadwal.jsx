'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ButtonCekJadwal = () => {
    const semuaKelas = ['7A', '7B', '7C','7D', '8A', '8B', '8C','8D','8E', '9A', '9B', '9C', '9D', '9E', '9F'];
    const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingTime, setLoadingTime] = useState(0);
    const [sesiAktif, setSesiAktif] = useState('');
    const [dataGuru, setDataGuru] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setInterval(() => {
                setLoadingTime(prev => prev + 1);
            }, 1000);
        } else {
            setLoadingTime(0);
        }
        return () => clearInterval(timer);
    }, [loading]);

    const handleClick = async (sesiDipilih) => {
        setLoading(true);
        setSesiAktif(sesiDipilih);
        setLoadingProgress(0);

        try {
            const semuaFetch = semuaKelas.map((kelas, index) => {
                const url = `/api/data/kelas?kelas=${kelas}&sesi=${sesiDipilih}&hari=${hariIni}`;
                return fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        setLoadingProgress(Math.round(((index + 1) / semuaKelas.length) * 100));
                        return data;
                    });
            });

            const hasil = await Promise.all(semuaFetch);
            const semuaGuru = hasil.flatMap(res => res.data?.guru || []);
            setDataGuru(semuaGuru);
            setShowModal(true);
        } catch (error) {
            console.error(`Gagal mengambil data sesi ${sesiDipilih}:`, error);
        } finally {
            setLoading(false);
            // setSesiAktif('');
            setLoadingProgress(0);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Loading Indicator */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Memuat data sesi <span className="font-bold text-blue-600">{sesiAktif}</span>
                        </span>
                        <span className="text-xs text-gray-500">{loadingTime} detik</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="h-2 rounded-full bg-blue-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {loadingProgress}% selesai ({Math.round(semuaKelas.length * loadingProgress / 100)}/{semuaKelas.length} kelas)
                    </p>
                </motion.div>
            )}

            {/* Action Buttons - Hidden during loading */}
            <AnimatePresence>
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-3"
                    >
                        {['pagi', 'siang', 'akhir'].map((sesi) => (
                            <motion.button
                                key={sesi}
                                onClick={() => handleClick(sesi)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-2.5 rounded-lg font-medium text-white shadow-md transition-all ${sesi === 'pagi' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                                    sesi === 'siang' ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' :
                                        'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                    }`}
                            >
                                {sesi.charAt(0).toUpperCase() + sesi.slice(1)}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col"
                        >
                            <div className="flex flex-col items-center p-5 border-b">
                                <h2 className="text-xl font-bold text-center uppercase text-gray-800 mb-1">JADWAL GURU</h2>
                                <div className="flex justify-center gap-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Hari:</span> {hariIni}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Sesi:</span> {sesiAktif.charAt(0).toUpperCase() + sesiAktif.slice(1)}
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Guru</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dataGuru.length > 0 ? (
                                            dataGuru.map((guru, index) => (
                                                <motion.tr
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guru.kelas}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guru.nama}</td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guru.sesi}</td> */}
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Tidak ada data guru yang ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-2 px-4 bg-red-500 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none"
                                >
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ButtonCekJadwal;