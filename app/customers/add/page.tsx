'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

export default function AddCustomerPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase.from('customers').insert({
      name,
      phone,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/customers')
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow w-96 text-gray-900"
        >
          <h2 className="text-2xl font-bold mb-4">
            Add Customer
          </h2>

          <input
            type="text"
            placeholder="Customer Name"
            className="w-full mb-3 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full mb-3 p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Save Customer
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
