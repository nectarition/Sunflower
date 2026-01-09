import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import buttonStyle from '../mixins/buttonStyle'

const LinkButton = styled(Link)`
  ${buttonStyle}
`

export default LinkButton
