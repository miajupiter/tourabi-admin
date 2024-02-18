"use client"

import React, { FC, Fragment, useState, useEffect } from 'react'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/app/(panel)/PageHeader'

export interface TourPageDetailProps {
  params: { id: string }
}

export interface TourItemType {
  id: string
  title: string
  description: string
  duration: number
  places: string
  images: StaticImageData[] | []
  priceTable: []
  travelPlan: []
  currency: string
  price?: number
  singleSupplement: number
  inclusions: string
  exclusions: string

}


const TourPageDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const thisPathname = usePathname()
  const [item, setItem] = useState<TourItemType>()
  const [pullData, setPullData] = useState(false)

  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${itemId}`, {
      headers: {
        'Content-Type': 'application/json',
        token: token
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
        }
      }).catch(console.error)

  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.id != 'new') {
        getItem(params.id)
      } else {
        setItem({ ...item, title: '' })
      }

    }

  }, [t, item, pullData, thisPathname])


  return (
    <>
      {/* <i className="fa-solid fa-check"></i> */}
      {/* <i className="fa-solid fa-xmark"></i> */}
      <PageHeader pageTitle="Edit/New Tour" breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/tours', pageTitle: 'Tours' },
        { href: `/tours/` + params.id, pageTitle: 'Tour Item' },
      ]} />
      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  {params.id == 'new' && <>
                    {t('New tour')}
                  </>}
                  {params.id != 'new' && <>
                    {t('Edit tour')} - {params.id}
                  </>}
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Title')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Title')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.title}
                    onChange={(e) => setItem({ ...item, title: e.target.value })}
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
                    onChange={(e) => setItem({ ...item, places: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Description')}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={t('Description')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.description}
                    onChange={(e) => setItem({ ...item, description: e.target.value })}
                  ></textarea>
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
