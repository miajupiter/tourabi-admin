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

const Sidebar = () => {
  const { t } = useLanguage()
  const { user } = useLogin()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sideMenu = SideMenu((user && user.role || UserRole.USER) as UserRole)
  const pathname = usePathname()

  const trigger = useRef<any>(null)
  const sidebar = useRef<any>(null)


  const [sidebarExpanded, setSidebarExpanded] = useState(localStorage.getItem("sidebar-expanded") || "true")


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
          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
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
          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
            {item.title}
          </h3>
        }
      </>
    } else if (!item.children && (!item.type || item.type === 'link')) {
      return <>
        <Link href={item.path || ''}
          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium
           text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4
           ${pathname.includes("tables") && "bg-graydark dark:bg-meta-4"}
          `}>
          {item.icon && typeof item.icon === "string" && <i className={item.icon}></i>}
          {item.icon && typeof item.icon != "string" && (item.icon)}
          {item.title && t(item.title)}
        </Link>
      </>
    } else if (item.children) {
      return <>
        <SidebarLinkGroup activeCondition={item.path && pathname.startsWith(item.path) ? true : false}>
          {(handleClick, open) => {
            return (<React.Fragment>
              <Link href="#"
                className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                  pathname.includes("forms")) &&
                  "bg-graydark dark:bg-meta-4"
                  }`}
                onClick={(e) => {
                  e.preventDefault()
                  sidebarExpanded ? handleClick() : setSidebarExpanded("true")
                }}
              >
                {item.icon && typeof item.icon === "string" && (<i className={item.icon}></i>)}
                {item.icon && typeof item.icon != "string" && (item.icon)}
                {item.title && t(item.title)}
                <ChevronDown open={open} />
              </Link>
              <ul className={`mb-5.5 mt-4 flex flex-col gap-2.5 ps-4 translate transform overflow-hidden ${!open && "hidden"}`} >
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

  const denemeItem = (item: MenuItemProps) => {
    return <>
      {item && item.title || ''}
    </>
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
    // if (sidebarExpanded) {
    //   document.querySelector("body")?.classList.add("sidebar-expanded")
    // } else {
    //   document.querySelector("body")?.classList.remove("sidebar-expanded")
    // }
    if (sidebarExpanded) {
      document.querySelector('#side-menu')?.classList.remove('hidden')
    } else {
      document.querySelector('#side-menu')?.classList.add('hidden')
    }
  }, [sidebarExpanded])

  // useEffect(() => {
  //   setSideMenu(SideMenu((user && user.role || UserRole.USER) as UserRole))

  // }, [user])

  return (
    <aside ref={sidebar}
      id='side-menu'
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-100 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      suppressHydrationWarning={true}
    >
      <div key={v4()} className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
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

      <div key={v4()} className="no-scrollbar flex flex-col overflow-y-auto duration-100 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:px-6">

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
