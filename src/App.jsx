import { useState, useCallback, useEffect } from 'react'
import './index.css'
import { getAccounts } from './api'
import Dashboard from './pages/Dashboard.jsx'
import Admin     from './pages/Admin.jsx'
import Landing   from './pages/Landing.jsx'
import Login     from './pages/Login.jsx'

function Toaster({ list }) {
  return (
    <div className="toaster">
      {list.map(t=>(
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type==='s'?'✅':t.type==='e'?'❌':'ℹ️'}</span>{t.msg}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [accounts, setAccounts] = useState([])
  const [toasts, setToasts] = useState([])
  const [view, setView]     = useState('user') // 'user', 'login', 'admin'
  const [isLogged, setIsLogged] = useState(false)

  const refreshAccounts = useCallback(async () => {
    try {
      const data = await getAccounts()
      setAccounts(data)
    } catch (err) {
      console.error('Failed to fetch accounts:', err)
    }
  }, [])

  useEffect(() => {
    refreshAccounts()
  }, [refreshAccounts])

  const toast = useCallback((msg, type='s') => {
    const id = Date.now()
    setToasts(t=>[...t,{id,msg,type}])
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 2800)
  }, [])

  const handleLogin = () => {
    setIsLogged(true)
    setView('admin')
    toast('Access Granted: Master Vault Unlocked', 's')
  }

  const handleLogout = () => {
    setIsLogged(false)
    setView('user')
    toast('Vault Protected: Session Ended', 'i')
  }

  return (
    <>
      {view === 'user' && (
        <Landing 
          accounts={accounts} 
          refreshAccounts={refreshAccounts} 
          toast={toast} 
          onGoAdmin={() => setView('login')} 
        />
      )}
      
      {view === 'login' && (
        <Login 
          onLogin={handleLogin}
          onCancel={() => setView('user')}
        />
      )}

      {view === 'admin' && (
        <Admin 
          accounts={accounts} 
          refreshAccounts={refreshAccounts} 
          toast={toast} 
          onGoUser={handleLogout} 
        />
      )}
      
      <Toaster list={toasts}/>
    </>
  )
}
