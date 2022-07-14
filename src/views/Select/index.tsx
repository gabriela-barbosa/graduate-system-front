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
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

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

  const getPrograms = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/ciprograms`, {
      credentials: 'include',
    })
    const result = await response.json()
    setPrograms(result)
  }

  const deleteProgram = async (id: number) => {
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(`${GRADUATE_API}/v1/ciprograms/${id}`, myInit)
    if (response.status < 400){
      const result = await response.json()
      setPrograms(result)
      console.log(result)
    }
  }

  const getInstitutionTypes = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
      credentials: 'include',
    })
    const result = await response.json()
    setInstitutionTypes(result)
  }

  useEffect(() => {
    (async () => {
      await getCnpqLevels();
      await getPrograms();
      await getInstitutionTypes();
    })()
  }, []);

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false} hasHeader={false}>
        <Background>
          <MainHeader />
          <Content>
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
                          <FontAwesomeIcon icon={faPencilAlt} />
                          <FontAwesomeIcon onClick={()=>deleteProgram(program.id)} className="trash-icon" icon={faTrashAlt} />
                        </Icon>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                <br></br>
                <Button3 onClick={handleShow}>Adicionar Programa</Button3>


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
                          <FontAwesomeIcon icon={faPencilAlt} />
                          <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
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
                          <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
                        </Icon>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                  <br></br>
                  <Button3 onClick={handleShow3}>Adicionar Nível CNPQ</Button3>
                </table>
          </Content>
        </Background>
      </MainWrapper>
      <Modal  show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields >Adicionar Programa</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input2 type="text" placeholder="Novo Programa" required></Input2>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={handleClose}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal  show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Fields >Adicionar Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input2 type="text" placeholder="Nova Instituição" required></Input2>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={handleClose2}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal  show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Fields >Adicionar Nível CNPQ</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input2 type="text" placeholder="Novo Nível" required></Input2>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={handleClose3}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Select
