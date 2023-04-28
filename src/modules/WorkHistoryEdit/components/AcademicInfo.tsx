import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { Subtitle } from '../../WorkHistoryEdit/index.style'
import React, { useEffect, useState } from 'react'
import { Input, Select } from '@components'
import { Option } from '../../WorkHistoryEdit/types'
import { Role } from '@utils/enums'
import { RadioButtonGroup } from 'react-hook-form-mui'
import { getCNPQLevels } from '../api'

interface Props {
  institutionTypes: Option[]
  hasPostDoctorate: boolean
  hasCNPQScholarship: boolean
  setHasCNPQScholarship: (value?) => void
  setHasPostDoctorate: (value?) => void
  handleSetValue: (event: unknown, setHasCNPQScholarship: () => void) => void
  currentRole?: Role
}

export const AcademicInfo = ({
  institutionTypes,
  hasPostDoctorate,
  hasCNPQScholarship,
  setHasCNPQScholarship,
  setHasPostDoctorate,
  handleSetValue,
  currentRole,
}: Props) => {
  const [cnpqLevels, setCNPQLevels] = useState([])

  useEffect(() => {
    getCNPQLevels().then(levels => setCNPQLevels(levels))
  }, [])

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Informações acadêmicas</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <FormLabel id="labelHasPostDoctorate">Possui pós-graduação?</FormLabel>
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
            <FormControl>
              <FormLabel id="labelHasCNPQScholarship">Possui Bolsa CNPQ?</FormLabel>
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
