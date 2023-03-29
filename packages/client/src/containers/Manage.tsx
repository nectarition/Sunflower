import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SunflowerCircle } from 'sunflower'

import useFile from '../hooks/useFile'
import useCircle from '../hooks/useCircle'
import useSession from '../hooks/useSession'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'
import RequiredLogin from '../libs/RequiredLogin'

import FormSection from '../components/Form/FormSection'
import FormItem from '../components/Form/FormItem'
import FormLabel from '../components/Form/FormLabel'
import FormInput from '../components/Form/FormInput'
import FormButton from '../components/Form/FormButton'
import Breadcrumbs from '../components/parts/Breadcrumbs'

const Manage: React.FC = () => {
  const [file, setFile] = useState<File>()
  const { openAsText, data } = useFile()
  const { sessionCode } = useSession()
  const { createCircles } = useCircle()

  const [circles, setCircles] = useState<Record<string, SunflowerCircle>>()

  const onChangeFile = () => {
    if (!file) return
    openAsText(file)
  }
  useEffect(onChangeFile, [file])

  const onChangeData = () => {
    if (!data) return
    var convertedCircle = convertCircleDataByCSV(data)
    setCircles(convertedCircle)
  }
  useEffect(onChangeData, [data])

  const convertCircleDataByCSV: (csv: string) => Record<string, SunflowerCircle> =
    (csv) => {
      const rows = csv.split('\n')
      const data = rows
        .filter(row => row)
        .map(row => row.split(','))
        .reduce<Record<string, SunflowerCircle>>((p, c) => ({
          ...p,
          [c[0]]: {
            space: c[1],
            name: c[2]
          }
        }), {})
      return data
    }

  const applyCircles: () => void =
    () => {
      if (!circles || !sessionCode) return
      createCircles(sessionCode, circles)
        .then(() => alert('反映しました'))
    }

  return (
    <DefaultLayout>
      <RequiredLogin />

      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h2>封筒データ管理</h2>

      <FormSection>
        <FormItem>
          <FormLabel>封筒データ</FormLabel>
          <FormInput
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files?.[0])} />
        </FormItem>
      </FormSection>

      {circles &&
        <>
          <h3>データ確認</h3>
          <p>{Object.keys(circles).length}件のデータを読み込みました。</p>
          <FormSection>
            <FormItem>
              <FormButton onClick={applyCircles}>反映する</FormButton>
            </FormItem>
          </FormSection>
          <table>
            <thead>
              <tr>
                <th>封筒コード</th>
                <th>スペース</th>
                <th>サークル名</th>
              </tr>
            </thead>
            <tbody>
              {
                circles && Object.entries(circles).map(([co, ci]) => <tr key={co}>
                  <td>{co}</td>
                  <td>{ci.space}</td>
                  <td>{ci.name}</td>
                </tr>)
              }
            </tbody>
          </table>
        </>
      }
    </DefaultLayout>
  )
}

export default Manage
