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
import { Button, SelectMui, DatePicker, InputMui, ActionIcon } from '@components'
import React, { useState } from 'react'
import { AddRounded } from '@mui/icons-material'
import GraduatesTable from '@modules/Egressos/GraduatesTable'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { GraduateWorkHistoriesInfo } from '@modules/WorkHistoryEdit/types'
import { SelectItem } from '@utils/types'
import dayjs, { Dayjs } from 'dayjs'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'

interface Props {
  graduateInfo: GraduateWorkHistoriesInfo
  institutionTypes: SelectItem[]
}

interface InstitutionalLinkInfoType {
  id?: string | null
  position?: string | null
  institutionTypeId?: string | null
  institutionName?: string | null
  startedAt?: Dayjs | null
  endedAt?: Dayjs | null
}

export const InstitutionalLinkInfo = ({ graduateInfo, institutionTypes }: Props) => {
  const { workHistories } = graduateInfo

  const institutionalLinkDefaultState: InstitutionalLinkInfoType = {
    id: null,
    position: null,
    institutionTypeId: null,
    institutionName: null,
    startedAt: null,
    endedAt: null,
  }
  const [isAddWorkHistoryOpen, setIsAddWorkHistoryOpen] = useState<boolean>(false)
  const [institutionalLink, setInstitutionalLink] = useState<InstitutionalLinkInfoType>({
    ...institutionalLinkDefaultState,
  })
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState<number>(1)

  const [institutionalLinks, setInstitutionalLinks] = useState<InstitutionalLinkInfoType[]>([])
  const [currentInstitutionalLinks, setCurrentInstitutionalLinks] = useState<any[]>([])

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

  const currentInstitutionalLinksOptions = [
    ...workHistories.map(({ institution, ...rest }) => ({
      ...rest,
      institutionName: institution.name,
      institutionTypeId: institution.typeId,
    })),
    ...institutionalLinks,
  ].filter(link => !link.endedAt || link.endedAt === 'null')

  const onModalClose = () => {
    setIsAddWorkHistoryOpen(false)
    setInstitutionalLink({ ...institutionalLinkDefaultState })
  }

  const handleSave = () => {
    console.log('workHistories', workHistories)
    setInstitutionalLinks(links => [...links, institutionalLink])
    onModalClose()
  }

  // const editInstitutionalLink = selectedInstitution => {
  //   const { id, institution, position, startedAt, endedAt } = selectedInstitution
  //   console.log(selectedInstitution)
  //   setInstitutionalLink({
  //     id,
  //     institutionName: institution.name,
  //     institutionTypeId: institution.typeId,
  //     position,
  //     startedAt: dayjs(startedAt),
  //     endedAt: endedAt && endedAt !== 'null' ? dayjs(endedAt) : null,
  //   })
  //   setIsAddWorkHistoryOpen(true)
  // }

  const checkIfInstitutionalLinkInfoIsValid = !!(
    institutionalLink.institutionTypeId &&
    institutionalLink.institutionName &&
    institutionalLink.startedAt
  )

  const getSelectText = institutionItem => {
    return `${institutionItem.institutionName} -${
      institutionItem.position ? ` ${institutionItem.position} -` : ''
    } ${(typeof institutionItem.startedAt === 'string'
      ? dayjs(institutionItem.startedAt)
      : institutionItem.startedAt
    ).format('DD/MM/YYYY')}`
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Informações sobre vínculos institucionais</Subtitle>
        <Button
          size={'large'}
          variant="contained"
          // disabled={hasInstitutionalLink === -1 || hasInstitutionalLink === 0}
          onClick={() => setIsAddWorkHistoryOpen(true)}
        >
          Adicionar
          <AddRounded />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={3}>
          {/* <Grid item xs={12}> */}
          {/*  <Grid container spacing={3}> */}
          {/*    <Grid item alignSelf={'center'}></Grid> */}
          {/*  </Grid> */}
          {/* </Grid> */}
          <Grid item xs={12}>
            {/* <Accordion> */}
            {/*  <AccordionSummary */}
            {/*    expandIcon={<ExpandMoreRounded />} */}
            {/*    aria-controls="panel1a-content" */}
            {/*    id="panel1a-header" */}
            {/*  > */}
            {/*    <Fields>Histórico</Fields> */}
            {/*  </AccordionSummary> */}
            {/*  <AccordionDetails> */}

            {rows?.length !== 0 ? (
              <GraduatesTable columns={columns} rows={rows} />
            ) : (
              <Fields>Nenhum resultado encontrado.</Fields>
            )}
            {/*  </AccordionDetails> */}
            {/* </Accordion> */}
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
    </Grid>
  )
}
