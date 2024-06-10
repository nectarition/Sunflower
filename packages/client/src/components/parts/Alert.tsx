import styled from 'styled-components'

type ColorType = 'danger' | 'success'

interface Props {
  children: React.ReactNode
  color?: ColorType
}
const Alert: React.FC<Props> = (props) => {
  return (
    <Container color={props.color}>
      {props.children}
    </Container>
  )
}

export default Alert

const Container = styled.p<{ color?: ColorType }>`
  padding: 10px;
  background-color: #ffc93f80;

  ${props => {
    if (props.color === 'danger') {
      return {
        backgroundColor: '#ff000040'
      }
    } else if (props.color === 'success') {
      return {
        backgroundColor: '#5ce42280'
      }
    }
  }}
`
