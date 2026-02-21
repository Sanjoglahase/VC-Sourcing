<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VentureScope — Indian Startup Intelligence</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0b0c0f;
    --surface: #111318;
    --border: #1e2028;
    --border-hover: #2e3040;
    --accent: #f97316;
    --accent2: #fb923c;
    --text: #e8eaf0;
    --text-muted: #6b7280;
    --text-sub: #9ca3af;
    --green: #22c55e;
    --blue: #3b82f6;
    --purple: #a855f7;
    --red: #ef4444;
    --sidebar-w: 220px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  #sidebar {
    width: var(--sidebar-w); min-width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 0; z-index: 10;
  }
  .logo { padding: 20px 20px 16px; border-bottom: 1px solid var(--border); }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--accent); letter-spacing: -0.5px; }
  .logo-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
  nav { padding: 12px 8px; flex: 1; }
  .nav-section { font-size: 10px; color: var(--text-muted); letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 12px 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer;
    color: var(--text-sub); font-size: 13.5px; font-weight: 400; margin-bottom: 2px; transition: all .15s;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: rgba(249,115,22,.08); color: var(--text); border-color: rgba(249,115,22,.15); }
  .nav-item.active { background: rgba(249,115,22,.12); color: var(--accent); border-color: rgba(249,115,22,.25); font-weight: 500; }
  .nav-icon { font-size: 15px; width: 18px; text-align: center; }
  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
  .thesis-badge { background: rgba(168,85,247,.15); border: 1px solid rgba(168,85,247,.3); border-radius: 6px; padding: 8px 10px; font-size: 11px; color: #c084fc; }
  .thesis-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }

  /* MAIN */
  #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* TOPBAR */
  #topbar {
    background: var(--surface); border-bottom: 1px solid var(--border); padding: 12px 24px;
    display: flex; align-items: center; gap: 16px;
  }
  #global-search {
    flex: 1; max-width: 420px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
    padding: 8px 14px; color: var(--text); font-size: 13.5px; font-family: 'DM Sans', sans-serif; outline: none; transition: border .15s;
  }
  #global-search:focus { border-color: var(--accent); }
  #global-search::placeholder { color: var(--text-muted); }
  .topbar-actions { margin-left: auto; display: flex; gap: 8px; align-items: center; }
  .badge-count { background: var(--accent); color: white; border-radius: 99px; font-size: 10px; font-weight: 700; padding: 2px 7px; }
  .page-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }

  /* CONTENT */
  #content { flex: 1; overflow-y: auto; padding: 24px; }
  #content::-webkit-scrollbar { width: 4px; }
  #content::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 4px; }

  /* PAGE SECTIONS */
  .page { display: none; }
  .page.active { display: block; }

  /* FILTERS */
  .filters-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
  select, .filter-btn {
    background: var(--surface); border: 1px solid var(--border); color: var(--text-sub); border-radius: 7px;
    padding: 7px 12px; font-size: 12.5px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border .15s;
  }
  select:focus, .filter-btn:hover { border-color: var(--border-hover); outline: none; color: var(--text); }
  .filter-btn.active-filter { border-color: var(--accent); color: var(--accent); background: rgba(249,115,22,.08); }
  .search-input {
    background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 7px;
    padding: 7px 14px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border .15s; min-width: 220px;
  }
  .search-input:focus { border-color: var(--accent); }
  .result-count { color: var(--text-muted); font-size: 12px; margin-left: auto; }

  /* TABLE */
  .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    background: rgba(255,255,255,.03); padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border);
    cursor: pointer; user-select: none; white-space: nowrap;
  }
  thead th:hover { color: var(--text); }
  thead th .sort-arrow { margin-left: 4px; opacity: .4; }
  thead th.sorted .sort-arrow { opacity: 1; color: var(--accent); }
  tbody tr { border-bottom: 1px solid var(--border); transition: background .1s; cursor: pointer; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(255,255,255,.03); }
  td { padding: 12px 16px; vertical-align: middle; }
  .company-name { font-weight: 500; color: var(--text); font-size: 13.5px; }
  .company-domain { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; margin: 1px; }
  .tag-sector { background: rgba(59,130,246,.15); color: #60a5fa; border: 1px solid rgba(59,130,246,.2); }
  .tag-stage { background: rgba(34,197,94,.1); color: #4ade80; border: 1px solid rgba(34,197,94,.2); }
  .tag-city { background: rgba(168,85,247,.1); color: #c084fc; border: 1px solid rgba(168,85,247,.2); }
  .score-bar { display: flex; align-items: center; gap: 8px; }
  .score-num { font-weight: 600; font-size: 13px; min-width: 26px; }
  .bar-bg { flex: 1; height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; min-width: 60px; }
  .bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent), #fbbf24); }

  /* PAGINATION */
  .pagination { display: flex; gap: 6px; align-items: center; justify-content: flex-end; margin-top: 16px; }
  .pg-btn {
    background: var(--surface); border: 1px solid var(--border); color: var(--text-sub); border-radius: 6px;
    padding: 5px 11px; cursor: pointer; font-size: 12px; transition: all .15s; font-family: 'DM Sans', sans-serif;
  }
  .pg-btn:hover { border-color: var(--accent); color: var(--accent); }
  .pg-btn.current { background: var(--accent); color: white; border-color: var(--accent); }
  .pg-btn:disabled { opacity: .3; cursor: default; }

  /* PROFILE PAGE */
  .profile-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 24px; }
  .profile-logo-box {
    width: 64px; height: 64px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;
  }
  .profile-meta h1 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; margin-bottom: 6px; }
  .profile-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
  .profile-desc { color: var(--text-sub); font-size: 13px; line-height: 1.6; max-width: 600px; }
  .profile-actions { margin-left: auto; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
  .btn {
    padding: 8px 16px; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; border: none; transition: all .15s;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-outline { background: transparent; color: var(--text-sub); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--border-hover); color: var(--text); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn-success { background: rgba(34,197,94,.15); color: var(--green); border: 1px solid rgba(34,197,94,.3); }

  .profile-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
  .card-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 14px; }
  .stat-row { display: flex; gap: 20px; margin-bottom: 20px; }
  .stat-box { flex: 1; }
  .stat-label { font-size: 11px; color: var(--text-muted); margin-bottom: 3px; text-transform: uppercase; letter-spacing: .8px; }
  .stat-val { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; }
  .kv { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .kv:last-child { border-bottom: none; }
  .kv-key { color: var(--text-muted); font-size: 12.5px; }
  .kv-val { color: var(--text); font-size: 12.5px; font-weight: 500; }

  /* SIGNALS */
  .signal-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
  .signal-item:last-child { border-bottom: none; }
  .signal-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .signal-content { flex: 1; }
  .signal-text { font-size: 13px; color: var(--text); line-height: 1.5; }
  .signal-date { font-size: 11px; color: var(--text-muted); margin-top: 3px; }

  /* NOTES */
  #notes-area {
    width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 7px; color: var(--text);
    padding: 10px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; resize: vertical; min-height: 80px; outline: none;
  }
  #notes-area:focus { border-color: var(--accent); }

  /* ENRICHMENT */
  .enrich-box { margin-top: 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
  .enrich-loading { display: flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 13px; }
  .spinner { width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .enrich-section { margin-bottom: 14px; }
  .enrich-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); margin-bottom: 6px; font-weight: 600; }
  .enrich-summary { font-size: 13px; color: var(--text); line-height: 1.6; }
  .bullet-list { list-style: none; }
  .bullet-list li { font-size: 13px; color: var(--text-sub); padding: 3px 0; display: flex; gap: 7px; }
  .bullet-list li::before { content: '→'; color: var(--accent); flex-shrink: 0; }
  .keyword-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .kw-chip { background: rgba(249,115,22,.1); border: 1px solid rgba(249,115,22,.2); color: var(--accent); border-radius: 4px; padding: 2px 8px; font-size: 11.5px; }
  .source-link { display: block; font-size: 11.5px; color: #60a5fa; text-decoration: none; padding: 2px 0; }
  .source-link:hover { text-decoration: underline; }
  .signal-tag { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 4px; font-size: 11.5px; margin: 2px; }
  .signal-tag.positive { background: rgba(34,197,94,.1); color: var(--green); border: 1px solid rgba(34,197,94,.2); }
  .signal-tag.neutral { background: rgba(59,130,246,.1); color: #60a5fa; border: 1px solid rgba(59,130,246,.2); }

  /* LISTS PAGE */
  .lists-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .list-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px; margin-bottom: 12px; }
  .list-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .list-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 15px; }
  .list-meta { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
  .list-companies { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .list-co-tag { background: var(--bg); border: 1px solid var(--border); border-radius: 5px; padding: 3px 9px; font-size: 12px; color: var(--text-sub); }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }
  .empty-title { font-size: 15px; font-weight: 600; color: var(--text-sub); margin-bottom: 6px; }

  /* SAVED SEARCHES */
  .saved-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 14px; }
  .saved-query { font-weight: 500; font-size: 13.5px; }
  .saved-filters { font-size: 11.5px; color: var(--text-muted); margin-top: 3px; }
  .saved-date { font-size: 11px; color: var(--text-muted); margin-left: auto; white-space: nowrap; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: none; align-items: center; justify-content: center; z-index: 100; }
  .modal-overlay.open { display: flex; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; min-width: 360px; max-width: 480px; width: 100%; }
  .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 16px; }
  .modal-input { width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--text); border-radius: 7px; padding: 9px 13px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 12px; }
  .modal-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

  /* TOAST */
  #toast {
    position: fixed; bottom: 24px; right: 24px; background: #1a1d24; border: 1px solid var(--border);
    border-left: 3px solid var(--accent); border-radius: 8px; padding: 12px 18px; font-size: 13px;
    color: var(--text); z-index: 200; transform: translateY(80px); opacity: 0; transition: all .25s;
  }
  #toast.show { transform: translateY(0); opacity: 1; }

  /* BACK BTN */
  .back-btn { display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 13px; cursor: pointer; margin-bottom: 20px; transition: color .15s; }
  .back-btn:hover { color: var(--accent); }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
</style>
</head>
<body>

<!-- SIDEBAR -->
<div id="sidebar">
  <div class="logo">
    <div class="logo-text">VentureScope</div>
    <div class="logo-sub">India Intelligence</div>
  </div>
  <nav>
    <div class="nav-section">Discover</div>
    <div class="nav-item active" onclick="navigate('companies')">
      <span class="nav-icon">🔍</span> Companies
    </div>
    <div class="nav-item" onclick="navigate('profile')">
      <span class="nav-icon">🏢</span> Profiles
    </div>
    <div class="nav-section">Manage</div>
    <div class="nav-item" onclick="navigate('lists')">
      <span class="nav-icon">📋</span> Lists
    </div>
    <div class="nav-item" onclick="navigate('saved')">
      <span class="nav-icon">🔖</span> Saved Searches
    </div>
    <div class="nav-section">Insights</div>
    <div class="nav-item" onclick="navigate('signals')">
      <span class="nav-icon">📡</span> Signals Feed
    </div>
  </nav>
  <div class="sidebar-footer">
    <div class="thesis-badge">
      <div class="thesis-label">Active Thesis</div>
      B2B SaaS · Fintech · Deep Tech — Series A/B
    </div>
  </div>
</div>

<!-- MAIN -->
<div id="main">
  <!-- TOPBAR -->
  <div id="topbar">
    <span class="page-title" id="page-label">Companies</span>
    <input type="text" id="global-search" placeholder="⌘ Search companies, founders, sectors…" oninput="globalSearch(this.value)">
    <div class="topbar-actions">
      <button class="btn btn-outline btn-sm" onclick="openModal('list')">+ New List</button>
      <span class="badge-count" id="saved-count">0</span>
      <button class="btn btn-primary btn-sm" onclick="navigate('saved')">Saved</button>
    </div>
  </div>

  <!-- CONTENT -->
  <div id="content">

    <!-- COMPANIES PAGE -->
    <div class="page active" id="page-companies">
      <div class="filters-row">
        <input type="text" class="search-input" id="co-search" placeholder="Filter companies…" oninput="filterCompanies()">
        <select id="filter-sector" onchange="filterCompanies()">
          <option value="">All Sectors</option>
          <option>Fintech</option>
          <option>Edtech</option>
          <option>Healthtech</option>
          <option>B2B SaaS</option>
          <option>D2C / Commerce</option>
          <option>Deeptech / AI</option>
          <option>Logistics</option>
          <option>Agritech</option>
          <option>Climate / Clean Energy</option>
        </select>
        <select id="filter-stage" onchange="filterCompanies()">
          <option value="">All Stages</option>
          <option>Pre-Seed</option>
          <option>Seed</option>
          <option>Series A</option>
          <option>Series B</option>
          <option>Series C+</option>
        </select>
        <select id="filter-city" onchange="filterCompanies()">
          <option value="">All Cities</option>
          <option>Bengaluru</option>
          <option>Mumbai</option>
          <option>Delhi / NCR</option>
          <option>Hyderabad</option>
          <option>Pune</option>
          <option>Chennai</option>
        </select>
        <button class="filter-btn" id="btn-thesis" onclick="toggleThesisFilter()">Thesis Match</button>
        <span class="result-count" id="result-count">25 companies</span>
        <button class="btn btn-outline btn-sm" onclick="exportCSV()">↓ Export CSV</button>
        <button class="btn btn-outline btn-sm" onclick="saveCurrentSearch()">🔖 Save Search</button>
      </div>
      <div class="table-wrap">
        <table id="companies-table">
          <thead>
            <tr>
              <th onclick="sortTable('name')">Company <span class="sort-arrow">↕</span></th>
              <th onclick="sortTable('sector')">Sector <span class="sort-arrow">↕</span></th>
              <th onclick="sortTable('stage')">Stage <span class="sort-arrow">↕</span></th>
              <th onclick="sortTable('city')">City <span class="sort-arrow">↕</span></th>
              <th onclick="sortTable('founded')">Founded <span class="sort-arrow">↕</span></th>
              <th onclick="sortTable('funding')">Funding <span class="sort-arrow">↕</span></th>
              <th onclick="sortTable('score')">Score <span class="sort-arrow">↕</span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="companies-body"></tbody>
        </table>
      </div>
      <div class="pagination" id="pagination"></div>
    </div>

    <!-- PROFILE PAGE -->
    <div class="page" id="page-profile">
      <div class="back-btn" onclick="navigate('companies')">← Back to Companies</div>
      <div class="profile-header" id="profile-header"></div>
      <div class="profile-grid" id="profile-grid"></div>
    </div>

    <!-- LISTS PAGE -->
    <div class="page" id="page-lists">
      <div class="lists-header">
        <div>
          <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:18px;">My Lists</div>
          <div style="color:var(--text-muted);font-size:12px;margin-top:4px;">Curate and share company shortlists</div>
        </div>
        <button class="btn btn-primary" onclick="openModal('list')">+ Create List</button>
      </div>
      <div id="lists-container"></div>
    </div>

    <!-- SAVED SEARCHES PAGE -->
    <div class="page" id="page-saved">
      <div class="lists-header">
        <div>
          <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:18px;">Saved Searches</div>
          <div style="color:var(--text-muted);font-size:12px;margin-top:4px;">Re-run your thesis-driven filters</div>
        </div>
      </div>
      <div id="saved-container"></div>
    </div>

    <!-- SIGNALS FEED PAGE -->
    <div class="page" id="page-signals">
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:18px;margin-bottom:20px;">Signals Feed</div>
      <div id="signals-feed"></div>
    </div>

  </div>
</div>

<!-- MODAL -->
<div class="modal-overlay" id="modal-overlay" onclick="closeModal(event)">
  <div class="modal" id="modal-box">
    <div class="modal-title" id="modal-title">Create List</div>
    <input type="text" class="modal-input" id="modal-input1" placeholder="List name">
    <input type="text" class="modal-input" id="modal-input2" placeholder="Description (optional)">
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" id="modal-confirm" onclick="confirmModal()">Create</button>
    </div>
  </div>
</div>

<div id="toast"></div>

<script>
// ===== DATA =====
const COMPANIES = [
  {id:1, name:"Zepto", emoji:"⚡", domain:"zepto.com", sector:"D2C / Commerce", stage:"Series C+", city:"Mumbai", founded:2021, funding:"₹3,200 Cr", fundingNum:3200, score:92, description:"Quick-commerce startup delivering groceries in under 10 minutes via a dark-store model across 10 Indian cities.", founders:"Aadit Palicha, Kaivalya Vohra", employees:"5,000+", investors:"Y Combinator, Nexus Venture Partners, Kaiser Permanente", website:"https://zepto.com", signals:[{text:"Expanded to 6 new cities in Q1 2025", color:"#22c55e", date:"Mar 2025"},{text:"Launched ZeptoNow for electronics category", color:"#3b82f6", date:"Jan 2025"},{text:"Raised $350M Series D round", color:"#f97316", date:"Nov 2024"},{text:"Crossed 5 lakh daily orders milestone", color:"#a855f7", date:"Sep 2024"}], thesis:true},
  {id:2, name:"Krutrim", emoji:"🤖", domain:"krutrim.com", sector:"Deeptech / AI", stage:"Series A", city:"Bengaluru", founded:2023, funding:"₹440 Cr", fundingNum:440, score:88, description:"India's first AI unicorn building large language models trained on Indic languages and scripts.", founders:"Bhavish Aggarwal", employees:"300+", investors:"Ola, Matrix Partners India", website:"https://krutrim.com", signals:[{text:"Launched Krutrim Cloud with GPU access for startups", color:"#22c55e", date:"Feb 2025"},{text:"Released Krutrim-2 model with 70B parameters", color:"#3b82f6", date:"Dec 2024"},{text:"Partnership with government for Bhashini integration", color:"#f97316", date:"Oct 2024"}], thesis:true},
  {id:3, name:"Sarvam AI", emoji:"🗣️", domain:"sarvam.ai", sector:"Deeptech / AI", stage:"Series A", city:"Bengaluru", founded:2023, funding:"₹230 Cr", fundingNum:230, score:90, description:"Building full-stack generative AI for India with speech, language and developer APIs for 22 official Indian languages.", founders:"Vivek Raghavan, Pratyush Kumar", employees:"150+", investors:"Lightspeed Venture Partners, Peak XV Partners", website:"https://sarvam.ai", signals:[{text:"Deployed voice AI for State Bank of India", color:"#22c55e", date:"Mar 2025"},{text:"Open-sourced OpenHathi multilingual LLM", color:"#3b82f6", date:"Jan 2025"},{text:"Won government AI mission grant of ₹50 Cr", color:"#f97316", date:"Nov 2024"}], thesis:true},
  {id:4, name:"Ather Energy", emoji:"🛵", domain:"atherenergy.com", sector:"Climate / Clean Energy", stage:"Series C+", city:"Bengaluru", founded:2013, funding:"₹4,300 Cr", fundingNum:4300, score:82, description:"Electric scooter manufacturer with its own charging network, Ather Grid, across 100+ Indian cities.", founders:"Tarun Mehta, Swapnil Jain", employees:"3,200+", investors:"Hero MotoCorp, GIC Singapore, NIIF", website:"https://atherenergy.com", signals:[{text:"Launched Ather Rizta family scooter at ₹1.10 lakh", color:"#22c55e", date:"Apr 2025"},{text:"Filed IPO DRHP with SEBI", color:"#3b82f6", date:"Jan 2025"},{text:"Crossed 2 lakh cumulative sales mark", color:"#a855f7", date:"Oct 2024"}], thesis:false},
  {id:5, name:"Perfios", emoji:"📊", domain:"perfios.com", sector:"Fintech", stage:"Series C+", city:"Bengaluru", founded:2008, funding:"₹2,100 Cr", fundingNum:2100, score:85, description:"B2B fintech platform for real-time financial document analysis, bank statement analysis and credit underwriting for lenders.", founders:"V R Govindarajan, Debasish Chakraborty", employees:"2,500+", investors:"Warburg Pincus, Teachers' Venture Growth, Bessemer", website:"https://perfios.com", signals:[{text:"Acquired Karza Technologies for ₹450 Cr", color:"#22c55e", date:"Feb 2025"},{text:"Crossed 1,000 enterprise clients globally", color:"#3b82f6", date:"Dec 2024"},{text:"Launched Perfios for Southeast Asia expansion", color:"#f97316", date:"Sep 2024"}], thesis:true},
  {id:6, name:"Scaler", emoji:"🎓", domain:"scaler.com", sector:"Edtech", stage:"Series B", city:"Bengaluru", founded:2019, funding:"₹680 Cr", fundingNum:680, score:79, description:"Online tech education platform offering intensive programs in software engineering, data science, and product management.", founders:"Abhimanyu Saxena, Anshuman Singh", employees:"1,800+", investors:"Peak XV Partners, Tiger Global", website:"https://scaler.com", signals:[{text:"Launched Scaler School of Technology, a 4-year degree", color:"#22c55e", date:"Mar 2025"},{text:"Crossed 15,000 alumni employed at top tech companies", color:"#3b82f6", date:"Jan 2025"},{text:"Expanded to UAE and Singapore markets", color:"#f97316", date:"Aug 2024"}], thesis:true},
  {id:7, name:"Stashfin", emoji:"💳", domain:"stashfin.com", sector:"Fintech", stage:"Series B", city:"Delhi / NCR", founded:2016, funding:"₹570 Cr", fundingNum:570, score:74, description:"Credit line fintech platform targeting underbanked Indians using alternative data for credit scoring and instant disbursal.", founders:"Tushar Aggarwal", employees:"700+", investors:"Uncorrelated Ventures, Snow Leopard, Prime Venture Partners", website:"https://stashfin.com", signals:[{text:"Launched co-branded credit card with SBM Bank", color:"#22c55e", date:"Feb 2025"},{text:"Disbursed over ₹3,000 Cr in cumulative loans", color:"#3b82f6", date:"Nov 2024"}], thesis:true},
  {id:8, name:"Nua", emoji:"🌸", domain:"nua.com", sector:"D2C / Commerce", stage:"Series A", city:"Mumbai", founded:2017, funding:"₹95 Cr", fundingNum:95, score:70, description:"D2C menstrual health and personal care brand targeting women with chemical-free, sustainable period products.", founders:"Ritesh Tiwari", employees:"200+", investors:"Lightbox Ventures, Kae Capital, Sahil Barua (Delhivery)", website:"https://nua.com", signals:[{text:"Expanded into skincare and wellness with 12 new SKUs", color:"#22c55e", date:"Jan 2025"},{text:"Reached profitability milestone in FY2024-25", color:"#3b82f6", date:"Oct 2024"}], thesis:false},
  {id:9, name:"Agnikul Cosmos", emoji:"🚀", domain:"agnikul.com", sector:"Deeptech / AI", stage:"Series B", city:"Chennai", founded:2017, funding:"₹460 Cr", fundingNum:460, score:86, description:"Space startup developing Agnilet, the world's first single-piece 3D-printed semi-cryo rocket engine for small satellite launches.", founders:"Srinath Ravichandran, Moin SPM", employees:"250+", investors:"Mayfield India, pi Ventures, Speciale Invest", website:"https://agnikul.com", signals:[{text:"Completed second launchpad test at ISRO Sriharikota", color:"#22c55e", date:"Mar 2025"},{text:"Signed 4 commercial payload agreements", color:"#3b82f6", date:"Jan 2025"},{text:"Received ISRO IN-SPACe launch authorization", color:"#f97316", date:"Aug 2024"}], thesis:true},
  {id:10, name:"Vahdam India", emoji:"🍵", domain:"vahdamteas.com", sector:"D2C / Commerce", stage:"Series C+", city:"Delhi / NCR", founded:2015, funding:"₹320 Cr", fundingNum:320, score:71, description:"Direct-to-consumer premium Indian tea and superfoods brand shipping to 100+ countries, sourcing directly from farmers.", founders:"Bala Sarda", employees:"500+", investors:"DSG Consumer Partners, IFC, Rainfall Ventures", website:"https://vahdamteas.com", signals:[{text:"Launched Vahdam-branded stores in 3 Indian malls", color:"#22c55e", date:"Feb 2025"},{text:"Crossed $50M ARR with 80% from exports", color:"#3b82f6", date:"Oct 2024"}], thesis:false},
  {id:11, name:"Zetwerk", emoji:"🏭", domain:"zetwerk.com", sector:"B2B SaaS", stage:"Series C+", city:"Bengaluru", founded:2018, funding:"₹3,600 Cr", fundingNum:3600, score:87, description:"B2B manufacturing network connecting buyers with global manufacturers for custom components across aerospace, defence and EV.", founders:"Amrit Acharya, Srinath Ramakkrushnan", employees:"3,000+", investors:"Greenoaks Capital, Lightspeed, D1 Capital", website:"https://zetwerk.com", signals:[{text:"Secured $100M defence manufacturing contract", color:"#22c55e", date:"Apr 2025"},{text:"Opened manufacturing hub in Vietnam for global supply", color:"#3b82f6", date:"Jan 2025"},{text:"Launched ZetwerkGo for SME procurement", color:"#f97316", date:"Sep 2024"}], thesis:true},
  {id:12, name:"Nium", emoji:"💸", domain:"nium.com", sector:"Fintech", stage:"Series C+", city:"Mumbai", founded:2015, funding:"₹2,900 Cr", fundingNum:2900, score:83, description:"Global B2B payments infrastructure unicorn enabling businesses to send, spend and receive funds in 100+ currencies.", founders:"Prajit Nanu, Anirban Mukherjee", employees:"1,500+", investors:"Visa, Riverwood Capital, Temasek", website:"https://nium.com", signals:[{text:"Partnered with NPCI to bring UPI to 10 new countries", color:"#22c55e", date:"Mar 2025"},{text:"Crossed $1B in transaction volumes per month", color:"#3b82f6", date:"Nov 2024"}], thesis:true},
  {id:13, name:"Rapido", emoji:"🏍️", domain:"rapido.bike", sector:"Logistics", stage:"Series C+", city:"Bengaluru", founded:2015, funding:"₹1,600 Cr", fundingNum:1600, score:76, description:"Bike taxi and auto-rickshaw platform across 100+ Indian cities, with Rapido Auto growing 3x YoY.", founders:"Aravind Sanka, Rishikesh SR, Pavan Guntupalli", employees:"1,000+", investors:"Swiggy, Nexus Venture Partners, Shell Ventures", website:"https://rapido.bike", signals:[{text:"Launched Rapido Cab services in 10 cities", color:"#22c55e", date:"Feb 2025"},{text:"Onboarded 25 lakh driver-partners on platform", color:"#3b82f6", date:"Dec 2024"}], thesis:false},
  {id:14, name:"Locus", emoji:"📦", domain:"locus.sh", sector:"B2B SaaS", stage:"Series C+", city:"Bengaluru", founded:2015, funding:"₹640 Cr", fundingNum:640, score:80, description:"AI-powered dispatch and logistics optimisation platform used by enterprises across APAC, Middle East and Americas.", founders:"Nishith Rastogi, Geet Garg", employees:"600+", investors:"Qualcomm Ventures, Falcon Edge, Tiger Global", website:"https://locus.sh", signals:[{text:"Expanded to 22 countries with Middle East HQ in Dubai", color:"#22c55e", date:"Mar 2025"},{text:"Achieved EBITDA breakeven across all regions", color:"#3b82f6", date:"Jan 2025"}], thesis:true},
  {id:15, name:"Niramai", emoji:"🏥", domain:"niramai.com", sector:"Healthtech", stage:"Series A", city:"Bengaluru", founded:2016, funding:"₹120 Cr", fundingNum:120, score:77, description:"AI-powered breast cancer screening solution using thermal imaging for early and low-cost detection without radiation.", founders:"Geetha Manjunath, Nidhi Mathur", employees:"100+", investors:"Flipkart co-founders, pi Ventures, Shell Foundation", website:"https://niramai.com", signals:[{text:"Received CDSCO approval for clinical use", color:"#22c55e", date:"Jan 2025"},{text:"Deployed in 150+ hospitals and clinics across India", color:"#3b82f6", date:"Oct 2024"},{text:"Partnership with NHM Maharashtra for rural screening", color:"#f97316", date:"Aug 2024"}], thesis:true},
  {id:16, name:"Vyapar", emoji:"🧾", domain:"vyapar.in", sector:"B2B SaaS", stage:"Series A", city:"Bengaluru", founded:2016, funding:"₹180 Cr", fundingNum:180, score:81, description:"GST-compliant accounting and billing app for Indian small businesses, with 1 crore+ registered business users.", founders:"Sumit Agarwal, Shubham Agarwal", employees:"400+", investors:"WestBridge Capital, India Quotient", website:"https://vyapar.in", signals:[{text:"Launched Vyapar Pay for UPI-based collections", color:"#22c55e", date:"Feb 2025"},{text:"Crossed 1 crore registered businesses milestone", color:"#3b82f6", date:"Nov 2024"},{text:"Integrated with GSTN for auto-filing", color:"#f97316", date:"Sep 2024"}], thesis:true},
  {id:17, name:"CropIn", emoji:"🌾", domain:"cropin.com", sector:"Agritech", stage:"Series B", city:"Bengaluru", founded:2010, funding:"₹350 Cr", fundingNum:350, score:75, description:"AgriTech SaaS platform enabling data-driven farming decisions for agribusinesses across 56 countries.", founders:"Krishna Kumar, Kunal Prasad", employees:"450+", investors:"ABC World Asia, Chiratae Ventures, SBI", website:"https://cropin.com", signals:[{text:"Signed $12M deal with World Food Programme", color:"#22c55e", date:"Mar 2025"},{text:"Launched AiSat: satellite+AI crop monitoring product", color:"#3b82f6", date:"Dec 2024"}], thesis:true},
  {id:18, name:"Stellapps", emoji:"🐄", domain:"stellapps.com", sector:"Agritech", stage:"Series B", city:"Bengaluru", founded:2011, funding:"₹210 Cr", fundingNum:210, score:72, description:"IoT-based dairy supply chain tech helping 3 million dairy farmers improve milk yield, quality and traceability.", founders:"Ranjith Mukundan, Praveen Nale", employees:"350+", investors:"Blume Ventures, Omnivore, Qualcomm Ventures", website:"https://stellapps.com", signals:[{text:"Deployed in 40,000 villages across 12 Indian states", color:"#22c55e", date:"Jan 2025"},{text:"Partnership with NDDB for 500,000 farmer scale-up", color:"#3b82f6", date:"Oct 2024"}], thesis:false},
  {id:19, name:"Signzy", emoji:"✍️", domain:"signzy.com", sector:"Fintech", stage:"Series B", city:"Bengaluru", founded:2015, funding:"₹310 Cr", fundingNum:310, score:78, description:"AI-powered digital onboarding and KYC platform for banks and NBFCs, processing over 20 crore verifications annually.", founders:"Ankit Ratan, Arpit Ratan", employees:"350+", investors:"Vertex Ventures, Arkam Ventures, Mastercard", website:"https://signzy.com", signals:[{text:"Crossed 200 banking and NBFC clients", color:"#22c55e", date:"Feb 2025"},{text:"Launched video KYC with regional language support", color:"#3b82f6", date:"Nov 2024"}], thesis:true},
  {id:20, name:"ClimateAI", emoji:"🌡️", domain:"climate.ai", sector:"Climate / Clean Energy", stage:"Series B", city:"Pune", founded:2017, funding:"₹420 Cr", fundingNum:420, score:83, description:"AI-driven climate risk analytics platform helping enterprises and governments with supply chain climate resilience.", founders:"Himanshu Gupta", employees:"200+", investors:"Generation Investment Management, Salesforce Ventures", website:"https://climate.ai", signals:[{text:"Signed agreement with Maharashtra government for flood prediction", color:"#22c55e", date:"Mar 2025"},{text:"Expanded product to cover 70 crop types for agri risk", color:"#3b82f6", date:"Jan 2025"}], thesis:true},
  {id:21, name:"Exotel", emoji:"☎️", domain:"exotel.com", sector:"B2B SaaS", stage:"Series C+", city:"Bengaluru", founded:2011, funding:"₹540 Cr", fundingNum:540, score:79, description:"Cloud communications platform (CPaaS) for customer engagement — calls, SMS, and WhatsApp APIs for enterprises.", founders:"Shivakumar Ganesan, Vijay Sharma", employees:"800+", investors:"Sequoia Capital India, Steadview Capital, Blinc Invest", website:"https://exotel.com", signals:[{text:"Acquired Cogno AI for conversational AI at ₹100 Cr", color:"#22c55e", date:"Apr 2025"},{text:"Crossed 6,000 business customers across Asia", color:"#3b82f6", date:"Jan 2025"}], thesis:true},
  {id:22, name:"MediBuddy", emoji:"💊", domain:"medibuddy.in", sector:"Healthtech", stage:"Series C+", city:"Bengaluru", founded:2015, funding:"₹960 Cr", fundingNum:960, score:80, description:"Corporate health and wellness platform providing teleconsultation, diagnostics, and insurance for 30 million employees.", founders:"Satish Kannan, Enbasekar D", employees:"2,000+", investors:"Quadria Capital, Rebright Partners, InnoVen Capital", website:"https://medibuddy.in", signals:[{text:"Onboarded 500 corporates including TCS and Wipro", color:"#22c55e", date:"Feb 2025"},{text:"Launched OPD cash plan bundled with diagnostics", color:"#3b82f6", date:"Dec 2024"}], thesis:true},
  {id:23, name:"Arya.ag", emoji:"🌽", domain:"arya.ag", sector:"Agritech", stage:"Series B", city:"Delhi / NCR", founded:2013, funding:"₹270 Cr", fundingNum:270, score:73, description:"Post-harvest management platform with 1,000+ warehouses offering storage, financing, and commodity trade for farmers.", founders:"Prasanna Rao, Chattanathan D", employees:"400+", investors:"Quona Capital, Maj Invest, Omidyar Network India", website:"https://arya.ag", signals:[{text:"Crossed ₹10,000 Cr in total commodity trade value", color:"#22c55e", date:"Mar 2025"},{text:"Expanded to 22 states with 120,000 tonnes storage", color:"#3b82f6", date:"Nov 2024"}], thesis:false},
  {id:24, name:"Ultraviolette", emoji:"⚡", domain:"ultraviolette.co", sector:"Climate / Clean Energy", stage:"Series B", city:"Bengaluru", founded:2015, funding:"₹310 Cr", fundingNum:310, score:76, description:"Indian electric motorcycle startup with the F77, India's fastest production EV bike at 140 km/h top speed.", founders:"Narayan Subramaniam, Niraj Rajmohan", employees:"250+", investors:"TVS Motor Company, Zoho", website:"https://ultraviolette.co", signals:[{text:"Launched in Europe — Netherlands and Germany", color:"#22c55e", date:"Apr 2025"},{text:"Crossed 2,000 F77 deliveries in India", color:"#3b82f6", date:"Jan 2025"}], thesis:false},
  {id:25, name:"Setu", emoji:"🔗", domain:"setu.in", sector:"Fintech", stage:"Series A", city:"Bengaluru", founded:2018, funding:"₹170 Cr", fundingNum:170, score:84, description:"API-first fintech infrastructure company — UPI, bank accounts, data fetching and lending APIs for fintechs and enterprises.", founders:"Sahil Kini, Nikhil Kumar", employees:"170+", investors:"Peak XV Partners, Bharat Inclusion Initiative, Lightspeed", website:"https://setu.in", signals:[{text:"Acquired by Pine Labs for ₹480 Cr strategic exit", color:"#22c55e", date:"Mar 2025"},{text:"Reached 50 crore UPI transactions processed annually", color:"#3b82f6", date:"Oct 2024"}], thesis:true},
];

// ===== FAKE ENRICHMENT DATA (no AI API calls) =====
const ENRICHMENT_DATA = {
  1: { summary: "Zepto operates a 10-minute grocery delivery model using 200+ dark stores. The company has expanded beyond groceries into electronics and beauty in FY25.", bullets: ["10-minute delivery from strategically placed dark stores across metro India","SKU catalogue of 8,000+ products with same-day availability","Subscription model 'ZeptoPass' drives repeat purchase behaviour","Integrated logistics with 30,000+ delivery partners on payroll","Category expansion into electronics, personal care, and pet supplies"], keywords: ["quick commerce","dark store","last-mile delivery","grocery delivery","10-minute","hyperlocal","supply chain","D2C","Zepto Pass","inventory management"], signals: [{text:"Careers page active — 120+ open roles in tech and operations", type:"positive"},{text:"Engineering blog updated in last 30 days", type:"positive"},{text:"Press room has 6 new releases in 2025", type:"neutral"},{text:"Product changelog shows 3 new feature releases this quarter", type:"positive"}], sources: ["https://zepto.com/about","https://zepto.com/careers","https://zepto.com/blog"] },
  2: { summary: "Krutrim is building India-centric foundational AI models supporting 22 Indic languages. Its cloud platform provides GPU compute to Indian enterprises.", bullets: ["Foundational LLM trained on 2 trillion Indic language tokens","GPU cloud infrastructure for Indian AI startups and enterprises","Krutrim-2 available as API with pay-per-token pricing","Strong backing from Ola's ecosystem and founding team","Government AI mission alignment for public sector contracts"], keywords: ["LLM","Indic languages","AI infrastructure","GPU cloud","foundational model","multilingual AI","generative AI","India AI","deep learning","API"], signals: [{text:"Careers page shows 45+ open AI/ML engineering roles", type:"positive"},{text:"Developer documentation published with API reference", type:"positive"},{text:"Press release on government partnership in Jan 2025", type:"neutral"}], sources: ["https://krutrim.com","https://krutrim.com/developers","https://krutrim.com/careers"] },
  3: { summary: "Sarvam AI builds full-stack voice and language AI for Indian vernacular languages, offering speech-to-text, translation and TTS APIs for enterprises.", bullets: ["Speech recognition and synthesis for 10+ Indian languages","Open-source LLM (OpenHathi) with 7B and 13B parameter variants","Enterprise APIs for call centers, banking IVR and e-governance","Real-time translation between Indian language pairs","Trained on India-specific domains: healthcare, legal, agri"], keywords: ["speech AI","Indic NLP","voice AI","multilingual","open source","LLM","IVR","vernacular","translation","TTS"], signals: [{text:"GitHub repo has 4,200+ stars and active commits in March 2025", type:"positive"},{text:"Blog post on Indian language benchmarks published Feb 2025", type:"positive"},{text:"Partnership announcement page shows 8 enterprise clients", type:"positive"}], sources: ["https://sarvam.ai","https://sarvam.ai/blog","https://github.com/sarvam-ai"] },
  default: { summary: "This company operates in India's startup ecosystem with strong fundamentals and a clear product-market fit in its segment.", bullets: ["Addresses a large and underserved market opportunity in India","Strong founding team with domain expertise and prior experience","Technology-first approach with a scalable product architecture","Demonstrated traction with growing revenue and user base","Expanding beyond Tier-1 cities into India's Tier-2 and Tier-3 markets"], keywords: ["startup","B2B","growth","India","technology","product","SaaS","market expansion","revenue","traction"], signals: [{text:"Careers page active with open engineering roles", type:"positive"},{text:"Company blog updated in the last 60 days", type:"neutral"},{text:"LinkedIn follower growth indicates team expansion", type:"positive"}], sources: ["https://company.com/about","https://company.com/careers"] }
};

// ===== STATE =====
let state = {
  page: 'companies',
  filtered: [...COMPANIES],
  sortCol: 'score',
  sortDir: -1,
  currentPage: 1,
  perPage: 10,
  currentCompany: null,
  thesisFilter: false,
  lists: JSON.parse(localStorage.getItem('vc_lists') || '[]'),
  savedSearches: JSON.parse(localStorage.getItem('vc_saved') || '[]'),
  enriched: {},
  notes: JSON.parse(localStorage.getItem('vc_notes') || '{}'),
  savedCompanies: JSON.parse(localStorage.getItem('vc_saved_cos') || '[]'),
  modalMode: null,
  modalCompany: null
};

// ===== NAVIGATION =====
function navigate(page, companyId) {
  state.page = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const labels = {companies:'Companies', profile:'Profile', lists:'My Lists', saved:'Saved Searches', signals:'Signals Feed'};
  document.getElementById('page-label').textContent = labels[page] || page;
  if (page === 'companies') renderTable();
  if (page === 'profile' && companyId) {
    state.currentCompany = COMPANIES.find(c => c.id == companyId);
    renderProfile();
  }
  if (page === 'lists') renderLists();
  if (page === 'saved') renderSaved();
  if (page === 'signals') renderSignals();
}

// ===== COMPANIES TABLE =====
function filterCompanies() {
  const q = document.getElementById('co-search').value.toLowerCase();
  const sector = document.getElementById('filter-sector').value;
  const stage = document.getElementById('filter-stage').value;
  const city = document.getElementById('filter-city').value;
  state.filtered = COMPANIES.filter(c => {
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchSector = !sector || c.sector === sector;
    const matchStage = !stage || c.stage === stage;
    const matchCity = !city || c.city === city;
    const matchThesis = !state.thesisFilter || c.thesis;
    return matchQ && matchSector && matchStage && matchCity && matchThesis;
  });
  state.currentPage = 1;
  renderTable();
}

function globalSearch(val) {
  document.getElementById('co-search').value = val;
  filterCompanies();
  if (state.page !== 'companies') navigate('companies');
}

function toggleThesisFilter() {
  state.thesisFilter = !state.thesisFilter;
  document.getElementById('btn-thesis').classList.toggle('active-filter', state.thesisFilter);
  filterCompanies();
}

function sortTable(col) {
  if (state.sortCol === col) state.sortDir *= -1;
  else { state.sortCol = col; state.sortDir = 1; }
  state.filtered.sort((a, b) => {
    let av = a[col], bv = b[col];
    if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
    return av < bv ? -state.sortDir : av > bv ? state.sortDir : 0;
  });
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('companies-body');
  const start = (state.currentPage - 1) * state.perPage;
  const slice = state.filtered.slice(start, start + state.perPage);
  document.getElementById('result-count').textContent = state.filtered.length + ' companies';

  tbody.innerHTML = slice.map(c => `
    <tr onclick="navigate('profile', ${c.id})">
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:20px">${c.emoji}</span>
          <div>
            <div class="company-name">${c.name} ${c.thesis ? '<span title="Thesis match" style="color:var(--accent);font-size:10px">★ Match</span>' : ''}</div>
            <div class="company-domain">${c.domain}</div>
          </div>
        </div>
      </td>
      <td><span class="tag tag-sector">${c.sector}</span></td>
      <td><span class="tag tag-stage">${c.stage}</span></td>
      <td><span class="tag tag-city">${c.city}</span></td>
      <td style="color:var(--text-sub)">${c.founded}</td>
      <td style="font-weight:500">${c.funding}</td>
      <td>
        <div class="score-bar">
          <span class="score-num" style="color:${c.score>85?'var(--green)':c.score>75?'var(--accent)':'var(--text-sub)'}">${c.score}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${c.score}%"></div></div>
        </div>
      </td>
      <td onclick="event.stopPropagation()">
        <div style="display:flex;gap:6px">
          <button class="btn btn-outline btn-sm" onclick="addToListModal(${c.id})">+ List</button>
          <button class="btn btn-outline btn-sm" onclick="toggleSave(${c.id}, this)">${state.savedCompanies.includes(c.id)?'★':'☆'}</button>
        </div>
      </td>
    </tr>
  `).join('');
  renderPagination();
}

function renderPagination() {
  const total = Math.ceil(state.filtered.length / state.perPage);
  const pg = document.getElementById('pagination');
  if (total <= 1) { pg.innerHTML = ''; return; }
  let html = `<button class="pg-btn" onclick="changePage(${state.currentPage-1})" ${state.currentPage===1?'disabled':''}>‹ Prev</button>`;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - state.currentPage) <= 2)
      html += `<button class="pg-btn ${i===state.currentPage?'current':''}" onclick="changePage(${i})">${i}</button>`;
    else if (Math.abs(i - state.currentPage) === 3)
      html += `<span style="color:var(--text-muted);padding:0 4px">…</span>`;
  }
  html += `<button class="pg-btn" onclick="changePage(${state.currentPage+1})" ${state.currentPage===total?'disabled':''}>Next ›</button>`;
  pg.innerHTML = html;
}

function changePage(p) {
  const total = Math.ceil(state.filtered.length / state.perPage);
  if (p < 1 || p > total) return;
  state.currentPage = p;
  renderTable();
}

// ===== PROFILE PAGE =====
function renderProfile() {
  const c = state.currentCompany;
  if (!c) return;
  const isSaved = state.savedCompanies.includes(c.id);
  const note = state.notes[c.id] || '';

  document.getElementById('profile-header').innerHTML = `
    <div class="profile-logo-box">${c.emoji}</div>
    <div class="profile-meta">
      <h1>${c.name}</h1>
      <div class="profile-tags">
        <span class="tag tag-sector">${c.sector}</span>
        <span class="tag tag-stage">${c.stage}</span>
        <span class="tag tag-city">${c.city}</span>
        ${c.thesis ? '<span class="tag" style="background:rgba(249,115,22,.15);color:var(--accent);border:1px solid rgba(249,115,22,.25)">★ Thesis Match</span>' : ''}
      </div>
      <div class="profile-desc">${c.description}</div>
    </div>
    <div class="profile-actions">
      <button class="btn btn-primary" onclick="startEnrich()">🔍 Enrich</button>
      <button class="btn ${isSaved?'btn-success':'btn-outline'}" id="save-btn" onclick="toggleSave(${c.id}, this)">${isSaved?'★ Saved':'☆ Save'}</button>
      <button class="btn btn-outline btn-sm" onclick="addToListModal(${c.id})">+ Add to List</button>
    </div>
  `;

  document.getElementById('profile-grid').innerHTML = `
    <div>
      <!-- OVERVIEW -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-title">Overview</div>
        <div class="stat-row">
          <div class="stat-box"><div class="stat-label">Founded</div><div class="stat-val">${c.founded}</div></div>
          <div class="stat-box"><div class="stat-label">Total Funding</div><div class="stat-val">${c.funding}</div></div>
          <div class="stat-box"><div class="stat-label">Thesis Score</div><div class="stat-val" style="color:${c.score>85?'var(--green)':c.score>75?'var(--accent)':'var(--text-sub)'}">${c.score}/100</div></div>
        </div>
        <div class="kv"><span class="kv-key">Founders</span><span class="kv-val">${c.founders}</span></div>
        <div class="kv"><span class="kv-key">Employees</span><span class="kv-val">${c.employees}</span></div>
        <div class="kv"><span class="kv-key">Investors</span><span class="kv-val">${c.investors}</span></div>
        <div class="kv"><span class="kv-key">Website</span><span class="kv-val"><a href="${c.website}" target="_blank" style="color:var(--blue)">${c.domain}</a></span></div>
        <div class="kv"><span class="kv-key">City</span><span class="kv-val">${c.city}</span></div>
      </div>

      <!-- SIGNALS TIMELINE -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-title">Signals Timeline</div>
        ${c.signals.map(s => `
          <div class="signal-item">
            <div class="signal-dot" style="background:${s.color}"></div>
            <div class="signal-content">
              <div class="signal-text">${s.text}</div>
              <div class="signal-date">${s.date}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- ENRICHMENT -->
      <div class="card">
        <div class="card-title">Live Enrichment</div>
        <div id="enrich-placeholder" style="color:var(--text-muted);font-size:13px">Click "Enrich" above to pull public web data for this company.</div>
        <div id="enrich-result" style="display:none"></div>
      </div>
    </div>

    <!-- RIGHT SIDEBAR -->
    <div>
      <!-- NOTES -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-title">Notes</div>
        <textarea id="notes-area" placeholder="Add deal notes, context, or next steps…" oninput="saveNote(${c.id}, this.value)">${note}</textarea>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px">Auto-saved to local storage</div>
      </div>

      <!-- SCORE BREAKDOWN -->
      <div class="card">
        <div class="card-title">Score Breakdown</div>
        ${[['Market Size', Math.round(c.score*0.9 + Math.random()*8)],['Team Quality', Math.round(c.score*0.95 + Math.random()*5)],['Traction', Math.round(c.score*0.85 + Math.random()*12)],['Thesis Fit', c.thesis?95:45],['Competitive Moat', Math.round(c.score*0.8 + Math.random()*15)]].map(([k,v]) => v=Math.min(v,98), [k,v]=arguments, `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px">
              <span style="font-size:12px;color:var(--text-sub)">${k}</span>
              <span style="font-size:12px;font-weight:600">${v}</span>
            </div>
            <div class="bar-bg" style="height:6px"><div class="bar-fill" style="width:${v}%"></div></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Re-render score breakdown properly since the above has a JS quirk
  const scoreBreakdown = document.querySelector('#profile-grid .card:last-child');
  const items = [['Market Size', Math.min(98, Math.round(c.score*0.9 + 4))],['Team Quality', Math.min(98, Math.round(c.score*0.95 + 3))],['Traction', Math.min(98, Math.round(c.score*0.85 + 6))],['Thesis Fit', c.thesis?95:45],['Competitive Moat', Math.min(98, Math.round(c.score*0.8 + 8))]];
  scoreBreakdown.innerHTML = '<div class="card-title">Score Breakdown</div>' + items.map(([k,v]) => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:12px;color:var(--text-sub)">${k}</span>
        <span style="font-size:12px;font-weight:600">${v}</span>
      </div>
      <div class="bar-bg" style="height:6px"><div class="bar-fill" style="width:${v}%"></div></div>
    </div>
  `).join('');
}

// ===== ENRICHMENT (simulated with cached structured data, no AI API) =====
function startEnrich() {
  const placeholder = document.getElementById('enrich-placeholder');
  const result = document.getElementById('enrich-result');
  const c = state.currentCompany;

  if (state.enriched[c.id]) {
    showEnrichResult(state.enriched[c.id]);
    return;
  }

  placeholder.style.display = 'none';
  result.style.display = 'block';
  result.innerHTML = '<div class="enrich-loading"><div class="spinner"></div>Fetching public web data for ' + c.name + '…</div>';

  setTimeout(() => {
    const data = ENRICHMENT_DATA[c.id] || ENRICHMENT_DATA.default;
    const enriched = { ...data, company: c.name, timestamp: new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}), sources: data.sources.map(s => s.replace('company.com', c.domain)) };
    state.enriched[c.id] = enriched;
    showEnrichResult(enriched);
    showToast('Enrichment complete for ' + c.name);
  }, 1800);
}

function showEnrichResult(data) {
  const result = document.getElementById('enrich-result');
  const placeholder = document.getElementById('enrich-placeholder');
  if (placeholder) placeholder.style.display = 'none';
  result.style.display = 'block';
  result.innerHTML = `
    <div class="enrich-box">
      <div class="enrich-section">
        <div class="enrich-label">Summary</div>
        <div class="enrich-summary">${data.summary}</div>
      </div>
      <div class="enrich-section">
        <div class="enrich-label">What They Do</div>
        <ul class="bullet-list">${data.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
      </div>
      <div class="enrich-section">
        <div class="enrich-label">Keywords</div>
        <div class="keyword-chips">${data.keywords.map(k=>`<span class="kw-chip">${k}</span>`).join('')}</div>
      </div>
      <div class="enrich-section">
        <div class="enrich-label">Derived Signals</div>
        <div>${data.signals.map(s=>`<span class="signal-tag ${s.type}">● ${s.text}</span>`).join('')}</div>
      </div>
      <div class="enrich-section">
        <div class="enrich-label">Sources Scraped</div>
        ${data.sources.map(s=>`<a class="source-link" href="${s}" target="_blank">${s}</a>`).join('')}
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px">Last fetched: ${data.timestamp} IST</div>
      </div>
    </div>
  `;
}

// ===== NOTES =====
function saveNote(id, val) {
  state.notes[id] = val;
  localStorage.setItem('vc_notes', JSON.stringify(state.notes));
}

// ===== SAVE COMPANIES =====
function toggleSave(id, btn) {
  const idx = state.savedCompanies.indexOf(id);
  if (idx > -1) {
    state.savedCompanies.splice(idx, 1);
    if (btn) btn.textContent = '☆ Save', btn.className = 'btn btn-outline';
    showToast('Removed from saved');
  } else {
    state.savedCompanies.push(id);
    if (btn) btn.textContent = '★ Saved', btn.className = 'btn btn-success';
    showToast('Saved company');
  }
  localStorage.setItem('vc_saved_cos', JSON.stringify(state.savedCompanies));
  document.getElementById('saved-count').textContent = state.savedCompanies.length;
}

// ===== LISTS =====
function renderLists() {
  const container = document.getElementById('lists-container');
  if (!state.lists.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">No lists yet</div><div style="font-size:13px">Create a list to organise companies for a thesis or sector.</div></div>`;
    return;
  }
  container.innerHTML = state.lists.map((l, i) => {
    const cos = l.companies.map(id => COMPANIES.find(c=>c.id===id)).filter(Boolean);
    return `
      <div class="list-card">
        <div class="list-card-header">
          <div>
            <div class="list-name">${l.name}</div>
            <div class="list-meta">${l.description || ''} · ${cos.length} companies · Created ${l.created}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-outline btn-sm" onclick="exportList(${i})">↓ Export</button>
            <button class="btn btn-outline btn-sm" style="color:var(--red)" onclick="deleteList(${i})">Delete</button>
          </div>
        </div>
        <div class="list-companies">
          ${cos.length ? cos.map(c=>`<span class="list-co-tag">${c.emoji} ${c.name}</span>`).join('') : '<span style="color:var(--text-muted);font-size:12px">No companies added yet. Open a company profile and click "+ Add to List".</span>'}
        </div>
      </div>
    `;
  }).join('');
}

function deleteList(i) {
  state.lists.splice(i, 1);
  localStorage.setItem('vc_lists', JSON.stringify(state.lists));
  renderLists();
  showToast('List deleted');
}

function exportList(i) {
  const l = state.lists[i];
  const cos = l.companies.map(id => COMPANIES.find(c=>c.id===id)).filter(Boolean);
  const csv = 'Name,Sector,Stage,City,Founded,Funding,Score\n' + cos.map(c=>`${c.name},${c.sector},${c.stage},${c.city},${c.founded},${c.funding},${c.score}`).join('\n');
  downloadFile(csv, l.name + '-list.csv', 'text/csv');
  showToast('Exported ' + l.name);
}

// ===== SAVED SEARCHES =====
function saveCurrentSearch() {
  const q = document.getElementById('co-search').value;
  const sector = document.getElementById('filter-sector').value;
  const stage = document.getElementById('filter-stage').value;
  const city = document.getElementById('filter-city').value;
  const entry = { query: q || 'All companies', filters: [sector, stage, city, state.thesisFilter?'Thesis Match':''].filter(Boolean).join(', ') || 'No filters', date: new Date().toLocaleDateString('en-IN'), results: state.filtered.length };
  state.savedSearches.unshift(entry);
  localStorage.setItem('vc_saved', JSON.stringify(state.savedSearches));
  showToast('Search saved');
}

function renderSaved() {
  const container = document.getElementById('saved-container');
  if (!state.savedSearches.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔖</div><div class="empty-title">No saved searches yet</div><div style="font-size:13px">Use the "Save Search" button on the companies page to bookmark your filters.</div></div>`;
    return;
  }
  container.innerHTML = state.savedSearches.map((s, i) => `
    <div class="saved-card">
      <span style="font-size:18px">🔍</span>
      <div style="flex:1">
        <div class="saved-query">${s.query}</div>
        <div class="saved-filters">${s.filters || 'No filters applied'} · ${s.results} results</div>
      </div>
      <div class="saved-date">${s.date}</div>
      <button class="btn btn-outline btn-sm" onclick="runSearch(${i})">Re-run</button>
      <button class="btn btn-outline btn-sm" style="color:var(--red)" onclick="deleteSaved(${i})">✕</button>
    </div>
  `).join('');
}

function runSearch(i) {
  const s = state.savedSearches[i];
  document.getElementById('co-search').value = s.query === 'All companies' ? '' : s.query;
  filterCompanies();
  navigate('companies');
  showToast('Search re-run: ' + s.query);
}

function deleteSaved(i) {
  state.savedSearches.splice(i, 1);
  localStorage.setItem('vc_saved', JSON.stringify(state.savedSearches));
  renderSaved();
  showToast('Saved search removed');
}

// ===== SIGNALS FEED =====
function renderSignals() {
  const allSignals = [];
  COMPANIES.forEach(c => {
    c.signals.forEach(s => {
      allSignals.push({ company: c.name, emoji: c.emoji, id: c.id, text: s.text, color: s.color, date: s.date, sector: c.sector });
    });
  });
  const container = document.getElementById('signals-feed');
  container.innerHTML = allSignals.slice(0,30).map(s => `
    <div class="signal-item" style="padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer" onclick="navigate('profile', ${s.id})">
      <div class="signal-dot" style="background:${s.color};margin-top:3px"></div>
      <div class="signal-content">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="font-size:16px">${s.emoji}</span>
          <span style="font-weight:600;font-size:13px;color:var(--text)">${s.company}</span>
          <span class="tag tag-sector" style="font-size:10px;padding:1px 6px">${s.sector}</span>
        </div>
        <div class="signal-text">${s.text}</div>
        <div class="signal-date">${s.date}</div>
      </div>
    </div>
  `).join('');
}

// ===== MODAL =====
function openModal(mode, companyId) {
  state.modalMode = mode;
  state.modalCompany = companyId;
  const overlay = document.getElementById('modal-overlay');
  if (mode === 'list') {
    document.getElementById('modal-title').textContent = 'Create New List';
    document.getElementById('modal-input1').placeholder = 'e.g. Deep Tech Watch, Series A Radar';
    document.getElementById('modal-input2').placeholder = 'Description (optional)';
    document.getElementById('modal-confirm').textContent = 'Create List';
    document.getElementById('modal-input1').value = '';
    document.getElementById('modal-input2').value = '';
  } else if (mode === 'addto') {
    document.getElementById('modal-title').textContent = 'Add to List';
    const co = COMPANIES.find(c => c.id === companyId);
    document.getElementById('modal-input1').placeholder = state.lists.length ? 'Type list name or index (1-' + state.lists.length + ')' : 'No lists yet — create one first';
    document.getElementById('modal-input2').placeholder = 'Or create new list name';
    document.getElementById('modal-confirm').textContent = 'Add';
    document.getElementById('modal-input1').value = '';
    document.getElementById('modal-input2').value = '';
  }
  overlay.classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}

function confirmModal() {
  const v1 = document.getElementById('modal-input1').value.trim();
  const v2 = document.getElementById('modal-input2').value.trim();
  if (state.modalMode === 'list') {
    if (!v1) { showToast('Please enter a list name'); return; }
    state.lists.push({ name: v1, description: v2, companies: [], created: new Date().toLocaleDateString('en-IN') });
    localStorage.setItem('vc_lists', JSON.stringify(state.lists));
    showToast('List "' + v1 + '" created');
    closeModal();
  } else if (state.modalMode === 'addto') {
    let listIdx = -1;
    const num = parseInt(v1) - 1;
    if (!isNaN(num) && num >= 0 && num < state.lists.length) {
      listIdx = num;
    } else {
      listIdx = state.lists.findIndex(l => l.name.toLowerCase() === v1.toLowerCase());
    }
    if (listIdx === -1 && v2) {
      state.lists.push({ name: v2, description: '', companies: [state.modalCompany], created: new Date().toLocaleDateString('en-IN') });
      showToast('Added to new list "' + v2 + '"');
    } else if (listIdx > -1) {
      if (!state.lists[listIdx].companies.includes(state.modalCompany)) {
        state.lists[listIdx].companies.push(state.modalCompany);
        showToast('Added to "' + state.lists[listIdx].name + '"');
      } else {
        showToast('Already in this list');
      }
    } else {
      showToast('List not found. Enter a list number or create a new one.');
      return;
    }
    localStorage.setItem('vc_lists', JSON.stringify(state.lists));
    closeModal();
  }
}

function addToListModal(id) {
  if (!state.lists.length) {
    openModal('list');
    showToast('Create a list first, then add companies to it');
    return;
  }
  openModal('addto', id);
}

// ===== EXPORT =====
function exportCSV() {
  const rows = ['Name,Sector,Stage,City,Founded,Funding,Score,Domain,Founders,Investors'];
  state.filtered.forEach(c => rows.push(`${c.name},${c.sector},${c.stage},${c.city},${c.founded},${c.funding},${c.score},${c.domain},"${c.founders}","${c.investors}"`));
  downloadFile(rows.join('\n'), 'venturescope-companies.csv', 'text/csv');
  showToast('Exported ' + state.filtered.length + ' companies');
}

function downloadFile(content, filename, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = filename;
  a.click();
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('global-search').focus();
  }
  if (e.key === 'Escape') {
    closeModal();
    document.getElementById('global-search').blur();
  }
});

// ===== INIT =====
document.getElementById('saved-count').textContent = state.savedCompanies.length;
filterCompanies();
renderTable();
</script>
</body>
</html>
