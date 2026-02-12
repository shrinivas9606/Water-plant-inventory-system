'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/AppLayout'
import html2pdf from 'html2pdf.js'


type Invoice = {
  id: string
  created_at: string
  customers: {
    name: string
  }
  invoice_number: string
}

type Item = {
  quantity: number
  price: number
  products: {
    name: string
  }
}

export default function InvoicePage() {
    const [company, setCompany] = useState<any>(null)
  const params = useParams()
  const id = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const fetchInvoice = async () => {

      // Fetch company settings
        const { data: companyData } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .single()

        if (companyData) setCompany(companyData)
        
      // Fetch order
      const { data: order } = await supabase
        .from('sales_orders')
        .select('id, created_at, invoice_number, customers(name)')
        .eq('id', id)
        .single()

      if (order) setInvoice(order as any)

      // Fetch items
      const { data: itemData } = await supabase
        .from('sales_order_items')
        .select('quantity, price, products(name)')
        .eq('order_id', id)

      if (itemData) setItems(itemData as any)
    }

    if (id) fetchInvoice()
  }, [id])

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )

  const gstRate = 0.18
  const cgst = subtotal * 0.09
  const sgst = subtotal * 0.09
  const grandTotal = subtotal + cgst + sgst

  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default

    const invoiceHtml = `
      <div style="font-family: Arial; padding: 20px; color: #111827; background: #ffffff;">
        <h2>${company?.name || 'Company'}</h2>
        <p>${company?.address || ''}</p>
        <p>Phone: ${company?.phone || ''}</p>
        <p>GST: ${company?.gst_number || ''}</p>

        <hr/>

        <p><strong>Invoice No:</strong> ${invoice?.invoice_number}</p>
        <p><strong>Customer:</strong> ${invoice?.customers?.name}</p>
        <p><strong>Date:</strong> ${
          invoice
            ? new Date(invoice.created_at).toLocaleDateString()
            : ''
        }</p>

        <table border="1" cellspacing="0" cellpadding="8" width="100%" style="border-collapse: collapse; margin-top: 15px; color: #111827;">
          <thead>
            <tr style="background: #f3f4f6; color: #111827;">
              <th align="left">Product</th>
              <th align="left">Quantity</th>
              <th align="left">Price</th>
              <th align="left">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
                <tr>
                  <td>${item.products?.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.quantity * item.price}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>

        <div style="margin-top:20px; text-align:right;">
          <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
          <p>CGST (9%): ₹${cgst.toFixed(2)}</p>
          <p>SGST (9%): ₹${sgst.toFixed(2)}</p>
          <h3>Grand Total: ₹${grandTotal.toFixed(2)}</h3>
        </div>
      </div>
    `

    const opt: any = {
      margin: 10,
      filename: `invoice-${invoice?.invoice_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }

    html2pdf().set(opt).from(invoiceHtml).save()
  }


  return (
  <div className="min-h-screen bg-white p-8 text-gray-900">
    <div className="pdf-safe max-w-3xl mx-auto bg-white p-8 rounded" id="invoice-content">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          {company?.logo_url && (
            <img
              src={company.logo_url}
              alt="Company Logo"
              className="h-16"
            />
          )}

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {company?.name || 'Company Name'}
            </h1>

            <p className="text-gray-600">
              {company?.address}
            </p>

            <p className="text-gray-600">
              Phone: {company?.phone}
            </p>

            <p className="text-gray-600">
              GST: {company?.gst_number}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded print:hidden"
          >
            Download PDF
          </button>

          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded print:hidden"
          >
            Print
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <p>
          <strong>Invoice No:</strong>{' '}
          {invoice?.invoice_number}
        </p>
        <p>
          <strong>Customer:</strong>{' '}
          {invoice?.customers?.name}
        </p>
        <p>
          <strong>Date:</strong>{' '}
          {invoice
            ? new Date(invoice.created_at).toLocaleDateString()
            : ''}
        </p>
      </div>

      {/* Items Table */}
      <table className="w-full border mb-6 text-gray-900">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">
              Product
            </th>
            <th className="p-2 border text-left">
              Quantity
            </th>
            <th className="p-2 border text-left">
              Price
            </th>
            <th className="p-2 border text-left">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className="p-2 border">
                {item.products?.name}
              </td>
              <td className="p-2 border">
                {item.quantity}
              </td>
              <td className="p-2 border">
                ₹{item.price}
              </td>
              <td className="p-2 border">
                ₹{item.quantity * item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="text-right text-gray-900 space-y-1">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>CGST (9%): ₹{cgst.toFixed(2)}</p>
        <p>SGST (9%): ₹{sgst.toFixed(2)}</p>
        <p className="text-xl font-bold">
          Grand Total: ₹{grandTotal.toFixed(2)}
        </p>
      </div>
    </div>
  </div>
)
}
