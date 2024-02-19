"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'
import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/app/(panel)/PageHeader'
import { AliAbiMDXEditor } from '@/widgets/Editor/AliAbiMDXEditor'
import Link from 'next/link'
import FormCard from '@/components/FormCard'
import "./TourPageDetail.css"
import useNcId from '@/hooks/useNcId'
import { v4 } from 'uuid'

export interface TourPageDetailProps {
  params: { slug: string[] }
}

export enum FormStatus {
  new = 'new',
  edit = 'edit',
  view = 'view',
}

export interface TourItemType {
  id?: string
  title?: string
  description?: string
  duration?: number
  places?: string
  images?: StaticImageData[] | []
  priceTable?: any[]
  travelPlan?: any[]
  currency?: string
  price?: number
  singleSupplement?: number
  inclusions?: string
  exclusions?: string

}


export function manipulateMDX(text: string) {
  return text
  // return text.replace(/\n\n/g,'\n')
}

const TourPageDetail: FC<TourPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<TourItemType>()
  // const [itemOld, setItemOld] = useState<TourItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState(FormStatus.new)
  const [formTitle, setFormTitle] = useState('')
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')
  const [deletingIndex, setDeletingIndex] = useState(-1)

  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${itemId}`, {
      headers: {
        'Content-Type': 'application/json', token: token
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
          // setItemOld(item)
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item?.id}?partial=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        console.log('saveItem result:', result)
        if (result.success && result.data) {

        }
      }).catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '' } as TourItemType)
        // setItemOld(item)
        setFormTitle(t('New tour'))
      } else if (params.slug[0] == 'edit') {
        setFormStatus(FormStatus.edit)
        setFormTitle(t('Edit tour'))
        getItem(params.slug[1])
      } else if (params.slug[0] == 'view') {
        setFormStatus(FormStatus.view)
        setFormTitle(t('View tour'))
        getItem(params.slug[1])
      }
    }
  }, [t, item])

  // }, [t, item, pullData, formStatus, formTitle, deletingIndex])
  // }, [t, item, pullData, formStatus, formTitle, partialData,countDown,sayac])

  useEffect(() => {
  }, [deletingIndex])

  return (
    <>

      <PageHeader pageTitle={formTitle} breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/tours', pageTitle: 'Tours' },
        params.slug.length >= 2 && { href: `/tours/` + params.slug[1], pageTitle: 'Tour Item' }
      ]} />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">


            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Title')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Title')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.title}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, title: e.target.value })}
                    onBlur={(e) => {
                      if (e.target.value != focusText) {
                        // setItemOld({ ...itemOld, title: item.title })
                        saveItem({ title: item.title })
                      }
                    }}
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
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, places: e.target.value })}
                    onBlur={(e) => {
                      if (e.target.value != focusText) {
                        saveItem({ places: item.places })
                      }
                    }}
                  />
                </div>

                {/* <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {t('Description')}
                  </label>
                  <AliAbiMDXEditor markdown={item.description || ''}
                    readOnly={formStatus == FormStatus.view}
                    onChange={(markdown) => setFocusMarkDown(markdown)}
                    onBlur={(e) => {
                      if (focusMarkDown != item?.description) {
                        setItem({ ...item, description: focusMarkDown })
                        setFocusMarkDown('')
                        saveItem({ description: item.description })
                      }
                    }}
                  />

                </div> */}


              </div>
            </div>
            <FormCard id="tours-description" title={t('Description')}
              defaultOpen={false}
            >
              <div className="grid grid-cols-1  gap-5.5 p-5">
                {/* <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  {t('Description')}
                </label> */}
                <AliAbiMDXEditor markdown={item.description || ''}
                  readOnly={formStatus == FormStatus.view}
                  onChange={(markdown) => setFocusMarkDown(markdown)}
                  onBlur={(e) => {
                    if (focusMarkDown != item?.description) {
                      setItem({ ...item, description: focusMarkDown })
                      setFocusMarkDown('')
                      saveItem({ description: item.description })
                    }
                  }}
                />
              </div>
            </FormCard>

            <FormCard id="tours-travelplan" title={t('Travel plan')}
              defaultOpen={false}
              icon={(<i className="fa-solid fa-list-ol"></i>)}
            >
              <div className="grid grid-cols-1 gap-5.5 p-5">
                <div >
                  {item.travelPlan && item.travelPlan.map((plan: any, index: number) =>
                    <div key={'tours-travel-plan' + v4()} className={`w-full mt-3   rounded-[4px] p-4 bg-opacity-5 ${index % 2 == 0 ? 'bg-slate-600' : 'bg-amber-600'}
                      ${deletingIndex == index ? 'rotate-6' : ''}
                      `}>
                      <div className='relative flex items-start'>
                        <div className='flex flex-col w-24 mt-3 space-y-4'>
                          <label className="flex items-center">
                            <span className='text-2xl me-2'> {index + 1}. </span>
                            <span className='text-sm'>{t('day')}</span>
                          </label>

                          <button className={`:not(:disabled):hover:text-primary disabled:text-neutral-600 text-xl ms-auto me-2 w-10 `} title={t('Move up')}
                            disabled={index == 0}
                          >
                            <i className="fa-solid fa-arrow-up "></i>
                          </button>
                          <button className={`:not(:disabled):hover:text-primary disabled:text-neutral-600 text-xl ms-auto me-2 w-10 `} title={t('Move down')}
                            disabled={index == (item.travelPlan || []).length - 1}
                          >
                            <i className="fa-solid fa-arrow-down"></i>
                          </button>
                        </div>
                        <button className="absolute bottom-0 start-0 text-red disabled:text-opacity-25 :not(:disabled):hover:text-primary" title={t('Delete')}
                          // disabled={!((plan.title || '').trim() == '' && (plan.destination || '').trim() == '')}
                          onClick={(e) => {
                            if (confirm(t(`do you want delete?\n\n${plan.title}`))) {
                              if (item.travelPlan && item.travelPlan[index]) {
                                setDeletingIndex(index)
                                console.log('item.travelPlan.length1:', item.travelPlan.length)
                                // delete item.travelPlan[index]
                                item.travelPlan.splice(index, 1)
                                setItem(item)
                                saveItem({ travelPlan: item.travelPlan })
                                // setPullData(false)
                                setDeletingIndex(-1)
                              }
                            }
                            // setDeletingIndex(index)
                            // setTimeout(() => {
                            //   if (confirm(t('do you want delete?'))) {
                            //     let copyList=item.travelPlan || [];
                            //     copyList.splice(index, 1)

                            //     setItem({...item, travelPlan:copyList})
                            //     setTimeout(()=>{
                            //       saveItem({ travelPlan: item.travelPlan })
                            //       setDeletingIndex(-1)
                            //     },10)
                            //   }else{
                            //     setDeletingIndex(-1)
                            //   }
                            // }, 10)
                          }}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                        <div className='w-full'>
                          <input
                            type="text"
                            placeholder={t('Title')}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-transparent dark:text-white dark:focus:border-primary"
                            defaultValue={plan.title}
                            onFocus={(e) => setFocusText(e.target.value)}
                            onChange={(e) => {
                              if (item.travelPlan && item.travelPlan[index] && item.travelPlan[index].title != undefined) {
                                item.travelPlan[index].title = e.target.value
                                setItem(item)
                              }
                            }}
                            onBlur={(e) => {
                              if (focusText != e.target.value) {
                                // setItemOld(item)
                                saveItem({ travelPlan: item.travelPlan })
                              }
                            }}
                          />
                          <textarea
                            rows={4}
                            placeholder={t('Description')}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-slate-500 dark:bg-transparent dark:text-white dark:focus:border-primary"
                            defaultValue={plan.description}
                            onFocus={(e) => setFocusText(e.target.value)}
                            onChange={(e) => {
                              if (item.travelPlan && item.travelPlan[index] && item.travelPlan[index].description != undefined) {
                                item.travelPlan[index].description = e.target.value
                                setItem(item)
                              }
                            }}
                            onBlur={(e) => {

                              if (focusText != e.target.value) {
                                // setItemOld(item)
                                saveItem({ travelPlan: item.travelPlan })
                              }
                            }}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className='text-center'>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center border rounded-md bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 "
                    onClick={(e) => {
                      if (!item.travelPlan)
                        item.travelPlan = []
                      item.travelPlan.push({
                        title: `New plan title ${item.travelPlan.length + 1}`,
                        description: ''
                      })
                      setItem({ ...item, travelPlan: item.travelPlan })
                    }}
                  >
                    {t('Add Travel Plan')}
                  </Link>
                </div>
              </div>
            </FormCard>

            <FormCard id="tours-inclusions" title={t('Inclusions')}
              defaultOpen={false}
              icon={(<i className="fa-regular fa-square-plus"></i>)}
            >
              <div className="grid grid-cols-1  gap-5.5 p-5">

                <AliAbiMDXEditor markdown={item.exclusions || ''}
                  readOnly={formStatus == FormStatus.view}
                  onChange={(markdown) => setFocusMarkDown(markdown)}
                  onBlur={(e) => {
                    if (focusMarkDown != item?.exclusions) {
                      setItem({ ...item, exclusions: focusMarkDown })
                      setFocusMarkDown('')
                      saveItem({ inclusions: item.exclusions })
                    }
                  }}
                />
              </div>
            </FormCard>

            <FormCard id="tours-exclusions" title={t('Exclusions')}
              defaultOpen={false}
              icon={(<i className="fa-regular fa-square-minus"></i>)}
            >
              <div className="grid grid-cols-1 gap-5.5 p-5">

                <AliAbiMDXEditor markdown={item.exclusions || ''}
                  readOnly={formStatus == FormStatus.view}
                  onChange={(markdown) => setFocusMarkDown(markdown)}
                  onBlur={(e) => {
                    if (focusMarkDown != item?.exclusions) {
                      setItem({ ...item, exclusions: focusMarkDown })
                      setFocusMarkDown('')
                      saveItem({ inclusions: item.exclusions })
                    }
                  }}
                />


              </div>
            </FormCard>

          </div>

        </div>
      }
    </>
  )
}

export default TourPageDetail
