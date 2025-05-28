import { css } from 'styled-components'

type ColorType =  'danger' | 'default'

const buttonStyle = css<{ size?: 'small' | 'large', color?: ColorType }>`
  display: block;

  width: 100%;
  padding: 10px;

  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;

  text-align: center;
  text-decoration: none;
  
  border: 1px solid var(--border-color);
  background-color: var(--inputfield-background-color);
  color: inherit;
  border-radius: 5px;

  cursor: pointer;

  transition: border 0.2s, background-color 0.2s;

  &:disabled {
    background-color: var(--disabled-background-color);
    color: var(--disabled-text-color);
    border-bottom: 1px solid var(--border-color);
    cursor: unset;
  }

  ${props => {
    if (props.size === 'small') {
      return {
        width: 'auto',
        padding: '5px 10px',
        fontSize: '0.9em'
      }
    } else if (props.size === 'large') {
      return {
        fontSize: '1.75em',
        fontWeight: 'bold'
      }
    }
  }}

  &:hover {
    border: 1px solid var(--text-color);
  }

  &:active {
    background-color: var(--brand-background-active-color);
  }
`

export default buttonStyle
