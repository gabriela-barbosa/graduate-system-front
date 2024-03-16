import React, { useState } from 'react'
import {
  Button,
  Grid,
  ActionIcon,
  DeleteForeverRoundedIcon,
  AddRounded,
  Box,
  CustomTable,
  Paper,
} from '@components'
import { useController } from 'react-hook-form'
import { Fields, Label } from '@styles/index.style'
import { Course } from '@modules/WorkHistoryEdit'
import dayjs from 'dayjs'
import { Subtitle } from '@modules/WorkHistoryEdit/index.style'
import { CNPQScholarshipsModal } from '@modules/WorkHistoryEdit/CNPQScholarshipModal'

interface Props {
  control: any
  courses: Course[]
}

const CoursesPage = ({ courses: historyCourses, control }: Props) => {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState<boolean>(false)

  const {
    field: { value: courses, onChange: setCourses },
  } = useController({ control, name: 'courses' })

  const rows = [
    ...courses.map((course, index) => [
      {
        body: <Fields status={'UPDATED'}>{course.advisor.name}</Fields>,
      },
      {
        body: <Fields status={'UPDATED'}>{course.defenseMinute}</Fields>,
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!course.titleDate ? '-' : dayjs(course.titleDate).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <ActionIcon
            onClick={() => {
              setCourses(courses.filter((_, i) => i !== index))
            }}
          >
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]),
    ...historyCourses.map(historyCourse => [
      {
        body: <Fields status={'UPDATED'}>{historyCourse.advisor.name}</Fields>,
      },
      {
        body: <Fields status={'UPDATED'}>{historyCourse.defenseMinute}</Fields>,
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!historyCourse.titleDate ? '-' : dayjs(historyCourse.titleDate).format('DD/MM/YYYY')}
          </Fields>
        ),
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
    <Grid container direction="column" spacing={1}>
      <Grid item xs={12}>
        <Subtitle>
          Bolsa de Produtividade CNPQ
          <Button
            sx={{ marginLeft: '20px' }}
            size={'large'}
            variant="contained"
            // disabled={hasInstitutionalLink === -1 || hasInstitutionalLink === 0}
            onClick={() => setIsAddCourseOpen(true)}
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
          </Grid>
        </Box>
      </Grid>
      <CNPQScholarshipsModal
        cnpqScholarships={cnpqScholarships}
        setCNPQScholarships={setCNPQScholarships}
        cnpqLevels={cnpqLevels}
        isAddCNPQScholarshipOpen={isAddCourseOpen}
        setIsAddCNPQScholarshipOpen={setIsAddCourseOpen}
      />
    </Grid>
  )
}
export default CoursesPage
