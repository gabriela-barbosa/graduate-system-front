import {
  Box,
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
import { AddRounded } from '@mui/icons-material'
import { useAuth } from '@context/AuthProvider'

interface Props {
  graduateInfo: GraduateWorkHistoriesInfo
  cnpqLevels: SelectItem[]
  institutionTypes: Option[]
  handleSetValue: (event: unknown, setHasCNPQScholarship: () => void) => void
  currentRole?: Role
}

interface CNPQScholarshipInfoType {
  id?: string | null
  levelId?: string | null
  startedAt?: Dayjs | null
  endedAt?: Dayjs | null
}

export const AcademicInfo = ({ graduateInfo, cnpqLevels, institutionTypes }: Props) => {
  const { currentRole } = useAuth()

  const { cnpqScholarships: historyCNPQScholarships } = graduateInfo

  const cnpqScholarshipDefaultState: CNPQScholarshipInfoType = {
    id: null,
    levelId: null,
    startedAt: null,
    endedAt: null,
  }
  const [hasCNPQScholarship, setHasCNPQScholarship] = useState<number>(1)
  const [hasPostDoctorate, setHasPostDoctorate] = useState<number>(1)
  const [isAddCNPQScholarshipOpen, setIsAddCNPQScholarshipOpen] = useState<boolean>(false)
  const [cnpqScholarship, setCNPQScholarship] = useState<CNPQScholarshipInfoType>({
    ...cnpqScholarshipDefaultState,
  })
  const [currentScholarships, setCurrentScholarships] = useState<any[]>([])

  const [cnpqScholarships, setCNPQScholarships] = useState<CNPQScholarshipInfoType[]>([])

  const currentScholarshipsOptions = [...cnpqScholarships, ...historyCNPQScholarships].filter(
    scholarship => !scholarship.endedAt || scholarship.endedAt === 'null'
  )

  const getSelectText = scholarship => {
    return `${
      cnpqLevels.find(type => type.id === scholarship.levelId)?.label
    } - ${(typeof scholarship.startedAt === 'string'
      ? dayjs(scholarship.startedAt)
      : scholarship.startedAt
    ).format('DD/MM/YYYY')}`
  }

  const onModalClose = () => {
    setIsAddCNPQScholarshipOpen(false)
    setCNPQScholarship({ ...cnpqScholarshipDefaultState })
  }

  const handleSave = () => {
    console.log('cnpqScholarships', cnpqScholarship)
    setCNPQScholarships(scholarships => [...scholarships, cnpqScholarship])
    onModalClose()
  }

  const rows = [
    ...cnpqScholarships.map((scholarship, index) => [
      {
        body: (
          <Fields status={'UPDATED'}>
            {cnpqLevels.find(type => type.id === scholarship.levelId)?.label}
          </Fields>
        ),
      },
      {
        body: (
          <Fields status={'UPDATED'}>{dayjs(scholarship.startedAt).format('DD/MM/YYYY')}</Fields>
        ),
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!scholarship.endedAt ? '-' : dayjs(scholarship.endedAt).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <ActionIcon
            onClick={() => {
              setCNPQScholarships(cnpq => cnpq.filter((_, i) => i !== index))
            }}
          >
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]),
    ...historyCNPQScholarships.map(scholarship => [
      { body: cnpqLevels.find(type => type.id === scholarship.levelId)?.label },
      {
        body: dayjs(scholarship.startedAt).format('DD/MM/YYYY'),
      },
      {
        body:
          !scholarship.endedAt || scholarship.endedAt === 'null'
            ? '-'
            : dayjs(scholarship.endedAt).format('DD/MM/YYYY'),
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

  const checkIfCNPQScholarshipIsValid = !!(cnpqScholarship.levelId && cnpqScholarship.startedAt)

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <Subtitle>
              Bolsa de Produtividade CNPQ
              <Button
                sx={{ marginLeft: '20px' }}
                size={'large'}
                variant="contained"
                // disabled={hasInstitutionalLink === -1 || hasInstitutionalLink === 0}
                onClick={() => setIsAddCNPQScholarshipOpen(true)}
              >
                Adicionar
                <AddRounded />
              </Button>
            </Subtitle>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ paddingLeft: '15px' }}>
              <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                  {rows?.length ? (
                    <GraduatesTable columns={columns} rows={rows} />
                  ) : (
                    <Box>
                      <Fields>Não há histórico de bolsas.</Fields>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="labelHasCNPQScholarship">
                      Possui Bolsa de Produtividade CNPQ atualmente?
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby={'labelHasCNPQScholarship'}
                      name={'hasCNPQScholarship'}
                      value={hasCNPQScholarship}
                      onChange={({ target }) => {
                        const value = parseInt(target.value)
                        setHasCNPQScholarship(value)
                        if (value !== 1) {
                          setCurrentScholarships([])
                        }
                      }}
                    >
                      <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                      <FormControlLabel value={0} control={<Radio />} label={'Não'} />
                      <FormControlLabel value={-1} control={<Radio />} label={'Não sei'} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {hasCNPQScholarship === 1 &&
                  (currentScholarshipsOptions?.length ? (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="currentScholarshipsLabel">Bolsas atuais</InputLabel>
                        <SelectMui
                          labelId={'currentScholarshipsLabel'}
                          id={'currentScholarships'}
                          name={'currentScholarships'}
                          label={'Bolsas atuais'}
                          value={currentScholarships}
                          renderValue={selected =>
                            selected
                              ?.map(item => getSelectText(currentScholarshipsOptions[item]))
                              .join(', ')
                          }
                          multiple
                          onChange={({ target }) => {
                            const { value } = target
                            setCurrentScholarships(
                              (typeof value === 'string' ? value.split(',') : value) as any
                            )
                          }}
                        >
                          {currentScholarshipsOptions.map((institutionItem, index) => (
                            <MenuItem key={index} value={index}>
                              <Checkbox checked={currentScholarships.indexOf(index) > -1} />
                              {getSelectText(institutionItem)}
                            </MenuItem>
                          ))}
                        </SelectMui>
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Fields>Adicione um registro de bolsa sem data de término.</Fields>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <Subtitle>Informações acadêmicas</Subtitle>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ paddingLeft: '15px' }}>
              <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="labelHasPostDoctorate">Possui pós-doutorado?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby={'labelHasPostDoctorate'}
                      name={'hasPostDoctorate'}
                      value={hasPostDoctorate}
                      onChange={({ target }) => {
                        const value = parseInt(target.value)
                        setHasPostDoctorate(value)
                      }}
                    >
                      <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                      <FormControlLabel value={0} control={<Radio />} label={'Não'} />
                      <FormControlLabel value={-1} control={<Radio />} label={'Não sei'} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Input
                      name={'postDoctorateName'}
                      label={'Nome da instituição'}
                      disabled={hasPostDoctorate !== 1}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Select
                      disabled={hasPostDoctorate !== 1}
                      name={'postDoctorateType'}
                      label={'Tipo da instituição'}
                      options={institutionTypes}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <DatePicker
                      format={'DD/MM/YYYY'}
                      label={'Data de início*'}
                      value={cnpqScholarship.startedAt}
                      disabled={hasPostDoctorate !== 1}
                      disableFuture
                      onChange={(startedAt: Dayjs) => {
                        setCNPQScholarship(scholarship => ({
                          ...scholarship,
                          startedAt,
                        }))
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <DatePicker
                      format={'DD/MM/YYYY'}
                      label={'Data de término'}
                      value={cnpqScholarship.endedAt}
                      disabled={hasPostDoctorate !== 1}
                      disableFuture
                      onChange={(endedAt: Dayjs) => {
                        setCNPQScholarship(scholarship => ({
                          ...scholarship,
                          endedAt,
                        }))
                      }}
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
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Modal show={isAddCNPQScholarshipOpen} onHide={onModalClose}>
        <Modal.Header closeButton>
          <Fields>{cnpqScholarship.id ? 'Editar' : 'Adicionar'} Bolsa de Produtividade CNPQ</Fields>
        </Modal.Header>
        <Modal.Body>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="labelCNPQLevel">Nível da Bolsa*</InputLabel>
                <SelectMui
                  labelId={'labelCNPQLevel'}
                  id={'cnpqLevel'}
                  name={'cnpqLevel'}
                  label={'Nível da Bolsa*'}
                  value={cnpqScholarship.levelId || ''}
                  onChange={event => {
                    if (event.target.value)
                      setCNPQScholarship(scholarship => ({
                        ...scholarship,
                        levelId: event.target.value as string,
                      }))
                  }}
                >
                  {cnpqLevels.map(level => (
                    <MenuItem key={level.id} value={level.id}>
                      {level.label}
                    </MenuItem>
                  ))}
                </SelectMui>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <DatePicker
                  format={'DD/MM/YYYY'}
                  label={'Data de início*'}
                  value={cnpqScholarship.startedAt}
                  disableFuture
                  onChange={(startedAt: Dayjs) => {
                    setCNPQScholarship(scholarship => ({
                      ...scholarship,
                      startedAt,
                    }))
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <DatePicker
                  format={'DD/MM/YYYY'}
                  label={'Data de término'}
                  value={cnpqScholarship.endedAt}
                  disableFuture
                  onChange={(endedAt: Dayjs) => {
                    setCNPQScholarship(scholarship => ({
                      ...scholarship,
                      endedAt,
                    }))
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Tooltip
            title={'Preencha os campos obrigatórios'}
            disableHoverListener={checkIfCNPQScholarshipIsValid}
          >
            <span>
              <Button
                size={'large'}
                variant={'contained'}
                disabled={!checkIfCNPQScholarshipIsValid}
                onClick={() => handleSave()}
              >
                Salvar
              </Button>
            </span>
          </Tooltip>
        </Modal.Footer>
      </Modal>
    </Grid>
  )
}
