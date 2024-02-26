"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import FormCardGroup from "./FormCardGroup"
import { ChevronDown } from '@/components/ChevronDown'

interface FormCardProps {

  id: string
  title: string
  icon?: any
  defaultOpen?: boolean
  headerClassName?: string
  bodyClassName?: string
  // formCardOpen: boolean
  // setFormCardOpen?: (arg: boolean) => void

  children?: React.ReactNode
}

const FormCard = ({ id, title, icon, defaultOpen = true, headerClassName,bodyClassName, children }: FormCardProps) => {
  // const pathname = usePathname()


  // let storedFormCardExpanded = "true"
  const storageKey = `formCard-expanded-${id}`
  const [formCardExpanded, setFormCardExpanded] = useState((localStorage.getItem(storageKey) || '') != 'true' ? false : true)


  return (
    <FormCardGroup activeCondition={formCardExpanded} id={id}>
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <div className={`rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${headerClassName}`}>
              <Link
                href="#"
                className={`group relative flex items-center justify-between gap-2.5 rounded-sm px-4 py-2 font-medium te11xt-bod11ydark1 duration-0 ease-in-out bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-meta-4`}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick()
                  // setFormCardExpanded(true)
                }}
              >

                <div className="block text-lg text-black dark:text-white space-x-3 rounded-tl rounded-tr">
                  {!icon && <><i className="fa-regular fa-rectangle-list"></i></>}
                  {icon && <>{icon}</>}
                  <span>{title}</span>
                </div>
                <ChevronDown open={open} />
              </Link>
              {/* <div className={`translate transform overflow-hidden ${!open && "hidden"}`}> */}
              <div className={` ${!open && "hidden"} p-4 ${bodyClassName}`}>
                {children}
              </div>
            </div>
          </React.Fragment>
        )
      }}
    </FormCardGroup>

  )
}

export default FormCard
