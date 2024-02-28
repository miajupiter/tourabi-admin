"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLogin } from '@/hooks/useLogin'
import { useLanguage } from '@/hooks/i18n'

const DropdownUser = () => {
  const { t } = useLanguage()
  const { user, logoutUser } = useLogin()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const trigger = useRef<any>(null)
  const dropdown = useRef<any>(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener("click", clickHandler)
    return () => document.removeEventListener("click", clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ code }: KeyboardEvent) => {
      if (!dropdownOpen || code !== "Escape") return
      setDropdownOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, user])



  return (
    <div className="relative">
      {user && <>
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex justify-end items-center space-x-2"
          href="#"
        >
          <span className="hidden text-right lg:block">
            {user.name &&
              <>
                <span className="block text-sm font-medium text-black dark:text-white">
                  {user.name}
                </span>
              </>
            }
            {user.role && <>
              <span className="block text-xs">
                {user.role}
              </span>
            </>}
          </span>

          {user.image &&
            <>
              <span className="">

                <Image src={user.image} className='aspect-square rounded-full' alt="user image" width={48} height={48} />

              </span>
            </>}
          <span className='hidden fill-current sm:block'>
            <i className="fa-solid fa-chevron-down"></i>
          </span>

        </Link>

        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark da11rk:bg-box11dark ${dropdownOpen === true ? "block" : "hidden"
            }`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-2 dark:border-strokedark">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3.5 text-sm font-medium  hover:text-primary lg:text-base"
              >
                <i className="fa-solid fa-user"></i>
                <div className='flex flex-col gap-2'>
                  <span>{user && user.name}</span>
                  <span className='text-sm'>{user && user.email}</span>
                </div>
              </Link>
            </li>
          </ul>
          <button className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium  hover:text-primary lg:text-base"
            onClick={(e) => logoutUser()}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {t('Log Out')}
          </button>
        </div>
      </>}
    </div>
  )
}

export default DropdownUser
