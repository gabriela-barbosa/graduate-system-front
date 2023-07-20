import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material'
import { Subtitle } from '@styles/index.style'
import React, { useEffect, useState } from 'react'
import { getCNPQLevels, getCourses, getInstitutionTypes } from '../WorkHistoryEdit/api'
import { Input } from '@components'
import { Controller } from 'react-hook-form'
import { getAPIClient } from '../../services/axios'
import { SelectItem } from '@utils/types'
import { useRouter } from 'next/router'

const GraduateInfo = ({ control }) => {
  const router = useRouter()
  const [institutionTypes, setInstitutionTypes] = useState<SelectItem[]>([])
  const [cnpqLevels, setCNPQLevels] = useState<SelectItem[]>([])
  const [, setCourses] = useState<SelectItem[]>([])

  // const [hasObject] = useState({
  //   hasPostDoctorate: null,
  //   hasCNPQScholarship: null,
  // })

  // const { hasPostDoctorate, hasCNPQScholarship } = hasObject
  const apiClient = getAPIClient()

  const redirectToLoginIfError = response => {
    if ('response' in response) router.push('/')
  }

  useEffect(() => {
    getInstitutionTypes(apiClient).then(response => {
      redirectToLoginIfError(response)
      setInstitutionTypes(response as SelectItem[])
    })
    getCNPQLevels(apiClient).then(response => {
      redirectToLoginIfError(response)
      setCNPQLevels(response as SelectItem[])
    })
    getCourses(apiClient).then(response => {
      redirectToLoginIfError(response)
      setCourses(response as SelectItem[])
    })
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Subtitle>Informações do Egresso</Subtitle>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container rowSpacing={4} columnSpacing={4}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Input
                        name={'graduate.postDoctorateName'}
                        label={'Nome da instituição que foi realizada a pós-graduação'}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor={'graduate.institutionType'}>
                        Tipo da instituição da pós-graduação
                      </InputLabel>
                      <Controller
                        control={control}
                        name={'graduate.institutionType'}
                        render={({ field: { value, ...rest } }) => (
                          <Select
                            {...rest}
                            value={value ?? '0'}
                            label={'Tipo da instituição da pós-graduação'}
                          >
                            {institutionTypes.map(type => (
                              <MenuItem key={type.id} value={type.id}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container rowSpacing={4} columnSpacing={4}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor={'cnpqId'}>Bolsa CNPQ</InputLabel>
                      <Controller
                        control={control}
                        name={'graduate.cnpqScholarship'}
                        render={({ field: { value, ...rest } }) => (
                          <Select {...rest} multiple value={value ?? []} label={'Bolsa CNPQ'}>
                            {cnpqLevels.map(level => (
                              <MenuItem key={level.id} value={level.id}>
                                {level.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container rowSpacing={4} columnSpacing={4}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor={'courses'}>Cursos</InputLabel>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel>Concluiu o doutorado no PGC/UFF?</FormLabel>
          <Controller
            control={control}
            name={'graduate.hasFinishedDoctorateOnUFF'}
            render={({ field: { value, ...rest } }) => (
              <RadioGroup
                {...rest}
                row
                value={value}
                onChange={(event, value) => rest.onChange(value)}
              >
                <FormControlLabel control={<Radio />} label={'Não informar'} value={'unknown'} />
                <FormControlLabel control={<Radio />} label={'Sim'} value={true} />
                <FormControlLabel control={<Radio />} label={'Não'} value={false} />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <FormLabel>Concluiu o mestrado no PGC ou CAA - UFF ?</FormLabel>
          <Controller
            control={control}
            name={'graduate.hasFinishedMasterDegreeOnUFF'}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel control={<Radio />} label={'Não informar'} value={'unknown'} />
                <FormControlLabel control={<Radio />} label={'Sim'} value={true} />
                <FormControlLabel control={<Radio />} label={'Não'} value={false} />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default GraduateInfo
