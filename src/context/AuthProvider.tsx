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
import { redirectAccordingRole } from '@utils/functions'
import { getUser, login, updateCurrentRole } from '@context/api'

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export type AuthContextType = {
  user: User | null
  currentRole?: Role
  setUser: Dispatch<SetStateAction<User>>
  getUser: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
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

  const handleUpdateCurrentRole = async (role: Role) => {
    const { currentRole } = await updateCurrentRole(role)
    const currentUser = { ...user, currentRole } as User
    setUser(currentUser)
    await redirectAccordingRole(currentRole, currentUser.id, router)
  }

  const handleLogout = async () => {
    setUser(null)
    setCookie(undefined, USER_TOKEN_NAME, '')
    await router.push('/')
  }

  async function handleGetUser() {
    try {
      const user = await getUser()
      setUser(user)
    } catch (err) {
      setUser(null)
    }
  }

  useEffect(() => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()

    if (token || token === '') {
      handleGetUser()
    }
  }, [])

  useEffect(() => {
    const { [USER_TOKEN_NAME]: token } = parseCookies()
    if (!user && !token) router.push('/')
  }, [user])

  async function handleLogin(email: string, password: string) {
    const { user, token } = await login(email, password)

    setCookie(undefined, USER_TOKEN_NAME, token)

    setUser(user)
    if (user.currentRole === Role.PROFESSOR || user.currentRole === Role.ADMIN) {
      await router.push('/egressos')
    } else {
      await router.push(`/egressos/${user.id}`)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        setUser,
        getUser: handleGetUser,
        login: handleLogin,
        isAuthenticated,
        logout: handleLogout,
        updateCurrentRole: handleUpdateCurrentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth: () => AuthContextType = () => useContext(AuthContext)

export { AuthProvider, useAuth }
