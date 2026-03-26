import { useState, useEffect } from 'react'
import Dashboard from './Dashboard.jsx'

const uid = () => `a${Date.now()}${Math.random().toString(36).slice(2, 6)}`
const initials = n => {
  const w = n.trim().split(/\s+/)
  return w.length > 1 ? (w[0][0] + w[1][0]).toUpperCase() : n.slice(0, 2).toUpperCase()
}

const blank = { name: '', server: '', accountId: '', password: '' }

/* ── Copy button ─────────────────────────────── */
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false)
  const go = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch { }
  }
  return (
    <button className="cbtn" onClick={go} style={{ color: ok ? '#34d399' : undefined }}>
      {ok ? '✓' : '⎘'}
    </button>
  )
}

/* ── Inline form panel ───────────────────────── */
function FormPanel({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(blank)
  const [err, setErr] = useState({})
  const [showPw, setShowPw] = useState(false)

  useEffect(() => { setForm(editing ? { ...editing } : blank); setErr({}) }, [editing])

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (err[k]) setErr(prev => ({ ...prev, [k]: false }))
  }

  const submit = e => {
    e.preventDefault()
    const e2 = {}
    if (!form.name.trim()) e2.name = true
    if (!form.server.trim()) e2.server = true
    if (!form.accountId.trim()) e2.accountId = true
    if (!form.password.trim()) e2.password = true
    if (Object.keys(e2).length) { setErr(e2); return }
    onSave(form)
  }

  return (
    <div className="admin-form-panel">
      <div className="afp-header">
        <div className="afp-title">
          {editing ? '📝 Edit Account' : '✚ Add New Account'}
        </div>
        <div className="afp-sub">{editing ? 'Update credentials below' : 'Register a new trading record'}</div>
      </div>

      <form onSubmit={submit} className="afp-body">
        {[
          { k: 'name', label: 'Account Name', icon: '👤', ph: 'e.g. My Prop Account' },
          { k: 'server', label: 'Server', icon: '🌐', ph: 'e.g. ICMarkets-Live01' },
          { k: 'accountId', label: 'Account ID', icon: '🔢', ph: 'e.g. 12  345678', mono: true },
        ].map(({ k, label, icon, ph, mono }) => (
          <div className="afp-group" key={k}>
            <label className="afp-label">{label}</label>
            <div className="fi-wrap">
              <span className="fi-icon">{icon}</span>
              <input
                className={`fi ${mono ? 'mono' : ''} ${err[k] ? 'err' : ''}`}
                placeholder={ph}
                value={form[k]}
                onChange={set(k)}
                autoComplete="off"
              />
            </div>
          </div>
        ))}

        <div className="afp-group">
          <label className="afp-label">Password</label>
          <div className="fi-wrap">
            <span className="fi-icon">🔑</span>
            <input
              type={showPw ? 'text' : 'password'}
              className={`fi mono ${err.password ? 'err' : ''}`}
              placeholder="Account password"
              value={form.password}
              onChange={set('password')}
              autoComplete="off"
            />
            <button type="button" className="fi-eye" onClick={() => setShowPw(v => !v)}>
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="add-modal-foot" style={{ paddingTop: 0, borderTop: 'none' }}>
          {editing && <button type="button" className="mbtn cancel" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="btn-add">
            {editing ? 'Save Changes' : 'Add Record'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ── Admin page ──────────────────────────────── */
export default function Admin({ accounts, refreshAccounts, toast, onGoUser }) {
  const [tab, setTab] = useState('cards') // 'cards' or 'manage'
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [delTarget, setDelTarget] = useState(null)
  const [showPw, setShowPw] = useState({})
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState(1)

  const togglePw = id => setShowPw(p => ({ ...p, [id]: !p[id] }))

  const handleSave = async (form) => {
    try {
      if (editing) {
        await updateAccount(editing.id, form)
        setEditing(null)
        toast('Account updated successfully', 's')
      } else {
        await createAccount(form)
        toast('New account added', 's')
      }
      refreshAccounts()
    } catch (err) {
      toast('Failed to save account', 'e')
    }
  }

  const doDelete = async (target) => {
    try {
      if (target === 'bulk') {
        await Promise.all(Array.from(selected).map(id => deleteAccount(id)))
        toast(`${selected.size} records deleted`, 'i')
        setSelected(new Set())
      } else {
        await deleteAccount(target.id)
        if (editing?.id === target.id) setEditing(null)
        toast('Account removed successfully', 'i')
      }
      refreshAccounts()
    } catch (err) {
      toast('Failed to delete record', 'e')
    }
    setDelTarget(null)
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSelect = id => setSelected(s => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  const filtered = accounts
    .filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.server.toLowerCase().includes(search.toLowerCase()) ||
      a.accountId.includes(search)
    )
    .sort((a, b) => {
      const av = (a[sortField] || '').toLowerCase()
      const bv = (b[sortField] || '').toLowerCase()
      return av < bv ? -sortDir : av > bv ? sortDir : 0
    })

  return (
    <div className={`admin-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* ── Sidebar Menu Bar ── */}
      <aside className="sidebar-menu-bar">
        <div className="sidebar-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="sr-logo">
            <i className="fas fa-chart-line" style={{color:'var(--accent)'}}></i>
            TradeVault
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-item ${tab === 'cards' ? 'active' : ''}`} 
            onClick={() => setTab('cards')}
          >
            <i className="fas fa-vault"></i>
            <span>Vault Overview</span>
          </button>
          <button 
            className={`sidebar-item ${tab === 'manage' ? 'active' : ''}`} 
            onClick={() => setTab('manage')}
          >
            <i className="fas fa-cog"></i>
            <span>Manage Records</span>
          </button>
          <button className="sidebar-item disabled">
            <i className="fas fa-chart-pie"></i>
            <span>Analytics</span>
            <small>SOON</small>
          </button>
          <button className="sidebar-item disabled">
            <i className="fas fa-bell"></i>
            <span>Alerts</span>
            <small>SOON</small>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
             <div className="user-avatar">AD</div>
             <div className="user-info">
                <div className="user-name">Admin User</div>
                <div className="user-role">Master Vault Access</div>
             </div>
          </div>
          <button className="sidebar-logout" onClick={onGoUser}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="admin-main">
        <header className="main-header">
          <div className="header-left" style={{display:'flex', alignItems:'center', gap:16}}>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
              <i className="fa-solid fa-bars" style={{color: 'rgb(99, 230, 190)'}}></i>
            </button>
            <h1 className="admin-page-title">
              {tab === 'cards' ? 'Vault Overview' : 'Manage Records'}
            </h1>
          </div>
          <div className="header-right">
            <div className="live-badge">
              <span className="live-dot"/>
              {accounts.length} Records
            </div>
          </div>
        </header>

        <div className="main-scroll">
          {tab === 'cards' ? (
            <div className="dash-container" style={{padding:0}}>
               <Dashboard accounts={accounts} refreshAccounts={refreshAccounts} toast={toast} />
            </div>
          ) : (
            <div className="admin-content-grid">
              <FormPanel editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

              <div className="admin-table-card">
                <div className="table-toolbar">
                  <div className="search-wrap">
                    <span>🔍</span>
                    <input
                      placeholder="Search master records..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  {selected.size > 0 && (
                    <button className="toolbar-btn danger" onClick={() => setDelTarget('bulk')}>
                      🗑️ Delete ({selected.size})
                    </button>
                  )}
                </div>

                <div className="table-scroll">
                  <table className="acc-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th onClick={() => setSortField('name')} style={{ cursor: 'pointer' }}>Account</th>
                        <th onClick={() => setSortField('server')} style={{ cursor: 'pointer' }}>Server</th>
                        <th>Credentials</th>
                        <th style={{ width: 100, textAlign: 'right' }}>Modify</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(acc => (
                        <tr key={acc.id} className={`tbl-row ${selected.has(acc.id) ? 'selected' : ''} ${editing?.id === acc.id ? 'editing' : ''}`}>
                          <td>
                            <input
                              type="checkbox"
                              className="tbl-check"
                              checked={selected.has(acc.id)}
                              onChange={() => toggleSelect(acc.id)}
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{acc.name}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--txt-dim)' }}>
                              {acc.server}
                              <CopyBtn text={acc.server} />
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: 'var(--accent)' }}>
                                {acc.accountId} <CopyBtn text={acc.accountId} />
                              </div>
                              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', opacity: 0.6 }}>
                                {showPw[acc.id] ? acc.password : '••••••••'}
                                <button className="cbtn" style={{ marginLeft: 4 }} onClick={() => togglePw(acc.id)}>
                                  {showPw[acc.id] ? '🙈' : '👁️'}
                                </button>
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button className="ibtn" onClick={() => setEditing(acc)}>✏️</button>
                              <button className="ibtn del" onClick={() => setDelTarget(acc)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {delTarget && (
        <div className="modal-overlay" onClick={() => setDelTarget(null)}>
          <div className="add-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="add-modal-head">
              <div className="add-modal-title">🗑️ Delete Account?</div>
              <div className="add-modal-sub">
                {delTarget === 'bulk'
                  ? `Are you sure you want to delete ${selected.size} accounts?`
                  : `Are you sure you want to delete "${delTarget.name}"?`}
                This action cannot be undone.
              </div>
            </div>
            <div className="add-modal-body" style={{ paddingTop: 0 }}>
              <div className="add-modal-foot">
                <button className="mbtn cancel" onClick={() => setDelTarget(null)}>Cancel</button>
                <button className="btn-add" style={{ background: '#f87171', color: '#fff' }} onClick={() => doDelete(delTarget)}>
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
