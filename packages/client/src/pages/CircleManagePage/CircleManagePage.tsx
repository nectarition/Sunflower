import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SunflowerCircle } from 'sunflower'
import FormButton from '../../components/Form/FormButton'
import FormInput from '../../components/Form/FormInput'
import FormItem from '../../components/Form/FormItem'
import FormLabel from '../../components/Form/FormLabel'
import FormSection from '../../components/Form/FormSection'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import Panel from '../../components/parts/Panel'
import useCircle from '../../hooks/useCircle'
import useFile from '../../hooks/useFile'
import useSession from '../../hooks/useSession'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const CircleManagePage: React.FC = () => {
  const [file, setFile] = useState<File>()
  const { openAsText, data } = useFile()
  const { sessionCode } = useSession()
  const { createCirclesAsync, convertCodeDataByCircleCode } = useCircle()

  const [circles, setCircles] = useState<Record<string, SunflowerCircle>>()
  const [error, setError] = useState<string>()
  const [invalidRows, setInvalidRows] = useState<number[]>()

  const convertCircleDataByTSV = useCallback((tsv: string) => {
    if (!sessionCode) return
    setError(undefined)
    setInvalidRows(undefined)
    setCircles(undefined)

    const rowData = tsv.split('\n')
      .filter(row => row)
      .map(row => row.split('\t'))

    const invalidColumns = rowData
      .map((data, i) => ({ dataCount: data.length, rowNumber: i + 1 }))
      .filter(row => row.dataCount !== 3)
      .map(row => row.rowNumber)
    if (invalidColumns.length > 0) {
      setError('データの形式は「封筒コード\tスペース\tサークル名」である必要があります。')
      setInvalidRows(invalidColumns)
      return
    }

    const invalidSessionCodes = rowData
      .map((data, i) => ({ circleCode: data[0], rowNumber: i + 1 }))
      .filter(row => convertCodeDataByCircleCode(row.circleCode)?.sessionCode !== sessionCode)
      .map(row => row.rowNumber)
    if (invalidSessionCodes.length > 0) {
      setError('操作対象外のイベントコードが入力されています。')
      setInvalidRows(invalidSessionCodes)
      return
    }

    const data = rowData.reduce<Record<string, SunflowerCircle>>(
      (p, c) => ({ ...p, [c[0]]: {
        space: c[1],
        name: c[2]
      } }), {})
    return data
  }, [sessionCode])

  const applyCircles = useCallback(() => {
    if (!circles || !sessionCode) return
    if (!confirm('封筒データを適用します。※出欠データは上書きされます。\n操作を実行してよろしいですか？')) return

    createCirclesAsync(sessionCode, circles)
      .then(() => alert('反映しました'))
  }, [circles, sessionCode])

  useEffect(() => {
    if (!file) return
    openAsText(file)
  }, [file])

  useEffect(() => {
    if (!data) return
    const convertedCircle = convertCircleDataByTSV(data)
    if (!convertedCircle) return
    setCircles(convertedCircle)
  }, [data])

  return (
    <DefaultLayout title="封筒データ上書き">
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
            accept=".tsv"
            onChange={e => setFile(e.target.files?.[0])} />
        </FormItem>
      </FormSection>
      <p>
        <code>封筒コード\tスペース\tサークル名</code>の形式で作成したTSVファイルを選択してください。<br />
        データの作り方は「<Link to="/guide">ガイド</Link>」を参照してください。
      </p>

      {error && invalidRows &&
        <Panel color="danger" title={error} subTitle={`エラー箇所: ${invalidRows.map(row => `${row}行目`).join(', ')}`} />
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

export default CircleManagePage
