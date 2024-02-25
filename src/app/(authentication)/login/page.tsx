"use client"
import React, { useEffect, FC, FormEvent, FormEventHandler, useState } from 'react'
import aliabi from 'aliabi'
import Link from "next/link"
import Image from 'next/image'
import Logo from '@/widgets/Logo'
// import SecurityAbi from '@/images/security-abi.png'
import { useLanguage } from '@/hooks/i18n'
import { useLogin } from '@/hooks/useLogin'
import ButtonPrimary from '@/components/ButtonPrimary'
import InputWithLabel from '@/components/InputWithLabel'
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
      <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full md:block xl:w-1/2">
            <div className="px-12 py-12 text-center">
              <span className="mt-15 inline-block">
                <img className={`aspect-auto w-full h-full`} src={'/img/security-abi.png'} alt="security abi"  />
              </span>
            </div>
          </div>

          <div className="w-full  border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 ">
              <Logo width={176} className='hidden sm:block' />
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                {t('Login')}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Email')}
                    </label>
                    <input
                      type="email"
                      placeholder={t('Email')}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {t('Password')}
                    </label>
                    <input
                      type="password"
                      placeholder={t('Password')}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e) => setPassword(e.target.value)}

                    />
                  </div>
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


