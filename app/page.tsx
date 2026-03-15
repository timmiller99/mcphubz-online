import Link from 'next/link'
import { ArrowRight, Terminal, Zap, Globe, ShoppingCart, Users, FileText, Building2, ChevronRight } from 'lucide-react'

const CATEGORIES = [
  { id: 'ecommerce', label: 'E-Commerce', desc: 'search_products, add_to_cart, check_inventory, get_order_status', color: '#22c55e' },
  { id: 'local-business', label: 'Local Business', desc: 'get_services, check_availability, book_appointment, get_pricing', color: '#3b82f6' },
  { id: 'saas', label: 'SaaS / Membership', desc: 'check_subscription, get_user_profile, upgrade_plan, get_usage_stats', color: '#8b5cf6' },
  { id: 'blog', label: 'Content / Blog', desc: 'search_articles, get_article, list_categories, subscribe_newsletter', color: '#f59e0b' },
  { id: 'directory', label: 'Directory / Marketplace', desc: 'search_listings, get_listing_details, filter_by_category, submit_inquiry', color: '#06b6d4' },
  { id: 'agency', label: 'Agency / Portfolio', desc: 'get_services, view_portfolio, request_quote, book_consultation', color: '#ec4899' },
]

const STEPS = [
  { n: '01', title: 'Pick your site type', desc: 'Choose from 6 pre-built category templates — each with the right WebMCP tools for your use case.' },
  { n: '02', title: 'Configure your site', desc: "Fill in your site name, API endpoints, and key actions. One config object — that's it." },
  { n: '03', title: 'Test it live', desc: 'Your customized WebMCP template spins up in a live sandbox. Test every tool before you ship.' },
  { n: '04', title: 'Deploy & get certified', desc: 'Download the template or request a done-for-you install. Auto-submit to the MCPHubz WebMCP-Ready Registry.' },
]

export default function HomePage() {
  return (
    <main style={{ backgroundColor: '#111111', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', backgroundColor: '#0d0d0d', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: '#22c55e', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal style={{ width: '14px', height: '14px', color: '#000' }} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.03em' }}>
              MCP<span style={{ color: '#22c55e' }}>Hubz</span>
              <span style={{ fontSize: '0.6875rem', color: '#4b5563', fontWeight: 500, marginLeft: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>sandbox</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="https://mcphubz.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#6b7280', textDecoration: 'none' }}>
              ← Back to MCPHubz
            </a>
            <Link href="/builder" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', backgroundColor: '#22c55e', color: '#000', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.875rem', borderRadius: '8px', textDecoration: 'none' }}>
              Start Building
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '5rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '1.75rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            WebMCP Template Builder
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            Make any website<br />
            <span style={{ color: '#22c55e' }}>AI-agent ready</span><br />
            in minutes.
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Pick a template for your site type, configure it with your details, and get a live WebMCP implementation — ready to test and deploy. No spec knowledge required.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
            <Link href="/builder" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.875rem 2rem', backgroundColor: '#22c55e', color: '#000', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', borderRadius: '8px', textDecoration: 'none' }}>
              Build Your WebMCP Template
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <a href="https://mcphubz.com/webmcp" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.875rem 2rem', backgroundColor: 'transparent', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1rem', borderRadius: '8px', border: '1px solid #2a2a2a', textDecoration: 'none' }}>
              What is WebMCP?
            </a>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#4b5563', marginTop: '1.5rem' }}>
            Free to build. Completed sites auto-submit to the{' '}
            <a href="https://mcphubz.com/webmcp-ready" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none' }}>MCPHubz WebMCP-Ready Registry</a>.
          </p>
        </div>
      </section>

      {/* Category picker */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              6 templates. Every site type covered.
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>Each template comes pre-loaded with the right tools for your category.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/builder?category=${cat.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', height: '100%' }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.625rem' }}>{cat.label}</h3>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: '#4b5563', lineHeight: 1.6, margin: '0 0 1rem' }}>
                    {cat.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: cat.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                    Use this template <ChevronRight style={{ width: '14px', height: '14px' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 0', backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', letterSpacing: '-0.03em' }}>
              From zero to WebMCP-ready in 4 steps.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {STEPS.map((step) => (
              <div key={step.n}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2rem', fontWeight: 700, color: 'rgba(34,197,94,0.15)', marginBottom: '0.75rem' }}>{step.n}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <Zap style={{ width: '32px', height: '32px', color: '#22c55e', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#fff', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
            The window to lead on WebMCP is open now.
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            WebMCP is in Chrome Canary today. Stable rollout is mid-2026. Get your site certified before everyone else catches on.
          </p>
          <Link href="/builder" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.875rem 2.5rem', backgroundColor: '#22c55e', color: '#000', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', borderRadius: '8px', textDecoration: 'none' }}>
            Start Building — It&apos;s Free
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', backgroundColor: '#0d0d0d', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '1rem' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#6b7280' }}>
            MCPHubz Sandbox — Part of the{' '}
            <a href="https://mcphubz.com" style={{ color: '#22c55e', textDecoration: 'none' }}>MCPHubz</a> ecosystem
          </span>
          <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: 0 }}>© 2026 MCPHubz. All rights reserved.</p>
        </div>
      </footer>

    </main>
  )
}
