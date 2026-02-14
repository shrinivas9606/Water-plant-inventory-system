'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'

type Product = {
  id: string
  name: string
  sku: string
  unit: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <Link
              href="/products/add"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </Link>
          </div>

          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">SKU</th>
                <th className="p-2 border text-left">Unit</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td className="p-2 border">{prod.name}</td>
                  <td className="p-2 border">{prod.sku}</td>
                  <td className="p-2 border">{prod.unit}</td>
                  <td className="p-2 border">
                    <a
                      href={`/products/${prod.id}/materials`}
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Set Materials
                    </a>
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
