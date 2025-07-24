"use client";

import { motion } from "framer-motion";

export default function LoadingIndicator() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                <div className="text-center space-y-1">
                    <p className="text-lg font-medium text-gray-800">Memuat data absensi</p>
                    <p className="text-sm text-gray-500">Harap tunggu sebentar...</p>
                </div>
            </motion.div>

            {/* Optional progress bar */}
            <motion.div
                className="mt-8 h-1 w-64 bg-gray-200 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
                <div className="h-full bg-blue-500 rounded-full" />
            </motion.div>
        </div>
    );
}