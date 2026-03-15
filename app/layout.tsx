import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MCPHubz Sandbox — WebMCP Template Builder',
    template: '%s — MCPHubz Sandbox',
  },
  description: 'Build, preview, and deploy WebMCP templates for any website category. The fastest way to make your site AI-agent ready.',
  metadataBase: new URL('https://mcphubz.online'),
  openGraph: {
    siteName: 'MCPHubz Sandbox',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
