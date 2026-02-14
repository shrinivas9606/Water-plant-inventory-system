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

    if (!productId || quantity <= 0) {
      alert('Please select product and quantity')
      return
    }

    // 1. Get BOM items
    const { data: bomItems, error: bomError } = await supabase
      .from('product_materials')
      .select('material_id, quantity_per_unit')
      .eq('product_id', productId)

    if (bomError || !bomItems || bomItems.length === 0) {
      alert('No materials configured for this product')
      return
    }

    // 2. Check stock
    for (const item of bomItems) {
      const { data: material, error } = await supabase
        .from('raw_materials')
        .select('id, current_stock, name')
        .eq('id', item.material_id)
        .maybeSingle()

      if (error || !material) {
        alert('Material not found')
        return
      }

      const requiredQty =
        item.quantity_per_unit * quantity

      if (material.current_stock < requiredQty) {
        alert(`Not enough stock for ${material.name}`)
        return
      }
    }

    // 3. Deduct materials
    for (const item of bomItems) {
      const { data: material } = await supabase
        .from('raw_materials')
        .select('id, current_stock')
        .eq('id', item.material_id)
        .single()

      if (!material) {
        alert('Material not found')
        return
      }

      const requiredQty =
        item.quantity_per_unit * quantity

      const newStock = material.current_stock - requiredQty

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

    // 5. Update product stock (safe version)
    const { data: stockData } = await supabase
      .from('product_stock')
      .select('*')
      .eq('product_id', productId)
      .maybeSingle()

    if (stockData) {
      await supabase
        .from('product_stock')
        .update({
          quantity: stockData.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', stockData.id)
    } else {
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
