import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import { useRouter } from 'next/router'
import { User } from '@context/AuthContext'
import { Role, USER_TOKEN_NAME } from '@utils/enums'
import { parseCookies, setCookie } from 'nookies'
import { api } from '../services/api'
import { getAPIClient } from '../services/axios'
import { redirectAccordingRole } from '@utils/functions'

const GRADUATE_API = process.env.GRADUATE_API

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface SignInData {
  email: string
  password: string
}

export type AuthContextType = {
  user: User | null
  currentRole?: Role
  setUser: Dispatch<SetStateAction<User>>
  getUser: () => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  isAuthenticated: () => boolean
  logout: () => void
  updateCurrentRole: (currentRole: Role) => void
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const { currentRole } = user || {}
  const router = useRouter()

  const isAuthenticated = () => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()
    return !!token
  }

  const updateCurrentRole = async currentRole => {
    try {
      const apiClient = getAPIClient()
      const { data } = await apiClient.post<User>('v1/user/current_role', { currentRole })
      const currentUser = { ...user, currentRole: data.currentRole } as User
      setUser(currentUser)
      await redirectAccordingRole(currentRole, currentUser.id, router)
    } catch (error) {}
  }

  const logout = async () => {
    const myInit: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    await fetch(`${GRADUATE_API}/v1/logout`, myInit)
    setCookie(undefined, USER_TOKEN_NAME, '')
    await router.push('/')
    setUser(null)
  }

  async function getUser() {
    try {
      const response = await fetch(`${GRADUATE_API}/v1/user`, {
        credentials: 'include',
      })
      const profile = await response.json()
      if (profile.error) {
        setUser(null)
        return null
      }
      if (profile.message === 'Unauthenticated') {
        setUser(null)
        return null
      }

      setUser(profile)
      return profile
    } catch (err) {
      return null
    }
  }

  useEffect(() => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()

    if (token || token === '') {
      console.log('entrei no if token', token)
      getUser()
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    const myInit: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    }
    const response: Response = await fetch(`${GRADUATE_API}/v1/login`, myInit)

    if (response.status === 200) {
      const { user, token } = await response.json()

      setCookie(undefined, USER_TOKEN_NAME, token)
      api.defaults.headers.Cookie = `${USER_TOKEN_NAME}=${token}`
      setUser(user)
      if (currentRole === Role.PROFESSOR || currentRole === Role.ADMIN) {
        await router.push('/egressos')
      } else {
        await router.push(`/egressos/${user.id}`)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        setUser,
        getUser,
        signIn,
        isAuthenticated,
        logout,
        updateCurrentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth: () => AuthContextType = () => useContext(AuthContext)

export { AuthProvider, useAuth }
