/*
 * MCPHubz Sandbox — Docs Page
 * Design: Terminal Brutalism — documentation with code examples
 */
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Terminal, ExternalLink } from "lucide-react";

const WEBMCP_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-webmcp-icon-KUzFEUyjRezt9fUm3JDHby.webp";

const SECTIONS = [
  {
    id: "what-is-webmcp",
    title: "What is WebMCP?",
    content: `WebMCP is a browser-native API that allows websites to expose structured tools directly to AI agents — without scraping, screenshots, or DOM manipulation.

Instead of an AI agent trying to "click buttons" on your site, WebMCP lets you define exactly what the agent can do and what data it can access. The agent calls your tools directly, like an API.

WebMCP is currently available in Chrome 146+ via the Early Preview Program.`,
    code: null,
  },
  {
    id: "enable-webmcp",
    title: "Enable WebMCP in Chrome",
    content: `WebMCP requires Chrome 146 or later with the experimental flag enabled.`,
    code: `// Step 1: Open Chrome 146+
// Step 2: Navigate to chrome://flags
// Step 3: Search for "WebMCP" or "Experimental Web Platform features"
// Step 4: Enable the flag and relaunch Chrome

// Verify WebMCP is available:
if (typeof navigator.modelContext !== "undefined") {
  console.log("WebMCP is available!");
} else {
  console.log("WebMCP not available. Check Chrome version and flags.");
}`,
  },
  {
    id: "register-tool",
    title: "Register Your First Tool",
    content: `Use the imperative API to register tools with WebMCP. Each tool needs a name, description, JSON Schema for parameters, and a handler function.`,
    code: `// Register a tool using the imperative API
navigator.modelContext.registerTool(
  "get_business_hours",           // Tool name
  "Get the business hours and whether we are currently open.", // Description
  {                               // JSON Schema for parameters
    type: "object",
    properties: {
      day: {
        type: "string",
        description: "Specific day to get hours for (optional)"
      }
    }
  },
  async (params) => {             // Handler function
    const hours = {
      monday: "8am - 6pm",
      tuesday: "8am - 6pm",
      // ...
      sunday: "Closed"
    };
    
    if (params.day) {
      return { day: params.day, hours: hours[params.day.toLowerCase()] };
    }
    
    return { hours, isOpen: true }; // Add real open/closed logic
  }
);

console.log("Tool registered with WebMCP!");`,
  },
  {
    id: "declarative-api",
    title: "Declarative API (HTML)",
    content: `WebMCP also supports a declarative approach using HTML form attributes. This is simpler but less flexible than the imperative API.`,
    code: `<!-- Declarative WebMCP using HTML attributes -->
<!-- Add webmcp attributes to your existing forms -->

<form 
  webmcp-name="contact_form"
  webmcp-description="Submit a contact inquiry to the business"
  action="/contact" 
  method="POST"
>
  <input 
    name="name" 
    webmcp-description="Customer's full name"
    type="text" 
  />
  <input 
    name="email" 
    webmcp-description="Customer's email address"
    type="email" 
  />
  <textarea 
    name="message"
    webmcp-description="The inquiry message"
  ></textarea>
  <button type="submit">Send</button>
</form>

<!-- AI agents can now fill and submit this form programmatically -->`,
  },
  {
    id: "seo-aeo-geo",
    title: "SEO → AEO → GEO → WebMCP",
    content: `Understanding where WebMCP fits in the evolution of web discoverability:

SEO (Search Engine Optimisation): Optimise your site so Google finds and ranks it. You are optimising for crawlers and algorithms. This is established practice.

AEO (Answer Engine Optimisation): Optimise your content so AI assistants like ChatGPT and Perplexity cite you in their answers. You structure content for AI extraction.

GEO (Generative Engine Optimisation): Go further — make your site the authoritative source that AI models quote and reference. Build E-E-A-T signals that AI trusts.

WebMCP: The next evolution. Instead of just being found or cited, your site becomes something AI agents can actively use. They can book appointments, search your products, check your hours — all without a human in the loop.`,
    code: null,
  },
  {
    id: "mcp-vs-webmcp",
    title: "MCP vs WebMCP",
    content: `These are related but distinct technologies:`,
    code: `// MCP (Model Context Protocol) — Server-side
// - Runs as a standalone server process
// - Connects to Claude Desktop, Claude Code, etc.
// - Requires server infrastructure
// - Used for: file systems, databases, APIs, internal tools
// - Config: claude_desktop_config.json

// Example MCP server config:
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": { "API_KEY": "..." }
    }
  }
}

// WebMCP — Browser-side
// - Runs directly in the browser (no server needed)
// - Connects to AI agents browsing the web
// - Zero infrastructure required
// - Used for: websites, web apps, e-commerce, local business
// - Config: JavaScript in your site's HTML

// Example WebMCP registration:
navigator.modelContext.registerTool(
  "search_products",
  "Search our product catalog",
  { type: "object", properties: { query: { type: "string" } } },
  async ({ query }) => await searchProducts(query)
);`,
  },
];

export default function Docs() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-50"
        style={{ background: 'oklch(0.09 0.008 265 / 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs">
            <ChevronLeft className="w-3.5 h-3.5" />
            <img src={WEBMCP_ICON} alt="" className="w-5 h-5 rounded" />
            <span className="font-bold tracking-wider">MCPHUBZ <span className="text-primary">SANDBOX</span></span>
          </button>
          <span className="text-muted-foreground/40 text-xs">/</span>
          <span className="text-xs text-muted-foreground">Documentation</span>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/sandbox')}
          className="text-xs px-4 h-7 font-bold tracking-wider"
          style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
        >
          <Terminal className="w-3 h-3 mr-1.5" /> OPEN SANDBOX
        </Button>
      </div>

      <div className="flex h-[calc(100vh-49px)]">
        {/* Sidebar TOC */}
        <div className="w-56 shrink-0 overflow-y-auto p-4" style={{ borderRight: '1px solid #2a2a2a', background: 'oklch(0.11 0.008 265)' }}>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-3">Contents</div>
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-[11px] text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-sm hover:bg-surface"
              >
                {s.title}
              </a>
            ))}
          </nav>

          <div className="mt-6 pt-4" style={{ borderTop: '1px solid #2a2a2a' }}>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">External</div>
            <a href="https://developer.chrome.com/blog/webmcp" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors py-1.5">
              <ExternalLink className="w-3 h-3" /> Chrome Docs
            </a>
            <a href="https://mcp-b.ai" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors py-1.5">
              <ExternalLink className="w-3 h-3" /> mcp-b.ai
            </a>
            <a href="https://mcphubz.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors py-1.5">
              <ExternalLink className="w-3 h-3" /> MCPHubz Directory
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8 space-y-12">
            {/* Header */}
            <div>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/40 text-primary mb-3">
                WEBMCP EARLY PREVIEW · CHROME 146+
              </Badge>
              <h1 className="text-2xl font-bold text-foreground mb-2">WebMCP Documentation</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Everything you need to understand and implement WebMCP on your site.
                From the basics to production-ready implementations.
              </p>
            </div>

            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary">#</span>
                  {section.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                  {section.content}
                </p>
                {section.code && (
                  <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #2a2a2a' }}>
                    <div className="flex items-center justify-between px-3 py-2"
                      style={{ background: 'oklch(0.14 0.008 265)', borderBottom: '1px solid #2a2a2a' }}>
                      <span className="text-[10px] text-muted-foreground">javascript</span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(section.code!); }}
                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        copy
                      </button>
                    </div>
                    <pre className="p-4 text-[11px] leading-relaxed overflow-x-auto"
                      style={{ background: 'oklch(0.095 0.008 265)', color: 'oklch(0.88 0.005 65)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {section.code}
                    </pre>
                  </div>
                )}
              </section>
            ))}

            {/* CTA */}
            <div className="p-6 rounded-sm terminal-border-cyan"
              style={{ background: 'oklch(0.12 0.015 185)' }}>
              <h3 className="text-sm font-bold text-foreground mb-2">Ready to build?</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Open the sandbox and start building your WebMCP implementation using one of our pre-built templates.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate('/sandbox/webmcp')}
                  className="text-xs px-4 h-7 font-bold"
                  style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <Terminal className="w-3 h-3 mr-1.5" /> OPEN SANDBOX
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/templates')}
                  className="text-xs px-4 h-7 border-primary/40 text-primary hover:bg-primary/10"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  VIEW TEMPLATES
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
