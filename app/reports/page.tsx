'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'

export default function ReportsPage() {
  const [report, setReport] = useState({
    todayProduction: 0,
    todaySales: 0,
    totalProductStock: 0,
    totalMaterialStock: 0,
  })

  useEffect(() => {
    const fetchReport = async () => {
      const today = new Date().toISOString().split('T')[0]

      // Today production
      const { data: prodData } = await supabase
        .from('production_orders')
        .select('quantity_produced, created_at')

      const todayProduction =
        prodData
          ?.filter((p) =>
            p.created_at.startsWith(today)
          )
          .reduce(
            (sum, p) => sum + p.quantity_produced,
            0
          ) || 0

      // Today sales
      const { data: salesItems } = await supabase
        .from('sales_order_items')
        .select('quantity, sales_orders(created_at)')

      const todaySales =
        salesItems
          ?.filter((s: any) =>
            s.sales_orders?.created_at?.startsWith(today)
          )
          .reduce((sum: number, s: any) => sum + s.quantity, 0) || 0

      // Total finished goods stock
      const { data: productStock } = await supabase
        .from('product_stock')
        .select('quantity')

      const totalProductStock =
        productStock?.reduce(
          (sum, p) => sum + p.quantity,
          0
        ) || 0

      // Total raw material stock
      const { data: materialStock } = await supabase
        .from('raw_materials')
        .select('current_stock')

      const totalMaterialStock =
        materialStock?.reduce(
          (sum, m) => sum + m.current_stock,
          0
        ) || 0

      setReport({
        todayProduction,
        todaySales,
        totalProductStock,
        totalMaterialStock,
      })
    }

    fetchReport()
  }, [])

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Reports Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Today’s Production</h2>
            <p className="text-2xl font-bold text-gray-900">
              {report.todayProduction}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Today’s Sales</h2>
            <p className="text-2xl font-bold text-gray-900">
              {report.todaySales}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Finished Goods Stock</h2>
            <p className="text-2xl font-bold text-gray-900">
              {report.totalProductStock}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-gray-500">Raw Material Stock</h2>
            <p className="text-2xl font-bold text-gray-900">
              {report.totalMaterialStock}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
