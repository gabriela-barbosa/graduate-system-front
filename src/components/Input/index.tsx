import { TextField, TextFieldProps } from '@mui/material'
import {
  PasswordElement,
  PasswordElementProps,
  TextFieldElement,
  TextFieldElementProps,
} from 'react-hook-form-mui'
import React from 'react'
import { TextFieldVariants } from '@mui/material/TextField/TextField'

export const Input = (props: TextFieldElementProps) => (
  <TextFieldElement variant="standard" {...props} />
)

export const Password = (props: PasswordElementProps<TextFieldProps>) => (
  <PasswordElement variant="standard" {...props} />
)
export const InputMui = (props: TextFieldVariants) => <TextField variant="standard" {...props} />
