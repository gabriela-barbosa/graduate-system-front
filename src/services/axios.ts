import axios from 'axios'
import { USER_TOKEN_NAME } from '@utils/enums'
import { parseCookies } from 'nookies'

const GRADUATE_API = process.env.GRADUATE_API

export function getAPIClient(ctx?: never) {
  const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: GRADUATE_API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // if (token) {
  //   api.defaults.headers.Cookie = `${USER_TOKEN_NAME}=${token}`
  // }

  return api
}
