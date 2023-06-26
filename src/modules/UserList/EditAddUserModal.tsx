import { Modal } from 'react-bootstrap'
import { Fields } from '@styles/index.style'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Button } from '@components'
import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Role, RoleTranslation } from '@utils/enums'

const GRADUATE_API = process.env.GRADUATE_API

interface Props {
  show: boolean
  handleClose: () => void
  currentUser: any
  onSuccess: () => void
  onFail: () => void
}

const UserModal = ({ show, handleClose, currentUser, onSuccess, onFail }: Props) => {
  const { id } = currentUser
  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })
  const createUpdateUser = async user => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    }
    const result = await fetch(`${GRADUATE_API}/v1/register`, myInit as RequestInit)
    if (result && result.status < 400) {
      await onSuccess()
    } else {
      await onFail()
    }
  }
  const handleSubmit = async event => {
    event.preventDefault()
    const { name, email, roles } = event.target
    console.log(roles.value)
    const user = {
      id,
      name: name.value,
      email: email.value,
      roles: typeof roles.value === 'string' ? roles.value.split(',') : roles.value,
    }

    await createUpdateUser(user)
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Box component={'form'} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Fields>{id ? 'Editar' : 'Adicionar'} Usuário</Fields>
        </Modal.Header>
        <Modal.Body>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField defaultValue={currentUser.name} required name={'name'} label={'Nome'} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  defaultValue={currentUser.email}
                  required
                  name={'email'}
                  label={'Email'}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor={'roles'}>Papel do Usuário</InputLabel>
                <Select
                  multiple
                  defaultValue={currentUser.roles ?? []}
                  name={'roles'}
                  id={'roles'}
                  label={'Papel do Usuário'}
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>
                      {RoleTranslation[role]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button type={'submit'} size={'large'} variant={'contained'}>
            Salvar
          </Button>
        </Modal.Footer>
      </Box>
    </Modal>
  )
}

export default UserModal
