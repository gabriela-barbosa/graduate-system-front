import { AxiosInstance } from 'axios'

interface User {
  id: string
  name: string
  email: string
  currentRole: string
  roles: string[]
}

interface UserLean {
  id: string
  name: string
  email: string
}

interface CIProgram {
  initials: string
}

interface Course {
  program: CIProgram
  graduate: UserLean
  defenseMinute: string
  titleDate: Date
  advisor: UserLean
}

interface Institution {
  id: string
  typeId: string
  typeName: string
  name: string
}

interface PostDoctorate {
  id: string
  institution: Institution
  startedAt: Date
  endedAt?: Date
}

interface CNPQScholarship {
  id: string
  levelId: string
  startedAt: Date
  endedAt?: Date
}

interface WorkHistory {
  id: string
  institution: Institution
  startedAt: Date
  endedAt?: Date
  position?: string
}

interface Graduate {
  courses: Course[]
  postDoctorate?: PostDoctorate
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  successCase?: string
  cnpqScholarships: CNPQScholarship[]
  workHistories: WorkHistory[]
}

interface Advisor {
  courses: Course[]
}

export interface UserInfo {
  user: User
  graduate?: Graduate
  advisor?: Advisor
}
export const getUser = async (id: string, apiClient: AxiosInstance): Promise<UserInfo> => {
  const { data } = await apiClient.get('/v1/user/' + id)
  return data
}
