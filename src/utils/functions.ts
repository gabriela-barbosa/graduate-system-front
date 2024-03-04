import { Role } from '@utils/enums'
import { NextRouter } from 'next/router'

export const getHomeUrlAccordingRole = (currentRole: Role, userId: string): string =>
  currentRole === Role.GRADUATE ? `/egressos/${userId}` : '/egressos'

export const redirectAccordingRole = async (
  currentRole: Role,
  userId: string,
  router: NextRouter
) => {
  const url = getHomeUrlAccordingRole(currentRole, userId)
  url && (await router.push(url))
}

export const hexWithOpacity = (hex: string, opacity: number): string => {
  const opacityHex = Math.round(opacity * 255).toString(16)
  return `${hex}${opacityHex}`
}

export const isNullOrUndefinedOrEmpty = (value?: string): boolean =>
  value === null || value === undefined || value === ''

export const passwordIsValid = (password: string): boolean => {
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/
  return regex.test(password)
}
