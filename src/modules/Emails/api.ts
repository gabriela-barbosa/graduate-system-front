import { AxiosInstance } from 'axios'
import { Email, GetEmailResponse } from '@modules/Emails/types'
import { User } from '@context/AuthContext'

export const getEmails = async (
  apiClient: AxiosInstance,
  pageSize: number,
  page = 1
): Promise<GetEmailResponse> => {
  const { data } = await apiClient.get<GetEmailResponse>(
    `/v1/emails?` +
      new URLSearchParams({
        page: (page - 1).toString(),
        pageSize: pageSize.toString(),
      })
  )

  return data
}

export const deleteEmail = async (apiClient: AxiosInstance, id: string) => {
  await apiClient.delete<GetEmailResponse>(`/v1/email/${id}`)
}

export const saveEmail = async (apiClient: AxiosInstance, email: Email) => {
  await apiClient.post(`/v1/email`, email)
}

export const updateEmail = async (apiClient: AxiosInstance, email: Email) => {
  await apiClient.put(`/v1/email/${email.id}`, email)
}

export const getUserByRole = async (apiClient: AxiosInstance, role: string): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(`/v1/users/role/${role}`)

  return data
}

export const sendEmails = async (
  apiClient: AxiosInstance,
  usersId: string[],
  emailContentId: string
): Promise<void> => {
  await apiClient.post(`/v1/emails/send`, { usersId, emailContentId })
}
