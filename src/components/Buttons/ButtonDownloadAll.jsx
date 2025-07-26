'use client';

import { MdOutlineFileDownload } from 'react-icons/md';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ButtonDownloadALl = ({ data }) => {

    // === Notifikasi succes download ===
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);


    // === Fungsi button download ===
    const handleDownload = () => {

        try {
            // Daftar jam untuk setiap hari dan sesi
            const sesiWaktu = {
                senin: {
                    pagi: '07.00 - 07.35',
                    siang: '09.30 - 10.05',
                    akhir: '11.15 - 11.50'
                },
                selasa: {
                    pagi: '07.15 - 07.50',
                    siang: '09.45 - 10.20',
                    akhir: '11.30 - 12.05'
                },
                rabu: {
                    pagi: '07.30 - 08.05',
                    siang: '10.00 - 10.35',
                    akhir: '12.00 - 12.35'
                },
                kamis: {
                    pagi: '07.45 - 08.20',
                    siang: '10.30 - 11.05',
                    akhir: '12.15 - 12.50'
                },
                jumat: {
                    pagi: '07.00 - 07.40',
                    siang: '09.00 - 09.40',
                    akhir: '11.00 - 11.40'
                },
                sabtu: {
                    pagi: '07.20 - 07.55',
                    siang: '09.50 - 10.25',
                    akhir: '11.35 - 12.10'
                }
            };

            // === Ukuran Kertas ===
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [210, 330], // Ukuran F4
            });

            // === Ambil Data Dari Parameter (data)
            const { tanggal, sesi, petugas, siswa, guru } = data;

            // === Fungsi untuk ambil nama hari dari tanggal (dalam format: 2024-07-24) ===
            function getNamaHari(dateStr) {
                const hariList = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
                const dateObj = new Date(dateStr);
                return hariList[dateObj.getDay()];
            }

            // === Ambil hari dari tanggal ===
            const namaHari = getNamaHari(tanggal); // contoh output: 'kamis'

            // === Ambil jam dari sesi dan hari ===
            const jamSesi = sesiWaktu[namaHari]?.[sesi.toLowerCase()] || '-';


            // === ubah format tanggal contoh output : 24 Juli 2025 ===
            const tanggalNew = new Date(tanggal).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            // === Judul Utama ===
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            const pageWidth = doc.internal.pageSize.getWidth();

            const title1 = 'REKAPITULASI KEHADIRAN GURU DAN SISWA';
            const title2 = 'MTs NEGERI 4 SUMEDANG';

            const textWidth1 = doc.getTextWidth(title1);
            const textWidth2 = doc.getTextWidth(title2);

            const x1 = (pageWidth - textWidth1) / 2;
            const x2 = (pageWidth - textWidth2) / 2;

            doc.text(title1, x1, 15);
            doc.text(title2, x2, 22);

            // === Info Tanggal, Sesi, Petugas ===
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);


            // === Kiri: Tanggal dan sesi ===
            const leftText = `Tanggal : ${tanggalNew} - (${jamSesi})`;
            doc.text(leftText, 14, 35); // posisi kiri, Y = 30

            // === Kanan: Petugas ===
            const rightText = `Petugas Piket : ${petugas}`;
            const textWidth = doc.getTextWidth(rightText);
            const rightXidnts = pageWidth - textWidth - 14; // posisi kanan dengan margin kanan 14
            doc.text(rightText, rightXidnts, 35);


            // === Judul Tabel Guru ===
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('Daftar Kehadiran Guru', 14, 43); // Tepat di atas tabel guru

            // === Siapkan data guru minimal 8 baris ===
            let guruData = [...guru];
            while (guruData.length < 15) {
                guruData.push({ nama: '', a: '', kelas: '', keterangan: '' });
            }

            // === Ambil data Guru yang tidak hadir ===
            const dataGuru = guru.map(g => ({
                ...g,
                status: g.status
                    ? g.status.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
                    : ''
            }));

            console.log(dataGuru);





            // === Tabel Guru ===
            autoTable(doc, {
                startY: 45,
                head: [['No', 'Nama Guru', 'Mapel', 'Hadir', 'Kelas', 'Keterangan']],
                body: dataGuru.map((g, index) => [
                    index + 1,
                    g.nama || '',
                    g.a || '',
                    g.status || '',
                    g.kelas || '',
                    g.keterangan || '',
                ]),
                theme: 'grid',
                styles: {
                    fontSize: 9,
                    textColor: [0, 0, 0],       // Teks isi hitam
                    lineColor: [0, 0, 0],       // Garis border isi hitam
                    lineWidth: 0.1              // Ketebalan border isi
                },
                headStyles: {
                    fillColor: [255, 255, 255], // Latar belakang header putih
                    textColor: [0, 0, 0],       // Teks header hitam
                    lineColor: [0, 0, 0],       // Garis border header hitam
                    lineWidth: 0.1,             // Ketebalan border header
                    fontStyle: 'bold',
                },
                tableLineColor: [0, 0, 0],    // Border seluruh tabel hitam
                tableLineWidth: 0.1,          // Ketebalan border seluruh tabel
            });

            // === Siapkan Data Siswa ===
            let siswaKiri = siswa.slice(0, 20);
            let siswaKanan = siswa.slice(20, 40);

            while (siswaKiri.length < 20) {
                siswaKiri.push({ id: '', nama: '', keterangan: '' });
            }
            while (siswaKanan.length < 20) {
                siswaKanan.push({ id: '', nama: '', keterangan: '' });
            }

            const startY = doc.lastAutoTable.finalY + 10;

            // === Judul Tabel Siswa ===
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('Daftar Siswa yang Tidak Hadir', 14, startY);

            // === Gabungkan data siswa menjadi satu array dua kolom ===
            const combinedSiswa = [];
            for (let i = 0; i < 14; i++) {
                const left = siswa[i] || { id: '', nama: '', keterangan: '' };
                const right = siswa[i + 14] || { id: '', nama: '', keterangan: '' };

                combinedSiswa.push([
                    i + 1,
                    left.id ? left.id.slice(0, 2) : '',
                    left.nama || '',
                    left.keterangan ? left.keterangan.slice(0, 1) : '',
                    i + 21,
                    right.id ? right.id.slice(0, 2) : '',
                    right.nama || '',
                    right.keterangan ? right.keterangan.slice(0, 1) : '',
                ]);
            }

            // === Judul tabel siswa ===
            doc.text('Daftar Siswa yang Tidak Hadir', 14, doc.lastAutoTable.finalY + 10);

            // === Buat tabel dua kolom siswa ===
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 15,
                head: [[
                    'No', 'Kelas', 'Nama', 'S / I / A',
                    'No', 'Kelas', 'Nama', 'S / I / A'
                ]],
                body: combinedSiswa,
                theme: 'grid',
                styles: {
                    fontSize: 9,
                    textColor: [0, 0, 0],       // teks hitam
                    lineColor: [0, 0, 0],       // border hitam
                    lineWidth: 0.1              // tebal border isi
                },
                headStyles: {
                    fillColor: [255, 255, 255], // latar putih
                    textColor: [0, 0, 0],       // teks hitam
                    lineColor: [0, 0, 0],       // border hitam
                    lineWidth: 0.1,             // tebal border header
                    fontStyle: 'bold',
                },
                tableLineColor: [0, 0, 0],    // border seluruh tabel hitam
                tableLineWidth: 0.1,          // border seluruh tabel
                margin: { left: 14, right: 14 },
            });

            // === Footer Tanda Tangan ===
            const pageHeight = doc.internal.pageSize.getHeight();
            const footerY = pageHeight - 40; // Jarak dari bawah halaman

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);

            const lokasi = 'Sumedang'; // atau bisa disesuaikan dinamis


            // === Posisi rata kanan ===
            const rightX = doc.internal.pageSize.getWidth() - 80;

            doc.text(`${lokasi}, ${tanggalNew}`, rightX, footerY);
            doc.text('Petugas Piket,', rightX, footerY + 7);
            doc.text(`${petugas}`, rightX, footerY + 35); // Nama petugas


            doc.save(`Absensi-${tanggal}-${sesi}.pdf`);
            setShowSuccess(true);
            setShowError(false);

        } catch (error) {
            setShowSuccess(false);
            setShowError(true);
        }

        setTimeout(() => {
            setShowSuccess(false);
            setShowError(false);
        }, 3000);
    };

    return (
        <button
            onClick={handleDownload}
            className="ml-2 bg-blue-100 text-blue-700 p-2 text-xl rounded-lg relative"
        >
            <MdOutlineFileDownload />
            <AnimatePresence>
                {(showSuccess || showError) && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 0, scale: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className='absolute ml-10 w-50 top-0'
                    >
                        <div className={`flex items-center gap-2 p-2 rounded-lg text-sm
                        ${showSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {showSuccess ? <FiCheck className="mt-1" /> : '❌'}
                            <span>
                                {showSuccess ? 'Download File Berhasil!' : 'Gagal mendownload file.'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default ButtonDownloadALl;
