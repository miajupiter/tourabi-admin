"use client"

import React, { FC, useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/i18n'
import { useLogin } from '@/hooks/useLogin'
import { CurrencyType } from '@/lib/priceHelper'
import { getItem, postItem, putItem } from '@/lib/fetch'
import InputWithLabel from '@/aliabi/InputWithLabel'
import DateInputWithLabel from '@/aliabi/DateInputWithLabel'
import SelectWithLabel from '@/aliabi/SelectWithLabel'

export interface TourPageDetailProps {
  params: { expeditionId: string }
}

export interface PricePerPersonType {

  personCount: number
  normal?: number
  economy?: number
  comfort?: number

}
export interface TourExpeditionItemType {
  _id?: string
  tourId?: string
  expeditionNumber?: string
  duration?: number
  dateFrom?: string
  dateTo?: string
  deadline?: string
  status?: string | 'pending' | 'avail' | 'closed' | 'cancelled'
  price?: number
  currency?: CurrencyType | string
  priceWithoutDiscount?: number
  singleSupplement?: {
    normal: number,
    economy: number,
    comfort: number
  }

  pricePerPerson?: PricePerPersonType[]
  quantitySold?: number
}

const ExpeditionDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { token, user } = useLogin()
  const { t } = useLanguage()

  const [item, setItem] = useState<TourExpeditionItemType>()
  const [pullData, setPullData] = useState(false)



  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    if (item?._id) {
      putItem(`/admin/tourExpeditions/${item?._id}?partial=true`, token, item)
        .then(data => setItem({ ...item, ...data }))
        .catch(err => alert(err))
    } else {
      postItem(`/admin/tourExpeditions/${item?._id}?partial=true`, token, item)
        .then(data => setItem({ ...item, ...data }))
        .catch(err => alert(err))
    }
  })

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.expeditionId === 'new') {
        setItem({
          ...item, expeditionNumber: '', _id: '',
          travelOptions: { normal: true, economy: false, comfort: false, singleSupplement: true }
        } as TourExpeditionItemType)
      } else {
        getItem(`/admin/tourExpeditions/${params.expeditionId}`, token)
          .then(data => setItem(data))
          .catch(err => console.log('err:', err))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.expeditionId])


  return (<>
    <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
      <InputWithLabel label={t('Expedition Number')}
        defaultValue={item?.expeditionNumber}
        onChange={(e) => setItem({ ...item, expeditionNumber: e.target.value })}
      />
      <DateInputWithLabel label={t('Date From')}
        defaultValue={item?.dateFrom}
        onChange={(e) => setItem({ ...item, dateFrom: e.target.value })}
      />
      <DateInputWithLabel label={t('Date To')}
        defaultValue={item?.dateTo}
        onChange={(e) => setItem({ ...item, dateTo: e.target.value })}
      />
      <DateInputWithLabel label={t('Deadline')}
        defaultValue={item?.deadline}
        onChange={(e) => setItem({ ...item, deadline: e.target.value })}
      />

      <InputWithLabel label={t('Price')}
        type={'number'}
        defaultValue={item?.price}
        onChange={(e) => setItem({ ...item, price: Number(e.target.value) })}
      />

      <SelectWithLabel label={t('Status')}
        defaultValue={item?.status}
        onSelect={(e) => setItem({ ...item, status: e.currentTarget.value })}
      >
        <option value={'pending'}>Pending</option>
        <option value={'avail'}>Available</option>
        <option value={'closed'}>Closed</option>
        <option value={'cancelled'}>Cancelled</option>
      </SelectWithLabel>

    </div>
    <div className='flex flex-row'>
      <button
        className='p-2 border border-stroke dark:border-strokedark rounded-md bg-blue-700 text-white'
        onClick={async (e) => {
          await saveItem(item)
        }}>
        <i className="fa-regular fa-floppy-disk"></i> Save
      </button>
    </div>
  </>)
}