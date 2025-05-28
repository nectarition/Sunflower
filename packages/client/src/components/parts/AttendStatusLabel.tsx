import { useMemo } from 'react'
import styled from 'styled-components'
import { CheckIcon, HourglassIcon, PencilSlashIcon } from '@phosphor-icons/react'
import { SoleilCircleStatus } from 'sunflower'
import IconLabel from './IconLabel'

interface Props {
  status: SoleilCircleStatus | null | undefined
}
const AttendStatusLabel: React.FC<Props> = props => {
  const status = useMemo(() => {
  
    switch (props.status) {
      case 1:
        return {
          className: 'attended',
          text: '出席',
          icon: <CheckIcon />
        }
      case 2:
        return {
          className: 'absent',
          text: '欠席',
          icon: <PencilSlashIcon />
        }
      default:
        return {
          className: 'pending',
          text: '未提出',
          icon: <HourglassIcon />
        }
    }
  }, [props.status])
  
  return (
    status
      ? <Container className={status.className}>
        <IconLabel icon={status.icon} label={status.text} />
      </Container>
      : null
  )
}

export default AttendStatusLabel

const Container = styled.span`
  display: inline-block;
  padding: 3px 6px;
  border-radius: 5px;
  font-weight: 500;
  color: #fff;

  &.attended {
    border: 1px solid #2b9a45;
    color: #2b9a45;
    background-color: #e2f3e6;
  }

  &.absent {
    border: 1px solid #dc3545;
    color: #dc3545;
    background-color: #fbe2e4;
  }

  &.pending {
    border: 1px solid #808080;
    color: #808080;
    background-color: #f0f0f0;
  }
`
