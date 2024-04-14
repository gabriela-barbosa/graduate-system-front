import React from 'react'
import { Typography } from '@components'

export const Subtitle = ({ children }) => (
  <Typography color="primary.main" fontWeight="medium" variant="h5">
    {children}
  </Typography>
)
