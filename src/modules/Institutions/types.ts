import { InstitutionType } from '@modules/InstitutionTypes/types'

export interface Institution {
  id?: string
  name: string
  type: InstitutionType
}

export interface InstitutionFilters {
  name?: string
  typeName?: string
}
