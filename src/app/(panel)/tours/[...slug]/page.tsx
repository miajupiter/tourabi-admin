"use client"

import React, { FC, useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/components/Editor/AliAbiMDXEditor'
import FormCard from '@/components/FormCard'
import { TravelPlan } from './TravelPlan'
import SwitchPassive from '@/components/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/components/InputWithLabel'
import ImageListWidget, { ImageItemProps } from '@/widgets/ImageListWidget'
import { useLogin, UserRole } from '@/hooks/useLogin'
import SelectWithLabel from '@/components/SelectWithLabel'
import { CurrencyType, CurrencyTypeList } from '@/lib/priceHelper'
import { eventLog } from '@/lib/developerHelper'
import { tabNext } from '@/lib/util'

export interface TourPageDetailProps {
  params: { slug: string | [] }
}

export interface I18nProps {
  lastTranslated?: any
  en: { title: String, description: String }
  tr: { title: String, description: String }
  ru: { title: String, description: String }
  de: { title: String, description: String }
  es: { title: String, description: String }
  ko: { title: String, description: String }
  fr: { title: String, description: String }
  zh: { title: String, description: String }
}
export interface TourItemType {
  _id?: string
  title?: string
  description?: string
  duration?: number
  places?: string
  images?: StaticImageData[] | []
  // tempImages?: StaticImageData[] | []
  priceTable?: any[]
  travelPlan?: any[]
  currency?: CurrencyType | string

  priceWithoutDiscount?: number
  price?: number
  singleSupplement?: number
  inclusions?: string
  exclusions?: string
  passive?: boolean

  // <!-- developer image & tranlate -->
  i18n: I18nProps | any
  temp: any
}

const mdxKod = '--1--1'

const TourPageDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()
  const { user } = useLogin()

  const { slug } = params
  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<TourItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')


  function getItem(itemId: string) {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${itemId}`, {
      headers: { 'Content-Type': 'application/json', token: token },
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          var res = result.data as TourItemType
          var tour = {
            _id: res._id,
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
            passive: res.passive
          } as TourItemType
          setItem(tour)
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    const token = localStorage.getItem('token') || ''

    const times: number[] = []
    const fieldName = data && Object.keys(data || {})[0] || 'if ? there must be a problem here'
    const analuciator = (note?: string) => {
      times.push(new Date().getDate())
      eventLog(fieldName, (note || ''), `t-${times.length}:`, times[times.length - 1])
    }
    analuciator('start')

    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item?._id}?partial=true`, {
      method: item?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => {
        analuciator('fetch1')
        return ret.json()
      })
      .then(result => {
        analuciator('fetch2')

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
        analuciator('fetchErr:')
        console.error(err)
        reject(err.message || err)
      })
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
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '', _id: '' } as TourItemType)

      } else if (params.slug[0] == 'edit') {
        setFormStatus(FormStatus.edit)

        getItem(params.slug[1])
      } else if (params.slug[0] == 'view') {
        setFormStatus(FormStatus.view)

        getItem(params.slug[1])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, formStatus, slug])


  return (
    <>
      <PageHeader pageTitle={formTitle()} breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/tours', pageTitle: 'Tours' },
        params.slug.length >= 2 && { href: `/tours/` + params.slug[1], pageTitle: 'Tour Item' }
      ]} />

      {item &&
        <div className="grid grid-cols-1 gap-6 ">
          <div className="flex flex-col gap-6">
            <FormCard id="tours-head" title={item.title || '...'} defaultOpen={true}
              icon={(<i className="fa-solid fa-earth-asia"></i>)}
            >
              <div className="grid grid-cols gap-4">
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='col-span-3'>
                    <InputWithLabel
                      readOnly={formStatus == FormStatus.view}
                      label={t('Title')}
                      defaultValue={item.title}
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
                <InputWithLabel
                  readOnly={formStatus == FormStatus.view}
                  label={t('Places')}
                  defaultValue={item.places}
                  onBlur={async (e) => {
                    if (e.target.value != item.places) {
                      setItem({ ...item, places: e.target.value })
                      await saveItem({ places: e.target.value })
                    }
                  }}
                />

              </div>
            </FormCard>
            <FormCard id="tours-prices" title={t('Prices')}
              defaultOpen={false} icon={(<i className="fa-solid fa-money-check-dollar"></i>)} >
              <div className='flex flex-col space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <SelectWithLabel
                    label={t('Currency')}
                    readOnly={formStatus == FormStatus.view}

                    defaultValue={item.currency || CurrencyType.USD}
                    onBlur={async (e) => {
                      if (e.target.value != item.currency) {
                        setItem({ ...item, currency: e.target.value })
                        saveItem({ currency: e.target.value })
                      }
                    }}
                  >
                    {CurrencyTypeList.map((e, index) => <>
                      <option key={index} value={e}>{e}</option>
                    </>)}
                  </SelectWithLabel>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type='number'
                    label={t('Price')}
                    title={t('Real price or discounted price.')}
                    defaultValue={item.priceWithoutDiscount}
                    min={0}
                    enterKeyHint='next'
                    onBlur={async (e) => {
                      if (item.priceWithoutDiscount && e.target.value) {
                        setItem({ ...item, priceWithoutDiscount: Number(e.target.value) })
                        saveItem({ priceWithoutDiscount: Number(e.target.value) })
                      }
                    }}
                  />
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type='number'
                    label={t('Price without discount')}
                    title={t('Ineffective price. It is used to show the user a crossed-out high price.')}
                    labelClassName='line-through'
                    defaultValue={item.priceWithoutDiscount}
                    min={0}
                    onBlur={async (e) => {
                      if (item.priceWithoutDiscount && e.target.value) {
                        setItem({ ...item, priceWithoutDiscount: Number(e.target.value) })
                        saveItem({ priceWithoutDiscount: Number(e.target.value) })
                      }
                    }}

                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type='number'
                    label={t('Single supplement')}
                    defaultValue={item.singleSupplement}
                    min={0}
                    onBlur={async (e) => {
                      if (item.singleSupplement && e.target.value) {
                        setItem({ ...item, singleSupplement: Number(e.target.value) })
                        saveItem({ singleSupplement: Number(e.target.value) })
                      }
                    }}
                  />


                </div>
              </div>
            </FormCard>
            {user && user.role === UserRole.DEVELOPER && <>
              <FormCard id="tours-developer" title={t('Developer')} defaultOpen={false}            >
                <div className='grid grid-cols-1 gap-4'>
                  user role:{user && user.role}
                </div>
              </FormCard>
            </>}
          </div>
          {item._id && <>
            <FormCard id="tours-images" title={t('Images')} defaultOpen={false}
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
                uploadFolder={'tour-images002/'}
                readOnly={formStatus == FormStatus.view}
              />
            </FormCard>

            <FormCard id="tours-description" title={t('Description')}
              defaultOpen={false}
            >
              <div className="grid grid-cols-1  gap-4">
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

            <FormCard id="tours-travelplan" title={t('Travel plan')} defaultOpen={false}
              icon={(<i className="fa-solid fa-list-ol"></i>)}
            >
              <TravelPlan item={item} setItem={setItem} saveItem={saveItem} />
            </FormCard>
            <FormCard id="tours-inclusions" title={t('Inclusions')}
              defaultOpen={false}
              icon={(<i className="fa-solid fa-file-circle-plus"></i>)}
            >
              <div className="grid grid-cols-1  gap-4">
                <AliAbiMDXEditor markdown={item.inclusions || ''}
                  readOnly={formStatus == FormStatus.view}
                  onChange={(markdown) => setFocusMarkDown(markdown)}
                  onBlur={async (e) => {
                    if (focusMarkDown != mdxKod && focusMarkDown != item.inclusions) {
                      item.inclusions = focusMarkDown
                      setItem(item)
                      setFocusMarkDown(mdxKod)
                      await saveItem({ inclusions: item.inclusions })
                    }
                  }}
                />

              </div>
            </FormCard>

            <FormCard id="tours-exclusions" title={t('Exclusions')}
              defaultOpen={false}
              icon={(<i className="fa-solid fa-file-circle-minus"></i>)}
            >
              <div className="grid grid-cols-1 gap-4">
                <AliAbiMDXEditor markdown={item.exclusions || ''}
                  readOnly={formStatus == FormStatus.view}
                  onChange={(markdown) => setFocusMarkDown(markdown)}
                  onBlur={async (e) => {
                    if (focusMarkDown != mdxKod && focusMarkDown != item.exclusions) {
                      item.exclusions = focusMarkDown
                      setItem(item)
                      setFocusMarkDown(mdxKod)
                      await saveItem({ exclusions: item.exclusions })
                    }
                  }}
                />
              </div>
            </FormCard>
          </>}
        </div>
      }
    </>
  )
}

export default TourPageDetail
