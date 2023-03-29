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
  h1 { font-size: 2em; }
  h2 { font-size: 1.75em; }
  h3 { font-size: 1.5em; }
  h4 { font-size: 1.25em; }
  h5 { font-size: 1em; }
  h6 { font-size: 0.9em; }
`

export default GlobalStyle
