import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Premium UI — MCP-First Component Library',
  description:
    'Production-grade React component library with 150 premium blocks, 55 themes, Framer Motion animations, and MCP protocol support for AI agents.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="slate" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
