import React, {useEffect} from 'react'
import Head from 'next/head'
import MainWrapper from '../../src/components/MainWrapper'
import { Theme } from '../../src/utils/enums'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Background,
  Content,
  Subtitle,
  Fields,
  Button,
  Button2,
  Input,
  Label,
  Title,
  FormInputGroup,
  FormEditar,
  Label2
} from './index.style'
import fotoIcUff from '../public/fotoicuff.jpg'
import logo from '../public/logo-ic-uff-branca.png'
import Image from 'next/image'
import Link from 'next/link'
import MainHeader from "../../src/components/MainHeader";
import {useAuth} from "../api/AuthProvider";
import {useRouter} from "next/router";


const Editar: React.FC = () => {
  const notify = () => toast.success("Alteração salva com sucesso!");
  const [possuiVinculo, setPossuiVinculo] = React.useState("");
  const [bolsistaCNPQ, setBolsistaCNPQ] = React.useState("");
  const [concluiuMestrado, setConcluiuMestrado] = React.useState("");
  const [concluiuDoutorado, setConcluiuDoutorado] = React.useState("");
  const [concluiuPosDoutorado, setConcluiuPosDoutorado] = React.useState("");
  const [opcoesInstituicao, setOpcoesInstituicao] = React.useState([]);
  const ehDoutor = true
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    (async () => {
    })();
  }, []);

  const onSubmit = data => {
    fetch('http://localhost:8081/')
  }
  const { user, setUser } = useAuth()
  const router = useRouter()


  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false}>
        <Background>
          <MainHeader />
          <Content>
            <Title>Edite seus Dados</Title>
            <FormEditar>
              <form className="formEditar" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="column">
                    <FormInputGroup>
                      <Input defaultValue={user?.email} type="email" title="Digite um e-mail válido." pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required/>
                      <Label>E-mail</Label>
                    </FormInputGroup>
                    <FormInputGroup>
                      <input className="radioInput2" type="radio" id="html" name="fav_language" value="Possui Vínculo Institucional" onChange={(e)=>setPossuiVinculo(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="html">Sim</label>
                      <input className="radioInput" type="radio" id="css" name="fav_language" value="Sem Vínculo Institucional" onChange={(e)=>setPossuiVinculo(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="css">Não </label>
                      <Label2>Possui vínculo institucional ?</Label2>
                    </FormInputGroup>
                    {possuiVinculo == "Possui Vínculo Institucional" && <div>
                        <FormInputGroup>
                          <select name="select" >
                            <option value="valor1">Universidade Federal</option>
                            <option value="valor2" selected>Instituto Federal</option>
                            <option value="valor3">Instituição Estadual</option>
                            <option value="valor4">Instituição Particular</option>
                            <option value="valor5">Organizações Públicas</option>
                            <option value="valor6">Empresas ou outras instituições no Brasil</option>
                            <option value="valor7">Empresas ou outras instituições no exterior</option>
                            <option value="valor8">Outros (Bolsista, Tutor, etc)</option>
                          </select>
                          <Label2>Tipo de Instituição</Label2>
                        </FormInputGroup>
                        <FormInputGroup>
                          <Input placeholder="Local de Trabalho" defaultValue={user?.institution?.name} required />
                          <Label>Nome da Instituição</Label>
                        </FormInputGroup>
                        <FormInputGroup>
                          <Input placeholder="Cargo" defaultValue={user?.position} pattern="[^0-9]*" title="O campo deve possuir apenas letras." required />
                          <Label>Cargo</Label>
                        </FormInputGroup>
                      </div>}
                  </div>
                  <div className="column">
                    <FormInputGroup>
                      <input className="radioInput2" type="radio" id="simcnpq" name="fav_language2" value="Concluiu doutorado" onChange={(e)=>setBolsistaCNPQ(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="simcnpq">Sim</label>
                      <input className="radioInput" type="radio" id="naocnpq" name="fav_language2" value="Nao concluiu doutorado" onChange={(e)=>setBolsistaCNPQ(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="naocnpq">Não </label>
                      <Label2>É bolsista CNPQ ?</Label2>
                    </FormInputGroup>
                    <FormInputGroup>
                      <input className="radioInput2" type="radio" id="concluiu" name="fav_language3" value="Concluiu doutorado" onChange={(e)=>setConcluiuDoutorado(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="concluiu">Sim</label>
                      <input className="radioInput" type="radio" id="naoConcluiu" name="fav_language3" value="Nao concluiu doutorado" onChange={(e)=>setConcluiuDoutorado(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="naoConcluiu">Não </label>
                      <Label2 style={ !ehDoutor ? { display:'block'} : {display : 'none'} }>Concluiu o doutorado da PGC/UFF ?</Label2>
                      <Label2 style={ ehDoutor ? { display:'block'} : {display : 'none'} }>Concluiu o mestrado da PGC ou CAA - UFF ?</Label2>
                    </FormInputGroup>
                    <FormInputGroup>
                      <input className="radioInput2" type="radio" id="posdoc" name="fav_language4" value="Concluiu doutorado" onChange={(e)=>setConcluiuPosDoutorado(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="posdoc">Sim</label>
                      <input className="radioInput" type="radio" id="naoposdoc" name="fav_language4" value="Nao concluiu doutorado" onChange={(e)=>setConcluiuPosDoutorado(e.target.value)} required></input>
                      <label className="radioLabel" htmlFor="naoposdoc">Não </label>
                      <Label2>Tem pós-doutorado ?</Label2>
                    </FormInputGroup>
                  </div>
                </div>
                    <FormInputGroup>
                      <Button onClick={notify} type="submit">Salvar Alterações</Button>
                      <ToastContainer position="top-center" />
                    </FormInputGroup>

              </form>
            </FormEditar>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Editar
