import SelectMaterial from '@mui/material/Select'
import { SelectElement } from 'react-hook-form-mui'
import React from 'react'

export const Select = (props: any) => <SelectElement variant="standard" {...props} />
export const SelectMui = (props: any) => <SelectMaterial variant="standard" {...props} />
