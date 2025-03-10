"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'
import { countries } from 'country-list-json'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/others/PageHeader'
import FormCard from '@/aliabi/FormCard'
import { ImageItemProps, ImageListWidget } from '@/aliabi/ImageListWidget'
import Switch from '@/aliabi/Switch'
import SwitchPassive from '@/aliabi/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/aliabi/InputWithLabel'
import SelectWithLabel from '@/aliabi/SelectWithLabel'
import { useLogin } from '@/hooks/useLogin'
import { deleteItem } from '@/lib/fetch'
import { AliAbiMDXEditor } from '@/aliabi/Editor/AliAbiMDXEditor'
// import {MdEditor } from '@/aliabi/MdEditor/MdEditor'

export interface LocationPageDetailProps {
  params: { slug: string[] }
}



export interface LocationItemType {
  _id?: string
  title?: string
  description?: string
  destination?: string
  country?: string
  images?: StaticImageData[] | []

  passive?: boolean
}

const mdxKod = '--1--1'

const LocationPageDetail: FC<LocationPageDetailProps> = ({ params }) => {

  const { token } = useLogin()
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)
  const [destinationList, setDestinationList] = useState([])
  const [item, setItem] = useState<LocationItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')

  const getItem = (itemId: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/locations/${itemId}`, {
      headers: { 'Content-Type': 'application/json', token: token },
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          setItem(result.data)
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/locations/${item?._id}?partial=true`, {
      method: item?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success) {
          setItem({ ...item, ...(result.data || {}) })
          if (formStatus == FormStatus.new && item?._id) {
            setFormStatus(FormStatus.edit)
          }
          resolve(item)
        } else {
          reject(result.error)
        }
      }).catch((err: any) => {
        reject(err.message || err)
      })
  })

  const getDestinationList = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations`, {
      method: 'SEARCH',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify({ select: '_id title', limit: 200 })
    })
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        setDestinationList(result.data.docs)
      } else alert(result.error)
    } else alert(response.statusText)
  }
  const formTitle = () => {
    switch (formStatus) {
      case FormStatus.new:
        return t('New location')
      case FormStatus.edit:
        return t('Edit location')
      case FormStatus.view:
        return t('View location')
    }
    return ''
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      getDestinationList()
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, destination: '', title: 'yeni', _id: '' } as LocationItemType)
      } else if (params.slug[0] == 'edit') {
        setFormStatus(FormStatus.edit)
        getItem(params.slug[1])
      } else if (params.slug[0] == 'view') {
        setFormStatus(FormStatus.view)
        getItem(params.slug[1])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      <PageHeader
        pageTitle={formTitle()}
        breadcrumbList={[
          { href: '/', pageTitle: 'Dashboard' },
          { href: '/locations', pageTitle: 'Locations' },
          params.slug.length >= 2 && { href: `/locations/` + params.slug[1], pageTitle: 'Location Item' }
        ]}
        icon={(<i className="fa-solid fa-mountain-city"></i>)}
      />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-[8px] border border-stroke shadow-default dark:border-strokedark">
              <div className="grid grid-cols-1 gap-4 p-4">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <SelectWithLabel
                    readOnly={formStatus == FormStatus.view}
                    label={t('Destination')}
                    onBlur={async (e) => {
                      if (item.destination != e.target.value) {
                        setItem({ ...item, destination: e.target.value })
                        if (item._id) {
                          saveItem({ destination: e.target.value })
                        }
                      }
                    }}
                  >
                    {destinationList.map((e: any, index: number) => (
                      <option key={index} value={e._id}>{e.title}</option>
                    ))}
                  </SelectWithLabel>
                  <SelectWithLabel
                    readOnly={formStatus == FormStatus.view}
                    label={t('Country')}
                    onBlur={async (e) => {
                      if (item.country != e.target.value) {
                        setItem({ ...item, country: e.target.value })
                        if (item._id) {
                          saveItem({ country: e.target.value })
                        }
                      }
                    }}
                  >
                    {countries.map((ulke, index) => (
                      <option key={index} value={ulke.code}>{ulke.name}</option>
                    ))}
                  </SelectWithLabel>
                </div>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex flex-row'>
                    <InputWithLabel className='basis-4/5'
                      readOnly={formStatus == FormStatus.view}
                      label={t('Title')}
                      defaultValue={item.title}
                      onBlur={async (e) => {
                        if (item.title != e.target.value) {
                          setItem({ ...item, title: e.target.value })
                          if (item._id) {
                            saveItem({ title: e.target.value })
                          } else {
                            saveItem(item)
                          }
                        }
                      }}
                    />
                    <div className='basis-1/5'>
                      <label className="mb-3 block text-sm text-center font-medium text-black dark:text-white">
                        {t('Passive?')}
                      </label>
                      <div className='flex w-full h-full justify-center'>
                        <SwitchPassive
                          defaultValue={item.passive}
                          onSwitch={async (e) => {
                            setItem({ ...item, passive: e })
                            saveItem({ passive: e })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {item._id && <>
              <FormCard id="location-images" title={t('Images')} defaultOpen={false}
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
                  uploadFolder={'locations/'}
                  readOnly={formStatus == FormStatus.view}
                />
              </FormCard>

              <FormCard id="location-description" title={t('Description')}
                defaultOpen={false}
                bodyClassName='px-2 py-2'
              >
                <AliAbiMDXEditor
                  markdown={item.description || ''}
                  onChange={(markdown: string) => setFocusMarkDown(markdown)}
                  onBlur={async (e: FocusEvent) => {
                    if (focusMarkDown != mdxKod && focusMarkDown != (item.description || '')) {
                      item.description = focusMarkDown
                      setItem(item)
                      setFocusMarkDown(mdxKod)
                      await saveItem({ description: item.description })
                    }
                  }}
                />
              </FormCard>
            </>}
          </div>

          <div className='flex flex-row mt-10'>
            <button
              className='p-2 border border-stroke dark:border-strokedark rounded-md bg-red text-white'
              onClick={(e) => {
                if (confirm(t(`${item?.title}\n\nDo you want to remove?`))) {
                  deleteItem(`/admin/locations/${item?._id}`, token)
                    .then(() => {
                      location.href = '/locations'
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

export default LocationPageDetail
