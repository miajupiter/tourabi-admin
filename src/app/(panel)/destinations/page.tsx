"use client"

import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
import DestinationList from "./DestinationList"
import aliabiConfig from 'aliabi'

import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useEffect } from 'react'


const DestinationsPage = () => {
  const {t}=useLanguage()
  useEffect(()=>{

  },[t])
  return (
    <>
      <Head>
        <title>{`${t('Destinations')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Destinations page for TourAbi Admin Panel" />
      </Head>
      <Breadcrumb pageName={t('Destinations')} />
      <div className="flex flex-col gap-10">
        <DestinationList />
      </div>
    </>
  )
}

export default DestinationsPage
