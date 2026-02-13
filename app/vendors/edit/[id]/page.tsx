'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

export default function EditVendorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    const fetchVendor = async () => {
      const { data } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setName(data.name)
        setPhone(data.phone || '')
        setAddress(data.address || '')
      }
    }

    if (id) fetchVendor()
  }, [id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase
      .from('vendors')
      .update({
        name,
        phone,
        address,
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      router.push('/vendors')
    }
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen text-gray-900">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6">
            Edit Vendor
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <label className="block mb-1">
              Vendor Name
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Phone */}
            <label className="block mb-1">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* Address */}
            <label className="block mb-1">
              Address
            </label>
            <textarea
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Update Vendor
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
