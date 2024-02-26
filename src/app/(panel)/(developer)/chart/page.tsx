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
    <p>chart compoenent qwerty</p>
  </>
  )
}

export default BasicChartPage
