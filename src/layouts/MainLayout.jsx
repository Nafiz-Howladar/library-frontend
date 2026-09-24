import Navbar from '../components/Navbar.jsx'

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="site-main">{children}</main>
      <footer className="site-footer">A welcoming place for every reader.</footer>
    </>
  )
}

export default MainLayout
