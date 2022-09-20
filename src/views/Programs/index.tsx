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

const Programs: React.FC = () => {
  const [programs, setPrograms] = React.useState([]);
  const [newProgram, setNewProgram] = React.useState('');
  const [currentEditId, setCurrentEditId] = React.useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter()
  const retornar = () => {
    router.push('/select')
  }

  const salvoSucesso = () => toast("Salvo com sucesso!");
  const deletadoSucesso = () => toast("Deletado com sucesso!");


  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
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
    console.log('olaaar')
    const myInit = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({initials: newProgram})
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram/${currentEditId}`, myInit as RequestInit)
    if (result){
      console.log(result)
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

  useEffect(() => {
    (async () => {
      await getPrograms();
    })()
  }, [newProgram]);

  return (
    <>
      <MainWrapperSecretary themeName={Theme.gray} hasContent={false} hasHeader={false}>
        <Background>
          <MainHeaderSecretary />
          <div className="contentSelect">
            <Title>Atualizar Programas</Title>
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
              {programs?.map((program) => (
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
            <Button2 onClick={retornar}>Voltar</Button2>
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>

          </div>
        </Background>
      </MainWrapperSecretary>


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
    </>
  )
}

export default Programs
