import styled from 'styled-components'

interface Props {
  children?: React.ReactNode
  title?: string
  subTitle?: string
  color?: 'danger'
}
const Panel: React.FC<Props> = (props) => {
  return (
    <Container color={props.color}>
      {props.title && <Title>{props.title}</Title>}
      {props.children && <Main>
        {props.children}
      </Main>}
      {props.subTitle && <SubTitle>{props.subTitle}</SubTitle>}
    </Container>
  )
}

export default Panel

const Container = styled.div<{ color?: 'danger' }>`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  
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
const Main = styled.main`
  font-size: 1.5em;
  font-weight: bold;
`
const Title = styled.div``
const SubTitle = styled.div`
  font-size: 0.9em;
`
