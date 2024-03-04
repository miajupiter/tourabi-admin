/* eslint-disable react-hooks/exhaustive-deps */
"use client"

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
import { ListPageTable, TdTitleAndImage, TdActivePassive } from '@/aliabi/Table'
import { getList } from '@/lib/fetch'


const LocationsPage = () => {
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
    getList(`/admin/locations?page=${pageNo}`, token)
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
        <title>{`${t('Locations')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Locations page for TourAbi Admin Panel" />
      </Head>
      <PageHeader
        pageTitle={t('Locations')}
        breadcrumbList={[
          { href: '/dashboard', pageTitle: 'Dashboard' },
          { href: '/locations', pageTitle: 'Locations' }
        ]}
        icon={(<i className="fa-solid fa-mountain-city"></i>)}
      />
      <div className="flex flex-col gap-10">
        <ListPageTable
          docs={docs} page={pageNo} pageCount={pageCount} pageSize={pageSize} totalDocs={totalDocs}
          rowEditButton={{ href: `/locations/edit/{_id}` }}
          addNewButton={{ href: `/locations/new` }}
          theadTrTdClassName='text-start'
          onRenderRow={(tr, colItem, colIndex, rowIndex) => <>
            {colIndex == 0 && <TdTitleAndImage title={tr.title} images={tr.images} />}
            {colIndex == 1 && <>
              <p className="text-black dark:text-white">
                {tr.destination && tr.destination.title || ''} {tr.country || ''}
              </p>
            </>}
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

export default LocationsPage
