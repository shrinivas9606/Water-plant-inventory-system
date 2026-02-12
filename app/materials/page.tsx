'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'


type Material = {
  id: string
  name: string
  unit: string
  current_stock: number
  min_stock: number
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('raw_materials')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setMaterials(data)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  return (
    <AppLayout>
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Raw Materials
          </h1>
          <Link
            href="/materials/add"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Material
          </Link>
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Unit</th>
              <th className="p-2 border text-left">Current Stock</th>
              <th className="p-2 border text-left">Min Stock</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr
                key={mat.id}
                className={
                  mat.current_stock < mat.min_stock
                    ? 'bg-red-50'
                    : ''
                }
              >
                <td className="p-2 border">{mat.name}</td>
                <td className="p-2 border">{mat.unit}</td>
                <td className="p-2 border">{mat.current_stock}</td>
                <td className="p-2 border">{mat.min_stock}</td>
                <td className="p-2 border">
                  <Link
                    href={`/materials/edit/${mat.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AppLayout>
  )
}
