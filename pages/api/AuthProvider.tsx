import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContextType } from '../context/authContext'
import { Roles } from '../../src/utils/enums'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }) => {
  const { pathname, events } = useRouter()
  const [user, setUser] = useState<any>()
  const router = useRouter()

  async function getUser() {
    try {
      const response = await fetch(`${GRADUATE_API}/v1/user`, {
        credentials: 'include',
      })
      const profile = await response.json()
      if (profile.error) {
        console.log('passei aqui erro', profile)
        setUser(null)
      } else {
        console.log('passei aqui sucesso', profile)
        if (profile.message === 'Unauthenticated') {
          setUser(null)
        } else {
          setUser(profile)
        }
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
        if (user.role === Roles.GRADUATE) {
          await router.push('/editar')
        } else {
          await router.push('/listagem')
        }
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

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

const useAuth: any = () => useContext(AuthContext)

export { AuthProvider, useAuth }
