"use client"
import React, { useEffect, FC, FormEvent, FormEventHandler, useState } from 'react'
import aliabi from 'aliabi'
import Link from "next/link"
import Image from 'next/image'
import Logo from '@/widgets/Logo'
import SecurityAbi from '@/images/security-abi.png'
import { useLanguage } from '@/hooks/i18n'
import { useLogin } from '@/hooks/useLogin'
import ButtonPrimary from '@/components/ButtonPrimary'
import InputWithLabel from '@/components/InputWithLabel'
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
    // fetch(`${process.env.NEXT_PUBLIC_API_URI}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email, password: password })
    // }).then(ret => ret.json())
    //   .then(result => {

    //     if (result.success) {
    //       localStorage.setItem('token', result.data.token)
    //       localStorage.setItem('user', JSON.stringify(result.data.user))
    //       location.href = '/'
    //     } else {
    //       setError(result.error)
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log('err:', err)
    // })
  }
  useEffect(() => {
  }, [t, isLoggedIn])
  return (
    <>
      <title>{`${t('Login page')} | ${aliabi}`}</title>
      <meta name="description" content="This is Login Page for TourAbi Admin Panel" />
      
      <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full md:block xl:w-1/2">
            <div className="px-12 py-12 text-center">
              <span className="mt-15 inline-block">
                <Image src={SecurityAbi} alt="security abi" width={280} height={416} />
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
                <div className="mb-4">
                  <div className="relative">
                    <InputWithLabel
                      name="email"
                      id="email"
                      type="email"
                      label={t('Enter your email')}
                      onChange={(e: any) => setEmail(e.target.value)}
                    />
                    <span className="absolute right-4 top-4">
                      <i className='fas fa-envelope'></i>
                    </span>
                  </div>
                </div>

                <div className="mb-6">

                  <div className="relative">
                    <InputWithLabel
                      name="password"
                      id="password"
                      type="password"
                      label={t('Password')}
                      onChange={(e: any) => setPassword(e.target.value)}
                    />
                    {/* <input
                      type="password"
                      placeholder={t('Password')}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    /> */}

                    <span className="absolute right-4 top-4">
                      <i className='fas fa-lock'></i>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <ButtonPrimary type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90">
                    {t('Login')}
                  </ButtonPrimary>
                  {/* <button
                    type="submit"

                    className="w-full cursor-pointer rounded-sm border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    {t('Login')}
                  </button> */}
                </div>


                {/* <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link href="/signup" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LogInPage


