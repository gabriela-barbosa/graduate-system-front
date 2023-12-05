import { Subtitle } from './index.style'
import React, { useCallback, useState } from 'react'
import {
  ActionIcon,
  Button,
  DatePicker,
  InputMui,
  Paper,
  SelectMui,
  Grid,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Typography,
  MenuItem,
  Checkbox,
  CustomTable,
  InputLabel,
  FormHelperText,
  DeleteForeverRoundedIcon,
  AddRounded,
  debounce,
} from '@components'
import { GraduateWorkHistoriesInfo, Option } from './types'
import { Role } from '@utils/enums'
import { SelectItem } from '@utils/types'
import { Fields, Label } from '@styles/index.style'
import dayjs, { Dayjs } from 'dayjs'
import { useAuth } from '@context/AuthProvider'
import { Controller, useController } from 'react-hook-form'
import { CNPQScholarshipsModal } from '@modules/WorkHistoryEdit/CNPQScholarshipModal'
import { getAPIClient } from '@services/axios'

interface Props {
  cnpqLevels: SelectItem[]
  control: any
  graduateInfo: GraduateWorkHistoriesInfo
  institutionTypes: Option[]
}

export const AcademicInfo = ({ graduateInfo, cnpqLevels, institutionTypes, control }: Props) => {
  const { currentRole } = useAuth()
  const isCurrentUserGraduate = currentRole === Role.GRADUATE
  const apiClient = getAPIClient()

  const { cnpqScholarships: historyCNPQScholarships } = graduateInfo

  const [isAddCNPQScholarshipOpen, setIsAddCNPQScholarshipOpen] = useState<boolean>(false)
  const [currentCNPQScholarshipsSelected, setCurrentCNPQScholarshipsSelected] = useState<number[]>(
    []
  )

  const {
    field: { value: institutionIdValue, onChange: institutionIdOnChange },
  } = useController({ control, name: 'postDoctorate.institution.id' })

  const {
    field: { onChange: institutionTypeIdOnChange },
  } = useController({ control, name: 'postDoctorate.institution.typeId' })

  const {
    field: { value: cnpqScholarships, onChange: setCNPQScholarships },
  } = useController({ control, name: 'cnpqScholarships' })

  const currentScholarshipsOptions = [...cnpqScholarships, ...historyCNPQScholarships].filter(
    scholarship => !scholarship.endedAt || scholarship.endedAt === 'null'
  )

  const {
    field: { onChange: setCurrentCNPQScholarships },
  } = useController({ control, name: 'currentCNPQScholarships' })

  const {
    field: { value: hasCurrentCNPQScholarship },
  } = useController({
    control,
    name: 'hasCurrentCNPQScholarship',
    rules: {
      validate: value => {
        if (value === 1)
          return currentCNPQScholarshipsSelected?.length === currentScholarshipsOptions?.length
        if (value === 0) return currentScholarshipsOptions?.length === 0
        return true
      },
    },
  })

  const {
    field: { value: hasPostDoctorate },
  } = useController({
    control,
    name: 'hasPostDoctorate',
  })

  const getSelectText = scholarship => {
    return `${
      cnpqLevels.find(type => type.id === scholarship.levelId)?.label
    } - ${(typeof scholarship.startedAt === 'string'
      ? dayjs(scholarship.startedAt)
      : scholarship.startedAt
    ).format('DD/MM/YYYY')}`
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
              setCurrentCNPQScholarshipsSelected([])
              setCurrentCNPQScholarships([])
              setCNPQScholarships(cnpqScholarships.filter((_, i) => i !== index))
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

  const [options, setOptions] = useState([])
  // const [newInstitutions, setNewInstitutions] = useState([])

  const getData = async searchTerm => {
    const { data: dataResponse } = await apiClient.get(
      `v1/institutions?name=${searchTerm}&pageSize=1000`
    )
    const { data } = dataResponse
    setOptions(data)
  }

  const debounceGetData = useCallback(
    debounce(inputValue => getData(inputValue), 1000),
    []
  )
  const onInputChange = (inputValue, onChangeInstitution) => {
    if (inputValue) {
      onChangeInstitution(inputValue)
      debounceGetData(inputValue)
    } else {
      setOptions([])
    }
  }

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
                    <CustomTable columns={columns} rows={rows} />
                  ) : (
                    <Paper variant="outlined" sx={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                      <Box sx={{ padding: 2 }}>
                        <Label>Não há histórico de bolsas.</Label>
                      </Box>
                    </Paper>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="labelHasCNPQScholarship">
                      Possui Bolsa de Produtividade CNPQ atualmente?
                    </FormLabel>
                    <Controller
                      name={'hasCurrentCNPQScholarship'}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <RadioGroup
                          row
                          aria-labelledby={'labelHasCNPQScholarship'}
                          name={'hasCurrentCNPQScholarship'}
                          value={value}
                          onChange={event => {
                            const value = parseInt(event.target.value)
                            onChange(value)
                            if (value !== 1) {
                              setCurrentCNPQScholarships([])
                              setCurrentCNPQScholarshipsSelected([])
                            }
                          }}
                        >
                          <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                          <FormControlLabel value={0} control={<Radio />} label={'Não'} />
                          <FormControlLabel
                            hidden={isCurrentUserGraduate}
                            value={-1}
                            control={<Radio />}
                            label={'Não sei'}
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                {hasCurrentCNPQScholarship === 1 &&
                  (currentScholarshipsOptions?.length ? (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="currentScholarshipsLabel">Bolsas atuais</InputLabel>
                        <SelectMui
                          labelId={'currentScholarshipsLabel'}
                          id={'currentScholarships'}
                          name={'currentScholarships'}
                          label={'Bolsas atuais'}
                          value={currentCNPQScholarshipsSelected}
                          renderValue={(selected: never[]) =>
                            selected
                              ?.map(item => getSelectText(currentScholarshipsOptions[item]))
                              .join(', ')
                          }
                          multiple
                          onChange={({ target: { value } }) => {
                            const cnpqScholarshipUpdated = (value as number[]).map(
                              item => currentScholarshipsOptions[item]
                            )
                            setCurrentCNPQScholarships(cnpqScholarshipUpdated)
                            setCurrentCNPQScholarshipsSelected(
                              (typeof value === 'string' ? value.split(',') : value) as never
                            )
                          }}
                        >
                          {currentScholarshipsOptions.map((institutionItem, index) => (
                            <MenuItem key={index} value={index}>
                              <Checkbox
                                checked={currentCNPQScholarshipsSelected.indexOf(index) > -1}
                              />
                              {getSelectText(institutionItem)}
                            </MenuItem>
                          ))}
                        </SelectMui>
                      </FormControl>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Label color={'#cb0000'}>
                        Adicione um registro de bolsa sem data de término.
                      </Label>
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
                    <Controller
                      name={'hasPostDoctorate'}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <RadioGroup
                          row
                          aria-labelledby={'labelHasPostDoctorate'}
                          name={'hasPostDoctorate'}
                          value={value}
                          onChange={({ target }) => {
                            const value = parseInt(target.value)
                            onChange(value)
                          }}
                        >
                          <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                          <FormControlLabel value={0} control={<Radio />} label={'Não'} />
                          <FormControlLabel
                            hidden={isCurrentUserGraduate}
                            value={-1}
                            control={<Radio />}
                            label={'Não sei'}
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Controller
                      name="postDoctorate.institution.name"
                      control={control}
                      rules={{ required: hasPostDoctorate === 1 }}
                      render={({
                        field: {
                          onChange: onChangePostDoctorateInstitution,
                          value: valuePostDoctorateInstitution,
                        },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          freeSolo
                          disabled={hasPostDoctorate !== 1}
                          noOptionsText="Nenhuma instituição encontrada"
                          disablePortal
                          onInputChange={(event, inputValue) =>
                            onInputChange(inputValue, onChangePostDoctorateInstitution)
                          }
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
                          inputValue={valuePostDoctorateInstitution || ''}
                          getOptionLabel={option => option?.name || option}
                          defaultValue={''}
                          options={options}
                          renderInput={params => (
                            <InputMui
                              {...params}
                              label="Nome da instituição"
                              variant="standard"
                              pa={() => 'Campo obrigatório.'}
                              error={!!error}
                              helperText={error ? 'Campo obrigatório.' : ''}
                            />
                          )}
                          onChange={(event, value, reason) => {
                            let name = value?.name
                            let typeId = value?.type.id
                            let id = value?.id
                            if (reason === 'clear') {
                              name = null
                              typeId = null
                              id = null
                            }
                            onChangePostDoctorateInstitution(name)
                            institutionTypeIdOnChange(typeId)
                            institutionIdOnChange(id)
                          }}
                          value={valuePostDoctorateInstitution}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor={'labelPostDocType'}>Tipo da Instituição</InputLabel>
                    <Controller
                      control={control}
                      name={'postDoctorate.institution.typeId'}
                      rules={{
                        required: hasPostDoctorate === 1,
                        validate: value => hasPostDoctorate !== 1 || value !== 0,
                      }}
                      render={({ field: { value, ...rest }, fieldState: { error } }) => (
                        <>
                          <SelectMui
                            {...rest}
                            value={value ?? 0}
                            label={'Tipo da Instituição'}
                            labelId={'labelPostDocType'}
                            disabled={hasPostDoctorate !== 1 || institutionIdValue}
                            error={!!error}
                          >
                            {institutionTypes.map(type => (
                              <MenuItem key={type.id} value={type.id}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </SelectMui>
                          <FormHelperText variant="standard" sx={{ color: '#d32f2f' }}>
                            {error ? 'Campo obrigatório.' : ''}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Controller
                      name={'postDoctorate.startedAt'}
                      control={control}
                      rules={{
                        required: hasPostDoctorate === 1,
                      }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DatePicker
                          format={'DD/MM/YYYY'}
                          label={'Data de início'}
                          value={typeof value === 'string' ? dayjs(value) : value}
                          disabled={hasPostDoctorate !== 1}
                          disableFuture
                          onChange={(startedAt: Dayjs) => {
                            onChange(startedAt)
                          }}
                          slotProps={{
                            textField: {
                              variant: 'standard',
                              error: !!error,
                              helperText: error ? 'Campo obrigatório.' : '',
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Controller
                      name={'postDoctorate.endedAt'}
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DatePicker
                          format={'DD/MM/YYYY'}
                          label={'Data de término'}
                          value={typeof value === 'string' ? dayjs(value) : value}
                          disabled={hasPostDoctorate !== 1}
                          disableFuture
                          onChange={(endedAt: Dayjs) => {
                            onChange(endedAt)
                          }}
                          slotProps={{
                            textField: {
                              variant: 'standard',
                              error: !!error,
                              helperText: error ? 'Campo obrigatório.' : '',
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                {currentRole && currentRole === Role.ADMIN && (
                  <>
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel id="labelHasPostDoctorate">
                          Concluiu o doutorado no PGC/UFF?
                        </FormLabel>
                        <Controller
                          name={'hasFinishedDoctorateOnUFF'}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup
                              row
                              aria-labelledby={'labelHasFinishedDoctorateOnUFF'}
                              name={'hasFinishedDoctorateOnUFF'}
                              value={value}
                              onChange={onChange}
                            >
                              <FormControlLabel value={'true'} control={<Radio />} label={'Sim'} />
                              <FormControlLabel value={'false'} control={<Radio />} label={'Não'} />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel id="labelHasFinishedDoctorateOnUFF">
                          Concluiu o mestrado no PGC ou CAA - UFF ?
                        </FormLabel>
                        <Controller
                          name={'hasFinishedMasterDegreeOnUFF'}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup
                              aria-labelledby={'labelHasFinishedDoctorateOnUFF'}
                              row
                              name={'hasFinishedMasterDegreeOnUFF'}
                              value={value}
                              onChange={onChange}
                            >
                              <FormControlLabel value={'true'} control={<Radio />} label={'Sim'} />
                              <FormControlLabel value={'false'} control={<Radio />} label={'Não'} />
                            </RadioGroup>
                          )}
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
      <CNPQScholarshipsModal
        cnpqScholarships={cnpqScholarships}
        setCNPQScholarships={setCNPQScholarships}
        cnpqLevels={cnpqLevels}
        isAddCNPQScholarshipOpen={isAddCNPQScholarshipOpen}
        setIsAddCNPQScholarshipOpen={setIsAddCNPQScholarshipOpen}
      />
    </Grid>
  )
}
