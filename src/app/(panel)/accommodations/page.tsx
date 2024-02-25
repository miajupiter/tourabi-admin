/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import PageHeader from '@/components/PageHeader'
import aliabiConfig from 'aliabi'
import Image from "next/image"
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Pagination from '@/components/Pagination'
import TableRowActionButtons, { TableRowActionButtonsProps } from '../../../components/TableRowActionButtons'
import { ImageItemProps } from './[...slug]/ImageListWidget'


const AccommodationsPage = () => {

  const [pullData, setPullData] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])
  const { t } = useLanguage()

  const getList = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/accommodations?page=${sayfaNo}&pageSize=${pageSize}`, {
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
    if (!confirm(t(`${item.title}\n\nDo you want to remove?`)))
      return
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/accommodations/${item._id}`, {
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

  const ItemList = () => {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full ">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-2 py-2 font-medium text-black dark:text-white xl:pl-7">
                  {t('Title')}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t('Country')}
                </th>
                <th className="min-w-[100px] px-2 py-2 font-medium text-black dark:text-white text-center">
                  {t('Active?')}
                </th>
                <th className="w-[100px] px-2 py-2 font-medium text-black dark:text-white text-center">
                  <Link
                    className='hover:text-primary'
                    title={t('New accommodation')}
                    href={'/accommodations/new'}
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
                        {item.title}
                      </h5>
                      {item.images && <div className='flex justify-start mt-2'>
                        {item.images.map((imgObj: ImageItemProps, index: number) => <>
                          <div key={index} className='mx-1'>
                            <Image className='aspect-square rounded' src={imgObj.src} alt={imgObj.alt || ''} width={72} height={72} title={imgObj.title} />
                          </div>
                        </>)}
                      </div>}

                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <div className="text-black dark:text-white w-full">
                        {item.country}
                      </div>
                      <div className='flex justify-start items-center'>
                        <div className="text-sm">
                          {item.capacity} <i className="fa-solid fa-bed"></i>
                        </div>
                        <div className="text-2xl text-yellow-500">
                          {Array.from(Array(5).keys()).map((e,index)=><>
                            {(index+1)<=item.stars && <i className="fa-solid fa-star"></i>}
                            {(index+1)>item.stars && <i className="fa-regular fa-star"></i>}
                          </>)}
                          {item.capacity} <i className="fa-solid fa-bed"></i>
                        </div>
                      </div>

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
                      <TableRowActionButtons
                        viewButton={{ href: `/accommodations/view/${item._id}` }}
                        removeButton={{
                          onClick(e) {
                            removeItem(item)
                          },
                        }}
                        editButton={{ href: `/accommodations/edit/${item._id}` }}
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
        <title>{`${t('Accommodations')} - ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Accommodations page for TourAbi Admin Panel" />
      </Head>
      <PageHeader pageTitle={t('Accommodations')} breadcrumbList={[
        { href: '/dashboard', pageTitle: 'Dashboard' },
        { href: '/accommodations', pageTitle: 'Accommodations' }
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

export default AccommodationsPage
