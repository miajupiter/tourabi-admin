"use client"

import React, { FC, useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/components/Editor/AliAbiMDXEditor'
import FormCard, { FormCardType } from '@/components/FormCard'
import { TravelPlan } from './TravelPlan'
import SwitchPassive from '@/components/SwitchPassive'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/components/InputWithLabel'
import ImageListWidget, { ImageItemProps } from '@/widgets/ImageListWidget'
import { useLogin, UserRole } from '@/hooks/useLogin'
import SelectWithLabel from '@/components/SelectWithLabel'
import { CurrencyType, CurrencyTypeList } from '@/lib/priceHelper'
import { eventLog } from '@/lib/developerHelper'
import { Input } from '@/components/Input'
import { getItem, deleteItem, putItem } from '@/lib/fetch'
import Switch from '@/components/Switch'
import Link from 'next/link'
export interface TourPageDetailProps {
  params: { slug: string | [] }
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
  travelOptions: {
    normal: boolean,
    economy: boolean,
    comfort: boolean,
    singleSupplement: boolean
  }
  // singleSupplement?: number
  // pricePerPerson: {
  //   person1: { eco: Number, com: Number },
  //   person2: { eco: Number, com: Number },
  //   person3: { eco: Number, com: Number },
  //   person4: { eco: Number, com: Number },
  //   singleSupplement: { eco: Number, com: Number },
  // }
  groupMin?: number,
  groupMax?: number,
  inclusions?: string
  exclusions?: string
  passive?: boolean

}

const mdxKod = '--1--1'

const TourPageDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { token, user } = useLogin()
  const { t } = useLanguage()


  const { slug } = params
  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<TourItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')



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
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '', _id: '' } as TourItemType)
      } else {
        setFormStatus(params.slug[0] == 'edit' ? FormStatus.edit : FormStatus.view)
        getItem(`/admin/tours/${params.slug[1]}`, token)
          .then(data => setItem(data))
          .catch(err => console.log('err:', err))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, formStatus, slug])


  return (
    <>
      <PageHeader
        pageTitle={formTitle()}
        breadcrumbList={[
          { href: '/', pageTitle: 'Dashboard' },
          { href: '/tours', pageTitle: 'Tours' },
          params.slug.length >= 2 && { href: `/tours/` + params.slug[1], pageTitle: 'Tour Item' }
        ]}
        icon={(<i className='fa-solid fa-route'></i>)}
      />

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

            <FormCard id="tours-prices" title={`${t('List Prices')} | ${t('Calculations')} | ${t('Groups')}`}
              defaultOpen={false} icon={(<i className="fa-solid fa-money-check-dollar"></i>)}
              bodyClassName='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4'
            >
              {/* <!-- List Price --> */}
              <FormCard id="tours-list-prices" title={t('List prices')}
                bodyClassName='grid grid-cols-1 gap-4' cardType={FormCardType.STATIC} >
                <SelectWithLabel label={t('Currency')}
                  readOnly={formStatus == FormStatus.view}
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
                <Link
                  href={`/tours/${params.slug}/expeditions`}
                  className=''
                 >
                  Tur Seferleri (Tour Expeditions)
                </Link>

              </FormCard>
              {/* <!-- END Group Size --> */}

              {/* <!-- Price per person --> */}
              <FormCard id="tours-travel-options" title={t('Travel Options')}
                bodyClassName='grid grid-cols-3 gap-4' cardType={FormCardType.STATIC} >
                <div className='flex flex-row items-center'>
                  <label>{t('Normal')}</label>
                  <Switch
                    defaultValue={item.travelOptions.normal}
                    onSwitch={(e) => {
                      item.travelOptions.normal = e
                      setItem({ ...item, travelOptions: item.travelOptions })
                      saveItem({ ...item, travelOptions: item.travelOptions })
                    }}
                  />
                </div>
                <div className='flex flex-row items-center'>
                  <label>{t('Economy')}</label>
                  <Switch
                    defaultValue={item.travelOptions.economy}
                    onSwitch={(e) => {
                      item.travelOptions.economy = e
                      setItem({ ...item, travelOptions: item.travelOptions })
                      saveItem({ ...item, travelOptions: item.travelOptions })
                    }}
                  />
                </div>
                <div className='flex flex-row items-center'>
                  <label>{t('Comfort')}</label>
                  <Switch
                    defaultValue={item.travelOptions.comfort}
                    onSwitch={(e) => {
                      item.travelOptions.comfort = e
                      setItem({ ...item, travelOptions: item.travelOptions })
                      saveItem({ ...item, travelOptions: item.travelOptions })
                    }}
                  />
                </div>
                <div className='flex flex-row items-center'>
                  <label>{t('Single Supplement')}</label>
                  <Switch
                    defaultValue={item.travelOptions.singleSupplement}
                    onSwitch={(e) => {
                      item.travelOptions.singleSupplement = e
                      setItem({ ...item, travelOptions: item.travelOptions })
                      saveItem({ ...item, travelOptions: item.travelOptions })
                    }}
                  />
                </div>
              </FormCard>
              {/* <!-- END Price per person --> */}

            </FormCard>

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

          <div className='flex flex-row'>
            <button
              className='p-2 border border-stroke dark:border-strokedark rounded-md bg-red text-white'
              onClick={(e) => {
                if (confirm(t(`${item?.title}\n\nDo you want to remove?`))) {
                  deleteItem(`/tours/${item?._id}`, token)
                    .then(() => {
                      location.href = '/tours'
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

export default TourPageDetail
