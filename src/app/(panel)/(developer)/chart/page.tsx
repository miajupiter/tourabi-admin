"use client"

import React from "react"
import Head from 'next/head'
import {aliabiConfig} from 'aliabi'
import { useLanguage } from '@/hooks/i18n'


const BasicChartPage: React.FC = () => {
  const { t } = useLanguage()
  return (<>
    <Head>
      <title>{`${t('Chart')} | ${aliabiConfig.title}`}</title>
      <meta name="description" content="This is Chart page for TourAbi Admin Panel" />
    </Head>
    {/* <Chart /> */}
    <div className='w-full p-4 harita-method'>
      
      <p className='mt-10'>chart compoenent qwerty</p>
    </div>
    
  </>
  )
}

export default BasicChartPage
