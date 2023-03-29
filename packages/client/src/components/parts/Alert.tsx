import styled from 'styled-components'

interface Props {
  children: React.ReactNode
}
const Alert: React.FC<Props> = (props) => {
  return (
    <Container>
      {props.children}
    </Container>
  )
}

export default Alert

const Container = styled.p`
  padding: 10px;
  background-color: #FFC93F80;
`
