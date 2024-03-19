/* eslint-disable react-hooks/exhaustive-deps */
"use client"

// import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
// import DestinationList from "./DestinationList"
import PageHeader from '@/components/others/PageHeader'
import aliabiConfig from 'aliabi'

import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Pagination from '@/aliabi/Pagination'
import TableRowButtons, { TableRowButtonsProps } from '../../../aliabi/TableRowButtons'
import UserRoleEmojiStyle from './UserRoleEmojiStyle'
import { getList } from '@/lib/fetch'
import { useLogin } from '@/hooks/useLogin'
import { ListPageTable, TdActivePassive, TdTitleAndImage } from '@/aliabi/Table'


const UsersPage = () => {
  const { token } = useLogin()
  const { t } = useLanguage()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])



  const getListData = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    getList(`/admin/users?page=${pageNo}`, token)
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
        <title>{`${t('Users')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Users page for TourAbi Admin Panel" />
      </Head>
      <PageHeader
        pageTitle={t('Users')}
        breadcrumbList={[
          { href: '/dashboard', pageTitle: 'Dashboard' },
          { href: '/users', pageTitle: 'Users' }
        ]}
        icon={(<i className="fa-solid fa-users"></i>)}
      />
      <div className="flex flex-col gap-10">
        <ListPageTable
          docs={docs} page={pageNo} pageCount={pageCount} pageSize={pageSize} totalDocs={totalDocs}
          rowEditButton={{ href: `/users/edit/{_id}` }}
          addNewButton={{ href: `/users/new` }}
          theadTrTdClassName='text-start'
          // theadTrClassName='h-17 '
          onRenderRow={(tr, colItem, colIndex, rowIndex) => <>
            {colIndex == 0 && <>
              <h5 className="ms-2 font-medium text-black dark:text-slate-100">
                {tr.email}
              </h5>
              {tr.image &&
                <div className='flex justify-start'>
                  <div key={colIndex} className='h-16 max-w-26 mx-1'>
                    <Image className='aspect-square rounded-full' src={tr.image || ''} alt="alt" width={64} height={64} />
                  </div>
                </div>}
            </>}
            {colIndex == 1 && <>
              <h5 className="font-medium text-black dark:text-slate-100">
                {tr.name}
              </h5>
            <p className='text-sm'>{tr.gender} | {tr.dateOfBirth}</p>
            </>}
            {colIndex == 2 && <TdActivePassive passive={tr.passive} />}
          </>}
          columns={['Email', 'Name', 'Passive?']}
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

export default UsersPage
