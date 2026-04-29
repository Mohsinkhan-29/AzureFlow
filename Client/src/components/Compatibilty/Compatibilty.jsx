import { useState, useEffect, useRef } from "react";

import Cloud from "../../assets/Services/cloud-services-classic.png"
import Infra from "../../assets/Services/bare-metal-infrastructure.png"
import DevOps from "../../assets/Services/managed-devops-pools.png"
import Data from "../../assets/Services/change-analysis.png"
import Security from "../../assets/Services/network-security-hub.png"
import Cost from "../../assets/Services/cost-budgets.png"
import Network from "../../assets/Services/azure-network-function-manager-functions.png"
import Ai from "../../assets/Services/azure-openai.png"


const C = {
  az: "#0078D4",
  az2: "#1a8fe8",
  azLight: "#38BDF8",
  azGlow: "rgba(0,120,212,0.25)",
  navy: "#020B18",
  navy2: "#060F1E",
  card: "#0A1628",
  card2: "#0D1F38",
  border: "rgba(0,120,212,0.18)",
  border2: "rgba(56,189,248,0.12)",
  text: "#E2E8F0",
  muted: "#8BA3C4",
  accent: "#38BDF8",
};

// ─── Once Typewriter Hook ─────────────────────────────────────────────────────
function useTypeOnce(text, { speed = 18, enabled = true } = {}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled || done) return;
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        setDone(true);
        return;
      }
      timer = setTimeout(tick, speed);
    };
    let timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [text, speed, enabled]);

  return { displayed, done };
}

// ─── Capability data ──────────────────────────────────────────────────────────
const CAPS = [
  {
    id: 0, icon: <img src={Cloud} alt="Cloud" style={{ width: 22, height: 22 }} />, iconBg: "rgba(0,120,212,0.15)", label: "Cloud Migration",
    title: "Cloud Migration & Modernization",
    desc: "Move your workloads to Azure safely and efficiently. We handle dependency mapping, phased planning, and zero-downtime execution — whether you're lifting-and-shifting or rebuilding cloud-native from the ground up.",
    rightBg: "linear-gradient(135deg,rgba(0,120,212,0.06) 0%,rgba(56,189,248,0.04) 100%)",
    features: [
      { title: "Lift & Shift Migration", desc: "Replicate on-premises VMs to Azure with minimal code changes and instant rollback capability." },
      { title: "Re-architecture & Modernization", desc: "Refactor legacy monoliths into cloud-native microservices on AKS or Azure Functions." },
      { title: "Azure Migrate Assessment", desc: "Comprehensive dependency mapping and TCO analysis before a single byte moves." },
      { title: "Database Migration Service", desc: "Online migrations from SQL Server, Oracle, and MySQL with near-zero downtime cutover." },
    ],
    visual: <MigrationVisual />,
  },
  {
    id: 1, icon: <img src={Infra} alt="Infra" style={{ width: 22, height: 22 }} />, iconBg: "rgba(56,189,248,0.15)", label: "Azure Infrastructure",
    title: "Azure Infrastructure Setup",
    desc: "Design and deploy resilient, auto-scaling infrastructure using Virtual Machines, AKS, and managed services — architected for enterprise workloads that demand five-nines reliability and seamless horizontal scale.",
    rightBg: "linear-gradient(135deg,rgba(56,189,248,0.05) 0%,rgba(0,120,212,0.04) 100%)",
    features: [
      { title: "IaC with Terraform & Bicep", desc: "Fully reproducible infrastructure as code with version-controlled deployments and drift detection." },
      { title: "Virtual Network Design", desc: "Hub-spoke topologies, NSGs, private endpoints, and ExpressRoute for hybrid connectivity." },
      { title: "AKS & Container Orchestration", desc: "Production Kubernetes clusters with HPA, node auto-provisioner, and GitOps workflows." },
      { title: "High Availability & DR", desc: "Active-active and active-passive patterns across availability zones with contractual RPO/RTO SLAs." },
    ],
    visual: <InfraVisual />,
  },
  {
    id: 2, icon: <img src={DevOps} alt="DevOps" style={{ width: 22, height: 22 }} />, iconBg: "rgba(74,222,128,0.1)", label: "DevOps & CI/CD",
    title: "DevOps & CI/CD Pipelines",
    desc: "Accelerate software delivery with fully automated build, test, and deployment pipelines. Go from code commit to production in minutes, with blue-green deployments, canary releases, and automatic rollback on failure.",
    rightBg: "linear-gradient(135deg,rgba(74,222,128,0.05) 0%,rgba(0,120,212,0.04) 100%)",
    features: [
      { title: "Azure DevOps Pipelines", desc: "Multi-stage YAML pipelines with environment gates, approvals, and rollback triggers." },
      { title: "GitHub Actions Integration", desc: "Workflow automation for container builds, security scanning, and registry pushes." },
      { title: "Blue-Green & Canary Deploys", desc: "Risk-free production releases with traffic splitting and automatic rollback on metric breach." },
      { title: "Monitoring & Observability", desc: "Azure Monitor, App Insights, and Grafana dashboards for full pipeline and app visibility." },
    ],
    visual: <DevOpsVisual />,
  },
  {
    id: 3, icon:<img src={Data} alt="Data" style={{ width: 22, height: 22 }} />,  iconBg: "rgba(124,58,237,0.15)", label: "Data & Analytics",
    title: "Data & Analytics",
    desc: "Unlock the full value of your data with real-time streaming pipelines, enterprise data warehousing, and AI-powered analytics on Azure's modern data platform. Petabyte-scale insight, delivered in seconds.",
    rightBg: "linear-gradient(135deg,rgba(124,58,237,0.07) 0%,rgba(0,120,212,0.04) 100%)",
    features: [
      { title: "Azure Synapse Analytics", desc: "Unified analytics combining data integration, warehousing, and BI at petabyte scale." },
      { title: "Real-Time Event Streaming", desc: "Event-driven pipelines with Azure Event Hubs, Stream Analytics, and Kafka integration." },
      { title: "Data Factory & ETL", desc: "No-code and code-first ingestion from 100+ sources with full lineage tracking." },
      { title: "Power BI Embedded", desc: "Embedded analytics with row-level security and semantic model governance at scale." },
    ],
    visual: <DataVisual />,
  },
  {
    id: 4, icon: <img src={Security} alt="Security" style={{ width: 22, height: 22 }} />, iconBg: "rgba(239,68,68,0.1)", label: "Security & Compliance",
    title: "Security & Compliance",
    desc: "Enterprise-grade security built on Zero Trust principles. We implement Azure Defender, identity-centric access controls, and automated compliance frameworks — so your systems stay protected and audit-ready at all times.",
    rightBg: "linear-gradient(135deg,rgba(239,68,68,0.05) 0%,rgba(0,120,212,0.04) 100%)",
    features: [
      { title: "Zero Trust Architecture", desc: "Identity-centric access with Entra ID, Conditional Access, and Privileged Identity Management." },
      { title: "Microsoft Defender for Cloud", desc: "Unified CSPM and workload protection with attack path analysis across hybrid estates." },
      { title: "Compliance Automation", desc: "Azure Policy and Blueprints to enforce and continuously audit SOC2, ISO, and PCI controls." },
      { title: "Key Vault & Secret Management", desc: "HSM-backed secrets, certificates, and encryption key lifecycle management at scale." },
    ],
    visual: <SecurityVisual />,
  },
  {
    id: 5, icon: <img src={Cost} alt="Cost" style={{ width: 22, height: 22 }} />, iconBg: "rgba(251,191,36,0.1)", label: "Cost Optimization",
    title: "Cost Optimization & FinOps",
    desc: "Reduce cloud spend by up to 40% through reserved instances, automated right-sizing, and a continuous FinOps governance program. Every dollar tracked, every resource justified, every saving reported monthly.",
    rightBg: "linear-gradient(135deg,rgba(251,191,36,0.05) 0%,rgba(0,120,212,0.03) 100%)",
    features: [
      { title: "Reserved Instance Strategy", desc: "1–3 year commitment planning with break-even analysis and portfolio-level optimization." },
      { title: "Automated Right-Sizing", desc: "Continuous Azure Advisor recommendations applied automatically via policy enforcement." },
      { title: "Tag Governance & Showback", desc: "Team-level cost attribution with budget alerts and monthly FinOps reports per business unit." },
      { title: "Scheduled Resource Management", desc: "Auto-shutdown dev environments, spot instance pooling, and storage tier lifecycle policies." },
    ],
    visual: <CostVisual />,
  },
  {
    id: 6, icon: <img src={Network} alt="Network" style={{ width: 22, height: 22 }} />, iconBg: "rgba(56,189,248,0.12)", label: "Azure Networking",
    title: "Azure Networking & Connectivity",
    desc: "Design high-performance, secure Azure networking foundations. From hub-spoke topologies and ExpressRoute circuits to Application Gateway WAF and Azure Front Door CDN — we engineer the connectivity layer your business runs on.",
    rightBg: "linear-gradient(135deg,rgba(56,189,248,0.06) 0%,rgba(0,120,212,0.03) 100%)",
    features: [
      { title: "Hub-Spoke VNet Architecture", desc: "Centralized networking with peering, shared services, and isolation between workload spokes." },
      { title: "ExpressRoute & VPN Gateway", desc: "Private, dedicated connectivity from on-premises to Azure bypassing the public internet entirely." },
      { title: "Azure Front Door & CDN", desc: "Global load balancing, WAF protection, and edge caching for sub-50ms response worldwide." },
      { title: "Private Endpoints & DNS", desc: "Eliminate public exposure for PaaS services via private endpoints with custom DNS zones." },
    ],
    visual: <NetworkVisual />,
  },
  {
    id: 7, icon: <img src={Ai} alt="Ai" style={{ width: 22, height: 22 }} />, iconBg: "rgba(167,139,250,0.15)", label: "AI & Copilot Services",
    title: "AI & Copilot Services",
    desc: "Embed intelligent capabilities into your products and operations with Azure OpenAI, Cognitive Services, and enterprise copilot solutions. From document intelligence to custom AI assistants — built securely on your own Azure tenant.",
    rightBg: "linear-gradient(135deg,rgba(167,139,250,0.07) 0%,rgba(0,120,212,0.04) 100%)",
    features: [
      { title: "Azure OpenAI Integration", desc: "GPT-4o and o-series models deployed privately on your Azure tenant with full data residency." },
      { title: "Document Intelligence & OCR", desc: "Form recognizer and read API for automated extraction from invoices, contracts, and reports." },
      { title: "Custom Copilot Development", desc: "Enterprise AI assistants integrated with SharePoint, Teams, and line-of-business applications." },
      { title: "AI Search & RAG Pipelines", desc: "Azure AI Search with vector embeddings for grounded, enterprise-grade retrieval-augmented generation." },
    ],
    visual: <AIVisual />,
  },
];

// ─── SVG Visuals ──────────────────────────────────────────────────────────────
function MigrationVisual() {
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="mg0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0078D4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="mg0b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D1F38" /><stop offset="100%" stopColor="#0A1628" />
        </linearGradient>
        <filter id="glow0"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="20" y="60" width="110" height="160" rx="8" fill="url(#mg0b)" stroke="#0078D4" strokeWidth="1" strokeOpacity="0.5" />
      <text x="75" y="52" textAnchor="middle" fill="#8BA3C4" fontSize="9" fontFamily="DM Sans">ON-PREMISES</text>
      {[76, 96, 116, 136, 156].map((y, i) => (
        <g key={i}>
          <rect x="32" y={y} width="86" height="14" rx="3" fill={`rgba(0,120,212,${0.25 - i * 0.04})`} stroke="#0078D4" strokeWidth="0.5" />
          <circle cx="108" cy={y + 7} r="3" fill={["#4ADE80", "#4ADE80", "#FBBF24", "#4ADE80", "#EF4444"][i]} filter="url(#glow0)" />
        </g>
      ))}
      <line x1="142" y1="140" x2="205" y2="140" stroke="url(#mg0)" strokeWidth="2" strokeDasharray="5,3">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1s" repeatCount="indefinite" />
      </line>
      <polygon points="205,135 218,140 205,145" fill="#38BDF8" />
      <text x="177" y="128" textAnchor="middle" fill="#38BDF8" fontSize="8">MIGRATE</text>
      <ellipse cx="275" cy="120" rx="68" ry="42" fill="url(#mg0)" opacity="0.12" />
      <ellipse cx="275" cy="120" rx="68" ry="42" fill="none" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" />
      <text x="275" y="98" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="DM Sans">AZURE CLOUD</text>
      {[108, 124, 140].map((y, i) => (
        <rect key={i} x="238" y={y} width="74" height="10" rx="3" fill={`rgba(56,189,248,${0.3 - i * 0.08})`} />
      ))}
      <rect x="20" y="238" width="340" height="28" rx="6" fill="rgba(0,120,212,0.08)" stroke="#0078D4" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x="42" y="256" fill="#4ADE80" fontSize="9" fontFamily="DM Sans">✓ Zero downtime</text>
      <text x="154" y="256" fill="#38BDF8" fontSize="9" fontFamily="DM Sans">✓ Full data integrity</text>
      <text x="278" y="256" fill="#8BA3C4" fontSize="9" fontFamily="DM Sans">✓ Rollback ready</text>
    </svg>
  );
}

function InfraVisual() {
  const spokes = [
    { cx: 80, cy: 60, label: "AKS", sub: "Cluster", color: "#38BDF8" },
    { cx: 300, cy: 60, label: "App", sub: "Services", color: "#38BDF8" },
    { cx: 60, cy: 210, label: "SQL", sub: "Managed", color: "#0078D4" },
    { cx: 320, cy: 210, label: "Key", sub: "Vault", color: "#0078D4" },
    { cx: 190, cy: 248, label: "Monitor", sub: "& Logs", color: "#7C3AED" },
  ];
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="ig1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0078D4" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <circle cx="190" cy="140" r="36" fill="rgba(0,120,212,0.15)" stroke="#0078D4" strokeWidth="1.5">
        <animate attributeName="r" values="36;38;36" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="190" y="136" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="DM Sans" fontWeight="600">HUB</text>
      <text x="190" y="148" textAnchor="middle" fill="#8BA3C4" fontSize="7">VNET</text>
      {spokes.map((s, i) => (
        <g key={i}>
          <line x1="190" y1="140" x2={s.cx} y2={s.cy} stroke="url(#ig1)" strokeWidth="1" strokeDasharray="4,2">
            <animate attributeName="stroke-dashoffset" values="0;-12" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </line>
          <circle cx={s.cx} cy={s.cy} r="24" fill={`${s.color}18`} stroke={s.color} strokeWidth="1" />
          <text x={s.cx} y={s.cy - 4} textAnchor="middle" fill="#E2E8F0" fontSize="7">{s.label}</text>
          <text x={s.cx} y={s.cy + 7} textAnchor="middle" fill="#8BA3C4" fontSize="6">{s.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function DevOpsVisual() {
  const stages = [
    { label: "CODE", sub: "Commit", color: "#0078D4", border: "#0078D4" },
    { label: "BUILD", sub: "Compile", color: "#38BDF8", border: "#38BDF8" },
    { label: "TEST", sub: "Validate", color: "#38BDF8", border: "#38BDF8" },
    { label: "STAGE", sub: "Preview", color: "#4ADE80", border: "#4ADE80" },
    { label: "PROD", sub: "Deploy", color: "#4ADE80", border: "#4ADE80" },
  ];
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="dg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {[{ x: 20, label: "DEPLOYS/DAY", val: "47", c: "#fff" },
      { x: 140, label: "SUCCESS RATE", val: "99.2%", c: "#4ADE80" },
      { x: 260, label: "AVG DEPLOY", val: "2m", c: "#38BDF8" }].map((m, i) => (
        <g key={i}>
          <rect x={m.x} y="40" width="100" height="50" rx="6" fill="rgba(0,120,212,0.08)" stroke="#0078D4" strokeWidth="0.5" strokeOpacity="0.4" />
          <text x={m.x + 50} y="58" textAnchor="middle" fill="#8BA3C4" fontSize="7">{m.label}</text>
          <text x={m.x + 50} y="76" textAnchor="middle" fill={m.c} fontFamily="Syne,sans-serif" fontSize="20" fontWeight="800">{m.val}</text>
        </g>
      ))}
      {stages.map((s, i) => {
        const x = 20 + i * 68;
        const isLast = i === stages.length - 1;
        return (
          <g key={i}>
            <rect x={x} y="110" width={isLast ? 52 : 56} height="60" rx="8"
              fill={`${s.color}18`} stroke={s.border} strokeWidth={isLast ? 1.5 : 1} />
            <text x={x + (isLast ? 26 : 28)} y="136" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontWeight="600">{s.label}</text>
            <text x={x + (isLast ? 26 : 28)} y="150" textAnchor="middle" fill="#8BA3C4" fontSize="7">{s.sub}</text>
            {!isLast && <polygon points={`${x + 58},133 ${x + 70},140 ${x + 58},147`} fill={s.color} opacity="0.8" />}
          </g>
        );
      })}
      <rect x="20" y="196" width="340" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="20" y="196" width="290" height="4" rx="2" fill="url(#dg2)">
        <animate attributeName="width" values="0;290" dur="2s" fill="freeze" />
      </rect>
      <text x="20" y="218" fill="#8BA3C4" fontSize="8">Build #1,847</text>
      <text x="20" y="230" fill="#4ADE80" fontSize="9" fontWeight="600">✓ Deployed to production — 2m 14s</text>
    </svg>
  );
}

function DataVisual() {
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="dv3" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <line x1="40" y1="220" x2="360" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="40" y1="40" x2="40" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <path d="M40,200 C80,195 100,160 140,150 C180,140 200,120 240,100 C280,80 310,70 360,55 L360,220 L40,220 Z" fill="url(#dv3)" opacity="0.18">
        <animate attributeName="opacity" values="0.1;0.22;0.1" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M40,200 C80,195 100,160 140,150 C180,140 200,120 240,100 C280,80 310,70 360,55" fill="none" stroke="url(#dv3)" strokeWidth="2.5" />
      {[{ cx: 140, cy: 150 }, { cx: 240, cy: 100 }, { cx: 360, cy: 55 }].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="4" fill={i === 1 ? "#7C3AED" : "#38BDF8"}>
          <animate attributeName="r" values="4;6;4" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect x="222" y="72" width="76" height="32" rx="5" fill="#0D1F38" stroke="#7C3AED" strokeWidth="1" />
      <text x="260" y="86" textAnchor="middle" fill="#8BA3C4" fontSize="7">EVENTS / SEC</text>
      <text x="260" y="98" textAnchor="middle" fill="#fff" fontFamily="Syne,sans-serif" fontSize="12" fontWeight="700">2.4M</text>
      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
        <text key={i} x={40 + i * 60} y="238" fill="#8BA3C4" fontSize="7">{m}</text>
      ))}
    </svg>
  );
}

function SecurityVisual() {
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <circle cx="190" cy="140" r="105" fill="none" stroke="rgba(0,120,212,0.05)" strokeWidth="1">
        <animate attributeName="r" values="105;108;105" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="190" cy="140" r="80" fill="none" stroke="rgba(0,120,212,0.08)" strokeWidth="1" />
      <path d="M190,30 L280,65 L280,150 C280,200 190,240 190,240 C190,240 100,200 100,150 L100,65 Z" fill="rgba(0,120,212,0.1)" stroke="#0078D4" strokeWidth="1.5" />
      <path d="M190,55 L255,80 L255,148 C255,185 190,215 190,215 C190,215 125,185 125,148 L125,80 Z" fill="rgba(0,120,212,0.08)" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
      <rect x="174" y="128" width="32" height="26" rx="4" fill="rgba(56,189,248,0.2)" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M180,128 L180,118 C180,111 200,111 200,118 L200,128" fill="none" stroke="#38BDF8" strokeWidth="2" />
      <circle cx="190" cy="142" r="4" fill="#38BDF8">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      {["✓ ISO 27001", "✓ SOC 2 Type II", "✓ GDPR", "✓ HIPAA", "✓ PCI-DSS"].map((t, i) => (
        <text key={i} x="150" y={100 + i * 16} fill="#4ADE80" fontSize="9">{t}</text>
      ))}
      <rect x="120" y="248" width="140" height="20" rx="4" fill="rgba(74,222,128,0.1)" stroke="#4ADE80" strokeWidth="0.5" />
      <text x="190" y="261" textAnchor="middle" fill="#4ADE80" fontSize="8">Zero threats detected — 99d uptime</text>
    </svg>
  );
}

function CostVisual() {
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <text x="100" y="35" textAnchor="middle" fill="#8BA3C4" fontSize="8">BEFORE</text>
      <text x="264" y="35" textAnchor="middle" fill="#8BA3C4" fontSize="8">AFTER AZUREFLOW</text>
      <rect x="60" y="55" width="80" height="150" rx="6" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="1" />
      <text x="100" y="48" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="600">$24,800/mo</text>
      <text x="188" y="138" textAnchor="middle" fill="#FBBF24" fontSize="20">→</text>
      <text x="188" y="154" textAnchor="middle" fill="#FBBF24" fontSize="8" fontWeight="600">-40%</text>
      <rect x="240" y="115" width="80" height="90" rx="6" fill="rgba(74,222,128,0.12)" stroke="#4ADE80" strokeWidth="1.5">
        <animate attributeName="height" values="0;90" dur="1.5s" fill="freeze" />
        <animate attributeName="y" values="205;115" dur="1.5s" fill="freeze" />
      </rect>
      <text x="280" y="108" textAnchor="middle" fill="#4ADE80" fontSize="9" fontWeight="600">$14,900/mo</text>
      <line x1="40" y1="205" x2="340" y2="205" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <rect x="120" y="230" width="140" height="32" rx="6" fill="rgba(74,222,128,0.1)" stroke="#4ADE80" strokeWidth="1" />
      <text x="190" y="244" textAnchor="middle" fill="#4ADE80" fontSize="8" fontWeight="600">ANNUAL SAVINGS</text>
      <text x="190" y="257" textAnchor="middle" fill="#fff" fontFamily="Syne,sans-serif" fontSize="12" fontWeight="800">$118,800</text>
    </svg>
  );
}

function NetworkVisual() {
  const nodes = [
    { cx: 190, cy: 55, label: "EU" },
    { cx: 100, cy: 115, label: "US" },
    { cx: 280, cy: 115, label: "AS" },
    { cx: 130, cy: 195, label: "ME" },
    { cx: 250, cy: 195, label: "AU" },
  ];
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="ng6" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" /><stop offset="100%" stopColor="#0078D4" />
        </linearGradient>
      </defs>
      <circle cx="190" cy="140" r="90" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1" />
      <circle cx="190" cy="140" r="60" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />
      <ellipse cx="190" cy="140" rx="90" ry="40" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />
      <line x1="190" y1="50" x2="190" y2="230" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />
      <circle cx="190" cy="140" r="18" fill="rgba(0,120,212,0.3)" stroke="url(#ng6)" strokeWidth="2">
        <animate attributeName="r" values="18;20;18" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <text x="190" y="136" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AZURE</text>
      <text x="190" y="147" textAnchor="middle" fill="#38BDF8" fontSize="6">FD</text>
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1="190" y1="140" x2={n.cx} y2={n.cy} stroke="rgba(56,189,248,0.35)" strokeWidth="1" strokeDasharray="3,2">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
          </line>
          <circle cx={n.cx} cy={n.cy} r="10" fill="rgba(56,189,248,0.2)" stroke="#38BDF8" strokeWidth="1.5" />
          <text x={n.cx} y={n.cy + 4} textAnchor="middle" fill="#38BDF8" fontSize="7">{n.label}</text>
        </g>
      ))}
      <rect x="115" y="248" width="150" height="20" rx="4" fill="rgba(56,189,248,0.08)" stroke="#38BDF8" strokeWidth="0.5" />
      <text x="190" y="261" textAnchor="middle" fill="#38BDF8" fontSize="8">Global edge — avg 42ms latency</text>
    </svg>
  );
}

function AIVisual() {
  return (
    <svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <rect x="40" y="40" width="200" height="40" rx="10" fill="rgba(167,139,250,0.1)" stroke="#A78BFA" strokeWidth="1" />
      <text x="60" y="57" fill="#E2E8F0" fontSize="9">Summarize Q3 financial report</text>
      <text x="60" y="70" fill="#8BA3C4" fontSize="7">User — 10:42 AM</text>
      <rect x="80" y="96" width="260" height="56" rx="10" fill="rgba(0,120,212,0.1)" stroke="#0078D4" strokeWidth="1" />
      <text x="96" y="113" fill="#38BDF8" fontSize="8" fontWeight="600">Azure AI Copilot</text>
      <text x="96" y="127" fill="#E2E8F0" fontSize="8">Revenue grew 18% YoY to $4.2M.</text>
      <text x="96" y="140" fill="#E2E8F0" fontSize="8">3 risk factors identified. Full brief →</text>
      <rect x="40" y="168" width="80" height="28" rx="8" fill="rgba(167,139,250,0.08)" stroke="#A78BFA" strokeWidth="0.5" />
      {[60, 74, 88].map((cx, i) => (
        <circle key={i} cx={cx} cy="182" r="3" fill="#A78BFA">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[{ x: 40, label: "GPT-4o", c: "#A78BFA", bc: "#A78BFA" },
      { x: 132, label: "AI Search", c: "#38BDF8", bc: "#38BDF8" },
      { x: 224, label: "Private Tenant", c: "#8BA3C4", bc: "#0078D4" }].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="215" width={i === 2 ? 116 : 80} height="22" rx="4" fill={`${b.bc}14`} stroke={b.bc} strokeWidth="0.5" />
          <text x={b.x + (i === 2 ? 58 : 40)} y="229" textAnchor="middle" fill={b.c} fontSize="7">{b.label}</text>
        </g>
      ))}
      <text x="40" y="258" fill="#4ADE80" fontSize="8">🔒 Data never leaves your Azure subscription</text>
    </svg>
  );
}

// ─── Cursor Blink ─────────────────────────────────────────────────────────────
function Cursor({ color = C.az }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "2px",
        height: "1em",
        background: color,
        marginLeft: "2px",
        verticalAlign: "text-bottom",
        animation: "blink 0.9s step-end infinite",
      }}
    />
  );
}

// ─── Feature Item — auto-types desc when accordion opens ─────────────────────
function FeatureItem({ feature, accordionOpen, delay = 0 }) {
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const timerRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    clearTimeout(delayRef.current);

    if (!accordionOpen) {
      setTyped("");
      setTyping(false);
      return;
    }

    delayRef.current = setTimeout(() => {
      setTyping(true);
      let i = 0;
      const text = feature.desc;
      const tick = () => {
        i++;
        setTyped(text.slice(0, i));
        if (i < text.length) {
          timerRef.current = setTimeout(tick, 14);
        } else {
          setTyping(false);
        }
      };
      timerRef.current = setTimeout(tick, 14);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(delayRef.current);
    };
  }, [accordionOpen, feature.desc, delay]);

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200"
      style={{
        background: "rgba(0,120,212,0.05)",
        border: `1px solid ${C.border}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(0,120,212,0.1)";
        e.currentTarget.style.borderColor = "rgba(0,120,212,0.35)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(0,120,212,0.05)";
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.az }} />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-white mb-0.5" style={{ fontFamily: "Syne, sans-serif" }}>
          {feature.title}
        </h4>
        <p className="text-xs leading-relaxed min-h-[1rem]" style={{ color: C.muted }}>
          {typed}
          {typing && <Cursor />}
        </p>
      </div>
    </div>
  );
}

// ─── Capability Card ──────────────────────────────────────────────────────────
function CapCard({ cap, isOpen, onToggle, cardRef }) {
  const { displayed: typedDesc } = useTypeOnce(cap.desc, { speed: 12, enabled: true });

  return (
    <div
      ref={cardRef}
      data-idx={cap.id}
      id={`cap-${cap.id}`}
      className="transition-colors duration-300"
      style={{ borderBottom: `1px solid ${C.border}` }}
    >
      {/* Two-col on lg+, single col on smaller */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-0 lg:min-h-[420px]">

        {/* LEFT */}
        <div className="flex flex-col justify-start p-6 sm:p-10 lg:p-16 lg:pl-20">
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: C.muted, fontFamily: "DM Sans, sans-serif" }}
          >
            HOW IT WORKS
          </p>

          {/* Icon + Title */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl grid place-items-center text-xl sm:text-2xl flex-shrink-0 transition-all duration-300"
              style={{ background: cap.iconBg, border: `1px solid ${C.border}` }}
            >
              {cap.icon}
            </div>
            <h2
              className="font-black leading-tight tracking-tight text-white"
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(18px, 2.2vw, 34px)",
                minHeight: "2.4em",
              }}
            >
              {cap.title}
            </h2>
          </div>

          {/* Description — typed once */}
          <p
            className="text-sm leading-relaxed mb-6 sm:mb-7 font-light"
            style={{ color: C.muted, minHeight: "4.5em" }}
          >
            {typedDesc}
            {typedDesc.length < cap.desc.length && <Cursor />}
          </p>

          {/* Accordion */}
          <div style={{ borderLeft: `2px solid ${C.az}` }}>
            <button
              className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 text-left transition-colors duration-200 cursor-pointer"
              style={{ background: "rgba(0,120,212,0.06)", outline: "none" }}
              onClick={onToggle}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,120,212,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,120,212,0.06)"}
            >
              <span className="text-xs sm:text-sm font-bold truncate pr-2" style={{ color: C.accent, fontFamily: "Syne, sans-serif" }}>
                {cap.label} — Key Features
              </span>
              <span
                className="text-xs flex-shrink-0 transition-transform duration-300"
                style={{
                  color: C.muted,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}
              >
                ▾
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-500"
              style={{
                maxHeight: isOpen ? "800px" : "0",
                transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5">
                {cap.features.map((f, i) => (
                  <FeatureItem key={i} feature={f} accordionOpen={isOpen} delay={i * 180} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — visual */}
        <div
          className="flex items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-hidden order-first lg:order-last"
          style={{ background: cap.rightBg, minHeight: "220px" }}
        >
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm">
            {cap.visual}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────
export default function CapabilitySection() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [tabsVisible, setTabsVisible] = useState(false);
  const cardRefs = useRef([]);
  const tabsRef = useRef(null);
  const tabItemRefs = useRef([]);
  const anchorRef = useRef(null);
  const userInteracted = useRef(false);
  const observerReady = useRef(false);



  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setTabsVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-70px 0px 0px 0px" }
    );
    if (anchorRef.current) obs.observe(anchorRef.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        if (!observerReady.current) return;

        entries.forEach(e => {
          if (e.isIntersecting) setActiveTab(parseInt(e.target.dataset.idx));
        });
      },
      { threshold: 0.25, rootMargin: "-70px 0px -40% 0px" }
    );

    cardRefs.current.forEach(r => r && obs.observe(r));

    setTimeout(() => {
      observerReady.current = true;
    }, 300);

    return () => obs.disconnect();
  }, []);

  const isFirstRender = useRef(true);

 useEffect(() => {
  if (!userInteracted.current) return;

  const el = tabItemRefs.current[activeTab];
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}, [activeTab]);


  const scrollToCap = (idx) => {
     userInteracted.current = true;
    const el = document.getElementById(`cap-${idx}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
    setTimeout(() => setOpenAccordion(idx), 420);
  };


  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        ::-webkit-scrollbar { height: 0; width: 0; }
      `}</style>

      <div style={{ background: C.navy2 }}>
        <div ref={anchorRef} style={{ height: 0 }} />

        {/* ── Sticky Tab Bar ── */}
        <div
          ref={tabsRef}
          className="top-[55px] md:top-[160px] lg:top-[85px]"
          style={{
            position: "sticky",
            zIndex: 50,
            background: "rgba(2,11,24,0.96)",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${C.border}`,
            borderTop: `1px solid ${C.border}`,
            opacity: tabsVisible ? 1 : 0.85,
          }}
        >
          <div
            className="flex items-center overflow-x-auto"
            style={{ padding: "0 clamp(16px, 4vw, 80px)", scrollbarWidth: "none" }}
          >
            {CAPS.map((cap, i) => (
              <button
                key={i}
                ref={el => tabItemRefs.current[i] = el}
                onClick={() => scrollToCap(i)}
                className="flex-shrink-0 px-3 sm:px-4 py-3 sm:py-4 text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                style={{
                  fontFamily: "Syne, sans-serif",
                  color: activeTab === i ? "#fff" : C.muted,
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === i ? `2px solid ${C.az}` : "2px solid transparent",
                  letterSpacing: "0.02em",
                  outline: "none",
                }}
                onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = C.muted; }}
              >
                <span className="hidden sm:inline">{cap.label}</span>
                <span className="sm:hidden">{cap.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards ── */}
        {CAPS.map((cap, i) => (
          <CapCard
            key={i}
            cap={cap}
            isOpen={openAccordion === i}
            onToggle={() => setOpenAccordion(prev => (prev === i ? null : i))}
            cardRef={el => cardRefs.current[i] = el}
          />
        ))}
      </div>
    </>
  );
} 