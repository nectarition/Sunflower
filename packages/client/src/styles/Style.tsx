import { createGlobalStyle } from 'styled-components'

const Style = createGlobalStyle`
  table {
    tr {
      &.disabled {
        background-color: #c0c0c0;
        color: #808080;
        &:nth-child(2n) {
        background-color: #d0d0d0;
        }
      }
    } 
  }
`

export default Style
