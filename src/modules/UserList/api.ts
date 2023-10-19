import { AxiosInstance } from 'axios'

export const createUpdateUser = async (apiClient: AxiosInstance, user) => {
  await apiClient.post('/v1/register', user)
}

export const getUsers = async (
  apiClient: AxiosInstance,
  page = 1,
  pageSize = 10,
  name?: string
) => {
  const filledFilters = [
    ['page', `${page - 1}`],
    ['pageSize', `${pageSize}`],
  ]
  name && filledFilters.push(['name', name])
  const url = '/v1/users?' + new URLSearchParams(filledFilters)

  const { data } = await apiClient.get(url)
  return data
}
