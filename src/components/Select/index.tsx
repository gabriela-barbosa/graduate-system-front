import { styled } from '@mui/material'
import SelectMaterial from '@mui/material/Select'
import { SelectElement } from 'react-hook-form-mui'

export const Select = styled(SelectElement)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 15,
    },
  },
})

export const SelectMui = styled(SelectMaterial)({
  '& .MuiOutlinedInput-notchedOutline': {
    // borderRadius: '15px',
  },
})
