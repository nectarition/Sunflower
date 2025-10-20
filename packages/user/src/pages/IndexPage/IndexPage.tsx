import { SignInIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IconLabel from '../../components/parts/IconLabel'
import LinkButton from '../../components/parts/LinkButton'
import useEvent from '../../hooks/useEvent'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import type { SoleilEvent } from 'soleil'

const IndexPage: React.FC = () => {
  const { getEventsAsync } = useEvent()

  const [events, setEvents] = useState<SoleilEvent[]>()

  useEffect(() => {
    const abort = new AbortController()
    getEventsAsync(abort)
      .then(setEvents)
      .catch(err => { throw err })
    return () => abort.abort()
  }, [getEventsAsync])

  return (
    <DefaultLayout>
      <h1>イベントを選択してください</h1>

      <table>
        <thead>
          <tr>
            <th>イベント</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events === undefined && (
            <tr>
              <td colSpan={2}>読み込み中…</td>
            </tr>
          )}
          {events?.length === 0 && (
            <tr>
              <td colSpan={2}>イベントが登録されていません。</td>
            </tr>
          )}
          {events?.map((event) => (
            <tr key={event.code}>
              <td>{event.name}</td>
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
