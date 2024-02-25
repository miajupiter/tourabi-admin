import Calendar from "@/widgets/Calender"
import Head from 'next/head'
import { aliabiConfig } from 'aliabi'
import { useLanguage } from '@/hooks/i18n'

const CalendarPage = () => {
  const { t } = useLanguage()
  return (
    <>
      <Head>
        <title>{`${t('Calender')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Calender page for TourAbi Admin Panel" />
      </Head>

      <Calendar />
    </>

  )
}

export default CalendarPage
