import { FormControl, Grid } from '@mui/material'
import { Subtitle } from '@views/WorkHistoryEdit/index.style'
import { Input } from '@components'
import React from 'react'

export const PersonalInfo = () => {
  const getEmailErrorMessageByType = type => {
    switch (type) {
      case 'pattern':
        return 'Insira um email válido.'
      case 'required':
        return 'Digite o email.'
    }
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Informações pessoais</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
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
        </Grid>
      </Grid>
    </Grid>
  )
}
