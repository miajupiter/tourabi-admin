"use client"
import React, { useEffect, FC, FormEvent, FormEventHandler, useState } from 'react'
import aliabi from 'aliabi'
import Link from "next/link"
import Image from 'next/image'
import Logo from '@/widgets/Logo'
// import SecurityAbi from '@/images/security-abi.png'
import { useLanguage } from '@/hooks/i18n'
import { useLogin } from '@/hooks/useLogin'
import ButtonPrimary from '@/components/others/ButtonPrimary'
import InputWithLabel from '@/aliabi/InputWithLabel'
import Head from 'next/head'
// export const metadata: Metadata = {
//   title: "Login | TourAbi Admin Panel",
//   description: "This is Login Page for TourAbi Admin Panel",
//   // icons: [{
//   //   url: "/favicon.ico",
//   //   rel:"icon",
//   //   type: "image/x-icon",
//   //   sizes: "48x48",
//   // }]
// }

const LogInPage: FC = () => {
  const { isLoggedIn, loginUser } = useLogin()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    loginUser(email, password, '/')

  }
  useEffect(() => {
  }, [t, isLoggedIn])
  return (
    <>
      <Head>
        <title>{`${t('Login page')} | ${aliabi}`}</title>
        <meta name="description" content="This is Login Page for TourAbi Admin Panel" />
      </Head>
      <div className="max-w-[600px] rounded-[8px] border border-slate-400 bg-sl11ate-100 shadow-md shadow-slate-800 dark:border-strokedark da11rk:bg-box11dark p-2">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden w-full md:block ">
            <div className="h-full my-auto p-8 ">
              <Image className='aspect-auto' src={'/img/security-abi.png'} alt="security abi" width={558} height={832} />
            </div>
          </div>

          <div className="w-full  border-stroke dark:border-strokedark  xl:border-l-2">
            <div className="w-full p-4 ">

              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                {t('Admin Panel')}
              </h2>

              <form onSubmit={handleSubmit} className='w-full'>
                <div className='grid grid-cols-1 gap-4 '>
                  <InputWithLabel
                    type="email"
                    label={t('Email')}
                    // className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <InputWithLabel
                    type="password"
                    label={t('Password')}
                    // className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div >
                    <ButtonPrimary type="submit"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90">
                      {t('Login')}
                    </ButtonPrimary>

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LogInPage


