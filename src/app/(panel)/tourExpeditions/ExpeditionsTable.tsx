/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import PageHeader from '@/components/others/PageHeader'
import aliabiConfig from 'aliabi'
import Image from "next/image"
import Head from 'next/head'
import { useLanguage } from '@/hooks/i18n'
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Pagination from '@/aliabi/Pagination'
import ListPageTable from '@/aliabi/Table/ListPageTable'
import { TdActivePassive, TdTitleAndImage } from '@/aliabi/Table/SomeTableComponents'
import { getList, searchList } from '@/lib/fetch'
import { useLogin } from '@/hooks/useLogin'
import { convertNumbThousand } from '@/lib/convertNumbThousand'
import { useQRCode } from 'next-qrcode'
import WrapDashBorder from '@/aliabi/WrapDashBorder'

export const ExpeditionsTable: FC<any> = ({ tourId: string, rowEditButton, addNewButton }: any) => {
  const { token } = useLogin()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageCount, setPageCount] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [docs, setDocs] = useState([])
  const { t } = useLanguage()
  const { Canvas } = useQRCode()

  const getListData = (sayfaNo: number) => {
    setPageNo(sayfaNo)
    searchList(`/admin/tourExpeditions?page=${pageNo}`, token, {
      filter: {},
      populate: [{ path: 'tourId', select: '_id title ' }]
    })
      .then((data) => {
        console.log('data', data)
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
    <div className="flex flex-col gap-10">
      <ListPageTable
        docs={docs} page={pageNo} pageCount={pageCount} pageSize={pageSize} totalDocs={totalDocs}
        rowEditButton={{ href: `/tourExpeditions/edit/{_id}` }}
        addNewButton={{ href: `/tourExpeditions/new` }}
        theadTrTdClassName='text-start'
        onRenderRow={(tr, colItem, colIndex, rowIndex) => <>
          {colIndex == 0 && <>
            <div className='flex space-x-2'>
              <div className='flex-none'>
                <Canvas
                  text={tr.expeditionNumber || ''}
                  options={{
                    errorCorrectionLevel: 'M',
                    margin: 1,
                    scale: 0.5,
                    width: 48,
                    color: {
                      dark: '#000000FF',
                      light: '#F2F2F2FF',
                    },
                  }}
                />
              </div>
              <div className='flex-auto'>
                <h5>{tr.tourId.title}</h5>
                <p className='text-sm'>{tr.expeditionNumber} </p>
              </div>
            </div>
          </>}
          {colIndex == 1 && <>
            <p className='font-medium'>{tr.dateFrom} - {tr.dateTo}</p>
            <p className='inline-block'>
              <span className='ms-3'>{tr.duration} Days</span>
              <span className='font-medium text-rose-700'>DL:{tr.deadline}</span>
            </p>
          </>}
          {colIndex == 2 && <>
            <p className='inline-block space-x-3'>
              <span>US ${convertNumbThousand(tr.price)}</span>
              <span className='line-through text-opacity-70'>{convertNumbThousand(tr.priceWithoutDiscount)}</span>
            </p>
          </>}
          {colIndex == 3 && <>
            <p className='text-base font-medium uppercase'>{tr.status}</p>
            <span className='line-through'>{tr.quantitySold} <span className='text-sm'>Sold</span> </span>
          </>}
        </>}
        columns={['Tour', 'Expedition Dates', 'Price', 'Status']}
      />
      <div className='flex mt-4 justify-center items-center'>
        <Pagination pageNo={pageNo} pageCount={pageCount}
          onPageClick={(no: number) => setPageNo(no)}
        />
      </div>
    </div>
  )
}

export default ExpeditionsTable
