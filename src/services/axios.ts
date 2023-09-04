import axios from 'axios'
import { USER_TOKEN_NAME } from '@utils/enums'
import { parseCookies } from 'nookies'

const GRADUATE_API = process.env.GRADUATE_API

axios.defaults.withCredentials = true
axios.defaults.baseURL = GRADUATE_API

export function getAPIClient(ctx?: any) {
  const api = axios.create()
  if (ctx) {
    const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)
    if (token) {
      api.defaults.headers.Cookie = `${USER_TOKEN_NAME}=${token}`
    }
  }

  return api
}
