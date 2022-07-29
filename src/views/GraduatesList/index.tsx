import React, { useEffect, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Roles, Theme } from '../../utils/enums'
import { Fields, Icon, Title } from './index.style'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { useAuth } from '../../api/AuthProvider'
import { Button } from '../Secretary/index.style'

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

  const getUrlPerRole = (role: Roles) => {
    if (role === Roles.ADMIN) return 'allgraduates'
    else if (role === Roles.PROFESSOR) return 'graduates'
    else console.error('Aluno não pode acessar')
  }

  useEffect(() => {
    const getGraduates = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/${getUrlPerRole(user.role)}`, {
        credentials: 'include',
      })
      if (response.status === 200) {
        const result = await response.json()
        setGraduates(result)
      }
    }
    getGraduates()
  }, [])

  const router = useRouter()
  const onClickEdit = (graduate: any) => {
    router.push(`/historico/${graduate.id}${graduate.workPlace ? '/' + graduate.workPlace.id : ''}`)
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
            {graduates?.map((graduate: any) => (
              <tr key={graduate.id}>
                <td>
                  <Fields>{graduate.name}</Fields>
                </td>
                <td>
                  <Fields status={graduate.status}>{status[graduate.status]}</Fields>
                </td>
                <td>
                  <Fields>{graduate.workPlace ? graduate.workPlace.name : '-'}</Fields>
                </td>
                <td>
                  <Fields>{graduate.position ?? '-'}</Fields>
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
        <br></br>
        <br></br>
        <br></br>
        <Button onClick={select}>Gerenciar Opções</Button>
      </div>
    </MainWrapper>
  )
}

export default GraduateList
