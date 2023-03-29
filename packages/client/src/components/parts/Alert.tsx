import styled from 'styled-components'

interface Props {
  children: React.ReactNode
  color?: 'danger'
}
const Alert: React.FC<Props> = (props) => {
  return (
    <Container color={props.color}>
      {props.children}
    </Container>
  )
}

export default Alert

const Container = styled.p<{ color?: 'danger' }>`
  padding: 10px;
  background-color: #FFC93F80;

  ${props => {
    if (props.color === 'danger') {
      return `
        background-color: #FF000040;
      `
    }
  }}
`
