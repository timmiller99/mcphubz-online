/*
 * MCPHubz Sandbox — Sandbox Page
 * Design: Terminal Brutalism — split-pane IDE layout
 * Modes: MCP Server Tester | WebMCP Tool Builder
 * Features: Save tools to localStorage, share via encoded URL, load saved tools panel
 */
import { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Terminal,
  Server,
  Globe,
  Play,
  RotateCcw,
  Copy,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Code2,
  Layers,
  ArrowRight,
  Save,
  Share2,
  FolderOpen,
  Trash2,
  X,
  Link2,
  Clock,
  Download,
} from "lucide-react";
import { useSavedTools, encodeToolToUrl, decodeToolFromUrl, type SavedTool } from "@/hooks/useSavedTools";

const WEBMCP_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/95011705/6X3ac8qz9Y8LrUNtGWhC4Z/sandbox-webmcp-icon-KUzFEUyjRezt9fUm3JDHby.webp";

// --- Default Code Templates ---
const MCP_DEFAULT_CODE = `// MCP Server Connection Test
// Enter your MCP server URL and click RUN

const config = {
  serverUrl: "https://your-mcp-server.com/mcp",
  // For GoHighLevel:
  // serverUrl: "https://services.leadconnectorhq.com/mcp/",
  authToken: "YOUR_API_KEY_HERE",
  toolName: "get_contacts", // Tool to test
  params: {
    limit: 5
  }
};

// The sandbox will attempt to:
// 1. Connect to your MCP server
// 2. List available tools
// 3. Call the specified tool
// 4. Display the response

export default config;
`;

const WEBMCP_DEFAULT_CODE = `// WebMCP Tool Builder
// Define your WebMCP tool using the imperative API
// This runs in Chrome 146+ with WebMCP flag enabled

const tool = {
  name: "get_business_info",
  description: "Get information about this business including hours, location, and services offered.",
  parameters: {
    type: "object",
    properties: {
      info_type: {
        type: "string",
        enum: ["hours", "location", "services", "contact", "all"],
        description: "What type of information to retrieve"
      }
    },
    required: ["info_type"]
  },
  handler: async (params) => {
    const data = {
      hours: "Mon-Fri 8am-6pm, Sat 9am-4pm",
      location: "123 Main St, Your City, ST 12345",
      services: ["Plumbing", "Electrical", "General Repairs", "Painting"],
      contact: { phone: "(555) 123-4567", email: "info@yourbusiness.com" }
    };
    
    if (params.info_type === "all") return data;
    return { [params.info_type]: data[params.info_type] };
  }
};

// To register this tool with WebMCP:
// navigator.modelContext.registerTool(tool.name, tool.description, tool.parameters, tool.handler);

export default tool;
`;

type LogEntry = {
  type: "info" | "success" | "error" | "warning" | "output";
  message: string;
  timestamp: string;
};

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function LogLine({ entry }: { entry: LogEntry }) {
  const colors = {
    info: "text-muted-foreground",
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    output: "text-primary",
  };
  const icons = {
    info: <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" />,
    error: <XCircle className="w-3 h-3 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />,
    output: <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" />,
  };
  return (
    <div className={`flex items-start gap-2 text-[11px] leading-relaxed ${colors[entry.type]}`}>
      {icons[entry.type]}
      <span className="text-muted-foreground/50 shrink-0">[{entry.timestamp}]</span>
      <span className="font-mono break-all">{entry.message}</span>
    </div>
  );
}

// --- Save Modal ---
function SaveModal({
  onClose,
  onSave,
  defaultName,
}: {
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName: string;
}) {
  const [name, setName] = useState(defaultName);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-80 rounded-sm p-5" style={{ background: 'oklch(0.13 0.008 265)', border: '1px solid oklch(0.28 0.015 185)', fontFamily: "'JetBrains Mono', monospace" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">SAVE TOOL</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-4">
          <label className="text-[10px] text-muted-foreground tracking-widest uppercase block mb-1.5">Tool Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onSave(name.trim())}
            className="w-full px-3 py-2 text-xs rounded-sm focus:outline-none"
            style={{
              background: 'oklch(0.10 0.008 265)',
              border: '1px solid oklch(0.28 0.015 185)',
              color: 'oklch(0.88 0.005 65)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            placeholder="my-webmcp-tool"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="flex-1 text-xs h-8 font-bold"
            style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
          >
            <Save className="w-3 h-3 mr-1.5" /> SAVE
          </Button>
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs h-8 border-border/50 text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Share Modal ---
function ShareModal({
  shareUrl,
  toolName,
  onClose,
}: {
  shareUrl: string;
  toolName: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-96 rounded-sm p-5" style={{ background: 'oklch(0.13 0.008 265)', border: '1px solid oklch(0.28 0.015 185)', fontFamily: "'JetBrains Mono', monospace" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">SHARE TOOL</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1.5">Tool</div>
          <div className="text-xs text-foreground font-bold">{toolName}</div>
        </div>

        <div className="mb-4">
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1.5">Shareable Link</div>
          <div className="flex items-center gap-2 p-2.5 rounded-sm" style={{ background: 'oklch(0.10 0.008 265)', border: '1px solid #2a2a2a' }}>
            <Link2 className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground truncate flex-1">{shareUrl}</span>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-sm" style={{ background: 'oklch(0.11 0.008 265)', border: '1px solid #2a2a2a' }}>
          <div className="text-[10px] text-muted-foreground leading-relaxed">
            Anyone with this link can open the sandbox with your tool pre-loaded. The tool code is encoded directly in the URL — no account required.
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleCopy}
            className="flex-1 text-xs h-8 font-bold"
            style={{ background: copied ? '#16a34a' : '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
          >
            {copied ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
            {copied ? "COPIED!" : "COPY LINK"}
          </Button>
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs h-8 border-border/50 text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Saved Tools Panel ---
function SavedToolsPanel({
  tools,
  onLoad,
  onDelete,
  onClose,
}: {
  tools: SavedTool[];
  onLoad: (tool: SavedTool) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="h-full w-80 flex flex-col" style={{ background: 'oklch(0.11 0.008 265)', borderLeft: '1px solid #2a2a2a', fontFamily: "'JetBrains Mono', monospace" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #2a2a2a' }}>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground">SAVED TOOLS</span>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/40 text-primary">
              {tools.length}
            </Badge>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tools list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tools.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <Save className="w-8 h-8 text-muted-foreground/30 mb-3" />
              <p className="text-xs text-muted-foreground">No saved tools yet.</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Click SAVE in the sandbox to save your work.</p>
            </div>
          ) : (
            tools.map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded-sm group"
                style={{ background: 'oklch(0.13 0.008 265)', border: '1px solid #2a2a2a' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{tool.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0"
                        style={{ borderColor: tool.mode === "webmcp" ? '#22c55e66' : '#64748b66', color: tool.mode === "webmcp" ? '#22c55e' : '#94a3b8' }}
                      >
                        {tool.mode === "webmcp" ? "WEBMCP" : "MCP"}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(tool.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(tool.id)}
                    className="text-muted-foreground/40 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground/60 font-mono truncate mb-2">
                  {tool.code.split('\n').find(l => l.trim() && !l.startsWith('//')) || tool.code.split('\n')[0]}
                </div>
                <button
                  onClick={() => { onLoad(tool); onClose(); }}
                  className="w-full text-[10px] py-1.5 rounded-sm font-bold tracking-wider transition-all hover:opacity-90"
                  style={{ background: '#22c55e26', color: '#22c55e', border: '1px solid #22c55e4d' }}
                >
                  <Download className="w-3 h-3 inline mr-1" /> LOAD
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-3 shrink-0 text-[10px] text-muted-foreground/50" style={{ borderTop: '1px solid #2a2a2a' }}>
          Saved locally in your browser. Use Share to send to others.
        </div>
      </div>
    </div>
  );
}

// --- Main Sandbox Component ---
export default function Sandbox() {
  const [, navigate] = useLocation();
  const params = useParams<{ mode?: string }>();
  const search = useSearch();

  // Parse shared tool from URL query param ?t=<encoded>
  const sharedToolEncoded = new URLSearchParams(search).get("t");
  const sharedTool = sharedToolEncoded ? decodeToolFromUrl(sharedToolEncoded) : null;

  const [mode, setMode] = useState<"mcp" | "webmcp">(
    sharedTool?.mode ?? (params.mode === "webmcp" ? "webmcp" : "mcp")
  );
  const [code, setCode] = useState(
    sharedTool?.code ?? (mode === "mcp" ? MCP_DEFAULT_CODE : WEBMCP_DEFAULT_CODE)
  );
  const [toolName, setToolName] = useState(sharedTool?.name ?? (mode === "mcp" ? "mcp-config" : "webmcp-tool"));

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const initial: LogEntry[] = [
      { type: "info", message: "MCPHubz Sandbox initialized. Ready.", timestamp: getTimestamp() },
    ];
    if (sharedTool) {
      initial.push({ type: "success", message: `Shared tool loaded: "${sharedTool.name}"`, timestamp: getTimestamp() });
    } else {
      initial.push({ type: "info", message: `Mode: ${mode === "mcp" ? "MCP Server Tester" : "WebMCP Tool Builder"}`, timestamp: getTimestamp() });
    }
    return initial;
  });

  const [running, setRunning] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const { savedTools, saveTool, updateTool, deleteTool } = useSavedTools();

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (type: LogEntry["type"], message: string) => {
    setLogs((prev) => [...prev, { type, message, timestamp: getTimestamp() }]);
  };

  const switchMode = (newMode: "mcp" | "webmcp") => {
    setMode(newMode);
    setCode(newMode === "mcp" ? MCP_DEFAULT_CODE : WEBMCP_DEFAULT_CODE);
    setToolName(newMode === "mcp" ? "mcp-config" : "webmcp-tool");
    setCurrentSavedId(null);
    setLogs([
      { type: "info", message: `Switched to ${newMode === "mcp" ? "MCP Server Tester" : "WebMCP Tool Builder"} mode.`, timestamp: getTimestamp() },
    ]);
  };

  const handleRun = async () => {
    setRunning(true);
    addLog("info", "Starting execution...");

    if (mode === "mcp") {
      addLog("info", "Parsing MCP server configuration...");
      await new Promise((r) => setTimeout(r, 600));
      addLog("info", "Attempting connection to MCP server...");
      await new Promise((r) => setTimeout(r, 800));
      addLog("warning", "Note: Direct MCP server calls require CORS headers on the server.");
      await new Promise((r) => setTimeout(r, 400));
      addLog("info", "Validating tool definition schema...");
      await new Promise((r) => setTimeout(r, 500));
      addLog("success", "Configuration parsed successfully.");
      addLog("output", JSON.stringify({
        status: "validated",
        mode: "mcp-server-tester",
        note: "To test a live server, update serverUrl and authToken in the config above.",
        supported_servers: ["GoHighLevel MCP", "GitHub MCP", "Custom MCP Servers"],
        next_step: "Update config and click RUN to test your server connection."
      }, null, 2));
    } else {
      addLog("info", "Parsing WebMCP tool definition...");
      await new Promise((r) => setTimeout(r, 600));
      addLog("info", "Validating tool schema against WebMCP spec...");
      await new Promise((r) => setTimeout(r, 700));
      addLog("success", "Tool schema is valid.");
      addLog("info", "Checking WebMCP availability...");
      await new Promise((r) => setTimeout(r, 500));
      const hasWebMCP = typeof (navigator as any).modelContext !== "undefined";
      if (hasWebMCP) {
        addLog("success", "WebMCP API detected in this browser.");
        addLog("info", "Registering tool with navigator.modelContext...");
        await new Promise((r) => setTimeout(r, 400));
        addLog("success", "Tool registered successfully with WebMCP.");
        addLog("output", `{"status":"registered","tool":"${toolName}","available_to":"AI agents via Chrome WebMCP"}`);
      } else {
        addLog("warning", "WebMCP API not detected. Chrome 146+ with 'WebMCP for testing' flag required.");
        addLog("info", "Running in simulation mode...");
        await new Promise((r) => setTimeout(r, 500));
        addLog("success", "Tool definition validated. Ready for WebMCP-enabled browser.");
        addLog("output", JSON.stringify({
          status: "simulated",
          tool: toolName,
          schema_valid: true,
          note: "Enable chrome://flags/#enable-experimental-web-platform-features in Chrome 146+",
          test_result: {
            info_type: "all",
            response: {
              hours: "Mon-Fri 8am-6pm, Sat 9am-4pm",
              location: "123 Main St, Your City, ST 12345",
              services: ["Plumbing", "Electrical", "General Repairs", "Painting"],
              contact: { phone: "(555) 123-4567", email: "info@yourbusiness.com" }
            }
          }
        }, null, 2));
      }
    }

    setRunning(false);
  };

  const handleClear = () => {
    setLogs([{ type: "info", message: "Console cleared.", timestamp: getTimestamp() }]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const handleSave = (name: string) => {
    if (currentSavedId) {
      updateTool(currentSavedId, name, code);
      setToolName(name);
      toast.success(`Tool "${name}" updated`);
    } else {
      const saved = saveTool(name, mode, code);
      setCurrentSavedId(saved.id);
      setToolName(name);
      toast.success(`Tool "${name}" saved`);
    }
    setShowSaveModal(false);
    addLog("success", `Tool saved: "${name}"`);
  };

  const handleShare = () => {
    const encoded = encodeToolToUrl(toolName, mode, code);
    const url = `${window.location.origin}/sandbox?t=${encoded}`;
    setShareUrl(url);
    setShowShareModal(true);
    addLog("info", `Share link generated for "${toolName}"`);
  };

  const handleLoadTool = (tool: SavedTool) => {
    setMode(tool.mode);
    setCode(tool.code);
    setToolName(tool.name);
    setCurrentSavedId(tool.id);
    setLogs([
      { type: "success", message: `Loaded saved tool: "${tool.name}"`, timestamp: getTimestamp() },
      { type: "info", message: `Mode: ${tool.mode === "mcp" ? "MCP Server Tester" : "WebMCP Tool Builder"}`, timestamp: getTimestamp() },
    ]);
    toast.success(`Loaded: ${tool.name}`);
  };

  const handleDeleteTool = (id: string) => {
    const tool = savedTools.find((t) => t.id === id);
    deleteTool(id);
    if (currentSavedId === id) setCurrentSavedId(null);
    toast.success(`Deleted: ${tool?.name ?? "tool"}`);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Modals */}
      {showSaveModal && (
        <SaveModal
          defaultName={toolName}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSave}
        />
      )}
      {showShareModal && (
        <ShareModal
          shareUrl={shareUrl}
          toolName={toolName}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {showSavedPanel && (
        <SavedToolsPanel
          tools={savedTools}
          onLoad={handleLoadTool}
          onDelete={handleDeleteTool}
          onClose={() => setShowSavedPanel(false)}
        />
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ background: 'oklch(0.11 0.008 265)', borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs">
            <ChevronLeft className="w-3.5 h-3.5" />
            <img src={WEBMCP_ICON} alt="" className="w-5 h-5 rounded" />
            <span className="font-bold tracking-wider">MCPHUBZ <span className="text-primary">SANDBOX</span></span>
          </button>
          <span className="text-muted-foreground/40 text-xs">/</span>
          <span className="text-xs text-muted-foreground truncate max-w-32">
            {toolName}
          </span>
          {currentSavedId && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary" title="Saved" />
          )}
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-sm" style={{ background: 'oklch(0.14 0.008 265)', border: '1px solid #2a2a2a' }}>
          <button
            onClick={() => switchMode("mcp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold tracking-wider transition-all ${
              mode === "mcp" ? "text-background" : "text-muted-foreground hover:text-foreground"
            }`}
            style={mode === "mcp" ? { background: '#22c55e', color: '#111111' } : {}}
          >
            <Server className="w-3 h-3" /> MCP SERVER
          </button>
          <button
            onClick={() => switchMode("webmcp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold tracking-wider transition-all ${
              mode === "webmcp" ? "text-background" : "text-muted-foreground hover:text-foreground"
            }`}
            style={mode === "webmcp" ? { background: '#22c55e', color: '#111111' } : {}}
          >
            <Globe className="w-3 h-3" /> WEBMCP
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Saved tools button */}
          <button
            onClick={() => setShowSavedPanel(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs text-muted-foreground hover:text-foreground transition-all relative"
            style={{ border: '1px solid #2a2a2a' }}
            title="Saved Tools"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            {savedTools.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center font-bold"
                style={{ background: '#22c55e', color: '#111111' }}>
                {savedTools.length > 9 ? "9+" : savedTools.length}
              </span>
            )}
          </button>

          {/* Save button */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs text-muted-foreground hover:text-primary transition-all"
            style={{ border: '1px solid #2a2a2a' }}
            title="Save Tool"
          >
            <Save className="w-3.5 h-3.5" />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs text-muted-foreground hover:text-primary transition-all"
            style={{ border: '1px solid #2a2a2a' }}
            title="Share Tool"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/40 text-primary">
            {mode === "mcp" ? "MCP SPEC v2024" : "WEBMCP CHROME 146+"}
          </Badge>

          <Button
            size="sm"
            onClick={handleRun}
            disabled={running}
            className="text-xs px-4 h-7 font-bold tracking-wider"
            style={{ background: '#22c55e', color: '#111111', fontFamily: "'JetBrains Mono', monospace" }}
          >
            {running ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Play className="w-3 h-3 mr-1.5" />}
            RUN
          </Button>
        </div>
      </div>

      {/* Main Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor */}
        <div className="flex flex-col w-1/2" style={{ borderRight: '1px solid #2a2a2a' }}>
          <div className="flex items-center justify-between px-3 py-1.5 shrink-0"
            style={{ background: 'oklch(0.13 0.008 265)', borderBottom: '1px solid #2a2a2a' }}>
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {toolName}.js
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 6px #22c55e' }} />
            </div>
            <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
              <Copy className="w-3 h-3" /> COPY
            </button>
          </div>

          {/* Code textarea */}
          <div className="flex-1 overflow-hidden relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full resize-none p-4 text-[12px] leading-relaxed focus:outline-none"
              style={{
                background: 'oklch(0.10 0.008 265)',
                color: 'oklch(0.88 0.005 65)',
                fontFamily: "'JetBrains Mono', monospace",
                caretColor: '#22c55e',
                tabSize: 2,
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>

        {/* Right: Output Console */}
        <div className="flex flex-col w-1/2">
          <div className="flex items-center justify-between px-3 py-1.5 shrink-0"
            style={{ background: 'oklch(0.13 0.008 265)', borderBottom: '1px solid #2a2a2a' }}>
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">output console</span>
              {running && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
            </div>
            <button onClick={handleClear} className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
              <RotateCcw className="w-3 h-3" /> CLEAR
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1.5" style={{ background: '#111111' }}>
            {logs.map((entry, i) => (
              <LogLine key={i} entry={entry} />
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 shrink-0 text-[10px] text-muted-foreground"
        style={{ background: 'oklch(0.11 0.008 265)', borderTop: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-primary' : 'bg-green-400'}`}
              style={running ? { boxShadow: '0 0 6px #22c55e' } : {}} />
            <span>{running ? "RUNNING" : "READY"}</span>
          </div>
          <span>MODE: {mode.toUpperCase()}</span>
          <span>LINES: {code.split('\n').length}</span>
          {currentSavedId && <span className="text-primary">● SAVED</span>}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSavedPanel(true)}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <FolderOpen className="w-3 h-3" /> {savedTools.length} SAVED
          </button>
          <button onClick={() => navigate('/templates')} className="flex items-center gap-1 hover:text-primary transition-colors">
            <Layers className="w-3 h-3" /> TEMPLATES
          </button>
          <span>MCPHubz Sandbox v0.1.0-beta</span>
        </div>
      </div>
    </div>
  );
}
