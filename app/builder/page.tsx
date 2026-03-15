'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Terminal, Download, Copy, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react'
import { TEMPLATES, generateTemplate, type CategoryTemplate, type SiteConfig } from '@/lib/templates'

function BuilderContent() {
  const searchParams = useSearchParams()
  const preselected = searchParams.get('category')

  const [step, setStep] = useState<'category' | 'config' | 'output'>(preselected ? 'config' : 'category')
  const [selectedTemplate, setSelectedTemplate] = useState<CategoryTemplate | null>(
    preselected ? TEMPLATES.find(t => t.id === preselected) || null : null
  )
  const [config, setConfig] = useState<SiteConfig>({ siteName: '', siteUrl: '', apiBase: '' })
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCategorySelect = (template: CategoryTemplate) => {
    setSelectedTemplate(template)
    setConfig({ siteName: '', siteUrl: '', apiBase: '' })
    setStep('config')
  }

  const handleGenerate = () => {
    if (!selectedTemplate) return
    const generated = generateTemplate(selectedTemplate, config)
    setCode(generated)
    setStep('output')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `webmcp-${selectedTemplate?.id || 'template'}.js`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main style={{ backgroundColor: '#111111', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', backgroundColor: '#0d0d0d', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: '#22c55e', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal style={{ width: '14px', height: '14px', color: '#000' }} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.03em' }}>
              MCP<span style={{ color: '#22c55e' }}>Hubz</span>
              <span style={{ fontSize: '0.6875rem', color: '#4b5563', fontWeight: 500, marginLeft: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>sandbox</span>
            </span>
          </Link>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['category', 'config', 'output'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, backgroundColor: step === s ? '#22c55e' : ['category', 'config', 'output'].indexOf(step) > i ? 'rgba(34,197,94,0.2)' : '#1a1a1a', color: step === s ? '#000' : ['category', 'config', 'output'].indexOf(step) > i ? '#22c55e' : '#4b5563', border: `1px solid ${step === s ? '#22c55e' : ['category', 'config', 'output'].indexOf(step) > i ? 'rgba(34,197,94,0.3)' : '#2a2a2a'}` }}>
                  {i + 1}
                </div>
                {i < 2 && <div style={{ width: '20px', height: '1px', backgroundColor: '#2a2a2a' }} />}
              </div>
            ))}
          </div>

          <a href="https://mcphubz.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#6b7280', textDecoration: 'none' }}>
            ← MCPHubz
          </a>
        </div>
      </nav>

      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>

        {/* STEP 1: Category */}
        {step === 'category' && (
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#22c55e', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>STEP 1 OF 3</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#fff', letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>
                What type of site are you building for?
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>Pick the category that best matches your site. This determines which WebMCP tools get generated.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => handleCategorySelect(t)} style={{ backgroundColor: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = t.color; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1f1f1f'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', margin: 0 }}>{t.label}</h3>
                    <ChevronRight style={{ width: '16px', height: '16px', color: t.color }} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6, margin: '0 0 1rem' }}>{t.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
                    {t.tools.slice(0, 3).map(tool => (
                      <span key={tool.name} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: t.color, backgroundColor: `${t.color}12`, border: `1px solid ${t.color}25`, borderRadius: '3px', padding: '2px 6px' }}>
                        {tool.name}
                      </span>
                    ))}
                    {t.tools.length > 3 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#4b5563', padding: '2px 4px' }}>+{t.tools.length - 3} more</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Config */}
        {step === 'config' && selectedTemplate && (
          <div>
            <button onClick={() => setStep('category')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '2rem', padding: 0 }}>
              <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back
            </button>

            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#22c55e', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>STEP 2 OF 3</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#fff', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
                Configure your {selectedTemplate.label} template
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>Fill in your site details. These get baked into the generated code.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
              {/* Form */}
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {selectedTemplate.configFields.map((field) => (
                    <div key={field.key}>
                      <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#fff', marginBottom: '0.5rem' }}>
                        {field.label}
                      </label>
                      {field.hint && <p style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.4rem' }}>{field.hint}</p>}
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={config[field.key] || ''}
                        onChange={e => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="input-dark"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!config.siteName}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2rem', padding: '0.875rem 2rem', backgroundColor: config.siteName ? '#22c55e' : '#1a1a1a', color: config.siteName ? '#000' : '#4b5563', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', borderRadius: '8px', border: 'none', cursor: config.siteName ? 'pointer' : 'not-allowed', transition: 'all 0.15s', width: '100%', justifyContent: 'center' }}
                >
                  Generate My WebMCP Template
                  <ArrowRight style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {/* Tools preview */}
              <div style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: '#22c55e', letterSpacing: '0.08em', marginBottom: '1rem' }}>TOOLS THAT WILL BE GENERATED</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedTemplate.tools.map(tool => (
                    <div key={tool.name} style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '0.75rem' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', color: selectedTemplate.color, marginBottom: '0.25rem' }}>{tool.name}()</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>{tool.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Output */}
        {step === 'output' && selectedTemplate && (
          <div>
            <button onClick={() => setStep('config')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '2rem', padding: 0 }}>
              <ArrowLeft style={{ width: '14px', height: '14px' }} /> Edit Config
            </button>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#22c55e', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>STEP 3 OF 3</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
                Your WebMCP template is ready.
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Download the file and add it to your site. Then submit to the WebMCP-Ready Registry to get certified.
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '1.5rem' }}>
              <button onClick={handleDownload} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', backgroundColor: '#22c55e', color: '#000', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9375rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                <Download style={{ width: '16px', height: '16px' }} />
                Download webmcp-{selectedTemplate.id}.js
              </button>
              <button onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: copied ? '#22c55e' : '#9ca3af', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.9375rem', borderRadius: '8px', border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : '#2a2a2a'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                {copied ? <CheckCircle style={{ width: '16px', height: '16px' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <a href="https://mcphubz.com/webmcp-ready" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.9375rem', borderRadius: '8px', border: '1px solid #2a2a2a', textDecoration: 'none' }}>
                <ExternalLink style={{ width: '16px', height: '16px' }} />
                Submit to Registry
              </a>
            </div>

            {/* Code block */}
            <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderBottom: '1px solid #1a1a1a', backgroundColor: '#0d0d0d' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }} />)}
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#4b5563' }}>
                    webmcp-{selectedTemplate.id}.js
                  </span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: '#22c55e' }}>
                  {selectedTemplate.tools.length} tools • {selectedTemplate.label}
                </span>
              </div>
              <pre style={{ margin: 0, padding: '1.5rem', overflowX: 'auto', fontSize: '0.8125rem', lineHeight: 1.7, color: '#e5e7eb', fontFamily: "'JetBrains Mono', monospace", maxHeight: '500px', overflowY: 'auto' }}>
                <code>{code}</code>
              </pre>
            </div>

            {/* How to deploy */}
            <div style={{ marginTop: '2rem', backgroundColor: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>How to deploy this template</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { n: '1', text: 'Download the .js file and add it to your site\'s public folder' },
                  { n: '2', text: 'Add <script src="/webmcp-YOUR-CATEGORY.js"></script> to your <head>' },
                  { n: '3', text: 'Replace the handler fetch() calls with your actual API endpoints' },
                  { n: '4', text: 'Test in Chrome Canary with the WebMCP flag enabled' },
                  { n: '5', text: 'Submit your site to the MCPHubz WebMCP-Ready Registry to get certified' },
                ].map(step => (
                  <div key={step.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '4px', padding: '1px 7px', flexShrink: 0, marginTop: '1px' }}>{step.n}</span>
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.6 }}>{step.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e', flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: 0, lineHeight: 1.6 }}>
                  Need help implementing this? <a href="https://mcphubz.com/enterprise" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>Contact us</a> for a done-for-you install — we&apos;ll set it up on your site and submit it to the registry.
                </p>
              </div>
            </div>

            {/* Start over */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button onClick={() => { setStep('category'); setSelectedTemplate(null); setConfig({ siteName: '', siteUrl: '', apiBase: '' }); setCode('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', fontSize: '0.875rem', fontFamily: "'Space Grotesk', sans-serif" }}>
                Build another template →
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: '#111111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#22c55e', fontSize: '0.875rem' }}>Loading builder...</p>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  )
}
