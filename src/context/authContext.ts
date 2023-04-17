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
  id: string
  program: Program
  minuteDefense: number
  createdAt: Date
}

export type Program = {
  id: string
  initials: string
  active: boolean
  createdAt: Date
}

export type Advisor = {
  id: string
  courses: Course[]
  createdAt: Date
}

export type Graduate = {
  id: string
  courses: Course[]
  createdAt: Date
}

export type User = {
  id: string
  name: string
  email: string
  roles: Role[]
  advisor: Advisor
  createdAt: Date
  currentRole?: Role
}
