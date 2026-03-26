import { useState } from 'react'
import { loginAgent } from '../api'

export default function Login({ onLogin, onCancel }) {
  const [email, setEmail]       = useState('admin@tradevault.com')
  const [password, setPassword] = useState('1234')
  const [err, setErr]           = useState('')
  const [loading, setLoading]   = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    try {
      const data = await loginAgent(email, password)
      // Save token (mock JWT for now)
      sessionStorage.setItem('tv_token', data.access_token)
      onLogin()
    } catch (error) {
      setErr(error.response?.data?.detail || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" style={{background: 'var(--bg)'}}>
      <div className="add-modal" style={{maxWidth: 400, border: '1px solid var(--border-alt)'}}>
        <div className="add-modal-head" style={{textAlign: 'center', padding: '48px 40px 32px'}}>
          <div className="dash-title-ico" style={{margin: '0 auto 20px', width: 60, height: 60, fontSize: 32}}>🔐</div>
          <div className="add-modal-title" style={{justifyContent: 'center', fontSize: 24}}>Master Vault Login</div>
          <div className="add-modal-sub">Secure access to your trading credentials</div>
        </div>

        <form onSubmit={submit} className="add-modal-body" style={{padding: '0 40px 48px'}}>
          <div className="fg" style={{marginBottom: 20}}>
            <label className="fl">Administrator Email</label>
            <div className="fi-wrap">
              <span className="fi-icon">👤</span>
              <input 
                className="fi" 
                type="email" 
                placeholder="admin@tradevault.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="fg" style={{marginBottom: 24}}>
            <label className="fl">Vault Password</label>
            <div className="fi-wrap">
              <span className="fi-icon">🔑</span>
              <input 
                className="fi" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {err && <div style={{color: '#f87171', fontSize: 13, marginBottom: 20, textAlign: 'center'}}>{err}</div>}

          <div className="add-modal-foot" style={{borderTop: 'none', paddingTop: 0}}>
            <button type="button" className="mbtn cancel" onClick={onCancel} style={{flex: 1}}>Cancel</button>
            <button type="submit" className="btn-add" style={{flex: 2}} disabled={loading}>
              {loading ? 'Unlocking...' : 'Unlock Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
