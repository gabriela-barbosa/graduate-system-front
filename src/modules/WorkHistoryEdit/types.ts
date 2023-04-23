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
export type { FormType, InstitutionType, Option }
