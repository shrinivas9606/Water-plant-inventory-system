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

    // Step 1: Create production order
    const { data: order, error } = await supabase
        .from('production_orders')
        .insert({
        product_id: productId,
        quantity_produced: quantity,
        status: 'completed',
        })
        .select()
        .single()

    if (error) {
        alert(error.message)
        return
    }

    // Step 2: Get first warehouse
    const { data: warehouses } = await supabase
        .from('warehouses')
        .select('*')
        .limit(1)

    if (!warehouses || warehouses.length === 0) {
        alert('No warehouse found')
        return
    }

    const warehouseId = warehouses[0].id

    // Step 3: Check existing stock
    const { data: stock } = await supabase
        .from('product_stock')
        .select('*')
        .eq('product_id', productId)
        .eq('warehouse_id', warehouseId)
        .single()

    if (stock) {
        // Step 4A: Update existing stock
        await supabase
        .from('product_stock')
        .update({
            quantity: stock.quantity + quantity,
            updated_at: new Date().toISOString(),
        })
        .eq('id', stock.id)
    } else {
        // Step 4B: Create new stock record
        await supabase.from('product_stock').insert({
        product_id: productId,
        warehouse_id: warehouseId,
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
