import { TextField } from '@mui/material'
import { PasswordElement, TextFieldElement } from 'react-hook-form-mui'

export const Input = (props: any) => <TextFieldElement variant="standard" {...props} />

export const Password = (props: any) => <PasswordElement variant="standard" {...props} />
export const InputMui = (props: any) => <TextField variant="standard" {...props} />
