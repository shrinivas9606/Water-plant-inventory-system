'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

export default function AddMaterialPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [currentStock, setCurrentStock] = useState(0)
  const [minStock, setMinStock] = useState(0)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase.from('raw_materials').insert({
      name,
      unit,
      current_stock: currentStock,
      min_stock: minStock,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/materials')
    }
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Add Raw Material
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Material Name */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Name
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Unit */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="kg, pcs, rolls, etc."
              required
            />

            {/* Current Stock */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock
            </label>
            <input
              type="number"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={currentStock}
              onChange={(e) => setCurrentStock(Number(e.target.value))}
            />

            {/* Minimum Stock */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock
            </label>
            <input
              type="number"
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={minStock}
              onChange={(e) => setMinStock(Number(e.target.value))}
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Save Material
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
