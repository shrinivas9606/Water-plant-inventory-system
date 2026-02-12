import './globals.css'
import { RoleProvider } from '@/context/RoleContext'
import AuthGuard from '@/components/AuthGuard'

export const metadata = {
  title: 'Water Bottle Plant System',
  description: 'Inventory and warehouse system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-gray-100 text-gray-900">
        <RoleProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </RoleProvider>
      </body>
    </html>
  )
}
