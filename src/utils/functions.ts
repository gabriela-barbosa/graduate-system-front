import { Role } from '@utils/enums'
import { NextRouter } from 'next/router'

export const getHomeUrlAccordingRole = (currentRole: Role, userId: string) => {
  if (currentRole === Role.PROFESSOR || currentRole === Role.ADMIN) return '/egressos'
  if (currentRole === Role.GRADUATE) return `/egressos/${userId}`
}
export const redirectAccordingRole = async (
  currentRole: Role,
  userId: string,
  router: NextRouter
) => {
  const url = getHomeUrlAccordingRole(currentRole, userId)
  url && (await router.push(url))
}
