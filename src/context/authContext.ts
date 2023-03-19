// @types.todo.ts
import { Dispatch, SetStateAction } from 'react'
import { Role } from '../utils/enums'

// export interface User {
//   emails: number
// }

export type AuthContextType = {
  user: User
  setUser: Dispatch<SetStateAction<User>>
  getUser: () => Promise<void>
}

export type Course = {
  id: number
  program: Program
  minuteDefense: number
  createdAt: Date
}

export type Program = {
  id: number
  initials: string
  active: boolean
  createdAt: Date
}

export type Advisor = {
  id: number
  courses: Course[]
  createdAt: Date
}

export type User = {
  id: number
  name: string
  email: string
  roles: Role[]
  advisor: Advisor
  createdAt: Date
  currentRole?: Role
}
