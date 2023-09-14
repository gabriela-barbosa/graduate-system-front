import { AxiosInstance } from 'axios'
import { ListGraduatesFilters } from '@modules/Egressos/types'
import { GraduatesListDetails } from '@modules/GraduatesList/types'

const pageSize = 10

const isValid = (value?: string) => value && value !== ''

const getFilledFilters = (filters?: ListGraduatesFilters) => {
  const { name, institutionType, institutionName } = filters ?? {}
  const arrayFilter: string[][] = []
  if (isValid(name)) arrayFilter.push(['name', name as string])
  // eslint-disable-next-line eqeqeq
  if (institutionType && institutionType !== '0')
    arrayFilter.push(['institutionType', institutionType])
  if (isValid(institutionName)) arrayFilter.push(['institutionName', institutionName as string])
  return arrayFilter
}

export const getGraduates = async (
  apiClient: AxiosInstance,
  page = 1,
  filters?: ListGraduatesFilters
): Promise<GraduatesListDetails> => {
  const filledFilters = getFilledFilters(filters)
  filledFilters.push(['page', `${page - 1}`], ['pageSize', `${pageSize}`])
  const { data } = await apiClient.get('/v1/graduates?' + new URLSearchParams(filledFilters))
  const { data: graduates, meta } = data
  return {
    graduates,
    meta,
  }
}
