type InstitutionType = {
  id?: number
  name: string
  type: number
}

interface Option {
  id: number | string
  label: string
}

type FormType = {
  email: string
  newEmail?: string
  position?: string
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  institution?: InstitutionType
  postDoctorate?: InstitutionType
  cnpqId?: number
}

interface InstitutionInfo {
  id?: string
  typeId: string
  typeName: string
  name: string
}

interface PostDoctorateInfo {
  id: string
  institution: InstitutionInfo
  startedAt: string
  endedAt: string | null
}

interface CNPQScholarshipInfo {
  id: string
  levelId: string
  startedAt: string
  endedAt: string | null
}

interface WorkHistoryInfo {
  id: string
  institution: InstitutionInfo
  startedAt: string
  endedAt: string | null
  position?: string
}

enum Fields {
  WORK_HISTORY = 'workHistory',
  CNPQ_SCHOLARSHIP = 'cnpqScholarship',
  POST_DOCTORATE = 'postDoctorate',
}

interface GraduateWorkHistoriesInfo {
  graduateId: string
  graduateName: string
  email: string
  postDoctorate?: PostDoctorateInfo
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  successCase?: string
  cnpqScholarships: CNPQScholarshipInfo[]
  workHistories: WorkHistoryInfo[]
  pendingFields: string[]
  emptyFields: string[]
}

interface CNPQLevelInfo {
  id: string
  name: string
}

export type {
  FormType,
  InstitutionType,
  Option,
  GraduateWorkHistoriesInfo,
  CNPQLevelInfo,
  WorkHistoryInfo,
}

export { Fields }
