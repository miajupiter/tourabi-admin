"use client"

import React, { FC, useState, useEffect } from 'react'
import PageHeader from '@/components/others/PageHeader'
import { aliabiConfig } from 'aliabi'
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import Image from 'next/image'
import TableRowButtons from '@/aliabi/TableRowButtons'
import Pagination from '@/aliabi/Pagination'
import ModalOne from '@/components/others/ModalDialogs/ModalOne'
import { ListPageTable, TdTitleAndImage, TdActivePassive } from '@/aliabi/Table'
import { getList } from '@/lib/fetch'
import { useLogin } from '@/hooks/useLogin'

export interface ToursPageProps { }

const ToursPage: FC<ToursPageProps> = ({ }) => {
  const { token } = useLogin()
  const { t } = useLanguage()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])

  const [showModal, setShowModal] = useState(false)

  const getListData = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    getList(`/admin/tours?page=${pageNo}`, token)
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
        <title>{`${t('Tours')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Tours page for TourAbi Admin Panel" />
      </Head>
      <PageHeader
        pageTitle={t('Tours')}
        breadcrumbList={[
          { href: '/dashboard', pageTitle: t('Dashboard') },
          { href: '/tours', pageTitle: t('Tours') }
        ]}
        icon={(<i className='fa-solid fa-route'></i>)}
      />

      <div className="flex flex-col gap-10">
        <ListPageTable
          docs={docs} page={pageNo} pageCount={pageCount} pageSize={pageSize} totalDocs={totalDocs}
          rowEditButton={{ href: `/tours/{_id}`, title: 'Edit'}}
          addNewButton={{ href: `/tours/new`, title: 'New' }}
          theadTrTdClassName='text-start'
          onRenderRow={(tr, colItem, colIndex, rowIndex) => <>
            {colIndex == 0 && <TdTitleAndImage title={tr.title} images={tr.images} />}
            {colIndex == 1 && <>
              <p className="text-black dark:text-white">{tr.places || ''}</p>
              <div className="w-full text-sm">{tr.duration || ''} Day(s)</div>
            </>}
            {colIndex == 2 && <>
              <Link 
                href={`/tours/${tr._id}/expeditions`}
                className={`px-3 py-2 rounded-md bg-amber-800 text-white hover:bg-opacity-65`}
                title={t('Expeditions')}>
                <i className="fa-solid fa-plane-departure text-lg"></i>
              </Link>
            </>}
            {colIndex == 3 && <TdActivePassive passive={tr.passive} />}
          </>}
          columns={[t('Title'), t('Places'), t('Expeditions'), t('Passive?')]}
        />
        <div className='flex mt-4 justify-center items-center'>
          <Pagination pageNo={pageNo || 1} pageCount={pageCount || 0}
            onPageClick={(no: number) => setPageNo(no)}
          />
        </div>
      </div>
    </>
  )
}

export default ToursPage
