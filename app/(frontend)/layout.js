// app/front/layout.js
import ProgressBar from '@/app/loadingcursor/ProgressBar'
import Navbar from './components/Navbar'


export default function FrontendLayout({ children }) {
  return (
    <div>
      <main>
        <Navbar />
  <ProgressBar />
        {children}
      </main>
    </div>
  )
}
