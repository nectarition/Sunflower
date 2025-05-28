import { ListIcon, PencilIcon } from '@phosphor-icons/react'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import LinkButton from '../../components/parts/LinkButton'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'

const IndexPage: React.FC = () => {
  return (
    <DefaultLayout>
      <h1>メニュー</h1>

      <FormSection>
        <FormItem>
          <LinkButton to="/roll-call" size="large">
            <IconLabel
              label={<>出席登録<small>を行う</small></>}
              icon={<PencilIcon />} />
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton to="/records" size="large">
            <IconLabel
              label={<>出席簿<small>を見る</small></>}
              icon={<ListIcon />} />
          </LinkButton>
        </FormItem>
      </FormSection>

      <h3>管理</h3>
      <FormSection>
        <FormItem>
          <LinkButton to="/guide" color="default">
            利用ガイド<small>を見る</small>
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton to="/manage" color="default">
            封筒コード管理
          </LinkButton>
        </FormItem>
      </FormSection>
    </DefaultLayout>
  )
}

export default IndexPage
