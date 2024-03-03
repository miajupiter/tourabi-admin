/* eslint-disable react-hooks/exhaustive-deps */
"use client"

// import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
// import DestinationList from "./DestinationList"
import PageHeader from '@/components/PageHeader'
import aliabiConfig from 'aliabi'

import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Pagination from '@/components/Pagination'
import TableRowButtons, { TableRowButtonsProps } from '../../../components/TableRowButtons'
import UserRoleEmojiStyle from './UserRoleEmojiStyle'
import { getList } from '@/lib/fetch'
import { useLogin } from '@/hooks/useLogin'
import { ListPageTable, TdActivePassive, TdTitleAndImage } from '@/components/Table'


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
          onRenderRow={(tr, colItem, colIndex, rowIndex) => <>
            {colIndex == 0 && <>
              <h5 className="ms-2 font-medium text-black dark:text-slate-100">
                {tr.title}
              </h5>
              {tr.image &&
                <div className='flex justify-start mt-2'>
                  <div key={colIndex} className='h-14 max-w-26 mx-1'>
                    <Image className='aspect-square rounded-full' src={tr.image || ''} alt="alt" width={72} height={72} />
                  </div>
                </div>}
            </>}
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

export default UsersPage
