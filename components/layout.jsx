// components/layout.js

import Top from './top'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>  
        <Top />
        <main >{children}</main>
        <Footer />
    
    </>
  )
}