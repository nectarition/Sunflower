import { Link } from 'react-router-dom'
import Alert from '../../components/parts/Alert'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const GuidePage: React.FC = () => {
  return (
    <DefaultLayout title="ガイド">
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h1>ガイド</h1>

      <h3>利用準備</h3>
      <p>
        Soleil を使うためには、以下の準備が必要です。
      </p>
      <ol>
        <li>封筒コードの作成</li>
        <li>封筒データの作成</li>
        <li>封筒データの適用</li>
      </ol>

      <h4>STEP1: 封筒コードの作成</h4>
      <p>
        封筒コードは<code>&lt;イベントコード&gt;-&lt;4桁の連番&gt;</code>の体系で作成してください。<br />
        封筒コードの作成後、そのコードを内容としたQRコードを作成してください。
      </p>

      <Alert>
        例: イベントコードが<code>hogehoge</code>の場合 → <code>hogehoge-0001</code> ～ <code>hogehoge-9999</code>
      </Alert>

      <h4>STEP2: 封筒データの作成</h4>
      <p>
        以下の構造のデータを作成します。(\tはタブ文字)<br />
        <code>封筒コード\tスペース\tサークル名</code>
      </p>
      <Alert>
        <h5>例</h5>
        <pre>
          hogehoge-0001\tあ01a\tほげほげサークル<br />
          hogehoge-0002\tあ01b\tStudioふがふが<br />
          ︙
        </pre>
      </Alert>

      <h4>STEP3: 封筒データの適用</h4>
      <ul>
        <li>STEP2で作成した封筒データをTSV形式で保存します。</li>
        <li>「<Link to="/manage">封筒データ上書き</Link>」に移動し、先ほど作成したファイルを選択します。</li>
        <li>適用内容を確認し「反映する」ボタンを押します。</li>
      </ul>

      <h3>操作方法</h3>

      <h4>出席登録</h4>
      <ol>
        <li>「<Link to="/roll-call">出席登録</Link>」を開きます。</li>
      </ol>

      <h4>出欠確認</h4>
      <ol>
        <li>「<Link to="/records">出欠確認</Link>」を開きます。</li>
      </ol>
    </DefaultLayout>
  )
}

export default GuidePage
