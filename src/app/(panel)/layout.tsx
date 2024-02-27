"use client"

import React, { ReactNode, useState } from "react"
import Sidebar from "./Sidebar"
import Header from "@/widgets/Header"

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <Header /> */}
          <main className="w-full mx-auto max-w-screen-2xl p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
