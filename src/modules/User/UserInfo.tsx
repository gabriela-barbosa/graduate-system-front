import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Subtitle } from '@styles/index.style'
import { Divider, Input } from '@components'
import { Controller } from 'react-hook-form'
import { Role, RoleTranslation } from '@utils/enums'
import React from 'react'

const UserInfo = ({ control }) => {
  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>Informações do Usuário</Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input required name={'user.name'} label={'Nome'} />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input required name={'user.email'} label={'Email'} />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor={'user.roles'}>Papel do Usuário</InputLabel>
              <Controller
                control={control}
                name={'user.roles'}
                render={({ field: { onChange, onBlur, name, value, ref } }) => (
                  <Select
                    multiple
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    id={'user.roles'}
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
    </Grid>
  )
}

export default UserInfo
