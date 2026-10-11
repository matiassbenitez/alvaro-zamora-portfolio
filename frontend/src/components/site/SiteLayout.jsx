import { Outlet } from 'react-router-dom'
import SiteProvider from './SiteProvider.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function SiteLayout() {
  return (
    <SiteProvider>
      {({ site, services, projects, loading }) => (
        <div className="flex min-h-screen flex-col">
          <Header
            brandName={site?.brandName}
            brandTagline={site?.brandTagline}
            logoText={site?.logoText}
          />
          <main className="flex-1">
            <Outlet context={{ site, services, projects, loading }} />
          </main>
          <Footer site={site} />
        </div>
      )}
    </SiteProvider>
  )
}
