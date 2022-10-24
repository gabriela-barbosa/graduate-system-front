import { styled } from '@mui/material'
import { TextFieldElement } from 'react-hook-form-mui'
import theme from '../../styles/theme'

export const Input = styled(TextFieldElement)({
  '& label.Mui-focused': {
    color: 'green',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiInputLabel-root': {
    color: theme.colors.green.light,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.colors.green.light,
      borderRadius: 15,
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green',
    },
  },
})
