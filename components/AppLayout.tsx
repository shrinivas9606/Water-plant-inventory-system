'use client'

import Sidebar from './Sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  )
}

