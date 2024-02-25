"use client"

import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
import TableOne from "@/widgets/Tables/TableOne"
import TableThree from "@/widgets/Tables/TableThree"
import TableTwo from "@/widgets/Tables/TableTwo"
import Head from 'next/head'
import { aliabiConfig } from 'aliabi'
import { useLanguage } from '@/hooks/i18n'
// import { Metadata } from "next"

// export const metadata: Metadata = {
//   title: "Tables | TourAbi - Admin Panel",
//   description:
//     "This is Tables page for TourAbi Admin Panel",
// }

const TablesPage = () => {
  const { t } = useLanguage()
  return (
    <>
      <Head>
        <title>{`${t('Tables')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Tables page for TourAbi Admin Panel" />
      </Head>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  )
}

export default TablesPage
