import { toast } from '@components'
import { AxiosInstance } from 'axios'
import { CNPQLevelInfo } from '@modules/WorkHistoryEdit/types'

export const getCNPQLevels = async (apiClient: AxiosInstance): Promise<CNPQLevelInfo[]> => {
  try {
    const { data } = await apiClient.get<CNPQLevelInfo[]>(`/v1/cnpq_levels`)
    return data
  } catch (error) {
    toast.error('Erro ao buscar tipos de bolsa CNPQ')
    throw error
  }
}
