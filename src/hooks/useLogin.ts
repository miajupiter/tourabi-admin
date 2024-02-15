"use client"

import { useEffect } from "react"
import useLocalStorage from "./useLocalStorage"
import { v4 as uuid } from 'uuid'
import { createGlobalState } from "react-hooks-global-state"
import { ShowError, ShowMessage } from '@/widgets/Alerts'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/hooks/i18n'
import { set } from 'lodash'

const initialState = { isLoggedIn: false }
const { useGlobalState } = createGlobalState(initialState)

export const useLogin = () => {
  const { t } = useLanguage()
  const [token, setToken] = useLocalStorage('token', null)
  const [user, setUser] = useLocalStorage('user', null)
  const [deviceId, setDeviceId] = useLocalStorage('deviceId', uuid())
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn")

  const router = useRouter()


  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('deviceId')
    location.href = '/login'
  }

  const loginUser = (email: string, password: string, redirectTo?: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URI}/auth/login?adminPanel=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, deviceId: deviceId })
    })
      .then(ret => ret.json())
      .then(result => {
        if (result.success) {
          console.log(`loginUser result:`, result)
          if (!['manager', 'admin', 'sysadmin'].includes(result.data.user.role)) {
            ShowError(t('access denied'))
          }
          setToken(result.data.token)
          setUser(result.data.user)
          if (result.data.user) {
            setIsLoggedIn(true)
          } else {
            setIsLoggedIn(false)
          }

          if (redirectTo) {
            // router.push(redirectTo)

            location.href = redirectTo
          }

        } else {
          ShowError(t(result.error))
        }
      })
      .catch((err: any) => {
        ShowError(t(err.message || err || 'error'))
      })

  }

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, token, user, deviceId, isLoggedIn])


  return {
    isLoggedIn,
    token,
    user,
    logoutUser,
    loginUser,
  }
}
