import { GearIcon, ListIcon, PencilIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import BlinkField from '../../components/parts/BlinkField'
import Breadcrumbs from '../../components/parts/Breadcrumbs'
import IconLabel from '../../components/parts/IconLabel'
import LinkButton from '../../components/parts/LinkButton'
import useEvent from '../../hooks/useEvent'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilEvent } from 'soleil'

const EventViewPage: React.FC = () => {
  const { code } = useParams()

  const { getEventByCodeAsync } = useEvent()

  const [event, setEvent] = useState<SoleilEvent>()

  useEffect(() => {
    if (!code) return

    const abort = new AbortController()

    getEventByCodeAsync(code, abort)
      .then(setEvent)
      .catch(err => { throw err })

    return () => abort.abort()
  }, [code, getEventByCodeAsync])

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <li><Link to="/">メニュー</Link></li>
      </Breadcrumbs>
      <h1>{event?.name ?? <BlinkField />}</h1>

      <FormSection>
        <FormItem>
          <LinkButton
            size="large"
            to={`/events/${code}/roll-call`}>
            <IconLabel
              icon={<PencilIcon />}
              label={<>出席登録<small>を行う</small></>} />
          </LinkButton>
        </FormItem>
        <FormItem>
          <LinkButton
            size="large"
            to={`/events/${code}/records`}>
            <IconLabel
              icon={<ListIcon />}
              label={<>出席簿<small>を見る</small></>} />
          </LinkButton>
        </FormItem>
      </FormSection>

      <FormSection>
        <FormItem $inlined>
          <LinkButton
            $inlined
            to={`/events/${code}/manage`}>
            <IconLabel
              icon={<GearIcon />}
              label="封筒データ設定" />
          </LinkButton>
        </FormItem>
      </FormSection>
    </DefaultLayout>
  )
}

export default EventViewPage
