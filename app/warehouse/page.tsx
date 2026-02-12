'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'

type StockItem = {
  id: string
  quantity: number
  products: {
    name: string
  }
  warehouses: {
    name: string
  }
}

export default function WarehousePage() {
  const [stock, setStock] = useState<StockItem[]>([])

  const fetchStock = async () => {
    const { data, error } = await supabase
      .from('product_stock')
      .select(`
        id,
        quantity,
        products ( name ),
        warehouses ( name )
      `)

    if (!error && data) {
      setStock(data as any)
    }
  }

  useEffect(() => {
    fetchStock()
  }, [])

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Warehouse Stock
          </h1>

          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-2 border text-left">Product</th>
                <th className="p-2 border text-left">Warehouse</th>
                <th className="p-2 border text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">
                    {item.products?.name}
                  </td>
                  <td className="p-2 border">
                    {item.warehouses?.name}
                  </td>
                  <td className="p-2 border">
                    {item.quantity}
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
