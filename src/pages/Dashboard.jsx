import { useState } from 'react'
import { createAccount, deleteAccount } from '../api'

const initials = n => {
  const w = n.trim().split(/\s+/)
  return w.length > 1 ? (w[0][0]+w[1][0]).toUpperCase() : n.slice(0,2).toUpperCase()
}
const blank = { name:'', server:'', accountId:'', password:'' }

/* ── Copy button ─────────────────────────────── */
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false)
  const go = async () => {
    try { 
      await navigator.clipboard.writeText(text); 
      setOk(true); 
      setTimeout(()=>setOk(false), 2000);
    } catch{}
  }
  return (
    <button className={`cbtn ${ok?'ok':''}`} onClick={go} title="Copy">
      {ok ? '✓' : '⎘'}
    </button>
  )
}

/* ── Premium Account Card ────────────────────── */
function AccCard({ acc, idx, onDelete }) {
  const [showPw, setShowPw] = useState(false)
  const [copied, setCopied] = useState('')

  const quickCopy = async (text, label) => {
    try { 
      await navigator.clipboard.writeText(text); 
      setCopied(label); 
      setTimeout(()=>setCopied(''), 2000);
    } catch{}
  }

  return (
    <div className="acard" style={{animationDelay: `${idx * 0.1}s`}}>
      <div className="acard-sheen"/>
      <div className="acard-top">
        <div className="acard-avatar">{initials(acc.name)}</div>
        <div className="acard-meta">
          <div className="acard-name">{acc.name}</div>
          <div className="acard-server">🌐 {acc.server}</div>
        </div>
        <div className="acard-actions">
          <button className="acard-btn del" onClick={()=>onDelete(acc)} title="Delete">🗑️</button>
        </div>
      </div>

      <div className="acard-fields">
        <div className="acard-field">
          <div className="acard-field-label">Account ID</div>
          <div className="acard-field-value">
            <span className="accent-val">{acc.accountId}</span>
            <CopyBtn text={acc.accountId}/>
          </div>
        </div>

        <div className="acard-field">
          <div className="acard-field-label">Password</div>
          <div className="acard-field-value">
            <span style={{letterSpacing:showPw?'normal':'4px', opacity:showPw?1:0.4, fontSize: showPw?'14px':'16px'}}>
              {showPw ? acc.password : '••••••••'}
            </span>
            <div style={{display:'flex', gap: 6}}>
              <button className="cbtn" onClick={()=>setShowPw(v=>!v)}>
                {showPw ? '🙈' : '👁️'}
              </button>
              {showPw && <CopyBtn text={acc.password}/>}
            </div>
          </div>
        </div>
      </div>

      <div className="acard-footer">
        <button className={`acard-qcopy ${copied==='ID'?'ok':''}`} onClick={()=>quickCopy(acc.accountId,'ID')}>
          {copied==='ID' ? '✓ Copied ID' : '⎘ Copy ID'}
        </button>
        <button className={`acard-qcopy ${copied==='PW'?'ok':''}`} onClick={()=>quickCopy(acc.password,'PW')}>
          {copied==='PW' ? '✓ Copied PW' : '⎘ Copy PW'}
        </button>
      </div>
    </div>
  )
}

/* ── Add Account Modal ───────────────────────── */
function AddModal({ onSave, onClose }) {
  const [form, setForm] = useState(blank)
  const [err, setErr]   = useState({})
  const [showPw, setShowPw] = useState(false)

  const set = k => e => {
    setForm(f=>({...f,[k]:e.target.value}))
    if(err[k]) setErr(prev=>({...prev,[k]:false}))
  }

  const submit = e => {
    e.preventDefault()
    const e2={}
    if(!form.name.trim())      e2.name=true
    if(!form.server.trim())    e2.server=true
    if(!form.accountId.trim()) e2.accountId=true
    if(!form.password.trim())  e2.password=true
    if(Object.keys(e2).length){ setErr(e2); return }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e=>e.stopPropagation()}>
        <div className="add-modal-head">
          <div className="add-modal-title">✚ Add New Account</div>
          <div className="add-modal-sub">Credentials are secure in the cloud vault.</div>
        </div>

        <form onSubmit={submit} className="add-modal-body">
          {[
            {k:'name',      label:'Account Name', icon:'👤', ph:'e.g. My Prop Account' },
            {k:'server',    label:'Server',        icon:'🌐', ph:'e.g. ICMarkets-Live01' },
            {k:'accountId', label:'Account ID',    icon:'🔢', ph:'e.g. 12345678', mono:true },
          ].map(({k,label,icon,ph,mono})=>(
            <div className="fg" key={k}>
              <label className="fl">{label}</label>
              <div className="fi-wrap">
                <span className="fi-icon">{icon}</span>
                <input
                  className={`fi ${mono?'mono':''} ${err[k]?'err':''}`}
                  placeholder={ph}
                  value={form[k]}
                  onChange={set(k)}
                  autoComplete="off"
                />
              </div>
            </div>
          ))}

          <div className="fg">
            <label className="fl">Password</label>
            <div className="fi-wrap">
              <span className="fi-icon">🔑</span>
              <input
                type={showPw?'text':'password'}
                className={`fi mono ${err.password?'err':''}`}
                placeholder="Account password"
                value={form.password}
                onChange={set('password')}
                autoComplete="off"
              />
              <button type="button" className="fi-eye" onClick={()=>setShowPw(v=>!v)}>
                {showPw?'🙈':'👁️'}
              </button>
            </div>
          </div>

          <div className="add-modal-foot">
            <button type="button" className="mbtn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-add">Save Account</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Dashboard page ──────────────────────────── */
export default function Dashboard({ accounts, refreshAccounts, toast }) {
  const [search,     setSearch]     = useState('')
  const [showModal,  setShowModal]  = useState(false)
  const [delTarget,  setDelTarget]  = useState(null)

  const handleSave = async (form) => {
    try {
      await createAccount(form)
      toast('Account added ✨', 's')
      refreshAccounts()
    } catch (err) {
      toast('Failed to add account', 'e')
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteAccount(delTarget.id)
      toast('Account deleted', 'i')
      refreshAccounts()
    } catch (err) {
      toast('Failed to delete account', 'e')
    }
    setDelTarget(null)
  }

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.server.toLowerCase().includes(search.toLowerCase()) ||
    a.accountId.includes(search)
  )

  return (
    <div className="dash-container">
      {/* ── Menu bar ── */}
      <div className="dash-menubar">
        <div className="dash-menubar-left">
          <div className="dash-title-row">
            <span className="dash-title-ico">💼</span>
            <div>
              <div className="dash-title">Trading Accounts</div>
              <div className="dash-sub">{accounts.length} registered</div>
            </div>
          </div>
        </div>

        <div className="dash-menubar-right">
          <div className="dash-search">
            <span style={{color:'rgba(255,255,255,0.3)',fontSize:14}}>🔍</span>
            <input
              placeholder="Search accounts…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>

          <button className="btn-add-new" onClick={()=>setShowModal(true)}>
            <span>✚</span> Add Account
          </button>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="acc-panel">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-ico">{search ? '🔍' : '📭'}</div>
            <h3>{search ? 'No results' : 'No accounts yet'}</h3>
            <p>{search ? 'Try another keyword.' : 'Click "Add Account" to get started.'}</p>
          </div>
        ) : (
          <div className="acard-grid">
            {filtered.map((acc, i) => (
              <AccCard
                key={acc.id}
                acc={acc}
                idx={i}
                onDelete={setDelTarget}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && <AddModal onSave={handleSave} onClose={()=>setShowModal(false)}/>}

      {delTarget && (
        <div className="modal-overlay" onClick={()=>setDelTarget(null)}>
          <div className="add-modal" style={{maxWidth:380}} onClick={e=>e.stopPropagation()}>
            <div className="add-modal-head" style={{paddingBottom:0}}>
              <div className="add-modal-title">🗑️ Delete Account?</div>
            </div>
            <div className="add-modal-body">
              <p style={{fontSize:13, color:'var(--txt-dim)', lineHeight:1.6, marginBottom:20}}>
                Are you sure you want to delete <strong>{delTarget.name}</strong>?
              </p>
              <div className="add-modal-foot">
                <button className="mbtn cancel" style={{flex:1}} onClick={()=>setDelTarget(null)}>Cancel</button>
                <button className="btn-add" style={{background:'#f87171', color:'#fff', flex:1}} onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
