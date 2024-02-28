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
import Pagination from '@/components/Pagination'
import TableRowButtons, { TableRowButtonsProps } from '../../../components/TableRowButtons'


const DestinationsPage = () => {

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
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations?page=${sayfaNo}&pageSize=${pageSize}`, {
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

  const removeDestination = (item: any) => {
    if (!confirm(t(`${item.title}\n\nDo you want to remove?`)))
      return
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations/${item._id}`, {
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

  const DestinationList = () => {
    return (
      <div className="rounded-sm border border-stroke  px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark  bg-slate-100 dark:bg-[#0b1121] sm:px-7.5 xl:pb-1">
        <div className="max-w-full ">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-orange-800 text-left dark:bg-indigo-700  text-slate-100 dark:text-slate-100">
                <th className="px-2 py-2 font-mediumxl:pl-7">
                  {t('Title')}
                </th>
                <th className="px-2 py-2 font-medium">
                  {t('Country')}
                </th>
                <th className="min-w-[100px] px-2 py-2 font-medium text-center">
                  {t('Active?')}
                </th>
                <th className="w-[100px] px-2 py-2 font-medium text-center">
                  <Link
                    className='hover:text-primary'
                    title={t('new destination')}
                    href={'/destinations/new'}
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
                        {item.images.map((imgObj: any, index: number) => <>
                          {index < 3 && (imgObj.thumbnail || imgObj.image) &&
                            <div key={index} className='mx-1'>
                              <Image className='aspect-square rounded' src={imgObj.thumbnail || imgObj.image} alt="alt" width={72} height={72} />
                            </div>
                          }
                        </>)}
                      </div>}

                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.country}
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
                        viewButton={{ href: `/destinations/view/${item._id}` }}
                        removeButton={{
                          onClick(e) {
                            removeDestination(item)
                          },
                        }}
                        editButton={{ href: `/destinations/edit/${item._id}` }}
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
        <title>{`${t('Destinations')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Destinations page for TourAbi Admin Panel" />
      </Head>
      <PageHeader pageTitle={t('Destinations')} breadcrumbList={[
        { href: '/dashboard', pageTitle: 'Dashboard' },
        { href: '/destinations', pageTitle: 'Destinations' }
      ]} />
      <div className="flex flex-col gap-10">
        {DestinationList()}
        <div className='flex mt-4 justify-center items-center'>
          <Pagination pageNo={pageNo} pageCount={pageCount}
            onPageClick={(no:number) => getList(no)}
          />
        </div>
      </div>
    </>
  )
}

export default DestinationsPage
