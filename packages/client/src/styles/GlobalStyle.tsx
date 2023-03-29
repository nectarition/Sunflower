import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  p,
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  small {
    font-size: 0.8em;
    font-weight: 500;
  }
`

export default GlobalStyle
