/*
 * MCPHubz Sandbox — Templates Page
 * Design: Terminal Brutalism — template library with code preview
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, Copy, ExternalLink, Terminal, CheckCircle2 } from "lucide-react";

const WEBMCP_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-webmcp-icon-KUzFEUyjRezt9fUm3JDHby.webp";

const TEMPLATES = [
  {
    id: "local-business",
    name: "Local Business",
    icon: "🏪",
    desc: "Perfect for handymen, contractors, restaurants, salons, and any local service business.",
    tools: ["get_business_info", "get_hours", "book_appointment", "get_services", "get_location"],
    tags: ["Handyman", "Restaurant", "Salon", "Contractor"],
    code: `// WebMCP Template: Local Business
// Drop in your business details and deploy.
// Works with: Handyman, Restaurant, Salon, Contractor, etc.

const businessData = {
  name: "PD Handy LLC",
  tagline: "Professional Handyman Services",
  phone: "(555) 123-4567",
  email: "info@pdhandy.com",
  address: "Your City, ST",
  hours: {
    monday: "8:00 AM - 6:00 PM",
    tuesday: "8:00 AM - 6:00 PM",
    wednesday: "8:00 AM - 6:00 PM",
    thursday: "8:00 AM - 6:00 PM",
    friday: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  services: [
    { name: "General Repairs", price: "From $75/hr", duration: "1-4 hours" },
    { name: "Painting", price: "From $200", duration: "Half day+" },
    { name: "Plumbing", price: "From $95/hr", duration: "1-3 hours" },
    { name: "Electrical", price: "From $95/hr", duration: "1-3 hours" },
    { name: "Flooring", price: "From $3/sqft", duration: "1-3 days" }
  ],
  bookingUrl: "https://yoursite.com/book"
};

// WebMCP Tool Definitions
const tools = [
  {
    name: "get_business_info",
    description: \`Get information about \${businessData.name}. Returns contact details, location, and overview.\`,
    handler: () => ({
      name: businessData.name,
      tagline: businessData.tagline,
      phone: businessData.phone,
      email: businessData.email,
      address: businessData.address,
      bookingUrl: businessData.bookingUrl
    })
  },
  {
    name: "get_hours",
    description: "Get the current business hours and check if the business is open right now.",
    handler: () => {
      const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
      const today = days[new Date().getDay()];
      return {
        hours: businessData.hours,
        today: today,
        todayHours: businessData.hours[today],
        isOpen: businessData.hours[today] !== "Closed"
      };
    }
  },
  {
    name: "get_services",
    description: "Get a list of all services offered with pricing and estimated duration.",
    handler: () => ({ services: businessData.services })
  },
  {
    name: "book_appointment",
    description: "Direct the user to book an appointment. Returns the booking URL.",
    handler: () => ({
      bookingUrl: businessData.bookingUrl,
      message: \`Book your appointment at \${businessData.bookingUrl}\`,
      phone: businessData.phone
    })
  }
];

// Register all tools with WebMCP
if (typeof navigator !== "undefined" && navigator.modelContext) {
  tools.forEach(tool => {
    navigator.modelContext.registerTool(
      tool.name,
      tool.description,
      { type: "object", properties: {} },
      tool.handler
    );
  });
  console.log(\`[WebMCP] \${tools.length} tools registered for \${businessData.name}\`);
}

export default tools;`,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: "🛒",
    desc: "For online stores. Let AI agents search products, check inventory, and guide purchases.",
    tools: ["search_products", "get_product", "check_inventory", "get_cart", "get_shipping_info"],
    tags: ["Shopify", "WooCommerce", "Custom Store"],
    code: `// WebMCP Template: E-commerce
// Connect to your store's API and expose products to AI agents.

const storeConfig = {
  name: "Your Store Name",
  currency: "USD",
  apiBase: "https://yourstore.com/api", // Your store API
};

const tools = [
  {
    name: "search_products",
    description: "Search for products in the store by keyword, category, or price range.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword" },
        category: { type: "string", description: "Product category" },
        maxPrice: { type: "number", description: "Maximum price in USD" }
      }
    },
    handler: async (params) => {
      // Replace with your actual product search API call
      // const res = await fetch(\`\${storeConfig.apiBase}/products?q=\${params.query}\`);
      // return await res.json();
      return {
        results: [
          { id: "1", name: "Example Product", price: 29.99, inStock: true },
          { id: "2", name: "Another Product", price: 49.99, inStock: false }
        ],
        total: 2,
        query: params.query
      };
    }
  },
  {
    name: "get_shipping_info",
    description: "Get shipping options and estimated delivery times.",
    handler: () => ({
      options: [
        { name: "Standard", price: 5.99, days: "5-7 business days" },
        { name: "Express", price: 14.99, days: "2-3 business days" },
        { name: "Overnight", price: 29.99, days: "Next business day" }
      ],
      freeShippingThreshold: 75
    })
  }
];

export default tools;`,
  },
  {
    id: "blog",
    name: "Blog / Content",
    icon: "📝",
    desc: "For content sites and blogs. Let AI find articles, summaries, and authors.",
    tools: ["search_posts", "get_post", "get_categories", "get_author", "get_related"],
    tags: ["WordPress", "Ghost", "Substack", "Custom CMS"],
    code: `// WebMCP Template: Blog / Content Site
// Expose your content to AI agents for search and retrieval.

const siteConfig = {
  name: "Your Blog Name",
  apiBase: "https://yourblog.com/wp-json/wp/v2", // WordPress REST API example
};

const tools = [
  {
    name: "search_posts",
    description: "Search blog posts by keyword or topic. Returns titles, excerpts, and URLs.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term or topic" },
        limit: { type: "number", description: "Number of results (default 5)" }
      },
      required: ["query"]
    },
    handler: async (params) => {
      // Replace with your CMS search API
      // const res = await fetch(\`\${siteConfig.apiBase}/posts?search=\${params.query}&per_page=\${params.limit || 5}\`);
      return {
        posts: [
          { title: "Example Post Title", excerpt: "A brief summary...", url: "/post/example", date: "2026-03-01" }
        ],
        query: params.query
      };
    }
  },
  {
    name: "get_categories",
    description: "Get all content categories available on this site.",
    handler: async () => {
      return {
        categories: ["Technology", "Business", "Marketing", "AI & Automation"]
      };
    }
  }
];

export default tools;`,
  },
  {
    id: "saas",
    name: "SaaS Platform",
    icon: "⚡",
    desc: "For software products. Expose pricing, features, and onboarding to AI agents.",
    tools: ["get_pricing", "get_features", "start_trial", "check_status", "get_docs"],
    tags: ["B2B SaaS", "Developer Tools", "Platforms"],
    code: `// WebMCP Template: SaaS Platform
// Let AI agents understand and sell your product.

const productConfig = {
  name: "Your SaaS Product",
  tagline: "The best tool for X",
  trialUrl: "https://yourapp.com/signup",
  docsUrl: "https://docs.yourapp.com",
  statusUrl: "https://status.yourapp.com"
};

const tools = [
  {
    name: "get_pricing",
    description: "Get pricing plans and feature comparison for this product.",
    handler: () => ({
      plans: [
        { name: "Starter", price: "$0/mo", features: ["5 projects", "Basic analytics", "Email support"] },
        { name: "Pro", price: "$29/mo", features: ["Unlimited projects", "Advanced analytics", "Priority support", "API access"] },
        { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "SSO", "SLA", "Dedicated support"] }
      ],
      trialUrl: productConfig.trialUrl
    })
  },
  {
    name: "start_trial",
    description: "Get the link to start a free trial of this product.",
    handler: () => ({
      trialUrl: productConfig.trialUrl,
      trialLength: "14 days",
      creditCardRequired: false,
      message: \`Start your free trial at \${productConfig.trialUrl}\`
    })
  },
  {
    name: "check_status",
    description: "Check the current operational status of the platform.",
    handler: async () => {
      // Optionally fetch from your status page API
      return { status: "operational", uptime: "99.98%", statusUrl: productConfig.statusUrl };
    }
  }
];

export default tools;`,
  },
  {
    id: "membership",
    name: "Membership Site",
    icon: "🔐",
    desc: "For communities and membership platforms. Manage access and content discovery.",
    tools: ["get_membership_info", "check_access", "get_content", "get_benefits", "join"],
    tags: ["Community", "Course Platform", "Subscription"],
    code: `// WebMCP Template: Membership Site
// Help AI agents guide users through your membership offering.

const membershipConfig = {
  name: "Your Community Name",
  joinUrl: "https://yoursite.com/join",
  loginUrl: "https://yoursite.com/login",
  tiers: [
    { name: "Free", price: "$0/mo", access: ["Public content", "Community forum"] },
    { name: "Member", price: "$9/mo", access: ["All free content", "Premium courses", "Live Q&A"] },
    { name: "VIP", price: "$29/mo", access: ["Everything", "1-on-1 coaching", "Private community"] }
  ]
};

const tools = [
  {
    name: "get_membership_info",
    description: "Get information about membership tiers, pricing, and benefits.",
    handler: () => ({
      name: membershipConfig.name,
      tiers: membershipConfig.tiers,
      joinUrl: membershipConfig.joinUrl
    })
  },
  {
    name: "get_benefits",
    description: "Get the full list of benefits for each membership tier.",
    parameters: {
      type: "object",
      properties: {
        tier: { type: "string", enum: ["Free", "Member", "VIP"], description: "Membership tier" }
      }
    },
    handler: (params) => {
      const tier = membershipConfig.tiers.find(t => t.name === params.tier);
      return tier || { error: "Tier not found" };
    }
  },
  {
    name: "join",
    description: "Get the link to join or upgrade membership.",
    handler: () => ({
      joinUrl: membershipConfig.joinUrl,
      message: \`Join at \${membershipConfig.joinUrl}\`
    })
  }
];

export default tools;`,
  },
];

export default function Templates() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState(TEMPLATES[0]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selected.code);
    toast.success(`${selected.name} template copied to clipboard`);
  };

  const handleOpenInSandbox = () => {
    navigate('/sandbox/webmcp');
    toast.info("Template loaded in sandbox");
  };

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
          <span className="text-xs text-muted-foreground">Template Library</span>
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
        {/* Left: Template list */}
        <div className="w-64 shrink-0 overflow-y-auto" style={{ borderRight: '1px solid #2a2a2a', background: 'oklch(0.11 0.008 265)' }}>
          <div className="p-4">
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-3">WebMCP Templates</div>
            <div className="space-y-1">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all ${
                    selected.id === t.id
                      ? 'text-foreground terminal-border-cyan'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                  style={selected.id === t.id ? { background: 'oklch(0.14 0.015 185)', border: '1px solid oklch(0.82 0.18 185 / 0.4)' } : {}}
                >
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.tools.length} tools</div>
                  </div>
                  {selected.id === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Template detail + code */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 shrink-0" style={{ borderBottom: '1px solid #2a2a2a', background: '#1a1a1a' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{selected.icon}</span>
                  <h1 className="text-lg font-bold text-foreground">{selected.name}</h1>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/40 text-primary">
                    WEBMCP
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{selected.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 border-border text-muted-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="text-xs px-3 h-7 border-border hover:border-primary hover:text-primary"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <Copy className="w-3 h-3 mr-1.5" /> COPY
                </Button>
                <Button
                  size="sm"
                  onClick={handleOpenInSandbox}
                  className="text-xs px-3 h-7 font-bold"
                  style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <ExternalLink className="w-3 h-3 mr-1.5" /> OPEN IN SANDBOX
                </Button>
              </div>
            </div>

            {/* Tools list */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase mr-1">Tools:</span>
              {selected.tools.map((tool) => (
                <code key={tool} className="text-[10px] px-1.5 py-0.5 rounded-sm text-primary"
                  style={{ background: 'oklch(0.14 0.015 185)', border: '1px solid oklch(0.82 0.18 185 / 0.2)' }}>
                  {tool}()
                </code>
              ))}
            </div>
          </div>

          {/* Code view */}
          <div className="flex-1 overflow-auto">
            <pre className="p-6 text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap"
              style={{ fontFamily: "'JetBrains Mono', monospace", background: 'oklch(0.095 0.008 265)' }}>
              {selected.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
