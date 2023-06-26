import { createTheme } from '@mui/material'
import { cyan, teal } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: teal,
    secondary: cyan,
    background: { default: '#121214' },
    text: {},
  },
  components: {},
})
// export const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#51be78',
//     },
//     secondary: {
//       main: '#3c3c3c',
//     },
//   },
// })
