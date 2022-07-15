import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import MainWrapper from '../../components/MainWrapper'
import { Theme } from '../../utils/enums'
import { useForm } from 'react-hook-form'
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
import {Icon} from "../GraduatesList/index.style";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Select: React.FC = () => {
  const [cnpqLevels, setCnpqLevels] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [institutionTypes, setInstitutionTypes] = React.useState([]);
  const [addProgram, setAddProgram] = React.useState<boolean>(true);
  const [newProgram, setNewProgram] = React.useState('');
  const [newInstitutionType, setNewInstitutionType] = React.useState('');
  const [newCnpqLevel, setNewCnpqLevel] = React.useState('');
  const [currentEditId, setCurrentEditId] = React.useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const salvoSucesso = () => toast("Salvo com sucesso!");
  const deletadoSucesso = () => toast("Deletado com sucesso!");


  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
  }

  const getCnpqLevels = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
      credentials: 'include',
    })
    const result = await response.json()
    setCnpqLevels(result)
  }

  const deleteCnpqLevel = async (id: string) => {
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevel/${id}`, myInit)
    if (response.status < 400){
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
      body: JSON.stringify({level: newCnpqLevel})
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevel`, myInit as RequestInit)
    if (result){
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
      body: JSON.stringify({level: newCnpqLevel})
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevels/${currentEditId}`, myInit as RequestInit)
    if (result){
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
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/institution/type/${id}`, myInit)
    if (response.status < 400){
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
      body: JSON.stringify({name: newInstitutionType})
    }
    const result = await fetch(`${GRADUATE_API}/v1/institution/type`, myInit as RequestInit)
    if (result){
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
      body: JSON.stringify({name: newInstitutionType})
    }
    const result = await fetch(`${GRADUATE_API}/v1/institution/type/${currentEditId}`, myInit as RequestInit)
    if (result){
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
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/ciprogram/${id}`, myInit)
    if (response.status < 400){
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
      body: JSON.stringify({initials: newProgram})
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram`, myInit as RequestInit)
    if (result){
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
      body: JSON.stringify({initials: newProgram})
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram/${currentEditId}`, myInit as RequestInit)
    if (result){
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
    (async () => {
      await getCnpqLevels();
    })()
  }, []);

  useEffect(() => {
    (async () => {
      await getPrograms();
    })()
  }, [newProgram]);

  useEffect(() => {
    (async () => {
      await getInstitutionTypes();
    })()
  }, []);

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false} hasHeader={false}>
        <Background>
          <MainHeader />
            <div className="contentSelect">
            <Title>Gerenciamento de opções</Title>
                <table className="tables">
                  <thead>
                  <tr className="table-header">
                    <td>
                      <Fields>Nome do Programa </Fields>
                    </td>
                    <td>
                      <Fields></Fields>
                    </td>
                  </tr>
                  </thead>
                  <tbody>
                  {programs.map((program) => (
                    <tr key={program.id}>
                      <td>
                        <Subtitle>{program.initials}</Subtitle>
                      </td>
                      <td>
                        <Icon>
                          <FontAwesomeIcon onClick={()=>handlerOpenEdit(program.id,program.initials)} icon={faPencilAlt} />
                          <FontAwesomeIcon onClick={()=>deleteProgram(program.id)} className="trash-icon" icon={faTrashAlt} />
                        </Icon>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                <br></br>
                <Button3 onClick={handleShow}>Adicionar Programa</Button3>
              <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>


              <br></br><br></br><br></br><br></br><br></br>
                <table className="tables">
                  <thead>
                  <tr className="table-header">
                    <td>
                      <Fields>Tipo de Instituição </Fields>
                    </td>
                    <td>
                      <Fields></Fields>
                    </td>
                  </tr>
                  </thead>
                  {institutionTypes.map((institutionType) => (
                    <tr key={institutionType.id}>
                      <td>
                        <Subtitle>{institutionType.name}</Subtitle>
                      </td>
                      <td>
                        <Icon>
                          <FontAwesomeIcon onClick={()=>handlerOpenEdit2(institutionType.id, institutionType.name)} icon={faPencilAlt} />
                          <FontAwesomeIcon onClick={()=>deleteInstitutionType(institutionType.id)} className="trash-icon" icon={faTrashAlt} />
                        </Icon>
                      </td>
                    </tr>
                  ))}
                </table>
                <br></br>
                <Button3 onClick={handleShow2}>Adicionar Instituição</Button3>
              <br></br><br></br><br></br><br></br><br></br>
                <table className="tables">
                  <thead>
                  <tr className="table-header">
                    <td>
                      <Fields>Nível CNPQ </Fields>
                    </td>
                    <td>
                      <Fields></Fields>
                    </td>
                  </tr>
                  </thead>
                  <tbody>
                  {cnpqLevels.map((level) => (
                    <tr key={level.id}>
                      <td>
                        <Subtitle>{level.level}</Subtitle>
                      </td>
                      <td>
                        <Icon>
                          <FontAwesomeIcon icon={faPencilAlt} />
                          <FontAwesomeIcon onClick={()=>deleteCnpqLevel(level.id)} className="trash-icon" icon={faTrashAlt} />
                        </Icon>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                  <br></br>
                  <Button3 onClick={handleShow3}>Adicionar Nível CNPQ</Button3>
                </table>
            </div>
        </Background>
      </MainWrapper>


      <Modal  show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields >{currentEditId === '' ? "Adicionar" : "Editar" } Programa</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input2 type="text" onChange={(event)=> setNewProgram(event.target.value)} value={newProgram} placeholder="Novo Programa" required></Input2>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={currentEditId === '' ? handleSaveProgram : handleUpdateProgram}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal  show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Fields >{currentEditId === '' ? "Adicionar" : "Editar" } Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input2 type="text" onChange={(event)=> setNewInstitutionType(event.target.value)} placeholder="Nova Instituição" required></Input2>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={currentEditId === '' ? handleSaveInstitution : handleUpdateInstitution}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal  show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Fields >{currentEditId === '' ? "Adicionar" : "Editar" } Nível CNPQ</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input2 type="text" onChange={(event)=> setNewCnpqLevel(event.target.value)} placeholder="Novo Nível" required></Input2>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={currentEditId === '' ? handleSaveCnpq : handleUpdateCnpq}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Select
