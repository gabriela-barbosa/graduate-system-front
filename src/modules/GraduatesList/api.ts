import { AxiosInstance } from 'axios'
import { ListGraduatesFilters } from '@modules/Egressos/types'
import { GraduatesListDetails } from '@modules/GraduatesList/types'

const pageSize = 10

const isValid = (value?: string) => value && value !== '' && value !== '0'

const getFilledFilters = (filters?: ListGraduatesFilters) => {
  const arrayFilter: string[][] = []
  for (const [key, value] of Object.entries(filters ?? {})) {
    if (isValid(value)) arrayFilter.push([key, value as string])
  }
  return arrayFilter
}

export const getGraduates = async (
  apiClient: AxiosInstance,
  page = 1,
  filters?: ListGraduatesFilters
): Promise<GraduatesListDetails> => {
  const filledFilters = getFilledFilters(filters)
  filledFilters.push(['page', `${page - 1}`], ['pageSize', `${pageSize}`])
  console.log(filledFilters)
  const { data } = await apiClient.get('/v1/graduates?' + new URLSearchParams(filledFilters))
  const { data: graduates, meta } = data
  return {
    graduates,
    meta,
  }
}
