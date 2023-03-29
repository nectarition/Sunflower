import { useEffect, useState } from 'react'
import styled from 'styled-components'
import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import useSound from 'use-sound'
import OKSound from '../assets/se/ok.mp3'
// import NGSound from '../assets/se/ng.mp3'

import RequiredLogin from '../libs/RequiredLogin'
import useQRReader from '../hooks/useQRReader'

import Panel from '../components/parts/Panel'
import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import FormButton from '../components/Form/FormButton'

const Register: React.FC = () => {
  const { data, QRReaderComponent } = useQRReader()

  const [playSEOK] = useSound(OKSound)
  // const [playSENG] = useSound(NGSound)

  const [prevData, setPrevData] = useState<string>()
  const [history, setHistory] = useState<string[]>()

  const [isActive, setActive] = useState(false)

  const onChangeReadData: () => void =
    () => {
      if (!data) return
      console.log('hello')
      playSEOK()

      if (data === prevData) return
      setPrevData(data)
      setHistory(s => (s ? [...s, data] : [data]))
    }
  useEffect(onChangeReadData, [data])

  return (
    <DefaultLayout>
      <RequiredLogin />
      <Layout>
        <Column>
          <h2>出席登録</h2>
          {isActive && <>
            <p>
              封筒のQRコードを読み取ってください
            </p>
            <ReaderWrap>
              <QRReaderComponent />
            </ReaderWrap>
            <Panel title='読み取り結果'>
              {data ?? '待機中'}
            </Panel>
          </>}
          <FormSection>
            <FormItem>
              <FormButton onClick={() => setActive(s => !s)}>読み取りを{isActive ? '終了' : '開始'}</FormButton>
            </FormItem>
          </FormSection>
        </Column>
        <Column>
          <h2>読み込み履歴</h2>
          <ul>
            {history?.map((his, i) => <li key={i}>{his}</li>)}
          </ul>
        </Column>
      </Layout>
    </DefaultLayout>
  )
}

export default Register

const Layout = styled.section`
  display: grid;
  grid-template-columns: 60% 1fr;
  gap: 40px;

  @media screen and (max-width: 840px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
    gap: 20px;
  }
`
const ReaderWrap = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
const Column = styled.section``
