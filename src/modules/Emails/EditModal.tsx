import { Modal } from 'react-bootstrap'
import { DialogTitleTypography } from '@styles/index.style'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputMui as TextField,
  Radio,
  RadioGroup,
} from '@components'
import React from 'react'

interface Props {
  handleClose: () => void
  isShowing: boolean
  currentEmail: any
  previousEmail: any
  handleUpdate: (email: any) => void
  handleSave: (email: any) => void
  setCurrentEmail: (email: any) => void
}

const EditModal = ({
  handleClose,
  isShowing,
  currentEmail,
  handleUpdate,
  handleSave,
  setCurrentEmail,
}: Props) => {
  return (
    <Modal show={isShowing} onHide={handleClose}>
      <Modal.Header closeButton>
        <DialogTitleTypography>
          {currentEmail.id ? 'Editar' : 'Adicionar'} Email
        </DialogTitleTypography>
      </Modal.Header>
      <Modal.Body>
        <Grid container rowSpacing={4}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.name}
                disabled={!!currentEmail.id}
                required
                name={'name'}
                label={'Nome do email'}
                onChange={({ target }) => setCurrentEmail({ ...currentEmail, name: target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.title}
                required
                name={'title'}
                label={'Assunto'}
                onChange={({ target }) => setCurrentEmail({ ...currentEmail, title: target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.content}
                required
                name={'content'}
                label={'Conteúdo'}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, content: target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.buttonText}
                required
                name={'buttonText'}
                label={'Texto do Botão'}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, buttonText: target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.buttonURL}
                required
                name={'buttonURL'}
                label={'URL do botão'}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, buttonURL: target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel id={'isGraduateEmailLabel'}> Destinatário do email:</FormLabel>
              <RadioGroup
                row
                aria-labelledby="isGraduateEmailLabel"
                name="isGraduateEmailLabel"
                value={currentEmail.isGraduateEmail}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, isGraduateEmail: target.value === 'true' })
                }
              >
                <FormControlLabel
                  disabled={!!currentEmail.id}
                  value={true}
                  control={<Radio />}
                  label={'Egresso'}
                />
                <FormControlLabel
                  disabled={!!currentEmail.id}
                  value={false}
                  control={<Radio />}
                  label={'Orientador'}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size={'large'}
          variant={'contained'}
          onClick={() => (currentEmail.id ? handleUpdate(currentEmail) : handleSave(currentEmail))}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditModal
