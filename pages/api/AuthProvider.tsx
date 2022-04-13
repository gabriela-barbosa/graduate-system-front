import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContextType } from '../context/authContext'
import { use } from 'ast-types'

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }) => {
  const { pathname, events } = useRouter()
  const [user, setUser] = useState()
  const router = useRouter()

  async function getUser() {
    try {
      const response = await fetch('http://localhost:8080/api/v1/user', {
        credentials: 'include',
      })
      const profile = await response.json()
      if (profile.error) {
        setUser(null)
      } else {
        setUser(profile)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [pathname])

  useEffect(() => {
    // Check that a new route is OK
    const handleRouteChange = url => {
      console.log('url', url)
      if (url !== '/' && !user) {
        router.push('/')
      }
      if (url === '/' && user) {
        router.push('/listagem')
      }
    }

    // Check that initial route is OK
    if (pathname !== '/' && user === null) {
      router.push('/')
    }

    // Monitor routes
    events.on('routeChangeStart', handleRouteChange)
    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [user])

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

const useAuth: any = () => useContext(AuthContext)

export { AuthProvider, useAuth }
