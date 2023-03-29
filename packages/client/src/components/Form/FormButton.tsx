import styled from 'styled-components'
import buttonStyle from '../mixins/buttonStyle'

const FormButton = styled.button<{ size?: 'large', color?: 'default' }>`
  ${buttonStyle}
  ${props => {
    if (props.size === 'large') {
      return `
        font-size: 1.75em;
        font-weight: bold;
      `
    }
  }}
  ${props => {
    if (props.color === 'default') {
      return `
        background-color: #F0F0F0;
        border-bottom: 2px solid #D0D0D0;

        &:active {
          background-color: #D0D0D0;
        }
      `
    }
  }}
`

export default FormButton
