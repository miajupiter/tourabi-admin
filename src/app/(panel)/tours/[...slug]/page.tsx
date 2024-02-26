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
  currency?: string
  price?: number
  singleSupplement?: number
  inclusions?: string
  exclusions?: string
  passive?: boolean

}

const mdxKod = '--1--1'

const TourPageDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()
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
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item?._id}?partial=true`, {
      method: item?._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        console.log('saveItem result:', result)
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
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="grid grid-cols gap-5.5 p-5">
                <div className='flex'>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type="text"
                    label={t('Title')}
                    defaultValue={item.title}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, title: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ title: item.title })
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
                <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    placeholder={t('Places')}
                    defaultValue={item.places}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, places: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ places: item.places })
                      }
                    }}
                  />

              </div>
            </div>
            {item._id &&
              <>
                <ImageListWidget
                title={t('Images')}
                images={item.images as ImageItemProps[]}
                saveImages={(imgList: any) => {
                  item.images = imgList
                  setItem(item)
                  saveItem({ images: imgList })
                }}
                uploadFolder={'destinations/'}
                readOnly={formStatus == FormStatus.view}
              />
                <FormCard id="debug-console" title={t('debug-console')}
                  defaultOpen={false}
                >
                  <h3 className='text-2xl w-full'>focusMarkDown</h3>
                  <p>{focusMarkDown}</p>
                  <hr />
                  <h3 className='text-2xl w-full'>focusText</h3>
                  <p>{focusText}</p>
                </FormCard>

                <FormCard id="tours-description" title={t('Description')}
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

                {/* Travel Plan List */}
                <TravelPlan item={item} setItem={setItem} saveItem={saveItem} />
                {/* ./Travel Plan List */}
                <FormCard id="tours-inclusions" title={t('Inclusions')}
                  defaultOpen={false}
                  icon={(<i className="fa-solid fa-file-circle-plus"></i>)}
                >
                  <div className="grid grid-cols-1  gap-5.5 p-5">
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
                  <div className="grid grid-cols-1 gap-5.5 p-5">
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

        </div>
      }
    </>
  )
}

export default TourPageDetail
