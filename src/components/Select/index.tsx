import { styled } from '@mui/material'
import { SelectElement } from 'react-hook-form-mui'
import theme from '../../styles/theme'

export const Select = styled(SelectElement)({
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
