"use client"

import React, { useEffect, useState } from "react"
import { RedirectType, redirect, usePathname } from "next/navigation"
import { useThemeMode } from "@/hooks/useThemeMode"
import { useLogin } from '@/hooks/useLogin'
import aliabiConfig from 'aliabi'

const ClientCommons = () => {
  // const { isLoggedIn,token } = useLogin()
  const [token, setToken] = useState('')
  const pathName = usePathname()


  useThemeMode()

  useEffect(() => {
    setToken(localStorage.getItem('token') || '')
    if ((localStorage.getItem('token') || '') == '' && !(pathName == '/login' || pathName.startsWith('/signup'))) {
      redirect('/login')
      return
    } else if ((localStorage.getItem('token') || '')!='' && (pathName == '/' || pathName=='/login' || pathName=='/signup')) {
      redirect('/dashboard',RedirectType.push)
      return
    }
    const $body = document.querySelector("body")
    if (!$body) return

    let newBodyClass = ""

    newBodyClass = "theme-purple-blueGrey"

    newBodyClass && $body.classList.add(newBodyClass)
    return () => {
      newBodyClass && $body.classList.remove(newBodyClass)
    }
    
  }, [token,pathName])

  return (<>{aliabiConfig.hiddenSignature()}</>)
}

export default ClientCommons
