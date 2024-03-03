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
// import {  UserRole } from '@/hooks/useLogin'
import { FormStatus } from '@/types/formStatus'
import InputWithLabel from '@/components/InputWithLabel'
import DateInputWithLabel from '@/components/DateInputWithLabel'
import TextareaWithLabel from '@/components/TextareaWithLabel'
import UserRoleEmojiStyle from '../UserRoleEmojiStyle'
import { UserRole, useLogin } from '@/hooks/useLogin'
import { deleteItem, getItem, putItem } from '@/lib/fetch'
import {countries} from 'country-list-json'
export interface UserPageDetailProps {
  params: { slug: string[] }
}

export interface UserItemType {
  _id?: string
  name?: string
  email?: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
  dateOfBirth?: string
  phoneNumber?: string
  address: {
    room?: string,
    streetName?: string,
    blockName?: string,
    buildingName?: string,
    buildingNumber?: string,
    citySubdivisionName?: string,
    cityName?: string,
    postalZone?: string,
    postbox?: string,
    region?: string,
    district?: string,
    country: {
      identificationCode?: string,
      name?: string
    }
  }
  bio?: string
  discount: {
    rate?: number,
    additionalAmount?: number
  },
  balance?: number
  currency?: string
  status?: string
  reviewMessage?: string
  reviewedBy?: string
  reviewDate?: string
  companyLegalName?: string
  taxOffice?: string
  taxNumber?: string
  companyLogo?: string,

  paymentInfo: {
    bankAccountName: string,
    ibanNo: string,
    creditCard: {
      holderName: string,
      cardNo: string,
      validYear: string,
      validMonth: string,
      ccv: string,
    },
    ethereumWallet: string,
    bitcoinWallet: string,
  }
  passive: boolean
  password: string
}

const mdxKod = '--1--1'

const UserPageDetail: FC<UserPageDetailProps> = ({ params }) => {
  const { token } = useLogin()
  const { t } = useLanguage()

  // const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false)

  const [item, setItem] = useState<UserItemType>()
  // const [itemOld, setItemOld] = useState<UserItemType>()
  const [pullData, setPullData] = useState(false)
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.new)
  // const [formTitle, setFormTitle] = useState('')
  const [focusText, setFocusText] = useState('')
  const [focusMarkDown, setFocusMarkDown] = useState('')



  const saveItem = (data: any) => new Promise<any>((resolve, reject) => {
    putItem(`/admin/users/${item?._id}?partial=true`, token, data)
      .then(data => {
        setItem({ ...item, ...data })
        if (formStatus == FormStatus.new && item?._id) {
          setFormStatus(FormStatus.edit)
        }
        resolve(item)
      })
      .catch(reject)

  })

  const formTitle = () => {
    switch (formStatus) {
      case FormStatus.new:
        return t('New User')
      case FormStatus.edit:
        return t('Edit User')
      case FormStatus.view:
        return t('View User')
    }
    return ''
  }



  useEffect(() => {
    if (!pullData) {
      setPullData(true)
      if (params.slug[0] == 'new') {
        setFormStatus(FormStatus.new)
        setItem({ ...item, title: '', _id: '' } as UserItemType)

      } else {
        if (params.slug[0] == 'edit') {
          setFormStatus(FormStatus.edit)
        } else {
          setFormStatus(FormStatus.view)
        }
        getItem(`/admin/users/${params.slug[1]}`, token)
          .then(data => setItem(data))
          .catch(console.log)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, item, pullData])



  return (
    <>
      <PageHeader
        pageTitle={formTitle()}
        breadcrumbList={[
          { href: '/', pageTitle: 'Dashboard' },
          { href: '/users', pageTitle: 'Users' },
          params.slug.length >= 2 && { href: `/users/` + params.slug[1], pageTitle: 'User Item' }
        ]}
        icon={(<i className="fa-solid fa-users"></i>)}
      />

      {item &&
        <div className="grid grid-cols-1 gap-6 ">
          <div className="flex flex-col gap-6">
            <FormCard id="users-head" title={item.email || '...'} defaultOpen={true}
              icon={(<i className="fa-solid fa-users"></i>)}>

              <div className="flex flex-col gap-4">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    label={t('First name')}
                    defaultValue={item.firstName}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, firstName: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ firstName: item.firstName })
                      }
                    }}
                  />
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    label={t('Last name')}
                    defaultValue={item.lastName}
                    onFocus={(e) => setFocusText(e.target.value)}
                    onChange={(e) => setItem({ ...item, lastName: e.target.value })}
                    onBlur={async (e) => {
                      if (e.target.value != focusText) {
                        await saveItem({ lastName: item.lastName })
                      }
                    }}
                  />
                  <div className="w-24 md:w-32">
                    <label className="ms-2 mb-3 block text-sm text-center font-medium text-black dark:text-white">
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
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <InputWithLabel
                    readOnly={formStatus == FormStatus.view}
                    type="email"
                    label={t('Email')}
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
                      <UserRoleEmojiStyle role={item.role as UserRole} />
                    </label>
                  </div>
                </div>


              </div>
            </FormCard>
            {item._id && <>
              <FormCard title={item.email || ''} id='account-info' defaultOpen={true}
                bodyClassName='grid grid-cols-1 space-y-3'
              >

                <div className='grid grid-cols-2 gap-4'>
                  <InputWithLabel
                    label={t('First name')}
                    defaultValue={item.firstName}
                    onChange={e => setItem({ ...item, firstName: e.target.value })}
                  />
                  <InputWithLabel
                    label={t('Last name')}
                    defaultValue={item.lastName}
                    onChange={e => setItem({ ...item, lastName: e.target.value })}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <SelectWithLabel
                    label={t('Gender')}
                    defaultValue={item.gender}
                    onSelect={e => setItem({ ...item, gender: e.currentTarget.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </SelectWithLabel>

                  <DateInputWithLabel
                    label={t('Date of birth')}
                    defaultValue={item.dateOfBirth || ''}
                    onBlur={e => setItem({ ...item, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <InputWithLabel
                    label={t('Phone number')}
                    type={'tel'}
                    defaultValue={item.phoneNumber}
                    onChange={(e) => setItem({ ...item, phoneNumber: e.target.value })}
                  />
                </div>
                <TextareaWithLabel
                  label={t('About your company')}
                  rows={5}
                  defaultValue={`${item.bio}`}
                  onChange={(e) => setItem({ ...item, bio: e.target.value })}
                />
              </FormCard>

              {/* Adress */}
              <FormCard title={t('Address')} id='account-address' defaultOpen={false}
                bodyClassName='grid grid-cols-1 md:grid-cols-3 gap-4 space-y-3'
              >
                <InputWithLabel label={t('Street name')}
                  className='col-span-3'
                  defaultValue={item.address.streetName}
                  onChange={e => {
                    item.address.streetName = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('Building name')}
                  className='col-span-1'
                  defaultValue={item.address.buildingName}
                  onChange={e => {
                    item.address.buildingName = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('Building number')}
                  className='col-span-1'
                  defaultValue={item.address.buildingNumber}
                  onChange={e => {
                    item.address.buildingNumber = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('Block name')}
                  className='col-span-1'
                  defaultValue={item.address.blockName}
                  onChange={e => {
                    item.address.blockName = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('Apartment number')}
                  className='col-span-1'
                  defaultValue={item.address.room}
                  onChange={e => {
                    item.address.room = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('City Subdivision')}
                  className='col-span-1'
                  defaultValue={item.address.citySubdivisionName}
                  onChange={e => {
                    item.address.citySubdivisionName = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('District')}
                  className='col-span-1'
                  defaultValue={item.address.district}
                  onChange={e => {
                    item.address.district = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('City')}
                  className='col-span-1'
                  defaultValue={item.address.cityName}
                  onChange={e => {
                    item.address.cityName = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('Region')}
                  className='col-span-1'
                  defaultValue={item.address.region}
                  onChange={e => {
                    item.address.region = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <InputWithLabel label={t('Postal zone')}
                  className='col-span-1'
                  defaultValue={item.address.postalZone}
                  onChange={e => {
                    item.address.postalZone = e.target.value
                    setItem({ ...item, address: item.address })
                  }}
                />
                <SelectWithLabel
                  className='col-span-1'
                  label={t('Country')}
                  defaultValue={item.address.country.identificationCode}
                  onChange={e => {
                    item.address.country = {
                      identificationCode: e.target.value,
                      name: e.target.options.item(e.target.selectedIndex)?.text
                    }
                    setItem({ ...item, address: item.address })
                  }}
                >
                  {countries.map((ulke, index) => (
                    <option key={index} value={ulke.code}>{ulke.name}</option>
                  ))}
                </SelectWithLabel>
              </FormCard>
              {/* /end Adress */}

              {/* Company informations */}
              <FormCard title={t('Company informations')} id='account-company-info' defaultOpen={false}
                bodyClassName='grid grid-cols-1 md:grid-cols-4 gap-4 space-y-3'
              >
                <InputWithLabel
                  className='col-span-4'
                  label={t('Company legal name')}
                  defaultValue={item.companyLegalName}
                  onChange={(e) => setItem({ ...item, companyLegalName: e.target.value })}
                />
                <InputWithLabel
                  className='col-span-2'
                  label={t('Tax office')}
                  defaultValue={item.taxOffice}
                  onChange={(e) => setItem({ ...item, taxOffice: e.target.value })}
                />
                <InputWithLabel
                  className='col-span-2'
                  label={t('Tax number')}
                  defaultValue={item.taxNumber}
                  onChange={(e) => setItem({ ...item, taxNumber: e.target.value })}
                />
                <div className='col-span-4 h-42'>
                  <div className='w-full  mx-w-80 border p-4'>
                    qwerty company logo here
                  </div>
                </div>
              </FormCard>
              {/* /end Company informations */}
              {/* Payment Info */}
              <FormCard title={t('Payment info')} id='account-payment-info' defaultOpen={false}
                bodyClassName='grid grid-cols-1 md:grid-cols-4 gap-4 space-y-3'
              >
                <div className='col-span-4'>
                  <div className='flex flex-row'>
                    <InputWithLabel
                      className='basis-1/4'
                      label={t('Account name')}
                      defaultValue={item.paymentInfo.bankAccountName}
                      onChange={(e) => {
                        item.paymentInfo.bankAccountName = e.target.value
                        setItem({ ...item, paymentInfo: item.paymentInfo })
                      }}
                    />
                    <InputWithLabel
                      className='basis-3/4'
                      label={t('Iban number')}
                      defaultValue={item.paymentInfo.ibanNo}
                      onChange={(e) => {
                        item.paymentInfo.ibanNo = e.target.value
                        setItem({ ...item, paymentInfo: item.paymentInfo })
                      }}
                    />
                  </div>
                </div>

                <FormCard id='account-payment-creditcard'
                  className='col-span-4'
                  title={t('Credit card')}
                  defaultOpen={false}
                  bodyClassName=' grid grid-cols-2 md:grid-cols-4 gap-4'
                  icon={(<><i className="fa-brands fa-cc-visa"></i><i className="fa-brands fa-cc-mastercard"></i></>)}
                >

                  <InputWithLabel
                    className='col-span-4'
                    label={t('Holder name')}
                    defaultValue={item.paymentInfo.creditCard.holderName}
                    onChange={(e) => {
                      item.paymentInfo.creditCard.holderName = e.target.value
                      setItem({ ...item, paymentInfo: item.paymentInfo })
                    }}
                  />
                  <InputWithLabel
                    className='col-span-4'
                    label={t('Card number')}
                    defaultValue={item.paymentInfo.creditCard.cardNo}
                    onChange={(e) => {
                      item.paymentInfo.creditCard.cardNo = e.target.value
                      setItem({ ...item, paymentInfo: item.paymentInfo })
                    }}
                  />
                  <InputWithLabel
                    className='col-span-1'
                    label={t('Valid month')}
                    placeholder='mm'
                    defaultValue={item.paymentInfo.creditCard.validMonth}
                    onChange={(e) => {
                      item.paymentInfo.creditCard.validMonth = e.target.value
                      setItem({ ...item, paymentInfo: item.paymentInfo })
                    }}
                  />
                  <InputWithLabel
                    className='col-span-1'
                    label={t('Valid year')}
                    placeholder='yy'
                    defaultValue={item.paymentInfo.creditCard.validYear}
                    onChange={(e) => {
                      item.paymentInfo.creditCard.validYear = e.target.value
                      setItem({ ...item, paymentInfo: item.paymentInfo })
                    }}
                  />
                  <InputWithLabel
                    className='col-span-1'
                    label={t('CCV')}
                    type='password'
                    defaultValue={item.paymentInfo.creditCard.ccv}
                    onChange={(e) => {
                      item.paymentInfo.creditCard.ccv = e.target.value
                      setItem({ ...item, paymentInfo: item.paymentInfo })
                    }}
                  />
                </FormCard>
                <InputWithLabel
                  className='col-span-4'
                  label={t('Ethereum wallet')}
                  defaultValue={item.paymentInfo.ethereumWallet}
                  onChange={(e) => {
                    item.paymentInfo.ethereumWallet = e.target.value
                    setItem({ ...item, paymentInfo: item.paymentInfo })
                  }}
                />
                <InputWithLabel
                  className='col-span-4'
                  label={t('Bitcoin wallet')}
                  defaultValue={item.paymentInfo.bitcoinWallet}
                  onChange={(e) => {
                    item.paymentInfo.bitcoinWallet = e.target.value
                    setItem({ ...item, paymentInfo: item.paymentInfo })
                  }}
                />
              </FormCard>
              {/* /end Company informations */}
            </>}
          </div>

          <div className='flex flex-row mt-10'>
            <button
              className='p-2 border border-stroke dark:border-strokedark rounded-md bg-red text-white'
              onClick={(e) => {
                if (confirm(t(`${item?.email}\n\nDo you want to remove?`))) {
                  deleteItem(`/admin/users/${item?._id}`, token)
                    .then(() => {
                      location.href = '/users'
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

export default UserPageDetail
