"use client"

import React, {useEffect} from 'react'
import ECommerce from "@/widgets/Dashboard/E-commerce"
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import aliabiConfig from 'aliabi'


const DashboardPage = () => {
  const {t}=useLanguage()
 
  return (
    <>
      <Head>
        <title content={`Dashboard | ${aliabiConfig.title}`} />
        <meta name='description' content='This is  Dashboard page for TourAbi Admin Panel' />
      </Head>
      <ECommerce />
    </>
  )
}

export default DashboardPage
