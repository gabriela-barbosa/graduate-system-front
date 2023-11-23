import React from 'react'
import {Typography} from '@mui/material'
import BC from '@mui/material/Breadcrumbs'
import Link from 'next/link'
import MUILink from '@mui/material/Link'

interface BreadcrumbOptions {
  name: string
  href?: string
}

interface Props {
  breadcrumbs: BreadcrumbOptions[]
}

const Breadcrumbs = ({breadcrumbs}: Props) => (
  <BC aria-label="breadcrumb">
    {breadcrumbs.map(({name, href}, index) => (
      {index !== breadcrumbs.length - 1 ? (
        <Link href="/">
          <MUILink underline="hover" color="inherit">
            MUI
          </MUILink>
          MUI
        </Link>
      ) : (
        <Typography color="text.primary">Breadcrumbs</Typography>)}
      ))
    }
  </BC>
)

const showSavedToast = () => toast.success('Salvo com sucesso!')
const showEditedToast = () => toast.success('Editado com sucesso!')
const showDeletedToast = () => toast.success('Deletado com sucesso!')
const showErrorToast = (errorMessage: string) => toast.error(errorMessage)
const showToast = (errorMessage: string, type?: TypeOptions) => toast(errorMessage, {type})

export {
  ToastContainer,
  toast,
  showSavedToast,
  showDeletedToast,
  showErrorToast,
  showToast,
  showEditedToast,
}
