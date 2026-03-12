import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import ClientAOSProvider from '@/components/ClientAOSProvider'
import VisitorTracker from '@/components/VisitorTracker'
import './globals.css'

export const viewport = 'width=device-width, initial-scale=1'

export const metadata: Metadata = {
  title: 'Nicolas Ménard - Product Designer',
  description: 'Product Designer with 10+ years of experience building user-centered products.',
  keywords: 'Product Designer, Design Systems, User Experience, Portfolio, UI Design, User Research',
  authors: [{ name: 'Nicolas Ménard' }],
  openGraph: {
    title: 'Nicolas Ménard - Product Designer',
    description: 'Product Designer with 10+ years of experience building user-centered products. Results-driven and engineering-oriented, with experience conducting user research and leading small design teams.',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dk6j5aucm/image/upload/v1758400312/meta_lrcned.png',
        width: 1200,
        height: 630,
        alt: 'Nicolas Ménard - Product Designer Portfolio',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        
        {/* Font preloading for better LCP */}
        <link rel="preload" href="/pp-neue-montreal/ppneuemontreal-book.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/pp-neue-montreal/ppneuemontreal-medium.otf" as="font" type="font/otf" crossOrigin="anonymous" />

        {/* Space Grotesk variable font — used for animated nav wordmark */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <ClientAOSProvider>
          {children}
        </ClientAOSProvider>
        <SpeedInsights />
        <Analytics />
        <VisitorTracker />
      </body>
    </html>
  )
}