import { styled } from '@mui/material'
import { SelectElement } from 'react-hook-form-mui'

export const Select = styled(SelectElement)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 15,
    },
  },
})
