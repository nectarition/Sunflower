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
import Panel from '../components/parts/Panel'

const Manage: React.FC = () => {
  const [file, setFile] = useState<File>()
  const { openAsText, data } = useFile()
  const { sessionCode } = useSession()
  const { createCircles } = useCircle()

  const [circles, setCircles] = useState<Record<string, SunflowerCircle>>()
  const [error, setError] = useState<string>()
  const [invalidRows, setInvalidRows] = useState<number[]>()

  const onChangeFile = () => {
    if (!file) return
    openAsText(file)
  }
  useEffect(onChangeFile, [file])

  const onChangeData = () => {
    if (!data) return
    const convertedCircle = convertCircleDataByCSV(data)
    if (!convertedCircle) return
    setCircles(convertedCircle)
  }
  useEffect(onChangeData, [data])

  const convertCircleDataByCSV: (csv: string) => Record<string, SunflowerCircle> | undefined =
    (csv) => {
      setError(undefined)

      const rowData = csv.split('\n')
        .filter(row => row)
        .map(row => row.split(','))

      const invalidRows = rowData
        .map((data, i) => ({ dataCount: data.length, rowNumber: i + 1 }))
        .filter(row => row.dataCount !== 3)
        .map(row => row.rowNumber)
      if (invalidRows.length) {
        setError('データの形式は「封筒コード,スペース,サークル名」である必要があります。')
        setInvalidRows(invalidRows)
        return
      }
      console.log(invalidRows)

      const data = rowData
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
    <DefaultLayout title="封筒データ上書き">
      <RequiredLogin />

      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h2>封筒データ上書き</h2>

      <Panel title="※注意" subTitle='既に存在する出欠データを上書きします。' />

      <FormSection>
        <FormItem>
          <FormLabel>封筒データ</FormLabel>
          <FormInput
            type="file"
            accept=".csv"
            onChange={e => setFile(e.target.files?.[0])} />
        </FormItem>
      </FormSection>
      <p>
        <code>封筒コード,スペース,サークル名</code>の形式で作成したCSVファイルを選択してください。<br />
        データの作り方は「ガイド」を参照してください。
      </p>

      {error && invalidRows &&
        <Panel color="danger" title={error} subTitle={`エラー箇所: ${invalidRows?.map(row => `${row}行目`).join(', ')}`} />
      }

      <h3>データ確認</h3>
      <p>{(circles && Object.keys(circles).length) ?? 0}件のデータを読み込みました。</p>
      {circles &&
        <>
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
