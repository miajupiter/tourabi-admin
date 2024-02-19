"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/app/(panel)/PageHeader'
import { AliAbiMDXEditor } from '@/widgets/Editor/AliAbiMDXEditor'
import Link from 'next/link'
import FormCard from '@/components/FormCard'
import "./TourPageDetail.css"
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

const mdxKod = '--1--1'

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
      headers: { 'Content-Type': 'application/json', token: token },
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

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    console.log('saveItem data:', data)
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/tours/${item?.id}?partial=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', token: token },
      body: JSON.stringify(data)
    })
      .then(ret => ret.json())
      .then(result => {
        console.log('saveItem result:\n', result)
        if (result.success && result.data) {
          setItem({ ...item, ...result.data })
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

  const deleteTravelPlan = (index: number) => {
    if (item && item.travelPlan && index > -1 && index < item.travelPlan.length) {
      setDeletingIndex(index)

      if (confirm(t(`do you want delete?`))) {
        setDeletingIndex(-1)
        item.travelPlan.splice(index, 1)
        setItem(item)
        saveItem({ travelPlan: item.travelPlan }).then(resp => {
          console.log('moveTravelPlan resp:', resp)
        })
          .catch(err => console.log('moveTravelPlan err:', err))

      } else {
        setDeletingIndex(-1)
      }

    }
    return <></>
  }

  const moveTravelPlan = (fromIndex: number, count: number) => {
    if (item && item.travelPlan && item.travelPlan.length > 0) {
      const toIndex = fromIndex + count

      if (toIndex >= 0 || toIndex < item.travelPlan.length) {

        // const element = item.travelPlan[fromIndex]
        const element = item.travelPlan.splice(fromIndex, 1)[0]
        item.travelPlan.splice(toIndex, 0, element)

        setItem(item)
        saveItem({ travelPlan: item.travelPlan })
          .then(resp => {
            console.log('moveTravelPlan resp:', resp)
          })
          .catch(err => console.log('moveTravelPlan err:', err))

      }

    }
    return <></>
  }

  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '', id: '' } as TourItemType)
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
  }, [t, item, pullData])

  // }, [t, item, pullData, formStatus, formTitle, deletingIndex])
  // }, [t, item, pullData, formStatus, formTitle, partialData,countDown,sayac])

  // useEffect(() => {
  // }, [])

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
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        // setItemOld({ ...itemOld, title: item.title })
                        await saveItem({ title: item.title })
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
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ places: item.places })
                      }
                    }}
                  />
                </div>

              </div>
            </div>
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
                      {plan && <>
                        <div className='relative flex items-start'>
                          <div className=' flex flex-col  items-start w-24 mt-3 space-y-4'>
                            <div className="flex items-center">
                              <span className='text-2xl me-2'> {index + 1}. </span>
                              <span className='text-sm'>{t('day')}</span>
                            </div>

                            <div className='ms-auto me-2 h-12 w-10'>
                              {` `}
                              {item.travelPlan && index > 0 &&
                                <Link className={`hover:text-primary text-xl `} title={t('Move up')}
                                  href="#"
                                  onClick={(e => {
                                    e.preventDefault()
                                    moveTravelPlan(index, -1)
                                  })}
                                >
                                  <i className="fa-solid fa-arrow-up"></i>
                                </Link>
                              }
                            </div>
                            <div className='ms-auto me-2 h-12 w-10'>
                              {` `}
                              {item.travelPlan && index < item.travelPlan.length - 1 &&
                                <Link className={`hover:text-primary text-xl`} title={t('Move down')}
                                  href="#"
                                  onClick={(e => {
                                    e.preventDefault()
                                    moveTravelPlan(index, 1)
                                  })}
                                >
                                  <i className="fa-solid fa-arrow-down"></i>
                                </Link>
                              }
                            </div>
                            <Link className="absolute bottom-0 start-0 text-red disabled:text-opacity-25 :not(:disabled):hover:text-primary" title={t('Delete')}
                              // disabled={!((plan.title || '').trim() == '' && (plan.destination || '').trim() == '')}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                deleteTravelPlan(index)
                              }}
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </Link>
                          </div>

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
                                  saveItem({ travelPlan: item.travelPlan })
                                }
                              }}
                            />
                            <textarea
                              rows={5}
                              placeholder={t('Description')}
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-slate-500 dark:bg-transparent dark:text-white dark:focus:border-primary"
                              defaultValue={plan.description || ''}
                              onFocus={(e) => setFocusText(e.target.value)}
                              onChange={(e) => {
                                if (item.travelPlan && item.travelPlan[index] && item.travelPlan[index].description != undefined) {
                                  item.travelPlan[index].description = e.target.value
                                  setItem(item)
                                }
                              }}
                              onBlur={(e) => {

                                if (focusText != e.target.value) {
                                  saveItem({ travelPlan: item.travelPlan })
                                }
                              }}
                            ></textarea>
                          </div>
                        </div>
                      </>}
                    </div>
                  )}
                </div>
                <div className='text-center'>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center border rounded-md bg-primary px-4 py-4 text-center font-medium text-white hover:bg-opacity-90 "
                    onClick={async (e) => {
                      if (!item.travelPlan) item.travelPlan = []
                      item.travelPlan.push({
                        title: `New plan title ${item.travelPlan.length + 1}`,
                        description: ''
                      })
                      setItem(item)
                      await saveItem({ travelPlan: item.travelPlan })
                    }}
                  >
                    {t('Add Travel Plan')}
                  </Link>
                </div>
              </div>
            </FormCard>

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

          </div>

        </div>
      }
    </>
  )
}

export default TourPageDetail
