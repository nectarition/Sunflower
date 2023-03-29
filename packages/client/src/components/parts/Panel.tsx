import styled from 'styled-components'

interface Props {
  children: React.ReactNode
  title?: string
  subTitle?: string
}
const Panel: React.FC<Props> = (props) => {
  return (
    <Container>
      {props.title && <Title>{props.title}</Title>}
      <Main>
        {props.children}
      </Main>
      {props.subTitle && <SubTitle>{props.subTitle}</SubTitle>}
    </Container>
  )
}

export default Panel

const Container = styled.p`
  padding: 10px;
  background-color: #FFC93F80;
`
const Main = styled.main`
  font-size: 1.5em;
  font-weight: bold;
`
const Title = styled.div``
const SubTitle = styled.div`
  font-size: 0.9em;
`
