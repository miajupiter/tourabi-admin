/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import PageHeader from '@/components/PageHeader'
import aliabiConfig from 'aliabi'
import Image from "next/image"
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Pagination from '@/aliabi/Pagination'
import TableRowButtons, { TableRowButtonsProps } from '@/aliabi/TableRowButtons'
import { ImageItemProps } from '@/aliabi/ImageListWidget'
import ListPageTable from '@/aliabi/Table/ListPageTable'
import { TdActivePassive, TdTitleAndImage } from '@/aliabi/Table/SomeTableComponents'
import { getList } from '@/lib/fetch'
import { useLogin } from '@/hooks/useLogin'


const AccommodationsPage = () => {
  const {token} = useLogin()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])
  const { t } = useLanguage()

  const getListData = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    getList(`/admin/accommodations?page=${pageNo}`, token)
      .then((data) => {
        setDocs(data.docs)
        setPageCount(data.pageCount)
        setPageSize(data.pageSize)
        setTotalDocs(data.totalDocs)
      })
      .catch(err => alert(err))
  }

  
  useEffect(() => {
      getListData(pageNo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo])


  return (
    <>
      <Head>
        <title>{`${t('Accommodations')} - ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Accommodations page for TourAbi Admin Panel" />
      </Head>
      <PageHeader
        pageTitle={t('Accommodations')}
        breadcrumbList={[
        { href: '/dashboard', pageTitle: 'Dashboard' },
        { href: '/accommodations', pageTitle: 'Accommodations' }
      ]}
      icon={(<i className="fa-solid fa-hotel"></i>)}
      />
     <div className="flex flex-col gap-10">
        <ListPageTable
          docs={docs} page={pageNo} pageCount={pageCount} pageSize={pageSize} totalDocs={totalDocs}
          rowEditButton={{ href: `/accommodations/edit/{_id}` }}
          addNewButton={{ href: `/accommodations/new`}}
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

export default AccommodationsPage
