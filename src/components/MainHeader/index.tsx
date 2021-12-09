import Image from 'next/image'
import Link from 'next/link'
import { Header, Cabecalho, Title, Icon, Texto } from './index.style'
import logo from '../../../public/logo-ic-uff-verde.png'
import { faPencilAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function MainHeader() {
  return (
    <Header>
      <Cabecalho>
        <table className="cabecalho">
          <tr>
            <td>
              <Link href="/" passHref>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <Image src={logo} alt="Logo M4U" />
                </a>
              </Link>
            </td>
            <td className="colunameio">
              <Title> Sistema de Egressos </Title>
            </td>
            <td align="right">
              <Icon><FontAwesomeIcon icon={faUserCircle} /></Icon>
            </td>
            <td align="right">
              <Texto>Olá, Vanessa!</Texto>
            </td>
          </tr>
        </table>
      </Cabecalho>
    </Header>
  );
}

export default MainHeader
