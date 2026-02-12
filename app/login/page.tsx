'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-96 text-gray-900"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded text-gray-900 bg-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded text-gray-900 bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-3 text-sm text-gray-700">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 font-medium">
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}
