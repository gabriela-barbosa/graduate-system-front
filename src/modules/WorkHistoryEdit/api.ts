import { AxiosError, AxiosInstance } from 'axios'
import { GraduateWorkHistoriesInfo, InstitutionInfoDTO } from '@modules/WorkHistoryEdit/types'
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

export const getInstitutionAutocomplete = async (
  searchTerm: string,
  apiClient: AxiosInstance = getAPIClient()
): Promise<InstitutionInfoDTO[]> => {
  const { data: dataResponse } = await apiClient.get(
    `v1/institutions?name=${searchTerm}&pageSize=1000`
  )
  const { data } = dataResponse
  return data
}
