import { css } from 'styled-components'

const buttonStyle = css`
  display: block;

  width: 100%;
  padding: 10px;

  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;

  text-align: center;
  text-decoration: none;
  
  background-color: #FFC93F;
  color: #000000;
  border: none;
  border-bottom: 2px solid #DFA920;

  cursor: pointer;

  &:active {
    background-color: #DFA920;
  }
`

export default buttonStyle
