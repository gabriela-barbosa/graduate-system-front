import TableComponent from '@mui/material/Table'
import TableHeadComponent from '@mui/material/TableHead'
import TableCellComponent from '@mui/material/TableCell'
import TableRowComponent from '@mui/material/TableRow'
import TableBodyComponent from '@mui/material/TableBody'
import TableContainerComponent from '@mui/material/TableContainer'

import styled from 'styled-components'

const TableContainer = TableContainerComponent
const TableHeader = styled(TableHeadComponent)`
  border-bottom: 1px solid #00000019;
`

const Table = styled(TableComponent)``

const TableCell = styled(TableCellComponent)`
  width: ${({ width }) => width ?? '300'}px;
`
const TableRow = TableRowComponent

const TableBody = TableBodyComponent

const ActionIcon = styled.button`
  font-size: 18px;
  line-height: 24px;
  cursor: pointer;
  color: #00000066;
  border: none;
  background: transparent;
`

export { TableHeader, Table, ActionIcon, TableCell, TableRow, TableBody, TableContainer }
