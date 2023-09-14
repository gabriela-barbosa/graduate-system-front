import { AxiosInstance } from 'axios'
import { CNPQLevelInfo } from '@modules/WorkHistoryEdit/types'

export const getCNPQLevels = async (apiClient: AxiosInstance): Promise<CNPQLevelInfo[]> => {
  const { data } = await apiClient.get<CNPQLevelInfo[]>(`/v1/cnpq_levels`)
  return data
}

export const deleteCnpqLevel = async (apiClient: AxiosInstance, id: string) => {
  await apiClient.delete(`/v1/cnpq_level/${id}`)
}

export const saveCNPQ = async (apiClient: AxiosInstance, cnpqLevel: string) => {
  await apiClient.post(`/v1/cnpq_level`, { name: cnpqLevel })
}

export const updateCNPQ = async (apiClient: AxiosInstance, id: string, cnpqLevel: string) => {
  await apiClient.put(`/v1/cnpq_level/${id}`, { name: cnpqLevel })
}
