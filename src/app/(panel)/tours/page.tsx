"use client"

// import Breadcrumb from "@/widgets/Breadcrumbs/Breadcrumb"
// import TourList from "./TourList"
import PageHeader from '@/app/(panel)/PageHeader'
import aliabiConfig from 'aliabi'

import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { useEffect, useState } from 'react'
import Link from 'next/link'


const ToursPage = () => {

  const [pullData, setPullData] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])
  const { t } = useLanguage()

  const getList = (sayfaNo: number) => {
    setPageNo(sayfaNo)
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

  const TourList = () => {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-2 py-2 font-medium text-black dark:text-white xl:pl-7">
                  {t('Title')}
                </th>
                <th className="px-2 py-2 font-medium text-black dark:text-white">
                  {t('Places')}
                </th>
                <th className="min-w-[120px] px-2 py-2 font-medium text-black dark:text-white">
                  {t('Publishment')}
                </th>
                <th className="w-[100px] px-2 py-2 font-medium text-black dark:text-white text-center">
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
                {docs.map((item: any, key) => (
                  <tr key={key} className='h-24'>
                    <td className="border-b border-[#eee] px-2 py-2 pl-6 dark:border-strokedark xl:pl-7">
                      <h5 className="font-medium text-black dark:text-white">
                        {item.title}
                      </h5>
                      {item.images && <div className='flex justify-start mt-2'>
                        {item.images.map((image: any, key: number) => (<div className='h-18 w-20 mx-1'>
                          <img key={key} src={image.src} alt="alt" width={80} height={80} />
                        </div>)
                        )}
                      </div>}

                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.places}
                      </p>
                      <p className="text-sm">{item.duration} {t('Day(s)')}</p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {item.publishStart} - {item.publishEnd}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-2 py-2 dark:border-strokedark">
                      <div className="flex justify-center items-center space-x-3.5">
                        <button className="hover:text-primary">
                          <i className="fa-regular fa-eye"></i>
                        </button>
                        <button className="hover:text-primary">
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                        <Link className="hover:text-primary"
                          title={t('edit_tour')}
                          href={`/tours/${item._id}`}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </Link>
                      </div>
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

  const Sayfalar = () => {
    let dizi = []
    let i = 0
    while (i < pageCount) {
      dizi.push(i + 1)
      i++
    }
    return (
      <nav className={`inline-flex space-x-1 text-base font-medium`}>
        {dizi.map((no, index) => {
          if (no == pageNo) {
            return <span
              key={no}
              className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white`}
            >
              {no}
            </span>
          } else {
            return <button
              key={no}
              className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700`}
              onClick={() => getList(no)}
            >{no}</button>
          }
        })}
      </nav>
    )
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      getList(1)
    }
  }, [t, pullData, pageNo, pageSize, pageCount, totalDocs, docs])


  return (
    <>
      <Head>
        <title>{`${t('Tours')} | ${aliabiConfig.title}`}</title>
        <meta name="description" content="This is Tours page for TourAbi Admin Panel" />
      </Head>
      <PageHeader pageTitle={t('Tours')} breadcrumbList={[
        {href:'/dashboard',pageTitle:'Dashboard'},
        {href:'/tours',pageTitle:'Tours'}
      ]}  />
      <div className="flex flex-col gap-10">
        {TourList()}
        <div className='flex mt-4 justify-center items-center'>
          {Sayfalar()}
        </div>
      </div>
    </>
  )
}

export default ToursPage
