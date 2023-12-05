import { DialogTitleTypography } from '@styles/index.style'
import {
  Dialog,
  DialogTitle,
  IconButton,
  CloseRoundedIcon,
  DialogContent,
  GridColDef,
  Box,
  DataGrid,
  showErrorToast,
  DialogActions,
  Button,
  SendRoundedIcon,
  GridToolbarQuickFilter,
  GridRowId,
  showToast,
} from '@components'
import React, { useEffect } from 'react'
import { User } from '@context/AuthContext'
import { getUserByRole, sendEmails } from '@modules/Emails/api'
import { getAPIClient } from '@services/axios'
import { Role } from '@utils/enums'
import { Email } from '@modules/Emails/types'
interface Props {
  handleClose: () => void
  isShowing: boolean
  role: Role
  currentEmail: Email
}

const SendEmailModal = ({ handleClose, isShowing, role, currentEmail }: Props) => {
  const [users, setUsers] = React.useState<User[]>([])
  const [selectedRows, setSelectedRows] = React.useState<GridRowId[]>([])
  const apiClient = getAPIClient()

  const localizedTextsMap = {
    columnMenuUnsort: 'não classificado',
    columnMenuSortAsc: 'Classificar por ordem crescente',
    columnMenuSortDesc: 'Classificar por ordem decrescente',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Ocultar',
    columnMenuShowColumns: 'Mostrar colunas',
    rowCount: 'Linhas',
  }

  const columns1: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 400,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 400,
      editable: false,
    },
  ]
  const VISIBLE_FIELDS = ['name', 'email']

  const columns = React.useMemo(
    () => columns1.filter(column => VISIBLE_FIELDS.includes(column.field)),
    [columns1]
  )
  const getUsers = async () => {
    try {
      const users = await getUserByRole(apiClient, role)
      setUsers(users)
    } catch (e) {
      showErrorToast('Erro ao buscar usuários.')
    }
  }

  useEffect(() => {
    if (isShowing) getUsers()
  }, [role, isShowing])

  const QuickSearchToolbar = () => (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  )

  const handleOnSend = async () => {
    if (currentEmail && currentEmail.id) {
      try {
        console.warn('passeio aqui', selectedRows, currentEmail.id)
        sendEmails(apiClient, selectedRows as string[], currentEmail.id)
        showToast('O envio foi requisitado.', 'info')
      } catch (e) {
        showErrorToast('Erro ao enviar emails.')
      }
    }
  }

  return (
    <Dialog open={isShowing} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <DialogTitleTypography>Enviar Emails</DialogTitleTypography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
        }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ height: 700, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            onRowSelectionModelChange={ids => {
              setSelectedRows(ids)
            }}
            localeText={localizedTextsMap}
            pageSizeOptions={[20]}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            slots={{ toolbar: QuickSearchToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  variant: 'outlined',
                  size: 'medium',
                  label: 'Pesquisar',
                  placeholder: 'Pesquisar',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnSend} autoFocus endIcon={<SendRoundedIcon />}>
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SendEmailModal
