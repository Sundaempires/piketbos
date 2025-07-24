import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const PopupSucces = ({ showSuccess, successMessage, result }) => {


    return (
        <AnimatePresence>
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 0.6 }}
                            >
                                <FiCheckCircle className="text-green-500 text-5xl mb-4" />
                            </motion.div>

                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                Yayaay
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {successMessage}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSuccess(false)}
                                className={`px-6 py-2 rounded-lg font-medium ${result.success ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
                            >
                                OK
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PopupSucces;
