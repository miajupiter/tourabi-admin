"use client"

import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
import UserList from "./UserList"
import aliabiConfig from 'aliabi'

import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useEffect } from 'react'
import PageHeader from '../PageHeader'


const UsersPage = () => {
  const {t}=useLanguage()
  useEffect(()=>{

  },[t])
  return (
    <>
      <Head>
        <title>{`${t('Users')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Users page for TourAbi Admin Panel" />
      </Head>
      <PageHeader pageTitle={t('Users')} breadcrumbList={[
        { href: '/dashboard', pageTitle: t('Dashboard') },
        { href: '/users', pageTitle: t('Users') }
      ]} />
      <div className="flex flex-col gap-10">
        <UserList />
      </div>
    </>
  )
}

export default UsersPage
