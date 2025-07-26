"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineFileDownload } from "react-icons/md";
import { CopyGuruButton } from "../Buttons/CopyGuruButton";
import ButtonDownloadPdf from "../Buttons/ButtonDownloadPdf";
import ButtonLaporanBulanan from "../Buttons/ButtonLaporanBulanan";
import ButtonDownloadALl from "../Buttons/ButtonDownloadAll";

export default function TabSlug({ data, onClose }) {
    const [tab, setTab] = useState("siswa");

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", damping: 20, stiffness: 300 }
        },
        exit: { scale: 0.95, opacity: 0 }
    };

    const tabContentVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center p-4 backdrop-blur-sm"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
            >
                <motion.div
                    className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto relative"
                    variants={modalVariants}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute bg-red-500 p-2 rounded-lg top-4 right-4 text-white hover:text-gray-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Detail Absensi</h2>
                        <div className="flex flex-col gap-1 text-sm text-gray-500 mt-5">
                            <div className="flex flex-row justify-between">
                                <p className="">Tanggal: {data.tanggal}</p>
                                {/* <p>Kelas: {data.kelas}</p> */}
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Petugas: {data.petugas}</p>
                                <p>Sesi: {data.sesi.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                    <CopyGuruButton data={data} />
                    <ButtonDownloadPdf data={data} />
                    {/* testing inimah */}
                    <ButtonDownloadALl data={data} />

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            className={`px-4 py-2 font-medium text-sm ${tab === "siswa"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setTab("siswa")}
                        >
                            Siswa ({data.siswa.length})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium text-sm ${tab === "guru"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setTab("guru")}
                        >
                            Guru ({data.guru.length})
                        </button>
                    </div>

                    {/*=== Tab Content ===*/}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.15 }}
                        >
                            {tab === "siswa" ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="text-left text-gray-500 border-b">
                                            <tr>
                                                <th className="pb-3 font-medium">No</th>
                                                <th className="pb-3 pl-1.5 font-medium">Kls</th>
                                                <th className="pb-3 pl-2 font-medium">Nama</th>
                                                {/* <th className="pb-3 font-medium">L/P</th> */}
                                                <th className="pb-3 pl-1.5 font-medium">Ket</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {data.siswa.map((s, i) => {
                                                const prefixKelas = s.id.slice(0, 2); // atau slice(0, 3) jika kelas bisa '10A', '11B' dsb.

                                                // Temukan guru yang mengajar kelas sesuai prefix
                                                const guruKelas = data.guru.find(guru => guru.kelas === prefixKelas);

                                                return (
                                                    <tr key={i} className="border-b">
                                                        <td className="px-2 py-1">{i + 1}</td>
                                                        <td className="px-2 py-1">{guruKelas ? guruKelas.kelas : 'Kelas Tidak Ditemukan'}</td>
                                                        <td className="px-2 py-1">{s.nama}</td>
                                                        <td className="px-2 py-1">{s.keterangan}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="text-left text-gray-500 border-b">
                                            <tr>
                                                <th className="pb-3 font-medium text-center">Kelas</th>
                                                <th className="pb-3 font-medium">Nama</th>
                                                <th className="pb-3 font-medium">Status</th>
                                                <th className="pb-3 font-medium">Ket</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {data.guru.map((g, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 text-gray-500 text-center">{g.kelas}</td>
                                                    <td className="py-3">{g.nama}</td>
                                                    <td className="py-3 text-gray-500 capitalize">{g.status}</td>
                                                    <td className="py-3">{g.keterangan}</td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}