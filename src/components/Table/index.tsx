import styled from 'styled-components'

const TableHeader = styled.thead`
  border-bottom: 1px solid #00000019;
`

const Table = styled.table`
  padding-top: 50px;
`

const TD = styled.td`
  width: ${({ width }) => width ?? '300'}px;
`
const TR = styled.tr``

const TBody = styled.tbody``

const ActionIcon = styled.button`
  font-size: 18px;
  line-height: 24px;
  cursor: pointer;
  color: #00000066;
  border: none;
  background: transparent;
`

export { TableHeader, Table, ActionIcon, TD, TR, TBody }
