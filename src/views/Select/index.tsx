import React from 'react'
import { Theme } from '../../utils/enums'
import 'react-toastify/dist/ReactToastify.css'
import money from '../../../public/foto1.png'
import settings from '../../../public/foto2.jpg'
import article from '../../../public/foto3.png'

import { useRouter } from 'next/router'
import MainWrapper from '../../components/MainWrapper'
import { PageWrapper, Title } from '../../styles/index.style'
import { Card, CardTitle, IconImage } from './index.style'
import { Grid } from '@mui/material'

const Select: React.FC = () => {
  const router = useRouter()

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
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper>
          <Title>Gerenciamento de opções</Title>
          <br></br>
          <br></br>
          <Grid container spacing={8}>
            <Grid item>
              <Card color="green" onClick={changeProgram}>
                <Grid container spacing={1} direction="column">
                  <Grid item>
                    <CardTitle>Configurar Programas</CardTitle>
                  </Grid>
                  <Grid item>
                    <p>Adicione, exclua ou edite um programa</p>
                  </Grid>
                  <Grid item>
                    <IconImage src={money} alt="money" />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item>
              <Card color="red" onClick={changeInstitution}>
                <Grid container spacing={1} direction="column">
                  <Grid item>
                    <CardTitle>Configurar Tipo de Instituição</CardTitle>
                  </Grid>
                  <Grid item>
                    <p>Adicione, exclua ou edite um tipo de instituição</p>
                  </Grid>
                  <Grid item>
                    <IconImage src={settings} alt="settings" />
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            <Grid item>
              <Card color="blue" onClick={changeCnpq}>
                <Grid container spacing={1} direction="column">
                  <Grid item>
                    <CardTitle>Configurar Níveis CNPQ</CardTitle>
                  </Grid>
                  <Grid item>
                    <p>Adicione, exclua ou edite um nível CNPQ</p>
                  </Grid>
                  <Grid item>
                    <IconImage src={article} alt="article" />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </PageWrapper>
      </MainWrapper>
    </>
  )
}

export default Select
