import styled from 'styled-components'

const FormItem = styled.div<{ $inlined?: boolean }>`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }

  ${props => props.$inlined && `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  `}
`

export default FormItem
