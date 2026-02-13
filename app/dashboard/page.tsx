'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
// import { getUserRole } from '@/lib/getUserRole'

export default function Dashboard() {
  const router = useRouter()

  const [stats, setStats] = useState({
    materials: 0,
    products: 0,
    warehouses: 0,
    productionOrders: 0,
  })

  const [lowStock, setLowStock] = useState<any[]>([])
  const [duePayments, setDuePayments] = useState<any[]>([])

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      const { data: userData } = await supabase.auth.getUser()

      // const role = await getUserRole()

      // if (!role) {
      //   router.push('/login')
      //   return
      // }

      // Fetch counts
      const { count: materials } = await supabase
        .from('raw_materials')
        .select('*', { count: 'exact', head: true })

      const { count: products } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      const { count: warehouses } = await supabase
        .from('warehouses')
        .select('*', { count: 'exact', head: true })

      const { count: productionOrders } = await supabase
        .from('production_orders')
        .select('*', { count: 'exact', head: true })

      setStats({
        materials: materials || 0,
        products: products || 0,
        warehouses: warehouses || 0,
        productionOrders: productionOrders || 0,
      })

      // Fetch low stock materials
      const { data: lowStockData } = await supabase
      .from('raw_materials')
      .select('*')
      
      if (lowStockData) {
        const filtered = lowStockData.filter(
          (item) => item.current_stock < item.min_stock
        )
        setLowStock(filtered)
      }

      // Due payments
      const { data: duePurchases } = await supabase
        .from('purchases')
        .select(`
          id,
          total_amount,
          amount_paid,
          due_date,
          vendors(name)
        `)
        .neq('status', 'paid')

        if (duePurchases) setDuePayments(duePurchases)

    }

    checkUserAndLoadData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Raw Materials</h2>
            <p className="text-2xl font-bold text-gray-900">
              {stats.materials}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Products</h2>
            <p className="text-2xl font-bold text-gray-900">
              {stats.products}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Warehouses</h2>
            <p className="text-2xl font-bold text-gray-900">
              {stats.warehouses}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Production Orders</h2>
            <p className="text-2xl font-bold text-gray-900">
              {stats.productionOrders}
            </p>
          </div>
        </div>

        {/* Low Stock Alert Section */}
        {lowStock.length > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 p-4 rounded">
            <h2 className="text-lg font-bold text-red-700 mb-3">
              Low Stock Alerts
            </h2>

            <table className="w-full border">
              <thead>
                <tr>
                  <th className="p-2 border text-left">Material</th>
                  <th className="p-2 border text-left">Current</th>
                  <th className="p-2 border text-left">Minimum</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border text-red-600 font-bold">
                      {item.current_stock}
                    </td>
                    <td className="p-2 border">{item.min_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {duePayments.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-300 p-4 rounded">
            <h2 className="text-lg font-bold text-yellow-800 mb-3">
              Payment Due Alerts
            </h2>

            <table className="w-full border">
              <thead>
                <tr>
                  <th className="p-2 border text-left">Vendor</th>
                  <th className="p-2 border text-left">Balance</th>
                  <th className="p-2 border text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {duePayments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-2 border">
                      {p.vendors?.name}
                    </td>
                    <td className="p-2 border font-bold text-red-600">
                      ₹{p.total_amount - p.amount_paid}
                    </td>
                    <td className="p-2 border">
                      {p.due_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
