import { createTheme } from '@mui/material'

const theme = {
  colors: {
    background: '#121214',
    text: '#e1e1e6',
    primary: '#8257e6',
    green: {
      light: '#4b907e',
    },
  },
  ...createTheme({
    components: {},
  }),
}

export default theme
