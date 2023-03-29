import { Link } from 'react-router-dom'

import DefaultLayout from '../components/Layouts/Default/DefaultLayout'
import Breadcrumbs from '../components/parts/Breadcrumbs'

const Guide: React.FC = () => (
  <DefaultLayout title="ガイド">
    <Breadcrumbs>
      <li><Link to="/">メニュー</Link></li>
    </Breadcrumbs>
    <h2>ガイド</h2>
    <p>
      ほげほげ
    </p>

    <h3>利用準備</h3>
    <p>
      ほげほげ
    </p>

    <h4>封筒データの作成</h4>
    <p>
      ほげほげ
    </p>

    <h3>操作方法</h3>

    <h4>出席登録</h4>
    <p>
      ほげほげ
    </p>

    <h4>出欠確認</h4>
    <p>
      ほげほげ
    </p>
  </DefaultLayout>
)

export default Guide
