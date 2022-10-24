import { styled } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'

export const Input = styled(TextFieldElement)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 15,
    },
  },
})
