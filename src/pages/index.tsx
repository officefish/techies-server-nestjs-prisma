import { NextPageWithLayout } from '@client/utilities/layout.types'
import Layout from '@client/components/layout/Layout'
import Home from '@client/components/screens/home'

import Providers from '@client/providers'

const HomePage: NextPageWithLayout = () => {
  return <Home />
}
export default HomePage

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Providers themeProps={HomePage.theme}>
      <Layout title="Home" description="Resent posts.">
        {page}
      </Layout>
    </Providers>
  )
}

HomePage.theme = {
  themes: ['daisy', 'cmyk'],
}
