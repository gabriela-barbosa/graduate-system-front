import { styled, TextField } from '@mui/material'
import { PasswordElement, TextFieldElement } from 'react-hook-form-mui'

export const Input = styled(TextFieldElement)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 15,
  },
})

export const Password = styled(PasswordElement)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 15,
  },
})
export const InputMui = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 15,
  },
})
