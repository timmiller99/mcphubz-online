/*
 * MCPHubz Sandbox — Templates Page
 * 6 production WebMCP templates — food delivery, ecommerce, saas, booking, healthcare, real estate
 * Supports ?t=<template-id> from mcphubz.com "Try in Sandbox" links
 */
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { MCPHubzLogo } from "@/components/MCPHubzLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, Copy, ExternalLink, Terminal, CheckCircle2, Package } from "lucide-react";
import { encodeToolToUrl } from "@/hooks/useSavedTools";

const WEBMCP_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-webmcp-icon-KUzFEUyjRezt9fUm3JDHby.webp";

const TEMPLATES = [
  {
    id: "food-delivery",
    name: "Food Delivery",
    icon: "🍔",
    desc: "Restaurant ordering — menu search, delivery check, promotions, order placement, and tracking. Works for any restaurant or food service.",
    tools: ["get_restaurant_info", "get_menu", "search_menu", "check_delivery", "get_promotions", "place_order", "track_order"],
    tags: ["Restaurants", "Ghost Kitchens", "Food Trucks", "Delivery Apps"],
    npx: "npx @mcphubz/webmcp-templates food-delivery",
    code: `// MCPHubz WebMCP Template: Food Delivery
// Source: github.com/mcphubz/webmcp-templates
// Docs: mcphubz.com/templates
//
// Customize the config object below, then paste this
// script tag in your site's <head>.

(function () {
  if (!navigator.modelContext) return; // safe no-op until Chrome stable

  // ── Your restaurant config ────────────────────────────────
  const config = {
    name: "The Ember Kitchen",
    tagline: "Wood-fired comfort food, delivered fresh",
    cuisine: ["American", "BBQ"],
    address: "412 Oak Street, Austin TX 78701",
    phone: "+1 (512) 555-0147",
    hours: {
      monday: "11am-9pm", tuesday: "11am-9pm",
      wednesday: "11am-9pm", thursday: "11am-10pm",
      friday: "11am-11pm", saturday: "10am-11pm",
      sunday: "10am-8pm",
    },
    delivery: {
      available: true, min_order: 15, fee: 3.99,
      free_above: 45, eta_min: 30, eta_max: 50,
      zips: ["78701","78702","78703","78704","78705"],
    },
    pickup: { available: true, eta: 20 },
    menu: [
      { id: "brisket", name: "Smoked Brisket Plate", price: 22, category: "BBQ Plates",
        description: "12-hour oak-smoked brisket. Served with two sides.", popular: true },
      { id: "pulled-pork", name: "Pulled Pork Plate", price: 18, category: "BBQ Plates",
        description: "Low-and-slow smoked pork shoulder, hand-pulled." },
      { id: "veggie", name: "Smoked Veggie Plate", price: 16, category: "BBQ Plates",
        description: "Wood-smoked portobello, cauliflower, seasonal veg.",
        dietary: ["vegetarian","vegan","gluten-free"] },
      { id: "mac", name: "Smoked Mac & Cheese", price: 7, category: "Sides",
        description: "Three-cheese mac, smoky crust.", dietary: ["vegetarian"], popular: true },
      { id: "sandwich", name: "Brisket Sandwich", price: 16, category: "Sandwiches",
        description: "Thick-cut brisket on a toasted brioche bun.", popular: true },
      { id: "tea", name: "Sweet Tea", price: 3.5, category: "Drinks",
        description: "Freshly brewed Southern sweet tea, 32 oz." },
    ],
    promotions: [
      { title: "Weekday Lunch Special", code: "LUNCH",
        description: "Sandwich + side + drink for $19.99, Mon–Fri 11am–2pm." },
    ],
    order_webhook: "", // set your order endpoint
  };

  // ── Context ───────────────────────────────────────────────
  navigator.modelContext.provideContext({
    type: "restaurant",
    name: config.name,
    description: config.tagline,
    cuisine: config.cuisine,
    address: config.address,
    phone: config.phone,
    delivery_available: config.delivery.available,
    pickup_available: config.pickup.available,
  });

  // ── Helpers ───────────────────────────────────────────────
  function todayHours() {
    const day = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
    return config.hours[day] || "Closed";
  }

  // ── Tools ─────────────────────────────────────────────────

  navigator.modelContext.registerTool("get_restaurant_info", {
    description: "Get restaurant hours, location, cuisine, and ordering options",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    name: config.name,
    tagline: config.tagline,
    cuisine: config.cuisine,
    address: config.address,
    phone: config.phone,
    hours_today: todayHours(),
    full_hours: config.hours,
    delivery: { ...config.delivery, eta: config.delivery.eta_min + "–" + config.delivery.eta_max + " min" },
    pickup: config.pickup,
  }));

  navigator.modelContext.registerTool("get_menu", {
    description: "Get the menu, optionally filtered by category",
    parameters: {
      type: "object",
      properties: { category: { type: "string", description: "Menu category to filter by" } },
    },
  }, async ({ category } = {}) => {
    const items = category
      ? config.menu.filter(i => i.category.toLowerCase() === category.toLowerCase())
      : config.menu;
    const byCategory = {};
    items.forEach(i => (byCategory[i.category] ||= []).push(i));
    return { restaurant: config.name, menu: byCategory, total_items: items.length };
  });

  navigator.modelContext.registerTool("search_menu", {
    description: "Search menu by name, ingredient, or dietary tag",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "Search term (e.g. 'vegan', 'brisket', 'gluten-free')" } },
      required: ["query"],
    },
  }, async ({ query }) => {
    const q = query.toLowerCase();
    const results = config.menu.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.dietary || []).some(d => d.includes(q))
    );
    return { query, results, count: results.length };
  });

  navigator.modelContext.registerTool("check_delivery", {
    description: "Check if delivery is available to a zip code, and get the fee and ETA",
    parameters: {
      type: "object",
      properties: { zip: { type: "string", description: "Delivery zip code" } },
      required: ["zip"],
    },
  }, async ({ zip }) => {
    if (!config.delivery.available) return { available: false };
    const ok = !config.delivery.zips || config.delivery.zips.includes(zip);
    if (!ok) return { available: false, reason: "Outside current delivery area" };
    return {
      available: true, zip,
      minimum_order: "$" + config.delivery.min_order,
      fee: config.delivery.fee === 0 ? "Free" : "$" + config.delivery.fee,
      free_above: config.delivery.free_above ? "$" + config.delivery.free_above : null,
      eta: config.delivery.eta_min + "–" + config.delivery.eta_max + " minutes",
    };
  });

  navigator.modelContext.registerTool("get_promotions", {
    description: "Get current promotions and discount codes",
    parameters: { type: "object", properties: {} },
  }, async () => ({ promotions: config.promotions }));

  navigator.modelContext.registerTool("place_order", {
    description: "Submit a delivery or pickup order",
    parameters: {
      type: "object",
      properties: {
        items: { type: "array", description: "Array of {item_id, quantity}" },
        order_type: { type: "string", enum: ["delivery", "pickup"] },
        delivery_address: { type: "string" },
        customer_name: { type: "string" },
        customer_phone: { type: "string" },
      },
      required: ["items", "order_type", "customer_name", "customer_phone"],
    },
  }, async (args) => {
    const confirmed = await navigator.modelContext.requestUserInteraction({
      type: "confirm",
      message: "Place this order at " + config.name + "?",
    });
    if (!confirmed) return { status: "cancelled" };
    if (config.order_webhook) {
      const res = await fetch(config.order_webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      return await res.json();
    }
    return { status: "call_to_confirm", phone: config.phone,
      message: "Order received. Call to confirm: " + config.phone };
  });

  navigator.modelContext.registerTool("track_order", {
    description: "Check the status of an existing order",
    parameters: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"],
    },
  }, async ({ order_id }) => ({
    order_id, status: "in_progress",
    message: "For live tracking, call " + config.phone,
  }));

  console.log("[MCPHubz WebMCP] food-delivery template registered — 7 tools");
})();`,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: "🛒",
    desc: "Online store AI agent — product search, stock check, shipping estimates, featured products, and checkout flow.",
    tools: ["search_products", "get_product", "get_shipping_estimate", "get_return_policy", "get_featured_products", "start_checkout"],
    tags: ["Shopify", "WooCommerce", "D2C Brands", "Custom Stores"],
    npx: "npx @mcphubz/webmcp-templates ecommerce",
    code: `// MCPHubz WebMCP Template: E-commerce
// Source: github.com/mcphubz/webmcp-templates
// Docs: mcphubz.com/templates

(function () {
  if (!navigator.modelContext) return;

  const config = {
    store_name: "Northbound Supply Co.",
    description: "Premium outdoor gear for serious adventurers",
    currency: "USD",
    return_policy: "Free returns within 60 days. Items must be unused in original packaging.",
    support_email: "support@yourstore.com",
    checkout_url: "https://yourstore.com/checkout",
    shipping: [
      { zone: "US", rate: 7.99, free_above: 75, days: "3–7 business days" },
      { zone: "Canada", rate: 14.99, free_above: 150, days: "5–12 business days" },
      { zone: "International", rate: 24.99, days: "10–21 business days" },
    ],
    products: [
      { id: "alp-jacket", name: "Alpine Shell Jacket", price: 389, category: "Outerwear",
        description: "3-layer Gore-Tex Pro shell. Seam-sealed, helmet hood, RECCO reflector.",
        tags: ["waterproof","gore-tex","hiking"], in_stock: true, rating: 4.8, featured: true },
      { id: "trail-pack", name: "Trail Runner 40L Pack", price: 175, compare_at: 210,
        category: "Packs", description: "Lightweight 40L pack for long trails. 3.2 lbs.",
        tags: ["backpack","ultralight","hiking"], in_stock: true, rating: 4.9, featured: true },
      { id: "merino-top", name: "Merino 200 Base Layer", price: 89, category: "Base Layers",
        description: "175gsm Merino wool. Odor-resistant, moisture-wicking.",
        tags: ["merino","wool","base layer"], in_stock: true, rating: 4.7 },
      { id: "trek-poles", name: "Carbon Trekking Poles", price: 145, category: "Accessories",
        description: "100% carbon fiber, cork grips. 14.5 oz/pair.",
        tags: ["trekking poles","ultralight"], in_stock: true, rating: 4.6 },
      { id: "trail-shoes", name: "Peak Trail Shoes", price: 165, category: "Footwear",
        description: "Vibram Megagrip + Gore-Tex. 6mm drop.",
        tags: ["trail shoes","waterproof"], in_stock: true, rating: 4.7, featured: true },
    ],
  };

  navigator.modelContext.provideContext({
    type: "store", name: config.store_name,
    description: config.description, currency: config.currency,
  });

  navigator.modelContext.registerTool("search_products", {
    description: "Search products by keyword, category, or price range",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string" },
        max_price: { type: "number" },
        in_stock_only: { type: "boolean" },
      },
    },
  }, async ({ query, category, max_price, in_stock_only = true } = {}) => {
    let items = config.products;
    if (in_stock_only) items = items.filter(p => p.in_stock);
    if (category) items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (max_price) items = items.filter(p => p.price <= max_price);
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.includes(q))
      ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return { results: items.slice(0, 10), total: items.length };
  });

  navigator.modelContext.registerTool("get_product", {
    description: "Get full product details by ID",
    parameters: { type: "object", properties: { product_id: { type: "string" } }, required: ["product_id"] },
  }, async ({ product_id }) =>
    config.products.find(p => p.id === product_id) || { error: "Product not found" }
  );

  navigator.modelContext.registerTool("get_shipping_estimate", {
    description: "Get shipping cost and delivery estimate",
    parameters: {
      type: "object",
      properties: {
        country: { type: "string", description: "2-letter country code (US, CA, GB...)" },
        order_total: { type: "number" },
      },
      required: ["country"],
    },
  }, async ({ country, order_total = 0 }) => {
    const isUS = country === "US", isCA = country === "CA";
    const zone = isUS ? config.shipping[0] : isCA ? config.shipping[1] : config.shipping[2];
    const free = zone.free_above && order_total >= zone.free_above;
    return { zone: zone.zone, cost: free ? "Free" : "$" + zone.rate,
      free_shipping_on: zone.free_above ? "Orders over $" + zone.free_above : null,
      estimated_delivery: zone.days };
  });

  navigator.modelContext.registerTool("get_return_policy", {
    description: "Get the return and refund policy",
    parameters: { type: "object", properties: {} },
  }, async () => ({ policy: config.return_policy, support: config.support_email }));

  navigator.modelContext.registerTool("get_featured_products", {
    description: "Get featured and bestselling products",
    parameters: { type: "object", properties: { limit: { type: "number" } } },
  }, async ({ limit = 4 } = {}) =>
    config.products.filter(p => p.featured).slice(0, limit)
  );

  navigator.modelContext.registerTool("start_checkout", {
    description: "Initiate checkout for selected products",
    parameters: {
      type: "object",
      properties: { items: { type: "array", description: "Array of {product_id, quantity}" } },
      required: ["items"],
    },
  }, async (args) => {
    const ok = await navigator.modelContext.requestUserInteraction({
      type: "confirm", message: "Proceed to checkout at " + config.store_name + "?",
    });
    if (!ok) return { status: "cancelled" };
    window.location.href = config.checkout_url;
    return { status: "redirecting", url: config.checkout_url };
  });

  console.log("[MCPHubz WebMCP] ecommerce template registered — 6 tools");
})();`,
  },
  {
    id: "saas",
    name: "SaaS Platform",
    icon: "⚡",
    desc: "Software product AI agent — plan comparison, feature lookup, trial info, support links, and signup flow.",
    tools: ["get_product_info", "list_plans", "compare_plans", "check_feature", "get_trial_info", "get_support", "start_signup"],
    tags: ["B2B SaaS", "Developer Tools", "Platforms", "Marketplaces"],
    npx: "npx @mcphubz/webmcp-templates saas",
    code: `// MCPHubz WebMCP Template: SaaS Platform
// Source: github.com/mcphubz/webmcp-templates
// Docs: mcphubz.com/templates

(function () {
  if (!navigator.modelContext) return;

  const config = {
    product_name: "Flowmatic",
    tagline: "Automate your team's workflows in minutes, not months",
    description: "No-code workflow automation that connects 500+ apps without touching code.",
    category: "Workflow Automation",
    key_benefits: [
      "Connect 500+ apps with pre-built integrations",
      "Drag-and-drop editor — no code needed",
      "AI-powered workflow suggestions",
      "SOC 2 Type II certified",
    ],
    trial_days: 14, trial_requires_card: false,
    signup_url: "https://yourapp.com/signup",
    support_email: "support@yourapp.com",
    docs_url: "https://docs.yourapp.com",
    status_url: "https://status.yourapp.com",
    plans: [
      { id: "free", name: "Free", price: 0, currency: "USD",
        features: ["5 active workflows", "1,000 task runs/month", "3 apps", "Community support"],
        limits: { workflows: 5, task_runs: 1000 } },
      { id: "pro", name: "Pro", price: 49, annual: 39, currency: "USD", highlighted: true,
        features: ["Unlimited workflows", "25,000 task runs/month", "Unlimited apps",
          "Advanced branching", "Email + chat support", "Version history"],
        limits: { task_runs: 25000 } },
      { id: "business", name: "Business", price: 149, annual: 119, currency: "USD",
        features: ["Everything in Pro", "100,000 task runs/month", "Team roles",
          "AI suggestions", "Priority support 4hr SLA", "Audit logs", "SSO/SAML"],
        limits: { task_runs: 100000 } },
      { id: "enterprise", name: "Enterprise", price: null, currency: "USD",
        features: ["Everything in Business", "Unlimited runs", "Custom integrations",
          "Dedicated CSM", "On-premise option", "SLA + compliance reports"],
        limits: {} },
    ],
  };

  navigator.modelContext.provideContext({
    type: "software", name: config.product_name,
    description: config.description, category: config.category,
    trial_days: config.trial_days, plans: config.plans.map(p => p.name),
  });

  navigator.modelContext.registerTool("get_product_info", {
    description: "Get product overview, key benefits, and quick links",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    name: config.product_name, tagline: config.tagline,
    description: config.description, key_benefits: config.key_benefits,
    trial: { days: config.trial_days, requires_card: config.trial_requires_card },
    links: { signup: config.signup_url, docs: config.docs_url, status: config.status_url },
  }));

  navigator.modelContext.registerTool("list_plans", {
    description: "List all pricing plans with features",
    parameters: {
      type: "object",
      properties: { billing: { type: "string", enum: ["monthly", "annual"] } },
    },
  }, async ({ billing = "monthly" } = {}) => ({
    billing,
    plans: config.plans.map(p => ({
      id: p.id, name: p.name, highlighted: p.highlighted,
      price: p.price === null ? "Contact us" : p.price === 0 ? "Free"
        : (billing === "annual" && p.annual ? "$" + p.annual : "$" + p.price) + "/mo",
      savings: billing === "annual" && p.annual
        ? "Save " + Math.round((1 - p.annual / p.price) * 100) + "%" : null,
      features: p.features,
      signup_url: config.signup_url + "?plan=" + p.id,
    })),
  }));

  navigator.modelContext.registerTool("compare_plans", {
    description: "Side-by-side feature comparison of two plans",
    parameters: {
      type: "object",
      properties: { plan_ids: { type: "array", items: { type: "string" } } },
      required: ["plan_ids"],
    },
  }, async ({ plan_ids }) => {
    const plans = plan_ids.map(id => config.plans.find(p => p.id === id)).filter(Boolean);
    const all = [...new Set(plans.flatMap(p => p.features))];
    return {
      comparison: all.map(f => ({
        feature: f,
        ...Object.fromEntries(plans.map(p => [p.name, p.features.includes(f) ? "✓" : "—"])),
      })),
    };
  });

  navigator.modelContext.registerTool("check_feature", {
    description: "Check which plans include a specific feature",
    parameters: {
      type: "object",
      properties: { feature: { type: "string" } },
      required: ["feature"],
    },
  }, async ({ feature }) => {
    const q = feature.toLowerCase();
    return {
      feature,
      available_in: config.plans
        .filter(p => p.features.some(f => f.toLowerCase().includes(q)))
        .map(p => p.name),
    };
  });

  navigator.modelContext.registerTool("get_trial_info", {
    description: "Get free trial details",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    available: true, duration_days: config.trial_days,
    requires_card: config.trial_requires_card, signup_url: config.signup_url,
  }));

  navigator.modelContext.registerTool("get_support", {
    description: "Get support and documentation links",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    email: config.support_email, docs: config.docs_url, status: config.status_url,
  }));

  navigator.modelContext.registerTool("start_signup", {
    description: "Get signup URL or navigate to signup page",
    parameters: {
      type: "object",
      properties: { plan_id: { type: "string" } },
    },
  }, async ({ plan_id } = {}) => {
    const url = plan_id ? config.signup_url + "?plan=" + plan_id : config.signup_url;
    return { url, message: "Start your " + config.trial_days + "-day free trial — no card required." };
  });

  console.log("[MCPHubz WebMCP] saas template registered — 7 tools");
})();`,
  },
  {
    id: "booking",
    name: "Booking & Reservations",
    icon: "🏨",
    desc: "Hotel, spa, salon, or clinic AI concierge — room/service listing, availability check, reservation submission, and policy info.",
    tools: ["get_business_info", "list_services", "check_availability", "get_cancellation_policy", "make_reservation"],
    tags: ["Hotels", "Vacation Rentals", "Spas", "Salons", "Gyms", "Coworking"],
    npx: "npx @mcphubz/webmcp-templates booking",
    code: `// MCPHubz WebMCP Template: Booking & Reservations
// Source: github.com/mcphubz/webmcp-templates
// Docs: mcphubz.com/templates

(function () {
  if (!navigator.modelContext) return;

  const config = {
    name: "The Lakeview Inn",
    type: "hotel",
    description: "Boutique lakefront inn. 18 rooms, full spa, farm-to-table dining.",
    address: "88 Lakeshore Drive, Lake Placid NY 12946",
    phone: "+1 (518) 555-0231",
    email: "reservations@lakeviewinn.example.com",
    check_in: "3:00 PM", check_out: "11:00 AM",
    booking_url: "https://yoursite.com/book",
    cancellation_policy: "Free cancellation up to 72 hours before check-in. Within 72 hours: first night forfeited.",
    amenities: ["Private lakefront beach","Full spa","Heated pool","Farm-to-table restaurant","Free Wi-Fi","Free parking"],
    services: [
      { id: "lake-king", name: "Lakeview King Room", price_per_night: 289,
        description: "Panoramic lake views, fireplace, private balcony. Breakfast included.",
        capacity: 2, amenities: ["Lake view","Fireplace","Balcony","Breakfast"] },
      { id: "garden-queen", name: "Garden View Queen", price_per_night: 189,
        description: "Bright room overlooking gardens.",
        capacity: 2, amenities: ["Garden view","Queen bed","Coffee station"] },
      { id: "lakefront-suite", name: "Lakefront Suite", price_per_night: 489,
        description: "Separate living room, soaking tub, direct lake access.",
        capacity: 4, amenities: ["Lake access","Living room","Soaking tub","Fireplace","Breakfast"] },
      { id: "spa-day", name: "Spa Day Pass", price_per_session: 149,
        description: "Full spa + steam room + 60-min treatment.",
        amenities: ["Pool access","Steam room","60-min massage or facial"] },
    ],
  };

  navigator.modelContext.provideContext({
    type: config.type, name: config.name,
    description: config.description, location: config.address,
    phone: config.phone, email: config.email,
  });

  navigator.modelContext.registerTool("get_business_info", {
    description: "Get location, amenities, check-in times, and policies",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    name: config.name, type: config.type, description: config.description,
    address: config.address, phone: config.phone, email: config.email,
    check_in: config.check_in, check_out: config.check_out,
    amenities: config.amenities, cancellation: config.cancellation_policy,
  }));

  navigator.modelContext.registerTool("list_services", {
    description: "List available rooms, services, or experiences with pricing",
    parameters: { type: "object", properties: {} },
  }, async () => ({ services: config.services }));

  navigator.modelContext.registerTool("check_availability", {
    description: "Check availability for specific dates",
    parameters: {
      type: "object",
      properties: {
        check_in: { type: "string", description: "Check-in date YYYY-MM-DD" },
        check_out: { type: "string", description: "Check-out date YYYY-MM-DD" },
        service_id: { type: "string" }, guests: { type: "number" },
      },
      required: ["check_in"],
    },
  }, async (args) => ({
    note: "Contact us to check live availability for your dates.",
    check_in: args.check_in, check_out: args.check_out,
    contact: { phone: config.phone, email: config.email },
    book_online: config.booking_url,
  }));

  navigator.modelContext.registerTool("get_cancellation_policy", {
    description: "Get the cancellation and refund policy",
    parameters: { type: "object", properties: {} },
  }, async () => ({ policy: config.cancellation_policy, contact: config.email }));

  navigator.modelContext.registerTool("make_reservation", {
    description: "Submit a booking request",
    parameters: {
      type: "object",
      properties: {
        service_id: { type: "string" }, check_in: { type: "string" },
        check_out: { type: "string" }, guests: { type: "number" },
        guest_name: { type: "string" }, guest_email: { type: "string" },
        special_requests: { type: "string" },
      },
      required: ["check_in", "guest_name", "guest_email"],
    },
  }, async (args) => {
    const ok = await navigator.modelContext.requestUserInteraction({
      type: "confirm", message: "Confirm reservation request at " + config.name + "?",
    });
    if (!ok) return { status: "cancelled" };
    window.location.href = config.booking_url;
    return { status: "redirecting", url: config.booking_url };
  });

  console.log("[MCPHubz WebMCP] booking template registered — 5 tools");
})();`,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    desc: "Medical practice AI front desk — insurance check, service listing, appointment booking, and telehealth info. HIPAA-friendly by design.",
    tools: ["get_practice_info", "get_services", "check_insurance", "book_appointment", "get_telehealth_info", "get_location"],
    tags: ["Family Medicine", "Dental", "Mental Health", "Clinics", "Telehealth"],
    npx: "npx @mcphubz/webmcp-templates healthcare",
    code: `// MCPHubz WebMCP Template: Healthcare
// Source: github.com/mcphubz/webmcp-templates
// Docs: mcphubz.com/templates
// Note: No PHI is collected by this template.
//       Tools redirect to your secure scheduling system.

(function () {
  if (!navigator.modelContext) return;

  const config = {
    name: "Clearwater Family Medicine",
    specialty: ["Family Medicine","Primary Care","Preventive Care"],
    description: "Patient-centered family medicine. Same-day sick appointments available.",
    address: "204 Clearwater Blvd Suite 110, Clearwater FL 33755",
    phone: "+1 (727) 555-0188",
    scheduling_phone: "+1 (727) 555-0100",
    scheduling_url: "https://yoursite.com/schedule",
    patient_portal: "https://portal.yoursite.com",
    telehealth_available: true,
    telehealth_url: "https://telehealth.yoursite.com",
    new_patients: true,
    hours: {
      monday: "8am-5pm", tuesday: "8am-5pm",
      wednesday: "8am-7pm", thursday: "8am-5pm",
      friday: "8am-4pm", saturday: "9am-12pm", sunday: "Closed",
    },
    accepted_insurance: [
      "Aetna","Blue Cross Blue Shield","Cigna","Florida Blue","Humana",
      "Medicare","Medicare Advantage","United Healthcare","Medicaid","Tricare",
    ],
    services: [
      { id: "physical", name: "Annual Physical", duration: 60, telehealth: false,
        description: "Comprehensive wellness exam, vitals, blood work, health plan." },
      { id: "sick", name: "Sick Visit", duration: 20, telehealth: true,
        description: "Same-day/next-day for acute illness, infections, urgent concerns." },
      { id: "chronic", name: "Chronic Disease Management", duration: 30, telehealth: true,
        description: "Ongoing care for diabetes, hypertension, asthma, thyroid." },
      { id: "pediatric", name: "Pediatric Well Visit", duration: 45, telehealth: false,
        description: "Well-child exams, vaccines, developmental screening." },
      { id: "telehealth", name: "Telehealth Consultation", duration: 15, telehealth: true,
        description: "Video visit for follow-ups, minor illness, Rx renewals." },
    ],
  };

  navigator.modelContext.provideContext({
    type: "healthcare_provider", name: config.name,
    specialty: config.specialty, description: config.description,
    location: config.address, phone: config.phone,
    new_patients: config.new_patients, telehealth: config.telehealth_available,
    accepted_insurance: config.accepted_insurance,
  });

  navigator.modelContext.registerTool("get_practice_info", {
    description: "Get practice details, hours, and patient info",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    name: config.name, specialty: config.specialty,
    description: config.description, address: config.address,
    phone: config.phone, hours: config.hours,
    new_patients: config.new_patients ? "Accepting new patients" : "Not currently accepting",
    telehealth: config.telehealth_available ? "Available" : "Not available",
  }));

  navigator.modelContext.registerTool("get_services", {
    description: "List all services and treatments offered",
    parameters: {
      type: "object",
      properties: { telehealth_only: { type: "boolean" } },
    },
  }, async ({ telehealth_only = false } = {}) => ({
    services: (telehealth_only ? config.services.filter(s => s.telehealth) : config.services)
      .map(s => ({ ...s, duration: s.duration + " minutes" })),
  }));

  navigator.modelContext.registerTool("check_insurance", {
    description: "Check if an insurance plan is accepted",
    parameters: {
      type: "object",
      properties: { insurance: { type: "string", description: "Insurance provider name" } },
      required: ["insurance"],
    },
  }, async ({ insurance }) => {
    const q = insurance.toLowerCase();
    const match = config.accepted_insurance.find(i => i.toLowerCase().includes(q));
    return {
      insurance, accepted: !!match, matched: match || null,
      all_accepted: config.accepted_insurance,
      note: !match ? "We may accept additional plans. Call to verify: " + config.phone : null,
    };
  });

  navigator.modelContext.registerTool("book_appointment", {
    description: "Get scheduling info or redirect to online booking",
    parameters: {
      type: "object",
      properties: {
        service: { type: "string" },
        preferred_date: { type: "string" },
        is_new_patient: { type: "boolean" },
      },
    },
  }, async ({ service } = {}) => {
    if (config.scheduling_url) {
      return { booking_url: config.scheduling_url,
        message: "Book online for fastest scheduling — " + config.scheduling_url };
    }
    return { call: config.scheduling_phone || config.phone };
  });

  navigator.modelContext.registerTool("get_telehealth_info", {
    description: "Get telehealth availability and how to connect",
    parameters: { type: "object", properties: {} },
  }, async () => {
    if (!config.telehealth_available) return { available: false };
    return {
      available: true, platform: config.telehealth_url,
      telehealth_services: config.services.filter(s => s.telehealth).map(s => s.name),
      schedule: config.scheduling_url || config.phone,
    };
  });

  navigator.modelContext.registerTool("get_location", {
    description: "Get address and directions",
    parameters: { type: "object", properties: {} },
  }, async () => ({
    address: config.address, phone: config.phone,
    maps: "https://maps.google.com/?q=" + encodeURIComponent(config.address),
  }));

  console.log("[MCPHubz WebMCP] healthcare template registered — 6 tools");
})();`,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏠",
    desc: "Property search AI agent — listing search, mortgage calculator, showing scheduling, and agent contact. Works for any agency or brokerage.",
    tools: ["search_listings", "get_listing", "calculate_mortgage", "schedule_showing", "get_agent_info"],
    tags: ["Residential Agents", "Brokerages", "Property Managers", "Rentals"],
    npx: "npx @mcphubz/webmcp-templates real-estate",
    code: `// MCPHubz WebMCP Template: Real Estate
// Source: github.com/mcphubz/webmcp-templates
// Docs: mcphubz.com/templates

(function () {
  if (!navigator.modelContext) return;

  const config = {
    agency: "Meridian Realty Group",
    description: "Austin's trusted real estate team since 2008.",
    phone: "+1 (512) 555-0342",
    email: "hello@meridianrealty.example.com",
    market_areas: ["Austin","Round Rock","Cedar Park","Pflugerville"],
    currency: "USD",
    contact_webhook: "", // optional: POST showing requests here
    agent: {
      name: "Carlos Ruiz", title: "Broker / Team Lead",
      phone: "+1 (512) 555-0343", email: "carlos@meridianrealty.example.com",
    },
    listings: [
      { id: "lst-001", address: "4218 Oak Hill Drive", city: "Austin", state: "TX", zip: "78746",
        price: 625000, beds: 4, baths: 2.5, sqft: 2480, year_built: 2008,
        type: "single-family", status: "active",
        description: "Updated 4/2.5 in top-rated Eanes ISD. Open floor plan, chef's kitchen, hardwood floors. No HOA.",
        features: ["Chef's kitchen","Hardwood floors","Covered patio","3-car garage","No HOA","Eanes ISD"],
        days_on_market: 7, mls: "MLS-9841201" },
      { id: "lst-002", address: "2901 Pecos Street #304", city: "Austin", state: "TX", zip: "78703",
        price: 445000, beds: 2, baths: 2, sqft: 1120, year_built: 2019,
        type: "condo", status: "active",
        description: "Modern 2/2 in Clarksville. Floor-to-ceiling windows, rooftop pool.",
        features: ["Floor-to-ceiling windows","Rooftop pool","Private balcony","Walkable"],
        hoa: 425, days_on_market: 14, mls: "MLS-9836004" },
      { id: "lst-003", address: "812 Thornton Road", city: "Round Rock", state: "TX", zip: "78681",
        price: 389000, beds: 3, baths: 2, sqft: 1850, year_built: 2015,
        type: "single-family", status: "active",
        description: "Move-in ready 3/2. Updated kitchen, large master suite.",
        features: ["Updated kitchen","2-car garage","Quiet neighborhood"],
        days_on_market: 3, mls: "MLS-9844892" },
    ],
  };

  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency, maximumFractionDigits: 0 }).format(n);

  navigator.modelContext.provideContext({
    type: "real_estate_agency", name: config.agency,
    description: config.description, market_areas: config.market_areas,
    active_listings: config.listings.filter(l => l.status === "active").length,
  });

  navigator.modelContext.registerTool("search_listings", {
    description: "Search property listings by price, beds, city, or type",
    parameters: {
      type: "object",
      properties: {
        max_price: { type: "number" }, min_price: { type: "number" },
        min_beds: { type: "number" }, city: { type: "string" },
        property_type: { type: "string" }, status: { type: "string" },
      },
    },
  }, async (f = {}) => {
    const status = f.status || "active";
    const results = config.listings.filter(l => {
      if (l.status !== status) return false;
      if (f.max_price && l.price > f.max_price) return false;
      if (f.min_price && l.price < f.min_price) return false;
      if (f.min_beds && l.beds < f.min_beds) return false;
      if (f.city && !l.city.toLowerCase().includes(f.city.toLowerCase())) return false;
      if (f.property_type && l.type !== f.property_type) return false;
      return true;
    });
    return {
      results: results.map(l => ({
        id: l.id, address: l.address + ", " + l.city + " " + l.zip,
        price: fmt(l.price), beds: l.beds, baths: l.baths, sqft: l.sqft,
        type: l.type, days_on_market: l.days_on_market, mls: l.mls,
      })),
      total: results.length,
    };
  });

  navigator.modelContext.registerTool("get_listing", {
    description: "Get full details on a specific property",
    parameters: { type: "object", properties: { listing_id: { type: "string" } }, required: ["listing_id"] },
  }, async ({ listing_id }) => {
    const l = config.listings.find(l => l.id === listing_id);
    if (!l) return { error: "Listing not found" };
    return { ...l, price_formatted: fmt(l.price), price_per_sqft: fmt(Math.round(l.price / l.sqft)) + "/sqft" };
  });

  navigator.modelContext.registerTool("calculate_mortgage", {
    description: "Estimate monthly mortgage payment",
    parameters: {
      type: "object",
      properties: {
        price: { type: "number" }, down_pct: { type: "number", description: "Down payment % (default 20)" },
        rate: { type: "number", description: "Annual rate % (default 7.0)" },
        years: { type: "number", description: "Loan term years (default 30)" },
      },
      required: ["price"],
    },
  }, async ({ price, down_pct = 20, rate = 7.0, years = 30 }) => {
    const r = rate / 100 / 12, n = years * 12, p = price * (1 - down_pct / 100);
    const mo = r === 0 ? p / n : p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { price: fmt(price), down: fmt(price * down_pct / 100), loan: fmt(p),
      monthly: fmt(Math.round(mo)), rate: rate + "%", term: years + " years",
      note: "Estimate only — does not include taxes, insurance, or HOA." };
  });

  navigator.modelContext.registerTool("schedule_showing", {
    description: "Request a property showing or virtual tour",
    parameters: {
      type: "object",
      properties: {
        listing_id: { type: "string" }, preferred_date: { type: "string" },
        contact_name: { type: "string" }, contact_email: { type: "string" },
      },
      required: ["listing_id", "contact_name", "contact_email"],
    },
  }, async (args) => {
    const ok = await navigator.modelContext.requestUserInteraction({
      type: "confirm", message: "Request a showing for " + args.listing_id + "?",
    });
    if (!ok) return { status: "cancelled" };
    if (config.contact_webhook) {
      await fetch(config.contact_webhook, { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
      return { status: "submitted", message: "Showing request received. We'll confirm within 24 hours." };
    }
    return { status: "contact", agent: config.agent.name,
      phone: config.agent.phone, email: config.agent.email };
  });

  navigator.modelContext.registerTool("get_agent_info", {
    description: "Get agent and brokerage contact details",
    parameters: { type: "object", properties: {} },
  }, async () => ({ agency: config.agency, agent: config.agent,
    phone: config.phone, email: config.email, market_areas: config.market_areas }));

  console.log("[MCPHubz WebMCP] real-estate template registered — 5 tools");
})();`,
  },
];

export default function Templates() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialId = params.get("t") || TEMPLATES[0].id;
  const [selected, setSelected] = useState(
    TEMPLATES.find(t => t.id === initialId) || TEMPLATES[0]
  );

  useEffect(() => {
    const id = new URLSearchParams(search).get("t");
    if (id) {
      const found = TEMPLATES.find(t => t.id === id);
      if (found) setSelected(found);
    }
  }, [search]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selected.code);
    toast.success(`${selected.name} template copied`);
  };

  const handleOpenInSandbox = () => {
    const encoded = encodeToolToUrl(selected.name, "webmcp", selected.code);
    navigate(`/sandbox?t=${encoded}`);
    toast.success(`${selected.name} loaded in sandbox`);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-50"
        style={{ background: 'oklch(0.09 0.008 265 / 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <MCPHubzLogo height={24} />
          </button>
          <span className="text-muted-foreground/40 text-xs">/</span>
          <span className="text-xs text-muted-foreground">WebMCP Templates</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://mcphubz.com/templates" target="_blank" rel="noreferrer"
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors px-2 py-1 hidden sm:block">
            ↗ mcphubz.com/templates
          </a>
          <Button size="sm" onClick={() => navigate('/sandbox')}
            className="text-xs px-4 h-7 font-bold tracking-wider"
            style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}>
            <Terminal className="w-3 h-3 mr-1.5" /> OPEN SANDBOX
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-49px)]">
        {/* Left: Template list */}
        <div className="w-64 shrink-0 overflow-y-auto" style={{ borderRight: '1px solid #2a2a2a', background: 'oklch(0.11 0.008 265)' }}>
          <div className="p-4">
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">WebMCP Templates</div>
            <div className="text-[9px] text-muted-foreground/50 mb-3">6 production-ready verticals</div>
            <div className="space-y-1">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => setSelected(t)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all ${
                    selected.id === t.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                  style={selected.id === t.id ? { background: 'oklch(0.14 0.015 185)', border: '1px solid oklch(0.82 0.18 185 / 0.4)' } : {}}>
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.tools.length} tools</div>
                  </div>
                  {selected.id === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto" />}
                </button>
              ))}
            </div>

            {/* Install hint */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2a2a2a' }}>
              <div className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-2">Run locally</div>
              <div className="text-[9px] text-primary/70 break-all leading-relaxed">
                {selected.npx}
              </div>
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
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/40 text-primary">WEBMCP</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3 max-w-lg">{selected.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 border-border text-muted-foreground">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button size="sm" variant="outline" onClick={handleCopy}
                  className="text-xs px-3 h-7 border-border hover:border-primary hover:text-primary"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <Copy className="w-3 h-3 mr-1.5" /> COPY
                </Button>
                <Button size="sm" onClick={handleOpenInSandbox}
                  className="text-xs px-3 h-7 font-bold"
                  style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}>
                  <ExternalLink className="w-3 h-3 mr-1.5" /> OPEN IN SANDBOX
                </Button>
              </div>
            </div>

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

          {/* Code */}
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
