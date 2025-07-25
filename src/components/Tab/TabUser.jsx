'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Storage from '../Progres/Storage';

const TabUser = () => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            router.push('/')
        } else {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        router.push('/')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Memuat...</p>
            </div>
        )
    }

    // Jika belum login, tahan render (opsional tambahan)
    if (!user) return null

    return (
        <div className="p-6 flex flex-col">
            {/* Header */}
            {/* <div className="flex items-center justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-500 text-4xl" />
                </div>
            </div> */}

            {/* Data Pengguna - Tampilan Kolom */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 flex-grow mb-5">
                {/* nama */}
                {/* <h1 className="text-2xl font-bold text-center text-gray-800">
                    {user.nama}
                </h1> */}

                <div className="space-y-4">
                    {/* ID Pengguna */}
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">ID Pengguna</p>
                        <p className="p-3 bg-gray-50 rounded-lg">
                            {user.id}
                        </p>
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="p-3 bg-gray-50 rounded-lg">
                            {user.username}
                        </p>
                    </div>

                    {/* Nama Lengkap */}
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                        <p className="p-3 bg-gray-50 rounded-lg">
                            {user.nama}
                        </p>
                    </div>
                </div>
            </div>
            <Storage />
            <button onClick={handleLogout} className="bg-red-500 text-white rounded mt-5 py-3">Log Out</button>
        </div>
    );
};

export default TabUser;