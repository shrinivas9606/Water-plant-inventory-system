
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/context/RoleContext'

type MenuItem = {
  name: string
  path: string
  roles: string[]
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'manager'] },
  { name: 'Purchases', path: '/purchases', roles: ['admin', 'manager'] },
  { name: 'Vendors', path: '/vendors', roles: ['admin', 'manager'] },
  { name: 'Raw Materials', path: '/materials', roles: ['admin', 'manager'] },
  { name: 'Products', path: '/products', roles: ['admin', 'manager'] },
  { name: 'Production', path: '/production', roles: ['admin', 'manager', 'worker'] },
  { name: 'Warehouse', path: '/warehouse', roles: ['admin', 'manager'] },
  { name: 'Customers', path: '/customers', roles: ['admin', 'manager'] },
  { name: 'Sales', path: '/sales', roles: ['admin', 'manager'] },
  { name: 'Reports', path: '/reports', roles: ['admin'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { role, loading } = useRole()

  if (loading) {
    return (
      <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Plant System</h2>

      <nav className="space-y-2">
        {menuItems
          .filter((item) => role && item.roles.includes(role))
          .map((item) => {
            const isActive = pathname.startsWith(item.path)

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2 rounded ${
                  isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
      </nav>
    </div>
  )
}
