import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_COMPANIES = [
  { id:"1",  name:"Pika Labs",     domain:"pika.art",        sector:"Generative AI", stage:"Series A", hc:38,  arr:4,   location:"Palo Alto, CA",    founded:2023, tags:["generative-video","creative-AI","consumer"],          score:null },
  { id:"2",  name:"Cognition AI",  domain:"cognition.ai",    sector:"AI Agents",     stage:"Series B", hc:55,  arr:12,  location:"San Francisco, CA", founded:2023, tags:["AI-agents","coding","developer-tools"],              score:null },
  { id:"3",  name:"Perplexity AI", domain:"perplexity.ai",   sector:"Search / AI",   stage:"Series C", hc:120, arr:30,  location:"San Francisco, CA", founded:2022, tags:["search","AI","consumer"],                            score:null },
  { id:"4",  name:"ElevenLabs",    domain:"elevenlabs.io",   sector:"Generative AI", stage:"Series B", hc:90,  arr:22,  location:"New York, NY",      founded:2022, tags:["voice-AI","audio","API"],                            score:null },
  { id:"5",  name:"Mistral AI",    domain:"mistral.ai",      sector:"Foundation ML", stage:"Series B", hc:200, arr:40,  location:"Paris, France",     founded:2023, tags:["LLM","open-source","foundation-model"],              score:null },
  { id:"6",  name:"Supabase",      domain:"supabase.com",    sector:"Dev Infra",     stage:"Series C", hc:110, arr:35,  location:"San Francisco, CA", founded:2020, tags:["database","BaaS","open-source"],                    score:null },
  { id:"7",  name:"Linear",        domain:"linear.app",      sector:"Productivity",  stage:"Series B", hc:60,  arr:18,  location:"San Francisco, CA", founded:2019, tags:["project-management","developer-tools","B2B"],        score:null },
  { id:"8",  name:"Retool",        domain:"retool.com",      sector:"Dev Infra",     stage:"Series D", hc:400, arr:80,  location:"San Francisco, CA", founded:2017, tags:["internal-tools","low-code","enterprise"],            score:null },
  { id:"9",  name:"Anyscale",      domain:"anyscale.com",    sector:"ML Infra",      stage:"Series C", hc:180, arr:28,  location:"Berkeley, CA",      founded:2019, tags:["ML-infrastructure","distributed","open-source"],     score:null },
  { id:"10", name:"Warp",          domain:"warp.dev",        sector:"Dev Infra",     stage:"Series B", hc:75,  arr:10,  location:"New York, NY",      founded:2020, tags:["terminal","developer-tools","AI"],                  score:null },
  { id:"11", name:"Runway",        domain:"runwayml.com",    sector:"Generative AI", stage:"Series C", hc:95,  arr:25,  location:"New York, NY",      founded:2018, tags:["generative-video","creative-AI","enterprise"],       score:null },
  { id:"12", name:"Modal",         domain:"modal.com",       sector:"ML Infra",      stage:"Series A", hc:40,  arr:8,   location:"New York, NY",      founded:2021, tags:["cloud","serverless","ML-infrastructure"],            score:null },
  { id:"13", name:"Cursor",        domain:"cursor.com",      sector:"AI Agents",     stage:"Series B", hc:50,  arr:20,  location:"San Francisco, CA", founded:2022, tags:["AI-coding","developer-tools","IDE"],                 score:null },
  { id:"14", name:"Together AI",   domain:"together.ai",     sector:"ML Infra",      stage:"Series B", hc:85,  arr:15,  location:"San Francisco, CA", founded:2022, tags:["inference","open-source","foundation-model"],        score:null },
  { id:"15", name:"Replit",        domain:"replit.com",      sector:"Dev Infra",     stage:"Series C", hc:130, arr:45,  location:"San Francisco, CA", founded:2016, tags:["cloud-IDE","AI","developer-tools"],                  score:null },
];

const DEFAULT_THESIS = {
  fundName: "Apex Ventures",
  focus: "Early-stage B2B software and AI infrastructure",
  sectors: ["AI Agents", "ML Infra", "Dev Infra", "Generative AI"],
  stages: ["Series A", "Series B"],
  keywords: ["open-source", "developer-tools", "API", "infrastructure", "foundation-model"],
  antiPatterns: ["consumer", "gaming", "hardware"],
  minARR: 5,
  maxHC: 250,
  geoFocus: "US & Europe",
};

const SECTORS = ["All","AI Agents","Generative AI","Foundation ML","ML Infra","Dev Infra","Search / AI","Productivity"];
const STAGES  = ["All","Series A","Series B","Series C","Series D"];
const PAGE_SZ = 8;

// ─── ANTHROPIC API ────────────────────────────────────────────────────────────
async function callClaude(prompt, systemPrompt = "") {
  const messages = [{ role:"user", content: prompt }];
  const body = { model:"claude-sonnet-4-20250514", max_tokens:1200, messages };
  if (systemPrompt) body.system = systemPrompt;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type==="text")?.text || "{}";
  const clean = text.replace(/```json\n?|```/g,"").trim();
  try { return JSON.parse(clean); } catch { return null; }
}

async function enrichCompany(company, thesis) {
  const prompt = `You are a VC analyst at ${thesis.fundName}. Our thesis: "${thesis.focus}". Target sectors: ${thesis.sectors.join(", ")}. Key signals we look for: ${thesis.keywords.join(", ")}. Anti-patterns to avoid: ${thesis.antiPatterns.join(", ")}.

Analyze the company "${company.name}" (domain: ${company.domain}, sector: ${company.sector}, stage: ${company.stage}, tags: ${company.tags.join(", ")}).

Return ONLY a JSON object (no markdown):
{
  "summary": "2-sentence company description",
  "whatTheyDo": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "keywords": ["kw1","kw2","kw3","kw4","kw5","kw6"],
  "thesisScore": <integer 0-100>,
  "thesisVerdict": "Strong Match" | "Partial Match" | "Weak Match" | "Not a Fit",
  "matchReasons": ["reason company matches thesis 1", "reason 2", "reason 3"],
  "watchouts": ["concern or anti-pattern 1", "concern 2"],
  "signals": [
    {"label": "signal name", "type": "positive"|"neutral"|"negative", "detail": "1 sentence"},
    {"label": "signal name", "type": "positive"|"neutral"|"negative", "detail": "1 sentence"},
    {"label": "signal name", "type": "positive"|"neutral"|"negative", "detail": "1 sentence"}
  ],
  "sources": [
    {"url": "https://${company.domain}", "label": "Homepage"},
    {"url": "https://${company.domain}/about", "label": "About"},
    {"url": "https://${company.domain}/careers", "label": "Careers"}
  ]
}`;
  return callClaude(prompt);
}

async function scoutCompanies(thesis, existing) {
  const prompt = `You are a VC scout for ${thesis.fundName}. Our investment thesis: "${thesis.focus}". Target sectors: ${thesis.sectors.join(", ")}. Stages: ${thesis.stages.join(", ")}. Keywords: ${thesis.keywords.join(", ")}. Anti-patterns to avoid: ${thesis.antiPatterns.join(", ")}.

Suggest 5 real, currently active startups that strongly match this thesis. Do NOT suggest: ${existing.join(", ")}.

Return ONLY a JSON array (no markdown):
[
  {
    "name": "Company Name",
    "domain": "company.com",
    "sector": "<one of: ${thesis.sectors.join("|")}>",
    "stage": "<one of: ${thesis.stages.join("|")}>",
    "location": "City, Country",
    "founded": <year>,
    "hc": <estimated headcount integer>,
    "arr": <estimated ARR in $M integer>,
    "tags": ["tag1","tag2","tag3"],
    "whyMatch": "1-2 sentence explanation of why this strongly fits the thesis",
    "signal": "One standout recent signal or traction point"
  }
]`;
  return callClaude(prompt);
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --cream:#faf8f4;
  --cream2:#f4f1eb;
  --cream3:#ede9e0;
  --ink:#1a1612;
  --ink2:#3d3530;
  --ink3:#6b5f56;
  --muted:#9b8f86;
  --border:#ddd8ce;
  --border2:#c8c0b4;
  --amber:#c8660a;
  --amber-light:#fdf0e4;
  --amber-mid:#f0d4b0;
  --green:#1a6e3c;
  --green-light:#e8f5ee;
  --red:#c0392b;
  --red-light:#fdecea;
  --blue:#1a4a8a;
  --blue-light:#e8f0fc;
  --gold:#b8860b;
  --font-serif:'Playfair Display',Georgia,serif;
  --font-mono:'DM Mono',monospace;
  --font-sans:'DM Sans',sans-serif;
  --shadow:0 1px 3px rgba(26,22,18,0.08),0 1px 2px rgba(26,22,18,0.04);
  --shadow-md:0 4px 12px rgba(26,22,18,0.1),0 2px 4px rgba(26,22,18,0.06);
  --shadow-lg:0 12px 32px rgba(26,22,18,0.12),0 4px 8px rgba(26,22,18,0.06);
}

body{background:var(--cream);color:var(--ink);font-family:var(--font-sans);height:100vh;overflow:hidden}

.app{display:flex;height:100vh;overflow:hidden}

/* ── SIDEBAR ── */
.sidebar{
  width:236px;min-width:236px;background:var(--ink);
  display:flex;flex-direction:column;overflow:hidden;
}
.sb-logo{
  padding:20px 18px 18px;border-bottom:1px solid rgba(255,255,255,0.08);
  display:flex;align-items:center;gap:10px;
}
.sb-logo-mark{
  width:32px;height:32px;background:var(--amber);border-radius:6px;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-serif);font-size:17px;font-weight:700;color:#fff;
}
.sb-logo-name{font-family:var(--font-serif);font-size:16px;color:#fff;font-weight:600;letter-spacing:-0.2px}
.sb-logo-badge{
  margin-left:auto;font-size:9px;font-family:var(--font-mono);
  background:rgba(200,102,10,0.25);color:var(--amber);
  padding:2px 6px;border-radius:3px;letter-spacing:0.5px;
}

.sb-section{padding:14px 10px 6px}
.sb-section-label{font-size:9px;font-family:var(--font-mono);color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:1.8px;padding:0 8px 8px}

.nav-item{
  display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:6px;
  cursor:pointer;font-size:12.5px;color:rgba(255,255,255,0.5);
  transition:all 0.15s;user-select:none;font-family:var(--font-sans);font-weight:400;
}
.nav-item:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.8)}
.nav-item.active{background:rgba(200,102,10,0.18);color:#f5c48a;border-left:2px solid var(--amber);padding-left:8px}
.nav-icon{font-size:14px;width:18px;text-align:center;opacity:0.7}
.nav-item.active .nav-icon{opacity:1}
.nav-badge{
  margin-left:auto;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.35);
  font-size:9.5px;padding:1px 6px;border-radius:10px;font-family:var(--font-mono);
}
.nav-item.active .nav-badge{background:rgba(200,102,10,0.3);color:#f5c48a}

.sb-thesis-card{
  margin:10px;border-radius:8px;background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.08);padding:12px;
}
.sb-thesis-label{font-size:9px;font-family:var(--font-mono);color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px}
.sb-thesis-name{font-size:12px;color:#fff;font-weight:500;margin-bottom:4px}
.sb-thesis-desc{font-size:10.5px;color:rgba(255,255,255,0.4);line-height:1.5}

.sb-bottom{margin-top:auto;border-top:1px solid rgba(255,255,255,0.07);padding:12px}
.sb-stat{display:flex;justify-content:space-between;font-size:10.5px;color:rgba(255,255,255,0.3);padding:3px 0}
.sb-stat span{color:rgba(255,255,255,0.65);font-family:var(--font-mono)}

/* ── MAIN ── */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--cream)}

/* ── TOPBAR ── */
.topbar{
  height:54px;background:var(--cream);border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:12px;padding:0 24px;flex-shrink:0;
}
.topbar-breadcrumb{font-size:11px;font-family:var(--font-mono);color:var(--muted);display:flex;align-items:center;gap:6px}
.breadcrumb-sep{color:var(--border2)}
.breadcrumb-active{color:var(--ink2);font-weight:500}

.search-wrap{position:relative;max-width:360px;flex:1}
.search-input{
  width:100%;background:var(--cream2);border:1px solid var(--border);border-radius:7px;
  padding:7px 12px 7px 34px;color:var(--ink);font-family:var(--font-sans);font-size:13px;
  outline:none;transition:all 0.2s;
}
.search-input:focus{border-color:var(--amber);background:#fff;box-shadow:0 0 0 3px rgba(200,102,10,0.1)}
.search-input::placeholder{color:var(--muted)}
.search-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px;pointer-events:none}

.topbar-right{margin-left:auto;display:flex;align-items:center;gap:8px}

/* ── BUTTONS ── */
.btn{
  padding:7px 14px;border-radius:6px;font-family:var(--font-sans);font-size:12px;
  cursor:pointer;transition:all 0.15s;border:1px solid transparent;font-weight:500;
  display:inline-flex;align-items:center;gap:6px;
}
.btn-primary{background:var(--amber);color:#fff;border-color:var(--amber)}
.btn-primary:hover{background:#b85c08}
.btn-secondary{background:#fff;color:var(--ink2);border-color:var(--border)}
.btn-secondary:hover{border-color:var(--border2);background:var(--cream2)}
.btn-ghost{background:transparent;color:var(--muted);border-color:transparent}
.btn-ghost:hover{background:var(--cream2);color:var(--ink2)}
.btn-sm{padding:5px 10px;font-size:11px}
.btn-xs{padding:3px 8px;font-size:10.5px}
.btn-danger{background:transparent;color:var(--red);border-color:rgba(192,57,43,0.25)}
.btn-danger:hover{background:var(--red-light)}
.btn:disabled{opacity:0.5;cursor:not-allowed}

/* ── PAGE ── */
.page{flex:1;overflow:auto;padding:24px}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
.page-title{font-family:var(--font-serif);font-size:22px;font-weight:600;color:var(--ink);letter-spacing:-0.3px}
.page-subtitle{font-size:12px;color:var(--muted);margin-top:3px}

/* ── FILTERS ── */
.filters-row{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.filter-group{display:flex;align-items:center;gap:6px}
.filter-label{font-size:11px;color:var(--muted);font-family:var(--font-mono)}
.chip{
  padding:4px 10px;border-radius:20px;font-size:11.5px;cursor:pointer;
  border:1px solid var(--border);color:var(--ink3);background:#fff;
  transition:all 0.15s;font-family:var(--font-sans);font-weight:400;
}
.chip:hover{border-color:var(--border2);color:var(--ink2)}
.chip.on{border-color:var(--amber);color:var(--amber);background:var(--amber-light)}
.filter-divider{width:1px;height:18px;background:var(--border);margin:0 4px}
.result-count{font-size:11.5px;color:var(--muted);margin-left:auto;font-family:var(--font-mono)}

/* ── TABLE ── */
.table-card{border:1px solid var(--border);border-radius:10px;overflow:hidden;background:#fff;box-shadow:var(--shadow)}
table{width:100%;border-collapse:collapse}
thead tr{background:var(--cream2);border-bottom:1px solid var(--border)}
th{
  text-align:left;padding:10px 16px;font-size:10.5px;font-weight:500;
  color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;
  font-family:var(--font-mono);cursor:pointer;user-select:none;white-space:nowrap;
}
th:hover{color:var(--ink2)}
th.sorted{color:var(--amber)}
tbody tr{border-bottom:1px solid var(--border);transition:background 0.1s;cursor:pointer}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--cream)}
td{padding:11px 16px;font-size:13px;color:var(--ink2);white-space:nowrap}
.td-company{display:flex;align-items:center;gap:10px}
.co-avatar{
  width:28px;height:28px;border-radius:6px;background:var(--cream3);
  border:1px solid var(--border);display:flex;align-items:center;
  justify-content:center;font-size:14px;flex-shrink:0;
}
.co-name{font-weight:500;color:var(--ink)}
.co-domain{font-size:11px;color:var(--muted);font-family:var(--font-mono)}

.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
.badge-sector{background:var(--blue-light);color:var(--blue);border:1px solid rgba(26,74,138,0.15)}
.badge-stage{background:var(--amber-light);color:var(--amber);border:1px solid rgba(200,102,10,0.2)}

/* SCORE CELL */
.score-cell{display:flex;align-items:center;gap:8px}
.score-ring{position:relative;width:32px;height:32px;flex-shrink:0}
.score-ring svg{transform:rotate(-90deg)}
.score-ring-num{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-size:9px;font-family:var(--font-mono);font-weight:500;color:var(--ink);
}
.score-verdict{font-size:11px;font-weight:500}
.score-null{font-size:11px;color:var(--muted);font-family:var(--font-mono)}
.verdict-strong{color:var(--green)}
.verdict-partial{color:var(--gold)}
.verdict-weak{color:var(--muted)}
.verdict-none{color:var(--red)}

/* ── PAGINATION ── */
.pagination{display:flex;align-items:center;justify-content:space-between;margin-top:16px}
.pag-info{font-size:11.5px;color:var(--muted);font-family:var(--font-mono)}
.pag-buttons{display:flex;gap:4px}
.pag-btn{
  padding:5px 11px;border-radius:5px;font-size:11.5px;cursor:pointer;font-family:var(--font-mono);
  border:1px solid var(--border);color:var(--muted);background:#fff;transition:all 0.15s;
}
.pag-btn:hover:not(:disabled){border-color:var(--border2);color:var(--ink2)}
.pag-btn:disabled{opacity:0.35;cursor:not-allowed}
.pag-btn.on{border-color:var(--amber);color:var(--amber);background:var(--amber-light)}

/* ── PROFILE ── */
.profile-hero{
  background:#fff;border:1px solid var(--border);border-radius:12px;
  padding:24px 28px;margin-bottom:18px;display:flex;align-items:flex-start;gap:18px;
  box-shadow:var(--shadow);
}
.profile-avatar{
  width:60px;height:60px;border-radius:12px;background:var(--cream2);
  border:1px solid var(--border);display:flex;align-items:center;
  justify-content:center;font-size:26px;flex-shrink:0;
}
.profile-info{flex:1}
.profile-name{font-family:var(--font-serif);font-size:26px;font-weight:600;color:var(--ink);letter-spacing:-0.4px;margin-bottom:2px}
.profile-meta{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:12px;color:var(--muted)}
.profile-meta a{color:var(--blue);text-decoration:none;font-family:var(--font-mono)}
.profile-tags{display:flex;flex-wrap:wrap;gap:5px}
.tag{background:var(--cream2);border:1px solid var(--border);color:var(--ink3);padding:2px 9px;border-radius:12px;font-size:11px}

.profile-score-block{
  background:var(--cream2);border:1px solid var(--border);border-radius:10px;
  padding:16px 18px;text-align:center;flex-shrink:0;min-width:140px;
}
.psb-label{font-size:9.5px;font-family:var(--font-mono);color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px}
.psb-score{font-family:var(--font-serif);font-size:36px;font-weight:700;color:var(--ink);line-height:1}
.psb-verdict{font-size:12px;font-weight:600;margin-top:4px}

.two-col{display:grid;grid-template-columns:1fr 340px;gap:18px}
.stack>*+*{margin-top:14px}

.card{background:#fff;border:1px solid var(--border);border-radius:10px;padding:20px 22px;box-shadow:var(--shadow)}
.card-title{
  font-size:10px;font-family:var(--font-mono);font-weight:500;color:var(--muted);
  text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;
  display:flex;align-items:center;gap:8px;
}
.card-title-action{margin-left:auto}

.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
.stat-item{background:var(--cream2);border:1px solid var(--border);border-radius:7px;padding:11px 13px}
.stat-label{font-size:9.5px;font-family:var(--font-mono);color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
.stat-val{font-size:17px;font-weight:600;color:var(--ink);font-family:var(--font-serif)}

/* THESIS MATCH CARD */
.match-reason{display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)}
.match-reason:last-child{border-bottom:none}
.match-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:5px}
.match-dot.warn{background:var(--amber)}
.match-dot.bad{background:var(--red)}
.match-text{font-size:12.5px;color:var(--ink2);line-height:1.5}

/* SIGNALS */
.signal-row{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)}
.signal-row:last-child{border-bottom:none}
.sig-icon{font-size:15px;flex-shrink:0;margin-top:1px}
.sig-body{}
.sig-label{font-size:12.5px;font-weight:500;color:var(--ink);margin-bottom:2px}
.sig-detail{font-size:11.5px;color:var(--muted);line-height:1.4}

/* ENRICHMENT */
.enrich-idle{text-align:center;padding:32px 20px}
.enrich-idle-icon{font-size:32px;margin-bottom:10px}
.enrich-idle-title{font-family:var(--font-serif);font-size:15px;color:var(--ink);margin-bottom:6px}
.enrich-idle-desc{font-size:12px;color:var(--muted);line-height:1.5}
.enrich-loading{display:flex;flex-direction:column;align-items:center;padding:32px 20px;gap:10px}
.spinner{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--amber);border-radius:50%;animation:spin 0.7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-steps{font-size:11.5px;color:var(--muted);text-align:center}

.enrich-section{margin-bottom:16px}
.enrich-label{font-size:9.5px;font-family:var(--font-mono);color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px}
.enrich-summary{font-size:13px;color:var(--ink2);line-height:1.6}
.bullet-list{list-style:none}
.bullet-list li{font-size:12.5px;color:var(--ink3);padding:3px 0 3px 14px;position:relative;line-height:1.5}
.bullet-list li::before{content:"▸";position:absolute;left:0;color:var(--amber);font-size:11px;top:4px}
.kw-wrap{display:flex;flex-wrap:wrap;gap:5px}
.kw{background:var(--cream2);border:1px solid var(--border);color:var(--ink3);padding:2px 9px;border-radius:12px;font-size:11px}
.source-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:11.5px}
.source-row:last-child{border-bottom:none}
.source-url{color:var(--blue);font-family:var(--font-mono);font-size:10.5px}
.source-label{color:var(--muted);font-size:10.5px}

/* NOTES */
.notes-area{
  width:100%;background:var(--cream2);border:1px solid var(--border);border-radius:7px;
  padding:10px 13px;color:var(--ink);font-family:var(--font-sans);font-size:13px;
  outline:none;resize:vertical;min-height:90px;transition:border 0.2s;line-height:1.6;
}
.notes-area:focus{border-color:var(--amber);background:#fff}
.notes-area::placeholder{color:var(--muted)}

/* LISTS PAGE */
.lists-layout{display:grid;grid-template-columns:260px 1fr;gap:18px}
.list-entry{
  padding:11px 13px;border-radius:7px;cursor:pointer;margin-bottom:6px;
  border:1px solid var(--border);background:#fff;transition:all 0.15s;
}
.list-entry:hover{border-color:var(--border2);box-shadow:var(--shadow)}
.list-entry.on{border-color:var(--amber);background:var(--amber-light)}
.list-entry-name{font-size:13px;font-weight:500;color:var(--ink);margin-bottom:2px}
.list-entry-count{font-size:11px;color:var(--muted);font-family:var(--font-mono)}

/* SAVED SEARCHES */
.saved-entry{
  background:#fff;border:1px solid var(--border);border-radius:8px;padding:14px 18px;
  margin-bottom:8px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all 0.15s;
}
.saved-entry:hover{border-color:var(--border2);box-shadow:var(--shadow)}
.saved-q{font-size:13px;color:var(--ink);flex:1}
.saved-q-chips{display:flex;gap:5px;margin-top:4px}
.saved-chip{background:var(--cream2);border:1px solid var(--border);color:var(--muted);padding:1px 7px;border-radius:10px;font-size:10.5px}

/* THESIS SETTINGS */
.thesis-form{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-group{display:flex;flex-direction:column;gap:6px}
.form-label{font-size:11px;font-family:var(--font-mono);color:var(--muted);text-transform:uppercase;letter-spacing:1px}
.form-input,.form-textarea{
  background:var(--cream2);border:1px solid var(--border);border-radius:6px;
  padding:8px 12px;color:var(--ink);font-family:var(--font-sans);font-size:13px;
  outline:none;transition:border 0.2s;
}
.form-input:focus,.form-textarea:focus{border-color:var(--amber);background:#fff}
.form-textarea{resize:vertical;min-height:60px;line-height:1.5}
.toggle-grid{display:flex;flex-wrap:wrap;gap:5px}
.toggle-chip{
  padding:4px 10px;border-radius:14px;font-size:12px;cursor:pointer;border:1px solid var(--border);
  color:var(--ink3);background:#fff;transition:all 0.15s;
}
.toggle-chip:hover{border-color:var(--border2)}
.toggle-chip.on{border-color:var(--amber);color:var(--amber);background:var(--amber-light)}
.form-span{grid-column:1/-1}

/* SCOUT PAGE */
.scout-header{
  background:linear-gradient(135deg,var(--ink) 0%,var(--ink2) 100%);
  border-radius:12px;padding:24px 28px;margin-bottom:20px;color:#fff;
  display:flex;align-items:center;gap:20px;position:relative;overflow:hidden;
}
.scout-header::before{
  content:'';position:absolute;right:-40px;top:-40px;width:200px;height:200px;
  border-radius:50%;background:rgba(200,102,10,0.15);
}
.scout-header::after{
  content:'';position:absolute;right:60px;top:30px;width:100px;height:100px;
  border-radius:50%;background:rgba(200,102,10,0.08);
}
.scout-icon{font-size:36px;flex-shrink:0;z-index:1}
.scout-title{font-family:var(--font-serif);font-size:22px;font-weight:600;margin-bottom:4px;z-index:1}
.scout-desc{font-size:13px;color:rgba(255,255,255,0.6);z-index:1;line-height:1.5}
.scout-btn{margin-left:auto;z-index:1;flex-shrink:0}

.scout-result-card{
  background:#fff;border:1px solid var(--border);border-radius:10px;padding:18px 20px;
  margin-bottom:12px;box-shadow:var(--shadow);transition:all 0.2s;cursor:pointer;
}
.scout-result-card:hover{box-shadow:var(--shadow-md);border-color:var(--amber);transform:translateY(-1px)}
.scout-card-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px}
.scout-card-info{flex:1}
.scout-card-name{font-family:var(--font-serif);font-size:16px;font-weight:600;color:var(--ink);margin-bottom:3px}
.scout-card-meta{font-size:11.5px;color:var(--muted);display:flex;gap:8px;align-items:center}
.scout-match-box{background:var(--amber-light);border:1px solid var(--amber-mid);border-radius:7px;padding:9px 12px;margin-bottom:8px}
.scout-match-label{font-size:9.5px;font-family:var(--font-mono);color:var(--amber);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px}
.scout-match-text{font-size:12.5px;color:var(--ink2);line-height:1.5}
.scout-signal{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px}
.new-badge{background:var(--green-light);color:var(--green);border:1px solid rgba(26,110,60,0.2);padding:2px 8px;border-radius:10px;font-size:10px;font-weight:500}

/* EMPTY STATE */
.empty{text-align:center;padding:56px 24px;color:var(--muted)}
.empty-icon{font-size:36px;margin-bottom:12px;opacity:0.4}
.empty-title{font-family:var(--font-serif);font-size:16px;color:var(--ink2);margin-bottom:6px}
.empty-desc{font-size:12.5px;line-height:1.6}

/* BACK */
.back-btn{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--muted);cursor:pointer;margin-bottom:16px;transition:color 0.15s}
.back-btn:hover{color:var(--ink2)}

/* TOAST */
.toast{
  position:fixed;bottom:24px;right:24px;background:var(--ink);color:#fff;
  border-radius:8px;padding:11px 18px;font-size:13px;z-index:9999;
  display:flex;align-items:center;gap:9px;box-shadow:var(--shadow-lg);
  animation:toastIn 0.2s ease;
}
@keyframes toastIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
.toast-dot{width:7px;height:7px;border-radius:50%;background:var(--amber);flex-shrink:0}

/* INPUT */
.input{
  background:#fff;border:1px solid var(--border);border-radius:6px;
  padding:7px 11px;color:var(--ink);font-family:var(--font-sans);font-size:13px;
  outline:none;transition:border 0.2s;
}
.input:focus{border-color:var(--amber)}
.input::placeholder{color:var(--muted)}

/* LIST PICKER DROPDOWN */
.dropdown{
  position:absolute;right:0;top:calc(100% + 4px);background:#fff;
  border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow-md);
  min-width:200px;z-index:100;padding:6px;
}
.dropdown-item{
  padding:8px 11px;border-radius:5px;font-size:13px;cursor:pointer;color:var(--ink2);
  transition:background 0.1s;
}
.dropdown-item:hover{background:var(--cream2)}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--border2)}

/* ANIMATIONS */
.fade-in{animation:fadeIn 0.25s ease both}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const EMOJI = { "Pika Labs":"🎬","Cognition AI":"🤖","Perplexity AI":"🔍","ElevenLabs":"🔊","Mistral AI":"🌊","Supabase":"⚡","Linear":"📐","Retool":"🔧","Anyscale":"🌀","Warp":"💻","Runway":"🎞️","Modal":"☁️","Cursor":"✏️","Together AI":"🔗","Replit":"🌐" };
const getEmoji = n => EMOJI[n] || "🏢";
const verdictColor = v => ({ "Strong Match":"verdict-strong","Partial Match":"verdict-partial","Weak Match":"verdict-weak","Not a Fit":"verdict-none" }[v] || "");
const verdictRingColor = v => ({ "Strong Match":"#1a6e3c","Partial Match":"#b8860b","Weak Match":"#9b8f86","Not a Fit":"#c0392b" }[v] || "#ddd8ce");

function ScoreRing({ score, verdict }) {
  const r = 13, circ = 2 * Math.PI * r;
  const fill = score != null ? (circ - (circ * score) / 100) : circ;
  const color = verdict ? verdictRingColor(verdict) : "#ddd8ce";
  return (
    <div className="score-ring">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={r} fill="none" stroke="var(--border)" strokeWidth="3"/>
        {score != null && <circle cx="16" cy="16" r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"/>}
      </svg>
      <div className="score-ring-num">{score != null ? score : "—"}</div>
    </div>
  );
}

function ScoreCell({ enrichData }) {
  if (!enrichData) return <span className="score-null">Not scored</span>;
  return (
    <div className="score-cell">
      <ScoreRing score={enrichData.thesisScore} verdict={enrichData.thesisVerdict} />
      <span className={`score-verdict ${verdictColor(enrichData.thesisVerdict)}`}>{enrichData.thesisVerdict}</span>
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  return <div className="toast"><div className="toast-dot" />{msg}</div>;
}

// ─── ENRICH PANEL ─────────────────────────────────────────────────────────────
function EnrichPanel({ company, thesis, enrichCache, setEnrichCache }) {
  const key = `enrich_${company.id}`;
  const [status, setStatus] = useState("idle");
  const [cachedAt, setCachedAt] = useState(null);

  useEffect(() => {
    const hit = enrichCache[company.id];
    if (hit) { setStatus("done"); setCachedAt(hit.ts); }
    else { setStatus("idle"); setCachedAt(null); }
  }, [company.id]);

  const data = enrichCache[company.id]?.data;

  const run = async () => {
    setStatus("loading");
    const result = await enrichCompany(company, thesis);
    if (result) {
      const ts = new Date().toISOString();
      const entry = { data: result, ts };
      setEnrichCache(c => ({ ...c, [company.id]: entry }));
      try { localStorage.setItem(key, JSON.stringify(entry)); } catch {}
      setStatus("done"); setCachedAt(ts);
    } else { setStatus("error"); }
  };

  return (
    <div className="card">
      <div className="card-title">
        ⚡ Live Enrichment
        {cachedAt && <span style={{ color:"var(--muted)", fontWeight:400, textTransform:"none", letterSpacing:0, fontSize:10 }}>cached {new Date(cachedAt).toLocaleTimeString()}</span>}
        <div className="card-title-action">
          <button className="btn btn-primary btn-xs" onClick={run} disabled={status==="loading"}>
            {status==="loading" ? "Enriching…" : status==="done" ? "Re-enrich" : "Enrich"}
          </button>
        </div>
      </div>

      {status==="idle" && (
        <div className="enrich-idle">
          <div className="enrich-idle-icon">⚡</div>
          <div className="enrich-idle-title">Thesis-aware enrichment</div>
          <div className="enrich-idle-desc">Pulls public web data, extracts signals, and scores this company against <strong>{thesis.fundName}'s</strong> investment thesis.</div>
        </div>
      )}
      {status==="loading" && (
        <div className="enrich-loading">
          <div className="spinner" />
          <div className="loading-steps">Scraping public pages<br/>Extracting signals · Scoring against thesis…</div>
        </div>
      )}
      {status==="error" && (
        <div className="enrich-idle" style={{ color:"var(--red)" }}>
          <div className="enrich-idle-icon">⚠</div>
          <div className="enrich-idle-title">Enrichment failed</div>
          <div className="enrich-idle-desc">Check your API key or try again.</div>
        </div>
      )}
      {status==="done" && data && (
        <div className="fade-in">
          <div className="enrich-section">
            <div className="enrich-label">Summary</div>
            <div className="enrich-summary">{data.summary}</div>
          </div>
          <div className="enrich-section">
            <div className="enrich-label">What They Do</div>
            <ul className="bullet-list">{data.whatTheyDo?.map((b,i)=><li key={i}>{b}</li>)}</ul>
          </div>
          <div className="enrich-section">
            <div className="enrich-label">Keywords</div>
            <div className="kw-wrap">{data.keywords?.map((k,i)=><span key={i} className="kw">{k}</span>)}</div>
          </div>
          <div className="enrich-section">
            <div className="enrich-label">Sources</div>
            <div>{data.sources?.map((s,i)=>(
              <div key={i} className="source-row">
                <span className="source-url">{s.url}</span>
                <span className="source-label">{s.label}</span>
              </div>
            ))}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── THESIS MATCH CARD ────────────────────────────────────────────────────────
function ThesisMatchCard({ data }) {
  if (!data) return null;
  return (
    <div className="card">
      <div className="card-title">🎯 Thesis Match</div>
      <div style={{ display:"flex", gap:16, marginBottom:16, alignItems:"center" }}>
        <div style={{ textAlign:"center" }}>
          <ScoreRing score={data.thesisScore} verdict={data.thesisVerdict} />
        </div>
        <div>
          <div className={`score-verdict ${verdictColor(data.thesisVerdict)}`} style={{ fontSize:15, fontWeight:600, marginBottom:2 }}>{data.thesisVerdict}</div>
          <div style={{ fontSize:12, color:"var(--muted)" }}>Thesis alignment score</div>
        </div>
      </div>
      {data.matchReasons?.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <div className="enrich-label" style={{ marginBottom:8 }}>Why it matches</div>
          {data.matchReasons.map((r,i)=>(
            <div key={i} className="match-reason">
              <div className="match-dot" />
              <div className="match-text">{r}</div>
            </div>
          ))}
        </div>
      )}
      {data.watchouts?.length > 0 && (
        <div>
          <div className="enrich-label" style={{ marginBottom:8 }}>Watch-outs</div>
          {data.watchouts.map((w,i)=>(
            <div key={i} className="match-reason">
              <div className="match-dot warn" />
              <div className="match-text">{w}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SIGNALS CARD ─────────────────────────────────────────────────────────────
function SignalsCard({ company, enrichData }) {
  const mockSignals = company.tags.slice(0,3).map((t,i)=>({ label: t.replace(/-/g," "), type:"positive", detail:"Identified from company profile and public data." }));
  const signals = enrichData?.signals || mockSignals;
  const icon = { positive:"🟢", neutral:"🟡", negative:"🔴" };
  return (
    <div className="card">
      <div className="card-title">📡 Signals</div>
      {signals.map((s,i)=>(
        <div key={i} className="signal-row">
          <div className="sig-icon">{icon[s.type]||"⚪"}</div>
          <div className="sig-body">
            <div className="sig-label">{s.label}</div>
            <div className="sig-detail">{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── COMPANY PROFILE ──────────────────────────────────────────────────────────
function ProfilePage({ company, onBack, lists, onSaveToList, enrichCache, setEnrichCache, thesis, toast }) {
  const enrichData = enrichCache[company.id]?.data;
  const [note, setNote] = useState(()=>{ try{ return localStorage.getItem(`note_${company.id}`)||""; }catch{return "";} });
  const [picker, setPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(()=>{
    const handler = e => { if(pickerRef.current && !pickerRef.current.contains(e.target)) setPicker(false); };
    document.addEventListener("mousedown", handler);
    return ()=>document.removeEventListener("mousedown", handler);
  },[]);

  const saveNote = () => { try{ localStorage.setItem(`note_${company.id}`,note); toast("Note saved"); }catch{} };

  const scoreDisplay = enrichData ? (
    <div className="profile-score-block">
      <div className="psb-label">Thesis Score</div>
      <div className="psb-score" style={{ color: verdictRingColor(enrichData.thesisVerdict) }}>{enrichData.thesisScore}</div>
      <div className={`psb-verdict ${verdictColor(enrichData.thesisVerdict)}`}>{enrichData.thesisVerdict}</div>
    </div>
  ) : (
    <div className="profile-score-block">
      <div className="psb-label">Thesis Score</div>
      <div className="psb-score" style={{ color:"var(--border2)", fontSize:28 }}>—</div>
      <div style={{ fontSize:11, color:"var(--muted)", marginTop:4 }}>Not enriched</div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="back-btn" onClick={onBack}>← Back to Companies</div>

      <div className="profile-hero">
        <div className="profile-avatar">{getEmoji(company.name)}</div>
        <div className="profile-info">
          <div className="profile-name">{company.name}</div>
          <div className="profile-meta">
            <span>📍 {company.location}</span>
            <span>·</span>
            <a href={`https://${company.domain}`} target="_blank" rel="noopener">{company.domain}</a>
            <span>·</span>
            <span>Founded {company.founded}</span>
            <span>·</span>
            <span className="badge badge-stage">{company.stage}</span>
            <span className="badge badge-sector">{company.sector}</span>
          </div>
          <div className="profile-tags">{company.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
        </div>
        {scoreDisplay}
        <div style={{ position:"relative" }} ref={pickerRef}>
          <button className="btn btn-secondary" onClick={()=>setPicker(v=>!v)}>+ Save to List</button>
          {picker && (
            <div className="dropdown">
              {lists.length===0 && <div style={{padding:"10px 12px",fontSize:12,color:"var(--muted)"}}>No lists yet. Create one first.</div>}
              {lists.map(l=>(
                <div key={l.id} className="dropdown-item" onClick={()=>{ onSaveToList(l.id,company); setPicker(false); toast(`Added to "${l.name}"`); }}>
                  📋 {l.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="two-col">
        <div className="stack">
          <div className="card">
            <div className="card-title">Overview</div>
            <div className="stat-grid">
              <div className="stat-item"><div className="stat-label">ARR</div><div className="stat-val" style={{color:"var(--amber)"}}>${company.arr}M</div></div>
              <div className="stat-item"><div className="stat-label">Headcount</div><div className="stat-val">{company.hc}</div></div>
              <div className="stat-item"><div className="stat-label">Founded</div><div className="stat-val">{company.founded}</div></div>
              <div className="stat-item"><div className="stat-label">Stage</div><div className="stat-val" style={{fontSize:15}}>{company.stage}</div></div>
            </div>
          </div>
          <ThesisMatchCard data={enrichData} />
          <SignalsCard company={company} enrichData={enrichData} />
          <div className="card">
            <div className="card-title">
              📝 Notes
              <div className="card-title-action"><button className="btn btn-ghost btn-xs" onClick={saveNote}>Save</button></div>
            </div>
            <textarea className="notes-area" placeholder="Investment thesis, key contacts, follow-ups, red flags…" value={note} onChange={e=>setNote(e.target.value)} rows={4} />
          </div>
        </div>
        <div className="stack">
          <EnrichPanel company={company} thesis={thesis} enrichCache={enrichCache} setEnrichCache={setEnrichCache} />
        </div>
      </div>
    </div>
  );
}

// ─── COMPANIES PAGE ───────────────────────────────────────────────────────────
function CompaniesPage({ onSelect, globalQuery, enrichCache, thesis }) {
  const [q, setQ] = useState(globalQuery||"");
  const [sector, setSector] = useState("All");
  const [stage, setStage] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);
  const [thesisOnly, setThesisOnly] = useState(false);

  useEffect(()=>{ if(globalQuery) setQ(globalQuery); },[globalQuery]);

  const thesisMatch = useCallback((c) => {
    return thesis.sectors.includes(c.sector) && thesis.stages.includes(c.stage);
  },[thesis]);

  const filtered = useMemo(()=>{
    let d = MOCK_COMPANIES.filter(c=>{
      if(q){
        const qq=q.toLowerCase();
        if(!c.name.toLowerCase().includes(qq)&&!c.sector.toLowerCase().includes(qq)&&!c.tags.some(t=>t.includes(qq))&&!c.domain.includes(qq)) return false;
      }
      if(sector!=="All"&&c.sector!==sector) return false;
      if(stage!=="All"&&c.stage!==stage) return false;
      if(thesisOnly&&!thesisMatch(c)) return false;
      return true;
    });
    d.sort((a,b)=>{
      const av=sortKey==="score" ? (enrichCache[a.id]?.data?.thesisScore||0) : (a[sortKey]??0);
      const bv=sortKey==="score" ? (enrichCache[b.id]?.data?.thesisScore||0) : (b[sortKey]??0);
      return typeof av==="string" ? sortDir*av.localeCompare(bv) : sortDir*(av-bv);
    });
    return d;
  },[q,sector,stage,sortKey,sortDir,thesisOnly,enrichCache,thesisMatch]);

  const pages = Math.ceil(filtered.length/PAGE_SZ);
  const rows = filtered.slice((page-1)*PAGE_SZ, page*PAGE_SZ);
  const sort = k=>{ if(sortKey===k) setSortDir(d=>-d); else{setSortKey(k);setSortDir(1);} setPage(1); };
  const Arr = ({k})=>sortKey===k?(sortDir===1?"↑":"↓"):<span style={{opacity:.3}}>↕</span>;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Companies</div>
          <div className="page-subtitle">{MOCK_COMPANIES.length} companies in database · {filtered.length} match current filters</div>
        </div>
      </div>

      <div className="filters-row">
        <div className="search-wrap" style={{maxWidth:260, marginRight:4}}>
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder="Search…" value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} />
        </div>
        <div className="filter-divider"/>
        <div className="filter-group">
          <span className="filter-label">Sector</span>
          {SECTORS.map(s=><div key={s} className={`chip ${sector===s?"on":""}`} onClick={()=>{setSector(s);setPage(1);}}>{s}</div>)}
        </div>
        <div className="filter-divider"/>
        <div className="filter-group">
          <span className="filter-label">Stage</span>
          {STAGES.map(s=><div key={s} className={`chip ${stage===s?"on":""}`} onClick={()=>{setStage(s);setPage(1);}}>{s}</div>)}
        </div>
        <div className="filter-divider"/>
        <div className={`chip ${thesisOnly?"on":""}`} onClick={()=>{setThesisOnly(v=>!v);setPage(1);}}>🎯 Thesis match only</div>
        <span className="result-count">{filtered.length} results</span>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th onClick={()=>sort("name")} className={sortKey==="name"?"sorted":""}>Company <Arr k="name"/></th>
              <th onClick={()=>sort("sector")} className={sortKey==="sector"?"sorted":""}>Sector <Arr k="sector"/></th>
              <th onClick={()=>sort("stage")} className={sortKey==="stage"?"sorted":""}>Stage <Arr k="stage"/></th>
              <th onClick={()=>sort("hc")} className={sortKey==="hc"?"sorted":""}>Headcount <Arr k="hc"/></th>
              <th onClick={()=>sort("arr")} className={sortKey==="arr"?"sorted":""}>ARR <Arr k="arr"/></th>
              <th onClick={()=>sort("score")} className={sortKey==="score"?"sorted":""}>Thesis Score <Arr k="score"/></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c=>(
              <tr key={c.id} onClick={()=>onSelect(c)}>
                <td>
                  <div className="td-company">
                    <div className="co-avatar">{getEmoji(c.name)}</div>
                    <div>
                      <div className="co-name">{c.name}</div>
                      <div className="co-domain">{c.domain}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-sector">{c.sector}</span></td>
                <td><span className="badge badge-stage">{c.stage}</span></td>
                <td style={{color:"var(--ink3)",fontFamily:"var(--font-mono)",fontSize:12}}>{c.hc}</td>
                <td style={{color:"var(--amber)",fontFamily:"var(--font-mono)",fontWeight:500,fontSize:12}}>${c.arr}M</td>
                <td><ScoreCell enrichData={enrichCache[c.id]?.data} /></td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={6}><div className="empty"><div className="empty-icon">🔍</div><div className="empty-title">No companies found</div><div className="empty-desc">Try adjusting your filters or search query.</div></div></td></tr>}
          </tbody>
        </table>
      </div>

      {pages>1 && (
        <div className="pagination">
          <span className="pag-info">{filtered.length} companies · Page {page} of {pages}</span>
          <div className="pag-buttons">
            <button className="pag-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
            {Array.from({length:pages},(_,i)=>(
              <button key={i} className={`pag-btn ${page===i+1?"on":""}`} onClick={()=>setPage(i+1)}>{i+1}</button>
            ))}
            <button className="pag-btn" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCOUT PAGE ───────────────────────────────────────────────────────────────
function ScoutPage({ thesis, onSelectCompany, toast }) {
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState([]);

  const run = async () => {
    setStatus("loading");
    const existing = MOCK_COMPANIES.map(c=>c.name);
    const suggestions = await scoutCompanies(thesis, existing);
    if (suggestions && Array.isArray(suggestions)) {
      setResults(suggestions.map((s,i)=>({ ...s, id:`scout_${i}`, score:null })));
      setStatus("done");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="page fade-in">
      <div className="scout-header">
        <div className="scout-icon">🛰️</div>
        <div>
          <div className="scout-title">AI Scout — {thesis.fundName}</div>
          <div className="scout-desc">
            Finds real companies that match your thesis: <em>{thesis.focus}</em><br/>
            Sectors: {thesis.sectors.join(" · ")} · Stages: {thesis.stages.join(", ")}
          </div>
        </div>
        <div className="scout-btn">
          <button className="btn btn-primary" onClick={run} disabled={status==="loading"}>
            {status==="loading" ? "Scouting…" : status==="done" ? "Scout again" : "⚡ Run Scout"}
          </button>
        </div>
      </div>

      {status==="idle" && (
        <div className="empty">
          <div className="empty-icon">🛰️</div>
          <div className="empty-title">Ready to scout</div>
          <div className="empty-desc">Click "Run Scout" to find companies that match {thesis.fundName}'s thesis using AI.<br/>Results are explained — you'll see exactly why each company was surfaced.</div>
        </div>
      )}
      {status==="loading" && (
        <div className="empty">
          <div style={{marginBottom:14,display:"flex",justifyContent:"center"}}><div className="spinner" style={{width:24,height:24}}/></div>
          <div className="empty-title">Scanning the market…</div>
          <div className="empty-desc">Searching for companies that match your thesis.<br/>This takes a few seconds.</div>
        </div>
      )}
      {status==="error" && (
        <div className="empty" style={{color:"var(--red)"}}>
          <div className="empty-icon">⚠</div>
          <div className="empty-title">Scout failed</div>
          <div className="empty-desc">Check your API key and try again.</div>
        </div>
      )}
      {status==="done" && results.map((c,i)=>(
        <div key={i} className="scout-result-card fade-in" style={{animationDelay:`${i*0.06}s`}}>
          <div className="scout-card-header">
            <div className="co-avatar" style={{width:36,height:36,fontSize:18}}>{getEmoji(c.name)}</div>
            <div className="scout-card-info">
              <div className="scout-card-name">{c.name} <span className="new-badge">NEW</span></div>
              <div className="scout-card-meta">
                <span className="badge badge-sector">{c.sector}</span>
                <span className="badge badge-stage">{c.stage}</span>
                <span style={{color:"var(--muted)",fontSize:11}}>📍 {c.location} · {c.domain} · Est. ${c.arr}M ARR</span>
              </div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button className="btn btn-primary btn-xs" onClick={()=>{ toast(`Added ${c.name} to database`); }}>+ Add to DB</button>
            </div>
          </div>
          <div className="scout-match-box">
            <div className="scout-match-label">🎯 Why this matches {thesis.fundName}</div>
            <div className="scout-match-text">{c.whyMatch}</div>
          </div>
          <div className="scout-signal">📡 <strong>Signal:</strong>&nbsp;{c.signal}</div>
          <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
            {c.tags?.map((t,j)=><span key={j} className="tag">{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LISTS PAGE ───────────────────────────────────────────────────────────────
function ListsPage({ lists, addList, removeFromList, deleteList, toast, onOpenCompany }) {
  const [sel, setSel] = useState(null);
  const [newName, setNewName] = useState("");
  const active = lists.find(l=>l.id===sel);

  const create = () => {
    if(!newName.trim()) return;
    addList(newName.trim()); toast(`List "${newName.trim()}" created`); setNewName("");
  };

  const exportCSV = (list) => {
    const csv = ["name,domain,sector,stage,arr,hc",...list.companies.map(c=>`${c.name},${c.domain},${c.sector},${c.stage},${c.arr},${c.hc}`)].join("\n");
    const a=document.createElement("a"); a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); a.download=`${list.name}.csv`; a.click();
    toast("CSV exported");
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><div className="page-title">Lists</div><div className="page-subtitle">Organize and track companies across your workflow</div></div>
      </div>
      <div className="lists-layout">
        <div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            <input className="input" style={{flex:1}} placeholder="New list name…" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&create()} />
            <button className="btn btn-primary btn-sm" onClick={create}>+ Create</button>
          </div>
          {lists.length===0 && <div className="empty" style={{padding:32}}><div className="empty-icon">📋</div><div className="empty-desc">No lists yet.</div></div>}
          {lists.map(l=>(
            <div key={l.id} className={`list-entry ${sel===l.id?"on":""}`} onClick={()=>setSel(l.id)}>
              <div className="list-entry-name">📋 {l.name}</div>
              <div className="list-entry-count">{l.companies?.length||0} companies</div>
            </div>
          ))}
        </div>
        <div>
          {!active && <div className="empty"><div className="empty-icon">📋</div><div className="empty-title">Select a list</div><div className="empty-desc">Choose a list to view its companies.</div></div>}
          {active && (
            <div className="fade-in">
              <div style={{display:"flex",alignItems:"center",marginBottom:16,gap:8}}>
                <div style={{fontFamily:"var(--font-serif)",fontSize:20,fontWeight:600}}>{active.name}</div>
                <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>exportCSV(active)}>Export CSV</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>{deleteList(active.id);setSel(null);toast("List deleted");}}>Delete</button>
                </div>
              </div>
              {active.companies?.length===0 ? (
                <div className="empty"><div className="empty-icon">🏢</div><div className="empty-desc">No companies yet. Save companies from their profile page.</div></div>
              ) : (
                <div className="table-card">
                  <table>
                    <thead><tr><th>Company</th><th>Sector</th><th>Stage</th><th>ARR</th><th></th></tr></thead>
                    <tbody>
                      {active.companies.map(c=>(
                        <tr key={c.id}>
                          <td><div className="td-company"><div className="co-avatar">{getEmoji(c.name)}</div><div><div className="co-name">{c.name}</div><div className="co-domain">{c.domain}</div></div></div></td>
                          <td><span className="badge badge-sector">{c.sector}</span></td>
                          <td><span className="badge badge-stage">{c.stage}</span></td>
                          <td style={{color:"var(--amber)",fontFamily:"var(--font-mono)",fontSize:12}}>${c.arr}M</td>
                          <td><button className="btn btn-ghost btn-xs" onClick={()=>{removeFromList(active.id,c.id);toast("Removed");}}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SAVED PAGE ───────────────────────────────────────────────────────────────
function SavedPage({ saved, deleteSaved, runSaved, toast }) {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><div className="page-title">Saved Searches</div><div className="page-subtitle">{saved.length} saved search{saved.length!==1?"es":""}</div></div>
      </div>
      {saved.length===0 && <div className="empty"><div className="empty-icon">🔍</div><div className="empty-title">No saved searches</div><div className="empty-desc">Search companies and click "Save Search" to save them here for re-running.</div></div>}
      {saved.map(s=>(
        <div key={s.id} className="saved-entry" onClick={()=>runSaved(s)}>
          <span style={{fontSize:18}}>🔍</span>
          <div style={{flex:1}}>
            <div className="saved-q">"{s.query||"(all companies)"}"</div>
            <div className="saved-q-chips">
              {s.sector!=="All"&&<span className="saved-chip">{s.sector}</span>}
              {s.stage!=="All"&&<span className="saved-chip">{s.stage}</span>}
              {s.thesisOnly&&<span className="saved-chip">🎯 thesis match</span>}
            </div>
          </div>
          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)"}}>{new Date(s.ts).toLocaleDateString()}</span>
          <button className="btn btn-ghost btn-xs" onClick={e=>{e.stopPropagation();deleteSaved(s.id);toast("Deleted");}}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// ─── THESIS SETTINGS ──────────────────────────────────────────────────────────
function ThesisPage({ thesis, setThesis, toast }) {
  const [form, setForm] = useState(thesis);
  const ALL_SECTORS = ["AI Agents","Generative AI","Foundation ML","ML Infra","Dev Infra","Search / AI","Productivity","Fintech","Healthtech","Climate","B2B SaaS","Consumer"];
  const ALL_STAGES  = ["Pre-Seed","Seed","Series A","Series B","Series C","Series D"];

  const save = () => { setThesis(form); try{localStorage.setItem("vc_thesis",JSON.stringify(form));}catch{} toast("Thesis saved"); };
  const toggleArr = (key, val) => setForm(f=>({ ...f, [key]: f[key].includes(val) ? f[key].filter(x=>x!==val) : [...f[key],val] }));

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><div className="page-title">Investment Thesis</div><div className="page-subtitle">Configure your fund's investment criteria — this powers all scoring and discovery</div></div>
        <button className="btn btn-primary" onClick={save}>Save Thesis</button>
      </div>
      <div className="card">
        <div className="card-title">🎯 Fund Identity</div>
        <div className="thesis-form">
          <div className="form-group">
            <label className="form-label">Fund Name</label>
            <input className="form-input" value={form.fundName} onChange={e=>setForm(f=>({...f,fundName:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Geographic Focus</label>
            <input className="form-input" value={form.geoFocus} onChange={e=>setForm(f=>({...f,geoFocus:e.target.value}))} />
          </div>
          <div className="form-group form-span">
            <label className="form-label">Thesis Statement</label>
            <textarea className="form-textarea" value={form.focus} onChange={e=>setForm(f=>({...f,focus:e.target.value}))} rows={2} />
          </div>
        </div>
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-title">📊 Target Sectors</div>
        <div className="toggle-grid">
          {ALL_SECTORS.map(s=><div key={s} className={`toggle-chip ${form.sectors.includes(s)?"on":""}`} onClick={()=>toggleArr("sectors",s)}>{s}</div>)}
        </div>
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-title">📈 Target Stages</div>
        <div className="toggle-grid">
          {ALL_STAGES.map(s=><div key={s} className={`toggle-chip ${form.stages.includes(s)?"on":""}`} onClick={()=>toggleArr("stages",s)}>{s}</div>)}
        </div>
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-title">🔑 Signal Keywords</div>
        <p style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Companies matching these keywords score higher. Comma-separated.</p>
        <input className="form-input" style={{width:"100%"}} value={form.keywords.join(", ")} onChange={e=>setForm(f=>({...f,keywords:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)}))} />
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-title">🚫 Anti-patterns</div>
        <p style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Companies matching these patterns score lower. Comma-separated.</p>
        <input className="form-input" style={{width:"100%"}} value={form.antiPatterns.join(", ")} onChange={e=>setForm(f=>({...f,antiPatterns:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)}))} />
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-title">📐 Sizing Constraints</div>
        <div style={{display:"flex",gap:16}}>
          <div className="form-group">
            <label className="form-label">Min ARR ($M)</label>
            <input className="form-input" type="number" value={form.minARR} onChange={e=>setForm(f=>({...f,minARR:Number(e.target.value)}))} style={{width:100}} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Headcount</label>
            <input className="form-input" type="number" value={form.maxHC} onChange={e=>setForm(f=>({...f,maxHC:Number(e.target.value)}))} style={{width:100}} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]   = useState("companies");
  const [company, setCompany] = useState(null);
  const [globalQ, setGlobalQ] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const toast = msg => setToastMsg(msg);

  const [thesis, setThesis] = useState(()=>{ try{ const s=localStorage.getItem("vc_thesis"); return s?JSON.parse(s):DEFAULT_THESIS; }catch{return DEFAULT_THESIS;} });
  const [lists, setLists] = useState(()=>{ try{return JSON.parse(localStorage.getItem("vc_lists")||"[]");}catch{return [];} });
  const [saved, setSaved]  = useState(()=>{ try{return JSON.parse(localStorage.getItem("vc_saved")||"[]");}catch{return [];} });
  const [enrichCache, setEnrichCache] = useState(()=>{
    const cache = {};
    MOCK_COMPANIES.forEach(c=>{ try{ const s=localStorage.getItem(`enrich_${c.id}`); if(s) cache[c.id]=JSON.parse(s); }catch{} });
    return cache;
  });

  const persist = (k,v) => { try{localStorage.setItem(k,JSON.stringify(v));}catch{} };

  const addList       = n => { const u=[...lists,{id:Date.now().toString(),name:n,companies:[]}]; setLists(u); persist("vc_lists",u); };
  const saveToList    = (lid,co) => { const u=lists.map(l=>l.id===lid?{...l,companies:l.companies.find(c=>c.id===co.id)?l.companies:[...l.companies,co]}:l); setLists(u); persist("vc_lists",u); };
  const removeFromList= (lid,cid) => { const u=lists.map(l=>l.id===lid?{...l,companies:l.companies.filter(c=>c.id!==cid)}:l); setLists(u); persist("vc_lists",u); };
  const deleteList    = lid => { const u=lists.filter(l=>l.id!==lid); setLists(u); persist("vc_lists",u); };
  const deleteSaved   = id  => { const u=saved.filter(s=>s.id!==id); setSaved(u); persist("vc_saved",u); };
  const saveSearch    = () => { const e={id:Date.now().toString(),query:globalQ,sector:"All",stage:"All",thesisOnly:false,ts:new Date().toISOString()}; const u=[e,...saved].slice(0,25); setSaved(u); persist("vc_saved",u); toast("Search saved"); };
  const runSaved      = s  => { setGlobalQ(s.query); setView("companies"); setCompany(null); };

  const NAV = [
    { id:"companies", icon:"⬡", label:"Companies", count:MOCK_COMPANIES.length },
    { id:"scout",     icon:"🛰️", label:"AI Scout",   count:null },
    { id:"lists",     icon:"≡",  label:"Lists",       count:lists.length },
    { id:"saved",     icon:"◇",  label:"Saved",       count:saved.length },
    { id:"thesis",    icon:"🎯", label:"Thesis",      count:null },
  ];

  const enrichedCount = MOCK_COMPANIES.filter(c=>enrichCache[c.id]).length;

  const breadcrumb = company
    ? <><span>Companies</span><span className="breadcrumb-sep">/</span><span className="breadcrumb-active">{company.name}</span></>
    : <span className="breadcrumb-active">{{ companies:"Companies", scout:"AI Scout", lists:"Lists", saved:"Saved Searches", thesis:"Investment Thesis" }[view]}</span>;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-mark">V</div>
            <div className="sb-logo-name">Vantage</div>
            <div className="sb-logo-badge">BETA</div>
          </div>

          <div className="sb-section">
            <div className="sb-section-label">Navigation</div>
            {NAV.map(n=>(
              <div key={n.id} className={`nav-item ${view===n.id&&!company?"active":""}`}
                onClick={()=>{ setView(n.id); setCompany(null); }}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.count!=null && <span className="nav-badge">{n.count}</span>}
              </div>
            ))}
          </div>

          <div className="sb-thesis-card">
            <div className="sb-thesis-label">Active Thesis</div>
            <div className="sb-thesis-name">{thesis.fundName}</div>
            <div className="sb-thesis-desc">{thesis.focus}</div>
          </div>

          <div className="sb-bottom">
            <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:8,fontFamily:"var(--font-mono)"}}>Session stats</div>
            <div className="sb-stat">Database <span>{MOCK_COMPANIES.length}</span></div>
            <div className="sb-stat">Enriched <span>{enrichedCount}</span></div>
            <div className="sb-stat">Lists <span>{lists.length}</span></div>
            <div className="sb-stat">Saved <span>{saved.length}</span></div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-breadcrumb">{breadcrumb}</div>
            {view==="companies"&&!company&&(
              <>
                <div className="search-wrap" style={{marginLeft:16}}>
                  <span className="search-icon">⌕</span>
                  <input className="search-input" placeholder="Search companies, sectors, tags…" value={globalQ} onChange={e=>setGlobalQ(e.target.value)} />
                </div>
                <div className="topbar-right">
                  <button className="btn btn-secondary btn-sm" onClick={saveSearch}>Save Search</button>
                </div>
              </>
            )}
          </div>

          {view==="companies" && !company && <CompaniesPage onSelect={setCompany} globalQuery={globalQ} enrichCache={enrichCache} thesis={thesis} />}
          {view==="companies" && company && (
            <ProfilePage company={company} onBack={()=>setCompany(null)} lists={lists} onSaveToList={saveToList}
              enrichCache={enrichCache} setEnrichCache={setEnrichCache} thesis={thesis} toast={toast} />
          )}
          {view==="scout"   && <ScoutPage thesis={thesis} onSelectCompany={setCompany} toast={toast} />}
          {view==="lists"   && <ListsPage lists={lists} addList={addList} removeFromList={removeFromList} deleteList={deleteList} toast={toast} />}
          {view==="saved"   && <SavedPage saved={saved} deleteSaved={deleteSaved} runSaved={runSaved} toast={toast} />}
          {view==="thesis"  && <ThesisPage thesis={thesis} setThesis={setThesis} toast={toast} />}
        </div>
      </div>
      {toastMsg && <Toast msg={toastMsg} onClose={()=>setToastMsg(null)} />}
    </>
  );
}
