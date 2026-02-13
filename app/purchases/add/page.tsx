'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

type Vendor = {
  id: string
  name: string
}

type Material = {
  id: string
  name: string
  unit: string
}

export default function AddPurchasePage() {
  const router = useRouter()

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  const [vendorId, setVendorId] = useState('')
  const [materialId, setMaterialId] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [rate, setRate] = useState(0)
  const [purchaseDate, setPurchaseDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id, name')

      const { data: materialData } = await supabase
        .from('raw_materials')
        .select('id, name, unit')

      if (vendorData) setVendors(vendorData)
      if (materialData) setMaterials(materialData)
    }

    fetchData()
  }, [])

  const totalAmount = quantity * rate

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const selectedMaterial = materials.find(
      (m) => m.id === materialId
    )

    const { error } = await supabase.from('purchases').insert({
      vendor_id: vendorId,
      material_id: materialId,
      quantity,
      unit: selectedMaterial?.unit,
      rate,
      total_amount: totalAmount,
      purchase_date: purchaseDate,
      due_date: dueDate,
      amount_paid: 0,
      status: 'unpaid',
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/purchases')
    }
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen text-gray-900">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Add Purchase
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Vendor */}
            <label className="block mb-1">Vendor</label>
            <select
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
            >
              <option value="">Select Vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* Material */}
            <label className="block mb-1">Material</label>
            <select
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
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

            {/* Quantity */}
            <label className="block mb-1">Quantity</label>
            <input
              type="number"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            {/* Rate */}
            <label className="block mb-1">Rate per Unit</label>
            <input
              type="number"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              required
            />

            {/* Purchase Date */}
            <label className="block mb-1">Purchase Date</label>
            <input
              type="date"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />

            {/* Due Date */}
            <label className="block mb-6">Due Date</label>
            <input
              type="date"
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Save Purchase
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
