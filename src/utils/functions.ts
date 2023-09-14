import { Role } from '@utils/enums'
import { NextRouter } from 'next/router'

export const redirectAccordingRole = async (
  currentRole: Role,
  userId: string,
  router: NextRouter
) => {
  if (currentRole === Role.PROFESSOR || currentRole === Role.ADMIN) {
    await router.push('/egressos')
    // router.replace(router.asPath)
    return
  }
  if (currentRole === Role.GRADUATE) await router.push(`/egressos/${userId}`)
}
