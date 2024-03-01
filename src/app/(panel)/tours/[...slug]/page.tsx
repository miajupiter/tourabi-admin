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
import PriceTable from './PriceTable'

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
  pricePerPerson: {
    person1: { eco: Number, com: Number },
    person2: { eco: Number, com: Number },
    person3: { eco: Number, com: Number },
    person4: { eco: Number, com: Number },
    singleSupplement: { eco: Number, com: Number },
  }
  groupMin?: number,
  groupMax?: number,
  inclusions?: string
  exclusions?: string
  passive?: boolean

  // <!-- developer image & tranlate -->
  i18n?: I18nProps
  temp?: any
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


  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${itemId}`, {
      headers: { 'Content-Type': 'application/json', token: token },
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          const test = { ...item, ...result.data }
          console.log('result.data:', result.data)
          console.log('testobj:', test)
          setItem({ ...item, ...result.data })
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    const token = localStorage.getItem('token') || ''

    // const times: number[] = []
    // const fieldName = data && Object.keys(data || {})[0] || 'if ? there must be a problem here'
    // const analuciator = (note?: string) => {
    //   times.push(new Date().getDate())
    //   eventLog(fieldName, (note || ''), `t-${times.length}:`, times[times.length - 1])
    // }
    // analuciator('start')


    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item?._id}?partial=true`, {
      method: item?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => {
        console.log('ret.ok:', ret.ok)
        return ret.json()
      })
      .then(result => {

        console.log('fetch bitti:', result)
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
        // analuciator('fetchErr:')
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

            <FormCard id="tours-prices" title={`${t('Prices')} | ${t('Calculations')} | ${t('Groups')}`}
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
                <InputWithLabel
                  readOnly={formStatus == FormStatus.view}
                  type='number'
                  label={t('Single supplement')}
                  defaultValue={Number(item.singleSupplement)}
                  onBlur={async (e) => {
                    if (item.singleSupplement != Number(e.target.value)) {
                      item.singleSupplement = Number(e.target.value)
                      setItem(item)
                      await saveItem({ singleSupplement: item.singleSupplement })
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

              </FormCard>
              {/* <!-- END Group Size --> */}

              {/* <!-- Price per person --> */}
              <FormCard id="tours-price-per-person" title={t('Price per person')}
                bodyClassName='grid grid-cols-3 gap-4' cardType={FormCardType.STATIC} >
                <label htmlFor="">#</label>
                <label htmlFor="">Economy</label>
                <label htmlFor="">Comfort</label>

                <label htmlFor="">1 Person</label>
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  placeholder={t('1 Person Eco')}
                  defaultValue={Number(item.pricePerPerson.person1.eco)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person1.eco != Number(e.target.value)) {
                      item.pricePerPerson.person1.eco = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  placeholder={t('1 Person Com')}
                  defaultValue={Number(item.pricePerPerson.person1.com)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person1.com != Number(e.target.value)) {
                      item.pricePerPerson.person1.com = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />

                <label htmlFor="">2 Person</label>
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  placeholder={t('2 Person Eco')}
                  defaultValue={Number(item.pricePerPerson.person2.eco)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person2.eco != Number(e.target.value)) {
                      item.pricePerPerson.person2.eco = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  placeholder={t('2 Person Com')}
                  defaultValue={Number(item.pricePerPerson.person2.com)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person2.com != Number(e.target.value)) {
                      item.pricePerPerson.person2.com = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <label htmlFor="">3 Person</label>
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  defaultValue={Number(item.pricePerPerson.person3.eco)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person3.eco != Number(e.target.value)) {
                      item.pricePerPerson.person3.eco = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  defaultValue={Number(item.pricePerPerson.person3.com)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person3.com != Number(e.target.value)) {
                      item.pricePerPerson.person3.com = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <label htmlFor="">4 Person</label>
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  defaultValue={Number(item.pricePerPerson.person4.eco)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person4.eco != Number(e.target.value)) {
                      item.pricePerPerson.person4.eco = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  defaultValue={Number(item.pricePerPerson.person4.com)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.person4.com != Number(e.target.value)) {
                      item.pricePerPerson.person4.com = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <label htmlFor="">Single Supplement</label>
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  defaultValue={Number(item.pricePerPerson.singleSupplement.eco)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.singleSupplement.eco != Number(e.target.value)) {
                      item.pricePerPerson.singleSupplement.eco = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
                <Input type='number' readOnly={formStatus == FormStatus.view}
                  defaultValue={Number(item.pricePerPerson.singleSupplement.com)}
                  onBlur={async (e) => {
                    if (item.pricePerPerson.singleSupplement.com != Number(e.target.value)) {
                      item.pricePerPerson.singleSupplement.com = Number(e.target.value)
                      setItem(item)
                      await saveItem({ pricePerPerson: item.pricePerPerson })
                    }
                  }}
                />
              </FormCard>
              {/* <!-- END Price per person --> */}
              <FormCard id="tours-price-table" title={t('Price table')} defaultOpen={false}
                className=' col-span-3'
              >
                <PriceTable item={item} setItem={setItem} saveItem={saveItem} />
              </FormCard>
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
