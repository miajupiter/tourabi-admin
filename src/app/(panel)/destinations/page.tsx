/* eslint-disable react-hooks/exhaustive-deps */
"use client"

// import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
// import DestinationList from "./DestinationList"
import PageHeader from '@/components/PageHeader'
import aliabiConfig from 'aliabi'
import Image from "next/image"
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Pagination from '@/aliabi/Pagination'
import TableRowButtons, { TableRowButtonsProps } from '../../../aliabi/TableRowButtons'
import { useLogin } from '@/hooks/useLogin'
import { getList } from '@/lib/fetch'
import { ListPageTable, TdActivePassive, TdTitleAndImage } from '@/aliabi/Table'


const DestinationsPage = () => {
  const { token } = useLogin()
  const [pullData, setPullData] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])
  const { t } = useLanguage()

  const getListData = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    getList(`/admin/destinations?page=${pageNo}`, token)
      .then((data) => {
        setDocs(data.docs)
        setPageCount(data.pageCount)
        setPageSize(data.pageSize)
        setTotalDocs(data.totalDocs)
      })
      .catch(err => alert(err))
  }



  useEffect(() => {
    // if (!pullData) {
    // setPullData(true)
    getListData(pageNo)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo])


  return (
    <>
      <Head>
        <title>{`${t('Destinations')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Destinations page for TourAbi Admin Panel" />
      </Head>
      <PageHeader
        pageTitle={t('Destinations')}
        breadcrumbList={[
          { href: '/dashboard', pageTitle: 'Dashboard' },
          { href: '/destinations', pageTitle: 'Destinations' }
        ]}
        icon={(<i className="fa-solid fa-map-location-dot"></i>)}
      />
      <div className="flex flex-col gap-10">
        <ListPageTable
          docs={docs} page={pageNo} pageCount={pageCount} pageSize={pageSize} totalDocs={totalDocs}
          rowEditButton={{ href: `/destinations/edit/{_id}`, title: 'Edit' }}
          addNewButton={{ href: `/destinations/new`, title: 'New' }}
          theadTrTdClassName='text-start'
          onRenderRow={(tr, colItem, colIndex, rowIndex) => <>
            {colIndex == 0 && <TdTitleAndImage title={tr.title} images={tr.images} />}
            {colIndex == 1 && tr.country}
            {colIndex == 2 && <TdActivePassive passive={tr.passive} />}
          </>}
          columns={['Title', 'Country', 'Passive?']}
        />
        <div className='flex mt-4 justify-center items-center'>
          <Pagination pageNo={pageNo} pageCount={pageCount}
            onPageClick={(no: number) => setPageNo(no)}
          />
        </div>
      </div>


    </>
  )
}

export default DestinationsPage
