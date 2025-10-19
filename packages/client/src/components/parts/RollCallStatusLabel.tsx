import { useMemo } from 'react'
import styled from 'styled-components'
import { CheckIcon, HourglassIcon, PencilSlashIcon, WarningIcon } from '@phosphor-icons/react'
import IconLabel from './IconLabel'
import type { RollCallProcessStatus } from 'soleil'

interface Props {
  status: RollCallProcessStatus | null | undefined
}
const RollCallStatusLabel: React.FC<Props> = props => {
  const status = useMemo(() => {
  
    switch (props.status) {
      case 1:
        return {
          className: 'success',
          text: '完了',
          icon: <CheckIcon />
        }
      case 2:
        return {
          className: 'error',
          text: 'エラー',
          icon: <WarningIcon />
        }
      default:
        return {
          className: 'pending',
          text: '処理中',
          icon: <HourglassIcon />
        }
    }
  }, [props.status])
  
  return (
    status
      ? <Container className={status.className}>
        <IconLabel
          icon={status.icon}
          label={status.text} />
      </Container>
      : null
  )
}

export default RollCallStatusLabel

const Container = styled.span`
  display: inline-block;
  padding: 3px 6px;
  border-radius: 5px;
  font-weight: 500;
  color: #fff;

  &.success {
    border: 1px solid #2b9a45;
    color: #2b9a45;
    background-color: #e2f3e6;
  }

  &.error {
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
