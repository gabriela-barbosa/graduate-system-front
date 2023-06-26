import { styled } from '@mui/material'
import { DatePicker as DP } from '@mui/x-date-pickers/DatePicker'

export const DatePicker = styled(DP)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 15,
  },
})
