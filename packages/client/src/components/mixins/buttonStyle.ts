import { css } from 'styled-components'

type ColorType =  'danger' | 'default'

const buttonStyle = css<{ size?: 'large', color?: ColorType }>`
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
  border-radius: 5px;

  cursor: pointer;

  transition: background-color 0.2s;

  &:active {
    background-color: var(--secondary-color);
  }

  &:disabled {
    background-color: #c8c8c8;
    color: #808080;
    border-bottom: 2px solid #c0c0c0;
    cursor: unset;
  }

  ${props => {
    if (props.size === 'large') {
      return {
        fontSize: '1.75em',
        fontWeight: 'bold'
      }
    }
  }}
  
  ${props => {
    if (props.color === 'default') {
      return {
        backgroundColor: '#f0f0f0',
        borderBottom: '2px solid #d0d0d0',
        '&:active': {
          backgroundColor: '#d0d0d0'
        }
      }
    } else if (props.color === 'danger') {
      return {
        backgroundColor: '#be2929',
        borderBottom: '2px solid #851313',
        color: '#ffffff',
        '&:active': {
          backgroundColor: '#851313'
        }
      }
    }
  }}
`

export default buttonStyle
