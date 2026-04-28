'use client'

import { useUserContext } from '@/contextProvider'
import { useAuthentication } from '@/hooks/useAuthentication'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const notAllowedWithLogin = ["/",'/signin','/signup','/forgot-password']
const notAllowedWithoutLogin = ["/dashboard",'/admin']
const adminRoles = ['ADMIN']

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname()
  const { loginWithAccessToken } = useAuthentication()
  const router = useRouter()
  const { user } = useUserContext()

  const isProtected = path.startsWith('/admin')
  const isAuthRoute = notAllowedWithLogin.includes(path)
  const isAuthorizedRoute=notAllowedWithoutLogin.includes(path)
  const hasAdminAccess = user.role !== null && adminRoles.includes(user.role)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if(hasAdminAccess&&path==='/dashboard'){
      router.push("/admin")
      return
    }

    if (!user.isAuthenticated && token) {
      console.log('pass')
      loginWithAccessToken.mutate()
      return
    }
    if(!token&&!user.isAuthenticated&&isAuthorizedRoute){
      router.replace("/signin")
      return
    }

    if (!user.isAuthenticated && isProtected) {
      router.replace('/signin')
      return
    }

    if (user.isAuthenticated && isProtected && !hasAdminAccess) {
      router.replace('/')
      return
    }

    if (user.isAuthenticated && isAuthRoute) {
      router.replace('/dashboard')
    }

  }, [path, user.isAuthenticated, user.role])

  if (!user.isAuthenticated && isProtected) return null
  if (user.isAuthenticated && isProtected && !hasAdminAccess) return null
  if (user.isAuthenticated && isAuthRoute) return null

  return <>{children}</>
}

export default AuthGuard