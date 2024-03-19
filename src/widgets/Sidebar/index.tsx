"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import SidebarLinkGroup from "./SidebarLinkGroup"
import Logo from '../Logo'
import { useLanguage } from '@/hooks/i18n'
import {ChevronDown} from '@/components/others/ChevronDown'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { t } = useLanguage()
  const pathname = usePathname()

  const trigger = useRef<any>(null)
  const sidebar = useRef<any>(null)

  let storedSidebarExpanded = "true"

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  )

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
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-20 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear da11rk:bg-box11dark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Logo width={176} />
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="text-white border border-white rounded px-2 block lg:hidden"
        >
          {/* <i className="fa-solid fa-bars"></i> */}
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/" || pathname.includes("dashboard")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/" ||
                          pathname.includes("dashboard")) &&
                          "bg-graydark dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault()
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true)
                        }}
                      >
                        <i className="fa-solid fa-gauge"></i>
                        Dashboard
                        <ChevronDown open={open} />
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/" && "text-white"
                                }`}
                            >
                              <i className="fa-solid fa-chart-column"></i>
                              eCommerce
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>

              <li>
                <Link
                  href="/tours"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("tables") && "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-solid fa-earth-asia"></i>
                  {t('Tours')}
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("tables") && "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-solid fa-map-location-dot"></i>
                  {t('Destinations')}
                </Link>
              </li>

              <li>
                <Link
                  href="/users"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("tables") && "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-solid fa-users"></i>
                  {t('Users')}
                </Link>
              </li>

              <li>
                <Link
                  href="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("settings") &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-solid fa-screwdriver-wrench"></i>
                  Settings
                </Link>
              </li>

            </ul>
          </div>

          <div className={`${process.env.NODE_ENV === 'development' ? "block" : "hidden"}`}>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              DEVELOPER TEST
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("calendar") &&
                    "bg-graydark dark:bg-meta-4"}`} >
                  <i className="fa-solid fa-calendar-days"></i>
                  Calendar
                </Link>
              </li>

              <li>
                <Link
                  href="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("profile") && "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-regular fa-address-card"></i>
                  Profile
                </Link>
              </li>


              <SidebarLinkGroup
                activeCondition={
                  pathname === "/forms" || pathname.includes("forms")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/forms" ||
                          pathname.includes("forms")) &&
                          "bg-graydark dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault()
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true)
                        }}
                      >
                        <i className="fa-regular fa-rectangle-list"></i>
                        Forms
                        <ChevronDown open={open} />
                      </Link>
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`} >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/forms/form-elements"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/forms/form-elements" &&
                                "text-white"
                                }`}
                            >
                              Form Elements
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/forms/form-layout"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/forms/form-layout" &&
                                "text-white"
                                } `}
                            >
                              Form Layout
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>

              <li>
                <Link
                  href="/tables"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("tables") && "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-solid fa-table-cells"></i>
                  Tables
                </Link>
              </li>

              <li>
                <Link
                  href="/chart"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes("chart") && "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  <i className="fa-solid fa-chart-pie"></i>
                  Chart
                </Link>
              </li>

              <SidebarLinkGroup
                activeCondition={pathname === "/ui" || pathname.includes("ui")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/ui" || pathname.includes("ui")) &&
                          "bg-graydark dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault()
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true)
                        }}
                      >
                        <i className="fa-solid fa-building-wheat"></i>
                        UI Elements
                        <ChevronDown open={open} />

                      </Link>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && "hidden"
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/ui/alerts"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/ui/alerts" && "text-white"
                                }`}
                            >
                              Alerts
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/ui/buttons"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/ui/buttons" && "text-white"
                                }`}
                            >
                              Buttons
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === "/auth" || pathname.includes("auth")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/auth" || pathname.includes("auth")) &&
                          "bg-graydark dark:bg-meta-4"
                          }`}
                        onClick={(e) => {
                          e.preventDefault()
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true)
                        }}
                      >
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Authentication
                        <ChevronDown open={open} />
                      </Link>
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/auth/signin"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/auth/signin" && "text-white"
                                }`}
                            >
                              Sign In
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/auth/signup"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/auth/signup" && "text-white"
                                }`}
                            >
                              Sign Up
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  )
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
