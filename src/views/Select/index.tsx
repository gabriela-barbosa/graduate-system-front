import React, { useEffect, useState } from 'react'
import { Theme } from '../../utils/enums'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Background,
  Content,
  Subtitle,
  Fields,
  Button,
  Button2,
  Title,
  FormEditar,
  Label2,
  Button3,
  Input2,
} from './index.style'
import {Icon} from "../GraduatesList/index.style";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import MainWrapperSecretary from "../../components/MainWrapperSecretary";
import MainHeaderSecretary from "../../components/MainHeaderSecretary";
import {useRouter} from "next/router";

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Select: React.FC = () => {
  const router = useRouter()
  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
  }

  const changeProgram = () => {
    router.push('/ciprograms')
  }

  const changeInstitution = () => {
    router.push('/institutiontypes')
  }

  const changeCnpq = () => {
    router.push('/cnpqlevels')
  }

  return (
    <>
      <MainWrapperSecretary themeName={Theme.gray} hasContent={false} hasHeader={false}>
        <Background>
          <MainHeaderSecretary />
            <div className="contentSelect">
            <Title>Gerenciamento de opções</Title>
              <br></br><br></br>


              <div className="row">
                <div className="card green" onClick={changeProgram}>
                  <h2 className="preto">Configurar Programas</h2>
                  <p>Adicione, exclua ou edite um programa</p>
                  <img className="image" src="foto1.png" alt="money"/>
                </div>

                <div className="card red" onClick={changeInstitution}>
                  <h2 className="preto">Configurar Tipo de Instituição</h2>
                  <p>Adicione, exclua ou edite um tipo de instituição</p>
                  <img className="image" src="foto2.jpg" alt="settings"/>
                </div>

                <div className="card blue" onClick={changeCnpq}>
                  <h2 className="preto">Configurar Níveis CNPQ</h2>
                  <p>Adicione, exclua ou edite um nível CNPQ</p>
                  <img className="image" src="foto3.png" alt="article"/>
                </div>
              </div>

            </div>
        </Background>
      </MainWrapperSecretary>

    </>
  )
}

export default Select
