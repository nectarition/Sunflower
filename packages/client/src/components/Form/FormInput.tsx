import styled from 'styled-components'

const FormInput = styled.input`
  display: block;
  font-family: inherit;
  font-weight: inherit;

  width: 100%;
  padding: 5px;
  outline: none;
  border: 2px solid #c0c0c0;

  &:focus {
    border: 2px solid var(--secondary-color);
  }
`

export default FormInput
