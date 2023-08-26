import { AxiosInstance } from 'axios'
import { Email } from '@modules/Emails/types'
import { InstitutionType } from '@modules/Institutions/types'

export const getInstitutionTypes = async (apiClient: AxiosInstance): Promise<InstitutionType[]> => {
  const { data } = await apiClient.get<InstitutionType[]>(`/v1/institution/type`)
  return data
}

export const deleteInstitutionType = async (apiClient: AxiosInstance, id: string) => {
  await apiClient.delete(`/v1/institution/type/${id}`)
}

export const saveInstitutionType = async (
  apiClient: AxiosInstance,
  institutionType: InstitutionType
) => {
  await apiClient.post(`/v1/institution/type`, institutionType)
}

export const updateInstitutionType = async (
  apiClient: AxiosInstance,
  institutionType: InstitutionType
) => {
  await apiClient.put(`/v1/institution/type/${institutionType.id}`, institutionType)
}
