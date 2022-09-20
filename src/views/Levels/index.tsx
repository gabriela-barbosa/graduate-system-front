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

const Levels: React.FC = () => {
  const [cnpqLevels, setCnpqLevels] = React.useState([]);
  const [newCnpqLevel, setNewCnpqLevel] = React.useState('');
  const [currentEditId, setCurrentEditId] = React.useState('');
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const salvoSucesso = () => toast("Salvo com sucesso!");
  const deletadoSucesso = () => toast("Deletado com sucesso!");
  const router = useRouter()
  const retornar = () => {
    router.push('/select')
  }

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
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({level: newCnpqLevel})
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevel/${currentEditId}`, myInit as RequestInit)
    if (result){
      setCurrentEditId('')
      await getCnpqLevels()
      salvoSucesso()
      setShow3(false)
      setNewCnpqLevel('')
    }
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


  return (
    <>
      <MainWrapperSecretary themeName={Theme.gray} hasContent={false} hasHeader={false}>
        <Background>
          <MainHeaderSecretary />
          <div className="contentSelect">
            <Title>Atualizar Níveis CNPQ</Title>

            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>

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
              {cnpqLevels?.map((level) => (
                <tr key={level.id}>
                  <td>
                    <Subtitle>{level.level}</Subtitle>
                  </td>
                  <td>
                    <Icon>
                      <FontAwesomeIcon  onClick={()=>handlerOpenEdit3(level.id, level.level)}icon={faPencilAlt} />
                      <FontAwesomeIcon onClick={()=>deleteCnpqLevel(level.id)} className="trash-icon" icon={faTrashAlt} />
                    </Icon>
                  </td>
                </tr>
              ))}
              </tbody>
              <br></br>
              <Button3 onClick={handleShow3}>Adicionar Nível CNPQ</Button3>
              <Button2 onClick={retornar}>Voltar</Button2>
            </table>
          </div>
        </Background>
      </MainWrapperSecretary>


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

export default Levels
