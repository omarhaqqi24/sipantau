import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Tim Watugate',
  description: 'Website for Tim Watugate',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen font-sans">{children}</body>
    </html>
  )
}
