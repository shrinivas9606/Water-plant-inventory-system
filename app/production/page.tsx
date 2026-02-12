'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'

type ProductionOrder = {
  id: string
  quantity_produced: number
  status: string
  created_at: string
  products: {
    name: string
  }
}

export default function ProductionPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('production_orders')
      .select(`
        id,
        quantity_produced,
        status,
        created_at,
        products ( name )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data as any)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Production Orders
            </h1>
            <Link
              href="/production/add"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              New Production
            </Link>
          </div>

          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-2 border text-left">Product</th>
                <th className="p-2 border text-left">Quantity</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-2 border">
                    {order.products?.name}
                  </td>
                  <td className="p-2 border">
                    {order.quantity_produced}
                  </td>
                  <td className="p-2 border">
                    {order.status}
                  </td>
                  <td className="p-2 border">
                    {new Date(order.created_at).toLocaleDateString()}
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
