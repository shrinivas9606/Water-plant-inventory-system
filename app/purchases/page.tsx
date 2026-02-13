'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([])

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data } = await supabase
        .from('purchases')
        .select(`
          id,
          quantity,
          total_amount,
          purchase_date,
          due_date,
          amount_paid,
          status,
          vendors(name),
          raw_materials(name)
        `)
        .order('purchase_date', { ascending: false })

      if (data) setPurchases(data)
    }

    fetchPurchases()
  }, [])

  const handlePay = async (purchase: any) => {
    const amount = prompt('Enter payment amount')

    if (!amount) return

    const payAmount = Number(amount)
    const newPaid = purchase.amount_paid + payAmount

    let status = 'unpaid'
    if (newPaid === purchase.total_amount) status = 'paid'
    else if (newPaid > 0) status = 'partial'

    const { error } = await supabase
      .from('purchases')
      .update({
        amount_paid: newPaid,
        status,
      })
      .eq('id', purchase.id)

    if (error) {
      alert(error.message)
    } else {
      location.reload()
    }
  }


  return (
    <AppLayout>
      <div className="p-8 text-gray-900">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Purchases</h1>
          <Link
            href="/purchases/add"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Purchase
          </Link>
        </div>

        <table className="w-full border text-gray-900">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Material</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Paid</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td className="p-2 border">
                  {p.raw_materials?.name}
                </td>
                <td className="p-2 border">
                  {p.vendors?.name}
                </td>
                <td className="p-2 border">
                  {p.quantity}
                </td>
                <td className="p-2 border">
                  ₹{p.total_amount}
                </td>
                <td className="p-2 border">
                  ₹{p.amount_paid}
                </td>
                <td className="p-2 border">
                  {p.due_date}
                </td>
                <td className="p-2 border">
                  {p.status}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handlePay(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
