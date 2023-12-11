import { AxiosError, AxiosInstance } from 'axios'
import { GraduateWorkHistoriesInfo } from '@modules/WorkHistoryEdit/types'
import { SelectItem } from '@utils/types'
import { getAPIClient } from '@services/axios'

export const getGraduateInfoAndWorkHistory = async (
  apiClient: AxiosInstance,
  graduateId: string
): Promise<GraduateWorkHistoriesInfo | AxiosError> => {
  const { data } = await apiClient.get<GraduateWorkHistoriesInfo>(
    `/v1/work-history?userId=${graduateId}`
  )
  return data
}

export const getCourses = async (
  apiClient: AxiosInstance = getAPIClient()
): Promise<SelectItem[] | AxiosError> => {
  const { data } = await apiClient.get(`/v1/courses`)

  return data.map(({ level, id }) => ({ id, label: level }))
}
