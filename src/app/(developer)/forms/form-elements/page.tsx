import React from "react"
import FormElements from "@/widgets/FormElements"
import Head from 'next/head'
import { aliabiConfig } from 'aliabi'
import { useLanguage } from '@/hooks/i18n'

const FormElementsPage = () => {
  const { t } = useLanguage()
  return (
    <>
      <Head>
        <title>{`${t('Form Elements')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Form Elements page for TourAbi Admin Panel" />
      </Head>
      <FormElements />
    </>
  )
}

export default FormElementsPage
