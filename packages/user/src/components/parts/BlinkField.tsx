import styled from '@emotion/styled'
import Blink from '../keyframes/Blink.ts'

const BlinkField = styled.div`
  display: inline-block;
  min-width: 128px;
  width: 100%;
  height: 1em;
  animation: ${Blink} 0.5s ease-in-out alternate infinite;
`

export default BlinkField
