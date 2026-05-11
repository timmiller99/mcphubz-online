// Exact MCPHubz logo from mcphubz.com — do not modify the SVG paths
export function MCPHubzLogo({ height = 36 }: { height?: number }) {
  const w = Math.round(height * 2.6)
  return (
    <svg width={w} height={height} viewBox="0 0 260 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MCPHubz">
      <defs>
        <radialGradient id="hexGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="wordMCP" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="wordHubz" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="44" cy="50" rx="38" ry="38" fill="url(#hexGlow)" />
      <polygon points="44,12 72,28 72,60 44,76 16,60 16,28" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#glow)" />
      <polygon points="44,18 68,32 68,58 44,72 20,58 20,32" fill="url(#hexFill)" filter="url(#glow)" />
      <polygon points="44,22 64,34 64,56 44,68 24,56 24,34" fill="none" stroke="#bbf7d0" strokeWidth="0.8" strokeOpacity="0.4" />
      <text x="28" y="52" fontFamily="monospace" fontWeight="900" fontSize="18" fill="#0f172a">{'>'}</text>
      <text x="44" y="52" fontFamily="monospace" fontWeight="900" fontSize="18" fill="#0f172a">_</text>
      <line x1="68" y1="42" x2="82" y2="42" stroke="#22c55e" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="82" y1="42" x2="88" y2="36" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="88" y1="36" x2="96" y2="36" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="96" cy="36" r="1.5" fill="#4ade80" fillOpacity="0.6" />
      <line x1="68" y1="56" x2="82" y2="56" stroke="#22c55e" strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="82" y1="56" x2="88" y2="62" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="88" y1="62" x2="100" y2="62" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="100" cy="62" r="1.5" fill="#4ade80" fillOpacity="0.6" />
      <line x1="68" y1="48" x2="90" y2="48" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.8" />
      <line x1="90" y1="48" x2="96" y2="54" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="96" cy="54" r="1.5" fill="#4ade80" fillOpacity="0.7" />
      <text x="108" y="58" fontFamily="'Space Grotesk', 'Inter', sans-serif" fontWeight="900" fontSize="32" fill="url(#wordMCP)" letterSpacing="-0.5">MCP</text>
      <text x="178" y="58" fontFamily="'Space Grotesk', 'Inter', sans-serif" fontWeight="900" fontSize="32" fill="url(#wordHubz)" letterSpacing="-0.5">Hubz</text>
    </svg>
  )
}
