import styled from 'styled-components'
import DefaultLayout from '../components/Layouts/Default/DefaultLayout'

import RequiredLogin from '../libs/RequiredLogin'

const List: React.FC = () => {
  return (
    <DefaultLayout>
      <RequiredLogin />
      List
    </DefaultLayout>
  )
}

export default List
