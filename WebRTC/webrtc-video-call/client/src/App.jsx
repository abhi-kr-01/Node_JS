import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Link, Outlet } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* Navigation Bar */}
        <nav style={{ padding: '1rem', backgroundColor: '#f4f4f4', display: 'flex', gap: '1rem' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/call">Video-chat</Link>
        </nav>

        {/* Dynamic Content Area */}
        <main style={{ padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
      
    </>
  )
}

export default App
