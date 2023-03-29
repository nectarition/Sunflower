import { createGlobalStyle } from 'styled-components'

const ResetStyle = createGlobalStyle`
  * {
    box-sizing: border-box;  
  }

  html, body, #root {
    height: 100%;
  }
  
  html, body, p,
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }
`

export default ResetStyle
