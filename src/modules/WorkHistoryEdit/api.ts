import { toast } from '@components'
import { AxiosInstance } from 'axios'
import { CNPQLevelInfo, GraduateWorkHistoriesInfo } from '@modules/WorkHistoryEdit/types'

export const getGraduateInfoAndWorkHistory = async (
  apiClient: AxiosInstance,
  graduateId: string
): Promise<GraduateWorkHistoriesInfo> => {
  try {
    const { data } = await apiClient.get<GraduateWorkHistoriesInfo>(
      `/v1/work-history?userId=${graduateId}`
    )
    return data
  } catch (error) {
    toast.error('Erro ao buscar tipos de instituição')
    return error
  }
}

export const getInstitutionTypes = async (apiClient: AxiosInstance) => {
  try {
    const { data } = await apiClient.get(`/v1/institution/type`)

    return [
      { id: 0, label: 'Nenhum tipo de instituição selecionado' },
      ...data.map(({ name, id }) => ({ id, label: name })),
    ]
  } catch (error) {
    toast.error('Erro ao buscar tipos de instituição')
    return error
  }
}

export const getCNPQLevels = async (apiClient: AxiosInstance) => {
  const { data, status } = await apiClient.get<CNPQLevelInfo[]>(`/v1/cnpq_levels`)
  if (status >= 400 && status < 600) {
    toast.error('Erro ao buscar tipos de bolsa CNPQ')
    return data
  }
  return [
    { id: 0, label: 'Nenhuma bolsa selecionada' },
    ...data.map(({ name, id }) => ({ id, label: name })),
  ]
}

export const getCourses = async (apiClient: AxiosInstance) => {
  const { data, status } = await apiClient.get(`/v1/courses`)
  if (status >= 400 && status < 600) {
    toast.error('Erro ao buscar cursos')
    return data
  }
  return data.map(({ level, id }) => ({ id, label: level }))
}
