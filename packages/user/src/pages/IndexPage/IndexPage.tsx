import { SignInIcon } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import FormCheckbox from '../../components/Form/FormCheckbox'
import FormItem from '../../components/Form/FormItem'
import FormSection from '../../components/Form/FormSection'
import IconLabel from '../../components/parts/IconLabel'
import LinkButton from '../../components/parts/LinkButton'
import useDate from '../../hooks/useDate'
import useEvent from '../../hooks/useEvent'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilEvent } from 'soleil'

const IndexPage: React.FC = () => {
  const { getEventsAsync } = useEvent()
  const { formatDate, convertDateOnly } = useDate()

  const [events, setEvents] = useState<SoleilEvent[]>()
  const [isVisiblePastEvents, setIsVisiblePastEvents] = useState(false)

  const filteredEvents = useMemo(() => {
    if (!events) return
    return events.filter(e => isVisiblePastEvents || convertDateOnly(e.date) >= convertDateOnly(new Date()))
  }, [events, isVisiblePastEvents])

  useEffect(() => {
    const abort = new AbortController()
    getEventsAsync(abort)
      .then(setEvents)
      .catch(err => { throw err })
    return () => abort.abort()
  }, [getEventsAsync])

  return (
    <DefaultLayout>
      <h2>イベントを選択してください</h2>

      <FormSection>
        <FormItem>
          <FormCheckbox
            checked={isVisiblePastEvents}
            inlined
            label="過去のイベントを表示"
            name="isVisiblePastEvent"
            onChange={setIsVisiblePastEvents} />
        </FormItem>
      </FormSection>

      <table>
        <thead>
          <tr>
            <th>開催日</th>
            <th>イベント</th>
            <th>イベントコード</th>
            <th>組織</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events === undefined && (
            <tr>
              <td colSpan={4}>読み込み中…</td>
            </tr>
          )}
          {events?.length === 0 && (
            <tr>
              <td colSpan={4}>イベントが登録されていません。</td>
            </tr>
          )}
          {filteredEvents?.map((event) => (
            <tr key={event.code}>
              <td>{formatDate(event.date)}</td>
              <td>{event.name}</td>
              <td>{event.code}</td>
              <td>{event.organization.name}</td>
              <td>
                <LinkButton
                  $inlined
                  to={`/events/${event.code}`}>
                  <IconLabel
                    icon={<SignInIcon />}
                    label="開く" />
                </LinkButton></td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultLayout>
  )
}

export default IndexPage
