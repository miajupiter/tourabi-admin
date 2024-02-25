import { useEffect, useRef, useState } from "react"
import Link from "next/link"
// import Image from "next/image";
import { useLogin } from '@/hooks/useLogin'
import { useLanguage } from '@/hooks/i18n'

const DropdownUser = () => {
  const { t } = useLanguage()
  const { token, user, logoutUser } = useLogin()
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
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
  })

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user && user.name || ' '}
          </span>
          <span className="block text-xs">{user && user.role || ' '}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          {user && user.image &&
            <>
              <img src={user.image} className='w-full h-full aspect-auto rounded-full' alt="user image" />
            </>}
        </span>
        <span className='hidden fill-current sm:block'>
          <i className="fa-solid fa-chevron-down"></i>
        </span>

      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? "block" : "hidden"
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
    </div>
  )
}

export default DropdownUser
