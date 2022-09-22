import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContextType, User } from '../context/authContext'
import { Roles } from '../utils/enums'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

export const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }) => {
  const { pathname, events } = useRouter()
  const [user, setUser] = useState<User>()
  const router = useRouter()

  async function getUser() {
    try {
      const response = await fetch(`${GRADUATE_API}/v1/user`, {
        credentials: 'include',
      })
      const profile = await response.json()
      if (profile.error) {
        setUser(null)
        return null
      } else {
        if (profile.message === 'Unauthenticated') {
          setUser(null)
          return null
        } else {
          // console.log(profile)
          setUser(profile)
          return profile
        }
      }
    } catch (err) {
      return null
    }
  }

  useEffect(() => {
    console.log('passei aqui', pathname, user)
    if (pathname !== '/' && !user) {
      getUser().then(value => {
        if (!value) router.push('/')
        console.log('passei ddasdasdasaqui', pathname, value)
      })
    }
  }, [pathname])

  useEffect(() => {
    // Check that a new route is OK
    const handleRouteChange = async url => {
      if (url !== '/' && !user) {
        await router.push('/')
      } else if (url === '/' && user) {
        if (user.role === Roles.GRADUATE) {
          await router.push(`/historico/${user.id}`)
        } else {
          await router.push('/egressos')
        }
      }
    }
    // Check that initial route is OK
    if (pathname !== '/' && user === null) {
      console.log('passei aqui 2', pathname)

      router.push('/')
    }
    // Monitor routes
    events.on('routeChangeStart', handleRouteChange)
    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [user])

  return <AuthContext.Provider value={{ user, setUser, getUser }}>{children}</AuthContext.Provider>
}

const useAuth: () => AuthContextType = () => useContext(AuthContext)

export { AuthProvider, useAuth }
