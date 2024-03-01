"use client"

import React, { FC, useState, useEffect } from 'react'
import PageHeader from '@/components/PageHeader'
import { aliabiConfig } from 'aliabi'
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import Link from 'next/link'
import Image from 'next/image'
import TableRowButtons from '@/components/TableRowButtons'
import Pagination from '@/components/Pagination'

export interface ToursPageProps { }

const ToursPage: FC<ToursPageProps> = ({ }) => {
  const { t } = useLanguage()
  const [pullData, setPullData] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])


  // const getList =({sayfaNo}:{sayfaNo?: number}) => {
  const getList = (sayfaNo: number) => {
    setPageNo(sayfaNo || 1)
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours?page=${sayfaNo}&pageSize=${pageSize}`, {
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

  const removeTour = (item: any) => {
    if (!confirm(t(`${item.title}\n\nDo you want to remove?`)))
      return
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item._id}`, {
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

  const TourList = () => {
    return (
      <div className="rounded-sm border border-stroke px-5 pb-2.5 pt-6 shad11ow-defau11lt dark:border-strokedark  bg-s11late-600 dark:bg-[#0b1121] sm:px-7.5 xl:pb-1">
        <div className="max-w-full  rounded-[4px] drop-shadow-md ">
          <table className="w-full table-auto dr11op-shadow-lg">
            <thead className='text-slate-900 dark:text-slate-100 bg-slate-300 dark:bg-slate-700 '>
              <tr className="">
                <th className="px-2 py-2 font-medium xl:pl-7">
                  {t('Title')}
                </th>
                <th className="px-2 py-2 font-medium">
                  {t('Places')}
                </th>
                <th className="min-w-[100px] px-2 py-2 font-medium text-center">
                  {t('Active?')}
                </th>
                <th className="w-[100px] px-2 py-2 font-medium  text-center">
                  <Link
                    className='hover:text-primary'
                    title={t('new_tour')}
                    href={'/tours/new'}
                  >
                    <i className="fa-regular fa-square-plus text-2xl"></i>
                  </Link>
                </th>
              </tr>
            </thead>
            {docs &&
              <tbody>
                {docs.map((item: any, index) => (
                  <tr key={index} className={`h-24 ${index%2==0?"bg-slate-50 dark:bg-[#0e1425]":"bg-slate-100 bg-opacity-90 dark:bg-[#0c1222]"}`}>
                    <td className="border-b border-[#eee] px-2 py-2 pl-6 dark:border-strokedark xl:pl-7">
                      <h5 className="font-medium text-black dark:text-slate-100">
                        {item.title}
                      </h5>
                      {item.images && <div className='flex justify-start mt-2'>
                        {item.images.map((imgObj: any, index: number) => <>
                          {index < 3 && (imgObj.thumbnail || imgObj.image) &&
                            <div key={index} className='h-18 max-w-26 mx-1'>
                              <Image className='aspect-square rounded' src={imgObj.thumbnail || imgObj.image} alt="alt" width={72} height={72} />
                            </div>
                          }
                        </>)}
                      </div>}


                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.places}
                      </p>
                      <p className="text-sm">{item.duration} {t('Day(s)')}</p>
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
                        viewButton={{ href: `/tours/view/${item._id}` }}
                        removeButton={{
                          onClick(e) {
                            removeTour(item)
                          }
                        }}
                        editButton={{ href: `/tours/edit/${item._id}` }}
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
        // .then(console.log)
        // .catch(console.error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, pullData])

  return (
    <>
      <Head>
        <title>{`${t('Tours')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Tours page for TourAbi Admin Panel" />
      </Head>
      <PageHeader pageTitle={t('Tours')} breadcrumbList={[
        { href: '/dashboard', pageTitle: t('Dashboard') },
        { href: '/tours', pageTitle: t('Tours') }
      ]} />
      <div className="flex flex-col gap-10">
        {TourList()}
        <div className='flex mt-4 justify-center items-center'>
          <Pagination pageNo={pageNo} pageCount={pageCount}
            onPageClick={(no: number) => getList(no)}
          />
        </div>
      </div>
    </>
  )
}

export default ToursPage
