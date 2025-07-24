import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Storage = () => {
    const [dataGuru, setDataGuru] = useState([]);
    const [dataSiswa, setDataSiswa] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setProgress(30); // Simulasi progress awal

                const res = await fetch("/api/data/all");
                const json = await res.json();
                setProgress(70);

                if (json.success && Array.isArray(json.data)) {
                    const semuaGuru = json.data.flatMap((item) => item.guru);
                    const semuaSiswa = json.data.flatMap((item) => item.siswa);

                    setDataGuru(semuaGuru);
                    setDataSiswa(semuaSiswa);
                }
                setProgress(100);
            } catch (error) {
                console.error("Gagal memuat data:", error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                    setProgress(0);
                }, 500);
            }
        };

        fetchData();
    }, []);

    // Hitung persentase penggunaan storage
    const siswaPercentage = Math.min((dataSiswa.length / 10000) * 100, 100);
    const guruPercentage = Math.min((dataGuru.length / 10000) * 100, 100);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Progres Penyimpanan Data</h2>

            {isLoading ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Memuat data...</span>
                        <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div
                            className="bg-blue-600 h-2.5 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Progress Siswa */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Data Siswa</span>
                            <span className="text-sm text-gray-500">
                                {dataSiswa.length} / 10.000 ({siswaPercentage.toFixed(1)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <motion.div
                                className="h-2.5 rounded-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${siswaPercentage}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>

                    {/* Progress Guru */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Data Guru</span>
                            <span className="text-sm text-gray-500">
                                {dataGuru.length} / 10.000 ({guruPercentage.toFixed(1)}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <motion.div
                                className="h-2.5 rounded-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${guruPercentage}%` }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-2 ${siswaPercentage >= 90 || guruPercentage >= 90
                            ? 'bg-red-500'
                            : siswaPercentage >= 70 || guruPercentage >= 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`} />
                        {siswaPercentage >= 90 || guruPercentage >= 90
                            ? 'Penyimpanan hampir penuh'
                            : siswaPercentage >= 70 || guruPercentage >= 70
                                ? 'Penyimpanan cukup penuh'
                                : 'Penyimpanan aman'}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Storage;