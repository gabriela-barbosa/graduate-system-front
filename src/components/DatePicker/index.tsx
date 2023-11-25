import { DatePicker as DP } from '@mui/x-date-pickers/DatePicker'

export const DatePicker = (props: any) => (
  <DP
    slotProps={{
      textField: {
        variant: 'standard',
      },
    }}
    {...props}
  />
)
