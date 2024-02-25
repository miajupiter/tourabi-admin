"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/components/Editor/AliAbiMDXEditor'
import Link from 'next/link'
import FormCard from '@/components/FormCard'
import { ImageItemProps, ImageListWidget } from './ImageListWidget'
import Switch from '@/components/Switch'
import SwitchPassive from '@/components/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/components/InputWithLabel'
import SelectWithLabel from '@/components/SelectWithLabel'
import { countries } from 'country-list-json'

export interface AccommodationPageDetailProps {
  params: { slug: string[] }
}

export const AccommodationPropertyTypes = [
  'hotel', 'hostel', 'guesthouse', 'lodging', 'tent', 'caravan', 'comping', 'boat', 'housing', 'residence'
]

export const AccommodationRoomTypes = [
  'Single',
  'Double',
  'Double / Twin',
  'Double single use',
  'Dormitory bed',
  'Deluxe Single',
  'Deluxe Double'
]

export interface DistanceFromProps {
  location: string
  distance: number //Km
  duration: number //Minutes
}
export interface AccommodationItemType {
  _id?: string
  title?: string
  propertyType: string
  description?: string
  stars?: number
  capacity?: number
  country?: string
  addressText?: string
  images?: ImageItemProps[]
  distanceFrom: DistanceFromProps[]
  breakfast: {
    from: '06:30'
    to: '09:00'
  }
  checking: {
    checkIn: '13:00'
    checkOut: '11:00'
    rules: string[]
  }
  services: string[]
  propertyAmenities: string[]
  roomTypes: string[]
  passive?: boolean
}

const mdxKod = '--1--1'

const AccommodationPageDetail: FC<AccommodationPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<AccommodationItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')


  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/accommodations/${itemId}`, {
      headers: { 'Content-Type': 'application/json', token: token },
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          const res = result.data as AccommodationItemType
          setItem(res)
        }
      }).catch(console.error)
  }

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    const token = localStorage.getItem('token') || ''

    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/accommodations/${item?._id}?partial=true`, {
      method: item?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          setItem({ ...item, ...result.data })
          if (formStatus == FormStatus.new && item?._id) {
            setFormStatus(FormStatus.edit)
          }
          resolve(item)
        } else if (result.error) {
          reject(result.error)
        } else {
          reject('error: saveItem')
        }
      }).catch((err: any) => {
        console.error(err)
        reject(err.message || err)
      })
  })

  const formTitle = () => {
    switch (formStatus) {
      case FormStatus.new:
        return t('New accommodation')
      case FormStatus.edit:
        return t('Edit accommodation')
      case FormStatus.view:
        return t('View accommodation')
    }
    return ''
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '', _id: '' } as AccommodationItemType)
      } else if (params.slug[0] == 'edit') {
        setFormStatus(FormStatus.edit)
        getItem(params.slug[1])
      } else if (params.slug[0] == 'view') {
        setFormStatus(FormStatus.view)
        getItem(params.slug[1])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, pullData])


  return (
    <>

      <PageHeader pageTitle={formTitle()} breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/accommodations', pageTitle: 'Accommodations' },
        params.slug.length >= 2 && { href: `/accommodations/` + params.slug[1], pageTitle: 'Accommodation Item' }
      ]} />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="grid grid-cols-1 gap-5.5 p-5">
                <div className='flex'>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    label={t('Title')}
                    defaultValue={item.title}
                    // onFocus={(e) => setFocusText(e.target.value)}
                    onBlur={async (e) => {
                      if (e.target.value != item.title) {
                        setItem({ ...item, title: e.target.value })
                        await saveItem({ title: e.target.value })
                      }
                    }}
                  />
                  <div className='flex-none w-24 md:w-64'>
                    <label className="mb-3 block text-sm text-center font-medium text-black dark:text-white">
                      {t('Active/Passive?')}
                    </label>
                    <div className='flex w-full h-full justify-center'>
                      <SwitchPassive
                        showSmiles={false}
                        defaultValue={item.passive}
                        onSwitch={async (e) => {
                          setItem({ ...item, passive: e })
                          await saveItem({ passive: e })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5.5 p-5'>
                  <SelectWithLabel
                    className='col-end-2 col-span-1'
                    readOnly={formStatus == FormStatus.view}
                    label={t('Country')}
                    onBlur={async (e) => {
                      if (item.country != e.target.value) {
                        setItem({ ...item, country: e.target.value })
                        await saveItem({ country: e.target.value })
                      }
                    }}
                  >
                    {countries.map((ulke, index) => (
                      <option key={index} value={ulke.code}>{ulke.name}</option>
                    ))}
                  </SelectWithLabel>
                  <InputWithLabel
                    className='col-span-2'
                    readOnly={formStatus == FormStatus.view}
                    label={t('Address')}
                    defaultValue={item.addressText}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onBlur={async (e) => {
                      if (e.target.value != item.addressText) {
                        setItem({ ...item, addressText: e.target.value })
                        await saveItem({ addressText: e.target.value })
                      }
                    }}
                  />
                  <InputWithLabel
                    type={'number'}
                    readOnly={formStatus == FormStatus.view}
                    label={t('Capacity')}
                    defaultValue={item.capacity || 1}
                    // onFocus={(e) => setFocusText(e.target.value)}
                    onBlur={async (e) => {
                      if (e.target.value != (item.capacity || 1).toString()) {
                        setItem({ ...item, capacity: Number(e.target.value) })
                        await saveItem({ capacity: Number(e.target.value) })
                      }
                    }}
                  />
                  <SelectWithLabel
                    readOnly={formStatus == FormStatus.view}
                    label={t('Stars')}
                    defaultValue={item.stars || 1}
                    onBlur={async (e) => {
                      // const sayi=Number(!Number.isNaN(e.target.value)?Number(e.target.value || '1'):1)
                      if ((item.stars || 1).toString() != e.target.value) {
                        setItem({ ...item, stars: Number(e.target.value) })
                        await saveItem({ stars: Number(e.target.value) })
                      }
                    }}
                  >
                    <option key={0} value={1}>⭐</option>
                    <option key={1} value={2}>⭐⭐</option>
                    <option key={2} value={3}>⭐⭐⭐</option>
                    <option key={3} value={4}>⭐⭐⭐⭐</option>
                    <option key={4} value={5}>⭐⭐⭐⭐⭐</option>
                  </SelectWithLabel>
                </div>
              </div>
            </div>
            {item._id && <>
              <ImageListWidget
                title={t('Images')}
                images={item.images as ImageItemProps[]}
                saveImages={(imgList:any)=>{
                  item.images=imgList
                  setItem(item)
                  saveItem({images:imgList})
                }}
                uploadFolder={'hotel-images/'}
                readOnly={formStatus == FormStatus.view}
              />

              <FormCard id="accommodation-description" title={t('Description')}
                defaultOpen={false}
              >
                <div className="grid grid-cols-1  gap-5.5 p-5">
                  <AliAbiMDXEditor markdown={item.description || ''}
                    readOnly={formStatus == FormStatus.view}
                    onChange={(markdown) => setFocusMarkDown(markdown)}
                    onBlur={async (e) => {
                      if (focusMarkDown != mdxKod && focusMarkDown != item.description) {
                        item.description = focusMarkDown
                        setItem(item)
                        setFocusMarkDown(mdxKod)
                        await saveItem({ description: item.description })
                      }
                    }}
                  />
                </div>
              </FormCard>
            </>}
          </div>
        </div>
      }
    </>
  )
}

export default AccommodationPageDetail
