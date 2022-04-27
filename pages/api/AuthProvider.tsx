import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContextType } from '../context/authContext'

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
        console.log('passei aqui erro', profile)
        setUser(null)
      } else {
        console.log('passei aqui sucesso', profile)
        setUser(profile)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    console.log('passei aqui')
    getUser()
  }, [pathname])

  useEffect(() => {
    // Check that a new route is OK
    const handleRouteChange = async url => {
      console.log('url', url)
      console.log('user', user)
      if (url !== '/' && !user) {
        console.log('entrei aquiiiii1', url)
        await router.push('/')
      } else if (url === '/' && user) {
        console.log('entrei aquiiiii2', url)
        await router.push('/listagem')
      }
    }

    // Check that initial route is OK
    if (pathname !== '/' && user === null) {
      console.log('entrei aquiiiii3', pathname)
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
