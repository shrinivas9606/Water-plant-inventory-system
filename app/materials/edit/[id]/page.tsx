'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

export default function EditMaterialPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [currentStock, setCurrentStock] = useState(0)
  const [minStock, setMinStock] = useState(0)

  useEffect(() => {
    const fetchMaterial = async () => {
      const { data } = await supabase
        .from('raw_materials')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setName(data.name)
        setUnit(data.unit)
        setCurrentStock(data.current_stock)
        setMinStock(data.min_stock)
      }
    }

    if (id) fetchMaterial()
  }, [id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase
      .from('raw_materials')
      .update({
        name,
        unit,
        current_stock: currentStock,
        min_stock: minStock,
      })
      .eq('id', id)

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
            Edit Material
          </h2>

          <form onSubmit={handleSubmit}>
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

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock
            </label>
            <input
              type="number"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={currentStock}
              onChange={(e) =>
                setCurrentStock(Number(e.target.value))
              }
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock
            </label>
            <input
              type="number"
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={minStock}
              onChange={(e) =>
                setMinStock(Number(e.target.value))
              }
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Update Material
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
