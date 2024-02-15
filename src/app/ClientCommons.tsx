"use client"

import React, { useEffect, useState } from "react"
import { RedirectType, redirect, usePathname } from "next/navigation"
import { useThemeMode } from "@/hooks/useThemeMode"
import { useLogin } from '@/hooks/useLogin'
import aliabiConfig from 'aliabi'

const ClientCommons = () => {
  // const { isLoggedIn,token } = useLogin()
  const pathName = usePathname()


  useThemeMode()

  useEffect(() => {
    // console.log('CliCom isLoggedIn:', isLoggedIn)
    // console.log('CliCom token:', token)
    // console.log('CliCom pathName:', pathName)
    const isLoggedIn =localStorage.getItem('token')?true:false

    if (!isLoggedIn && !(pathName == '/login' || pathName=='/signup')) {

      redirect('/login',RedirectType.push)

      return
    } else if (isLoggedIn && (pathName == '/' || pathName=='/login' || pathName=='/signup')) {
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
    
  }, [pathName])

  return (<>{aliabiConfig.hiddenSignature()}</>)
}

export default ClientCommons
