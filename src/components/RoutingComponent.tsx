import React, { useEffect } from 'react'
import { useAuth } from '@context/AuthProvider'
import { useRouter } from 'next/router'
import { Role } from '@utils/enums'
import Home from '../pages'

const RoutingComponent = ({ Component, pageProps }) => {
  const { currentRole } = useAuth()
  const router = useRouter()

  const allowPage = () => {
    console.log('allowPage', currentRole)
    if (router.pathname.startsWith('/')) return true
    if (
      router.pathname.match(
        /\/egressos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
      ) &&
      currentRole &&
      [Role.ADMIN, Role.PROFESSOR, Role.GRADUATE].indexOf(currentRole)
    )
      return true
    if (
      router.pathname.startsWith('/egressos') &&
      currentRole &&
      [Role.ADMIN, Role.PROFESSOR].indexOf(currentRole)
    )
      return true
    return !!(
      router.pathname.startsWith('/gerenciamento') &&
      currentRole &&
      [Role.ADMIN].indexOf(currentRole)
    )
  }

  useEffect(() => {
    allowPage()
  }, [router.pathname])

  const ComponentToRender = allowPage() ? Component : Home

  return <ComponentToRender {...pageProps} />
}

export default RoutingComponent
