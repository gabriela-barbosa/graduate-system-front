import { Role } from '@utils/enums'
import { NextRouter } from 'next/router'

export const redirectAccordingRole = async (
  currentRole: Role,
  userId: string,
  router: NextRouter
) => {
  console.log(currentRole)
  if (currentRole === Role.PROFESSOR || currentRole === Role.ADMIN) {
    console.log('entrei no if currentRole', currentRole)
    await router.push('/egressos')
    return
  }
  if (currentRole === Role.GRADUATE) await router.push(`/egressos/${userId}`)
}
