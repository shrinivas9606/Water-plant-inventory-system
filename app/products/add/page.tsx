'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

export default function AddProductPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [unit, setUnit] = useState('pcs')

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase.from('products').insert({
      name,
      sku,
      unit,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/products')
    }
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Add Product
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* SKU */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU (Product Code)
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. BTL-500"
            />

            {/* Unit */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="pcs"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Save Product
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
