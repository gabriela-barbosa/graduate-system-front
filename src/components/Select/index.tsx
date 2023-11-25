import SelectMaterial from '@mui/material/Select'
import { SelectElement } from 'react-hook-form-mui'

export const Select = (props: any) => <SelectElement variant="standard" {...props} />
export const SelectMui = (props: any) => <SelectMaterial variant="standard" {...props} />
