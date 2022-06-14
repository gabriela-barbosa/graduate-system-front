import Image from 'next/image'
import Link from 'next/link'
import { Header, Cabecalho, Title, Icon, Texto } from './index.style'
import logo from '../../../public/logo-ic-uff-verde.png'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useAuth } from '../../../pages/api/AuthProvider'
import { useRouter } from 'next/router'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const MainHeader: React.FC = () => {
  const { user, setUser } = useAuth()
  const router = useRouter()
  const logout = async () => {
    localStorage.clear()
    sessionStorage.clear()
    console.log('oi')
    setUser(null)
    await router.push('/')
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const result = await fetch(`${GRADUATE_API}/v1/logout`, myInit as RequestInit)
  }

  return (
    <Header>
      <Cabecalho>
        <table className="cabecalho">
          <tr>
            <td>
              <Link href="/listagem" passHref>
                <a>
                  <Image src={logo} alt="Logo IC-UFF" />
                </a>
              </Link>
            </td>
            <td className="colunameio">
              <Title> Sistema de Egressos </Title>
            </td>
            <td align="right">
              <Icon>
                <FontAwesomeIcon icon={faUserCircle} />
              </Icon>
            </td>
            <td align="right">
              <Texto>Olá, {user?.name}!</Texto> <button onClick={logout}> Sair</button>
            </td>
          </tr>
        </table>
      </Cabecalho>
    </Header>
  )
}

export default MainHeader
