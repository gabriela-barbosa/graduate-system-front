import { FormControl, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { Button, DatePicker, InputMui, SelectMui } from '@components'
import { SelectItem } from '@utils/types'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { Dayjs } from 'dayjs'
import { useAuth } from '@context/AuthProvider'
import { Role } from '@utils/enums'

interface Props {
  institutionalLinks: any[]
  setInstitutionalLinks: any
  institutionTypes: SelectItem[]
  isAddWorkHistoryOpen: boolean
  setIsAddWorkHistoryOpen: (value: boolean) => void
}

interface InstitutionalLinkInfoType {
  id?: string | null
  position?: string | null
  institutionTypeId?: string | null
  institutionName?: string | null
  startedAt?: Dayjs | null
  endedAt?: Dayjs | null
}

export const InstitutionalLinkModal = ({
  institutionalLinks,
  institutionTypes,
  setInstitutionalLinks,
  isAddWorkHistoryOpen,
  setIsAddWorkHistoryOpen,
}: Props) => {
  const { currentRole } = useAuth()

  const isCurrentUserGraduate = currentRole === Role.GRADUATE

  const institutionalLinkDefaultState: InstitutionalLinkInfoType = {
    id: undefined,
    position: undefined,
    institutionTypeId: undefined,
    institutionName: undefined,
    startedAt: undefined,
    endedAt: undefined,
  }
  const [institutionalLink, setInstitutionalLink] = useState<InstitutionalLinkInfoType>({
    ...institutionalLinkDefaultState,
  })

  const onModalClose = () => {
    setIsAddWorkHistoryOpen(false)
    setInstitutionalLink({ ...institutionalLinkDefaultState })
  }

  const handleSave = () => {
    const { id, position, institutionName, institutionTypeId, endedAt, startedAt } =
      institutionalLink

    const newInstitutionalLink = {
      id,
      position,
      endedAt,
      startedAt,
      institution: { typeId: institutionTypeId, name: institutionName },
    }
    setInstitutionalLinks([...institutionalLinks, newInstitutionalLink])
    // setInstitutionalLinks(links => [...links, institutionalLink])
    onModalClose()
  }

  const checkIfInstitutionalLinkInfoIsValid = !!(
    institutionalLink.institutionTypeId &&
    institutionalLink.institutionName &&
    institutionalLink.startedAt &&
    (isCurrentUserGraduate ? institutionalLink.position : true)
  )
  return (
    <Modal show={isAddWorkHistoryOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Fields>{institutionalLink.id ? 'Editar' : 'Adicionar'} Vínculo Institucional</Fields>
      </Modal.Header>
      <Modal.Body>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputMui
                value={institutionalLink.institutionName}
                onChange={event =>
                  setInstitutionalLink({
                    ...institutionalLink,
                    institutionName: event.target.value,
                  })
                }
                name={'institutionName'}
                label={'Nome da instituição*'}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="institutionType">Tipo de Instituição*</InputLabel>
              <SelectMui
                labelId={'institutionTypeLabel'}
                id={'institutionType'}
                name={'institutionType'}
                label={'Tipo de Instituição*'}
                value={institutionalLink.institutionTypeId || ''}
                onChange={event => {
                  if (event.target.value)
                    setInstitutionalLink({
                      ...institutionalLink,
                      institutionTypeId: event.target.value as string,
                    })
                }}
              >
                {institutionTypes.map(institutionItem => (
                  <MenuItem key={institutionItem.id} value={institutionItem.id}>
                    {institutionItem.label}
                  </MenuItem>
                ))}
              </SelectMui>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputMui
                value={institutionalLink.position}
                onChange={event =>
                  setInstitutionalLink({
                    ...institutionalLink,
                    position: event.target.value,
                  })
                }
                name={'position'}
                label={`Cargo${isCurrentUserGraduate ? '*' : ''}`}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de início*'}
                value={institutionalLink.startedAt}
                disableFuture
                onChange={(startedAt: Dayjs) => {
                  setInstitutionalLink({
                    ...institutionalLink,
                    startedAt,
                  })
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de término'}
                value={institutionalLink.endedAt}
                disableFuture
                onChange={(endedAt: Dayjs) => {
                  setInstitutionalLink({
                    ...institutionalLink,
                    endedAt,
                  })
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Tooltip
          title={'Preencha os campos obrigatórios'}
          disableHoverListener={checkIfInstitutionalLinkInfoIsValid}
        >
          <span>
            <Button
              size={'large'}
              variant={'contained'}
              disabled={!checkIfInstitutionalLinkInfoIsValid}
              onClick={() => handleSave()}
            >
              Salvar
            </Button>
          </span>
        </Tooltip>
      </Modal.Footer>
    </Modal>
  )
}
