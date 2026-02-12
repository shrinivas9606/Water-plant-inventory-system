'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  phone: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setCustomers(data)
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return (
    <AppLayout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Customers
            </h1>
            <Link
              href="/customers/add"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Customer
            </Link>
          </div>

          <table className="w-full border">
            <thead>
              <tr>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
