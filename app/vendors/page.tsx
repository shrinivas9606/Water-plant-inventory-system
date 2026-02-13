'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([])

  useEffect(() => {
    const fetchVendors = async () => {
      const { data } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setVendors(data)
    }

    fetchVendors()
  }, [])

  return (
    <AppLayout>
      <div className="p-8 text-gray-900">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Vendors</h1>
          <Link
            href="/vendors/add"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Vendor
          </Link>
        </div>

        <table className="w-full border text-gray-900">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Phone</th>
              <th className="p-2 border text-left">Address</th>
              <th className="p-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td className="p-2 border">{v.name}</td>
                <td className="p-2 border">{v.phone}</td>
                <td className="p-2 border">{v.address}</td>
                <td className="p-2 border">
                  <a
                    href={`/vendors/edit/${v.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
