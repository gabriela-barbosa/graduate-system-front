import React from 'react'
import { MainWrapper } from '@components'
import { Theme } from '@utils/enums'

import { Grid } from '@mui/material'

import { PageWrapper, Title } from '@styles/index.style'

const NotFoundPage = () => (
  <MainWrapper themeName={Theme.white}>
    <PageWrapper
      spacing={2}
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Title>Ocorreu um erro ao exibir a página.</Title>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  </MainWrapper>
)

export default NotFoundPage
