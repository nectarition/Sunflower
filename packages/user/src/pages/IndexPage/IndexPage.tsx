import { SignInIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
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
      <h2>イベントを選択してください</h2>

      <table>
        <thead>
          <tr>
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
          {events?.map((event) => (
            <tr key={event.code}>
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
