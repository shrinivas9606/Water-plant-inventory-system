'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

type Product = {
  id: string
  name: string
}

export default function AddProductionPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('id, name')
      if (data) setProducts(data)
    }

    fetchProducts()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // 1. Get BOM materials
    const { data: bomItems, error: bomError } = await supabase
      .from('product_materials')
      .select(`
        material_id,
        quantity_per_unit,
        raw_materials (
          id,
          current_stock
        )
      `)
      .eq('product_id', productId)

    if (bomError || !bomItems) {
      alert('BOM not found for this product')
      return
    }

    // 2. Check stock availability
    for (const item of bomItems) {
      const material = item.raw_materials[0]
      const requiredQty =
        item.quantity_per_unit * quantity     

      if (material.current_stock < requiredQty) {
        alert(
          `Not enough stock for material. Required: ${requiredQty}`
        )
        return
      }
    }

    // 3. Deduct raw materials
    for (const item of bomItems) {
      const material = item.raw_materials[0]
      const requiredQty =
        item.quantity_per_unit * quantity

      const newStock =
        material.current_stock - requiredQty

      await supabase
        .from('raw_materials')
        .update({
          current_stock: newStock,
        })
        .eq('id', material.id)
    }

    // 4. Insert production order
    const { error: prodError } = await supabase
      .from('production_orders')
      .insert({
        product_id: productId,
        quantity_produced: quantity,
        status: 'completed',
      })

    if (prodError) {
      alert(prodError.message)
      return
    }

    // 5. Update product stock
    const { data: stockData } = await supabase
      .from('product_stock')
      .select('*')
      .eq('product_id', productId)
      .single()

    if (stockData) {
      // Update existing stock
      await supabase
        .from('product_stock')
        .update({
          quantity:
            stockData.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', stockData.id)
    } else {
      // Create new stock record
      await supabase
        .from('product_stock')
        .insert({
          product_id: productId,
          quantity: quantity,
        })
    }

    router.push('/production')
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow w-96 text-gray-900"
        >
          <h2 className="text-2xl font-bold mb-4">
            New Production Order
          </h2>

          <select
            className="w-full mb-3 p-2 border rounded"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Select Product</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity Produced"
            className="w-full mb-3 p-2 border rounded"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Create Production
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
