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

import Link from 'next/link'
import MainHeader from '../../components/MainHeader'
import { FormInputGroup, Input, Label } from '../../styles/index.style'
import { Icon } from '../GraduatesList/index.style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import MainWrapperSecretary from "../../components/MainWrapperSecretary";
import MainHeaderSecretary from "../../components/MainHeaderSecretary";
import {useRouter} from "next/router";

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Select: React.FC = () => {
  const router = useRouter()
  const [cnpqLevels, setCnpqLevels] = React.useState([])
  const [programs, setPrograms] = React.useState([])
  const [institutionTypes, setInstitutionTypes] = React.useState([])
  const [addProgram, setAddProgram] = React.useState<boolean>(true)
  const [newProgram, setNewProgram] = React.useState('')
  const [newInstitutionType, setNewInstitutionType] = React.useState('')
  const [newCnpqLevel, setNewCnpqLevel] = React.useState('')
  const [currentEditId, setCurrentEditId] = React.useState('')
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [show2, setShow2] = useState(false)
  const handleClose2 = () => setShow2(false)
  const handleShow2 = () => setShow2(true)
  const [show3, setShow3] = useState(false)
  const handleClose3 = () => setShow3(false)
  const handleShow3 = () => setShow3(true)

  const salvoSucesso = () => toast('Salvo com sucesso!')
  const deletadoSucesso = () => toast('Deletado com sucesso!')

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

  const getCnpqLevels = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
      credentials: 'include',
    })
    const result = await response.json()
    setCnpqLevels(result)
  }

  const deleteCnpqLevel = async (id: string) => {
    const myInit: RequestInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevel/${id}`, myInit)
    if (response.status < 400) {
      await getCnpqLevels()
      deletadoSucesso()
    }
  }

  const handleSaveCnpq = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ level: newCnpqLevel }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevel`, myInit as RequestInit)
    if (result) {
      await getCnpqLevels()
      salvoSucesso()
      setShow3(false)
      setNewCnpqLevel('')
    }
  }

  const handleUpdateCnpq = async () => {
    const myInit = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ level: newCnpqLevel }),
    }
    const result = await fetch(
      `${GRADUATE_API}/v1/cnpqlevels/${currentEditId}`,
      myInit as RequestInit
    )
    if (result) {
      setCurrentEditId('')
      await getCnpqLevels()
      salvoSucesso()
      setShow3(false)
      setNewCnpqLevel('')
    }
  }

  const getInstitutionTypes = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
      credentials: 'include',
    })
    const result = await response.json()
    setInstitutionTypes(result)
  }

  const deleteInstitutionType = async (id: string) => {
    const myInit: RequestInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/institution/type/${id}`, myInit)
    if (response.status < 400) {
      await getInstitutionTypes()
      deletadoSucesso()
    }
  }

  const handleSaveInstitution = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: newInstitutionType }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/institution/type`, myInit as RequestInit)
    if (result) {
      await getInstitutionTypes()
      salvoSucesso()
      setShow2(false)
      setNewInstitutionType('')
    }
  }

  const handleUpdateInstitution = async () => {
    const myInit = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: newInstitutionType }),
    }
    const result = await fetch(
      `${GRADUATE_API}/v1/institution/type/${currentEditId}`,
      myInit as RequestInit
    )
    if (result) {
      setCurrentEditId('')
      await getInstitutionTypes()
      salvoSucesso()
      setShow2(false)
      setNewInstitutionType('')
    }
  }

  

  const getPrograms = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/ciprograms`, {
      credentials: 'include',
    })
    const result = await response.json()
    setPrograms(result)
  }

  const deleteProgram = async (id: string) => {
    const myInit: RequestInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/ciprogram/${id}`, myInit)
    if (response.status < 400) {
      await getPrograms()
      deletadoSucesso()
    }
  }

  const handleSaveProgram = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ initials: newProgram }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram`, myInit as RequestInit)
    if (result) {
      await getPrograms()
      salvoSucesso()
      setShow(false)
      setNewProgram('')
    }
  }

  const handleUpdateProgram = async () => {
    const myInit = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ initials: newProgram }),
    }
    const result = await fetch(
      `${GRADUATE_API}/v1/ciprogram/${currentEditId}`,
      myInit as RequestInit
    )
    if (result) {
      setCurrentEditId('')
      await getPrograms()
      salvoSucesso()
      setShow(false)
      setNewProgram('')
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrentEditId(id)
    setNewProgram(value)
  }

  const handlerOpenEdit2 = (id: string, value: string) => {
    setShow2(true)
    setCurrentEditId(id)
    setNewInstitutionType(value)
  }

  const handlerOpenEdit3 = (id: string, value: string) => {
    setShow3(true)
    setCurrentEditId(id)
    setNewCnpqLevel(value)
  }

  useEffect(() => {
    ;(async () => {
      await getCnpqLevels()
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      await getPrograms()
    })()
  }, [newProgram])

  useEffect(() => {
    ;(async () => {
      await getInstitutionTypes()
    })()
  }, [])

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
