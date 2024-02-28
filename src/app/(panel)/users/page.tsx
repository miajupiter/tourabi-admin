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


const UsersPage = () => {
  const { t } = useLanguage()
  const [pullData, setPullData] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])


  const getList = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/users?page=${sayfaNo}&pageSize=${pageSize}`, {
      headers: {
        'Content-Type': 'application/json',
        token: token
      }
    })
      .then(ret => ret.json())
      .then((result: any) => {
        if (result && result.data) {
          setPageCount(result.data.pageCount as number)
          setTotalDocs(result.data.totalDocs as number)
          setDocs(result.data.docs)
        } else {
          setPageCount(1)
          setTotalDocs(0)
          setDocs([])
        }
      }).catch(console.error)
  }

  const removeItem = (item: any) => {
    if (!confirm(t(`${item.name}\n${item.email}\nDo you want to delete?`)))
      return
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/users/${item._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', token: token }
    })
      .then(ret => ret.json())
      .then((result: any) => {
        if (result.success) {
          getList(pageNo)
        } else {
          alert(result.error)
        }
      }).catch(console.error)
  }

  const ItemList =() => {
    return (
      <div className="rounded-sm border border-strokepx-5 pb-2.5 pt-6 shadow-default dark:border-strokedark bg0slate-100 dark:bg-[#0b1121] sm:px-7.5 xl:pb-1">
        <div className="max-w-full ">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-green-700 text-left dark:bg-green-700  text-slate-100 dark:text-slate-100">
                <th className="px-2 py-2 font-medium xl:pl-7">
                  {t('Name')}
                </th>
                <th className="px-2 py-2 font-medium">
                  {t('Email')}
                </th>
                <th className="min-w-[100px] px-2 py-2 font-medium text-center">
                  {t('Role?')}
                </th>
                <th className="min-w-[100px] px-2 py-2 font-medium text-center">
                  {t('Active?')}
                </th>
                <th className="w-[100px] px-2 py-2 font-medium text-center">
                  <Link
                    className='hover:text-primary'
                    title={t('New user')}
                    href={'/users/new'}
                  >
                    <i className="fa-regular fa-square-plus text-2xl"></i>
                  </Link>
                </th>
              </tr>
            </thead>
            {docs &&
              <tbody>
                {docs.map((item: any, key) => (
                  <tr key={key} className='h-24'>
                    <td className="border-b border-[#eee] px-2 py-2 pl-6 dark:border-strokedark xl:pl-7">
                      <h5 className="font-medium text-black dark:text-white">
                        {item.name}
                      </h5>
                      {item.image &&
                        <div className='flex justify-start mt-2'>
                          <div className='mx-1'>
                            <Image className='aspect-square rounded-full' src={item.image} alt="alt" width={72} height={72} />
                          </div>
                        </div>
                      }

                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <span className="w-full text-black dark:text-white">
                        {item.email}
                      </span>
                      <div className='grid grid-cols-3 gap-3 font-medium'>
                        <div className="text-sm uppercase">{item.gender}</div>
                        {/* qwerty */}
                        <div className="text-sm">💰%{item.discount && item.discount.rate || 5}{key % 2 == 0 ? " + $40" : ""}</div>
                      </div>

                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark font-medium text-center">
                      <p className="text-black dark:text-white uppercase">
                        <UserRoleEmojiStyle role={item.role} />
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark font-medium text-center">
                      {!item.passive &&
                        <p className="text-blue-600 uppercase">{t('Active')}</p>
                      }
                      {item.passive &&
                        <p className="text-neutral-600 uppercase">{t('Passive')}</p>
                      }
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <TableRowButtons
                        viewButton={{ href: `/users/view/${item._id}` }}
                        removeButton={{
                          onClick(e) {
                            removeItem(item)
                          }
                        }}
                        editButton={{ href: `/users/edit/${item._id}` }}
                      />

                    </td>
                  </tr>
                ))}
              </tbody>
            }
          </table>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      getList(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, pullData, getList])


  return (
    <>
      <Head>
        <title>{`${t('Users')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Users page for TourAbi Admin Panel" />
      </Head>
      <PageHeader pageTitle={t('Users')} breadcrumbList={[
        { href: '/dashboard', pageTitle: 'Dashboard' },
        { href: '/users', pageTitle: 'Users' }
      ]} />
      <div className="flex flex-col gap-10">
        {ItemList()}
        <div className='flex mt-4 justify-center items-center'>
          <Pagination pageNo={pageNo} pageCount={pageCount}
            onPageClick={(no: number) => getList(no)}
          />
        </div>
      </div>
    </>
  )
}

export default UsersPage
