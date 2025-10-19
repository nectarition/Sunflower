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
          <LinkButton
            size="large"
            to="/roll-call">
            <IconLabel
              icon={<PencilIcon />}
              label={<>出席登録<small>を行う</small></>} />
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton
            size="large"
            to="/records">
            <IconLabel
              icon={<ListIcon />}
              label={<>出席簿<small>を見る</small></>} />
          </LinkButton>
        </FormItem>
      </FormSection>

      <h3>管理</h3>
      <FormSection>
        <FormItem>
          <LinkButton
            color="default"
            to="/guide">
            利用ガイド<small>を見る</small>
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton
            color="default"
            to="/manage">
            封筒コード管理
          </LinkButton>
        </FormItem>
      </FormSection>
    </DefaultLayout>
  )
}

export default IndexPage
