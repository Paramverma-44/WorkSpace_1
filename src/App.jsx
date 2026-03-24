import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0c0c0e;--panel:#141416;--panel2:#1c1c1f;--panel3:#242428;
  --border:#2a2a2e;--border2:#333338;
  --accent:#7c3aed;--accent2:#a855f7;--accent3:#c084fc;
  --glow:rgba(124,58,237,0.2);--glow2:rgba(168,85,247,0.12);
  --text:#f0f0f2;--text2:#a0a0a8;--text3:#52525a;--text4:#38383f;
  --red:#ef4444;--yellow:#f59e0b;--green:#10b981;--blue:#3b82f6;--orange:#f97316;
  --mono:'DM Mono',monospace;--sans:'Syne',sans-serif;
  --r:12px;--r2:8px;--r3:20px;
  --shadow:0 4px 24px rgba(0,0,0,0.4);
  --shadow2:0 8px 40px rgba(0,0,0,0.6);
}
.light{
  --bg:#f4f4f6;--panel:#ffffff;--panel2:#f0f0f3;--panel3:#e8e8ed;
  --border:#e0e0e6;--border2:#d0d0d8;
  --text:#0f0f12;--text2:#52525a;--text3:#a0a0a8;--text4:#c8c8d0;
  --glow:rgba(124,58,237,0.1);--glow2:rgba(168,85,247,0.06);
}
body{background:var(--bg);color:var(--text);font-family:var(--mono);transition:background 0.3s,color 0.3s}
button{cursor:pointer;font-family:var(--mono)}
input,select,textarea{font-family:var(--mono)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px var(--accent)}50%{box-shadow:0 0 20px var(--accent2)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.fade-up{animation:fadeUp 0.3s ease forwards}
.fade-in{animation:fadeIn 0.25s ease forwards}
.slide-in{animation:slideIn 0.25s ease forwards}

/* ── LOGIN ── */
.login-bg{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:var(--bg);
  background-image:radial-gradient(ellipse 70% 50% at 50% -10%,rgba(124,58,237,0.18) 0%,transparent 70%),
    radial-gradient(ellipse 40% 30% at 80% 80%,rgba(168,85,247,0.08) 0%,transparent 60%)}
.login-card{width:420px;background:var(--panel);border:1px solid var(--border2);border-radius:20px;
  padding:52px 44px;display:flex;flex-direction:column;gap:22px;
  box-shadow:0 0 80px rgba(124,58,237,0.1),var(--shadow2)}
.login-brand{display:flex;align-items:center;gap:10px}
.brand-orb{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 20px var(--glow)}
.brand-name{font-family:var(--sans);font-size:22px;font-weight:800;letter-spacing:-0.5px}
.login-tagline{font-size:11px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;margin-top:-8px}
.lf{display:flex;flex-direction:column;gap:7px}
.lf label{font-size:10px;color:var(--text2);letter-spacing:1.5px;text-transform:uppercase}
.lf input{background:var(--panel2);border:1px solid var(--border);border-radius:10px;
  padding:12px 14px;color:var(--text);font-size:13px;outline:none;transition:all 0.2s}
.lf input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--glow)}
.login-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:12px;
  padding:14px;color:#fff;font-family:var(--sans);font-size:13px;font-weight:700;
  letter-spacing:1px;text-transform:uppercase;transition:all 0.2s}
.login-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--glow)}
.login-err{font-size:12px;color:#f87171;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);
  border-radius:8px;padding:10px 13px}
.login-hint{font-size:11px;color:var(--text3);text-align:center}
.login-hint span{color:var(--accent2)}
.login-divider{display:flex;align-items:center;gap:10px;color:var(--text3);font-size:11px}
.login-divider::before,.login-divider::after{content:'';flex:1;height:1px;background:var(--border)}

/* ── SHELL ── */
.app{display:flex;flex-direction:column;height:100vh;overflow:hidden}

/* ── TOPBAR ── */
.topbar{height:54px;background:var(--panel);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;padding:0 18px;
  flex-shrink:0;z-index:100;gap:12px}
.tb-left{display:flex;align-items:center;gap:10px;min-width:0}
.tb-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-family:var(--sans);
  font-size:14px;font-weight:800;color:#fff;flex-shrink:0;cursor:pointer;
  box-shadow:0 0 12px var(--glow)}
.tb-info{min-width:0}
.tb-name{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-role{font-size:10px;color:var(--text3);letter-spacing:1px;text-transform:uppercase}
.tb-center{display:flex;align-items:center;gap:4px;flex:1;justify-content:center;flex-wrap:wrap}
.nav-btn{padding:6px 12px;border-radius:8px;font-size:11px;font-family:var(--sans);font-weight:700;
  letter-spacing:0.8px;text-transform:uppercase;cursor:pointer;border:1px solid transparent;
  transition:all 0.15s;color:var(--text2);background:transparent;white-space:nowrap}
.nav-btn:hover{color:var(--text);background:var(--panel2)}
.nav-btn.active{color:var(--accent2);background:rgba(124,58,237,0.1);border-color:rgba(124,58,237,0.25)}
.tb-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.tb-icon-btn{width:32px;height:32px;border-radius:8px;background:var(--panel2);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.15s}
.tb-icon-btn:hover{border-color:var(--accent);color:var(--accent2)}
.status-pill{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;
  background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:10px;color:var(--green)}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.logout-btn{display:flex;align-items:center;gap:6px;background:rgba(239,68,68,0.08);
  border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:7px 12px;
  color:#f87171;font-size:11px;transition:all 0.15s;letter-spacing:0.5px}
.logout-btn:hover{background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.4)}
.notif-badge{position:relative}
.notif-badge .badge{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;
  background:var(--red);font-size:8px;color:#fff;display:flex;align-items:center;justify-content:center;
  font-family:var(--sans);font-weight:700}

/* ── WORKSPACE ── */
.workspace{display:flex;flex:1;overflow:hidden}

/* ── SIDEBAR ── */
.sidebar{width:224px;flex-shrink:0;background:var(--panel);border-right:2px solid var(--accent);
  display:flex;flex-direction:column;box-shadow:4px 0 20px var(--glow2);position:relative;z-index:2}
.sidebar-chrome{display:flex;align-items:center;justify-content:space-between;
  padding:9px 12px;border-bottom:1px solid var(--border);background:var(--panel2)}
.traffic{display:flex;gap:5px}
.tl{width:11px;height:11px;border-radius:50%;transition:filter 0.15s;cursor:pointer}
.tl:hover{filter:brightness(1.3)}
.tl-r{background:#ef4444}.tl-y{background:#f59e0b}.tl-g{background:#10b981}
.chrome-label{font-family:var(--sans);font-size:10px;font-weight:700;color:var(--text3);letter-spacing:1px}
.chrome-icons{display:flex;gap:7px}
.ci{font-size:14px;color:var(--text3);cursor:pointer;transition:color 0.15s;line-height:1}
.ci:hover{color:var(--accent2)}
.sb-search{display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid var(--border)}
.sb-search input{flex:1;background:transparent;border:none;outline:none;font-size:12px;color:var(--text)}
.sb-search input::placeholder{color:var(--text3)}
.sb-section{font-size:9px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;
  padding:8px 12px 4px;font-family:var(--sans);font-weight:700}
.task-list{flex:1;overflow-y:auto}
.task-item{display:flex;align-items:center;gap:8px;padding:8px 12px;
  border-bottom:1px dashed var(--border);cursor:pointer;transition:background 0.15s;position:relative}
.task-item:hover{background:var(--panel2)}
.task-item.selected{background:rgba(124,58,237,0.08)}
.task-cb{width:13px;height:13px;border:1.5px solid var(--accent);border-radius:3px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.task-cb.chk{background:var(--accent);border-color:var(--accent)}
.task-cb.chk::after{content:'✓';color:#fff;font-size:8px}
.task-title{flex:1;font-size:11px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.task-title.done{text-decoration:line-through;color:var(--text3)}
.task-tag{font-size:9px;padding:2px 6px;border-radius:4px;font-family:var(--sans);font-weight:700;flex-shrink:0}
.tag-high{background:rgba(239,68,68,0.15);color:#f87171}
.tag-med{background:rgba(245,158,11,0.15);color:#fbbf24}
.tag-low{background:rgba(16,185,129,0.15);color:#34d399}
.tag-new{background:rgba(59,130,246,0.15);color:#60a5fa}
.sb-add{padding:10px 12px;border-top:1px solid var(--border);display:flex;gap:7px}
.sb-add input{flex:1;background:var(--panel2);border:1px solid var(--border);border-radius:7px;
  padding:7px 9px;color:var(--text);font-size:11px;outline:none}
.sb-add input:focus{border-color:var(--accent)}
.add-btn{background:var(--accent);border:none;border-radius:7px;padding:7px 10px;
  color:#fff;font-size:16px;font-weight:700;transition:all 0.15s;line-height:1}
.add-btn:hover{background:var(--accent2);transform:scale(1.05)}
.online-list{padding:4px 0 8px}
.online-user{display:flex;align-items:center;gap:8px;padding:5px 12px}
.ou-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pulse 2s infinite}
.ou-dot.away{background:var(--yellow);animation:none}
.ou-name{font-size:11px;color:var(--text2)}
.ou-role{font-size:9px;color:var(--text3);margin-left:auto}

/* ── CENTER ── */
.center{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--bg)}
.display-screen{flex:1;margin:14px;border-radius:var(--r);background:var(--panel);
  border:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}
.ds-header{padding:11px 16px;border-bottom:1px solid var(--border);display:flex;
  align-items:center;justify-content:space-between;background:var(--panel2);border-radius:var(--r) var(--r) 0 0;flex-shrink:0}
.ds-title{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:2px;
  text-transform:uppercase;color:var(--text2)}
.ds-actions{display:flex;gap:6px;align-items:center}
.ds-btn{padding:5px 10px;border-radius:6px;font-size:10px;font-family:var(--sans);font-weight:700;
  letter-spacing:0.8px;text-transform:uppercase;border:1px solid var(--border);
  color:var(--text2);background:transparent;transition:all 0.15s}
.ds-btn:hover{border-color:var(--accent);color:var(--accent2)}
.ds-btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.ds-btn.primary:hover{background:var(--accent2)}
.ds-content{flex:1;overflow-y:auto;padding:18px}

/* ── TASKBAR ── */
.taskbar{height:44px;margin:0 14px 12px;background:var(--panel);border:1px solid var(--border);
  border-radius:100px;display:flex;align-items:center;padding:0 18px;gap:14px;flex-shrink:0}
.tb-item{font-size:10px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;
  cursor:pointer;transition:color 0.15s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.tb-item:hover{color:var(--accent2)}
.tb-item.active{color:var(--accent2)}
.tb-sep{width:1px;height:14px;background:var(--border);flex-shrink:0}
.tb-space{flex:1}
.tb-clock{font-size:11px;color:var(--text2)}
.tb-session{font-size:10px;color:var(--accent2);font-weight:500}

/* ── WIDGETS ── */
.widgets{width:214px;flex-shrink:0;display:flex;flex-direction:column;
  border-left:1px solid var(--border);overflow-y:auto;background:var(--panel)}
.widget{border-bottom:1px solid var(--border);padding:13px}
.w-label{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text3);
  margin-bottom:10px;font-family:var(--sans);font-weight:700}

/* TIMER */
.timer-big{font-family:var(--mono);font-size:28px;font-weight:500;color:var(--accent2);
  letter-spacing:2px;text-align:center;padding:6px 0;animation:glow 3s infinite}
.timer-status{font-size:9px;text-align:center;color:var(--green);letter-spacing:1.5px;text-transform:uppercase;margin-top:2px}
.timer-meta{font-size:10px;color:var(--text3);text-align:center;margin-top:5px}
.pomodoro-bar{height:3px;background:var(--panel2);border-radius:2px;margin-top:8px;overflow:hidden}
.pomodoro-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));
  border-radius:2px;transition:width 1s linear}
.pomo-label{font-size:9px;color:var(--text3);text-align:center;margin-top:4px;letter-spacing:1px;text-transform:uppercase}
.pomo-controls{display:flex;gap:6px;justify-content:center;margin-top:8px}
.pomo-btn{padding:4px 10px;border-radius:6px;font-size:10px;font-family:var(--sans);font-weight:700;
  border:1px solid var(--border);color:var(--text2);background:transparent;transition:all 0.15s}
.pomo-btn:hover{border-color:var(--accent);color:var(--accent2)}
.pomo-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}

/* CALENDAR */
.cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.cal-nav select{background:var(--panel2);border:1px solid var(--border);border-radius:5px;
  padding:3px 5px;color:var(--text);font-size:10px;outline:none;cursor:pointer}
.cal-nav-btn{background:none;border:none;color:var(--text2);font-size:14px;
  padding:2px 5px;border-radius:5px;transition:all 0.15s;line-height:1}
.cal-nav-btn:hover{background:var(--panel2);color:var(--text)}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px}
.cal-dow{font-size:8px;color:var(--text3);text-align:center;padding:2px 0;
  font-family:var(--sans);font-weight:700;letter-spacing:0.5px}
.cal-day{font-size:10px;text-align:center;padding:4px 1px;border-radius:4px;
  cursor:pointer;color:var(--text2);transition:all 0.15s;position:relative}
.cal-day:hover{background:var(--panel2);color:var(--text)}
.cal-day.today{background:var(--accent);color:#fff;font-weight:700;box-shadow:0 0 10px var(--glow)}
.cal-day.other{color:var(--text4);opacity:0.5}
.cal-day.logged::after{content:'';position:absolute;bottom:1px;left:50%;transform:translateX(-50%);
  width:3px;height:3px;border-radius:50%;background:var(--accent2)}

/* RECENTS */
.recent-item{display:flex;flex-direction:column;gap:2px;padding:7px 0;
  border-bottom:1px solid rgba(255,255,255,0.04)}
.recent-item:last-child{border-bottom:none}
.ri-action{font-size:11px;color:var(--text)}
.ri-time{font-size:10px;color:var(--text3)}
.ri-dur{font-size:10px;color:var(--accent2)}

/* ── VIEWS ── */
.section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;gap:12px;flex-wrap:wrap}
.section-title{font-family:var(--sans);font-size:18px;font-weight:800;color:var(--text);letter-spacing:-0.5px}
.section-sub{font-size:11px;color:var(--text3)}
.pill{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;
  background:var(--panel2);border:1px solid var(--border);font-size:11px;color:var(--text2)}
.actions{display:flex;gap:8px;flex-wrap:wrap}

/* PROJECTS */
.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:13px}
.project-card{background:var(--panel2);border:1px solid var(--border);border-radius:var(--r);
  padding:16px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden}
.project-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--accent),var(--accent2));opacity:0;transition:opacity 0.2s}
.project-card:hover{border-color:var(--accent);box-shadow:0 0 20px var(--glow);transform:translateY(-2px)}
.project-card:hover::before{opacity:1}
.pc-icon{font-size:26px;margin-bottom:8px}
.pc-name{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);margin-bottom:3px}
.pc-owner{font-size:10px;color:var(--text3);margin-bottom:8px}
.pc-progress{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.pc-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:2px;transition:width 0.5s}
.pc-stats{display:flex;justify-content:space-between;margin-top:8px;font-size:10px;color:var(--text3)}
.new-project-card{background:transparent;border:1px dashed var(--border2);border-radius:var(--r);
  padding:16px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;
  justify-content:center;flex-direction:column;gap:8px;min-height:120px;color:var(--text3)}
.new-project-card:hover{border-color:var(--accent);color:var(--accent2)}
.new-project-card .plus{font-size:28px;line-height:1}

/* KANBAN */
.kanban{display:flex;gap:14px;overflow-x:auto;padding-bottom:8px;min-height:400px}
.kanban::-webkit-scrollbar{height:4px}
.kb-col{min-width:220px;width:220px;flex-shrink:0}
.kb-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:0 2px}
.kb-title{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:0.5px}
.kb-count{font-size:10px;padding:2px 7px;border-radius:10px;background:var(--panel2);
  border:1px solid var(--border);color:var(--text3)}
.kb-cards{display:flex;flex-direction:column;gap:8px;min-height:60px}
.kb-card{background:var(--panel);border:1px solid var(--border);border-radius:10px;
  padding:12px;cursor:pointer;transition:all 0.2s}
.kb-card:hover{border-color:var(--accent2);box-shadow:0 0 12px var(--glow2);transform:translateY(-1px)}
.kb-card-title{font-size:12px;color:var(--text);margin-bottom:6px;font-weight:500}
.kb-card-meta{display:flex;align-items:center;justify-content:space-between;gap:6px}
.kb-card-tag{font-size:9px;padding:2px 6px;border-radius:4px;font-family:var(--sans);font-weight:700}
.kb-card-assignee{font-size:10px;color:var(--text3)}
.kb-add-card{margin-top:8px;padding:8px;border:1px dashed var(--border2);border-radius:8px;
  text-align:center;font-size:11px;color:var(--text3);cursor:pointer;transition:all 0.15s}
.kb-add-card:hover{border-color:var(--accent);color:var(--accent2)}

/* LOGS TABLE */
.log-table{width:100%;border-collapse:collapse;font-size:12px}
.log-table th{text-align:left;padding:8px 12px;font-size:9px;letter-spacing:1.5px;
  text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);
  font-family:var(--sans);font-weight:700}
.log-table td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.04);color:var(--text2)}
.log-table tr:hover td{background:var(--panel2)}
.log-table tr:last-child td{border-bottom:none}
.dur-badge{display:inline-flex;padding:3px 8px;border-radius:20px;
  background:rgba(124,58,237,0.12);color:var(--accent2);font-size:10px}
.active-badge{display:inline-flex;padding:3px 8px;border-radius:20px;
  background:rgba(16,185,129,0.1);color:var(--green);font-size:10px}

/* MONTHLY */
.month-summary{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
.sc{flex:1;min-width:100px;background:var(--panel2);border:1px solid var(--border);border-radius:var(--r);padding:14px}
.sc-lbl{font-size:9px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;font-family:var(--sans);font-weight:700}
.sc-val{font-family:var(--sans);font-size:26px;font-weight:800;color:var(--text)}
.sc-sub{font-size:10px;color:var(--text3);margin-top:2px}
.month-sel{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.month-sel select{background:var(--panel2);border:1px solid var(--border);border-radius:8px;
  padding:7px 10px;color:var(--text);font-size:12px;outline:none;cursor:pointer}
.month-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.mdc{background:var(--panel2);border:1px solid var(--border);border-radius:10px;padding:12px}
.mdc-date{font-size:9px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:5px}
.mdc-dur{font-family:var(--sans);font-size:20px;font-weight:800;color:var(--accent2)}
.mdc-sess{font-size:9px;color:var(--text3);margin-top:2px}

/* HEATMAP */
.heatmap{display:flex;gap:3px;margin-top:12px;overflow-x:auto;padding-bottom:4px}
.hm-col{display:flex;flex-direction:column;gap:3px}
.hm-cell{width:13px;height:13px;border-radius:2px;background:var(--panel2);transition:all 0.2s;cursor:pointer}
.hm-cell:hover{transform:scale(1.3);border-radius:3px}
.hm-cell.l1{background:rgba(124,58,237,0.25)}
.hm-cell.l2{background:rgba(124,58,237,0.5)}
.hm-cell.l3{background:rgba(124,58,237,0.75)}
.hm-cell.l4{background:var(--accent2);box-shadow:0 0 6px var(--glow)}

/* ANALYTICS */
.chart-wrap{background:var(--panel2);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:14px}
.chart-title{font-family:var(--sans);font-size:12px;font-weight:700;color:var(--text2);margin-bottom:14px;letter-spacing:0.5px;text-transform:uppercase}
.bar-chart{display:flex;align-items:flex-end;gap:8px;height:120px}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1}
.bar{width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,var(--accent2),var(--accent));
  transition:height 0.5s cubic-bezier(.34,1.56,.64,1);min-height:2px;cursor:pointer}
.bar:hover{filter:brightness(1.2)}
.bar-label{font-size:9px;color:var(--text3);white-space:nowrap}
.bar-val{font-size:9px;color:var(--accent2);font-weight:500}
.leaderboard{display:flex;flex-direction:column;gap:8px}
.lb-item{display:flex;align-items:center;gap:12px;padding:10px 14px;
  background:var(--panel2);border:1px solid var(--border);border-radius:10px}
.lb-rank{font-family:var(--sans);font-size:18px;font-weight:800;color:var(--text3);width:28px;flex-shrink:0}
.lb-rank.gold{color:#fbbf24}
.lb-rank.silver{color:#94a3b8}
.lb-rank.bronze{color:#d97706}
.lb-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-size:13px;font-weight:700;color:#fff}
.lb-name{flex:1;font-family:var(--sans);font-size:13px;font-weight:600;color:var(--text)}
.lb-hours{font-size:12px;color:var(--accent2)}
.lb-sessions{font-size:10px;color:var(--text3)}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:14px}

/* TEAM */
.team-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.member-card{background:var(--panel2);border:1px solid var(--border);border-radius:var(--r);
  padding:18px;text-align:center;transition:all 0.2s}
.member-card:hover{border-color:var(--accent2);transform:translateY(-2px)}
.mc-avatar{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-family:var(--sans);
  font-size:22px;font-weight:800;color:#fff;margin:0 auto 10px;box-shadow:0 0 16px var(--glow)}
.mc-name{font-family:var(--sans);font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.mc-role{font-size:10px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}
.mc-status{display:inline-flex;align-items:center;gap:5px;font-size:10px;padding:3px 9px;border-radius:20px}
.mc-status.online{background:rgba(16,185,129,0.1);color:var(--green)}
.mc-status.offline{background:var(--panel3);color:var(--text3)}
.mc-status-dot{width:5px;height:5px;border-radius:50%}
.mc-stats{display:flex;gap:10px;margin-top:12px;justify-content:center}
.mc-stat{text-align:center}
.mc-stat-val{font-family:var(--sans);font-size:16px;font-weight:800;color:var(--text)}
.mc-stat-lbl{font-size:9px;color:var(--text3);letter-spacing:1px;text-transform:uppercase}
.invite-form{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.invite-form input{flex:1;min-width:180px;background:var(--panel2);border:1px solid var(--border);
  border-radius:8px;padding:9px 12px;color:var(--text);font-size:12px;outline:none}
.invite-form input:focus{border-color:var(--accent)}

/* SETTINGS */
.settings-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.setting-card{background:var(--panel2);border:1px solid var(--border);border-radius:var(--r);padding:18px}
.setting-title{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px}
.setting-desc{font-size:11px;color:var(--text3);margin-bottom:14px;line-height:1.5}
.toggle{display:flex;align-items:center;justify-content:space-between}
.toggle-sw{width:38px;height:21px;border-radius:11px;background:var(--border2);
  position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0}
.toggle-sw.on{background:var(--accent)}
.toggle-sw::after{content:'';position:absolute;width:15px;height:15px;border-radius:50%;
  background:#fff;top:3px;left:3px;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.3)}
.toggle-sw.on::after{transform:translateX(17px)}
.shortcut-list{display:flex;flex-direction:column;gap:8px}
.shortcut-item{display:flex;align-items:center;justify-content:space-between;
  padding:8px 0;border-bottom:1px solid var(--border)}
.shortcut-item:last-child{border-bottom:none}
.sk-label{font-size:12px;color:var(--text2)}
.sk-keys{display:flex;gap:4px}
.key{padding:2px 7px;border-radius:4px;background:var(--panel3);border:1px solid var(--border2);
  font-size:10px;color:var(--text);font-family:var(--mono)}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);
  display:flex;align-items:center;justify-content:center;z-index:1000;
  animation:fadeIn 0.2s ease;backdrop-filter:blur(4px)}
.modal{background:var(--panel);border:1px solid var(--border2);border-radius:16px;
  padding:28px;width:440px;max-width:90vw;box-shadow:var(--shadow2);animation:fadeUp 0.25s ease}
.modal-title{font-family:var(--sans);font-size:18px;font-weight:800;color:var(--text);margin-bottom:18px}
.modal-field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.modal-field label{font-size:10px;color:var(--text2);letter-spacing:1.5px;text-transform:uppercase}
.modal-field input,.modal-field select,.modal-field textarea{
  background:var(--panel2);border:1px solid var(--border);border-radius:8px;
  padding:10px 12px;color:var(--text);font-size:12px;outline:none;transition:border 0.2s}
.modal-field input:focus,.modal-field select:focus,.modal-field textarea:focus{border-color:var(--accent)}
.modal-field textarea{resize:vertical;min-height:80px;line-height:1.5}
.modal-field select option{background:var(--panel2)}
.modal-actions{display:flex;gap:9px;justify-content:flex-end;margin-top:20px}
.modal-btn{padding:9px 18px;border-radius:8px;font-size:12px;font-family:var(--sans);font-weight:700;
  letter-spacing:0.5px;text-transform:uppercase;border:1px solid var(--border);
  color:var(--text2);background:transparent;transition:all 0.15s}
.modal-btn:hover{background:var(--panel2)}
.modal-btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.modal-btn.primary:hover{background:var(--accent2)}
.modal-btn.danger{background:rgba(239,68,68,0.1);color:#f87171;border-color:rgba(239,68,68,0.2)}

/* NOTIFICATIONS PANEL */
.notif-panel{position:fixed;top:58px;right:16px;width:320px;background:var(--panel);
  border:1px solid var(--border2);border-radius:var(--r);box-shadow:var(--shadow2);
  z-index:500;animation:fadeUp 0.2s ease;overflow:hidden}
.np-header{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;
  align-items:center;justify-content:space-between}
.np-title{font-family:var(--sans);font-size:13px;font-weight:700;color:var(--text)}
.np-clear{font-size:11px;color:var(--accent2);cursor:pointer;transition:opacity 0.15s}
.np-clear:hover{opacity:0.7}
.np-list{max-height:320px;overflow-y:auto}
.np-item{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:10px;
  align-items:flex-start;transition:background 0.15s}
.np-item:hover{background:var(--panel2)}
.np-item:last-child{border-bottom:none}
.np-icon{font-size:18px;flex-shrink:0;margin-top:1px}
.np-text{flex:1}
.np-msg{font-size:12px;color:var(--text);margin-bottom:2px;line-height:1.4}
.np-time{font-size:10px;color:var(--text3)}
.np-empty{padding:24px;text-align:center;color:var(--text3);font-size:12px}

/* COMMENTS */
.comment-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
.comment-item{display:flex;gap:10px}
.c-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-family:var(--sans);
  font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.c-body{flex:1;background:var(--panel2);border:1px solid var(--border);border-radius:10px;padding:10px 12px}
.c-meta{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.c-name{font-family:var(--sans);font-size:12px;font-weight:700;color:var(--text)}
.c-time{font-size:10px;color:var(--text3)}
.c-text{font-size:12px;color:var(--text2);line-height:1.5}
.c-input-row{display:flex;gap:8px}
.c-input{flex:1;background:var(--panel2);border:1px solid var(--border);border-radius:8px;
  padding:9px 12px;color:var(--text);font-size:12px;outline:none;resize:none}
.c-input:focus{border-color:var(--accent)}

/* TOAST */
.toast-container{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;
  gap:8px;z-index:2000;pointer-events:none}
.toast{display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--panel);
  border:1px solid var(--border2);border-radius:10px;box-shadow:var(--shadow2);
  animation:toastIn 0.3s ease;min-width:240px;pointer-events:all}
.toast-icon{font-size:16px;flex-shrink:0}
.toast-msg{font-size:12px;color:var(--text);flex:1}
.toast.success{border-left:3px solid var(--green)}
.toast.info{border-left:3px solid var(--blue)}
.toast.warning{border-left:3px solid var(--yellow)}
.toast.error{border-left:3px solid var(--red)}

/* EMPTY */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:40px 20px;gap:10px;color:var(--text3);text-align:center}
.empty-icon{font-size:40px;opacity:0.3}
.empty-msg{font-size:13px}

/* CMD PALETTE */
.cmd-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);
  display:flex;align-items:flex-start;justify-content:center;z-index:2000;
  padding-top:120px;animation:fadeIn 0.15s ease;backdrop-filter:blur(4px)}
.cmd-box{width:500px;max-width:90vw;background:var(--panel);border:1px solid var(--border2);
  border-radius:14px;box-shadow:var(--shadow2);overflow:hidden;animation:fadeUp 0.2s ease}
.cmd-input-wrap{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--border)}
.cmd-icon{font-size:16px;color:var(--text3)}
.cmd-input{flex:1;background:transparent;border:none;outline:none;font-size:14px;color:var(--text);font-family:var(--mono)}
.cmd-input::placeholder{color:var(--text3)}
.cmd-list{max-height:320px;overflow-y:auto;padding:6px}
.cmd-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;
  cursor:pointer;transition:background 0.1s}
.cmd-item:hover,.cmd-item.focused{background:rgba(124,58,237,0.12)}
.cmd-item-icon{font-size:16px;flex-shrink:0}
.cmd-item-text{flex:1;font-size:13px;color:var(--text)}
.cmd-item-shortcut{font-size:10px;color:var(--text3)}
.cmd-group{font-size:9px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;
  padding:8px 12px 4px;font-family:var(--sans);font-weight:700}

/* PROFILE */
.profile-header{display:flex;align-items:center;gap:18px;margin-bottom:24px;
  padding:20px;background:var(--panel2);border:1px solid var(--border);border-radius:var(--r)}
.ph-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-family:var(--sans);
  font-size:28px;font-weight:800;color:#fff;box-shadow:0 0 20px var(--glow);flex-shrink:0}
.ph-name{font-family:var(--sans);font-size:22px;font-weight:800;color:var(--text)}
.ph-role{font-size:11px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-top:2px}
.ph-email{font-size:12px;color:var(--text2);margin-top:4px}

/* EXPORT BTN */
.export-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;
  background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:var(--green);
  font-size:11px;font-family:var(--sans);font-weight:700;letter-spacing:0.5px;text-transform:uppercase;transition:all 0.15s}
.export-btn:hover{background:rgba(16,185,129,0.2)}
`;

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
═══════════════════════════════════════════════════════════ */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const PRIORITY_COLORS = { high: "tag-high", medium: "tag-med", low: "tag-low", new: "tag-new" };

const DEMO_USERS = [
  { id: "u1", username: "admin", password: "admin123", role: "Owner", email: "admin@workspace.app" },
  { id: "u2", username: "priya", password: "priya123", role: "Manager", email: "priya@workspace.app" },
  { id: "u3", username: "team", password: "team123", role: "Member", email: "team@workspace.app" },
];

const DEMO_PROJECTS = [
  { id: "p1", name: "Workspace App", icon: "🚀", owner: "admin", tasks: 12, done: 7, desc: "Main product development" },
  { id: "p2", name: "Marketing Site", icon: "🌐", owner: "priya", tasks: 8, done: 3, desc: "Landing page redesign" },
  { id: "p3", name: "Mobile App", icon: "📱", owner: "admin", tasks: 20, done: 11, desc: "iOS & Android release" },
  { id: "p4", name: "Analytics", icon: "📊", owner: "priya", tasks: 6, done: 6, desc: "Data pipeline & dashboards" },
];

const DEMO_TASKS = [
  { id: "t1", title: "Design System Tokens", detail: "UI", done: false, priority: "high", project: "p1", assignee: "admin", comments: [] },
  { id: "t2", title: "API Integration", detail: "BE", done: false, priority: "high", project: "p1", assignee: "priya", comments: [] },
  { id: "t3", title: "User Testing Round 2", detail: "UX", done: true, priority: "medium", project: "p2", assignee: "team", comments: [] },
  { id: "t4", title: "Deploy v1.0", detail: "OPS", done: false, priority: "high", project: "p1", assignee: "admin", comments: [] },
  { id: "t5", title: "Write Documentation", detail: "DOC", done: false, priority: "low", project: "p2", assignee: "team", comments: [] },
  { id: "t6", title: "Push notifications", detail: "FE", done: false, priority: "medium", project: "p3", assignee: "priya", comments: [] },
];

const KANBAN_COLS = ["todo", "inprogress", "review", "done"];
const KANBAN_LABELS = { todo: "To Do", inprogress: "In Progress", review: "In Review", done: "Done" };
const KANBAN_COLORS = { todo: "var(--text3)", inprogress: "var(--blue)", review: "var(--yellow)", done: "var(--green)" };

function sto(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
function sav(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

function fmtSecs(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}
function fmtTime(d) { return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(d) { return new Date(d).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }); }
function fmtDateShort(d) { return new Date(d).toLocaleDateString([], { month: "short", day: "numeric" }); }
function secsToDur(s) {
  if (!s || s < 0) return "—";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function getInitial(name) { return name ? name[0].toUpperCase() : "?"; }

/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function ToastContainer({ toasts }) {
  const icons = { success: "✅", info: "ℹ️", warning: "⚠️", error: "❌" };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">{icons[t.type] || "💬"}</span>
          <span className="toast-msg">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CALENDAR WIDGET
═══════════════════════════════════════════════════════════ */
function CalWidget({ logs }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const logDates = new Set(logs.map(l => new Date(l.loginAt).toDateString()));
  const first = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const prev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prev - i, other: true });
  for (let d = 1; d <= dim; d++) cells.push({ day: d, other: false });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - first - dim + 1, other: true });
  const years = Array.from({ length: 8 }, (_, i) => now.getFullYear() - 2 + i);
  function prevM() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextM() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }
  return (
    <div className="widget">
      <div className="w-label">Calendar</div>
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={prevM}>‹</button>
        <select value={month} onChange={e => setMonth(+e.target.value)}>
          {MONTHS.map((m, i) => <option key={i} value={i}>{m.slice(0, 3)}</option>)}
        </select>
        <select value={year} onChange={e => setYear(+e.target.value)}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="cal-nav-btn" onClick={nextM}>›</button>
      </div>
      <div className="cal-grid">
        {DAYS_SHORT.map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((c, i) => {
          const isToday = !c.other && c.day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          const ds = new Date(year, month, c.day).toDateString();
          return (
            <div key={i} className={`cal-day${isToday ? " today" : ""}${c.other ? " other" : ""}${!c.other && logDates.has(ds) ? " logged" : ""}`}>
              {c.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEATMAP
═══════════════════════════════════════════════════════════ */
function Heatmap({ logs }) {
  const now = new Date();
  const weeks = 16;
  const cells = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - w * 7 - d);
      const ds = date.toDateString();
      const secs = logs.filter(l => new Date(l.loginAt).toDateString() === ds).reduce((a, l) => a + (l.duration || 0), 0);
      let level = "";
      if (secs > 0) level = secs > 14400 ? "l4" : secs > 7200 ? "l3" : secs > 3600 ? "l2" : "l1";
      col.push({ date: ds, secs, level });
    }
    cells.push(col);
  }
  return (
    <div>
      <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px" }}>Activity — last {weeks} weeks</div>
      <div className="heatmap">
        {cells.map((col, i) => (
          <div key={i} className="hm-col">
            {col.map((c, j) => (
              <div key={j} className={`hm-cell ${c.level}`} title={`${c.date}: ${secsToDur(c.secs)}`}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BAR CHART
═══════════════════════════════════════════════════════════ */
function BarChart({ logs }) {
  const now = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const ds = d.toDateString();
    const secs = logs.filter(l => new Date(l.loginAt).toDateString() === ds).reduce((a, l) => a + (l.duration || 0), 0);
    days.push({ label: d.toLocaleDateString([], { weekday: "short" }), secs, hours: +(secs / 3600).toFixed(1) });
  }
  const max = Math.max(...days.map(d => d.secs), 1);
  return (
    <div className="chart-wrap">
      <div className="chart-title">Daily Hours — Last 7 Days</div>
      <div className="bar-chart">
        {days.map((d, i) => (
          <div key={i} className="bar-col">
            <div className="bar-val">{d.hours > 0 ? d.hours : "—"}</div>
            <div className="bar" style={{ height: `${Math.max((d.secs / max) * 90, d.secs > 0 ? 4 : 2)}px` }} title={`${d.label}: ${secsToDur(d.secs)}`}></div>
            <div className="bar-label">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEADERBOARD
═══════════════════════════════════════════════════════════ */
function Leaderboard({ logs }) {
  const now = new Date();
  const thisMonth = logs.filter(l => { const d = new Date(l.loginAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const byUser = {};
  thisMonth.forEach(l => { if (!byUser[l.username]) byUser[l.username] = { secs: 0, sessions: 0 }; byUser[l.username].secs += l.duration || 0; byUser[l.username].sessions += 1; });
  const ranked = Object.entries(byUser).sort((a, b) => b[1].secs - a[1].secs);
  const medals = ["🥇", "🥈", "🥉"];
  const medalClass = ["gold", "silver", "bronze"];
  if (!ranked.length) return <div className="empty"><div className="empty-icon">🏆</div><div className="empty-msg">No data this month yet</div></div>;
  return (
    <div>
      <div style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "var(--sans)", fontWeight: "700" }}>This Month's Leaderboard</div>
      <div className="leaderboard">
        {ranked.map(([username, data], i) => (
          <div key={username} className="lb-item">
            <div className={`lb-rank ${medalClass[i] || ""}`}>{medals[i] || `#${i + 1}`}</div>
            <div className="lb-avatar">{getInitial(username)}</div>
            <div style={{ flex: 1 }}>
              <div className="lb-name">{username}</div>
              <div className="lb-sessions">{data.sessions} sessions</div>
            </div>
            <div className="lb-hours">{secsToDur(data.secs)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════ */
function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div className="modal-title">{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CMD PALETTE
═══════════════════════════════════════════════════════════ */
function CmdPalette({ onClose, onNavigate }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(0);
  const commands = [
    {
      group: "Navigate", items: [
        { icon: "🚀", text: "Projects", action: () => onNavigate("projects") },
        { icon: "🗂️", text: "Kanban Board", action: () => onNavigate("kanban") },
        { icon: "📋", text: "Activity Logs", action: () => onNavigate("logs") },
        { icon: "📅", text: "Monthly Report", action: () => onNavigate("monthly") },
        { icon: "📊", text: "Analytics", action: () => onNavigate("analytics") },
        { icon: "👥", text: "Team", action: () => onNavigate("team") },
        { icon: "⚙️", text: "Settings", action: () => onNavigate("settings") },
      ]
    },
  ];
  const filtered = commands.map(g => ({ ...g, items: g.items.filter(i => !q || i.text.toLowerCase().includes(q.toLowerCase())) })).filter(g => g.items.length);
  const allItems = filtered.flatMap(g => g.items);
  function handleKey(e) {
    if (e.key === "ArrowDown") setFocused(f => Math.min(f + 1, allItems.length - 1));
    else if (e.key === "ArrowUp") setFocused(f => Math.max(f - 1, 0));
    else if (e.key === "Enter") { allItems[focused]?.action(); onClose(); }
    else if (e.key === "Escape") onClose();
  }
  return (
    <div className="cmd-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmd-box">
        <div className="cmd-input-wrap">
          <span className="cmd-icon">⌘</span>
          <input className="cmd-input" placeholder="Type a command or search..." autoFocus value={q} onChange={e => setQ(e.target.value)} onKeyDown={handleKey} />
          <span style={{ fontSize: "10px", color: "var(--text3)" }}>ESC</span>
        </div>
        <div className="cmd-list">
          {filtered.map(g => (
            <div key={g.group}>
              <div className="cmd-group">{g.group}</div>
              {g.items.map((item, i) => {
                const idx = allItems.indexOf(item);
                return (
                  <div key={i} className={`cmd-item${idx === focused ? " focused" : ""}`} onClick={() => { item.action(); onClose(); }} onMouseEnter={() => setFocused(idx)}>
                    <span className="cmd-item-icon">{item.icon}</span>
                    <span className="cmd-item-text">{item.text}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {!allItems.length && <div className="cmd-group" style={{ padding: "20px", textAlign: "center" }}>No results</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VIEWS
═══════════════════════════════════════════════════════════ */
function ProjectsView({ projects, onNew, onSelect }) {
  return (
    <div className="fade-up">
      <div className="section-hdr">
        <div><div className="section-title">Projects</div><div className="section-sub">{projects.length} active projects</div></div>
        <div className="actions">
          <button className="ds-btn primary" onClick={onNew}>+ New Project</button>
        </div>
      </div>
      <div className="project-grid">
        {projects.map(p => (
          <div key={p.id} className="project-card" onClick={() => onSelect(p)}>
            <div className="pc-icon">{p.icon}</div>
            <div className="pc-name">{p.name}</div>
            <div className="pc-owner">by {p.owner}</div>
            <div className="pc-progress"><div className="pc-fill" style={{ width: `${p.tasks ? (p.done / p.tasks * 100) : 0}%` }}></div></div>
            <div className="pc-stats"><span>{p.done}/{p.tasks} tasks</span><span>{p.tasks ? Math.round(p.done / p.tasks * 100) : 0}%</span></div>
          </div>
        ))}
        <div className="new-project-card" onClick={onNew}>
          <div className="plus">＋</div>
          <div style={{ fontSize: "12px" }}>New Project</div>
        </div>
      </div>
    </div>
  );
}

function KanbanView({ tasks, user, onTaskUpdate, showToast }) {
  const cols = { todo: [], inprogress: [], review: [], done: [] };
  tasks.forEach(t => { const s = t.status || "todo"; if (cols[s]) cols[s].push(t); });
  function moveCard(task, newStatus) {
    onTaskUpdate({ ...task, status: newStatus });
    showToast(`Moved "${task.title}" to ${KANBAN_LABELS[newStatus]}`, "info");
  }
  return (
    <div className="fade-up">
      <div className="section-hdr">
        <div><div className="section-title">Kanban Board</div><div className="section-sub">{tasks.length} tasks across {KANBAN_COLS.length} columns</div></div>
      </div>
      <div className="kanban">
        {KANBAN_COLS.map(col => (
          <div key={col} className="kb-col">
            <div className="kb-head">
              <span className="kb-title" style={{ color: KANBAN_COLORS[col] }}>{KANBAN_LABELS[col]}</span>
              <span className="kb-count">{cols[col].length}</span>
            </div>
            <div className="kb-cards">
              {cols[col].map(t => (
                <div key={t.id} className="kb-card">
                  <div className="kb-card-title">{t.title}</div>
                  <div className="kb-card-meta">
                    <span className={`kb-card-tag ${PRIORITY_COLORS[t.priority] || "tag-new"}`}>{t.priority || "new"}</span>
                    <span className="kb-card-assignee">@{t.assignee || "unassigned"}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                    {KANBAN_COLS.filter(c => c !== col).map(c => (
                      <button key={c} className="ds-btn" style={{ fontSize: "9px", padding: "3px 7px" }} onClick={() => moveCard(t, c)}>→{KANBAN_LABELS[c]}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="kb-add-card">+ Add card</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogsView({ logs }) {
  const sorted = [...logs].sort((a, b) => b.loginAt - a.loginAt);
  function exportCSV() {
    const rows = [["Date", "Username", "Login", "Logout", "Duration"], ...sorted.map(l => [fmtDate(l.loginAt), l.username, fmtTime(l.loginAt), l.logoutAt ? fmtTime(l.logoutAt) : "Active", secsToDur(l.duration)])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "activity_logs.csv"; a.click();
  }
  return (
    <div className="fade-up">
      <div className="section-hdr">
        <div><div className="section-title">Activity Log</div><div className="section-sub">{logs.length} total sessions</div></div>
        <button className="export-btn" onClick={exportCSV}>⬇ Export CSV</button>
      </div>
      {!sorted.length ? <div className="empty"><div className="empty-icon">📋</div><div className="empty-msg">No activity recorded yet</div></div> : (
        <table className="log-table">
          <thead><tr><th>Date</th><th>User</th><th>Login</th><th>Logout</th><th>Duration</th></tr></thead>
          <tbody>
            {sorted.map((l, i) => (
              <tr key={i}>
                <td>{fmtDate(l.loginAt)}</td>
                <td><span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#fff" }}>{getInitial(l.username)}</span>{l.username}</span></td>
                <td>{fmtTime(l.loginAt)}</td>
                <td>{l.logoutAt ? fmtTime(l.logoutAt) : <span className="active-badge">● Active</span>}</td>
                <td><span className="dur-badge">{secsToDur(l.duration)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function MonthlyView({ logs }) {
  const now = new Date();
  const [sel, setSel] = useState(`${now.getFullYear()}-${now.getMonth()}`);
  const [sy, sm] = sel.split("-").map(Number);
  const filtered = logs.filter(l => { const d = new Date(l.loginAt); return d.getFullYear() === sy && d.getMonth() === sm; });
  const totalSecs = filtered.reduce((a, l) => a + (l.duration || 0), 0);
  const byDay = {};
  filtered.forEach(l => { const k = new Date(l.loginAt).toDateString(); if (!byDay[k]) byDay[k] = { secs: 0, sessions: 0 }; byDay[k].secs += l.duration || 0; byDay[k].sessions += 1; });
  const options = [];
  for (let y = now.getFullYear() - 1; y <= now.getFullYear(); y++) for (let m = 0; m < 12; m++) options.push({ val: `${y}-${m}`, label: `${MONTHS[m]} ${y}` });
  function exportCSV() {
    const rows = [["Date", "Sessions", "Total Duration"], ...Object.entries(byDay).map(([d, v]) => [d, v.sessions, secsToDur(v.secs)])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "monthly_report.csv"; a.click();
  }
  return (
    <div className="fade-up">
      <div className="section-hdr">
        <div><div className="section-title">Monthly Report</div></div>
        <div className="actions">
          <div className="month-sel"><select value={sel} onChange={e => setSel(e.target.value)}>{options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}</select></div>
          <button className="export-btn" onClick={exportCSV}>⬇ Export CSV</button>
        </div>
      </div>
      <div className="month-summary">
        <div className="sc"><div className="sc-lbl">Total Hours</div><div className="sc-val">{(totalSecs / 3600).toFixed(1)}</div><div className="sc-sub">hrs this month</div></div>
        <div className="sc"><div className="sc-lbl">Sessions</div><div className="sc-val">{filtered.length}</div><div className="sc-sub">login sessions</div></div>
        <div className="sc"><div className="sc-lbl">Active Days</div><div className="sc-val">{Object.keys(byDay).length}</div><div className="sc-sub">unique days</div></div>
        <div className="sc"><div className="sc-lbl">Avg/Session</div><div className="sc-val">{filtered.length ? Math.round(totalSecs / filtered.length / 60) : 0}</div><div className="sc-sub">minutes avg</div></div>
      </div>
      {!Object.keys(byDay).length ? <div className="empty"><div className="empty-icon">📭</div><div className="empty-msg">No activity this month</div></div> : (
        <div className="month-grid">
          {Object.entries(byDay).sort(([a], [b]) => new Date(a) - new Date(b)).map(([date, data]) => (
            <div key={date} className="mdc">
              <div className="mdc-date">{new Date(date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</div>
              <div className="mdc-dur">{secsToDur(data.secs)}</div>
              <div className="mdc-sess">{data.sessions} session{data.sessions > 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ logs }) {
  return (
    <div className="fade-up">
      <div className="section-hdr"><div className="section-title">Analytics</div></div>
      <BarChart logs={logs} />
      <div className="chart-wrap"><Heatmap logs={logs} /></div>
      <Leaderboard logs={logs} />
    </div>
  );
}

function TeamView({ onlineUsers, showToast }) {
  const [invite, setInvite] = useState("");
  const allUsers = DEMO_USERS.map(u => ({ ...u, online: onlineUsers.includes(u.username) }));
  const [users, setUsers] = useState(allUsers);
  function sendInvite() {
    if (!invite.trim() || !invite.includes("@")) return showToast("Enter a valid email", "warning");
    showToast(`Invite sent to ${invite}`, "success");
    setInvite("");
  }
  return (
    <div className="fade-up">
      <div className="section-hdr">
        <div><div className="section-title">Team</div><div className="section-sub">{users.length} members</div></div>
      </div>
      <div style={{ background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "16px", marginBottom: "18px" }}>
        <div style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "10px", fontFamily: "var(--sans)", fontWeight: "700" }}>Invite Member</div>
        <div className="invite-form">
          <input placeholder="colleague@example.com" value={invite} onChange={e => setInvite(e.target.value)} onKeyDown={e => e.key === "Enter" && sendInvite()} />
          <select style={{ background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px 10px", color: "var(--text)", fontSize: "12px", outline: "none" }}>
            <option>Member</option><option>Manager</option><option>Owner</option>
          </select>
          <button className="ds-btn primary" onClick={sendInvite}>Send Invite</button>
        </div>
      </div>
      <div className="team-grid">
        {users.map(u => (
          <div key={u.id} className="member-card">
            <div className="mc-avatar">{getInitial(u.username)}</div>
            <div className="mc-name">{u.username}</div>
            <div className="mc-role">{u.role}</div>
            <div className={`mc-status ${u.online ? "online" : "offline"}`}>
              <div className="mc-status-dot" style={{ background: u.online ? "var(--green)" : "var(--text3)" }}></div>
              {u.online ? "Online" : "Offline"}
            </div>
            <div className="mc-stats">
              <div className="mc-stat"><div className="mc-stat-val">{u.role === "Owner" ? "∞" : u.role === "Manager" ? "12" : "6"}</div><div className="mc-stat-lbl">Projects</div></div>
              <div className="mc-stat"><div className="mc-stat-val">{u.role === "Owner" ? "42" : u.role === "Manager" ? "28" : "15"}</div><div className="mc-stat-lbl">Tasks</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ theme, setTheme, pomodoroMode, setPomodoroMode, showToast }) {
  const [notifs, setNotifs] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [compact, setCompact] = useState(false);
  const shortcuts = [
    { label: "Command Palette", keys: ["⌘", "K"] },
    { label: "New Task", keys: ["N"] },
    { label: "Activity Log", keys: ["L"] },
    { label: "Projects", keys: ["P"] },
    { label: "Analytics", keys: ["A"] },
  ];
  return (
    <div className="fade-up">
      <div className="section-hdr"><div className="section-title">Settings</div></div>
      <div className="settings-grid">
        <div className="setting-card">
          <div className="setting-title">Theme</div>
          <div className="setting-desc">Switch between dark and light mode for your workspace.</div>
          <div className="toggle">
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
            <div className={`toggle-sw ${theme === "light" ? "on" : ""}`} onClick={() => { setTheme(t => t === "light" ? "dark" : "light"); showToast("Theme updated", "info"); }}></div>
          </div>
        </div>
        <div className="setting-card">
          <div className="setting-title">Pomodoro Timer</div>
          <div className="setting-desc">Enable Pomodoro mode: 25-min work, 5-min break cycles.</div>
          <div className="toggle">
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{pomodoroMode ? "Enabled" : "Disabled"}</span>
            <div className={`toggle-sw ${pomodoroMode ? "on" : ""}`} onClick={() => { setPomodoroMode(m => !m); showToast("Pomodoro mode updated", "info"); }}></div>
          </div>
        </div>
        <div className="setting-card">
          <div className="setting-title">Notifications</div>
          <div className="setting-desc">Receive in-app alerts for task assignments and deadlines.</div>
          <div className="toggle">
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{notifs ? "Enabled" : "Disabled"}</span>
            <div className={`toggle-sw ${notifs ? "on" : ""}`} onClick={() => { setNotifs(n => !n); showToast("Notifications updated", "info"); }}></div>
          </div>
        </div>
        <div className="setting-card">
          <div className="setting-title">Sound Effects</div>
          <div className="setting-desc">Play sounds on timer events and task completions.</div>
          <div className="toggle">
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{sounds ? "Enabled" : "Disabled"}</span>
            <div className={`toggle-sw ${sounds ? "on" : ""}`} onClick={() => { setSounds(s => !s); showToast("Sound settings updated", "info"); }}></div>
          </div>
        </div>
        <div className="setting-card">
          <div className="setting-title">Compact Mode</div>
          <div className="setting-desc">Reduce spacing and padding for a denser layout.</div>
          <div className="toggle">
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{compact ? "Enabled" : "Disabled"}</span>
            <div className={`toggle-sw ${compact ? "on" : ""}`} onClick={() => { setCompact(c => !c); showToast("Layout updated", "info"); }}></div>
          </div>
        </div>
        <div className="setting-card" style={{ gridColumn: "span 1" }}>
          <div className="setting-title">Keyboard Shortcuts</div>
          <div className="setting-desc" style={{ marginBottom: "10px" }}>Quick navigation shortcuts.</div>
          <div className="shortcut-list">
            {shortcuts.map((s, i) => (
              <div key={i} className="shortcut-item">
                <span className="sk-label">{s.label}</span>
                <div className="sk-keys">{s.keys.map((k, j) => <span key={j} className="key">{k}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "18px", padding: "16px", background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: "var(--r)" }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: "13px", fontWeight: "700", color: "var(--text)", marginBottom: "6px" }}>Database Integration</div>
        <div style={{ fontSize: "12px", color: "var(--text2)", lineHeight: "1.6", marginBottom: "12px" }}>
          Currently using <span style={{ color: "var(--accent2)" }}>localStorage</span> for persistence. To connect Supabase: add your project URL and anon key below.
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input placeholder="https://xxx.supabase.co" style={{ flex: "2", minWidth: "200px", background: "var(--panel3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px 12px", color: "var(--text)", fontSize: "12px", outline: "none" }} />
          <input placeholder="Anon key..." style={{ flex: "3", minWidth: "200px", background: "var(--panel3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px 12px", color: "var(--text)", fontSize: "12px", outline: "none" }} />
          <button className="ds-btn primary" onClick={() => showToast("Supabase connection saved!", "success")}>Connect</button>
        </div>
      </div>
    </div>
  );
}

function ProfileView({ user, logs }) {
  const userLogs = logs.filter(l => l.username === user.username);
  const totalSecs = userLogs.reduce((a, l) => a + (l.duration || 0), 0);
  return (
    <div className="fade-up">
      <div className="section-hdr"><div className="section-title">Profile</div></div>
      <div className="profile-header">
        <div className="ph-avatar">{getInitial(user.username)}</div>
        <div>
          <div className="ph-name">{user.username}</div>
          <div className="ph-role">{user.role}</div>
          <div className="ph-email">{user.email}</div>
        </div>
      </div>
      <div className="month-summary">
        <div className="sc"><div className="sc-lbl">Total Sessions</div><div className="sc-val">{userLogs.length}</div></div>
        <div className="sc"><div className="sc-lbl">Total Hours</div><div className="sc-val">{(totalSecs / 3600).toFixed(1)}</div></div>
        <div className="sc"><div className="sc-lbl">Avg Session</div><div className="sc-val">{userLogs.length ? Math.round(totalSecs / userLogs.length / 60) : 0}m</div></div>
      </div>
      <Heatmap logs={userLogs} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  function handle() {
    const found = DEMO_USERS.find(x => x.username === u && x.password === p);
    if (!found) { setErr("Invalid credentials"); return; }
    onLogin(found);
  }
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-orb">⚡</div>
          <span className="brand-name">WorkSpace</span>
        </div>
        <div className="login-tagline">Team Productivity Platform</div>
        <div className="lf"><label>Username</label><input value={u} onChange={e => setU(e.target.value)} placeholder="admin / priya / team" onKeyDown={e => e.key === "Enter" && handle()} /></div>
        <div className="lf"><label>Password</label><input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Password" onKeyDown={e => e.key === "Enter" && handle()} /></div>
        {err && <div className="login-err">⚠️ {err}</div>}
        <button className="login-btn" onClick={handle}>Sign In — Start Session</button>
        <div className="login-divider">credentials</div>
        <div className="login-hint"><span>admin</span>/admin123 · <span>priya</span>/priya123 · <span>team</span>/team123</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(null);
  const [sessionStart, setSessionStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState(() => sto("ws_logs") || []);
  const [tasks, setTasks] = useState(() => sto("ws_tasks") || DEMO_TASKS.map(t => ({ ...t, status: "todo" })));
  const [projects, setProjects] = useState(() => sto("ws_projects") || DEMO_PROJECTS);
  const [view, setView] = useState("projects");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [clock, setClock] = useState(new Date());
  const [theme, setTheme] = useState("dark");
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomoPhase, setPomoPhase] = useState("work");
  const [pomoSecs, setPomoSecs] = useState(25 * 60);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, icon: "🚀", msg: "Workspace App — new task assigned to you", time: Date.now() - 300000 },
    { id: 2, icon: "✅", msg: "Analytics project marked complete", time: Date.now() - 600000 },
    { id: 3, icon: "👥", msg: "priya joined the team", time: Date.now() - 900000 },
  ]);
  const [modal, setModal] = useState(null);
  const timerRef = useRef(null);
  const sessionIdRef = useRef(null);
  const pomoRef = useRef(null);

  // clock
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(c => !c); }
      if (!e.metaKey && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        if (e.key === "p") setView("projects");
        if (e.key === "l") setView("logs");
        if (e.key === "a") setView("analytics");
        if (e.key === "k" && !e.metaKey) setView("kanban");
        if (e.key === "Escape") { setCmdOpen(false); setNotifOpen(false); setModal(null); }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // pomodoro
  useEffect(() => {
    if (!pomodoroMode || !user) { clearInterval(pomoRef.current); return; }
    pomoRef.current = setInterval(() => {
      setPomoSecs(s => {
        if (s <= 1) {
          const next = pomoPhase === "work" ? "break" : "work";
          setPomoPhase(next);
          showToast(`Pomodoro: ${next === "break" ? "Break time! 🌿" : "Back to work! ⚡"}`, "info");
          return next === "break" ? 5 * 60 : 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(pomoRef.current);
  }, [pomodoroMode, pomoPhase, user]);

  function showToast(msg, type = "info") {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  function addNotif(msg, icon = "🔔") {
    setNotifications(n => [{ id: Date.now(), icon, msg, time: Date.now() }, ...n]);
  }

  function handleLogin(u) {
    const now = Date.now();
    setUser(u);
    setSessionStart(now);
    setElapsed(0);
    sessionIdRef.current = now;
    const newLog = { id: now, username: u.username, loginAt: now, logoutAt: null, duration: null };
    const updated = [...(sto("ws_logs") || []), newLog];
    sav("ws_logs", updated); setLogs(updated);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    showToast(`Welcome back, ${u.username}! Session started.`, "success");
  }

  function handleLogout() {
    clearInterval(timerRef.current); clearInterval(pomoRef.current);
    const now = Date.now();
    const duration = Math.floor((now - sessionStart) / 1000);
    const updated = (sto("ws_logs") || []).map(l => l.id === sessionIdRef.current ? { ...l, logoutAt: now, duration } : l);
    sav("ws_logs", updated); setLogs(updated);
    showToast(`Session ended. Duration: ${secsToDur(duration)}`, "info");
    setTimeout(() => { setUser(null); setElapsed(0); setSessionStart(null); }, 400);
  }

  function toggleTask(id) {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    sav("ws_tasks", updated); setTasks(updated);
    const t = tasks.find(t => t.id === id);
    if (!t.done) showToast(`Task "${t.title}" completed ✓`, "success");
  }

  function addTask() {
    if (!newTask.trim()) return;
    const t = { id: "t" + Date.now(), title: newTask.trim(), detail: "NEW", done: false, priority: "new", project: "p1", assignee: user?.username, comments: [], status: "todo" };
    const updated = [...tasks, t];
    sav("ws_tasks", updated); setTasks(updated); setNewTask("");
    showToast(`Task "${t.title}" added`, "success");
    addNotif(`New task: "${t.title}"`, "📋");
  }

  function updateTask(task) {
    const updated = tasks.map(t => t.id === task.id ? task : t);
    sav("ws_tasks", updated); setTasks(updated);
  }

  function addProject(proj) {
    const p = { id: "p" + Date.now(), ...proj, tasks: 0, done: 0 };
    const updated = [...projects, p];
    sav("ws_projects", updated); setProjects(updated);
    showToast(`Project "${p.name}" created`, "success");
    addNotif(`New project: "${p.name}"`, "🚀");
    setModal(null);
  }

  const filtered = tasks.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));
  const recentLogs = [...logs].sort((a, b) => b.loginAt - a.loginAt).slice(0, 4);
  const onlineUsers = user ? [user.username] : [];
  const pomoTotal = pomoPhase === "work" ? 25 * 60 : 5 * 60;
  const pomoPct = (1 - pomoSecs / pomoTotal) * 100;

  const viewTabs = [
    ["projects", "🚀 Projects"], ["kanban", "🗂️ Kanban"], ["logs", "📋 Logs"],
    ["monthly", "📅 Monthly"], ["analytics", "📊 Analytics"], ["team", "👥 Team"],
    ["profile", "👤 Profile"], ["settings", "⚙️ Settings"],
  ];

  if (!user) return (<><style>{STYLES}</style><Login onLogin={handleLogin} /><ToastContainer toasts={toasts} /></>);

  return (
    <>
      <style>{STYLES}</style>
      <div className={`app ${theme === "light" ? "light" : ""}`}>

        {/* TOPBAR */}
        <div className="topbar">
          <div className="tb-left">
            <div className="tb-avatar" onClick={() => setView("profile")} title="View Profile">{getInitial(user.username)}</div>
            <div className="tb-info">
              <div className="tb-name">{user.username}</div>
              <div className="tb-role">{user.role}</div>
            </div>
          </div>
          <div className="tb-center">
            {viewTabs.map(([v, l]) => (
              <button key={v} className={`nav-btn ${view === v ? "active" : ""}`} onClick={() => setView(v)}>{l}</button>
            ))}
          </div>
          <div className="tb-right">
            <div className="status-pill"><div className="status-dot"></div>Active</div>
            <div className="tb-icon-btn notif-badge" onClick={() => setNotifOpen(o => !o)} title="Notifications">
              🔔{notifications.length > 0 && <div className="badge">{notifications.length}</div>}
            </div>
            <div className="tb-icon-btn" onClick={() => setCmdOpen(true)} title="Command Palette (⌘K)">⌘</div>
            <button className="logout-btn" onClick={handleLogout}>⏹ Logout</button>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="workspace">

          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="sidebar-chrome">
              <div className="traffic"><div className="tl tl-r"></div><div className="tl tl-y"></div><div className="tl tl-g"></div></div>
              <span className="chrome-label">Edit</span>
              <div className="chrome-icons"><span className="ci">○</span><span className="ci">◇</span><span className="ci">▣</span></div>
            </div>
            <div className="sb-search">
              <span style={{ fontSize: "13px", color: "var(--text3)" }}>⌕</span>
              <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="sb-section">Tasks · {tasks.filter(t => !t.done).length} open</div>
            <div className="task-list">
              {filtered.slice(0, 20).map(t => (
                <div key={t.id} className={`task-item${t.done ? " selected" : ""}`} onClick={() => toggleTask(t.id)}>
                  <div className={`task-cb ${t.done ? "chk" : ""}`}></div>
                  <span className={`task-title ${t.done ? "done" : ""}`}>{t.title}</span>
                  <span className={`task-tag ${PRIORITY_COLORS[t.priority] || "tag-new"}`}>{t.priority || "new"}</span>
                </div>
              ))}
            </div>
            <div className="sb-section" style={{ marginTop: "4px" }}>Online Now</div>
            <div className="online-list">
              {DEMO_USERS.map(u => (
                <div key={u.id} className="online-user">
                  <div className={`ou-dot ${u.username !== user.username ? "away" : ""}`}></div>
                  <span className="ou-name">{u.username}</span>
                  <span className="ou-role">{u.role}</span>
                </div>
              ))}
            </div>
            <div className="sb-add">
              <input placeholder="New task..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} />
              <button className="add-btn" onClick={addTask}>+</button>
            </div>
          </div>

          {/* CENTER */}
          <div className="center">
            <div className="display-screen">
              <div className="ds-header">
                <span className="ds-title">{viewTabs.find(([v]) => v === view)?.[1] || "Dashboard"}</span>
                <div className="ds-actions">
                  <span style={{ fontSize: "10px", color: "var(--text3)" }}>{clock.toLocaleTimeString([])}</span>
                  {view === "projects" && <button className="ds-btn primary" onClick={() => setModal("newproject")}>+ Project</button>}
                </div>
              </div>
              <div className="ds-content">
                {view === "projects" && <ProjectsView projects={projects} onNew={() => setModal("newproject")} onSelect={p => showToast(`Opened: ${p.name}`, "info")} />}
                {view === "kanban" && <KanbanView tasks={tasks} user={user} onTaskUpdate={updateTask} showToast={showToast} />}
                {view === "logs" && <LogsView logs={logs} />}
                {view === "monthly" && <MonthlyView logs={logs} />}
                {view === "analytics" && <AnalyticsView logs={logs} />}
                {view === "team" && <TeamView onlineUsers={onlineUsers} showToast={showToast} />}
                {view === "profile" && <ProfileView user={user} logs={logs} />}
                {view === "settings" && <SettingsView theme={theme} setTheme={setTheme} pomodoroMode={pomodoroMode} setPomodoroMode={setPomodoroMode} showToast={showToast} />}
              </div>
            </div>
            {/* TASKBAR */}
            <div className="taskbar">
              {[["projects", "🚀"], ["kanban", "🗂️"], ["logs", "📋"], ["monthly", "📅"], ["analytics", "📊"]].map(([v, icon], i, arr) => (
                <span key={v} className={`tb-item ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
                  {icon} {v}{i < arr.length - 1 && <span className="tb-sep"></span>}
                </span>
              ))}
              <div className="tb-space"></div>
              <span className="tb-session">⏱ {fmtSecs(elapsed)}</span>
              <span className="tb-sep"></span>
              <span className="tb-clock">{clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          {/* WIDGETS */}
          <div className="widgets">
            {/* TIMER */}
            <div className="widget">
              <div className="w-label">Session Timer</div>
              <div className="timer-big">{fmtSecs(elapsed)}</div>
              <div className="timer-status">● Session Active</div>
              <div className="timer-meta">Started {sessionStart ? fmtTime(sessionStart) : "—"}</div>
              {pomodoroMode && (
                <>
                  <div className="pomodoro-bar"><div className="pomodoro-fill" style={{ width: `${pomoPct}%` }}></div></div>
                  <div className="pomo-label">{pomoPhase === "work" ? "🎯 Focus" : "🌿 Break"} · {fmtSecs(pomoSecs)} left</div>
                  <div className="pomo-controls">
                    <button className={`pomo-btn ${pomoPhase === "work" ? "active" : ""}`} onClick={() => { setPomoPhase("work"); setPomoSecs(25 * 60); }}>Work</button>
                    <button className={`pomo-btn ${pomoPhase === "break" ? "active" : ""}`} onClick={() => { setPomoPhase("break"); setPomoSecs(5 * 60); }}>Break</button>
                  </div>
                </>
              )}
            </div>
            {/* CALENDAR */}
            <CalWidget logs={logs} />
            {/* RECENTS */}
            <div className="widget" style={{ flex: 1 }}>
              <div className="w-label">Recents</div>
              {!recentLogs.length ? <div style={{ fontSize: "11px", color: "var(--text3)" }}>No sessions yet</div> : (
                recentLogs.map((l, i) => (
                  <div key={i} className="recent-item">
                    <div className="ri-action">🔐 {l.username}</div>
                    <div className="ri-time">{fmtDateShort(l.loginAt)} · {fmtTime(l.loginAt)}</div>
                    {l.duration && <div className="ri-dur">{secsToDur(l.duration)}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS PANEL */}
        {notifOpen && (
          <div className="notif-panel">
            <div className="np-header">
              <span className="np-title">Notifications</span>
              <span className="np-clear" onClick={() => setNotifications([])}>Clear all</span>
            </div>
            <div className="np-list">
              {!notifications.length ? <div className="np-empty">All caught up! 🎉</div> : (
                notifications.map(n => (
                  <div key={n.id} className="np-item">
                    <span className="np-icon">{n.icon}</span>
                    <div className="np-text">
                      <div className="np-msg">{n.msg}</div>
                      <div className="np-time">{fmtTime(n.time)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CMD PALETTE */}
        {cmdOpen && <CmdPalette onClose={() => setCmdOpen(false)} onNavigate={v => { setView(v); setCmdOpen(false); }} />}

        {/* MODALS */}
        {modal === "newproject" && (
          <Modal title="New Project" onClose={() => setModal(null)}>
            {(() => {
              const [name, setName] = useState("");
              const [icon, setIcon] = useState("🚀");
              const [desc, setDesc] = useState("");
              const icons = ["🚀", "🌐", "📱", "📊", "🎯", "⚡", "🔥", "💡", "🛠️", "🎨"];
              return (
                <>
                  <div className="modal-field"><label>Project Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mobile App v2" autoFocus /></div>
                  <div className="modal-field"><label>Icon</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {icons.map(ic => <button key={ic} onClick={() => setIcon(ic)} style={{ fontSize: "20px", padding: "6px 8px", borderRadius: "8px", border: `1px solid ${ic === icon ? "var(--accent)" : "var(--border)"}`, background: ic === icon ? "rgba(124,58,237,0.15)" : "var(--panel2)", cursor: "pointer" }}>{ic}</button>)}
                    </div>
                  </div>
                  <div className="modal-field"><label>Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this project about?" /></div>
                  <div className="modal-actions">
                    <button className="modal-btn" onClick={() => setModal(null)}>Cancel</button>
                    <button className="modal-btn primary" onClick={() => name.trim() && addProject({ name: name.trim(), icon, desc, owner: user.username })}>Create Project</button>
                  </div>
                </>
              );
            })()}
          </Modal>
        )}

        {/* TOASTS */}
        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}
