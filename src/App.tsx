import DebugPage from './debug/DebugPage'

function App() {
  if (window.location.pathname === '/debug') {
    return <DebugPage />
  }

  return (
    <div>
      <p>App ini akan berkembang di sesi berikutnya.</p>
    </div>
  )
}

export default App
