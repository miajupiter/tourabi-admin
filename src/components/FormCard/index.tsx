"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import FormCardGroup from "./FormCardGroup"
import { ChevronDown } from '@/components/ChevronDown'

export enum FormCardType {
  DEFAULT,
  STATIC,
}
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
  cardType?: FormCardType
}

const FormCard = ({ id, title, icon, defaultOpen = true, headerClassName, bodyClassName,
  cardType = FormCardType.DEFAULT,
  children }: FormCardProps) => {
  // const pathname = usePathname()


  // let storedFormCardExpanded = "true"
  const storageKey = `formCard-expanded-${id}`
  const [formCardExpanded, setFormCardExpanded] = useState((localStorage.getItem(storageKey) || '') != 'true' ? false : true)


  return (
    <FormCardGroup activeCondition={formCardExpanded} id={id}>
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <div className={`rounded-[4px] text-slate-900 dark:text-slate-300 border  border-stroke border-opacity-50 shadow dark:border-strokedark
             bg-slate-100 dark:bg-slate-900`}>
              {cardType === FormCardType.DEFAULT && <>
                <Link href="#"
                  className={`group relative flex items-center justify-between gap-2.5 rounded-sm px-4 py-2 font-bold
                  border-b border-stroke border-opacity-15 dark:border-opacity-15  hover:bg-slate-300
                dark:hover:bg-[rgba(56,48,163,0.37)] ${headerClassName}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick()
                  }}
                >
                  <div className="block text-lg  space-x-3 rounded-tl rounded-tr">
                    {icon && <>{icon}</>} <span>{title}</span>
                  </div>
                  <ChevronDown open={open} />
                </Link>
              </>}
              {cardType === FormCardType.STATIC && <>
                <div className={`group relative items-center justify-between gap-2.5 rounded-sm px-4 py-2 font-bold
                  border-b border-stroke border-opacity-15 dark:border-opacity-15
                  block text-lg  space-x-3 rounded-tl rounded-tr`}>
                    {icon && <>{icon}</>} <span>{title}</span>
                </div>
              </>}
              <div className={` ${cardType === FormCardType.DEFAULT && !open && "hidden"} p-4 ${bodyClassName}`}>
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
