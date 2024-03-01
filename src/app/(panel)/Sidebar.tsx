"use client"

import React, { FC, ReactNode, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
// import SidebarLinkGroup fro./Sidebar/SidebarLinkGroupoup"
import Logo from '@/widgets/Logo'
import { useLanguage } from '@/hooks/i18n'
import { ChevronDown } from '@/components/ChevronDown'
import { SideMenu, MenuItemProps } from '@/lib/menu'
import { useLogin, UserRole } from '@/hooks/useLogin'
import { v4 } from 'uuid'


export interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

export interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode
  activeCondition: boolean
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { t } = useLanguage()
  const { user } = useLogin()
  // const [sidebarOpen, setSidebarOpen] = useState(false)
  const sideMenu = SideMenu((user && user.role || UserRole.USER) as UserRole)
  const pathname = usePathname()

  const trigger = useRef<any>(null)
  const sidebar = useRef<any>(null)

  let storedSidebarExpanded = "true"

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  )

  // const [sidebarExpanded, setSidebarExpanded] = useState(localStorage.getItem("sidebar-expanded") || "true")

  const checkActiveCondition = (item: MenuItemProps) => {
    var bActive = false
    if (item.path && pathname.startsWith(item.path))
      return true
    if (item.children) {
      for (var key in item.children) {
        const subItem = item.children[key]
        if (subItem.path && pathname.startsWith(subItem.path)) {
          bActive = true
          return true
        }

      }
    }
    return bActive
  }

  const SidebarLinkGroup = ({ children, activeCondition }: SidebarLinkGroupProps) => {
    const [open, setOpen] = useState<boolean>(activeCondition)
    const handleClick = () => {
      setOpen(!open)
    }
    return <>{children(handleClick, open)}</>
  }

  const menuItem = (item: MenuItemProps) => {
    // return <> {item.title || ''}</>
    if (typeof item === "string") {
      return <>
        {item == "---" &&
          <div className='w-full border-b border-neutral-500 my-2'></div>
        }
        {item != "---" &&
          <h3 className="mb-4 ml-4 text-sm font-semibold text-b11odydark2">
            {item}
          </h3>
        }
      </>
    } else if (item.type === "divider") {
      return <>
        {!item.title &&
          <div className='w-full border-b border-neutral-500 my-2'></div>
        }
        {item.title &&
          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodyd11ark2">
            {item.title}
          </h3>
        }
      </>
    } else if (!item.children && (!item.type || item.type === 'link')) {
      return <>
        <Link href={item.path || ''}
          className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium
          text-neutral-900 dark:text-slate-200  hover:bg-slate-300
          ${checkActiveCondition(item)?"bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900":""}
           ${(item.disabled || !item.path) && "disabled:hover:bg-none disabled:dark:hover:bg-none cursor-default opacity-45"}
          `}>
          {item.icon && typeof item.icon === "string" && <i className={item.icon}></i>}
          {item.icon && typeof item.icon != "string" && (item.icon)}
          {item.title && t(item.title)}
        </Link>
      </>
    } else if (item.children) {
      return <>
        <SidebarLinkGroup activeCondition={checkActiveCondition(item)}>
          {(handleClick, open) => {
            return (<React.Fragment>
              <Link href="#"
                className={`group rounded-md relative flex items-center gap-2.5  px-4 py-2 font-medium
                 text-neutral-900 dark:text-slate-200  hover:bg-slate-300 
                 ${checkActiveCondition(item)?"bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 hover:dark:bg-slate-900":""}
                `}
                // className={`group rounded-md relative flex items-center gap-2.5  px-4 py-2 font-medium
                //  text-neutral-900 dark:text-slate-200  hover:bg-[#abaace] hov11er:te11xt-slate-200
                //  ${checkActiveCondition(item)?"bg-[#e4e3fd] dark:bg-[#1f2638] hover:bg-[#e4e3fd] hover:dark:bg-[#1f2638]":""}
                // `}
                onClick={(e) => {
                  e.preventDefault()
                  sidebarExpanded ? handleClick() : setSidebarExpanded(true)
                }}
              >
                {item.icon && typeof item.icon === "string" && (<i className={item.icon}></i>)}
                {item.icon && typeof item.icon != "string" && (item.icon)}
                {item.title && t(item.title)}
                <ChevronDown open={open} />
              </Link>
              <ul className={`mb-2 mt-2 flex flex-col gap-2.5 ps-4 translate transform overflow-hidden ${!open && "hidden"}`} >
                {Object.keys(item.children).map((menuKey, index) => <>
                  <li key={index}>
                    {menuItem(item.children[menuKey])}
                  </li>
                </>)}
              </ul>
            </React.Fragment>
            )
          }}
        </SidebarLinkGroup>
      </>
    } else {
      return <></>
    }

  }

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener("click", clickHandler)
    return () => document.removeEventListener("click", clickHandler)
  })


  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return
      setSidebarOpen(false)
    }
    document.addEventListener("keydown", keyHandler)
    return () => document.removeEventListener("keydown", keyHandler)
  })

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded")
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded")
    }

  }, [sidebarExpanded])

  return (
    <aside ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-bla11ck dar11k:bg-box11dark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      suppressHydrationWarning={true}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <Logo width={176} />
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="text-white border border-white rounded px-2 block lg:hidden"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <nav className="px-4 py-2 lg:px-4">

          <ul key={`main-ul`} className="mb-6 flex flex-col gap-1.5">
            {sideMenu && <>
              {Object.keys(sideMenu).map((menuKey, index) => <>
                <li key={index.toString()}>
                  <React.Fragment>
                    {menuItem(sideMenu[menuKey])}
                  </React.Fragment>

                </li>
              </>)}
            </>}
          </ul>

        </nav>
      </div>

    </aside>
  )
}

export default Sidebar
