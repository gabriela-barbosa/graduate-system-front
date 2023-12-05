import { DialogTitleTypography } from '@styles/index.style'
import {
  Dialog,
  DialogTitle,
  IconButton,
  CloseRoundedIcon,
  DialogContent,
  Typography,
} from '@components'
import React from 'react'
import { User } from '@context/AuthContext'

interface Props {
  handleClose: () => void
  isShowing: boolean
  users: User[]
}

const SendEmailModal = ({ handleClose, isShowing, users }: Props) => {
  return (
    <Dialog open={isShowing} onClose={handleClose}>
      <DialogTitle>
        <DialogTitleTypography>Enviar Emails</DialogTitleTypography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
        }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default SendEmailModal
