"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData, } from 'next/image'
import PageHeader from '@/components/others/PageHeader'

import Link from 'next/link'
import FormCard from '@/aliabi/FormCard'
import { ImageItemProps, ImageListWidget } from '@/aliabi/ImageListWidget'
import Switch from '@/aliabi/Switch'
import SwitchPassive from '@/aliabi/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/aliabi/InputWithLabel'
import SelectWithLabel from '@/aliabi/SelectWithLabel'
import { useLogin } from '@/hooks/useLogin'
import { deleteItem } from '@/lib/fetch'
import { countries } from 'country-list-json'
import { MdEditor } from '@/aliabi/MdEditor/MdEditor'
import { AliAbiMDXEditor } from '@/aliabi/Editor/AliAbiMDXEditor'

export interface DestinationPageDetailProps {
  params: { slug: string[] }
}



export interface DestinationItemType {
  _id?: string
  title?: string
  description?: string

  country?: string
  images: ImageItemProps[]

  passive?: boolean
}

const mdxKod = '--1--1'

const DestinationPageDetail: FC<DestinationPageDetailProps> = ({ params }) => {
  const { token } = useLogin()
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<DestinationItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')


  const getItem = (itemId: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations/${itemId}`, {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations/${item?._id}?partial=true`, {
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
        return t('New destination')
      case FormStatus.edit:
        return t('Edit destination')
      case FormStatus.view:
        return t('View destination')
    }
    return ''
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '', _id: '' } as DestinationItemType)
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
          { href: '/destinations', pageTitle: 'Destinations' },
          params.slug.length >= 2 && { href: `/destinations/` + params.slug[1], pageTitle: 'Destination Item' }
        ]}
        icon={(<i className="fa-solid fa-map-location-dot"></i>)}
      />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <FormCard id="destination-head" title={item.title || '...'} defaultOpen={true}
              icon={(<i className="fa-solid fa-map-location-dot"></i>)}
            >
              <div className="grid grid-cols-1 gap-4">
                <div className='flex flex-row'>
                  <InputWithLabel className='basis-4/5'
                    readOnly={formStatus == FormStatus.view}
                    label={t('Title')}
                    defaultValue={item.title}
                    onBlur={async (e) => {
                      if (item.title != e.target.value) {
                        setItem({ ...item, title: e.target.value })
                        await saveItem({ title: e.target.value })
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
                          await saveItem({ passive: e })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5.5'>
                  <SelectWithLabel
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
                </div>
              </div>
            </FormCard>
            {item._id && <>
              <FormCard id="destination-images" title={t('Images')} defaultOpen={false}
                icon={(<i className="fa-regular fa-images"></i>)}
              >
                <ImageListWidget
                  title={t('Images')}
                  images={item.images as ImageItemProps[]}
                  saveImages={(imgList: any) => {
                    if (!item.images) item.images = []

                    item.images = imgList
                    setItem(item)
                    saveItem({ images: imgList })
                  }}
                  uploadFolder={'destinations/'}
                  readOnly={formStatus == FormStatus.view} />
              </FormCard>

              <FormCard id="destination-description" title={t('Description')}
                defaultOpen={false}
                bodyClassName='px-2 py-2'
              >
                <AliAbiMDXEditor
                  markdown={item.description || ''}
                  onChange={(markdown: string) => setFocusMarkDown(markdown)}
                  onBlur={async (e: FocusEvent) => {
                    if (focusMarkDown!=mdxKod && focusMarkDown != (item.description || '')) {
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
        </div>
      }
      <div className='flex flex-row mt-10'>
        <button
          className='p-2 border border-stroke dark:border-strokedark rounded-md bg-red text-white'
          onClick={(e) => {
            if (confirm(t(`${item?.title}\n\nDo you want to remove?`))) {
              deleteItem(`/admin/destinations/${item?._id}`, token)
                .then(() => {
                  location.href = '/destinations'
                }).catch(err => alert(err))
            }
          }}>
          <i className="fa-regular fa-trash-can"></i> Delete
        </button>
      </div>
    </>
  )
}

export default DestinationPageDetail
