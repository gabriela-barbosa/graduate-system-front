import { User } from '@context/AuthContext'
import { Role } from '@utils/enums'
import { NextRouter } from 'next/router'
import { RolesByPaths } from '@utils/types'

export const redirectAccordingRole = async (user: User, router: NextRouter) => {
  const currentRole = user?.currentRole
  if (currentRole === Role.PROFESSOR || currentRole === Role.ADMIN) {
    await router.push('/egressos')
    return
  }
  if (currentRole === Role.GRADUATE) await router.push(`/egressos/${user.id}`)
}
