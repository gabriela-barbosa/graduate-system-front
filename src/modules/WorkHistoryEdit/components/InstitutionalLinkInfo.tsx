import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { Subtitle } from '../../WorkHistoryEdit/index.style'
import { Input, Select } from '@components'
import React from 'react'

export const InstitutionalLinkInfo = ({
  institutionTypes,
  handleSetValue,
  hasInstitutionalLink,
  setHasInstitutionalLink,
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Subtitle>Informações sobre vínculo institucional</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Possui vínculo institucional?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={hasInstitutionalLink}
                onChange={event => handleSetValue(event, setHasInstitutionalLink)}
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
                    name={'institutionName'}
                    label={'Nome da instituição'}
                    disabled={!hasInstitutionalLink}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Select
                    disabled={!hasInstitutionalLink}
                    name={'institutionType'}
                    label={'Tipo da instituição'}
                    options={institutionTypes}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={5}>
                <FormControl fullWidth>
                  <Input name={'position'} label={'Cargo'} disabled={!hasInstitutionalLink} />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
