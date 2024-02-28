import InputLabelMui from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import {
  PasswordElement,
  PasswordElementProps,
  TextFieldElement,
  TextFieldElementProps,
} from 'react-hook-form-mui'
import React from 'react'
import { FieldValues } from 'react-hook-form/dist/types/fields'

export const Input = (props: TextFieldElementProps) => (
  <TextFieldElement variant="standard" {...props} />
)
export const Password = (props: PasswordElementProps<FieldValues>) => (
  <PasswordElement variant="standard" {...props} />
)
export const InputMui = (props: any) => <TextField variant="standard" {...props} />
export const InputLabel = (props: any) => <InputLabelMui variant="standard" {...props} />
