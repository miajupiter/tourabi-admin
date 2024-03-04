"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/aliabi/Editor/AliAbiMDXEditor'
import Link from 'next/link'
import FormCard from '@/aliabi/FormCard'
import { ImageItemProps, ImageListWidget } from '../../../../aliabi/ImageListWidget'
import Switch from '@/aliabi/Switch'
import SwitchPassive from '@/aliabi/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/aliabi/InputWithLabel'
import SelectWithLabel from '@/aliabi/SelectWithLabel'
import { countries } from 'country-list-json'
import Input from '@/aliabi/Input'
import { deleteItem } from '@/lib/fetch'
import { useLogin } from '@/hooks/useLogin'

export interface AccommodationPageDetailProps {
  params: { slug: string[] }
}

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


const PROPERTY_TYPES = [
  'hotel', 'hostel', 'guesthouse', 'lodging', 'tent', 'caravan', 'comping', 'boat', 'housing', 'residence'
]

const ROOM_TYPES = [
  'Single',
  'Double',
  'Double / Twin',
  'Double single use',
  'Dormitory bed',
  'Deluxe Single',
  'Deluxe Double'
]

const mdxKod = '--1--1'

const AccommodationPageDetail: FC<AccommodationPageDetailProps> = ({ params }) => {
  const {token}=useLogin()
  
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
      <PageHeader
        pageTitle={formTitle()}
        breadcrumbList={[
          { href: '/', pageTitle: 'Dashboard' },
          { href: '/accommodations', pageTitle: 'Hotels' },
          params.slug.length >= 2 && { href: `/accommodations/` + params.slug[1], pageTitle: 'Hotel' }
        ]}
        icon={(<i className="fa-solid fa-hotel"></i>)}
      />

      {item &&
        <div className="grid grid-cols-1 gap-6 ">
          <div className="flex flex-col gap-6">
            <FormCard id="accommodation-head" title={item.title || '...'} defaultOpen={true}
              icon={(<i className="fa-solid fa-hotel"></i>)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='col-span-full grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='col-span-3'>
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
                  </div>
                  <div className='col-span-1'>
                    <label className="mb-3 block text-sm text-center font-medium text-black dark:text-white">
                      {t('Active/Passive?')}
                    </label>
                    <div className='flex w-full h-full justify-center'>
                      <SwitchPassive
                        defaultValue={item.passive}
                        onSwitch={async (e) => {
                          setItem({ ...item, passive: e })
                          await saveItem({ passive: e })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-span-full grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <SelectWithLabel
                    selectClassName='capitalize'
                    readOnly={formStatus == FormStatus.view}
                    label={t('Property type')}
                    onBlur={async (e) => {
                      if (item.propertyType != e.target.value) {
                        setItem({ ...item, propertyType: e.target.value })
                        await saveItem({ propertyType: e.target.value })
                      }
                    }}
                  >
                    {PROPERTY_TYPES.map((propertyType: string, index: number) => (
                      <option key={index} value={propertyType}>{t(propertyType)}</option>
                    ))}
                  </SelectWithLabel>

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
                <div className='col-span-full grid grid-cols-1 md:grid-cols-6 gap-4'>
                  <SelectWithLabel
                    className='col-span-2'
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
                    className='col-span-4'
                    readOnly={formStatus == FormStatus.view}
                    label={t('Address')}
                    defaultValue={item.addressText}
                    // onFocus={(e) => setFocusText(e.target.value)}
                    onBlur={async (e) => {
                      if (e.target.value != item.addressText) {
                        setItem({ ...item, addressText: e.target.value })
                        await saveItem({ addressText: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
            </FormCard>
          </div>
          {item._id && <>
            <FormCard id="tours-images" title={t('Images')}
              defaultOpen={false}
              icon={(<i className="fa-regular fa-images"></i>)}
            >
              <ImageListWidget
                title={t('Images')}
                images={item.images as ImageItemProps[]}
                saveImages={(imgList: any) => {
                  item.images = imgList
                  setItem(item)
                  saveItem({ images: imgList })
                }}
                uploadFolder={'hotel-images/'}
                readOnly={formStatus == FormStatus.view}
              />
            </FormCard>
            <FormCard id="accommodation-description" title={t('Description')} defaultOpen={false}>
              <div className="grid grid-cols-1 gap-4">
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
            <FormCard id="accommodation-features" title={t('Features')} defaultOpen={false}
            >
              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                <FormCard id="accommodation-distance-from" title={t('Distance from')} defaultOpen={false}>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      className='text-sm'
                      placeholder={t('Location')}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value != focusText) {

                        }
                      }} />
                    <Input
                      className='text-sm'
                      placeholder={t('Kilometers')}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value != focusText) {

                        }
                      }} />
                    <Input
                      className='text-sm'
                      placeholder={t('Minutes')}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value != focusText) {

                        }
                      }} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      className='text-sm'
                      placeholder={t('Location')}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value != focusText) {

                        }
                      }} />
                    <Input
                      className='text-sm'
                      placeholder={t('Kilometers')}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value != focusText) {

                        }
                      }} />
                    <Input
                      className='text-sm'
                      placeholder={t('Minutes')}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value != focusText) {

                        }
                      }} />
                  </div>
                </FormCard>
              </div>
            </FormCard>
          </>}

          <div className='flex flex-row mt-10'>
            <button
              className='p-2 border border-stroke dark:border-strokedark rounded-md bg-red text-white'
              onClick={(e) => {
                if (confirm(t(`${item?.title}\n\nDo you want to remove?`))) {
                  deleteItem(`/admin/accommodations/${item?._id}`, token)
                    .then(() => {
                      location.href = '/accommodations'
                    }).catch(err => alert(err))
                }
              }}>
              <i className="fa-regular fa-trash-can"></i> Delete
            </button>
          </div>
        </div>
      }
    </>
  )
}

export default AccommodationPageDetail
