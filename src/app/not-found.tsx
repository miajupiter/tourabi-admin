"use client"

import Link from 'next/link'
import React from "react"
import { useLanguage } from '@/hooks/i18n'
import { useRouter } from 'next/navigation'

const Page404 = () => {
  const { t } = useLanguage()
  const { back}=useRouter()
  return (
    <main className='flex h-screen flex-col w-full'>

      <div className="mx-2 md:mx-auto max-w-screen-3xl my-auto p-4 py-18">
        <div className="flex-col align-top border rounded-[4px] w-[300px] max-w-screen-3xl space-y-6 p-6">
          <div className="w-full text-center  text-4xl">🙈🙉🙊</div>
          <div className="w-full text-center text-5xl  text-neutral-800 dark:text-neutral-200  ">
            404
          </div>
          <div className="w-full text-center text-2xl  text-neutral-800 dark:text-neutral-200  ">
            {t('Page not found')}
          </div>
          <div className="w-full text-center pt-8">
            <Link href="#" onClick={() => back()} className='text-4xl' >⬅️</Link>
          </div>

        </div>
      </div>
    </main>

  )
}
export default Page404
