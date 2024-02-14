"use client"

import "jsvectormap/dist/css/jsvectormap.css"
import "flatpickr/dist/flatpickr.min.css"
import "@/styles/css/satoshi.css"
import "@/styles/css/style.css"
import React, { useEffect, useState } from "react"
import { Viewport } from 'next'
// import Loader from "@/components/common/Loader"
import { useLogin } from "@/hooks/useLogin"
import ClientCommons from './ClientCommons'
// import Head from 'next/head'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // const [loading, setLoading] = useState<boolean>(true)
  // const { token } = useLogin()
  // const pathname = usePathname();

  // useEffect(() => {
  //   // setLoading(false)
  //   // setTimeout(() => setLoading(false), 1000);
  // }, [])

  return (
    <html lang="en">
      <head>
        <title>TourAbi Admin Panel</title>
        <meta name='description' content='TourAbi Admin Panel - The world&apos;s best tour portal' />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48" />
      </head>
      <body suppressHydrationWarning={true} 
        className='bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200'>
          <ClientCommons />
          {children}
        {/* <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div> */}
      </body>
    </html>
  )
}
