type InstitutionType = {
  id?: number
  name: string
  type: number
}

type FormType = {
  email: string
  newEmail?: string
  position?: string
  hasFinishedDoctorateOnUFF?: boolean
  hasFinishedMasterDegreeOnUFF?: boolean
  institution?: InstitutionType
  postDoctorate?: InstitutionType
  cnpqLevelId?: number
}
export type { FormType, InstitutionType }
