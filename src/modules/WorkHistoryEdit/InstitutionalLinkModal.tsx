import { FormControl, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material'
import React, { useCallback, useState } from 'react'
import {
  Autocomplete,
  Button,
  DatePicker,
  debounce,
  InputMui,
  SelectMui,
  showErrorToast,
  Typography,
} from '@components'
import { SelectItem } from '@utils/types'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { Dayjs } from 'dayjs'
import { useAuth } from '@context/AuthProvider'
import { Role } from '@utils/enums'
import { getInstitutionAutocomplete } from '@modules/WorkHistoryEdit/api'
import { InstitutionInfoDTO } from '@modules/WorkHistoryEdit/types'

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
  institutionId?: string | null
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
    id: null,
    position: null,
    institutionId: null,
    institutionTypeId: null,
    institutionName: null,
    startedAt: null,
    endedAt: null,
  }
  const [institutionalLink, setInstitutionalLink] = useState<InstitutionalLinkInfoType>({
    ...institutionalLinkDefaultState,
  })
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionInfoDTO | null>(null)

  const { institutionId, institutionName } = institutionalLink

  const [options, setOptions] = useState<InstitutionInfoDTO[]>([])

  const onModalClose = () => {
    setSelectedInstitution(null)
    setIsAddWorkHistoryOpen(false)
    setInstitutionalLink(institutionalLinkDefaultState)
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

  const getData = async searchTerm => {
    try {
      const data = await getInstitutionAutocomplete(searchTerm)
      setOptions(data)
    } catch (error) {
      showErrorToast('Erro ao buscar instituições.')
    }
  }

  const setInstitutionName = (institutionName?: string) => {
    setInstitutionalLink({
      ...institutionalLink,
      institutionName,
    })
  }

  const debounceGetData = useCallback(
    debounce(inputValue => getData(inputValue), 1000),
    []
  )

  const onInputChange = async (_: any, institutionName?: string) => {
    if (institutionName) {
      setInstitutionName(institutionName)
      await debounceGetData(institutionName)
    } else {
      setOptions([])
    }
  }

  return (
    <Modal show={isAddWorkHistoryOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Fields>{institutionalLink.id ? 'Editar' : 'Adicionar'} Vínculo Institucional</Fields>
      </Modal.Header>
      <Modal.Body>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                freeSolo
                noOptionsText="Nenhuma instituição encontrada"
                disablePortal
                onInputChange={onInputChange}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">{option.name}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" color="gray">
                          {option?.type?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                )}
                inputValue={institutionName ?? ''}
                options={options}
                renderInput={params => (
                  <InputMui
                    {...params}
                    label="Nome da instituição"
                    variant="outlined"
                    pa={() => 'Campo obrigatório.'}
                  />
                )}
                value={selectedInstitution}
                getOptionLabel={option => (typeof option === 'string' ? option : option?.name)}
                onChange={(_event, value, reason) => {
                  const newValue = value as unknown as InstitutionInfoDTO
                  const getInstitutionFieldsValueByReason = () => {
                    if (reason === 'clear') {
                      return institutionalLinkDefaultState
                    }
                    return {
                      institutionName: newValue?.name,
                      institutionTypeId: newValue?.type.id,
                      institutionId: newValue?.id,
                    }
                  }
                  const { institutionName, institutionTypeId, institutionId } =
                    getInstitutionFieldsValueByReason()
                  setSelectedInstitution(newValue)
                  setInstitutionalLink(oldLink => ({
                    ...oldLink,
                    institutionId,
                    institutionName,
                    institutionTypeId,
                  }))
                }}
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
                disabled={institutionId}
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
