'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

type Material = {
  id: string
  name: string
}

export default function ProductMaterialsPage() {
  const params = useParams()
  const productId = params.id as string

  const [materials, setMaterials] = useState<Material[]>([])
  const [bomItems, setBomItems] = useState<any[]>([])

  const [materialId, setMaterialId] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchMaterials()
    fetchBOM()
  }, [])

  const fetchMaterials = async () => {
    const { data } = await supabase
      .from('raw_materials')
      .select('id, name')

    if (data) setMaterials(data)
  }

  const fetchBOM = async () => {
    const { data } = await supabase
      .from('product_materials')
      .select(`
        id,
        quantity_per_unit,
        raw_materials ( name )
      `)
      .eq('product_id', productId)

    if (data) setBomItems(data)
  }

  const handleAddMaterial = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase
      .from('product_materials')
      .insert({
        product_id: productId,
        material_id: materialId,
        quantity_per_unit: quantity,
      })

    if (error) {
      alert(error.message)
    } else {
      setMaterialId('')
      setQuantity(1)
      fetchBOM()
    }
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen text-gray-900">
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            Product Materials (BOM)
          </h1>

          {/* Add Material Form */}
          <form
            onSubmit={handleAddMaterial}
            className="flex gap-4 mb-6"
          >
            <select
              className="border p-2 rounded flex-1"
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              required
            >
              <option value="">Select Material</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border p-2 rounded w-32"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
              placeholder="Qty"
              required
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 rounded"
            >
              Add
            </button>
          </form>

          {/* BOM Table */}
          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-2 border text-left">
                  Material
                </th>
                <th className="p-2 border text-left">
                  Qty per product
                </th>
              </tr>
            </thead>
            <tbody>
              {bomItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">
                    {item.raw_materials?.name}
                  </td>
                  <td className="p-2 border">
                    {item.quantity_per_unit}
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
