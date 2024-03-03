"use client"

import React, { FC, useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/components/Editor/AliAbiMDXEditor'
import FormCard, { FormCardType } from '@/components/FormCard'
import SwitchPassive from '@/components/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/components/InputWithLabel'
import ImageListWidget, { ImageItemProps } from '@/widgets/ImageListWidget'
import { useLogin, UserRole } from '@/hooks/useLogin'
import SelectWithLabel from '@/components/SelectWithLabel'
import { CurrencyType, CurrencyTypeList } from '@/lib/priceHelper'
import { Input } from '@/components/Input'
import { getItem, deleteItem, putItem, getList } from '@/lib/fetch'
export interface TourExpeditionPageProps {
  params: { slug: string | [] }
}

export interface ExpeditionItemType {
  _id?: string
  tourId: string,
  expeditionNumber: { type: String, default: '', index: true },
  duration: number,
  dateFrom: string,
  dateTo: string,
  deadline: string,
  status: string | 'pending' | 'avail' | 'closed' | 'cancelled'
  price: number
  currency?: CurrencyType | string
  priceWithoutDiscount: number,
  singleSupplement: {
    normal: number,
    economy: number,
    comfort: number,
  },
  pricePerPerson: [{
    personCount: number,
    normal: number,
    economy: number,
    comfort: number,
  }],
  quantitySold: { type: Number, default: 0, },
}

const mdxKod = '--1--1'

const TourExpeditionPage: FC<TourExpeditionPageProps> = ({ params }) => {
  const { token, user } = useLogin()
  const { t } = useLanguage()


  const { slug } = params
  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [docs, setDocs] = useState<ExpeditionItemType[]>([])
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [pageNo, setPageNo] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalDocs, setTotalDocs] = useState([])

  const getListData = () => {
    getList(`/admin/tourExpeditions?page=${pageNo}`, token)
      .then((data) => {
        setDocs(data.docs)
        setPageCount(data.pageCount)
        setPageSize(data.pageSize)
        setTotalDocs(data.totalDocs)
      })
      .catch(err => alert(err))
  }
  // const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
  //   putItem(`/admin/tourExpeditions/${item?._id}?partial=true`, token, item)
  //     .then(data => setItem({ ...item, ...data }))
  //     .catch(err => alert(err))
  // })



  useEffect(() => {
    getListData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo])


  return (
    <>
      <PageHeader
        pageTitle={'qwerty'}
        breadcrumbList={[
          { href: '/', pageTitle: 'Dashboard' },
          { href: '/tours', pageTitle: 'Tours' },
          params.slug.length >= 2 && { href: `/tours/` + params.slug[1], pageTitle: 'Tour Item' }
        ]}
        icon={(<i className='fa-solid fa-route'></i>)}
      />


      <div className="grid grid-cols-1 gap-6 ">
        <div className="flex flex-col gap-6">

          <FormCard id="tours-prices" title={`${t('Prices')} | ${t('Calculations')} | ${t('Groups')}`}
            defaultOpen={false} icon={(<i className="fa-solid fa-money-check-dollar"></i>)}
            bodyClassName='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'
          >

          </FormCard>

        </div>


      </div>
    </>
  )
}

export default TourExpeditionPage
