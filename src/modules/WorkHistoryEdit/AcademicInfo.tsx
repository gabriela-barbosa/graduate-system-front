import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material'
import { Subtitle } from './index.style'
import React, { useState } from 'react'
import { ActionIcon, Button, DatePicker, Input, InputMui, Select, SelectMui } from '@components'
import { GraduateWorkHistoriesInfo, Option } from './types'
import { Role } from '@utils/enums'
import { RadioButtonGroup } from 'react-hook-form-mui'
import { SelectItem } from '@utils/types'
import GraduatesTable from '@modules/Egressos/GraduatesTable'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import dayjs, { Dayjs } from 'dayjs'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'

interface Props {
  graduateInfo: GraduateWorkHistoriesInfo
  cnpqLevels: SelectItem[]
  institutionTypes: Option[]
  hasPostDoctorate: boolean
  hasCNPQScholarship: boolean
  setHasCNPQScholarship: (value?) => void
  setHasPostDoctorate: (value?) => void
  handleSetValue: (event: unknown, setHasCNPQScholarship: () => void) => void
  currentRole?: Role
}

interface CNPQScholarshipInfoType {
  id?: string | null
  levelId?: string | null
  startedAt?: Dayjs | null
  endedAt?: Dayjs | null
}

export const AcademicInfo = ({
  graduateInfo,
  cnpqLevels,
  institutionTypes,
  hasPostDoctorate,
  hasCNPQScholarship,
  setHasCNPQScholarship,
  setHasPostDoctorate,
  handleSetValue,
  currentRole,
}: Props) => {
  const cnpqScholarshipDefaultState: CNPQScholarshipInfoType = {
    id: null,
    levelId: null,
    startedAt: null,
    endedAt: null,
  }
  const [isAddWorkHistoryOpen, setIsAddWorkHistoryOpen] = useState<boolean>(false)
  const [cnpqScholarship, setCNPQScholarship] = useState<CNPQScholarshipInfoType>({
    ...cnpqScholarshipDefaultState,
  })
  const rows = [
    ...institutionalLinks.map((link, index) => [
      { body: <Fields status={'UPDATED'}>{link.institutionName}</Fields> },
      {
        body: (
          <Fields status={'UPDATED'}>
            {institutionTypes.find(type => type.id === link.institutionTypeId)?.label}
          </Fields>
        ),
      },
      { body: <Fields status={'UPDATED'}>{link.position}</Fields> },
      {
        body: <Fields status={'UPDATED'}>{dayjs(link.startedAt).format('DD/MM/YYYY')}</Fields>,
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!link.endedAt ? '-' : dayjs(link.endedAt).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <ActionIcon
            onClick={() => {
              setInstitutionalLinks(linkList => linkList.filter((_, i) => i !== index))
            }}
          >
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]),
    ...workHistories.map(wh => [
      { body: wh.institution.name },
      { body: wh.institution.typeName },
      { body: wh.position },
      {
        body:
          !wh.startedAt || wh.startedAt === 'null' ? '-' : dayjs(wh.startedAt).format('DD/MM/YYYY'),
      },
      {
        body: !wh.endedAt || wh.endedAt === 'null' ? '-' : dayjs(wh.endedAt).format('DD/MM/YYYY'),
      },
    ]),
  ]

  const columns = [
    {
      name: 'Nome da bolsa',
    },
    {
      name: 'Data de Início',
    },
    {
      name: 'Data de Término',
    },
    { name: 'Ações', width: '10%' },
  ]

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Informações acadêmicas</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormLabel id="labelHasPostDoctorate">Possui pós-doutorado?</FormLabel>
          <RadioGroup
            row
            aria-labelledby={'labelHasPostDoctorate'}
            name={'hasPostDoctorate'}
            value={hasPostDoctorate}
            onChange={event => handleSetValue(event, setHasPostDoctorate)}
          >
            <FormControlLabel value={null} control={<Radio />} label={'Não sei'} />
            <FormControlLabel value={true} control={<Radio />} label={'Sim'} />
            <FormControlLabel value={false} control={<Radio />} label={'Não'} />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Grid container rowSpacing={3}>
          <Grid item xs={5}>
            <FormControl fullWidth>
              <Input
                name={'postDoctorateName'}
                label={'Nome da instituição'}
                disabled={!hasPostDoctorate}
              />
            </FormControl>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={5}>
            <FormControl fullWidth>
              <Select
                disabled={!hasPostDoctorate}
                name={'postDoctorateType'}
                label={'Tipo da instituição'}
                options={institutionTypes}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="column" spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item alignSelf={'center'}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {rows?.length !== 0 ? (
                  <GraduatesTable columns={columns} rows={rows} />
                ) : (
                  <Fields>Nenhum resultado encontrado.</Fields>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel id="labelHasPostDoctorate">
                    Possui vínculo institucional atualmente?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby={'labelHasPostDoctorate'}
                    name={'hasPostDoctorate'}
                    value={hasInstitutionalLink}
                    onChange={({ target }) => setHasInstitutionalLink(parseInt(target.value))}
                  >
                    <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                    <FormControlLabel value={0} control={<Radio />} label={'Não'} />
                    <FormControlLabel value={-1} control={<Radio />} label={'Não sei'} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {hasInstitutionalLink === 1 && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="currentInstitutionsLabel">Vínculos atuais</InputLabel>
                    <SelectMui
                      labelId={'currentInstitutionsLabel'}
                      id={'currentInstitutions'}
                      name={'currentInstitutions'}
                      label={'Vínculos atuais'}
                      value={currentInstitutionalLinks}
                      renderValue={selected =>
                        selected
                          ?.map(item => getSelectText(currentInstitutionalLinksOptions[item]))
                          .join(', ')
                      }
                      multiple
                      onChange={({ target }) => {
                        const { value } = target
                        setCurrentInstitutionalLinks(
                          (typeof value === 'string' ? value.split(',') : value) as any
                        )
                      }}
                    >
                      {currentInstitutionalLinksOptions.map((institutionItem, index) => (
                        <MenuItem key={index} value={index}>
                          <Checkbox checked={currentInstitutionalLinks.indexOf(index) > -1} />
                          {getSelectText(institutionItem)}
                        </MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </Grid>
              )}
              <Modal show={isAddWorkHistoryOpen} onHide={onModalClose}>
                <Modal.Header closeButton>
                  <Fields>
                    {institutionalLink.id ? 'Editar' : 'Adicionar'} Vínculo Institucional
                  </Fields>
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
                          label={'Cargo'}
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
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="labelHasCNPQScholarship">
                Possui Bolsa de Produtividade CNPQ?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby={'labelHasCNPQScholarship'}
                name={'hasCNPQScholarship'}
                value={hasCNPQScholarship}
                onChange={event => handleSetValue(event, setHasCNPQScholarship)}
              >
                <FormControlLabel value={null} control={<Radio />} label={'Não sei'} />
                <FormControlLabel value={true} control={<Radio />} label={'Sim'} />
                <FormControlLabel value={false} control={<Radio />} label={'Não'} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <FormControl fullWidth>
              <Select
                disabled={!hasCNPQScholarship}
                name={'cnpqId'}
                label={'Bolsa CNPQ'}
                options={cnpqLevels}
              />
            </FormControl>
          </Grid>
          {currentRole && currentRole === Role.ADMIN && (
            <>
              <Grid item xs={12}>
                <FormControl>
                  <RadioButtonGroup
                    label={'Concluiu o doutorado no PGC/UFF?'}
                    row
                    name={'hasFinishedDoctorateOnUFF'}
                    options={[
                      {
                        id: 'true',
                        label: 'Sim',
                      },
                      {
                        id: 'false',
                        label: 'Não',
                      },
                    ]}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <RadioButtonGroup
                    label={'Concluiu o mestrado no PGC ou CAA - UFF ?'}
                    row
                    name={'hasFinishedMasterDegreeOnUFF'}
                    options={[
                      {
                        id: 'true',
                        label: 'Sim',
                      },
                      {
                        id: 'false',
                        label: 'Não',
                      },
                    ]}
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}
