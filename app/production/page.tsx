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
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const fetchOrders = async () => {
    let query = supabase
      .from('production_orders')
      .select(`
        id,
        quantity_produced,
        status,
        created_at,
        products ( name )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (fromDate) {
      query = query.gte('created_at', fromDate)
    }

    if (toDate) {
      // add end-of-day time for proper range
      query = query.lte('created_at', toDate + 'T23:59:59')
    }

    const { data, error } = await query

    if (!error && data) {
      setOrders(data as any)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleFilter = () => {
    fetchOrders()
  }

  const handleClear = () => {
    setFromDate('')
    setToDate('')
    fetchOrders()
  }

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded shadow">

          {/* Header */}
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

          {/* Filters */}
          <div className="flex gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                className="border p-2 rounded text-gray-900"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                className="border p-2 rounded text-gray-900"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <button
              onClick={handleFilter}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Filter
            </button>

            <button
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>

          {/* Table */}
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
