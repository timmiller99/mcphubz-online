/*
 * MCPHubz Sandbox — Home Page
 * Design: Terminal Brutalism — dark hacker aesthetic, bright green accents
 * Layout: Full-height hero with split feature showcase, asymmetric sections
 */
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Zap, 
  Globe, 
  Server, 
  Code2, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers,
  Shield,
  BookOpen
} from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-hero-bg-bK5Pb88nhPPBuDxAVKw5Pd.webp";
const UI_PREVIEW = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-ui-preview-atP7vYsZe9wGeVBBDgVMNV.webp";
const WEBMCP_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-webmcp-icon-KUzFEUyjRezt9fUm3JDHby.webp";

const TYPEWRITER_TEXTS = [
  "Build MCP Servers.",
  "Test WebMCP Tools.",
  "Deploy to Production.",
  "Lead the Agentic Web.",
];

function TypewriterText() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = TYPEWRITER_TEXTS[index];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < target.length) {
          setDisplayed(target.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setIndex((i) => (i + 1) % TYPEWRITER_TEXTS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index]);

  return (
    <span className="text-primary" style={{ textShadow: '0 0 20px #22c55e80' }}>
      {displayed}<span className="animate-pulse">_</span>
    </span>
  );
}

const FEATURES = [
  {
    icon: Server,
    title: "MCP Server Builder",
    desc: "Define tools, test connections, and validate your MCP server against the spec — all in one place.",
    tag: "LIVE",
    color: "text-primary",
  },
  {
    icon: Globe,
    title: "WebMCP Tool Builder",
    desc: "Use the imperative API to register browser-native tools that AI agents can call directly on your site.",
    tag: "CHROME 146+",
    color: "text-primary",
  },
  {
    icon: Layers,
    title: "Template Library",
    desc: "Pre-built WebMCP templates for E-commerce, Local Business, Blog, SaaS, and more. Drop in, customise, deploy.",
    tag: "5 TEMPLATES",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Spec Validator",
    desc: "Automatically validate your MCP or WebMCP implementation against the latest spec before you ship.",
    tag: "COMING SOON",
    color: "text-muted-foreground",
  },
  {
    icon: BookOpen,
    title: "WebMCP Academy",
    desc: "From SEO to AEO to GEO to WebMCP — the complete course on making your site AI-agent ready.",
    tag: "COMING SOON",
    color: "text-muted-foreground",
  },
  {
    icon: Zap,
    title: "Registry Submission",
    desc: "Submit your verified WebMCP implementation to the MCPHubz WebMCP-Ready Registry with one click.",
    tag: "COMING SOON",
    color: "text-muted-foreground",
  },
];

const TEMPLATES = [
  { name: "Local Business", desc: "Book appointments, get hours, find location", icon: "🏪" },
  { name: "E-commerce", desc: "Search products, check inventory, add to cart", icon: "🛒" },
  { name: "Blog / Content", desc: "Search posts, get summaries, find authors", icon: "📝" },
  { name: "SaaS Platform", desc: "Get pricing, start trial, check status", icon: "⚡" },
  { name: "Membership Site", desc: "Check access, get content, manage account", icon: "🔐" },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: '#111111f2', backdropFilter: 'blur(12px)', borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-3">
          <img src={WEBMCP_ICON} alt="MCPHubz" className="w-7 h-7 rounded" />
          <span className="font-bold text-sm tracking-wider text-foreground">
            MCPHUBZ <span className="text-primary">SANDBOX</span>
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/40 text-primary">
            BETA
          </Badge>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
          <button onClick={() => navigate('/sandbox')} className="hover:text-primary transition-colors">SANDBOX</button>
          <button onClick={() => navigate('/templates')} className="hover:text-primary transition-colors">TEMPLATES</button>
          <button onClick={() => navigate('/docs')} className="hover:text-primary transition-colors">DOCS</button>
          <a href="https://mcphubz.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
            MCPHUBZ.COM <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/sandbox')}
          className="text-xs px-4 py-1.5 h-auto"
          style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
        >
          LAUNCH SANDBOX <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #11111199 0%, #111111d9 60%, #111111 100%)' }} />
        </div>
        {/* Scanline overlay */}
        <div className="absolute inset-0 z-0 scanline pointer-events-none opacity-30" />

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="status-dot-green pulse-cyan" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Chrome 146+ · WebMCP Early Preview · Live Now
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 tracking-tight text-foreground">
              The Only Sandbox for<br />
              <TypewriterText />
            </h1>

            <p className="text-base text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              MCPHubz Sandbox is the world's first dual-purpose developer environment for building and testing both{" "}
              <span className="text-primary">MCP servers</span> and{" "}
              <span className="text-primary">WebMCP browser tools</span>.{" "}
              Powered by the <code className="text-xs bg-surface px-1 py-0.5 rounded">@mcp-b</code> engine.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/sandbox')}
                className="text-sm px-6 h-11 font-bold tracking-wider cyan-glow"
                style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
              >
                <Terminal className="w-4 h-4 mr-2" />
                OPEN SANDBOX
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/templates')}
                className="text-sm px-6 h-11 font-bold tracking-wider border-border hover:border-primary hover:text-primary"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <Layers className="w-4 h-4 mr-2" />
                VIEW TEMPLATES
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
              {[
                { label: "MCP Tools Available", value: "36+" },
                { label: "WebMCP Templates", value: "5" },
                { label: "Site Categories", value: "5" },
                { label: "Chrome Version", value: "146+" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-primary" style={{ textShadow: '0 0 10px #22c55e66' }}>{stat.value}</span>
                  <span className="tracking-wider uppercase text-[10px]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* UI Preview floating card */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block z-10 w-[520px] mr-8">
          <div className="rounded-lg overflow-hidden terminal-border-cyan cyan-glow" style={{ background: '#1a1a1a' }}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid #2a2a2a', background: 'oklch(0.14 0.008 265)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-[11px] text-muted-foreground">mcphubz-sandbox — mcp-server-tester</span>
            </div>
            <img src={UI_PREVIEW} alt="MCPHubz Sandbox UI" className="w-full" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative" style={{ borderTop: '1px solid #2a2a2a' }}>
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="text-[11px] text-primary tracking-widest uppercase">Platform Features</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Everything you need to build<br />
              <span className="text-primary">AI-agent ready</span> experiences.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-sm group hover:border-primary/40 transition-all duration-200"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-sm" style={{ background: '#222222' }}>
                      <Icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[9px] px-1.5 py-0 tracking-wider ${
                        feature.tag === 'COMING SOON'
                          ? 'border-muted-foreground/30 text-muted-foreground'
                          : 'border-primary/40 text-primary'
                      }`}
                    >
                      {feature.tag}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20" style={{ background: 'oklch(0.11 0.008 265)', borderTop: '1px solid #2a2a2a' }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-px bg-primary" />
                <span className="text-[11px] text-primary tracking-widest uppercase">Template Library</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Pre-built WebMCP templates<br />
                for every site type.
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Stop building from scratch. Each template is a production-ready WebMCP implementation
                for a specific site category. Drop in your site's data and you're live in minutes.
              </p>
              <Button
                onClick={() => navigate('/templates')}
                className="text-xs px-5 h-9 font-bold tracking-wider"
                style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
              >
                BROWSE TEMPLATES <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="lg:w-3/5 space-y-2">
              {TEMPLATES.map((template) => (
                <div
                  key={template.name}
                  className="flex items-center gap-4 p-3.5 rounded-sm cursor-pointer group hover:border-primary/40 transition-all"
                  style={{ background: 'oklch(0.13 0.008 265)', border: '1px solid #2a2a2a' }}
                  onClick={() => navigate('/templates')}
                >
                  <span className="text-xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground">{template.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{template.desc}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEO → AEO → GEO → WebMCP Section */}
      <section className="py-20" style={{ borderTop: '1px solid #2a2a2a' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="text-[11px] text-primary tracking-widest uppercase">The Evolution</span>
              <div className="w-6 h-px bg-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              The web is evolving.<br />
              <span className="text-primary">Are you leading or following?</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-0 max-w-4xl mx-auto">
            {[
              { label: "SEO", desc: "Get found by search engines", status: "Established", color: "text-muted-foreground", bg: "oklch(0.13 0.008 265)" },
              { label: "AEO", desc: "Get cited by AI answers", status: "Emerging", color: "text-amber-400", bg: "oklch(0.14 0.01 75)" },
              { label: "GEO", desc: "Become the AI's source", status: "Now", color: "text-orange-400", bg: "oklch(0.14 0.012 55)" },
              { label: "WebMCP", desc: "Let AI act on your site", status: "Next", color: "text-primary", bg: "oklch(0.14 0.015 185)", highlight: true },
            ].map((step, i) => (
              <div key={step.label} className="flex-1 flex items-stretch">
                <div
                  className={`flex-1 p-5 ${step.highlight ? 'terminal-border-cyan cyan-glow' : ''}`}
                  style={{ background: step.bg, border: step.highlight ? '1px solid #22c55e80' : '1px solid #2a2a2a', borderLeft: i > 0 ? 'none' : undefined }}
                >
                  <div className={`text-2xl font-black mb-1 ${step.color}`}>{step.label}</div>
                  <div className="text-xs text-muted-foreground mb-2">{step.desc}</div>
                  <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${step.highlight ? 'border-primary/50 text-primary' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                    {step.status}
                  </Badge>
                </div>
                {i < 3 && (
                  <div className="flex items-center px-0 z-10" style={{ marginLeft: '-1px', marginRight: '-1px' }}>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16" style={{ background: 'oklch(0.11 0.008 265)', borderTop: '1px solid #2a2a2a' }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Start building the <span className="text-primary">agentic web</span> today.
          </h2>
          <p className="text-xs text-muted-foreground mb-8 max-w-md mx-auto">
            The window to establish authority in the WebMCP ecosystem is open right now.
            Build, test, and get listed on the MCPHubz WebMCP-Ready Registry.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/sandbox')}
              className="text-sm px-8 h-11 font-bold tracking-wider cyan-glow"
              style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Terminal className="w-4 h-4 mr-2" />
              OPEN SANDBOX — FREE
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-sm px-8 h-11 font-bold tracking-wider border-border hover:border-primary hover:text-primary"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <a href="https://mcphubz.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                MCPHUBZ DIRECTORY
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6" style={{ borderTop: '1px solid #2a2a2a' }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={WEBMCP_ICON} alt="MCPHubz" className="w-5 h-5 rounded" />
            <span className="text-xs text-muted-foreground">
              MCPHubz Sandbox · Built on <a href="https://mcp-b.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@mcp-b</a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <a href="https://mcphubz.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">MCPHubz.com</a>
            <span>·</span>
            <span>WebMCP is in Chrome 146+ Early Preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
