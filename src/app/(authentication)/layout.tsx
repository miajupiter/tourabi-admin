"use client"
import DarkModeSwitcher from '@/components/DarkModeSwitcher'
import React, { useState, ReactNode } from "react"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className='flex h-screen flex-col w-full'>
        <div className='relative w-full'>
          <div className='absolute top-5 end-5'>
            <DarkModeSwitcher />
          </div>
        </div>
        <div className="mx-2 md:mx-auto max-w-screen-3xl my-auto p-4 py-18">
          {children}
        </div>
      </main>
    </>
  )
}
