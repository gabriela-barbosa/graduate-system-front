import { AxiosInstance } from 'axios'
import { getAPIClient } from '@services/axios'

export const sendResetPasswordEmail = async (
  email: string,
  apiClient: AxiosInstance = getAPIClient()
) => {
  const { data } = await apiClient.post('/v1/send-email-reset-password', { email })
  return data
}
