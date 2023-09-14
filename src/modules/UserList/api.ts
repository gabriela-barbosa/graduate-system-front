import { AxiosInstance } from 'axios'

export const createUpdateUser = async (apiClient: AxiosInstance, user) => {
  await apiClient.post('/v1/register', user)
}

export const getUsers = async (apiClient: AxiosInstance, page = 1, pageSize = 10) => {
  const url =
    '/v1/users?' +
    new URLSearchParams({ page: (page - 1).toString(), pageSize: pageSize.toString() })

  try {
    const { data } = await apiClient.get(url)
    return data
  } catch (e) {
    console.log(e)
  }
}
