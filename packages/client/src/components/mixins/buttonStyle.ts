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
  
  background-color: var(--primary-color);
  color: #000000;
  border: none;
  border-bottom: 2px solid var(--secondary-color);

  cursor: pointer;

  &:active {
    background-color: var(--secondary-color);
  }

  &:disabled {
    background-color: #e8e8e8;
    color: #808080;
    border-bottom: 2px solid #e0e0e0;
    cursor: unset;
  }
`

export default buttonStyle
