"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/components/Editor/AliAbiMDXEditor'
import Link from 'next/link'
import FormCard from '@/components/FormCard'
import { DestinationImages } from './DestinationImages'
import Switch from '@/components/Switch'
import SwitchPassive from '@/components/SwitchPassive'
import { FormStatus } from '@/types/formStatus'

export interface DestinationPageDetailProps {
  params: { slug: string[] }
}



export interface DestinationItemType {
  _id?: string
  title?: string
  description?: string

  country?: string
  images?: StaticImageData[] | []

  passive?: boolean
}

const mdxKod = '--1--1'

const DestinationPageDetail: FC<DestinationPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<DestinationItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')


  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations/${itemId}`, {
      headers: { 'Content-Type': 'application/json', token: token },
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          var res = result.data as DestinationItemType
          var destination = {
            _id: res._id,
            title: res.title,
            description: res.description,
            country: res.country,
            images: res.images,
            passive: res.passive
          } as DestinationItemType
          setItem(destination)
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    const token = localStorage.getItem('token') || ''
    console.log(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations/${item?._id}?partial=true`)
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/destinations/${item?._id}?partial=true`, {
      method: item?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        console.log('saveItem result:\n', result)
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
  }, [t, item, pullData,getItem])


  return (
    <>

      <PageHeader pageTitle={formTitle()} breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/destinations', pageTitle: 'Destinations' },
        params.slug.length >= 2 && { href: `/destinations/` + params.slug[1], pageTitle: 'Destination Item' }
      ]} />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-5">
                <div className='flex'>
                  <div className='flex-auto'>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Title')}
                    </label>
                    <input
                      readOnly={formStatus == FormStatus.view}
                      type="text"
                      placeholder={t('Title')}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      defaultValue={item.title}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onChange={(e) => setItem({ ...item, title: e.target.value })}
                      onBlur={async (e) => {
                        if (e.target.value != focusText) {
                          await saveItem({ title: item.title })
                        }
                      }}
                    />
                  </div>
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
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Country')}
                  </label>
                  <input
                    readOnly={formStatus == FormStatus.view}
                    type="text"
                    placeholder={t('Country')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.country}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, country: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ country: item.country })
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {item._id && <>
              <DestinationImages item={item} setItem={setItem} saveItem={saveItem} readOnly={formStatus == FormStatus.view} />

              <FormCard id="destination-description" title={t('Description')}
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

export default DestinationPageDetail
