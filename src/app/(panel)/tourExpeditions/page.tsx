/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import PageHeader from '@/components/others/PageHeader'
import aliabiConfig from 'aliabi'
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useEffect, useState } from 'react'

import { useLogin } from '@/hooks/useLogin'

import ExpeditionsTable from './ExpeditionsTable'

const TourExpeditionsPage = () => {
  const { token } = useLogin()
  const { t } = useLanguage()
  
   


  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])


  return (
    <>
      <Head>
        <title>{`${t('Tour Expeditions')} - ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is TourExpeditions page for TourAbi Admin Panel" />
      </Head>
      <PageHeader
        pageTitle={t('Tour Expeditions')}
        breadcrumbList={[
          { href: '/dashboard', pageTitle: 'Dashboard' },
          { href: '/tourExpeditions', pageTitle: 'Tour Expeditions' }
        ]}
        icon={(<i className="fa-solid fa-hotel"></i>)}
      />
      <div className="flex flex-col gap-10">
       <ExpeditionsTable  />
      </div>
    </>
  )
}

export default TourExpeditionsPage
