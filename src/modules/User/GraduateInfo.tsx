import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Subtitle } from '@styles/index.style'
import { Input } from '@components'
import { Controller } from 'react-hook-form'
import { Role, RoleTranslation } from '@utils/enums'
import React, { Fragment } from 'react'

const UserInfo = ({ control }) => {
  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })
  return (
    <Fragment>
      <Grid item xs={12}>
        <Subtitle>Informações do Usuário</Subtitle>
      </Grid>
      <Grid item xs={12} minHeight={510}>
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input required name={'name'} label={'Nome'} />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input required name={'email'} label={'Email'} />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor={'roles'}>Papel do Usuário</InputLabel>
              <Controller
                control={control}
                name={'roles'}
                render={({ field: { onChange, onBlur, name, value, ref } }) => (
                  <Select
                    multiple
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    id={'roles'}
                    value={value ?? []}
                    ref={ref}
                    label={'Papel do Usuário'}
                  >
                    {roles.map(role => (
                      <MenuItem key={role} value={role}>
                        {RoleTranslation[role]}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default UserInfo
