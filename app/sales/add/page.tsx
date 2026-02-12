'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'

type Customer = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
}

export default function AddSalesPage() {
  const router = useRouter()
  const [price, setPrice] = useState(0)

  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const { data: custData } = await supabase
        .from('customers')
        .select('id, name')

      const { data: prodData } = await supabase
        .from('products')
        .select('id, name')

      if (custData) setCustomers(custData)
      if (prodData) setProducts(prodData)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { data: stock } = await supabase
      .from('product_stock')
      .select('*')
      .eq('product_id', productId)
      .single()

    if (!stock || stock.quantity < quantity) {
      alert('Not enough stock')
      return
    }

    const { data: order, error: orderError } = await supabase
      .from('sales_orders')
      .insert({
        customer_id: customerId,
        status: 'completed',
      })
      .select()
      .single()

    if (orderError) {
      alert(orderError.message)
      return
    }

    await supabase.from('sales_order_items').insert({
      order_id: order.id,
      product_id: productId,
      quantity: quantity,
      price: price,
    })

    await supabase
      .from('product_stock')
      .update({
        quantity: stock.quantity - quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stock.id)

    router.push('/sales')
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            New Sales Order
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Customer */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Product */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              className="w-full mb-4 p-2 border rounded text-gray-900 bg-white"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Quantity */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            {/* Price */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Unit
            </label>
            <input
              type="number"
              className="w-full mb-6 p-2 border rounded text-gray-900 bg-white"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded"
            >
              Create Sales Order
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
