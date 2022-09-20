import React, { useEffect, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Roles, Theme } from '../../utils/enums'
import { Title, Fields, Icon } from './index.style'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useAuth } from '../../api/AuthProvider'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const status = {
  PENDING: 'Pendente',
  UPDATED: 'Atualizado',
  UPDATED_PARTIALLY: 'Atualizado parcialmente',
  UNKNOWN: 'Desconhecido',
}

const GraduateList: React.FC = () => {
  const [graduates, setGraduates] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const getGraduates = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/graduate`, {
        credentials: 'include',
      })
      const result = await response.json()
      console.log('graduates', result)
      setGraduates(result)
    }
    getGraduates()
  }, [])

  const router = useRouter()
  const onClickEdit = (graduate: any) => {
    if (user.role === Roles.ADMIN) router.push('/secretaria')
    else
      router.push(
        `/historico/${graduate.id}${graduate.workPlace ? '/' + graduate.workPlace.id : ''}`
      )
  }

  const select = () => {
    router.push('/select')
  }

  return (
    <MainWrapper themeName={Theme.white} hasContent={true}>
      <div className="contentSelect">
        <Title>Listagem de Egressos</Title>
        <table>
          <thead>
            <tr className="table-header">
              <td>
                <Fields>Nome</Fields>
              </td>
              <td>
                <Fields>Status</Fields>
              </td>
              <td>
                <Fields>Local de Trabalho</Fields>
              </td>
              <td>
                <Fields>Cargo</Fields>
              </td>
              <td>
                <Fields>Editar</Fields>
              </td>
            </tr>
          </thead>
          <tbody>
            {graduates.map((graduate: any) => (
              <tr key={graduate.id}>
                <td>
                  <Fields>{graduate.name}</Fields>
                </td>
                <td>
                  <Fields status={graduate.status}>{status[graduate.status]}</Fields>
                </td>
                <td>
                  <Fields>{graduate.workPlace.name}</Fields>
                </td>
                <td>
                  <Fields>{graduate.position}</Fields>
                </td>
                <td>
                  <Icon>
                    <FontAwesomeIcon onClick={() => onClickEdit(graduate)} icon={faPencilAlt} />
                  </Icon>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainWrapper>
  )
}

export default GraduateList
