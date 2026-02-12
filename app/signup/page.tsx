'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSignup = async (e: any) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        role: 'admin',
      })
    }

    router.push('/dashboard')
  }

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      className="bg-white p-8 rounded shadow w-96 text-gray-900"
      onSubmit={handleSignup}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign Up</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full mb-3 p-2 border rounded text-gray-900 bg-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        Sign Up
      </button>

      <p className="mt-3 text-sm text-gray-700">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-medium">
            Login
          </a>
        </p>
    </form>
  </div>
)
}
