import { FormControl, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { Button, DatePicker, SelectMui } from '@components'
import { SelectItem } from '@utils/types'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { Dayjs } from 'dayjs'
import { UserLean } from '@modules/WorkHistoryEdit/types'

interface Props {
  courses: CourseInfoType[]
  setCourses: any
  programs: SelectItem[]
  isAddCourseOpen: boolean
  setIsAddCourseOpen: (value: boolean) => void
}

interface CIProgram {
  id?: string
  initials?: string
}

interface CourseInfoType {
  id?: string
  program?: CIProgram
  graduate?: UserLean
  defenseMinute?: string
  titleDate?: Date
  advisor?: UserLean
}

export const CourseModal = ({
  courses,
  setCourses,
  programs,
  isAddCourseOpen,
  setIsAddCourseOpen,
}: Props) => {
  const courseDefaultState: CourseInfoType = {
    id: undefined,
    program: undefined,
    graduate: undefined,
    defenseMinute: undefined,
    titleDate: undefined,
    advisor: undefined,
  }
  const [course, setCourse] = useState<CourseInfoType>({
    ...courseDefaultState,
  })

  const onModalClose = () => {
    setIsAddCourseOpen(false)
    setCourse({ ...courseDefaultState })
  }

  const handleSave = () => {
    setCourses([...courses, course])
    onModalClose()
  }

  const checkIfCourseIsValid = !!(course.levelId && course.startedAt)

  return (
    <Modal show={isAddCourseOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Fields>{course.id ? 'Editar' : 'Adicionar'} Bolsa de Produtividade CNPQ</Fields>
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
                value={course.program?.id || ''}
                onChange={event => {
                  if (event.target.value)
                    setCourse(oldCourse => ({
                      ...oldCourse,
                      program: { id: event.target.value as string },
                    }))
                }}
              >
                {programs.map(level => (
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
                value={course.startedAt}
                disableFuture
                onChange={(startedAt: Dayjs) => {
                  setCourse(scholarship => ({
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
                value={course.endedAt}
                disableFuture
                onChange={(endedAt: Dayjs) => {
                  setCourse(scholarship => ({
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
          disableHoverListener={checkIfCourseIsValid}
        >
          <span>
            <Button
              size={'large'}
              variant={'contained'}
              disabled={!checkIfCourseIsValid}
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
