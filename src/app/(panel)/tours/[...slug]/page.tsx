"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/app/(panel)/PageHeader'
import { AliAbiMDXEditor } from '@/widgets/Editor/AliAbiMDXEditor'
import Link from 'next/link'

export interface TourPageDetailProps {
  params: { slug: string[] }
}

export enum FormStatus {
  new = 'new',
  edit = 'edit',
  view = 'view',
}

export interface TourItemType {
  id?: string
  title?: string
  description?: string
  duration?: number
  places?: string
  images?: StaticImageData[] | []
  priceTable?: []
  travelPlan?: []
  currency?: string
  price?: number
  singleSupplement?: number
  inclusions?: string
  exclusions?: string

}


export function manipulateMDX(text: string) {
  return text
  // return text.replace(/\n\n/g,'\n')
}

const TourPageDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<TourItemType>()
  const [itemOld, setItemOld] = useState<TourItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState(FormStatus.new)
  const [formTitle, setFormTitle] = useState('')
  // const [partialData, setPartialData] = useState<any>()
  // const [countDown, setCountDown] = useState(5)
  // let sayac = setInterval(() => {
  //   setCountDown(countDown - 1)
  //   if (countDown <= 0) {
  //     clearInterval(sayac)
  //   }
  // }, 1000)
  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${itemId}`, {
      headers: {
        'Content-Type': 'application/json', token: token
      }
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          var res = result.data as TourItemType
          var tour = {
            id: res.id,
            title: res.title,
            description: res.description,
            duration: res.duration,
            places: res.places,
            currency: res.currency,
            price: res.price,
            singleSupplement: res.singleSupplement,
            priceTable: res.priceTable,
            travelPlan: res.travelPlan,
            inclusions: res.inclusions,
            exclusions: res.exclusions,
            images: res.images,
          } as TourItemType
          setItem(tour)
          setItemOld(item)
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item?.id}?partial=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        console.log('saveItem result:', result)
        if (result.success && result.data) {

        }
      }).catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '' } as TourItemType)
        setItemOld(item)
        setFormTitle(t('New tour'))
      } else if (params.slug[0] == 'edit') {
        setFormStatus(FormStatus.edit)
        setFormTitle(t('Edit tour'))
        getItem(params.slug[1])
      } else if (params.slug[0] == 'view') {
        setFormStatus(FormStatus.view)
        setFormTitle(t('View tour'))
        getItem(params.slug[1])
      }
    }
  }, [t, item, itemOld, pullData, formStatus, formTitle])
  // }, [t, item, pullData, formStatus, formTitle, partialData,countDown,sayac])
  const { } = useRef()
  return (
    <>

      <PageHeader pageTitle={formTitle} breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/tours', pageTitle: 'Tours' },
        params.slug.length >= 2 && { href: `/tours/` + params.slug[1], pageTitle: 'Tour Item' }
      ]} />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Title')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Title')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.title}
                    onFocus={(e) => setItemOld({ ...itemOld, title: item.title })}
                    onChange={(e) => setItem({ ...item, title: e.target.value })}
                    onBlur={() => {
                      if (item.title != itemOld?.title) {
                        setItemOld({ ...itemOld, title: item.title })
                        saveItem({ title: item.title })
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Places')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Places')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.places}
                    onFocus={(e) => setItemOld({ ...itemOld, places: item.places })}
                    onChange={(e) => setItem({ ...item, places: e.target.value })}
                    onBlur={() => {
                      if (item.places != itemOld?.places) {
                        setItemOld({ ...itemOld, places: item.places })
                        saveItem({ places: item.places })
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Description')}
                  </label>
                  <AliAbiMDXEditor markdown={item.description || ''}
                    readOnly={formStatus == FormStatus.view}
                    onChange={(markdown) => setItem({ ...item, description: markdown })}
                    onBlur={(e) => {
                      if (item.description != itemOld?.description) {
                        setItemOld({ ...itemOld, description: item.description })
                        saveItem({ description: item.description })
                      }
                    }}
                  />

                </div>


              </div>
            </div>

            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5.5 p-5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('inclusions')}
                  </label>
                  <AliAbiMDXEditor markdown={item.inclusions || ''}
                    readOnly={formStatus == FormStatus.view}
                    onChange={(markdown) => setItem({ ...item, inclusions: markdown })}
                    onBlur={(e) => {
                      if (item.inclusions != itemOld?.inclusions) {
                        setItemOld({ ...itemOld, inclusions: item.inclusions })
                        saveItem({ inclusions: item.inclusions })
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('exclusions')}
                  </label>
                  <AliAbiMDXEditor markdown={item.exclusions || ''}
                    readOnly={formStatus == FormStatus.view}
                    onChange={(markdown) => setItem({ ...item, exclusions: markdown })}
                    onBlur={(e) => {
                      if (item.exclusions != itemOld?.exclusions) {
                        setItemOld({ ...itemOld, exclusions: item.exclusions })
                        saveItem({ exclusions: item.exclusions })
                      }
                    }}
                  />

                </div>

              </div>

            </div>

            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="grid grid-cols-1 gap-5.5 p-5">
                <div>
                  <label className="mb-3 block text-xl font-medium text-black dark:text-white">
                    {t('Travel plan')}
                  </label>
                  <div >
                    {
                      item.travelPlan && item.travelPlan.map((plan: any, index) =>
                        <div key={index} className='w-full'>
                          <label className="mb-3 block text-base">
                            {plan.title}
                          </label>
                          <div>
                            {plan.description}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    onClick={(e)=>alert('Yeni gezi adımı')}
                  >
                    {t('Add Travel Plan')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      }
    </>
  )
}

export default TourPageDetail
