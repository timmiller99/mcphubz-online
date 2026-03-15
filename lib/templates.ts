export interface SiteConfig {
  siteName: string
  siteUrl: string
  apiBase: string
  // category-specific
  [key: string]: string
}

export interface Tool {
  name: string
  description: string
  params: { name: string; type: string; description: string }[]
}

export interface CategoryTemplate {
  id: string
  label: string
  color: string
  description: string
  configFields: { key: string; label: string; placeholder: string; hint?: string }[]
  tools: Tool[]
}

export const TEMPLATES: CategoryTemplate[] = [
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    color: '#22c55e',
    description: 'For online stores — let AI agents search products, check inventory, and assist with orders.',
    configFields: [
      { key: 'siteName', label: 'Store Name', placeholder: 'Acme Shop' },
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://acmeshop.com' },
      { key: 'apiBase', label: 'API Base URL', placeholder: 'https://acmeshop.com/api', hint: 'Your store\'s REST API base URL' },
      { key: 'currency', label: 'Currency Code', placeholder: 'USD' },
    ],
    tools: [
      { name: 'search_products', description: 'Search products by keyword, category, or price range', params: [{ name: 'query', type: 'string', description: 'Search term' }, { name: 'category', type: 'string', description: 'Product category (optional)' }, { name: 'max_price', type: 'number', description: 'Maximum price filter (optional)' }] },
      { name: 'get_product_details', description: 'Get full details for a specific product including price, stock, and variants', params: [{ name: 'product_id', type: 'string', description: 'Product ID or slug' }] },
      { name: 'check_inventory', description: 'Check if a product is in stock and get available quantity', params: [{ name: 'product_id', type: 'string', description: 'Product ID' }, { name: 'variant_id', type: 'string', description: 'Variant ID (optional)' }] },
      { name: 'get_order_status', description: 'Look up the status of a customer order', params: [{ name: 'order_id', type: 'string', description: 'Order ID or number' }] },
      { name: 'get_cart', description: 'Retrieve the current cart contents and total', params: [] },
    ],
  },
  {
    id: 'local-business',
    label: 'Local Business',
    color: '#3b82f6',
    description: 'For service businesses — let AI agents check availability, book appointments, and answer service questions.',
    configFields: [
      { key: 'siteName', label: 'Business Name', placeholder: 'Pro Handyman Services' },
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://prohandyman.com' },
      { key: 'apiBase', label: 'API Base URL', placeholder: 'https://prohandyman.com/api', hint: 'Your booking system API URL' },
      { key: 'serviceArea', label: 'Service Area', placeholder: 'Austin, TX' },
    ],
    tools: [
      { name: 'get_services', description: 'Get a list of all available services with pricing and descriptions', params: [] },
      { name: 'check_availability', description: 'Check available appointment slots for a service', params: [{ name: 'service', type: 'string', description: 'Service name or ID' }, { name: 'date', type: 'string', description: 'Preferred date (YYYY-MM-DD)' }] },
      { name: 'book_appointment', description: 'Book an appointment for a service', params: [{ name: 'service', type: 'string', description: 'Service name or ID' }, { name: 'date', type: 'string', description: 'Date (YYYY-MM-DD)' }, { name: 'time', type: 'string', description: 'Time slot (HH:MM)' }, { name: 'name', type: 'string', description: 'Customer name' }, { name: 'phone', type: 'string', description: 'Customer phone number' }] },
      { name: 'get_pricing', description: 'Get pricing information for services', params: [{ name: 'service', type: 'string', description: 'Service name (optional, returns all if omitted)' }] },
      { name: 'get_location_info', description: 'Get business address, hours, and contact info', params: [] },
    ],
  },
  {
    id: 'saas',
    label: 'SaaS / Membership',
    color: '#8b5cf6',
    description: 'For software products — let AI agents check subscription status, usage, and help users manage their account.',
    configFields: [
      { key: 'siteName', label: 'Product Name', placeholder: 'Acme App' },
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://acmeapp.com' },
      { key: 'apiBase', label: 'API Base URL', placeholder: 'https://api.acmeapp.com/v1', hint: 'Your authenticated API base URL' },
      { key: 'authHeader', label: 'Auth Header Name', placeholder: 'Authorization', hint: 'Header used for user auth tokens' },
    ],
    tools: [
      { name: 'get_subscription_status', description: 'Check the current subscription plan and status for the authenticated user', params: [] },
      { name: 'get_usage_stats', description: 'Get current usage metrics and limits for the user\'s plan', params: [{ name: 'metric', type: 'string', description: 'Specific metric to check (optional)' }] },
      { name: 'list_features', description: 'List all features available on the user\'s current plan', params: [] },
      { name: 'upgrade_plan', description: 'Initiate a plan upgrade for the user', params: [{ name: 'plan', type: 'string', description: 'Target plan name' }] },
      { name: 'get_billing_info', description: 'Get the user\'s billing information and upcoming invoice', params: [] },
    ],
  },
  {
    id: 'blog',
    label: 'Content / Blog',
    color: '#f59e0b',
    description: 'For content sites — let AI agents search articles, retrieve posts, and navigate your content library.',
    configFields: [
      { key: 'siteName', label: 'Site Name', placeholder: 'The AI Weekly' },
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://aiweekly.com' },
      { key: 'apiBase', label: 'API Base URL', placeholder: 'https://aiweekly.com/wp-json/wp/v2', hint: 'WordPress REST API, Ghost API, or custom endpoint' },
      { key: 'contentType', label: 'Content Type', placeholder: 'articles', hint: 'e.g. posts, articles, guides' },
    ],
    tools: [
      { name: 'search_content', description: 'Search articles and posts by keyword or topic', params: [{ name: 'query', type: 'string', description: 'Search term' }, { name: 'limit', type: 'number', description: 'Max results (default 10)' }] },
      { name: 'get_article', description: 'Retrieve the full content of a specific article', params: [{ name: 'slug', type: 'string', description: 'Article slug or ID' }] },
      { name: 'list_categories', description: 'Get all content categories and their article counts', params: [] },
      { name: 'get_latest', description: 'Get the most recently published articles', params: [{ name: 'limit', type: 'number', description: 'Number of articles to return (default 5)' }] },
      { name: 'get_author_info', description: 'Get information about a content author', params: [{ name: 'author', type: 'string', description: 'Author name or ID' }] },
    ],
  },
  {
    id: 'directory',
    label: 'Directory / Marketplace',
    color: '#06b6d4',
    description: 'For listing sites — let AI agents search listings, filter results, and retrieve detailed records.',
    configFields: [
      { key: 'siteName', label: 'Directory Name', placeholder: 'MCP Directory' },
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://mcphubz.com' },
      { key: 'apiBase', label: 'API Base URL', placeholder: 'https://mcphubz.com/api', hint: 'Your directory search API' },
      { key: 'listingType', label: 'Listing Type', placeholder: 'servers', hint: 'e.g. servers, jobs, properties, businesses' },
    ],
    tools: [
      { name: 'search_listings', description: 'Search directory listings by keyword and filters', params: [{ name: 'query', type: 'string', description: 'Search term' }, { name: 'category', type: 'string', description: 'Category filter (optional)' }, { name: 'limit', type: 'number', description: 'Max results' }] },
      { name: 'get_listing_details', description: 'Get full details for a specific listing', params: [{ name: 'id', type: 'string', description: 'Listing ID or slug' }] },
      { name: 'list_categories', description: 'Get all available categories with listing counts', params: [] },
      { name: 'get_featured', description: 'Get featured or top-rated listings', params: [{ name: 'limit', type: 'number', description: 'Number to return (default 10)' }] },
      { name: 'submit_inquiry', description: 'Submit a contact inquiry about a listing', params: [{ name: 'listing_id', type: 'string', description: 'Listing ID' }, { name: 'message', type: 'string', description: 'Inquiry message' }, { name: 'email', type: 'string', description: 'Contact email' }] },
    ],
  },
  {
    id: 'agency',
    label: 'Agency / Portfolio',
    color: '#ec4899',
    description: 'For agencies and freelancers — let AI agents explore your work, get service info, and request quotes.',
    configFields: [
      { key: 'siteName', label: 'Agency Name', placeholder: 'Digital Roks Agency' },
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://digitalroks.com' },
      { key: 'apiBase', label: 'API Base URL', placeholder: 'https://digitalroks.com/api', hint: 'Your contact/booking API (optional)' },
      { key: 'specialty', label: 'Primary Specialty', placeholder: 'AI Automation & Web Development' },
    ],
    tools: [
      { name: 'get_services', description: 'Get a list of all services offered with descriptions and pricing', params: [] },
      { name: 'get_portfolio', description: 'Browse portfolio projects with details and results', params: [{ name: 'category', type: 'string', description: 'Filter by project type (optional)' }] },
      { name: 'request_quote', description: 'Submit a project quote request', params: [{ name: 'service', type: 'string', description: 'Service needed' }, { name: 'description', type: 'string', description: 'Project description' }, { name: 'email', type: 'string', description: 'Contact email' }] },
      { name: 'book_consultation', description: 'Schedule a free discovery call', params: [{ name: 'name', type: 'string', description: 'Your name' }, { name: 'email', type: 'string', description: 'Your email' }, { name: 'message', type: 'string', description: 'Brief project description' }] },
      { name: 'get_team', description: 'Get information about the team members and their expertise', params: [] },
    ],
  },
]

export function generateTemplate(template: CategoryTemplate, config: SiteConfig): string {
  const toolRegistrations = template.tools.map(tool => {
    const paramsSchema = tool.params.length > 0
      ? `\n      parameters: {\n${tool.params.map(p => `        ${p.name}: { type: '${p.type}', description: '${p.description}' }`).join(',\n')}\n      },`
      : ''

    const paramDestructure = tool.params.length > 0
      ? `{ ${tool.params.map(p => p.name).join(', ')} }`
      : '_params'

    return `  // Tool: ${tool.name}
  navigator.modelContext.registerTool({
    name: '${tool.name}',
    description: '${tool.description}',${paramsSchema}
    handler: async (${paramDestructure}) => {
      // TODO: Replace with your actual implementation
      const res = await fetch(\`\${CONFIG.apiBase}/${tool.name.replace(/_/g, '-')}?\${new URLSearchParams(${tool.params.length > 0 ? `{ ${tool.params.map(p => `${p.name}: String(${p.name} ?? '')`).join(', ')} }` : '{}'})}\`, {
        headers: CONFIG.defaultHeaders,
      })
      if (!res.ok) throw new Error(\`${tool.name} failed: \${res.status}\`)
      return await res.json()
    }
  })`
  }).join('\n\n')

  return `/**
 * WebMCP Template: ${template.label}
 * Site: ${config.siteName || 'Your Site'}
 * Generated by MCPHubz Sandbox — mcphubz.online
 * Spec: https://mcphubz.com/webmcp
 *
 * HOW TO USE:
 * 1. Replace the handler fetch calls with your actual API logic
 * 2. Add this script to your site's <head> or load it as a module
 * 3. Submit your site to the MCPHubz WebMCP-Ready Registry
 *    at https://mcphubz.com/webmcp-ready
 */

(function() {
  'use strict'

  // ─── Site Configuration ────────────────────────────────────────────────────
  const CONFIG = {
    siteName: '${config.siteName || 'Your Site'}',
    siteUrl: '${config.siteUrl || 'https://yoursite.com'}',
    apiBase: '${config.apiBase || 'https://yoursite.com/api'}',
    defaultHeaders: {
      'Content-Type': 'application/json',
      // Add your auth headers here if needed:
      // 'Authorization': 'Bearer YOUR_TOKEN',
    },
  }

  // ─── WebMCP Registration ───────────────────────────────────────────────────
  // WebMCP is currently in Chrome Canary (flag: #enable-experimental-web-platform-features)
  // Stable rollout expected mid-2026. This check ensures safe loading in all browsers.

  if (!('modelContext' in navigator)) {
    console.info('[WebMCP] navigator.modelContext not available in this browser. WebMCP tools will not be registered.')
    return
  }

${toolRegistrations}

  console.info(\`[WebMCP] ${config.siteName || 'Site'} — ${template.tools.length} tools registered for AI agents.\`)

})()
`
}
