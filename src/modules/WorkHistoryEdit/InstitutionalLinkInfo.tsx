import { Subtitle } from './index.style'
import {
  AddRounded,
  SelectMui,
  Paper,
  Checkbox,
  DeleteForeverRoundedIcon,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  CustomTable,
  ActionIcon,
  Button,
  Box,
  InputLabel,
  MenuItem,
  Divider,
  EditRoundedIcon,
} from '@components'
import React, { useState } from 'react'
import { ErrorMessage, Fields, Label } from '@styles/index.style'
import { GraduateWorkHistoriesInfo } from '@modules/WorkHistoryEdit/types'
import { SelectItem } from '@utils/types'
import dayjs from 'dayjs'
import { Control, Controller, useController } from 'react-hook-form'
import { InstitutionalLinkModal } from '@modules/WorkHistoryEdit/InstitutionalLinkModal'
import { Role } from '@utils/enums'
import { useAuth } from '@context/AuthProvider'

interface Props {
  graduateInfo: GraduateWorkHistoriesInfo
  institutionTypes: SelectItem[]
  control: Control<any>
}

export const InstitutionalLinkInfo = ({ graduateInfo, institutionTypes, control }: Props) => {
  const { workHistories } = graduateInfo
  const { currentRole } = useAuth()
  const isCurrentUserGraduate = currentRole === Role.GRADUATE

  const [isAddWorkHistoryOpen, setIsAddWorkHistoryOpen] = useState<boolean>(false)

  const [currentInstitutionalLinksSelected, setCurrentInstitutionalLinksSelected] = useState<
    number[]
  >([])

  const {
    field: { onChange: setInstitutionalLinks, value: institutionalLinks },
  } = useController({ control, name: 'institutionalLinks' })

  const {
    field: { onChange: setCurrentInstitutionalLinks },
  } = useController({ control, name: 'currentInstitutionalLinks' })

  const currentInstitutionalLinksOptions = [...workHistories, ...institutionalLinks].filter(
    link => !link.endedAt || link.endedAt === 'null'
  )

  const {
    field: { value: hasCurrentWorkHistory },
    fieldState: { error },
  } = useController({
    control,
    name: 'hasCurrentWorkHistory',
    rules: {
      validate: value => {
        if (value === 1)
          return (
            currentInstitutionalLinksSelected?.length === currentInstitutionalLinksOptions?.length
          )
        if (value === 0) return currentInstitutionalLinksOptions?.length === 0
        return true
      },
    },
  })

  const rows = [
    ...institutionalLinks.map((link, index) => [
      { body: <Fields status={'UPDATED'}>{link.institution.name}</Fields> },
      {
        body: (
          <Fields status={'UPDATED'}>
            {institutionTypes.find(type => type.id === link.institution.typeId)?.label}
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
          <section>
            <ActionIcon onClick={() => {}}>
              <EditRoundedIcon />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setCurrentInstitutionalLinks([])
                setCurrentInstitutionalLinksSelected([])
                setInstitutionalLinks(institutionalLinks.filter((item: any, i: any) => i !== index))
              }}
            >
              <DeleteForeverRoundedIcon />
            </ActionIcon>
          </section>
        ),
        width: '10%',
      },
    ]),
    ...workHistories.map(wh => [
      { body: wh.institution.name },
      { body: wh.institution.typeName },
      { body: wh.position ?? '-' },
      {
        body:
          !wh.startedAt || wh.startedAt === 'null' ? '-' : dayjs(wh.startedAt).format('DD/MM/YYYY'),
      },
      {
        body: !wh.endedAt || wh.endedAt === 'null' ? '-' : dayjs(wh.endedAt).format('DD/MM/YYYY'),
      },
      {
        body: (
          <ActionIcon onClick={() => {}}>
            <EditRoundedIcon />
          </ActionIcon>
        ),
      },
    ]),
  ]

  const columns = [
    {
      name: 'Nome da instituição',
    },
    {
      name: 'Tipo da instituição',
    },
    {
      name: 'Cargo',
    },
    {
      name: 'Data de Início',
    },
    {
      name: 'Data de Término',
    },
    { name: 'Ações', width: '10%' },
  ]

  const getSelectText = institutionItem => {
    return `${institutionItem.institution.name} -${
      institutionItem.position ? ` ${institutionItem.position} -` : ''
    } ${(typeof institutionItem.startedAt === 'string'
      ? dayjs(institutionItem.startedAt)
      : institutionItem.startedAt
    ).format('DD/MM/YYYY')}`
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>
            Informações sobre vínculos institucionais{' '}
            <Button
              sx={{ marginLeft: '20px' }}
              size={'large'}
              variant="contained"
              onClick={() => setIsAddWorkHistoryOpen(true)}
            >
              Adicionar
              <AddRounded />
            </Button>
          </Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ paddingLeft: '15px' }}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              {rows?.length ? (
                <CustomTable columns={columns} rows={rows} />
              ) : (
                <Paper variant="outlined" sx={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                  <Box sx={{ padding: 2 }}>
                    <Label>Não há histórico de vínculos institucionais.</Label>
                  </Box>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="labelHasWorkHistory">
                  Possui vínculo institucional atualmente?
                </FormLabel>
                <Controller
                  name={'hasCurrentWorkHistory'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      row
                      aria-labelledby={'labelHasWorkHistory'}
                      name={'hasCurrentWorkHistory'}
                      value={value}
                      onChange={event => {
                        const value = parseInt(event.target.value)
                        onChange(value)
                        if (value !== 1) {
                          setCurrentInstitutionalLinks([])
                          setCurrentInstitutionalLinksSelected([])
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

            {hasCurrentWorkHistory === 1 &&
              (currentInstitutionalLinksOptions?.length ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="currentInstitutionsLabel">Vínculos atuais</InputLabel>
                    <SelectMui
                      labelId={'currentInstitutionsLabel'}
                      id={'currentInstitutions'}
                      name={'currentInstitutions'}
                      label={'Vínculos atuais'}
                      value={currentInstitutionalLinksSelected}
                      renderValue={(selected: never[]) => {
                        return selected
                          ?.map(item => getSelectText(currentInstitutionalLinksOptions[item]))
                          .join(', ')
                      }}
                      multiple
                      onChange={({ target: { value } }) => {
                        const institutionalLinksUpdated = (value as number[]).map(
                          item => currentInstitutionalLinksOptions[item]
                        )
                        setCurrentInstitutionalLinks(institutionalLinksUpdated)

                        setCurrentInstitutionalLinksSelected(
                          (typeof value === 'string' ? value.split(',') : value) as never
                        )
                      }}
                    >
                      {currentInstitutionalLinksOptions.map((institutionItem, index) => (
                        <MenuItem key={index} value={index}>
                          <Checkbox
                            checked={currentInstitutionalLinksSelected.indexOf(index) > -1}
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
                    Adicione um vínculo institucional sem data de término e selecione.
                  </Label>
                </Grid>
              ))}
            {error && (
              <ErrorMessage>
                Selecione os vínculos institucionais atuais e/ou adicione uma data de término nos
                não selecionados.
              </ErrorMessage>
            )}
            <InstitutionalLinkModal
              institutionalLinks={institutionalLinks}
              setInstitutionalLinks={setInstitutionalLinks}
              institutionTypes={institutionTypes}
              isAddWorkHistoryOpen={isAddWorkHistoryOpen}
              setIsAddWorkHistoryOpen={setIsAddWorkHistoryOpen}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
