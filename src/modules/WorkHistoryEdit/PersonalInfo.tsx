import { Box, FormControl, Grid } from '@mui/material'
import { Subtitle } from './index.style'
import { Input } from '@components'
import React from 'react'

export const PersonalInfo = () => {
  const getEmailErrorMessageByType = type => {
    switch (type) {
      case 'pattern':
        return 'Insira um emails válido.'
      case 'required':
        return 'Digite o emails.'
    }
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Informações pessoais</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ paddingLeft: '15px' }}>
          <Grid container rowSpacing={3}>
            <Grid item xs={5}>
              <FormControl fullWidth>
                <Input label={'Nome'} name={'graduateName'} />
              </FormControl>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <FormControl fullWidth>
                <Input
                  label={'E-mail'}
                  name={'email'}
                  parseError={({ type }) => {
                    return getEmailErrorMessageByType(type)
                  }}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={11}>
              <FormControl fullWidth>
                <Input
                  label={'Casos de Sucesso'}
                  name={'successCase'}
                  rows={4}
                  maxRows={6}
                  multiline
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
