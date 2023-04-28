import { toast } from '@components'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

export const getInstitutionTypes = async () => {
  const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
    credentials: 'include',
  })

  if (response.status >= 400 && response.status < 600) {
    toast.error('Erro ao buscar tipos de instituição')
    return
  }
  const result = await response.json()
  return [
    { id: 0, label: 'Nenhum tipo de instituição selecionado' },
    ...result.map(({ name, id }) => ({ id, label: name })),
  ]
}
export const getCNPQLevels = async () => {
  const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
    credentials: 'include',
  })
  const result = await response.json()
  return [
    { id: 0, label: 'Nenhuma bolsa selecionada' },
    ...result.map(({ level, id }) => ({ id, label: level })),
  ]
}

export const getCourses = async () => {
  const response = await fetch(`${GRADUATE_API}/v1/courses`, {
    credentials: 'include',
  })
  const result = await response.json()
  return result
}
