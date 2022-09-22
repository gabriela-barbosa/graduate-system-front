import React from 'react'
import { Grid } from '@mui/material'

const PageWrapper: React.FC = ({ children }) => (
  <Grid spacing={2} container alignItems="center" justifyContent="center" direction="column">
    {children}
  </Grid>
)
