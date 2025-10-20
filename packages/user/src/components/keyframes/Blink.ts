import { keyframes } from '@emotion/react'

const Blink = keyframes`
  0% {
    background-color: var(--brand-blink-keyframe-1);
  }
  100% {
    background-color: var(--brand-blink-keyframe-2);
  }
`

export default Blink
