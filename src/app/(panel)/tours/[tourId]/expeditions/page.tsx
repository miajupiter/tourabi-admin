"use client"

import ButtonPrimary from '@/components/ButtonPrimary'
import FormCard, { FormCardType } from '@/aliabi/FormCard'
import { useLanguage } from '@/hooks/i18n'
import { useLogin } from '@/hooks/useLogin'
import { getItem, putItem, searchList } from '@/lib/fetch'
import React, { FC, useEffect, useState } from 'react'
import WrapDashBorder from '@/aliabi/WrapDashBorder'
import SelectWithLabel from '@/aliabi/SelectWithLabel'
import InputWithLabel from '@/aliabi/InputWithLabel'
import { CurrencyType, CurrencyTypeList } from '@/lib/priceHelper'
import { FormStatus } from '@/types/formStatus'
import Switch from '@/aliabi/Switch'
import Link from 'next/link'
import { TourItemType } from '../page'
export interface PageExpeditionsProps {
  params: {
    tourId: string
  }
}
const PageExpeditions: FC<PageExpeditionsProps> = ({ params }) => {
  const { token } = useLogin()
  const { t } = useLanguage()
  const [item, setItem] = useState<TourItemType>()
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)

  const getFormData = (tourId: string) => {

    getItem(`/admin/tours/${tourId}`, token)
      .then(data => setItem(data))
      .catch(console.log)
  }
  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    putItem(`/admin/tours/${item?._id}?partial=true`, token, item)
      .then(data => setItem({ ...item, ...data }))
      .catch(err => alert(err))

  })

  const formTitle = () => {
    switch (formStatus) {
      case FormStatus.new:
        return t('New tour')
      case FormStatus.edit:
        return t('Edit tour')
      case FormStatus.view:
        return t('View tour')
    }
    return ''
  }


  useEffect(() => {
    getFormData(params.tourId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.tourId])

  const dd = params
  return (<>
    {item && <WrapDashBorder >
      <FormCard id="tour-id-expeditions" cardType={FormCardType.STATIC}
        title={<>
          <Link href={`/tours`} className='mx-2'><i className="fa-solid fa-left-long"></i></Link>
          {item.title}
        </>}
        bodyClassName='flex flex-col space-y-3'
      >


        <div>{item.title}</div>
        <div>{item.places}</div>
        <div>{item.duration}</div>
        <div>{item.currency}</div>



        <FormCard id="tours-prices" title={`${t('List Prices')} | ${t('Calculations')} | ${t('Groups')}`}
          defaultOpen={false} icon={(<i className="fa-solid fa-money-check-dollar"></i>)}
          bodyClassName='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'
        >
          {/* <!-- List Price --> */}
          <FormCard id="tours-list-prices" title={t('List prices')}
            bodyClassName='grid grid-cols-1 gap-4' cardType={FormCardType.STATIC} >
            <SelectWithLabel label={t('Currency')}
              defaultValue={item.currency || CurrencyType.USD}
              onBlur={async (e) => {
                if (e.target.value != item.currency) {
                  setItem({ ...item, currency: e.target.value })
                  await saveItem({ currency: e.target.value })
                }
              }}>
              {CurrencyTypeList.map((e, index) => <>
                <option key={index} value={e}>{e}</option>
              </>)}
            </SelectWithLabel>
            <InputWithLabel
              readOnly={formStatus == FormStatus.view}
              type='number'
              label={t('Price')}
              title={t('Real price or discounted price.')}
              defaultValue={item.price}
              onBlur={async (e) => {
                if (item.price != Number(e.target.value)) {
                  item.price = Number(e.target.value)
                  setItem(item)
                  await saveItem({ price: item.price })
                }
              }}
            />
            <InputWithLabel
              readOnly={formStatus == FormStatus.view}
              type='number'
              label={t('Price without discount')}
              title={t('Ineffective price. It is used to show the user a crossed-out high price.')}
              labelClassName='line-through'
              inputClassName='line-through'
              defaultValue={Number(item.priceWithoutDiscount)}
              onBlur={async (e) => {
                if (item.priceWithoutDiscount != Number(e.target.value)) {
                  item.priceWithoutDiscount = Number(e.target.value)
                  setItem(item)
                  await saveItem({ priceWithoutDiscount: item.priceWithoutDiscount })
                }
              }}
            />

          </FormCard>
          {/* <!-- ENDList Price --> */}

          {/* <!-- Group Size --> */}
          <FormCard id="tours-group-size" title={t('Group Size')}
            bodyClassName='grid grid-cols-1 gap-4' cardType={FormCardType.STATIC} >
            <InputWithLabel
              readOnly={formStatus == FormStatus.view}
              type='number'
              label={t('Min')}
              defaultValue={Number(item.groupMin)}
              onBlur={async (e) => {
                if (item.groupMin != Number(e.target.value)) {
                  item.groupMin = Number(e.target.value)
                  setItem(item)
                  await saveItem({ groupMin: item.groupMin })
                }
              }}
            />
            <InputWithLabel
              readOnly={formStatus == FormStatus.view}
              type='number'
              label={t('Max')}
              defaultValue={Number(item.groupMax)}
              onBlur={async (e) => {
                if (item.groupMax != Number(e.target.value)) {
                  item.groupMax = Number(e.target.value)
                  setItem(item)
                  await saveItem({ groupMax: item.groupMax })
                }
              }}
            />
            {/* <Link
            href={`/tours/${params.tourId}/expeditions`}
            className=''
          >
            Tur Seferleri (Tour Expeditions)
          </Link> */}

          </FormCard>
          {/* <!-- END Group Size --> */}

          {/* <!-- Price per person --> */}
          <FormCard id="tours-travel-options" title={t('Travel Options')}
            bodyClassName='grid grid-cols-4 gap-4' cardType={FormCardType.STATIC} >

            <label className='col-span-3'>{t('Normal')}</label>
            <Switch
              className='col-span-1'
              defaultValue={item.travelOptions.normal}
              onChange={(e) => {
                console.log(e)
                item.travelOptions.normal = e
                setItem({ ...item, travelOptions: item.travelOptions })
                saveItem({ ...item, travelOptions: item.travelOptions })
              }}
            />

            <label className='col-span-3'>{t('Economy')}</label>
            <Switch
              className='col-span-1'
              defaultValue={item.travelOptions.economy}
              onChange={(e) => {
                item.travelOptions.economy = e
                setItem({ ...item, travelOptions: item.travelOptions })
                saveItem({ ...item, travelOptions: item.travelOptions })
              }}
            />
            <label className='col-span-3'>{t('Comfort')}</label>
            <Switch
              className='col-span-1'
              defaultValue={item.travelOptions.comfort}
              onChange={(e) => {
                item.travelOptions.comfort = e
                setItem({ ...item, travelOptions: item.travelOptions })
                saveItem({ ...item, travelOptions: item.travelOptions })
              }}
            />
            <label className='col-span-3'>{t('Single Supplement')}</label>
            <Switch
              className='col-span-1'
              defaultValue={item.travelOptions.singleSupplement}
              onChange={(e) => {
                item.travelOptions.singleSupplement = e
                setItem({ ...item, travelOptions: item.travelOptions })
                saveItem({ ...item, travelOptions: item.travelOptions })
              }}
            />
          </FormCard>
          {/* <!-- END Price per person --> */}

        </FormCard>
      </FormCard>
    </WrapDashBorder>
    }
  </>)
}



export default PageExpeditions
