<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tesorería — Baldoria Group</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
:root{--cream:#F5F0E8;--cream2:#EDE7D9;--cream3:#E2D9C8;--ink:#1A1814;--ink2:#3D3830;--ink3:#6B6358;--ink4:#9A9185;--rust:#C4613A;--gold:#B8962E;--green:#2A7A56;--green2:#D4EDDA;--red:#C0392B;--red2:#FDECEA;--amber:#D4860A;--amber2:#FEF3CD;--blue:#185FA5;--purple:#6B3FA0;--border:rgba(26,24,20,0.10);--border2:rgba(26,24,20,0.18);--shadow:0 2px 16px rgba(26,24,20,0.07);--shadow2:0 4px 28px rgba(26,24,20,0.13);--font-display:'Cormorant Garamond',Georgia,serif;--font-body:'DM Sans',sans-serif;--font-num:'Old Standard TT',Georgia,serif;--font-mono:'DM Mono',monospace;--radius:14px;--radius-sm:8px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--font-body);background:var(--cream);color:var(--ink);min-height:100vh;font-size:13.5px}
.num{font-family:var(--font-num)!important;font-variant-numeric:tabular-nums}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:0;opacity:.5}
.shell{display:grid;grid-template-columns:260px 1fr;min-height:100vh;position:relative;z-index:1}

/* ── SIDEBAR ── */
.sidebar{background:var(--ink);color:var(--cream);position:sticky;top:0;height:100vh;display:flex;flex-direction:column;overflow-y:auto}
.sb-brand{padding:28px 24px 20px;border-bottom:1px solid rgba(255,255,255,0.08)}
.sb-brand-title{font-family:var(--font-display);font-size:26px;font-weight:400;color:var(--cream);line-height:1.1}
.sb-brand-sub{font-size:10px;color:rgba(245,240,232,0.35);letter-spacing:2px;text-transform:uppercase;margin-top:5px}
.sb-brand-line{width:28px;height:1px;background:var(--rust);margin-top:12px}
.sb-section{padding:16px 24px 6px;font-size:9px;letter-spacing:1.8px;color:rgba(245,240,232,0.25);text-transform:uppercase}
.sb-nav{flex:1;padding:0 10px;overflow-y:auto}
.sb-item{display:flex;align-items:center;gap:9px;padding:9px 14px;border-radius:var(--radius-sm);cursor:pointer;font-size:12.5px;color:rgba(245,240,232,0.5);transition:all .15s;border:none;background:none;width:100%;text-align:left}
.sb-item:hover{background:rgba(255,255,255,0.06);color:var(--cream)}
.sb-item.active{background:rgba(196,97,58,0.2);color:#F5A07A}
.sb-item.special{background:rgba(184,150,46,0.12);color:rgba(245,166,35,0.8)}
.sb-item.special.active{background:rgba(184,150,46,0.28);color:#F5C842}
.sb-item.danger-item{background:rgba(192,57,43,0.12);color:rgba(255,120,100,0.8)}
.sb-item.danger-item.active{background:rgba(192,57,43,0.28);color:#FF8A7A}
.sb-divider{height:1px;background:rgba(255,255,255,0.06);margin:8px 24px}
.sb-filters{padding:0 10px 8px}
.sb-filter-btn{display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:var(--radius-sm);cursor:pointer;font-size:11.5px;color:rgba(245,240,232,0.45);transition:all .15s;border:none;background:none;width:100%;text-align:left}
.sb-filter-btn:hover{background:rgba(255,255,255,0.05);color:var(--cream)}
.sb-filter-btn.active{background:rgba(255,255,255,0.09);color:var(--cream)}
.sb-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.sb-footer{padding:14px 24px;border-top:1px solid rgba(255,255,255,0.07)}
.sb-ts{font-family:var(--font-mono);font-size:9.5px;color:rgba(245,240,232,0.2);margin-top:3px}
.sb-status{font-size:11px;display:flex;align-items:center;gap:6px}
.sb-status-dot{width:6px;height:6px;border-radius:50%}
.sb-status-dot.live{background:#2ECC8A;box-shadow:0 0 5px #2ECC8A}
.sb-status-dot.error{background:#FF5A5A}
.sb-status-dot.loading{background:var(--gold);animation:pulse .8s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

/* ── ALERT BADGE on sb-item ── */
.sb-badge{margin-left:auto;font-size:10px;padding:2px 7px;border-radius:10px;font-weight:600}
.sb-badge.red{background:rgba(192,57,43,0.35);color:#FF8A7A}
.sb-badge.amber{background:rgba(212,134,10,0.35);color:#FFC857}

/* ── MAIN ── */
.main{padding:36px 40px;background:var(--cream);min-width:0}
.topbar{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;gap:20px;flex-wrap:wrap}
.topbar-eyebrow{font-size:9.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--ink4);margin-bottom:5px}
.topbar-title{font-family:var(--font-display);font-size:38px;font-weight:400;color:var(--ink);letter-spacing:-.5px;line-height:1}
.topbar-title em{font-style:italic;color:var(--rust)}
.topbar-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:var(--radius-sm);font-size:12px;font-family:var(--font-body);cursor:pointer;transition:all .15s;letter-spacing:.3px;white-space:nowrap;border:none}
.btn-outline{border:1.5px solid var(--border2)!important;background:transparent;color:var(--ink2)}
.btn-outline:hover{background:var(--ink);color:var(--cream)}
.btn-dark{background:var(--ink);color:var(--cream)}
.btn-dark:hover{background:var(--rust)}
.btn-rust{background:var(--rust);color:white}
.btn-rust:hover{background:#a8502e}
.btn-green{background:var(--green);color:white}
.btn-green:hover{background:#1a5c3a}
.btn-amber{background:var(--amber);color:white}
.btn-amber:hover{background:#a8680a}
.btn-sm{padding:6px 12px;font-size:11px}
.btn:disabled{opacity:.4;cursor:not-allowed}

/* ── SYNC BANNER ── */
.sync-banner{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow)}
.sync-banner.success{border-color:rgba(42,122,86,0.3);background:rgba(42,122,86,0.04)}
.sync-banner.error{border-color:rgba(196,97,58,0.3);background:rgba(196,97,58,0.04)}
.sync-banner.loading{border-color:rgba(184,150,46,0.3);background:rgba(184,150,46,0.04)}
.sync-banner-text{flex:1;font-size:12px;color:var(--ink3)}
.sync-banner-text strong{color:var(--ink)}

/* ── KPIs ── */
.kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:28px}
.kpi{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;box-shadow:var(--shadow);transition:box-shadow .2s}
.kpi:hover{box-shadow:var(--shadow2)}
.kpi.accent{background:var(--ink)}
.kpi.accent .kpi-label,.kpi.accent .kpi-sub{color:rgba(245,240,232,0.4)}
.kpi.accent .kpi-value{color:#F5F0E8}
.kpi.warn{background:var(--amber2);border-color:rgba(212,134,10,0.3)}
.kpi.danger{background:var(--red2);border-color:rgba(192,57,43,0.3)}
.kpi-label{font-size:9.5px;letter-spacing:1.5px;color:var(--ink4);text-transform:uppercase;margin-bottom:8px}
.kpi-value{font-family:var(--font-num);font-size:24px;font-weight:400;color:var(--ink);letter-spacing:-.3px;line-height:1}
.kpi-value.pos{color:var(--green)}
.kpi-value.neg{color:var(--red)}
.kpi-sub{font-size:10.5px;color:var(--ink4);margin-top:5px}

/* ── TABS ── */
.tabs{display:flex;border-bottom:1.5px solid var(--border2);margin-bottom:20px;flex-wrap:wrap;gap:0}
.tab-btn{padding:9px 18px;font-size:12px;color:var(--ink4);cursor:pointer;border:none;background:none;font-family:var(--font-body);letter-spacing:.3px;border-bottom:2px solid transparent;margin-bottom:-1.5px;transition:all .15s;white-space:nowrap}
.tab-btn:hover{color:var(--ink)}
.tab-btn.active{color:var(--rust);border-bottom-color:var(--rust);font-weight:500}
.tab-btn.tab-special{color:var(--gold)}
.tab-btn.tab-special.active{color:var(--gold);border-bottom-color:var(--gold)}
.tab-btn.tab-danger{color:var(--red)}
.tab-btn.tab-danger.active{color:var(--red);border-bottom-color:var(--red)}
.tab-panel{display:none}
.tab-panel.active{display:block}
.section-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.section-title{font-family:var(--font-display);font-size:20px;font-weight:400;color:var(--ink)}
.section-meta{font-size:11px;color:var(--ink4)}

/* ── CARDS ── */
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px;margin-bottom:28px}
.entity-card{background:white;border:1px solid var(--border);border-radius:var(--radius);overflow:visible;box-shadow:var(--shadow);transition:box-shadow .2s}
.entity-card:hover{box-shadow:var(--shadow2)}
.entity-header{padding:13px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:relative;cursor:pointer;user-select:none;gap:8px}
.entity-header:hover{background:rgba(26,24,20,0.02)}
.entity-accent-bar{position:absolute;left:0;top:0;bottom:0;width:4px}
.entity-name-wrap{padding-left:6px;flex:1;min-width:0}
.entity-name{font-family:var(--font-display);font-size:16px;font-weight:400;color:var(--ink)}
.entity-tag{display:inline-flex;align-items:center;font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;padding:2px 7px;border-radius:20px;margin-top:3px;font-weight:500}
.entity-total-amount{font-family:var(--font-num);font-size:19px;font-weight:400;color:var(--ink);text-align:right;white-space:nowrap}
.entity-total-label{font-size:9.5px;color:var(--ink4);margin-top:2px;text-align:right}
.collapse-icon{font-size:11px;color:var(--ink4);transition:transform .25s;flex-shrink:0}
.collapse-icon.open{transform:rotate(180deg)}

/* ── BANK ROWS — no rognage ── */
.bank-rows{overflow:hidden;transition:max-height .3s ease,opacity .3s ease,padding .3s ease;padding-bottom:8px}
.bank-rows.collapsed{max-height:0!important;padding-bottom:0;opacity:0}
.bank-row{display:flex;align-items:center;gap:10px;padding:8px 18px;transition:background .12s;min-height:48px}
.bank-row:hover{background:var(--cream)}
.bank-row-divider{height:1px;background:var(--border);margin:0 18px;flex-shrink:0}
.bank-logo-box{width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:white;border:1px solid var(--border2);flex-shrink:0;padding:2px}
.bank-logo-box img{width:100%;height:100%;object-fit:contain}
.bank-info{flex:1;min-width:0}
.bank-name{font-size:12px;font-weight:500;color:var(--ink)}
.bank-iban{font-family:var(--font-mono);font-size:9.5px;color:var(--ink4);margin-top:1px}
.bank-holded{font-size:9.5px;color:var(--ink4);margin-top:1px;font-style:italic}
.bank-amount{font-family:var(--font-num);font-size:14px;color:var(--ink);white-space:nowrap;text-align:right;flex-shrink:0}
.bank-amount.zero{color:var(--ink4)}
.bank-amount.neg{color:var(--red)}

/* ── INTERNAL TRANSFER badge ── */
.traspaso-badge{display:inline-flex;align-items:center;gap:4px;font-size:9px;padding:2px 7px;border-radius:10px;background:rgba(107,63,160,0.12);color:var(--purple);font-weight:600;letter-spacing:.3px;margin-top:2px;border:1px solid rgba(107,63,160,0.2)}

/* ── ALERT CHIP ── */
.alert-chip{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;padding:2px 7px;border-radius:10px;font-weight:500;white-space:nowrap}
.alert-chip.red{background:var(--red2);color:var(--red);border:1px solid rgba(192,57,43,0.2)}
.alert-chip.amber{background:var(--amber2);color:var(--amber);border:1px solid rgba(212,134,10,0.2)}
.alert-chip.green{background:var(--green2);color:var(--green);border:1px solid rgba(42,122,86,0.2)}

/* ── BANCO VIEW ── */
.banco-section{margin-bottom:24px;animation:fadeUp .3s ease both}
.banco-header{display:flex;align-items:center;gap:12px;margin-bottom:12px;cursor:pointer;padding:8px 10px;border-radius:var(--radius-sm);transition:background .15s}
.banco-header:hover{background:rgba(26,24,20,0.03)}
.banco-logo-big{width:44px;height:44px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:white;border:1px solid var(--border2);overflow:hidden;padding:4px;flex-shrink:0}
.banco-logo-big img{width:100%;height:100%;object-fit:contain}
.banco-name-main{font-family:var(--font-display);font-size:22px;font-weight:400;color:var(--ink)}
.banco-total-amt{font-family:var(--font-num);font-size:18px;color:var(--ink2);margin-left:auto}
.banco-table{background:white;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.banco-table.collapsed{display:none}
.bt-head{display:grid;grid-template-columns:170px 110px 155px 1fr 1fr;padding:9px 18px;background:var(--cream2);font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);border-bottom:1px solid var(--border);gap:8px}
.bt-row{display:grid;grid-template-columns:170px 110px 155px 1fr 1fr;padding:10px 18px;align-items:center;border-bottom:1px solid var(--border);transition:background .1s;gap:8px}
.bt-row:last-child{border-bottom:none}
.bt-row:hover{background:var(--cream)}
.bt-cell{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt-saldo{font-family:var(--font-num);font-size:13.5px;text-align:right}
.bt-saldo.neg{color:var(--red)}
.bt-saldo.zero{color:var(--ink4)}
.bt-sub-row{display:grid;grid-template-columns:170px 110px 155px 1fr 1fr;padding:3px 18px;align-items:center;background:rgba(26,24,20,0.015);gap:8px}
.bt-sub-row:last-of-type{padding-bottom:8px}
.bt-tag{width:9px;height:9px;border-radius:50%;flex-shrink:0;display:inline-block;vertical-align:middle;margin-right:5px}

/* ── ANALYSIS ── */
.analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px}
.analysis-card{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:20px 22px;box-shadow:var(--shadow)}
.analysis-title{font-family:var(--font-display);font-size:17px;margin-bottom:16px;color:var(--ink)}
.bar-row{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.bar-label{font-size:10.5px;color:var(--ink2);width:115px;flex-shrink:0;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar-track{flex:1;height:6px;background:var(--cream3);border-radius:3px;overflow:hidden}
.bar-fill{height:100%;border-radius:3px;transition:width .5s ease}
.bar-val{font-family:var(--font-num);font-size:10.5px;color:var(--ink);width:86px;flex-shrink:0;text-align:right}

/* ── PIE CHARTS ── */
.pie-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:28px}
.pie-card{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)}
.pie-title{font-family:var(--font-display);font-size:17px;color:var(--ink);margin-bottom:14px}
.pie-canvas-wrap{display:flex;justify-content:center;margin-bottom:12px}
canvas.pie-canvas{max-width:180px;max-height:180px}
.pie-legend{display:flex;flex-direction:column;gap:5px}
.pie-legend-item{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--ink2)}
.pie-legend-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.pie-legend-val{margin-left:auto;font-family:var(--font-num);font-size:11px;color:var(--ink)}
.pie-legend-pct{font-size:10px;color:var(--ink4);margin-left:3px}

/* ── REMESAS ── */
.remesa-card{background:white;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);margin-bottom:12px}
.remesa-header{display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer}
.remesa-header:hover{background:var(--cream)}
.remesa-status{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600}
.remesa-status.pending{background:var(--amber2);color:var(--amber)}
.remesa-status.completed{background:var(--green2);color:var(--green)}
.remesa-status.sent{background:rgba(24,95,165,0.12);color:var(--blue)}
.remesa-body{padding:0}
.remesa-row{display:grid;grid-template-columns:1fr 150px 120px 110px;padding:9px 20px;border-bottom:1px solid var(--border);align-items:center;font-size:12px;gap:10px}
.remesa-row:last-child{border-bottom:none}
.remesa-row:hover{background:var(--cream)}
.remesa-head-row{background:var(--cream2);font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--ink4)}
.remesa-head-row:hover{background:var(--cream2)}
.remesa-amount{font-family:var(--font-num);font-size:13px;text-align:right}
.remesa-amount.internal{color:var(--purple)}
.internal-row{background:rgba(107,63,160,0.04)!important}

/* ── FACTURAS ── */
.factura-filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.factura-filter-btn{padding:5px 12px;border-radius:20px;font-size:11px;cursor:pointer;border:1px solid var(--border2);background:transparent;color:var(--ink3);font-family:var(--font-body);transition:all .15s}
.factura-filter-btn.active{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.factura-table{background:white;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);margin-bottom:16px}
.factura-row{display:grid;grid-template-columns:22px 1fr 120px 120px 110px 90px 110px;padding:9px 16px;border-bottom:1px solid var(--border);align-items:center;font-size:12px;gap:8px;transition:background .1s}
.factura-row:last-child{border-bottom:none}
.factura-row:hover{background:var(--cream)}
.factura-head{background:var(--cream2);font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--ink4);cursor:default}
.factura-head:hover{background:var(--cream2)}
.factura-amount{font-family:var(--font-num);font-size:13px;text-align:right}
.factura-check{width:16px;height:16px;cursor:pointer;accent-color:var(--rust)}
.vencida{background:rgba(192,57,43,0.04)!important}
.vence-pronto{background:rgba(212,134,10,0.04)!important}
.dias-badge{display:inline-flex;padding:2px 7px;border-radius:10px;font-size:9.5px;font-weight:500}
.dias-badge.red{background:var(--red2);color:var(--red)}
.dias-badge.amber{background:var(--amber2);color:var(--amber)}
.dias-badge.green{background:var(--green2);color:var(--green)}

/* ── SEPA BUILDER ── */
.sepa-panel{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);margin-bottom:16px}
.sepa-title{font-family:var(--font-display);font-size:18px;color:var(--ink);margin-bottom:16px}
.sepa-field{margin-bottom:12px}
.sepa-label{font-size:11px;color:var(--ink4);text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px}
.sepa-select{width:100%;padding:9px 12px;border-radius:var(--radius-sm);border:1px solid var(--border2);font-family:var(--font-body);font-size:13px;background:var(--cream);color:var(--ink);outline:none;cursor:pointer}
.sepa-select:focus{border-color:var(--rust)}
.liquidity-alert{border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:flex-start;gap:10px;margin-bottom:14px}
.liquidity-alert.ok{background:var(--green2);border:1px solid rgba(42,122,86,0.25)}
.liquidity-alert.warn{background:var(--amber2);border:1px solid rgba(212,134,10,0.3)}
.liquidity-alert.danger{background:var(--red2);border:1px solid rgba(192,57,43,0.25)}
.liquidity-icon{font-size:20px;flex-shrink:0}
.liquidity-text{font-size:12.5px;color:var(--ink)}
.liquidity-text strong{color:var(--ink)}

/* ── CF 13 SEMANAS ── */
.cf-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.cf-card{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;box-shadow:var(--shadow)}
.cf-title{font-family:var(--font-display);font-size:17px;color:var(--ink);margin-bottom:12px}
.cf-week-row{display:grid;grid-template-columns:80px 1fr 1fr 1fr 90px;gap:8px;padding:7px 10px;border-radius:6px;font-size:11.5px;align-items:center;margin-bottom:3px;border-bottom:1px solid var(--border)}
.cf-week-row:last-child{border-bottom:none}
.cf-week-row.negative{background:rgba(192,57,43,0.06)}
.cf-week-row.positive{background:rgba(42,122,86,0.04)}
.cf-week-head{background:var(--cream2);font-size:9.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--ink4);border-bottom:1px solid var(--border2)!important;border-radius:6px 6px 0 0;padding:7px 10px;margin-bottom:0}
.cf-week-head:last-child{border-bottom:none!important}
.cf-num{font-family:var(--font-num);font-size:12px;text-align:right}
.cf-num.pos{color:var(--green)}
.cf-num.neg{color:var(--red)}
.cf-acum.neg{color:var(--red);font-weight:600}

/* ── TRASPASOS ── */
.traspaso-flow{display:flex;align-items:center;gap:8px;padding:10px 18px;background:rgba(107,63,160,0.04);border-bottom:1px solid var(--border)}
.traspaso-flow:hover{background:rgba(107,63,160,0.08)}
.traspaso-flow:last-child{border-bottom:none}
.flow-account{background:white;border:1px solid rgba(107,63,160,0.2);border-radius:var(--radius-sm);padding:6px 10px;font-size:11px;flex:1;min-width:0}
.flow-account-name{font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.flow-account-bank{font-size:10px;color:var(--ink4);margin-top:1px}
.flow-arrow{font-size:18px;color:var(--purple);flex-shrink:0}
.flow-amount{font-family:var(--font-num);font-size:15px;color:var(--purple);font-weight:400;flex-shrink:0;min-width:100px;text-align:right}
.flow-concept{font-size:10px;color:var(--ink4);margin-top:2px}

/* ── PDF PREVIEW ── */
.pdf-btn-bar{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;align-items:center}

/* ── SUGGESTIONS ── */
.suggestions{background:linear-gradient(135deg,var(--ink) 0%,#2A2620 100%);border-radius:var(--radius);padding:20px 24px;margin-top:12px;color:var(--cream)}
.sug-title{font-family:var(--font-display);font-size:18px;margin-bottom:12px;color:var(--cream)}
.sug-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.07)}
.sug-item:last-child{border-bottom:none}
.sug-text{font-size:12px;color:rgba(245,240,232,0.75);line-height:1.6}
.sug-text strong{color:var(--cream)}

/* ── LOADING SKELETON ── */
.skeleton{background:linear-gradient(90deg,var(--cream2) 25%,var(--cream3) 50%,var(--cream2) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:6px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ── MODAL ── */
.modal-overlay{position:fixed;inset:0;background:rgba(26,24,20,0.6);z-index:1000;display:none;align-items:center;justify-content:center;padding:20px}
.modal-overlay.hidden{display:none}
.modal{background:white;border-radius:var(--radius);box-shadow:var(--shadow2);max-width:680px;width:100%;max-height:85vh;display:flex;flex-direction:column;overflow:hidden}
.modal-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.modal-title{font-family:var(--font-display);font-size:20px;color:var(--ink)}
.modal-close{background:none;border:none;cursor:pointer;font-size:20px;color:var(--ink4);padding:4px}
.modal-body{padding:20px 24px;overflow-y:auto;flex:1}
.modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}
.xml-preview{background:var(--cream2);border-radius:6px;padding:12px;font-family:var(--font-mono);font-size:10.5px;color:var(--ink2);overflow-x:auto;white-space:pre;max-height:300px;overflow-y:auto;border:1px solid var(--border)}

/* ── MISC ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.spinning{animation:spin .7s linear}
.entity-card,.kpi,.banco-section,.remesa-card,.cf-card{animation:fadeUp .25s ease both}
@media(max-width:1200px){.kpi-grid{grid-template-columns:repeat(3,1fr)}.analysis-grid,.cf-grid{grid-template-columns:1fr}}
@media(max-width:900px){.shell{grid-template-columns:1fr}.sidebar{display:none}.main{padding:16px}.kpi-grid{grid-template-columns:repeat(2,1fr)}.cards-grid{grid-template-columns:1fr}}
.tag-interno{background:rgba(107,63,160,0.1);color:var(--purple);border:1px solid rgba(107,63,160,0.2);border-radius:10px;font-size:9px;padding:1px 6px;font-weight:600;vertical-align:middle;margin-left:4px}

/* ── FACTURAS TABLE ── */
.ftable-wrap{background:white;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);margin-bottom:16px}
.ftable-scroll{overflow-x:auto;width:100%}
.ftable{width:100%;border-collapse:collapse;min-width:1100px;table-layout:auto}
.ftable th{background:var(--cream2);padding:9px 12px;font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);font-weight:500;white-space:nowrap;border-bottom:1px solid var(--border);text-align:left;position:sticky;top:0;z-index:2}
.ftable th.num-col{text-align:right;white-space:nowrap;min-width:90px;min-width:100px;white-space:nowrap}
.ftable td{padding:8px 12px;font-size:12px;color:var(--ink);border-bottom:1px solid var(--border);vertical-align:middle;white-space:nowrap}
.ftable td.num-col{font-family:var(--font-num);font-size:13px;text-align:right;white-space:nowrap;min-width:90px;min-width:100px;white-space:nowrap}
.ftable tr:last-child td{border-bottom:none}
.ftable tr:hover td{background:var(--cream)}
.ftable tr.vencida td{background:rgba(192,57,43,0.03)}
.ftable tr.proxima td{background:rgba(212,134,10,0.03)}
.ftable tr.selected td{background:rgba(196,97,58,0.07)!important}
.ftable tr.selected td:first-child{border-left:3px solid var(--rust)}
.ftable-check{width:16px;height:16px;cursor:pointer;accent-color:var(--rust)}
.estado-badge{display:inline-flex;padding:2px 8px;border-radius:10px;font-size:9.5px;font-weight:600;white-space:nowrap}
.estado-pendiente{background:rgba(184,150,46,0.15);color:var(--gold)}
.estado-vencida{background:rgba(192,57,43,0.12);color:var(--red)}
.estado-parcial{background:rgba(24,95,165,0.12);color:var(--blue)}
.estado-pagado{background:rgba(42,122,86,0.12);color:var(--green)}
/* ── SEPA CONFIG PANEL ── */
.sepa-config-panel{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);margin-bottom:16px}
.sepa-config-title{font-family:var(--font-display);font-size:18px;color:var(--ink);margin-bottom:16px;display:flex;align-items:center;justify-content:space-between}
.sepa-fields-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}
.sepa-field-group{display:flex;flex-direction:column;gap:5px}
.sepa-field-label{font-size:9.5px;color:var(--ink4);text-transform:uppercase;letter-spacing:.8px;font-weight:500}
.sepa-field-input{padding:8px 11px;border-radius:var(--radius-sm);border:1px solid var(--border2);font-family:var(--font-body);font-size:12.5px;background:var(--cream);color:var(--ink);outline:none;width:100%}
.sepa-field-input:focus{border-color:var(--rust);background:white}
.sepa-select{padding:8px 11px;border-radius:var(--radius-sm);border:1px solid var(--border2);font-family:var(--font-body);font-size:12.5px;background:var(--cream);color:var(--ink);outline:none;width:100%;cursor:pointer}
.sepa-select:focus{border-color:var(--rust);background:white}
/* ── FILTERS BAR ── */
.facturas-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px;padding:12px 16px;background:white;border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.filter-group{display:flex;align-items:center;gap:6px}
.filter-label{font-size:10px;color:var(--ink4);letter-spacing:.5px;text-transform:uppercase;white-space:nowrap}
.filter-select{padding:5px 10px;border-radius:20px;font-size:11px;border:1px solid var(--border2);background:var(--cream);color:var(--ink);font-family:var(--font-body);cursor:pointer;outline:none}
.filter-select:focus{border-color:var(--rust)}
.filter-pill{padding:5px 11px;border-radius:20px;font-size:11px;cursor:pointer;border:1px solid var(--border2);background:transparent;color:var(--ink3);font-family:var(--font-body);transition:all .15s;white-space:nowrap}
.filter-pill.active{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.toolbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
/* ── SELECTION BAR ── */
.selection-bar{display:none;align-items:center;gap:12px;padding:10px 16px;background:var(--rust);border-radius:var(--radius);margin-bottom:12px;flex-wrap:wrap}
.selection-bar.visible{display:flex}
.sel-text{font-size:12.5px;color:white;font-weight:500}
.sel-amount{font-family:var(--font-num);font-size:15px;color:white}
/* ── LIQUIDITY ALERT ── */
.liq-panel{margin-bottom:14px}
.liq-alert{border-radius:var(--radius-sm);padding:12px 16px;display:flex;align-items:flex-start;gap:10px;border:1px solid transparent}
.liq-alert.ok{background:rgba(42,122,86,0.07);border-color:rgba(42,122,86,0.2)}
.liq-alert.warn{background:rgba(212,134,10,0.08);border-color:rgba(212,134,10,0.25)}
.liq-alert.danger{background:rgba(192,57,43,0.07);border-color:rgba(192,57,43,0.2)}
.liq-icon{font-size:20px;flex-shrink:0}
.liq-text{font-size:12.5px;line-height:1.6;color:var(--ink)}

</style>
</head>
<body>
<div class="shell">

<!-- ═══════════════ SIDEBAR ═══════════════ -->
<aside class="sidebar">
  <div class="sb-brand">
    <div class="sb-brand-title">Baldoria<br><em style="font-style:italic;color:#F5A07A">Group</em></div>
    <div class="sb-brand-sub">Tesorería · 2026</div>
    <div class="sb-brand-line"></div>
  </div>
  <nav class="sb-nav">
    <div class="sb-section">Posición</div>
    <button class="sb-item active" onclick="switchTab('sociedad')"><span>🏢</span> Por Sociedad</button>
    <button class="sb-item" onclick="switchTab('banco')"><span>🏦</span> Por Banco</button>
    <button class="sb-item" onclick="switchTab('restaurante')"><span>🍝</span> Por Restaurante</button>
    <div class="sb-divider"></div>
    <div class="sb-section">Análisis</div>
    <button class="sb-item" onclick="switchTab('graficos')"><span>📊</span> Gráficos</button>
    <button class="sb-item special" onclick="switchTab('traspasos')"><span>🔄</span> Traspasos internos</button>
    <button class="sb-item special" onclick="switchTab('cf13')"><span>📅</span> CF 13 semanas</button>
    <div class="sb-divider"></div>
    <div class="sb-section">Pagos</div>
    <button class="sb-item danger-item" id="sb-facturas" onclick="switchTab('facturas')"><span>⚡</span> Facturas &amp; SEPA <span class="sb-badge red" id="badge-vencidas" style="display:none">0</span></button>
    <button class="sb-item" onclick="switchTab('remesas')"><span>📁</span> Remesas Holded</button>
    <div class="sb-divider"></div>
    <div class="sb-section">Filtrar sociedad</div>
    <div class="sb-filters" id="sb-filters"></div>
  </nav>
  <div class="sb-footer">
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">
      <button class="btn btn-outline btn-sm" onclick="loadData()"><svg id="ri" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Actualizar</button>
      <button class="btn btn-outline btn-sm" onclick="toggleAuto()" id="auto-btn">⏱ Auto</button>
    </div>
    <div class="sb-status">
      <div class="sb-status-dot loading" id="status-dot"></div>
      <span id="status-text" style="color:rgba(245,240,232,0.45);font-size:11px">Conectando...</span>
    </div>
    <div class="sb-ts" id="sb-ts">—</div>
  </div>
</aside>

<!-- ═══════════════ MAIN ═══════════════ -->
<main class="main">
  <div class="topbar">
    <div>
      <div class="topbar-eyebrow">Dashboard · Tesorería</div>
      <div class="topbar-title">Posición <em>bancaria</em></div>
    </div>
    <div class="topbar-actions">
      <button class="btn btn-outline" onclick="exportPDF()">📄 Exportar PDF</button>
      <button class="btn btn-dark" onclick="loadData()">Actualizar todo</button>
    </div>
  </div>

  <div class="sync-banner loading" id="sync-banner">
    <div style="font-size:18px">🔄</div>
    <div class="sync-banner-text"><strong>Cargando datos desde Holded...</strong></div>
  </div>

  <!-- KPIs -->
  <div class="kpi-grid" id="kpi-grid"></div>

  <!-- TABS -->
  <div class="tabs">
    <button class="tab-btn active" id="tab-sociedad" onclick="switchTab('sociedad')">Por Sociedad</button>
    <button class="tab-btn" id="tab-banco" onclick="switchTab('banco')">Por Banco</button>
    <button class="tab-btn" id="tab-restaurante" onclick="switchTab('restaurante')">Por Restaurante</button>
    <button class="tab-btn" id="tab-graficos" onclick="switchTab('graficos')">📊 Gráficos</button>
    <button class="tab-btn tab-special" id="tab-traspasos" onclick="switchTab('traspasos')">🔄 Traspasos</button>
    <button class="tab-btn tab-special" id="tab-cf13" onclick="switchTab('cf13')">📅 CF 13 sem.</button>
    <button class="tab-btn tab-danger" id="tab-facturas" onclick="switchTab('facturas')">⚡ Facturas &amp; SEPA</button>
    <button class="tab-btn" id="tab-remesas" onclick="switchTab('remesas')">📁 Remesas</button>
  </div>

  <!-- ─ SOCIEDAD ─ -->
  <div class="tab-panel active" id="panel-sociedad">
    <div class="section-hd"><div class="section-title">Por Sociedad</div><div class="section-meta" id="meta-sociedad"></div></div>
    <div class="cards-grid" id="grid-sociedad"></div>
  </div>

  <!-- ─ BANCO ─ -->
  <div class="tab-panel" id="panel-banco">
    <div class="section-hd"><div class="section-title">Por Banco</div><div class="section-meta" id="meta-banco"></div></div>
    <div id="grid-banco"></div>
  </div>

  <!-- ─ RESTAURANTE ─ -->
  <div class="tab-panel" id="panel-restaurante">
    <div class="section-hd"><div class="section-title">Por Restaurante</div><div class="section-meta" id="meta-rest"></div></div>
    <div class="cards-grid" id="grid-restaurante"></div>
  </div>

  <!-- ─ GRÁFICOS ─ -->
  <div class="tab-panel" id="panel-graficos">
    <div class="section-hd"><div class="section-title">Gráficos de distribución</div></div>
    <div class="pie-grid" id="pie-grid"></div>
    <div class="analysis-grid" id="bar-grid"></div>
    <div class="suggestions" id="suggestions-block"></div>
  </div>

  <!-- ─ TRASPASOS ─ -->
  <div class="tab-panel" id="panel-traspasos">
    <div class="section-hd">
      <div class="section-title">Traspasos internos</div>
      <div class="section-meta" id="meta-traspasos"></div>
    </div>
    <div id="traspasos-kpis" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px"></div>
    <div id="traspasos-content"></div>
  </div>

  <!-- ─ CF 13 SEMANAS ─ -->
  <div class="tab-panel" id="panel-cf13">
    <div class="section-hd">
      <div class="section-title">Previsión de Cash Flow — 13 semanas</div>
      <div style="display:flex;gap:8px;align-items:center">
        <select id="cf-sociedad-select" class="sepa-select" style="width:220px" onchange="setFilter(this.value==='all'?'all':this.value);renderCF13();">
          <option value="all">Todas las sociedades</option>
        </select>
        <button class="btn btn-outline btn-sm" onclick="loadFacturas()">🔄 Actualizar facturas</button>
      </div>
    </div>
    <div id="cf13-content"></div>
  </div>

  
  <!-- ─ FACTURAS & SEPA ─ -->
  <div class="tab-panel" id="panel-facturas">
    <div class="section-hd">
      <div class="section-title">Facturas pendientes &amp; Creación SEPA</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="loadFacturas()">🔄 Actualizar facturas</button>
        <button class="btn btn-rust" onclick="openBuildSEPA()" id="btn-build-sepa" disabled>⚡ Crear remesa SEPA</button>
      </div>
    </div>

    <!-- SEPA CONFIG -->
    <div class="sepa-config-panel">
      <div class="sepa-config-title">
        <span>Configuración de la remesa</span>
        <span id="sepa-config-status" style="font-size:12px;color:var(--ink4);font-family:var(--font-body)"></span>
      </div>
      <div class="sepa-fields-grid">
        <div class="sepa-field-group">
          <div class="sepa-field-label">Sociedad deudora *</div>
          <select class="sepa-select" id="sepa-sociedad" onchange="onSepaSocChange()">
            <option value="">— Selecciona —</option>
          </select>
        </div>
        <div class="sepa-field-group">
          <div class="sepa-field-label">Cuenta de cargo *</div>
          <select class="sepa-select" id="sepa-cuenta" onchange="updateLiquidityCheck()">
            <option value="">— Primero sociedad —</option>
          </select>
        </div>
        <div class="sepa-field-group">
          <div class="sepa-field-label">Concepto *</div>
          <input class="sepa-field-input" id="sepa-concepto" type="text" placeholder="Ej: Pagos proveedores junio 2026" oninput="updateSEPAStatus()">
        </div>
        <div class="sepa-field-group">
          <div class="sepa-field-label">Fecha remesa *</div>
          <input class="sepa-field-input" id="sepa-fecha" type="text" placeholder="DD/MM/AAAA" oninput="updateSEPAStatus()">
        </div>
      </div>
      <!-- Liquidity check -->
      <div class="liq-panel" id="liq-panel" style="margin-top:12px"></div>
    </div>

    <!-- TOOLBAR / FILTERS -->
    <div class="facturas-toolbar">
      <div class="filter-group">
        <span class="filter-label">Sociedad</span>
        <select class="filter-select" id="f-sociedad" onchange="applyFacturaFilters()">
          <option value="">Todas</option>
        </select>
      </div>
      <div class="filter-group">
        <span class="filter-label">Proyecto</span>
        <select class="filter-select" id="f-proyecto" onchange="applyFacturaFilters()">
          <option value="">Todos</option>
        </select>
      </div>
      <div class="filter-group">
        <span class="filter-label">Estado</span>
        <button class="filter-pill active" onclick="setEstadoFilter('all',this)">Todos</button>
        <button class="filter-pill" onclick="setEstadoFilter('vencidas',this)">🔴 Vencidas</button>
        <button class="filter-pill" onclick="setEstadoFilter('7d',this)">🟡 7 días</button>
        <button class="filter-pill" onclick="setEstadoFilter('30d',this)">📅 30 días</button>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-outline btn-sm" onclick="selAll()">☑ Sel. todas</button>
        <button class="btn btn-outline btn-sm" onclick="deselAll()">☐ Desel.</button>
        <span id="total-count" style="font-size:11px;color:var(--ink4)"></span>
      </div>
    </div>

    <!-- SELECTION BAR -->
    <div class="selection-bar" id="sel-bar">
      <span class="sel-text" id="sel-label">0 seleccionadas</span>
      <span class="sel-amount" id="sel-amount">0,00 €</span>
      <button class="btn btn-sm" style="background:white;color:var(--rust)" onclick="deselAll()">✕ Limpiar</button>
    </div>

    <!-- TABLE -->
    <div id="facturas-content">
      <div style="text-align:center;padding:60px;color:var(--ink4)">
        <div style="font-size:40px">📄</div>
        <div style="font-family:var(--font-display);font-size:20px;margin-top:12px">Cargando facturas...</div>
        <button class="btn btn-dark" style="margin:16px auto 0;display:inline-flex" onclick="loadFacturas()">Cargar desde Holded</button>
      </div>
    </div>
  </div>


  <!-- ─ REMESAS ─ -->
  <div class="tab-panel" id="panel-remesas">
    <div class="section-hd">
      <div class="section-title">Remesas de Holded</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="loadRemesas()">🔄 Cargar remesas</button>
      </div>
    </div>
    <div id="remesas-content"></div>
  </div>

</main>
</div>

<!-- ═══════════════ MODAL ═══════════════ -->
<div class="modal-overlay hidden" id="modal-overlay" onclick="if(event.target===this)closeModal()">
  <div class="modal" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div class="modal-title" id="modal-title">Vista previa SEPA</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" id="modal-body"></div>
    <div class="modal-footer" id="modal-footer"></div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════════
// CONFIG & STATE
// ═══════════════════════════════════════════════════════════════════
const API_BASE = window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1'?'http://localhost:3000':'';

let DATA=[], REMESAS_DATA=[], FACTURAS_DATA=[], currentFilter='all', currentTab='sociedad';
let autoInterval=null, autoEnabled=false;
const collapseState={};
let selectedFacturas=new Set();
let facturaFilter='all';

// Internal IBANs — all known accounts
const INTERNAL_IBANS=new Set([
  'ES5100496733262116292134','ES0200496733222716305627','ES1500496733212816307204',
  'ES6200496733212816310141','ES5500496733252416326691','ES5700496733212816331571',
  'ES2800496733202916332837','ES4300496733262116331563','ES4200496733292016317838',
  'ES0300496733262116310167','ES3100496733252416317811','ES1000496733252416339238',
  'ES7200496733292016339220','ES9300817112880002361344','ES1900817112800002550860',
  'ES9100817112820002446452','ES1600817112890002434752','ES8000817112860002475457',
  'ES3600817112840002534256','ES8800817112830002594867','ES8000817112840002594768',
  'ES1500817112860002304937','ES4320801208243040033442','ES5820801208243040041320',
  'ES2420801208243040041544','ES9120801249673040000776','ES2201820901640202403599',
  'ES5401820901670202404622','ES6201820901680202409764','ES2601280016670100082901',
  'ES8601280016690100082887','ES6001280016630100082873','ES1121008652850200124985'
].map(i=>i.replace(/\s/g,'')));

const SOC_COLORS={"BALDORIA GROUP":"#84ceff","BEATA BALDORIA":"#e7ddb1","BEATA PASTA GROUP":"#FFBE5C","BEATA PASTA GV":"#333366","BEATA PASTA SMART":"#FEDEA9","BEATA PASTA FELIPE":"#df6c49","BEATA PASTA CALEIDO":"#d36c6e","BEATA PASTA SUR":"#fdd495"};
const BANK_LOGOS={"SANTANDER":{img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Banco_Santander_Logotipo.svg/320px-Banco_Santander_Logotipo.svg.png",color:"#EC0000"},"SABADELL":{img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Banco_Sabadell_logo.svg/320px-Banco_Sabadell_logo.svg.png",color:"#005C8A"},"ABANCA":{img:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/ABANCA_logo.svg/320px-ABANCA_logo.svg.png",color:"#00A3A3"},"BBVA":{img:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/BBVA_2019.svg/320px-BBVA_2019.svg.png",color:"#004481"},"BANKINTER":{img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Bankinter_logo.svg/320px-Bankinter_logo.svg.png",color:"#FF6600"},"CAIXA":{img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/CaixaBank_logo.svg/320px-CaixaBank_logo.svg.png",color:"#007BC4"}};
const BANK_COLORS={"SANTANDER":"#EC0000","SABADELL":"#005C8A","ABANCA":"#00A3A3","BBVA":"#004481","BANKINTER":"#FF6600","CAIXA":"#007BC4"};
const SOC_ORDER=["BALDORIA GROUP","BEATA BALDORIA","BEATA PASTA GROUP","BEATA PASTA GV","BEATA PASTA SMART","BEATA PASTA FELIPE","BEATA PASTA CALEIDO","BEATA PASTA SUR"];
const BANK_ORDER=['SANTANDER','SABADELL','ABANCA','BBVA','BANKINTER','CAIXA'];

// ── UTILS ──
function fmt(n,dec=2){if(n===null||n===undefined)return'—';return n.toLocaleString('es-ES',{style:'currency',currency:'EUR',minimumFractionDigits:dec,maximumFractionDigits:dec})}
function fmtK(n){if(Math.abs(n)>=1000000)return(n/1000000).toFixed(1)+'M €';if(Math.abs(n)>=1000)return(n/1000).toFixed(0)+'k €';return fmt(n)}
function ibanShort(iban){if(!iban)return'';const c=iban.replace(/\s/g,'');return c.substring(0,4)+'...'+c.slice(-4)}
function needsDark(hex){hex=(hex||'888888').replace('#','');const r=parseInt(hex.substr(0,2),16),g=parseInt(hex.substr(2,2),16),b=parseInt(hex.substr(4,2),16);return(r*299+g*587+b*114)/1000>145}
function today(){return new Date()}
function daysDiff(dateStr){const d=new Date(dateStr);const t=today();return Math.round((d-t)/(1000*60*60*24))}
function weekLabel(d){const date=new Date(d);const year=date.getFullYear();const start=new Date(year,0,1);const week=Math.ceil(((date-start)/86400000+start.getDay()+1)/7);return`S${week} (${date.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit'})})`}
function bankLogoHtml(banco,size='sm'){
  const meta=BANK_LOGOS[banco];const dim=size==='sm'?30:44;const cls=size==='sm'?'bank-logo-box':'banco-logo-big';
  if(meta)return`<div class="${cls}" style="width:${dim}px;height:${dim}px"><img src="${meta.img}" alt="${banco}" onerror="this.parentNode.innerHTML='<span style=\\'font-size:9px;font-weight:700;color:${meta.color}\\'>${banco.substring(0,3)}</span>'"></div>`;
  return`<div class="bank-logo-box" style="width:${dim}px;height:${dim}px;font-size:9px;font-weight:700">${banco.substring(0,3)}</div>`;
}
function isInternal(iban){return INTERNAL_IBANS.has((iban||'').replace(/\s/g,''))}

// ── STATUS / BANNER ──
function setStatus(t,txt){document.getElementById('status-dot').className=`sb-status-dot ${t}`;document.getElementById('status-text').textContent=txt}
function setBanner(t,ic,html){const b=document.getElementById('sync-banner');b.className=`sync-banner ${t}`;b.innerHTML=`<div style="font-size:18px">${ic}</div><div class="sync-banner-text">${html}</div>`}

// ── FETCH BALANCES ──
async function loadData(){
  const icon=document.getElementById('ri');icon.classList.add('spinning');
  setStatus('loading','Actualizando...');setBanner('loading','🔄','<strong>Actualizando saldos desde Holded...</strong>');
  try{
    const res=await fetch(`${API_BASE}/api/balances`);
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const json=await res.json();
    if(!json.success)throw new Error(json.error||'Error');
    DATA=json.data;
    const ts=new Date(json.updatedAt).toLocaleString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
    document.getElementById('sb-ts').textContent=ts;
    const nf=json.notFound||[];
    if(nf.length>0){setStatus('error',`${json.found} OK · ${nf.length} pendientes`);setBanner('error','⚠️',`<strong>${json.found} cuentas OK.</strong> ${nf.length} no encontradas en Holded.`);}
    else{setStatus('live',`${json.found} cuentas · ${ts}`);setBanner('success','✅',`<strong>Saldos actualizados.</strong> ${json.found} cuentas sincronizadas · ${ts}`);}
    buildSidebarFilters();
    populateSEPASelects();
    render();
    // Also refresh remesas and facturas silently
    loadRemesas(true);
    loadFacturas(true);
  }catch(err){setStatus('error','Error de conexión');setBanner('error','❌',`<strong>Sin conexión con el servidor.</strong> ${err.message}`);console.error(err);}
  finally{setTimeout(()=>icon.classList.remove('spinning'),700);}
}

// ── FETCH REMESAS from Holded ──
async function loadRemesas(silent=false){
  if(!silent){document.getElementById('remesas-content').innerHTML='<div class="skeleton" style="height:80px;margin-bottom:8px"></div>'.repeat(3);}
  try{
    const res=await fetch(`${API_BASE}/api/remesas`);
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const json=await res.json();
    REMESAS_DATA=json.data||[];
    if(currentTab==='remesas')renderRemesas();
  }catch(err){if(!silent)document.getElementById('remesas-content').innerHTML=`<div style="padding:20px;color:var(--red);font-size:13px">❌ Error al cargar remesas: ${err.message}</div>`;}
}

// loadFacturas → defined in FACTURAS & SEPA section below

// ── AUTO REFRESH ──
function toggleAuto(){
  autoEnabled=!autoEnabled;const btn=document.getElementById('auto-btn');
  if(autoEnabled){autoInterval=setInterval(()=>{loadData();},60000);btn.style.background='var(--green)';btn.style.color='white';btn.textContent='⏱ ON·60s';}
  else{clearInterval(autoInterval);btn.style.background='';btn.style.color='';btn.textContent='⏱ Auto';}
}

// ── FILTER / SIDEBAR ──
function buildSidebarFilters(){
  const socs=[...new Set(DATA.map(d=>d.sociedad))];
  let html=`<button class="sb-filter-btn ${currentFilter==='all'?'active':''}" onclick="setFilter('all')"><div class="sb-dot" style="background:var(--rust)"></div>Todas</button>`;
  socs.forEach(s=>{const col=SOC_COLORS[s]||'#888';html+=`<button class="sb-filter-btn ${currentFilter===s?'active':''}" onclick="setFilter('${s.replace(/'/g,"\\'")}')"><div class="sb-dot" style="background:${col}"></div>${s}</button>`});
  document.getElementById('sb-filters').innerHTML=html;
}
function setFilter(f){
  currentFilter=f;
  buildSidebarFilters();
  render();
  // Sync CF13 select
  const cfSel=document.getElementById('cf-sociedad-select');
  if(cfSel) cfSel.value = f==='all'?'all':f;
  if(currentTab==='cf13') renderCF13();
  // Sync Facturas f-sociedad dropdown
  const fSocSel=document.getElementById('f-sociedad');
  if(fSocSel){ fSocSel.value = f==='all'?'':f; applyFacturaFilters(); }
}
function getFiltered(){return currentFilter==='all'?DATA:DATA.filter(d=>d.sociedad===currentFilter)}

// ── TAB SWITCH ──
function switchTab(tab){
  currentTab=tab;
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  document.getElementById('panel-'+tab).classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
  const sbMap={sociedad:0,banco:1,restaurante:2,graficos:3,traspasos:4,cf13:5,facturas:6,remesas:7};
  document.querySelectorAll('.sb-item')[sbMap[tab]]?.classList.add('active');
  render();
  if(tab==='facturas'&&FACTURAS_ALL.length===0)loadFacturas();
  if(tab==='remesas'&&REMESAS_DATA.length===0)loadRemesas();
}

// ── COLLAPSE ──
function toggleCard(id){
  collapseState[id]=!collapseState[id];
  const rows=document.getElementById('rows-'+id);
  const icon=document.getElementById('icon-'+id);
  if(rows)rows.classList.toggle('collapsed',collapseState[id]);
  if(icon)icon.classList.toggle('open',!collapseState[id]);
}
function toggleBanco(id){
  const key='banco-'+id;collapseState[key]=!collapseState[key];
  const tbl=document.getElementById('table-'+id);const icon=document.getElementById('bicon-'+id);
  if(tbl)tbl.classList.toggle('collapsed',collapseState[key]);
  if(icon)icon.classList.toggle('open',!collapseState[key]);
}

// ═══════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════
function render(){
  const rows=getFiltered();
  renderKPIs(rows);
  if(currentTab==='sociedad')renderSociedad(rows);
  else if(currentTab==='banco')renderBanco(rows);
  else if(currentTab==='restaurante')renderRestaurante(rows);
  else if(currentTab==='graficos')renderGraficos(rows);
  else if(currentTab==='traspasos')renderTraspasos();
  else if(currentTab==='cf13')renderCF13();
  else if(currentTab==='facturas')renderFacturasTable();
  else if(currentTab==='remesas')renderRemesas();
}

// ── KPIs ──
function renderKPIs(rows){
  const total=rows.reduce((s,r)=>s+(r.saldo||0),0);
  const socs=[...new Set(rows.map(r=>r.sociedad))];const banks=[...new Set(rows.map(r=>r.banco))];
  const maxV=Math.max(...rows.map(r=>r.saldo||0));const topRow=rows.find(r=>r.saldo===maxV);
  // Filter facturas by current sociedad filter (same as balance rows)
  const _facSoc = (currentFilter==='all' ? FACTURAS_ALL : FACTURAS_ALL.filter(f=>f.sociedad===currentFilter)).filter(f=>f.type!=='income');
  const vencidas=_facSoc.filter(f=>daysDiff(f.vencimiento)<0).reduce((s,f)=>s+(f.pendiente||0),0);
  const proximas=_facSoc.filter(f=>daysDiff(f.vencimiento)>=0&&daysDiff(f.vencimiento)<=7).reduce((s,f)=>s+(f.pendiente||0),0);
  document.getElementById('kpi-grid').innerHTML=`
    <div class="kpi accent"><div class="kpi-label">Saldo Total</div><div class="kpi-value pos num">${fmt(total)}</div><div class="kpi-sub">${rows.length} cuentas · ${socs.length} sociedades</div></div>
    <div class="kpi"><div class="kpi-label">Mayor posición</div><div class="kpi-value num" style="font-size:19px">${fmtK(maxV)}</div><div class="kpi-sub">${topRow?.sociedad||'—'} · ${topRow?.restaurante||'—'}</div></div>
    <div class="kpi"><div class="kpi-label">Bancos activos</div><div class="kpi-value num">${banks.length}</div><div class="kpi-sub">${rows.filter(r=>(r.saldo||0)>0).length} cuentas con saldo</div></div>
    <div class="kpi ${vencidas>0?'danger':''}"><div class="kpi-label">Facturas vencidas</div><div class="kpi-value neg num" style="font-size:19px">${vencidas>0?fmt(vencidas):'—'}</div><div class="kpi-sub">${_facSoc.filter(f=>daysDiff(f.vencimiento)<0).length} facturas${currentFilter!=='all'?' · '+currentFilter:''}</div></div>
    <div class="kpi ${proximas>0?'warn':''}"><div class="kpi-label">Vence en 7 días</div><div class="kpi-value num" style="font-size:19px;color:var(--amber)">${proximas>0?fmt(proximas):'—'}</div><div class="kpi-sub">${_facSoc.filter(f=>daysDiff(f.vencimiento)>=0&&daysDiff(f.vencimiento)<=7).length} facturas${currentFilter!=='all'?' · '+currentFilter:''}</div></div>`;
}

// ── SOCIEDAD ──
function renderSociedad(rows){
  const order=SOC_ORDER;let html='',count=0;
  order.forEach(soc=>{
    const sRows=rows.filter(r=>r.sociedad===soc);if(!sRows.length)return;count++;
    const id='soc-'+soc.replace(/\W/g,'_');
    const isOpen=collapseState[id]===undefined?true:!collapseState[id];
    const total=sRows.reduce((s,r)=>s+(r.saldo||0),0);
    const col=SOC_COLORS[soc]||'#888';const banks=[...new Set(sRows.map(r=>r.banco))];
    const textCol=needsDark(col)?'#1A1814':col;
    let rowsHtml='';
    sRows.forEach((r,i)=>{
      if(i>0)rowsHtml+=`<div class="bank-row-divider"></div>`;
      // alert chip
      const facV=FACTURAS_ALL.filter(f=>f.sociedad===soc&&daysDiff(f.vencimiento)<0).reduce((s,f)=>s+(f.pendiente||0),0);
      const alertHtml=facV>0?'<div class="alert-chip red" style="margin-top:2px">⚠ '+fmt(facV)+' vencido</div>':'';
      rowsHtml+=`<div class="bank-row">
        ${bankLogoHtml(r.banco)}
        <div class="bank-info">
          <div class="bank-name">${r.banco}</div>
          <div class="bank-iban">${ibanShort(r.iban)}</div>
          <div class="bank-holded">${r.holdedName||''}</div>
          ${alertHtml}
        </div>
        <div style="text-align:right">
          <div class="bank-amount ${(r.saldo||0)===0?'zero':''} num">${r.saldo===null?'⚠':fmt(r.saldo)}</div>
        </div>
      </div>`;
    });
    const maxH=sRows.length*100+48; // generous height per row (alerts, holded name)
    html+=`<div class="entity-card" style="animation-delay:${count*0.035}s">
      <div class="entity-header" onclick="toggleCard('${id}')">
        <div class="entity-accent-bar" style="background:${col}"></div>
        <div class="entity-name-wrap">
          <div class="entity-name">${soc}</div>
          <div class="entity-tag" style="background:${col}22;color:${textCol}">${banks.join(' · ')}</div>
        </div>
        <div style="text-align:right;margin-right:6px">
          <div class="entity-total-amount num">${fmt(total)}</div>
          <div class="entity-total-label">${sRows.length} cuenta${sRows.length>1?'s':''}</div>
        </div>
        <div class="collapse-icon ${isOpen?'open':''}" id="icon-${id}">▼</div>
      </div>
      <div class="bank-rows ${isOpen?'':'collapsed'}" id="rows-${id}" style="max-height:${maxH}px">${rowsHtml}</div>
    </div>`;
  });
  document.getElementById('grid-sociedad').innerHTML=html;
  document.getElementById('meta-sociedad').textContent=`${count} sociedades`;
}

// ── BANCO (grouped) ──
function renderBanco(rows){
  let html='';
  BANK_ORDER.forEach((banco,bi)=>{
    const bRows=rows.filter(r=>r.banco===banco);if(!bRows.length)return;
    const total=bRows.reduce((s,r)=>s+(r.saldo||0),0);
    const bid='banco-'+banco.replace(/\W/g,'_');
    const isOpen=collapseState[bid]===undefined?true:!collapseState[bid];
    // Group by restaurante
    const restMap={};
    bRows.forEach(r=>{if(!restMap[r.restaurante])restMap[r.restaurante]={sociedad:r.sociedad,cuentas:[]};restMap[r.restaurante].cuentas.push(r);});
    let tableRows='';
    Object.entries(restMap).sort(([a],[b])=>a.localeCompare(b)).forEach(([rest,g])=>{
      const totalR=g.cuentas.reduce((s,r)=>s+(r.saldo||0),0);
      const col=SOC_COLORS[g.sociedad]||'#888';
      if(g.cuentas.length===1){
        const r=g.cuentas[0];
        tableRows+=`<div class="bt-row">
          <div class="bt-cell" style="font-weight:500"><span class="bt-tag" style="background:${col}"></span>${g.sociedad}</div>
          <div class="bt-cell">${rest}</div>
          <div class="bt-cell" style="font-family:var(--font-mono);font-size:10px;color:var(--ink4)">${ibanShort(r.iban)}</div>
          <div class="bt-saldo num">${r.saldo===null?'—':fmt(r.saldo)}</div>
          <div class="bt-saldo num" style="color:var(--ink4);font-size:11px">—</div>
        </div>`;
      }else{
        tableRows+=`<div class="bt-row" style="background:rgba(26,24,20,0.02)">
          <div class="bt-cell" style="font-weight:500"><span class="bt-tag" style="background:${col}"></span>${g.sociedad}</div>
          <div class="bt-cell" style="font-weight:600">${rest} <span style="font-size:9.5px;color:var(--ink4);font-weight:400">(${g.cuentas.length})</span></div>
          <div class="bt-cell" style="font-size:9.5px;color:var(--ink4)">múltiples IBANs</div>
          <div class="bt-saldo num" style="font-weight:600">${fmt(totalR)}</div>
          <div class="bt-saldo num" style="color:var(--ink4);font-size:11px">suma</div>
        </div>`;
        g.cuentas.forEach(r=>{
          tableRows+=`<div class="bt-sub-row">
            <div></div>
            <div style="font-size:10px;color:var(--ink4);padding-left:10px">↳ ${r.holdedName||r.sociedad}</div>
            <div style="font-family:var(--font-mono);font-size:9.5px;color:var(--ink4)">${ibanShort(r.iban)}</div>
            <div style="font-family:var(--font-num);font-size:12px;text-align:right;color:var(--ink3)">${fmt(r.saldo)}</div>
            <div></div>
          </div>`;
        });
      }
    });
    html+=`<div class="banco-section" style="animation-delay:${bi*0.04}s">
      <div class="banco-header" onclick="toggleBanco('${banco.replace(/\W/g,'_')}')">
        ${bankLogoHtml(banco,'lg')}
        <div><div class="banco-name-main">${banco}</div><div style="font-size:10.5px;color:var(--ink4)">${bRows.length} cuentas · ${Object.keys(restMap).length} restaurantes</div></div>
        <div class="banco-total-amt num">${fmt(total)}</div>
        <div class="collapse-icon ${isOpen?'open':''} " id="bicon-${banco.replace(/\W/g,'_')}" style="color:var(--ink4);margin-left:10px">▼</div>
      </div>
      <div class="banco-table ${isOpen?'':'collapsed'}" id="table-${banco.replace(/\W/g,'_')}">
        <div class="bt-head"><div>Sociedad</div><div>Restaurante</div><div>IBAN</div><div style="text-align:right">Saldo</div><div style="text-align:right">Detalle</div></div>
        ${tableRows}
      </div>
    </div>`;
  });
  document.getElementById('grid-banco').innerHTML=html;
  document.getElementById('meta-banco').textContent=`${[...new Set(rows.map(r=>r.banco))].length} bancos`;
}

// ── RESTAURANTE (collapsible) ──
function renderRestaurante(rows){
  const rests=[...new Set(DATA.map(d=>d.restaurante))].sort();let html='',count=0;
  rests.forEach(rest=>{
    const rRows=rows.filter(r=>r.restaurante===rest);if(!rRows.length)return;count++;
    const id='rest-'+rest.replace(/\W/g,'_');const isOpen=collapseState[id]===undefined?true:!collapseState[id];
    const total=rRows.reduce((s,r)=>s+(r.saldo||0),0);const col=rRows[0].color||'#888';
    let rowsHtml='';
    rRows.forEach((r,i)=>{
      if(i>0)rowsHtml+=`<div class="bank-row-divider"></div>`;
      rowsHtml+=`<div class="bank-row">${bankLogoHtml(r.banco)}<div class="bank-info"><div class="bank-name">${r.banco} <span style="color:var(--ink4);font-weight:400">· ${r.sociedad}</span></div><div class="bank-iban">${ibanShort(r.iban)}</div></div><div class="bank-amount ${(r.saldo||0)===0?'zero':''} num">${r.saldo===null?'—':fmt(r.saldo)}</div></div>`;
    });
    const maxH=rRows.length*56+20;
    html+=`<div class="entity-card" style="animation-delay:${count*0.035}s">
      <div class="entity-header" onclick="toggleCard('${id}')">
        <div class="entity-accent-bar" style="background:${col}"></div>
        <div class="entity-name-wrap"><div class="entity-name" style="font-size:18px">${rest}</div><div style="font-size:10.5px;color:var(--ink4);margin-top:3px">${[...new Set(rRows.map(r=>r.sociedad))].join(', ')}</div></div>
        <div style="text-align:right;margin-right:6px"><div class="entity-total-amount num">${fmt(total)}</div><div class="entity-total-label">${rRows.length} cuenta${rRows.length>1?'s':''}</div></div>
        <div class="collapse-icon ${isOpen?'open':''}" id="icon-${id}">▼</div>
      </div>
      <div class="bank-rows ${isOpen?'':'collapsed'}" id="rows-${id}" style="max-height:${maxH}px">${rowsHtml}</div>
    </div>`;
  });
  document.getElementById('grid-restaurante').innerHTML=html;
  document.getElementById('meta-rest').textContent=`${count} restaurantes`;
}

// ── GRÁFICOS (pie charts) ──
function renderGraficos(rows){
  // Bar charts
  const socMap={},bancMap={},restMap={};
  rows.forEach(r=>{socMap[r.sociedad]=(socMap[r.sociedad]||0)+(r.saldo||0);bancMap[r.banco]=(bancMap[r.banco]||0)+(r.saldo||0);restMap[r.restaurante]=(restMap[r.restaurante]||0)+(r.saldo||0);});
  function makeBar(map,colorFn){const sorted=Object.entries(map).sort((a,b)=>b[1]-a[1]);const max=sorted[0]?.[1]||1;return sorted.map(([name,val])=>{const pct=Math.round((val/max)*100);const short=name.length>16?name.substring(0,15)+'…':name;return`<div class="bar-row"><div class="bar-label" title="${name}">${short}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${colorFn(name)}"></div></div><div class="bar-val num">${fmt(val)}</div></div>`}).join('')}
  document.getElementById('bar-grid').innerHTML=`
    <div class="analysis-card"><div class="analysis-title">Por Sociedad</div>${makeBar(socMap,n=>SOC_COLORS[n]||'#888')}</div>
    <div class="analysis-card"><div class="analysis-title">Por Banco</div>${makeBar(bancMap,n=>BANK_COLORS[n]||'#888')}</div>
    <div class="analysis-card"><div class="analysis-title">Por Restaurante</div>${makeBar(restMap,n=>rows.find(r=>r.restaurante===n)?.color||'#888')}</div>
    <div class="analysis-card"><div class="analysis-title">Concentración bancaria (%)</div>${(()=>{const total=Object.values(bancMap).reduce((s,v)=>s+v,0)||1;return Object.entries(bancMap).sort((a,b)=>b[1]-a[1]).map(([name,val])=>{const pct=((val/total)*100).toFixed(1);return`<div class="bar-row"><div class="bar-label">${name}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${BANK_COLORS[name]||'#888'}"></div></div><div class="bar-val num">${pct}%</div></div>`}).join('')})()}</div>`;

  // Pie charts (Canvas)
  const pieConfigs=[
    {title:'Distribución por Banco',map:bancMap,colorFn:n=>BANK_COLORS[n]||'#888'},
    {title:'Distribución por Sociedad',map:socMap,colorFn:n=>SOC_COLORS[n]||'#888'},
    {title:'Distribución por Restaurante',map:restMap,colorFn:n=>rows.find(r=>r.restaurante===n)?.color||'#888'},
  ];
  let pieHtml='';
  pieConfigs.forEach((cfg,ci)=>{
    const total=Object.values(cfg.map).reduce((s,v)=>s+v,0)||1;
    const entries=Object.entries(cfg.map).sort((a,b)=>b[1]-a[1]);
    let legendHtml=entries.map(([name,val])=>{const pct=((val/total)*100).toFixed(1);const short=name.length>18?name.substring(0,17)+'…':name;return`<div class="pie-legend-item"><div class="pie-legend-dot" style="background:${cfg.colorFn(name)}"></div><span>${short}</span><span class="pie-legend-val num">${fmtK(val)}</span><span class="pie-legend-pct">${pct}%</span></div>`}).join('');
    pieHtml+=`<div class="pie-card"><div class="pie-title">${cfg.title}</div><div class="pie-canvas-wrap"><canvas class="pie-canvas" id="pie-${ci}" width="180" height="180"></canvas></div><div class="pie-legend">${legendHtml}</div></div>`;
  });
  document.getElementById('pie-grid').innerHTML=pieHtml;

  // Draw pies after DOM
  requestAnimationFrame(()=>{
    pieConfigs.forEach((cfg,ci)=>{
      const canvas=document.getElementById('pie-'+ci);if(!canvas)return;
      const ctx=canvas.getContext('2d');
      const total=Object.values(cfg.map).reduce((s,v)=>s+v,0)||1;
      const entries=Object.entries(cfg.map).sort((a,b)=>b[1]-a[1]);
      let startAngle=-Math.PI/2;const cx=90,cy=90,r=75;
      ctx.clearRect(0,0,180,180);
      entries.forEach(([name,val])=>{
        const sliceAngle=(val/total)*(2*Math.PI);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAngle,startAngle+sliceAngle);ctx.closePath();
        ctx.fillStyle=cfg.colorFn(name);ctx.fill();
        ctx.strokeStyle='#F5F0E8';ctx.lineWidth=2;ctx.stroke();
        startAngle+=sliceAngle;
      });
      // Center hole (donut)
      ctx.beginPath();ctx.arc(cx,cy,38,'0',Math.PI*2);ctx.fillStyle='white';ctx.fill();
      ctx.fillStyle='#1A1814';ctx.font='bold 13px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(fmtK(total),cx,cy);
    });
  });

  // Suggestions
  const topBanc=Object.entries(bancMap).sort((a,b)=>b[1]-a[1])[0];
  const total=Object.values(bancMap).reduce((s,v)=>s+v,0)||1;
  const topPct=((topBanc[1]/total)*100).toFixed(0);
  const zeros=rows.filter(r=>(r.saldo||0)===0).length;
  document.getElementById('suggestions-block').innerHTML=`<div class="sug-title">💡 Recomendaciones</div>
    <div class="sug-item"><div style="font-size:16px">⚠️</div><div class="sug-text"><strong>Concentración:</strong> ${topBanc[0]} concentra el ${topPct}% del saldo. Considera diversificar.</div></div>
    <div class="sug-item"><div style="font-size:16px">📊</div><div class="sug-text"><strong>Cuentas en cero:</strong> ${zeros} cuenta${zeros>1?'s':''} con saldo 0 €. Evalúa si se pueden cerrar.</div></div>`;
}

// ── TRASPASOS ──
function renderTraspasos(){
  // Detect internal transfers from all remesas
  const internals=[];
  REMESAS_DATA.forEach(rem=>{
    (rem.transactions||[]).forEach(tx=>{
      if(isInternal(tx.creditorIBAN)){internals.push({...tx,remesaId:rem.id,remesaDate:rem.date,remesaStatus:rem.status,sociedad:rem.sociedad});}
    });
  });

  const totalInternos=internals.reduce((s,t)=>s+(t.amount||0),0);
  const pendientes=internals.filter(t=>t.remesaStatus!=='completed').length;
  document.getElementById('meta-traspasos').textContent=`${internals.length} traspasos detectados`;
  document.getElementById('traspasos-kpis').innerHTML=`
    <div class="kpi"><div class="kpi-label">Total traspasos</div><div class="kpi-value num" style="color:var(--purple)">${fmt(totalInternos)}</div><div class="kpi-sub">${internals.length} movimientos</div></div>
    <div class="kpi"><div class="kpi-label">Pendientes</div><div class="kpi-value num">${pendientes}</div><div class="kpi-sub">Sin completar</div></div>
    <div class="kpi"><div class="kpi-label">Completados</div><div class="kpi-value num" style="color:var(--green)">${internals.length-pendientes}</div><div class="kpi-sub">Realizados</div></div>`;

  if(internals.length===0){
    document.getElementById('traspasos-content').innerHTML=`<div style="text-align:center;padding:60px;color:var(--ink4)"><div style="font-size:40px;margin-bottom:12px">🔄</div><div style="font-family:var(--font-display);font-size:20px">Sin traspasos detectados</div><div style="font-size:13px;margin-top:6px">Los traspasos aparecen cuando el IBAN destinatario es una de tus propias cuentas</div></div>`;
    return;
  }

  // Group by sociedad
  const byDate={};
  internals.forEach(t=>{const d=t.remesaDate?.substring(0,10)||'Sin fecha';if(!byDate[d])byDate[d]=[];byDate[d].push(t);});

  let html=`<div style="background:white;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">`;
  Object.entries(byDate).sort(([a],[b])=>b.localeCompare(a)).forEach(([date,txs])=>{
    html+=`<div style="padding:10px 18px;background:var(--cream2);border-bottom:1px solid var(--border);font-size:11px;color:var(--ink4);letter-spacing:.8px;text-transform:uppercase">${date} · ${txs.length} traspaso${txs.length>1?'s':''}</div>`;
    txs.forEach(tx=>{
      const destName=findAccountName(tx.creditorIBAN);
      const srcName=DATA.find(d=>d.iban?.replace(/\s/g,'')===tx.debtorIBAN?.replace(/\s/g,''))?.holdedName||tx.sociedad||'—';
      html+=`<div class="traspaso-flow">
        <div class="flow-account">
          <div class="flow-account-name">${srcName}</div>
          <div class="flow-account-bank">${tx.debtorIBAN?ibanShort(tx.debtorIBAN):''}</div>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-account" style="border-color:rgba(107,63,160,0.3)">
          <div class="flow-account-name">${destName}</div>
          <div class="flow-account-bank">${ibanShort(tx.creditorIBAN)}</div>
        </div>
        <div>
          <div class="flow-amount num">+${fmt(tx.amount)}</div>
          <div class="flow-concept">${tx.concept||tx.creditorName||''}</div>
        </div>
        <div style="margin-left:10px">
          <span class="remesa-status ${tx.remesaStatus==='completed'?'completed':tx.remesaStatus==='sent'?'sent':'pending'}">${tx.remesaStatus==='completed'?'✓ Completado':tx.remesaStatus==='sent'?'📤 Enviado':'⏳ Pendiente'}</span>
        </div>
      </div>`;
    });
  });
  html+=`</div>`;
  document.getElementById('traspasos-content').innerHTML=html;
}

function findAccountName(iban){
  const clean=(iban||'').replace(/\s/g,'');
  const acc=DATA.find(d=>(d.iban||'').replace(/\s/g,'')===clean);
  return acc?acc.holdedName||acc.restaurante:'Cuenta interna';
}

// ── CF 13 SEMANAS ──
function renderCF13(){
  // Sync with sidebar currentFilter (set by setFilter()) AND cf-sociedad-select dropdown
  const selVal = document.getElementById('cf-sociedad-select')?.value||'all';
  const socFilter = (currentFilter && currentFilter !== 'all') ? currentFilter : selVal;
  // Keep the dropdown in sync
  const cfSelEl = document.getElementById('cf-sociedad-select');
  if (cfSelEl && cfSelEl.value !== socFilter) cfSelEl.value = socFilter;
  const facts=socFilter==='all'?FACTURAS_ALL:FACTURAS_ALL.filter(f=>f.sociedad===socFilter);
  if(facts.length===0){document.getElementById('cf13-content').innerHTML=`<div style="text-align:center;padding:60px;color:var(--ink4)"><div style="font-size:40px">📅</div><div style="font-family:var(--font-display);font-size:20px;margin-top:12px">Sin datos de facturas</div><div style="font-size:13px;margin-top:6px">Carga las facturas desde Holded</div><button class="btn btn-dark" style="margin:16px auto 0;display:inline-flex" onclick="loadFacturas()">Cargar facturas</button></div>`;return;}

  // Group by week (13 weeks from today)
  const weeks=[];
  const startDate=new Date();startDate.setHours(0,0,0,0);
  for(let w=0;w<13;w++){
    const wStart=new Date(startDate);wStart.setDate(wStart.getDate()+w*7);
    const wEnd=new Date(wStart);wEnd.setDate(wEnd.getDate()+6);
    weeks.push({start:wStart,end:wEnd,ingresos:[],gastos:[]});
  }
  // Add past (vencidas) to week 0
  // Separate cobros (income) from pagos (expenses)
  const expFacts = facts.filter(f=>f.type!=='income');
  const incFacts = facts.filter(f=>f.type==='income');
  expFacts.forEach(f=>{
    const d=new Date(f.vencimiento);const amt=f.pendiente||0;if(!amt)return;
    let placed=false;
    weeks.forEach(w=>{if(d>=w.start&&d<=w.end){w.gastos.push(amt);placed=true;}});
    if(!placed&&d<weeks[0].start) weeks[0].gastos.push(amt);
  });
  incFacts.forEach(f=>{
    const d=new Date(f.vencimiento);const amt=f.pendiente||0;if(!amt)return;
    let placed=false;
    weeks.forEach(w=>{if(d>=w.start&&d<=w.end){w.ingresos.push(amt);placed=true;}});
    if(!placed) weeks[0].ingresos.push(amt);
  });

  // Build saldo acumulado
  const currentCash=DATA.filter(d=>socFilter==='all'||d.sociedad===socFilter).reduce((s,r)=>s+(r.saldo||0),0);
  let acum=currentCash;
  let rowsHtml=`<div class="cf-week-row cf-week-head"><div>Semana</div><div style="text-align:right">Cobros</div><div style="text-align:right">Pagos</div><div style="text-align:right">Neto</div><div style="text-align:right">Saldo acum.</div></div>`;
  weeks.forEach((w,i)=>{
    const ingr=w.ingresos.reduce((s,v)=>s+v,0);
    const gast=w.gastos.reduce((s,v)=>s+v,0);
    const neto=ingr-gast;acum+=neto;
    const cls=acum<0?'negative':neto>=0?'positive':'';
    rowsHtml+=`<div class="cf-week-row ${cls}">
      <div style="font-size:11px;color:var(--ink3)">${i===0?'Vencidas':weekLabel(w.start)}</div>
      <div class="cf-num pos">${ingr>0?'+'+fmt(ingr):'—'}</div>
      <div class="cf-num neg">${gast>0?'−'+fmt(gast):'—'}</div>
      <div class="cf-num ${neto>=0?'pos':'neg'}">${neto>=0?'+':''} ${fmt(neto)}</div>
      <div class="cf-num ${acum<0?'neg cf-acum':''}">${fmt(acum)}</div>
    </div>`;
  });

  const totalIngr=weeks.reduce((s,w)=>s+w.ingresos.reduce((a,v)=>a+v,0),0);
  const totalGast=weeks.reduce((s,w)=>s+w.gastos.reduce((a,v)=>a+v,0),0);
  const vencidas  = facts.filter(f=>daysDiff(f.vencimiento)<0).reduce((s,f)=>s+(f.pendiente||0),0);
  const proximas7 = facts.filter(f=>{const d=daysDiff(f.vencimiento);return d>=0&&d<=7;}).reduce((s,f)=>s+(f.pendiente||0),0);
  const nVenc     = facts.filter(f=>daysDiff(f.vencimiento)<0).length;
  const nProx     = facts.filter(f=>{const d=daysDiff(f.vencimiento);return d>=0&&d<=7;}).length;
  const socLabel  = socFilter==='all'?'Todas las sociedades':socFilter;
  document.getElementById('cf13-content').innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(2,1fr) repeat(3,1fr);gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <div class="kpi ${vencidas>0?'warn':''}">
        <div class="kpi-label">Facturas Vencidas</div>
        <div class="kpi-value num" style="font-size:20px;color:var(--red)">${vencidas>0?fmt(vencidas):'—'}</div>
        <div class="kpi-sub">${nVenc} facturas · ${socLabel}</div>
      </div>
      <div class="kpi ${proximas7>0?'warn':''}">
        <div class="kpi-label">Vence en 7 días</div>
        <div class="kpi-value num" style="font-size:20px;color:var(--amber)">${proximas7>0?fmt(proximas7):'—'}</div>
        <div class="kpi-sub">${nProx} facturas · ${socLabel}</div>
      </div>
      <div class="kpi"><div class="kpi-label">Saldo actual</div><div class="kpi-value pos num" style="font-size:20px">${fmt(currentCash)}</div><div class="kpi-sub">${socLabel}</div></div>
      <div class="kpi"><div class="kpi-label">Cobros previstos (13 sem)</div><div class="kpi-value num" style="font-size:20px;color:var(--green)">${fmt(totalIngr)}</div></div>
      <div class="kpi"><div class="kpi-label">Pagos previstos (13 sem)</div><div class="kpi-value num" style="font-size:20px;color:var(--red)">−${fmt(totalGast)}</div></div>
    </div>
    <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div class="cf-card" style="flex:1;min-width:340px">
        <div class="cf-title">Proyección semanal — ${socLabel}</div>
        ${rowsHtml}
      </div>
      <div class="cf-card" style="flex:1;min-width:340px">
        <div class="cf-title">Cobros / Pagos por semana — ${socLabel}</div>
        <canvas id="cf13-chart" style="width:100%;display:block" height="420"></canvas>
      </div>
    </div>
    <div style="font-size:11px;color:var(--ink4);margin-top:10px">⚠ Las semanas en rojo indican saldo acumulado negativo. Los cobros y pagos son estimaciones basadas en fechas de vencimiento de Holded.</div>`;
  // Render bar chart after DOM update
  setTimeout(()=>renderCF13Chart(weeks), 50);
}


// ── CF13 BAR CHART ─────────────────────────────────────────────────
function renderCF13Chart(weeks) {
  const canvas = document.getElementById('cf13-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  // Use full parent width for the chart
  const parent = canvas.parentElement;
  const W = (parent ? parent.clientWidth - 32 : 0) || canvas.offsetWidth || 800;
  const H = 420;
  canvas.width  = W;
  canvas.height = H;

  const labels = weeks.map((w,i) => i===0 ? 'Venc.' : weekLabel(w.start).replace(' sem',''));
  const cobros = weeks.map(w => w.ingresos.reduce((s,v)=>s+v,0));
  const pagos  = weeks.map(w => w.gastos.reduce((s,v)=>s+v,0));
  const maxVal = Math.max(...cobros, ...pagos, 1);

  const pad = {top:20, right:10, bottom:60, left:50};
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top  - pad.bottom;
  const n = weeks.length;
  const groupW = chartW / n;
  const barW   = Math.max(4, groupW * 0.35);

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = '#e8e2d8';
  ctx.lineWidth = 1;
  for (let i=0; i<=4; i++) {
    const y = pad.top + chartH * (1 - i/4);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W-pad.right, y); ctx.stroke();
    ctx.fillStyle = '#9A9185';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(fmtK(maxVal*i/4), pad.left-4, y+3);
  }

  // Bars
  weeks.forEach((w,i) => {
    const x = pad.left + i*groupW + groupW/2;
    // Cobros (green)
    if (cobros[i] > 0) {
      const bh = (cobros[i]/maxVal)*chartH;
      ctx.fillStyle = 'rgba(42,122,86,0.8)';
      ctx.fillRect(x - barW - 1, pad.top + chartH - bh, barW, bh);
    }
    // Pagos (red)
    if (pagos[i] > 0) {
      const bh = (pagos[i]/maxVal)*chartH;
      ctx.fillStyle = 'rgba(192,57,43,0.8)';
      ctx.fillRect(x + 1, pad.top + chartH - bh, barW, bh);
    }
    // X label
    ctx.fillStyle = '#6B6358';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(x, H - pad.bottom + 14);
    ctx.rotate(-0.6);
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  });

  // Axis
  ctx.strokeStyle = '#c8c0b0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top+chartH); ctx.lineTo(W-pad.right, pad.top+chartH);
  ctx.stroke();

  // Legend
  ctx.fillStyle = 'rgba(42,122,86,0.8)'; ctx.fillRect(pad.left, H-16, 10, 8);
  ctx.fillStyle = '#3D3830'; ctx.font='9px sans-serif'; ctx.textAlign='left';
  ctx.fillText('Cobros', pad.left+13, H-9);
  ctx.fillStyle = 'rgba(192,57,43,0.8)'; ctx.fillRect(pad.left+65, H-16, 10, 8);
  ctx.fillText('Pagos', pad.left+78, H-9);
}

// ═══════════════════════════════════════════════════════════════════
// FACTURAS & SEPA
// ═══════════════════════════════════════════════════════════════════
let FACTURAS_ALL = [];
let FACTURAS_FILTERED = [];
let estadoFilter = 'all';

async function loadFacturas(silent=false) {
  if (!silent) {
    const el = document.getElementById('facturas-content');
    if (el) el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--ink4)"><div style="font-size:28px">⏳</div><div style="margin-top:10px;font-size:13px">Cargando facturas desde Holded...</div></div>';
  }
  try {
    const res = await fetch(`${API_BASE}/api/facturas`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    FACTURAS_ALL = json.data || [];

    // Update vencidas badge
    const nVenc = FACTURAS_ALL.filter(f => daysDiff(f.vencimiento) < 0).length;
    const badge = document.getElementById('badge-vencidas');
    if (badge) { badge.textContent = nVenc; badge.style.display = nVenc > 0 ? 'inline-flex' : 'none'; }

    // Populate CF13 select
    const cfSel = document.getElementById('cf-sociedad-select');
    if (cfSel) {
      const socs = [...new Set(FACTURAS_ALL.map(f => f.sociedad).filter(Boolean))].sort();
      socs.forEach(s => {
        if (!cfSel.querySelector(`option[value="${s}"]`)) {
          const o = document.createElement('option'); o.value = s; o.textContent = s; cfSel.appendChild(o);
        }
      });
    }
    populateFacturaFilters();
    populateSEPASelects();
    applyFacturaFilters();
    if (currentTab === 'cf13') renderCF13();
    if (json.errors && json.errors.length > 0) {
      console.warn('Facturas errors:', json.errors);
    }
  } catch(err) {
    if (!silent) {
      const el = document.getElementById('facturas-content');
      if (el) el.innerHTML = `<div style="padding:20px;color:var(--red);font-size:13px">❌ Error al cargar facturas: ${err.message}</div>`;
    }
    console.error('loadFacturas:', err);
  }
}

function populateFacturaFilters() {
  const socSel  = document.getElementById('f-sociedad');
  const projSel = document.getElementById('f-proyecto');
  if (!socSel || !projSel) return;
  const curSoc  = socSel.value;
  const curProj = projSel.value;
  const socs  = [...new Set(FACTURAS_ALL.map(f => f.sociedad).filter(Boolean))].sort();
  const projs = [...new Set(FACTURAS_ALL.map(f => f.proyecto).filter(x => x && x.trim()))].sort();
  socSel.innerHTML  = '<option value="">Todas las sociedades</option>' + socs.map(s => `<option value="${s}">${s}</option>`).join('');
  projSel.innerHTML = '<option value="">Todos los proyectos</option>' + projs.map(p => `<option value="${p}">${p}</option>`).join('');
  if (curSoc)  socSel.value  = curSoc;
  if (curProj) projSel.value = curProj;
}

function applyFacturaFilters() {
  const socF  = document.getElementById('f-sociedad')?.value  || '';
  const projF = document.getElementById('f-proyecto')?.value || '';
  let f = FACTURAS_ALL.filter(x=>x.type!=='income');
  if (socF)  f = f.filter(x => x.sociedad === socF);
  if (projF) f = f.filter(x => x.proyecto === projF);
  if (estadoFilter === 'vencidas') f = f.filter(x => daysDiff(x.vencimiento) < 0);
  else if (estadoFilter === '7d')  f = f.filter(x => { const d=daysDiff(x.vencimiento); return d>=0&&d<=7; });
  else if (estadoFilter === '30d') f = f.filter(x => { const d=daysDiff(x.vencimiento); return d>=0&&d<=30; });
  FACTURAS_FILTERED = f;
  renderFacturasTable();
  // Sync sidebar highlight with f-sociedad value
  if(socF && currentFilter !== socF){ currentFilter=socF; buildSidebarFilters(); }
  else if(!socF && currentFilter !== 'all'){ currentFilter='all'; buildSidebarFilters(); }
}

function setEstadoFilter(f, btn) {
  estadoFilter = f;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFacturaFilters();
}

// Track collapsed state per sociedad
const socCollapsed = {};

function toggleSocCollapse(socKey) {
  socCollapsed[socKey] = !socCollapsed[socKey];
  const body = document.getElementById('soc-body-'+socKey);
  const arrow = document.getElementById('soc-arrow-'+socKey);
  if (body) body.style.display = socCollapsed[socKey] ? 'none' : 'block';
  if (arrow) arrow.textContent = socCollapsed[socKey] ? '▶' : '▼';
}

function renderFacturasTable() {
  const facts = FACTURAS_FILTERED;
  const totalAmt = facts.reduce((s,f)=>s+(f.pendiente||0),0);
  const countEl = document.getElementById('total-count');
  if (countEl) countEl.textContent = facts.length + ' factura' + (facts.length!==1?'s':'') + ' · ' + fmt(totalAmt);

  if (FACTURAS_ALL.length === 0) {
    document.getElementById('facturas-content').innerHTML =
      '<div style="text-align:center;padding:60px;color:var(--ink4)">' +
      '<div style="font-size:40px">📄</div>' +
      '<div style="font-family:var(--font-display);font-size:20px;margin-top:12px">Sin facturas cargadas</div>' +
      '<div style="font-size:13px;margin-top:6px">Pulsa "Actualizar facturas" para cargar desde Holded</div>' +
      '<button class="btn btn-dark" style="margin:16px auto 0;display:inline-flex" onclick="loadFacturas()">Cargar desde Holded</button>' +
      '</div>';
    return;
  }

  if (facts.length === 0) {
    document.getElementById('facturas-content').innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--ink4)">' +
      '<div style="font-size:32px">🔍</div>' +
      '<div style="font-family:var(--font-display);font-size:18px;margin-top:10px">Sin facturas con estos filtros</div>' +
      '<div style="font-size:12px;margin-top:4px">Prueba a cambiar los filtros o seleccionar "Todas"</div>' +
      '</div>';
    return;
  }

  // Group by sociedad
  const grouped = {};
  facts.forEach(f => { if (!grouped[f.sociedad]) grouped[f.sociedad] = []; grouped[f.sociedad].push(f); });

  let html = '';
  Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b)).forEach(([soc, sfacts]) => {
    const col = SOC_COLORS[soc] || '#888';
    const socTotal    = sfacts.reduce((s,f)=>s+(f.pendiente||0),0);
    const socSelTotal = sfacts.filter(f=>selectedFacturas.has(f.id)).reduce((s,f)=>s+(f.pendiente||0),0);
    const safeSoc     = soc.replace(/[^a-zA-Z0-9]/g,'_');
    const isCollapsed = !!socCollapsed[safeSoc];
    const selHtml     = socSelTotal > 0 ? '<span style="font-size:11px;color:var(--rust);margin-left:6px">· ' + fmt(socSelTotal) + ' seleccionado</span>' : '';

    html += '<div style="margin-bottom:16px">' +
      // ── Header row ──
      '<div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:white;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;margin-bottom:4px;box-shadow:var(--shadow)" onclick="toggleSocCollapse(\''+safeSoc+'\')">' +
        '<span id="soc-arrow-'+safeSoc+'" style="font-size:11px;color:var(--ink4);width:12px;flex-shrink:0">'+(isCollapsed?'▶':'▼')+'</span>' +
        '<div style="width:10px;height:10px;border-radius:50%;background:'+col+';flex-shrink:0"></div>' +
        '<div style="font-family:var(--font-display);font-size:17px;color:var(--ink);font-weight:400">'+soc+'</div>' +
        '<div style="font-size:11px;color:var(--ink4)">'+sfacts.length+' factura'+(sfacts.length!==1?'s':'')+' &nbsp;·&nbsp; <span class="num">'+fmt(socTotal)+'</span></div>' +
        selHtml +
        '<div style="margin-left:auto;display:flex;gap:6px">' +
          '<button class="btn btn-outline btn-sm" style="padding:3px 9px;font-size:10.5px" onclick="event.stopPropagation();selAllSoc(\''+soc.replace(/'/g,"\\'")+'\')" title="Seleccionar todas las facturas de esta sociedad">☑ Todas</button>' +
        '</div>' +
      '</div>' +
      // ── Table body (collapsible) ──
      '<div id="soc-body-'+safeSoc+'" style="display:'+(isCollapsed?'none':'block')+'">' +
      '<div class="ftable-wrap"><div class="ftable-scroll"><table class="ftable">' +
        '<thead><tr>' +
          '<th style="width:32px"><input type="checkbox" class="ftable-check" onchange="toggleSocAll(\''+soc.replace(/'/g,"\\'")+'\',this.checked)" title="Sel. toda la sociedad"></th>' +
          '<th>F. Emisión</th>' +
          '<th>Vencimiento</th>' +
          '<th>Nº Factura</th>' +
          '<th>Proveedor</th>' +
          '<th>Proyecto</th>' +
          '<th>Cuenta</th>' +
          '<th>F. Pago</th>' +
          '<th class="num-col">Total</th>' +
          '<th class="num-col">Pendiente</th>' +
          '<th>Estado</th>' +
        '</tr></thead>' +
        '<tbody>';

    sfacts.sort((a,b)=>(a.vencimiento||'9999').localeCompare(b.vencimiento||'9999')).forEach(f => {
      const days   = daysDiff(f.vencimiento);
      const rowCls = days < 0 ? 'vencida' : (days <= 7 ? 'proxima' : '');
      const isSel  = selectedFacturas.has(f.id);

      // Days badge — only show if vencimiento exists and relevant
      let diasHtml = '';
      if (f.vencimiento) {
        if      (days < 0)   diasHtml = '<span class="dias-badge red" title="'+Math.abs(days)+' días vencida">'+Math.abs(days)+'d</span>';
        else if (days <= 7)  diasHtml = '<span class="dias-badge amber" title="Vence en '+days+' días">'+days+'d</span>';
        else if (days <= 30) diasHtml = '<span class="dias-badge green" title="Vence en '+days+' días">'+days+'d</span>';
      }

      const estadoCls = ({1:'estado-pendiente',2:'estado-pagado',3:'estado-parcial',4:'estado-vencida'})[f.estadoCode] || 'estado-pendiente';
      const safeId    = (f.id||'').replace(/'/g,"\\'");
      const fechaEm   = f.fechaEmision ? new Date(f.fechaEmision+'T00:00:00').toLocaleDateString('es-ES') : '—';
      const fechaVenc = f.vencimiento  ? new Date(f.vencimiento+'T00:00:00').toLocaleDateString('es-ES')  : '—';

      html +=
        '<tr class="'+rowCls+(isSel?' selected':'')+'" id="frow-'+f.id+'">' +
          '<td><input type="checkbox" class="ftable-check" '+(isSel?'checked':'')+' onchange="toggleF(\''+safeId+'\',this.checked)"></td>' +
          '<td style="white-space:nowrap;font-size:12px">'+fechaEm+'</td>' +
          '<td style="white-space:nowrap;font-size:12px">'+fechaVenc+(diasHtml?' '+diasHtml:'')+'</td>' +
          '<td style="font-family:var(--font-mono);font-size:10.5px;color:var(--ink2)">'+escapeHtml(f.num||'—')+'</td>' +
          '<td style="max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+escapeHtml(f.proveedor||'')+'">'+escapeHtml(f.proveedor||'—')+'</td>' +
          '<td style="font-size:11px;color:var(--ink4);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+escapeHtml(f.proyecto||'')+'">'+escapeHtml(f.proyecto||'—')+'</td>' +
          '<td style="font-size:10.5px;color:var(--ink4);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+escapeHtml(f.cuenta||'')+'">'+escapeHtml(f.cuenta||'—')+'</td>' +
          '<td style="font-size:11px;color:var(--ink4);white-space:nowrap">'+escapeHtml(f.formaPago||'—')+'</td>' +
          '<td class="num-col" style="color:var(--ink3);font-size:12px">'+fmt(f.totalAmount||0)+'</td>' +
          '<td class="num-col" style="font-weight:'+(days<0?600:400)+';color:'+(days<0?'var(--red)':'inherit')+'">'+fmt(f.pendiente)+'</td>' +
          '<td><span class="estado-badge '+estadoCls+'">'+f.estado+'</span></td>' +
        '</tr>';
    });

    html += '</tbody></table></div></div></div></div>';
  });

  document.getElementById('facturas-content').innerHTML = html;
  updateSelectionBar();
}

function escapeHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toggleF(id, checked) {
  if (checked) selectedFacturas.add(id); else selectedFacturas.delete(id);
  // Fast DOM update — no full re-render
  const row = document.getElementById('frow-'+id);
  if (row) row.classList.toggle('selected', checked);
  updateSelectionBar();
  const btn=document.getElementById('btn-build-sepa'); if(btn) btn.disabled=selectedFacturas.size===0;
  // Debounce liquidity check (heavy)
  clearTimeout(window._liqTimer);
  window._liqTimer = setTimeout(updateLiquidityCheck, 200);
}

function toggleSocAll(soc, checked) {
  FACTURAS_FILTERED.filter(f=>f.sociedad===soc).forEach(f=>{
    if(checked) selectedFacturas.add(f.id); else selectedFacturas.delete(f.id);
    const row = document.getElementById('frow-'+f.id);
    if (row) {
      row.classList.toggle('selected', checked);
      const cb = row.querySelector('.ftable-check');
      if (cb) cb.checked = checked;
    }
  });
  updateSelectionBar();
  const btn=document.getElementById('btn-build-sepa'); if(btn) btn.disabled=selectedFacturas.size===0;
  clearTimeout(window._liqTimer);
  window._liqTimer = setTimeout(updateLiquidityCheck, 200);
}

function selAllSoc(soc) { toggleSocAll(soc, true); }
function selAll()   { FACTURAS_FILTERED.forEach(f=>selectedFacturas.add(f.id)); renderFacturasTable(); updateLiquidityCheck(); }
function deselAll() { selectedFacturas.clear(); renderFacturasTable(); updateLiquidityCheck(); }

function updateSelectionBar() {
  const bar=document.getElementById('sel-bar'); if(!bar) return;
  const n=selectedFacturas.size;
  const total=[...selectedFacturas].reduce((s,id)=>{const f=FACTURAS_ALL.find(x=>x.id===id);return s+(f?.pendiente||0);},0);
  bar.classList.toggle('visible',n>0);
  const lbl=document.getElementById('sel-label'); if(lbl) lbl.textContent=`${n} factura${n!==1?'s':''} seleccionada${n!==1?'s':''}`;
  const amt=document.getElementById('sel-amount'); if(amt) amt.textContent=fmt(total);
  const btn=document.getElementById('btn-build-sepa'); if(btn) btn.disabled=n===0;
}

function populateSEPASelects() {
  const socSel=document.getElementById('sepa-sociedad'); if(!socSel) return;
  const socs=[...new Set((DATA||[]).map(d=>d.sociedad))].sort();
  socSel.innerHTML='<option value="">— Selecciona —</option>'+socs.map(s=>`<option value="${s}">${s}</option>`).join('');
}

function onSepaSocChange() {
  const soc=document.getElementById('sepa-sociedad')?.value;
  const cuentaSel=document.getElementById('sepa-cuenta');
  if(!cuentaSel) return;
  const cuentas=(DATA||[]).filter(d=>d.sociedad===soc);
  cuentaSel.innerHTML='<option value="">— Selecciona cuenta —</option>'+
    cuentas.map(c=>`<option value="${c.iban}">${c.holdedName} — ${ibanShort(c.iban)} (${fmt(c.saldo||0)})</option>`).join('');
  updateLiquidityCheck();
  updateSEPAStatus();
}

function updateLiquidityCheck() {
  const panel=document.getElementById('liq-panel'); if(!panel) return;
  const iban=document.getElementById('sepa-cuenta')?.value||'';
  const acc=(DATA||[]).find(d=>d.iban===iban);
  const saldo=acc?(acc.saldo||0):null;
  const selTotal=[...selectedFacturas].reduce((s,id)=>{const f=FACTURAS_ALL.find(x=>x.id===id);return s+(f?.pendiente||0);},0);
  if(!iban||saldo===null||selTotal===0){panel.innerHTML='';return;}
  const diff=saldo-selTotal;
  const cls=diff<0?'danger':diff<selTotal*0.15?'warn':'ok';
  const ic=diff<0?'🔴':diff<selTotal*0.15?'🟡':'🟢';
  const diffHtml=diff>=0
    ?'Quedará <strong class="num" style="color:var(--green)">'+fmt(diff)+'</strong>'
    :`<strong style="color:var(--red)">⚠ Insuficiente — faltan ${fmt(Math.abs(diff))}</strong>`;
  panel.innerHTML=`<div class="liq-alert ${cls}"><div class="liq-icon">${ic}</div>` +
    `<div class="liq-text"><strong>${acc.holdedName||acc.banco}:</strong> ` +
    `Saldo disponible <strong class="num">${fmt(saldo)}</strong> · ` +
    `Pagos seleccionados <strong class="num">${fmt(selTotal)}</strong> · ${diffHtml}</div></div>`;
}

function updateSEPAStatus() {
  const soc=document.getElementById('sepa-sociedad')?.value;
  const cuenta=document.getElementById('sepa-cuenta')?.value;
  const concep=document.getElementById('sepa-concepto')?.value;
  const fecha=document.getElementById('sepa-fecha')?.value;
  const el=document.getElementById('sepa-config-status'); if(!el) return;
  const missing=[];
  if(!soc) missing.push('sociedad'); if(!cuenta) missing.push('cuenta');
  if(!concep) missing.push('concepto'); if(!fecha) missing.push('fecha');
  el.textContent=missing.length===0?'✓ Listo para crear remesa':`Falta: ${missing.join(', ')}`;
  el.style.color=missing.length===0?'var(--green)':'var(--ink4)';
}

function openBuildSEPA() {
  const soc=document.getElementById('sepa-sociedad')?.value;
  const cuenta=document.getElementById('sepa-cuenta')?.value;
  const concep=document.getElementById('sepa-concepto')?.value?.trim();
  const fecha=document.getElementById('sepa-fecha')?.value?.trim();
  if (!soc)    { alert('Selecciona la sociedad deudora.'); return; }
  if (!cuenta) { alert('Selecciona la cuenta de cargo.'); return; }
  if (!concep) { alert('El concepto es obligatorio.'); return; }
  if (!fecha)  { alert('La fecha de la remesa es obligatoria (DD/MM/AAAA).'); return; }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) { alert('Formato de fecha incorrecto. Usa DD/MM/AAAA.'); return; }
  if (selectedFacturas.size === 0) { alert('Selecciona al menos una factura.'); return; }

  const selFacts=FACTURAS_ALL.filter(f=>selectedFacturas.has(f.id));
  const total=selFacts.reduce((s,f)=>s+(f.pendiente||0),0);

  const rows=selFacts.map(f=>`<tr>
    <td style="font-size:11.5px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(f.proveedor||'')}</td>
    <td style="font-family:var(--font-mono);font-size:10px;color:var(--ink4)">${f.num||''}</td>
    <td style="text-align:right;font-family:var(--font-num);font-size:13px">${fmt(f.pendiente)}</td>
    <td style="font-size:10px;color:var(--ink4)">${f.sociedad}</td>
    <td style="font-size:10px;color:var(--ink4)">${f.vencimiento||'—'}</td>
  </tr>`).join('');

  document.getElementById('modal-title').textContent='Confirmar remesa SEPA';
  document.getElementById('modal-body').innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
      <div class="kpi"><div class="kpi-label">Sociedad</div><div class="kpi-value" style="font-size:13px">${soc}</div></div>
      <div class="kpi"><div class="kpi-label">Facturas</div><div class="kpi-value num">${selFacts.length}</div></div>
      <div class="kpi accent"><div class="kpi-label">Total</div><div class="kpi-value pos num">${fmt(total)}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">
      <div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase;margin-bottom:4px">Cuenta de cargo</div><div style="font-family:var(--font-mono);font-size:11px;word-break:break-all">${cuenta}</div></div>
      <div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase;margin-bottom:4px">Fecha ejecución</div><div style="font-size:13px">${fecha}</div></div>
      <div><div style="font-size:10px;color:var(--ink4);text-transform:uppercase;margin-bottom:4px">Concepto</div><div style="font-size:12px">${escapeHtml(concep)}</div></div>
    </div>
    <div style="font-family:var(--font-display);font-size:16px;margin-bottom:8px">Detalle de facturas</div>
    <div class="ftable-wrap"><table class="ftable" style="min-width:auto">
      <thead><tr><th>Proveedor</th><th>Nº</th><th class="num-col">Pendiente</th><th>Sociedad</th><th>Vencimiento</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  document.getElementById('modal-footer').innerHTML=`
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-rust" id="btn-exec-sepa">⚡ Crear XML y registrar en Holded</button>`;
  window._sepaParams = {soc, cuenta, concep, fecha};
  document.getElementById('btn-exec-sepa').onclick = () => executeCreateSEPA();
  document.getElementById('modal-overlay').style.display='flex';
}

async function executeCreateSEPA() {
  const {soc,cuenta,concep,fecha} = window._sepaParams;
  document.getElementById('modal-footer').innerHTML='<div style="color:var(--ink4);font-size:13px">⏳ Creando remesa en Holded y generando XML...</div>';
  try {
    const res=await fetch(API_BASE+'/api/create-remesa',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({sociedad:soc,debtorIBAN:cuenta,facturaIds:[...selectedFacturas],concepto:concep,fechaRemesa:fecha})
    });
    const json=await res.json();
    if(!json.success) throw new Error(json.error);

    // Auto-download XML
    const blob=new Blob([json.xml],{type:'application/xml'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='remesa_SEPA_'+(soc||'').replace(/[^a-zA-Z0-9 ]/g,'').replace(/ /g,'_')+'_'+fecha.split('/').join('-')+'.xml'; a.click();
    URL.revokeObjectURL(url);

    var remesaInfo =
      '<div style="margin-top:16px;padding:14px;background:rgba(42,122,86,0.08);border-radius:8px;border:1px solid rgba(42,122,86,0.2)">' +
      '<div style="color:var(--green);font-size:13px;font-weight:500;margin-bottom:4px">✅ XML descargado · ' + json.count + ' transacciones · ' + fmt(json.total) + '</div>' +
      (json.remesaId
        ? '<div style="font-size:10.5px;color:var(--ink4)">ID Holded: '+json.remesaId+'</div>'
        : '<div style="font-size:10.5px;color:var(--amber)">⚠ No se pudo registrar en Holded (no bloqueante)</div>') +
      '</div>';
    document.getElementById('modal-body').innerHTML += remesaInfo;

    var txList = json.transactions || [];
    document.getElementById('modal-footer').innerHTML =
      '<button class="btn btn-outline" onclick="closeModal()">Cerrar sin marcar</button>' +
      '<button class="btn btn-outline" id="btn-pdf-remesa" style="background:var(--ink);color:white">📄 PDF resumen</button>' +
      '<button class="btn btn-green" id="btn-mark-paid-final">✓ Marcar ' + txList.length + ' factura(s) como Pagado en Holded</button>';
    document.getElementById('btn-pdf-remesa').onclick = function(){ generarPDFRemesa(txList, soc, cuenta, fecha, concep); };
    document.getElementById('btn-mark-paid-final').onclick = function(){
      // Find holdedName for the debtorIBAN account
      var debtorAcc = (DATA||[]).find(function(d){ return d.iban && d.iban.replace(/\s/g,'') === cuenta.replace(/\s/g,''); });
      var debtorHoldedName = debtorAcc ? debtorAcc.holdedName : '';
      markPaid(txList, cuenta, fecha, concep, debtorHoldedName);
    };
  } catch(err) {
    document.getElementById('modal-footer').innerHTML=
      '<div style="color:var(--red);font-size:13px">❌ '+err.message+'</div>'+
      '<button class="btn btn-outline" onclick="closeModal()">Cerrar</button>';
  }
}


async function markPaid(transactions, debtorIBAN, fechaRemesa, concepto, debtorAccountName) {
  if(!confirm('¿Marcar '+transactions.length+' factura(s) como PAGADAS en Holded?\n\nCuenta: '+ibanShort(debtorIBAN)+'\nFecha: '+fechaRemesa)) return;
  document.getElementById('modal-footer').innerHTML='<div style="color:var(--ink4);font-size:13px">⏳ Marcando facturas como pagadas en Holded...</div>';
  try {
    const enriched=transactions.map(tx=>{const f=FACTURAS_ALL.find(x=>x.holdedId===tx.invoiceId||x.id===tx.invoiceId);return{...tx,sociedad:f?.sociedad||tx.sociedad||''};});
    const res=await fetch(API_BASE+'/api/mark-paid',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({transactions:enriched,debtorIBAN,debtorAccountName:debtorAccountName||'',fechaRemesa,concepto})
    });
    const json=await res.json();
    const errs=(json.results||[]).filter(r=>!r.ok);
    if(json.okCount>0) {
      setBanner('success','✅','<strong>'+json.okCount+' factura(s) marcadas como Pagadas en Holded.</strong>'+(errs.length>0?' '+errs.length+' con errores.':''));
    }
    selectedFacturas.clear();
    await loadFacturas(true);
    document.getElementById('modal-footer').innerHTML =
      '<div style="color:var(--green);font-size:13px">✅ '+json.okCount+' factura(s) actualizadas en Holded'+(errs.length>0?' · '+errs.length+' errores':'')+'</div>' +
      (errs.length>0 ? '<div style="margin-top:8px;font-size:11px;color:var(--red)">'+errs.map(function(e){return '❌ '+e.invoiceId+': '+e.error;}).join('<br>')+'</div>' : '') +
      '<button class="btn btn-outline" onclick="closeModal()">Cerrar</button>';
  } catch(err) {
    document.getElementById('modal-footer').innerHTML='<div style="color:var(--red);font-size:13px">❌ '+err.message+'</div><button class="btn btn-outline" onclick="closeModal()">Cerrar</button>';
  }
}

function initSEPADate() {
  const el = document.getElementById('sepa-fecha');
  if (!el) return;
  const today = new Date();
  el.value = String(today.getDate()).padStart(2,'0') + '/' +
              String(today.getMonth()+1).padStart(2,'0') + '/' +
              today.getFullYear();
}

// ─── INIT ─────────────────────────────────────────────────────────────

function openModal(title, bodyHtml, footerHtml) {
  document.getElementById('modal-title').textContent = title || 'Vista previa SEPA';
  document.getElementById('modal-body').innerHTML = bodyHtml || '';
  document.getElementById('modal-footer').innerHTML = footerHtml || '';
  const overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'flex';
}
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) { overlay.style.display = 'none'; }
  window._sepaParams = null;
}
// ─── PDF RESUMEN REMESA ───────────────────────────────────────────────
function generarPDFRemesa(txList, sociedad, debtorIBAN, fecha, concepto) {
  // Build enriched list with cuenta/proveedor from FACTURAS_ALL
  var rows = txList.map(function(tx){
    var f = FACTURAS_ALL.find(function(x){ return x.holdedId===tx.invoiceId||x.id===tx.invoiceId; });
    return {
      proveedor:  f ? (f.proveedor||'—') : (tx.creditorName||'—'),
      cuenta:     f ? (f.cuenta||'—') : '—',
      num:        f ? (f.num||'—') : '—',
      vencimiento:f ? (f.vencimiento||'—') : '—',
      iban:       tx.creditorIBAN||'',
      amount:     tx.amount||0,
    };
  });

  // Group by cuenta then proveedor
  var byCuenta = {};
  rows.forEach(function(r){
    var c = r.cuenta||'Sin cuenta';
    if(!byCuenta[c]) byCuenta[c]=[];
    byCuenta[c].push(r);
  });

  // Build HTML for print
  var totalAll = rows.reduce(function(s,r){return s+r.amount;},0);
  var ibanShortStr = debtorIBAN ? debtorIBAN.replace(/(.{4})/g,'$1 ').trim() : '';

  var html = '<html><head><meta charset="UTF-8"><title>Remesa SEPA — '+escapeHtml(sociedad)+'</title>' +
    '<style>' +
    'body{font-family:Georgia,serif;margin:0;padding:24px;color:#1A1814;font-size:12px}' +
    'h1{font-family:Georgia,serif;font-size:22px;margin:0 0 4px}' +
    '.meta{color:#6B6358;font-size:11px;margin-bottom:20px}' +
    '.section-title{font-size:13px;font-weight:700;background:#f0ebe2;padding:6px 10px;border-left:4px solid #C4613A;margin:18px 0 6px}' +
    'table{width:100%;border-collapse:collapse;margin-bottom:10px}' +
    'th{text-align:left;font-size:10px;color:#9A9185;border-bottom:1px solid #ddd;padding:4px 6px}' +
    'td{padding:5px 6px;border-bottom:1px solid #f0ede8;font-size:11px}' +
    '.num{text-align:right;font-family:monospace}' +
    '.subtotal{background:#f9f6f0;font-weight:600}' +
    '.total-row{background:#C4613A;color:white;font-weight:700;font-size:13px}' +
    '.total-row td{padding:8px 6px}' +
    '@media print{body{padding:12px}}' +
    '</style></head><body>';

  html += '<h1>Remesa SEPA — '+escapeHtml(sociedad)+'</h1>';
  html += '<div class="meta">Cuenta de cargo: '+ibanShortStr+' &nbsp;|&nbsp; Fecha: '+escapeHtml(fecha)+'&nbsp;|&nbsp; Concepto: '+escapeHtml(concepto)+'</div>';

  Object.keys(byCuenta).sort().forEach(function(cuenta){
    var cRows = byCuenta[cuenta];
    var cTotal = cRows.reduce(function(s,r){return s+r.amount;},0);
    // Sort by proveedor
    cRows.sort(function(a,b){return a.proveedor.localeCompare(b.proveedor);});
    html += '<div class="section-title">'+escapeHtml(cuenta)+' &nbsp;<span style="font-weight:400;font-size:11px;color:#6B6358">('+cRows.length+' factura'+(cRows.length>1?'s':'')+')</span></div>';
    html += '<table><thead><tr><th>Proveedor</th><th>Nº Factura</th><th>Vencimiento</th><th>IBAN Acreedor</th><th class="num">Importe</th></tr></thead><tbody>';
    cRows.forEach(function(r){
      html += '<tr><td>'+escapeHtml(r.proveedor)+'</td><td style="font-family:monospace;font-size:10px">'+escapeHtml(r.num)+'</td><td>'+r.vencimiento+'</td><td style="font-family:monospace;font-size:9px">'+escapeHtml(r.iban)+'</td><td class="num">'+fmt(r.amount)+'</td></tr>';
    });
    html += '<tr class="subtotal"><td colspan="4" style="text-align:right">Subtotal '+escapeHtml(cuenta)+'</td><td class="num">'+fmt(cTotal)+'</td></tr>';
    html += '</tbody></table>';
  });

  html += '<table><tbody><tr class="total-row"><td colspan="4" style="text-align:right">TOTAL REMESA — '+escapeHtml(sociedad)+'</td><td class="num">'+fmt(totalAll)+'</td></tr></tbody></table>';
  html += '<div style="margin-top:24px;font-size:10px;color:#9A9185">Generado el '+(new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}))+'</div>';
  html += '</body></html>';

  // Open in new window and trigger print/save as PDF
  var win = window.open('','_blank','width=900,height=700');
  win.document.write(html);
  win.document.close();
  win.onload = function(){ win.print(); };
}


document.addEventListener('DOMContentLoaded', function() {
  initSEPADate();
  render();
  loadData();
  loadFacturas();
  loadRemesas();
});
</script>
</body>
</html>
