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

const Institutions: React.FC = () => {
  const [institutionTypes, setInstitutionTypes] = React.useState([]);
  const [newInstitutionType, setNewInstitutionType] = React.useState('');
  const [currentEditId, setCurrentEditId] = React.useState('');
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const salvoSucesso = () => toast("Salvo com sucesso!");
  const deletadoSucesso = () => toast("Deletado com sucesso!");
  const router = useRouter()
  const retornar = () => {
    router.push('/select')
  }

  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
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
      method: 'PUT',
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


  const handlerOpenEdit2 = (id: string, value: string) => {
    setShow2(true)
    setCurrentEditId(id)
    setNewInstitutionType(value)
  }

  useEffect(() => {
    (async () => {
      await getInstitutionTypes();
    })()
  }, []);

  return (
    <>
      <MainWrapperSecretary themeName={Theme.gray} hasContent={false} hasHeader={false}>
        <Background>
          <MainHeaderSecretary />
          <div className="contentSelect">
            <Title>Atualizar Tipo de Instituição</Title>
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
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
            <Button2 onClick={retornar}>Voltar</Button2>
          </div>
        </Background>
      </MainWrapperSecretary>

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
    </>
  )
}

export default Institutions
