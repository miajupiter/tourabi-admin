"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import FormCardGroup from "./FormCardGroup"
import { ChevronDown } from '@/components/ChevronDown'

interface FormCardProps {
  id: string
  title: string
  icon?: React.Component
  defaultOpen?: boolean
  // formCardOpen: boolean
  // setFormCardOpen?: (arg: boolean) => void

  children?: React.ReactNode
}

const FormCard = ({ id, title, icon, defaultOpen = true, children }: FormCardProps) => {
  // const pathname = usePathname()


  // let storedFormCardExpanded = "true"
  const storageKey = `formCard-expanded-${id}`
  const [formCardExpanded, setFormCardExpanded] = useState((localStorage.getItem(storageKey) || '') != 'true' ? false : true)



  useEffect(() => {

  }, [])

  useEffect(() => {

  }, [])

  useEffect(() => {

  }, [])


  return (
    <FormCardGroup activeCondition={formCardExpanded} id={id}>
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <div className="rounded-[8px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <Link
                href="#"
                className={`group relative flex items-center justify-between gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick()
                  // setFormCardExpanded(true)
                }}
              >

                <label className="mb-3 block text-xl font-medium text-black dark:text-white space-x-2">
                  {!icon && <i className="fa-solid fa-circle"></i>}
                  {icon && <>{icon}</>}
                  {title}
                </label>
                <ChevronDown open={open} />
              </Link>
              <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
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
