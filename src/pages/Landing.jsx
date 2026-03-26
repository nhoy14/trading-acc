import { useEffect, useState } from 'react';
import '../landing.css';

export default function Landing({ accounts, refreshAccounts, toast, onGoAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll Reveal Logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Magnetic Card Effect... (keep existing)
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.sr-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="sr-wrap">
      <div className="sr-blob"></div>
      
      {/* ── Mobile Menu Overlay ── */}
      <div className={`sr-mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
           <div className="sr-logo"><i className="fas fa-chart-line" style={{color:'var(--accent)'}}></i> TradeVault</div>
           <button className="menu-close" onClick={() => setIsMenuOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="mobile-menu-links">
           <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
           <a href="#solution" onClick={() => setIsMenuOpen(false)}>Security</a>
           <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
           <a href="#blog" onClick={() => setIsMenuOpen(false)}>Insights</a>
           <button onClick={onGoAdmin} className="sr-btn" style={{marginTop:20}}>Login to Vault</button>
        </div>
      </div>

      <div className="sr-container">
        {/* ── Navbar ── */}
        <nav className="sr-nav">
          <div className="sr-logo">
            <i className="fas fa-chart-line" style={{fontSize:24, color:'var(--accent)'}}></i>
            TradeVault
          </div>
          <div className="sr-nav-links">
            <a href="#home">Home</a>
            <a href="#solution">Security</a>
            <a href="#pricing">Upgrade</a>
            <button onClick={onGoAdmin} className="nav-btn-link">Login</button>
          </div>
          <div className="sr-nav-auth">
            <div className="live-badge" style={{marginRight:16}}>
              <span className="live-dot"/>
              {accounts.length} Account{accounts.length!==1?'s':''}
            </div>
            <button className="sr-btn"><i className="fas fa-crown" style={{marginRight:8}}></i> Premium</button>
          </div>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
            <i className="fa-solid fa-bars" style={{color: 'rgb(99, 230, 190)'}}></i>
          </button>
        </nav>

        {/* ── Hero ── */}
        <section className="sr-hero" id="home">
          <div className="sr-hero-content">
            <div className="sr-badge">
              <span className="dot"></span> 100% LOCAL STORAGE SECURED
            </div>
            <h1>The Professional Way to Manage Vaults</h1>
            <p className="sr-subtitle" style={{marginBottom: 40}}>
              TradeVault provides a premium, high-end environment for your trading credentials. 
              Zero database leaks, zero cloud risk. All data stays on your device.
            </p>
            <div style={{display:'flex', gap:16}}>
              <button onClick={onGoAdmin} className="sr-btn">Access Master Vault</button>
              <a href="#about" className="sr-btn-outline" style={{textDecoration:'none', display:'flex', alignItems:'center'}}>Learn More</a>
            </div>
          </div>
          <div className="sr-hero-visual" style={{display:'flex',justifyContent:'center'}}>
            <div className="sr-hero-robot-wrap">
                <img 
                  src="/assets/ai_robot_trader.png" 
                  alt="AI Robot Trader" 
                  className="sr-hero-robot"
                />
              <div className="sr-robot-glow"></div>
            </div>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <div className="sr-stats">
          <div className="sr-stat-item">
            <div className="sr-stat-val">{accounts.length}</div>
            <div className="sr-stat-lbl">Active Accounts</div>
          </div>
          <div className="sr-stat-div"/>
          <div className="sr-stat-item">
            <div className="sr-stat-val">∞</div>
            <div className="sr-stat-lbl">Local Security</div>
          </div>
          <div className="sr-stat-div"/>
          <div className="sr-stat-item">
            <div className="sr-stat-val" style={{color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8}}>
              0 <span style={{fontSize: 12, opacity: 0.6}}>(SECURED)</span>
            </div>
            <div className="sr-stat-lbl">Cloud Breaches</div>
          </div>
        </div>

        {/* ── Features ── */}
        <section className="sr-section reveal">
          <div className="sr-badge delay-1"><span className="dot"/> CORE SYSTEMS</div>
          <h2 className="sr-title delay-2">Professional Infrastructure</h2>
          <div className="sr-feat-grid">
            <div className="sr-card reveal delay-1">
              <div className="sr-card-icon"><i className="fas fa-shield-halved"></i></div>
              <h3 className="sr-card-title">AES-256 Local Encryption</h3>
              <p className="sr-card-desc">Your credentials never leave your device. All data is encrypted locally with military-grade standards.</p>
            </div>
            <div className="sr-card reveal delay-2">
              <div className="sr-card-icon"><i className="fas fa-bolt"></i></div>
              <h3 className="sr-card-title">Instant Access Vault</h3>
              <p className="sr-card-desc">One-click copy and secure viewing. Manage hundreds of accounts without breaking your workflow.</p>
            </div>
            <div className="sr-card reveal delay-3">
              <div className="sr-card-icon"><i className="fas fa-network-wired"></i></div>
              <h3 className="sr-card-title">Proprietary Sync v2</h3>
              <p className="sr-card-desc">Seamlessly sync your encrypted vault across all your trading terminals in real-time.</p>
            </div>
          </div>
        </section>


        {/* ── Benefits Split ── */}
        <section className="sr-section reveal" id="solution">
          <div className="sr-split">
            {/* Left stack */}
            <div className="sr-ben-list reveal delay-1">
              <div className="sr-ben-item reveal delay-1">
                 <div className="sr-ben-item-ico"><i className="fas fa-star"></i></div>
                 <div>
                   <div className="sr-ben-dt">Rewards</div>
                   <div className="sr-ben-dd">The best credit cards offer some tantalizing combinations of promotions and prizes.</div>
                 </div>
              </div>
              <div className="sr-ben-item reveal delay-2" style={{borderColor:'rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.04)'}}>
                 <div className="sr-ben-item-ico" style={{color:'#000',background:'#fff'}}><i className="fas fa-lock"></i></div>
                 <div>
                   <div className="sr-ben-dt">100% Secured</div>
                   <div className="sr-ben-dd">Your credentials never leave your device with TradeVault encryption.</div>
                 </div>
              </div>
              <div className="sr-ben-item reveal delay-3">
                 <div className="sr-ben-item-ico"><i className="fas fa-sync"></i></div>
                 <div>
                   <div className="sr-ben-dt">Instant Sync</div>
                   <div className="sr-ben-dd">Real-time synchronization across all your trading terminals.</div>
                 </div>
              </div>
            </div>

            {/* Middle text */}
            <div style={{padding:'0 20px'}} className="reveal delay-2">
              <div className="sr-badge delay-1"><span className="dot"></span> STRATEGY</div>
              <h2 className="sr-title delay-2" style={{fontSize:'clamp(28px,4vw,40px)'}}>Scale your trading operation with AI</h2>
              <p className="sr-subtitle delay-3" style={{marginBottom:32}}>
                Effortlessly manage hundreds of accounts. Delight in the speed and boost your operational efficiency. Streamline complex workflows with TradeVault AI.
              </p>
              <button className="sr-btn delay-3">Launch Vault</button>
            </div>

            {/* Right Mini Chart placeholder */}
            <div className="sr-mini-chart reveal delay-3">
               <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                  <div style={{fontSize:12,color:'#a1a1aa'}}>Ad Spend</div>
                  <div style={{fontSize:10,background:'rgba(255,255,255,0.1)',padding:'4px 8px',borderRadius:4}}>This Week ▾</div>
               </div>
               <div style={{fontSize:24,fontWeight:700,marginBottom:4}}>13.5k <span style={{fontSize:10,color:'#4ade80',fontWeight:400}}>Sessions in past 7 days</span></div>
               <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,borderBottomLeftRadius:16,borderBottomRightRadius:16,overflow:'hidden'}}>
                  <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                     <path d="M0,80 Q25,90 50,40 T100,50 T150,20 T200,30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                     <path d="M0,60 Q25,80 50,30 T100,20 T150,10 T200,40" fill="none" stroke="#fff" strokeWidth="2"/>
                  </svg>
               </div>
            </div>
          </div>
        </section>

        {/* ── Integration Node Map ── */}
        <section className="sr-section sr-integration reveal">
          <div className="sr-badge delay-1"><span className="dot"></span> INTEGRATION</div>
          <h2 className="sr-title center delay-2">Seamless integration<br/>for enhanced efficiency</h2>
          <p className="sr-subtitle delay-3">Explore our expansive range of integrations designed to synchronize perfectly with your trading stack.</p>
          
          <div className="sr-node-map reveal delay-3">
            <div className="sr-node center-node"><i className="fas fa-bolt"></i></div>
            <div className="sr-node n1"><i className="fab fa-discord"></i></div>
            <div className="sr-node n2"><i className="fab fa-meta"></i></div>
            <div className="sr-node n3"><i className="fab fa-telegram"></i></div>
            <div className="sr-node n4"><i className="fab fa-google"></i></div>
            <div className="sr-node n5"><i className="fab fa-microsoft"></i></div>
            <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:-1,pointerEvents:'none'}}>
               <line x1="200" y1="150" x2="200" y2="42" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
               <line x1="200" y1="150" x2="82" y2="102" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
               <line x1="200" y1="150" x2="318" y2="102" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
               <line x1="200" y1="150" x2="122" y2="222" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
               <line x1="200" y1="150" x2="282" y2="202" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </svg>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="sr-section reveal" id="pricing">
           <div style={{textAlign:'center'}} className="reveal delay-1">
              <div className="sr-badge"><span className="dot"></span> PRICING</div>
              <h2 className="sr-title center">Choose your plan</h2>
              <p className="sr-subtitle" style={{margin:'0 auto'}}>Try TradeVault for free or upgrade to enable professional features.</p>
           </div>
           
           <div className="sr-pricing">
              <div className="sr-price-card reveal delay-1">
                 <div className="sr-price-lbl">FREE</div>
                 <div className="sr-price-name">Personal Vault</div>
                 <ul className="sr-price-features">
                    <li>Up to 5 Accounts</li>
                    <li>Local-only Storage</li>
                    <li>Basic Vault Features</li>
                 </ul>
                 <button className="sr-btn-outline" onClick={onGoAdmin}>Get Started</button>
              </div>
              <div className="sr-price-card reveal delay-2" style={{border:'1px solid var(--accent)', background:'rgba(56,189,248,0.05)'}}>
                 <div className="sr-price-lbl" style={{color:'var(--accent)'}}>PROFESSIONAL</div>
                 <div className="sr-price-val">$29<span>/ per month</span></div>
                 <ul className="sr-price-features">
                    <li>Unlimited Accounts</li>
                    <li>Cloud Backup (E2E)</li>
                    <li>Multi-terminal Sync</li>
                    <li>Priority Support</li>
                 </ul>
                 <button className="sr-btn" onClick={onGoAdmin}>Upgrade Now</button>
              </div>
              <div className="sr-price-card reveal delay-3">
                 <div className="sr-price-lbl">ENTERPRISE</div>
                 <div className="sr-price-val">$99<span>/ per month</span></div>
                 <ul className="sr-price-features">
                    <li>Team Access Control</li>
                    <li>Audit Logs</li>
                    <li>Custom Branding</li>
                    <li>Dedicated Manager</li>
                 </ul>
                 <button className="sr-btn-outline">Contact Sales</button>
              </div>
           </div>
        </section>

        {/* ── Blogs ── */}
        <section className="sr-section reveal" id="blog">
           <div className="sr-badge delay-1"><span className="dot"></span> ARTICLES</div>
           <h2 className="sr-title delay-2">Read our most recent insights</h2>
           <p className="sr-subtitle delay-3">Explore the most recent news and security updates for TradeVault.</p>
           
           <div className="sr-blogs">
              <div className="sr-blog-card reveal delay-1">
                 <div className="sr-blog-img"></div>
                 <div className="sr-blog-info">
                    <div className="sr-blog-cat">Security</div>
                    <div className="sr-blog-title">TradeVault providing E2EE</div>
                    <div className="sr-blog-desc">How to secure your trading credentials with modern encryption protocols.</div>
                    <div className="sr-blog-author">
                       <div className="sr-blog-avatar"></div>
                       <div>
                          <div className="sr-blog-author-name">Olivia Rhys</div>
                          <div className="sr-blog-author-role">Security Lead</div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="sr-blog-card reveal delay-2">
                 <div className="sr-blog-img"></div>
                 <div className="sr-blog-info">
                    <div className="sr-blog-cat">AI Analysis</div>
                    <div className="sr-blog-title">Introducing AI Analytics</div>
                    <div className="sr-blog-desc">Elevate your trading with automated account performance analysis and risk metrics.</div>
                    <div className="sr-blog-author">
                       <div className="sr-blog-avatar"></div>
                       <div>
                          <div className="sr-blog-author-name">Hannibal Smith</div>
                          <div className="sr-blog-author-role">AI Architect</div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="sr-blog-card reveal delay-3">
                 <div className="sr-blog-img"></div>
                 <div className="sr-blog-info">
                    <div className="sr-blog-cat">Latest</div>
                    <div className="sr-blog-title">Global Sync Protocol v2</div>
                    <div className="sr-blog-desc">Ready to use solution to showcase your services and mark your online presence.</div>
                    <div className="sr-blog-author">
                       <div className="sr-blog-avatar"></div>
                       <div>
                          <div className="sr-blog-author-name">Mike Torello</div>
                          <div className="sr-blog-author-role">Lead Dev</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
        
        {/* Footer info placeholder */}
        <footer className="sr-footer">
           © 2026 TradeVault. All rights reserved. Built with ❤️ for Professional Traders.
        </footer>
      </div>
    </div>
  );
}
