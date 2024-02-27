"use client"

import Link from 'next/link'
import React from "react"
import { useLanguage } from '@/hooks/i18n'


const Page404 = () => {
  const { t } = useLanguage()

  // if (typeof window !== "undefined") {

  // }

  return (
    <main className='flex h-screen flex-col w-full'>

      <div className="mx-2 md:mx-auto max-w-scre11en-3xl my-auto p-4 py-4">
        <div className="flex-col align-top border rounded-[4px] w-full md:w-100 space-y-6 p-6">
          <div className="w-full text-center  text-4xl">🙈🙉🙊</div>
          <div className="w-full text-center text-5xl  text-neutral-800 dark:text-neutral-200  ">
            404
          </div>
          <div className="w-full text-center text-2xl  text-neutral-800 dark:text-neutral-200  ">
            {t('Page not found')}
          </div>

          <div className="w-full text-center pt-8">
            <Link href="javascript:history.back(1)"
              className='text-4xl border border-indigo-600 text-white px-3 py-1 rounded-md'
            >
              <i className="fa-solid fa-arrow-left-long"></i>
            </Link>

          </div>
        </div>
      </div>
    </main>

  )
}
export default Page404
