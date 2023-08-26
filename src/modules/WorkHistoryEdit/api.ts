import { AxiosError, AxiosInstance } from 'axios'
import { CNPQLevelInfo, GraduateWorkHistoriesInfo } from '@modules/WorkHistoryEdit/types'
import { SelectItem } from '@utils/types'

export const getGraduateInfoAndWorkHistory = async (
  apiClient: AxiosInstance,
  graduateId: string
): Promise<GraduateWorkHistoriesInfo | AxiosError> => {
  const { data } = await apiClient.get<GraduateWorkHistoriesInfo>(
    `/v1/work-history?userId=${graduateId}`
  )
  return data
}

export const getInstitutionTypes = async (
  apiClient: AxiosInstance
): Promise<SelectItem[] | AxiosError> => {
  const { data } = await apiClient.get(`/v1/institution/type`)

  return [
    { id: 0, label: 'Nenhum tipo de instituição selecionado' },
    ...data.map(({ name, id }) => ({ id, label: name })),
  ]
}

export const getCNPQLevels = async (
  apiClient: AxiosInstance
): Promise<SelectItem[] | AxiosError> => {
  const { data } = await apiClient.get<CNPQLevelInfo[]>(`/v1/cnpq_levels`)

  return [
    { id: 0, label: 'Nenhuma bolsa selecionada' },
    ...data.map(({ name, id }) => ({ id, label: name })),
  ]
}

export const getCourses = async (apiClient: AxiosInstance): Promise<SelectItem[] | AxiosError> => {
  const { data, status } = await apiClient.get(`/v1/courses`)

  return data.map(({ level, id }) => ({ id, label: level }))
}
