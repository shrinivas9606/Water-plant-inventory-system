'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

type SalesOrder = {
  id: string
  status: string
  created_at: string
  customers: {
    name: string
  }
}

export default function SalesPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('sales_orders')
      .select(`
        id,
        status,
        created_at,
        customers ( name )
      `)
      .order('created_at', { ascending: false })

    if (data) setOrders(data as any)
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
              Sales Orders
            </h1>
            <Link
              href="/sales/add"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              New Sale
            </Link>
          </div>

          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-2 border text-left">Customer</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-2 border">
                    {order.customers?.name}
                  </td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <Link
                      href={`/sales/invoice/${order.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Invoice
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
