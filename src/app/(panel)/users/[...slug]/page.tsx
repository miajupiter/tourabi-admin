"use client"

import React, { FC, Fragment, useState, useEffect, useRef } from 'react'

import { useLanguage } from '@/hooks/i18n'
import { StaticImageData } from 'next/image'
import PageHeader from '@/components/PageHeader'
import { AliAbiMDXEditor } from '@/components/Editor/AliAbiMDXEditor'
import Link from 'next/link'
import FormCard from '@/components/FormCard'
import Switch from '@/components/Switch'
import SwitchPassive from '@/components/SwitchPassive'
import SelectWithLabel from '@/components/SelectWithLabel'
import Select from '@/components/Select'
import DateInput from '@/components/DateInput'
import UserRole from '../UserRole'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/components/InputWithLabel'
export interface UserPageDetailProps {
  params: { slug: string[] }
}

export interface UserItemType {
  _id?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  gender?: string
  dateOfBirth?: string
  phoneNumber?: string
  password?: string
  image?: StaticImageData
  companyLogo?: StaticImageData

  companyLegalName?: string
  taxOffice?: string
  taxNumber?: string
  passive?: boolean

  // address: {
  //   streetName: string
  //   cityName: string
  //   district: string
  //   region: string
  //   postalZone: string
  //   country: {
  //     identificationCode: string
  //     name: string
  //   }
  // }

  bio?: string
}

const mdxKod = '--1--1'

const UserPageDetail: FC<UserPageDetailProps> = ({ params }) => {
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<UserItemType>()
  // const [itemOld, setItemOld] = useState<UserItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  // const [formTitle, setFormTitle] = useState('')
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')


  const getItem = (itemId: string) => {
    const token = localStorage.getItem('token') || ''
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/users/${itemId}`, {
      headers: { 'Content-Type': 'application/json', token: token },
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success && result.data) {
          var res = result.data as UserItemType

          setItem(res)
        }
      }).catch(console.error)

  }

  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    const token = localStorage.getItem('token') || ''
    console.log(`${process.env.NEXT_PUBLIC_API_URI}/admin/users/${item?._id}?partial=true`)
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/admin/users/${item?._id}?partial=true`, {
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
        setItem({ ...item, title: '', _id: '' } as UserItemType)

      } else if (params.slug[0] == 'edit') {
        setFormStatus(FormStatus.edit)
        getItem(params.slug[1])

      } else if (params.slug[0] == 'view') {
        setFormStatus(FormStatus.view)
        getItem(params.slug[1])
      }
    }
    // // // /* eslint-disable react-hooks/exhaustive-deps */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, item, pullData])



  return (
    <>

      <PageHeader pageTitle={formTitle()} breadcrumbList={[
        { href: '/', pageTitle: 'Dashboard' },
        { href: '/users', pageTitle: 'Users' },
        params.slug.length >= 2 && { href: `/users/` + params.slug[1], pageTitle: 'User Item' }
      ]} />

      {item &&
        <div className="grid grid-cols-1 gap-9 ">
          <div className="flex flex-col gap-9">
            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-5">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className="">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('First name')}
                    </label>
                    <input
                      readOnly={formStatus == FormStatus.view}
                      type="text"
                      placeholder={t('First name')}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      defaultValue={item.firstName}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onChange={(e) => setItem({ ...item, firstName: e.target.value })}
                      onBlur={async (e) => {
                        if (e.target.value != focusText) {
                          await saveItem({ firstName: item.firstName })
                        }
                      }}
                    />
                  </div>
                  <div className="">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Last name')}
                    </label>
                    <input
                      readOnly={formStatus == FormStatus.view}
                      type="text"
                      placeholder={t('Last name')}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      defaultValue={item.lastName}
                      onFocus={(e) => setFocusText(e.target.value)}
                      onChange={(e) => setItem({ ...item, lastName: e.target.value })}
                      onBlur={async (e) => {
                        if (e.target.value != focusText) {
                          await saveItem({ lastName: item.lastName })
                        }
                      }}
                    />
                  </div>
                  <div className="w-24 md:w-32">
                    <label className="ms-2 mb-3 block text-sm text-center font-medium text-black dark:text-white">
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
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type="email"
                    label={t('Email')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.email}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, email: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ email: item.email })
                      }
                    }}
                  />
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type="text"
                    label={t('Password')}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.password}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, password: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ password: item.password })
                      }
                    }}
                  />

                  <div className="flex flex-col">
                    <label className="ms-2 mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Role')}
                    </label>
                    <label
                      className="w-full h-12 uppercase rounded-lg border-[1.5px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <UserRole role={item.role} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {item._id && <>
              <FormCard id="user-financials" title={t('Address')}
                defaultOpen={false}
                icon={(<i className="fa-solid fa-map-location"></i>)}
              >
                <div className="grid grid-cols-1  gap-5.5 p-5">

                </div>
              </FormCard>
              <FormCard id="user-info" title={t('Info')}
                defaultOpen={false}
                icon={(<i className="fa-regular fa-file-lines"></i>)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 p-5">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Date of birth')}
                    </label>
                    <DateInput
                      readOnly={formStatus == FormStatus.view}
                      placeholder={t('Date of birth')}
                      // className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      defaultValue={item.dateOfBirth}
                      onInput={async (e) => {
                        console.log('onInput', e.currentTarget.value)
                        if (e.currentTarget.value != item.dateOfBirth) {
                          setItem({ ...item, dateOfBirth: e.currentTarget.value })
                          await saveItem({ dateOfBirth: e.currentTarget.value })
                        }
                      }}

                    />
                  </div>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type="tel"
                    label={t('Phone number')}
                    // className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    defaultValue={item.phoneNumber}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, phoneNumber: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ phoneNumber: item.phoneNumber })
                      }
                    }}
                  />
                  <SelectWithLabel
                    label={t('Gender')}
                    defaultValue={item.gender}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, gender: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ gender: item.gender })
                      }
                    }}
                  >
                    <option value={''}>{'--'}</option>
                    <option value={'female'}>{t('Female')}</option>
                    <option value={'male'}>{t('Male')}</option>
                    <option value={'other'}>{t('Other')}</option>
                  </SelectWithLabel>
                </div>
                <div className="grid grid-cols-1 gap-4 p-5">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Biography')}
                    </label>
                    <textarea
                      readOnly={formStatus == FormStatus.view}
                      rows={5}
                      placeholder={t('Biography')}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-slate-500 dark:bg-transparent dark:text-white dark:focus:border-primary"
                      defaultValue={item.bio || ''}
                      onFocus={(e) => { e.preventDefault(); setFocusText(e.target.value) }}
                      onBlur={async (e) => {

                        if (focusText != e.target.value) {
                          setItem({ ...item, bio: e.target.value })
                          await saveItem({ bio: e.target.value })
                        }
                      }}
                    ></textarea>
                  </div>
                </div>
              </FormCard>
              <FormCard id="user-address" title={t('Address')}
                defaultOpen={false}
                icon={(<i className="fa-solid fa-map-location"></i>)}
              >
                <div className="grid grid-cols-1  gap-5.5 p-5">

                </div>
              </FormCard>
            </>}
          </div>
        </div>
      }
    </>
  )
}

export default UserPageDetail
