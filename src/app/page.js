'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiLoader, FiArrowRight } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success) {
        setUser(data.data)
        localStorage.setItem('user', JSON.stringify(data.data))
        router.push('/absen')
      } else {
        setError(data.message || 'Login gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex md:hidden items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden h-screen flex flex-col justify-center"
          >
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-blue-100 p-4 rounded-full"
                >
                  <FiUser className="text-blue-600 text-2xl" />
                </motion.div>
              </div>

              <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
                Selamat Datang
              </h1>
              <p className="text-sm text-gray-500 text-center mb-6">
                Silakan masuk dengan akun petugas piket Anda
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center"
                >
                  <FiLock className="mr-2" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  <div className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="mr-2"
                        >
                          <FiLoader />
                        </motion.span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        Masuk
                        <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>
            </div>

            <div className="bg-white px-8 py-4 border-t border-gray-100 fixed bottom-0 w-full">
              <p className="text-xs text-gray-500 text-center">
                © 2023 hamdunmuzadi. All rights reserved.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}