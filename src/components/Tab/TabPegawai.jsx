import { FiUsers } from "react-icons/fi";

const TabPegawai = () => {
    return (
        <div className="p-6 flex h-full justify-center items-center rounded-xl">
            <div className="flex flex-col items-center text-center py-8 px-4">
                <div className="mb-5 p-4 bg-blue-100 rounded-full">
                    <svg
                        className="w-10 h-10 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        ></path>
                    </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    {/* <FiUsers className="text-blue-500" /> */}
                    Absen Guru Dan Kayawan  
                </h2>

                <p className="text-gray-600 mb-6">
                    Fitur ini sedang dalam proses pengembangan
                </p>

                <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                        style={{ width: '45%' }}
                    ></div>
                </div>

                <p className="mt-4 text-sm text-gray-500 flex items-center gap-1">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    Estimasi rilis: Q4 2025
                </p>
            </div>
        </div>
    );
};

export default TabPegawai;