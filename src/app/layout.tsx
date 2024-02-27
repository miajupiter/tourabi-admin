"use client"

import "@fortawesome/fontawesome-free/css/all.min.css"
import "jsvectormap/dist/css/jsvectormap.css"
import "flatpickr/dist/flatpickr.min.css"
import "@/styles/css/satoshi.css"
import "@/styles/css/style.css"
import React, { useEffect, useState } from "react"
import { Viewport } from 'next'
// import { useLogin } from "@/hooks/useLogin"
import ClientCommons from './ClientCommons'
import Head from 'next/head'
import Loader from "@/widgets/common/Loader"
import aliabiConfig from 'aliabi'

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],
  initialScale: 1,
  width: 'device-width',
  minimumScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  interactiveWidget: 'overlays-content'
}

// export const metadata: Metadata = {
//   title: "TourAbi Admin Panel",
//   description: "TourAbi Admin Panel - The world&apos;s best tour portal",
//   icons: [{
//     url: "/favicon.ico",
//     rel: "icon",
//     type: "image/x-icon",
//     sizes: "48x48",
//   }]
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    // setLoading(false)
    setTimeout(() => setLoading(false), 0)
  }, [loading])

  return (
    <html lang="en" className='dark'>
      {/* <Head>
        <title>{aliabiConfig.title}</title>
        <meta name='description' content={aliabiConfig.meta.description} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48" />
      </Head> */}
      <body suppressHydrationWarning={true}
        className='bg-white dark:bg-neutral-900 text-base  text-neutral-900 dark:text-neutral-200'>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading && <Loader />}
          {!loading && <>
            <ClientCommons />
            {children}
          </>}
        </div>
      </body>
    </html>
  )
}
