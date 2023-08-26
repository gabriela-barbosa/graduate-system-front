import { PaginationType } from '@modules/Commons/types'

export interface Email {
  id?: string
  title: string
  name: string
  content: string
  buttonText: string
  buttonURL: string
  isGraduateEmail: boolean
  active: boolean
}

export interface GetEmailResponse {
  data: Email[]
  meta: PaginationType
}
