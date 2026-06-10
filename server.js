const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ─── MAPS ────────────────────────────────────────────────────────────
const BIC_MAP = {
  SANTANDER:'BSCHESMMXXX', SABADELL:'BSABESBBXXX', ABANCA:'ABNAESMMXXX',
  BBVA:'BBVAESMMXXX', BANKINTER:'BKBKESMMXXX', CAIXA:'CAIXESBBXXX',
};
const CIF_MAP = {
  'BALDORIA GROUP':      'B10593044',
  'BEATA BALDORIA':      'B56221948',
  'BEATA PASTA GROUP':   'B56305527',
  'BEATA PASTA GV':      'B75660381',
  'BEATA PASTA SMART':   'B21782412',
  'BEATA PASTA FELIPE':  'B21779517',
  'BEATA PASTA CALEIDO': 'B23845951',
  'BEATA PASTA SUR':     'B23845944',
};
const ACCOUNTS_MAP = [
  { holdedName:'BALDORIA SANTANDER',   banco:'SANTANDER',  sociedad:'BALDORIA GROUP',      restaurante:'Baldoria',   iban:'ES5100496733262116292134', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'HOLDING SANTANDER',    banco:'SANTANDER',  sociedad:'BEATA BALDORIA',       restaurante:'Holding',    iban:'ES0200496733222716305627', color:'#e7ddb1', apiKeyEnv:'API_BEATA_BALDORIA' },
  { holdedName:'BILBAO SANTANDER',     banco:'SANTANDER',  sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES1500496733212816307204', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'PRINCESA SANTANDER',   banco:'SANTANDER',  sociedad:'BEATA PASTA GROUP',    restaurante:'Princesa',   iban:'ES6200496733212816310141', color:'#DC4C4C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GOYA SANTANDER',       banco:'SANTANDER',  sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES4300496733262116331563', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'GV SANTANDER',         banco:'SANTANDER',  sociedad:'BEATA PASTA GV',       restaurante:'GV',         iban:'ES5500496733252416326691', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GV' },
  { holdedName:'CALLAO SANTANDER',     banco:'SANTANDER',  sociedad:'BEATA PASTA SMART',    restaurante:'Callao',     iban:'ES5700496733212816331571', color:'#FEDEA9', apiKeyEnv:'API_BEATA_PASTA_SMART' },
  { holdedName:'BERNABEU SANTANDER',   banco:'SANTANDER',  sociedad:'BEATA PASTA SMART',    restaurante:'Bernabeu',   iban:'ES2800496733202916332837', color:'#FEDEA9', apiKeyEnv:'API_BEATA_PASTA_SMART' },
  { holdedName:'FOOD TRUCK SANTANDER', banco:'SANTANDER',  sociedad:'BEATA PASTA GROUP',    restaurante:'Food Truck', iban:'ES4200496733292016317838', color:'#F7D021', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'HOLDING NADA',         banco:'SANTANDER',  sociedad:'BEATA BALDORIA',       restaurante:'Holding',    iban:'ES0300496733262116310167', color:'#e7ddb1', apiKeyEnv:'API_BEATA_BALDORIA' },
  { holdedName:'GRAN VIA SANTANDER',   banco:'SANTANDER',  sociedad:'BEATA PASTA GROUP',    restaurante:'GV',         iban:'ES3100496733252416317811', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'CALEIDO SANTANDER',    banco:'SANTANDER',  sociedad:'BEATA PASTA CALEIDO',  restaurante:'Caleido',    iban:'ES1000496733252416339238', color:'#d36c6e', apiKeyEnv:'API_BEATA_PASTA_CALEIDO' },
  { holdedName:'SUR SANTANDER',        banco:'SANTANDER',  sociedad:'BEATA PASTA SUR',      restaurante:'Parque Sur', iban:'ES7200496733292016339220', color:'#fdd495', apiKeyEnv:'API_BEATA_PASTA_SUR' },
  { holdedName:'BALDORIA SABADELL',    banco:'SABADELL',   sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES9300817112880002361344', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BALDORIA PRESTAMO',    banco:'SABADELL',   sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES1900817112800002550860', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'HOLDING SABADELL',     banco:'SABADELL',   sociedad:'BEATA BALDORIA',       restaurante:'Holding',    iban:'ES9100817112820002446452', color:'#e7ddb1', apiKeyEnv:'API_BEATA_BALDORIA' },
  { holdedName:'BILBAO SABADELL',      banco:'SABADELL',   sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES1600817112890002434752', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'PRINCESA SABADELL',    banco:'SABADELL',   sociedad:'BEATA PASTA GROUP',    restaurante:'Princesa',   iban:'ES8000817112860002475457', color:'#DC4C4C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GV SABADELL',          banco:'SABADELL',   sociedad:'BEATA PASTA GV',       restaurante:'GV',         iban:'ES3600817112840002534256', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GV' },
  { holdedName:'CALEIDO SABADELL',     banco:'SABADELL',   sociedad:'BEATA PASTA CALEIDO',  restaurante:'Caleido',    iban:'ES8800817112830002594867', color:'#d36c6e', apiKeyEnv:'API_BEATA_PASTA_CALEIDO' },
  { holdedName:'SUR SABADELL',         banco:'SABADELL',   sociedad:'BEATA PASTA SUR',      restaurante:'Parque Sur', iban:'ES8000817112840002594768', color:'#fdd495', apiKeyEnv:'API_BEATA_PASTA_SUR' },
  { holdedName:'BALDORIA RENTING',     banco:'SABADELL',   sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES1500817112860002304937', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BALDORIA ABANCA',      banco:'ABANCA',     sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES4320801208243040033442', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BILBAO ABANCA',        banco:'ABANCA',     sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES5820801208243040041320', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'PRINCESA ABANCA',      banco:'ABANCA',     sociedad:'BEATA PASTA GROUP',    restaurante:'Princesa',   iban:'ES2420801208243040041544', color:'#DC4C4C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GOYA ABANCA',          banco:'ABANCA',     sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES9120801249673040000776', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'GRAN VIA BBVA',        banco:'BBVA',       sociedad:'BEATA PASTA GROUP',    restaurante:'GV',         iban:'ES2201820901640202403599', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GV BBVA',              banco:'BBVA',       sociedad:'BEATA PASTA GV',       restaurante:'GV',         iban:'ES5401820901670202404622', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GV' },
  { holdedName:'GOYA BBVA',            banco:'BBVA',       sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES6201820901680202409764', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'BALDORIA BANKINTER',   banco:'BANKINTER',  sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES2601280016670100082901', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BILBAO BANKINTER',     banco:'BANKINTER',  sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES8601280016690100082887', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GOYA BANKINTER',       banco:'BANKINTER',  sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES6001280016630100082873', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'SUR CAIXA',            banco:'CAIXA',      sociedad:'BEATA PASTA SUR',      restaurante:'Parque Sur', iban:'ES1121008652850200124985', color:'#fdd495', apiKeyEnv:'API_BEATA_PASTA_SUR' },
];

const INTERNAL_IBANS = new Set(ACCOUNTS_MAP.map(a => a.iban.replace(/\s/g, '')));
const SOC_API = {};
ACCOUNTS_MAP.forEach(a => { SOC_API[a.sociedad] = a.apiKeyEnv; });

// ─── Core helpers ─────────────────────────────────────────────────────
function apiKey(envName)   { return process.env[envName] || null; }
function apiKeyForSoc(soc) { const e = SOC_API[soc]; return e ? apiKey(e) : null; }
function escapeXml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function tsToDate(ts) {
  if (!ts) return null;
  const n = Number(ts);
  return new Date(n > 1e10 ? n : n * 1000);
}
function isoDate(d) { return (d && d instanceof Date && !isNaN(d)) ? d.toISOString().substring(0,10) : ''; }

// ─── Safe Holded fetch: timeout + HTML detection ─────────────────────
async function holdedFetch(method, endpoint, key, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const opts = {
      method,
      signal: controller.signal,
      headers: { key, 'Content-Type': 'application/json', Accept: 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(`https://api.holded.com/api${endpoint}`, opts);
    clearTimeout(timer);
    const text = await r.text();
    if (!text || text.trim() === '') return null;
    if (text.trim().startsWith('<')) throw new Error(`Holded HTML response (${r.status}): ${endpoint}`);
    const json = JSON.parse(text);
    if (!r.ok) throw new Error(`Holded ${r.status}: ${JSON.stringify(json).substring(0,200)}`);
    return json;
  } catch(err) { clearTimeout(timer); throw err; }
}

const holdedGet  = (ep, k)    => holdedFetch('GET',  ep, k, null);
const holdedPost = (ep, k, b) => holdedFetch('POST', ep, k, b);
const holdedPut  = (ep, k, b) => holdedFetch('PUT',  ep, k, b);

// ─── Pagination helper ────────────────────────────────────────────────
async function holdedGetAll(endpoint, key, maxPages=20) {
  let page=1, results=[];
  while (page <= maxPages) {
    const sep  = endpoint.includes('?') ? '&' : '?';
    const data = await holdedGet(`${endpoint}${sep}page=${page}&limit=100`, key);
    if (!data) break;
    const items = Array.isArray(data) ? data : (data.items || data.data || []);
    if (!items.length) break;
    results = results.concat(items);
    if (items.length < 100) break;
    page++;
  }
  return results;
}

// ─── Status label ─────────────────────────────────────────────────────
// Holded expense status: 0=draft,1=pending,2=paid,3=partial,4=overdue,5=voided
function expenseStatusLabel(code) {
  const m = {0:'Borrador',1:'Pendiente',2:'Pagado',3:'Parcial',4:'Vencida',5:'Anulada'};
  return m[code] ?? `Estado ${code}`;
}

// ─── GET /api/health ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
  res.json({ status:'ok', keysConfigured:envs.filter(e=>process.env[e]), keysMissing:envs.filter(e=>!process.env[e]), timestamp:new Date().toISOString() });
});

// ─── GET /api/debug/facturas  (diagnostic endpoint) ───────────────────
// Hits Holded with ONE api key and returns raw response so we can see the real field names.
// Usage: GET /api/debug/facturas?env=API_BALDORIA
app.get('/api/debug/facturas', async (req, res) => {
  const envName = req.query.env || 'API_BEATA_PASTA_GROUP';
  const k = apiKey(envName);
  if (!k) return res.json({ error:`No key for ${envName}` });
  try {
    // Try all possible endpoints
    const results = {};
    for (const ep of [
      '/invoicing/v1/expenses',
      '/invoicing/v1/expenses?status=1',
      '/invoicing/v1/expenses?status=4',
      '/invoicing/v1/bills',
      '/invoicing/v1/purchases',
    ]) {
      try {
        const data = await holdedGet(`${ep}&page=1&limit=3`, k);
        const sample = Array.isArray(data) ? data.slice(0,2) : (data?.items||data?.data||[data]).slice(0,2);
        results[ep] = { count: Array.isArray(data)?data.length:(data?.total||'?'), sample };
      } catch(e) { results[ep] = { error: e.message }; }
    }
    res.json({ envName, results });
  } catch(err) { res.json({ error: err.message }); }
});

// ─── GET /api/balances ────────────────────────────────────────────────
app.get('/api/balances', async (req, res) => {
  try {
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    const results = await Promise.allSettled(
      envs.map(async envName => {
        const k = apiKey(envName);
        if (!k) return { envName, accounts:[] };
        const data = await holdedGet('/invoicing/v1/treasury', k);
        return { envName, accounts: Array.isArray(data)?data:[] };
      })
    );
    const lookup = {};
    results.forEach(r => {
      if (r.status==='fulfilled' && r.value?.accounts) {
        r.value.accounts.forEach(acc => { if (acc.name) lookup[acc.name.toUpperCase().trim()] = acc.balance ?? 0; });
      }
    });
    const data = ACCOUNTS_MAP.map(a => ({
      banco:a.banco, sociedad:a.sociedad, restaurante:a.restaurante,
      iban:a.iban, color:a.color, holdedName:a.holdedName,
      saldo: lookup[a.holdedName.toUpperCase()] ?? null,
    }));
    res.json({ success:true, updatedAt:new Date().toISOString(),
      found:data.filter(d=>d.saldo!==null).length,
      notFound:data.filter(d=>d.saldo===null).map(d=>d.holdedName), data });
  } catch(err) { console.error('/api/balances:',err.message); res.status(500).json({success:false,error:err.message}); }
});

// ─── GET /api/facturas ─────────────────────────────────────────────────
// Fetches purchase invoices from Holded Compras/Facturas with all 9 display fields.
// Tries multiple endpoint structures because Holded API varies by account.
app.get('/api/facturas', async (req, res) => {
  try {
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    const allFacturas = [];
    const errors = [];

    await Promise.allSettled(envs.map(async envName => {
      const k = apiKey(envName);
      if (!k) return;
      const soc = ACCOUNTS_MAP.find(a => a.apiKeyEnv === envName)?.sociedad || envName;

      try {
        // Try all three unpaid statuses. Each may return [] if none exist.
        // Holded v1 expenses: status 1=pending, 3=partial, 4=overdue
        // Also try without status filter as fallback (returns all, we filter client side)
        let rawInvoices = [];

        const tryEndpoints = [
          '/invoicing/v1/expenses?status=1',
          '/invoicing/v1/expenses?status=3',
          '/invoicing/v1/expenses?status=4',
        ];

        const fetched = await Promise.allSettled(
          tryEndpoints.map(ep => holdedGetAll(ep, k).catch(() => []))
        );

        fetched.forEach(r => {
          if (r.status === 'fulfilled' && Array.isArray(r.value)) {
            rawInvoices = rawInvoices.concat(r.value);
          }
        });

        // If nothing came back, try without status filter (some Holded configs differ)
        if (rawInvoices.length === 0) {
          try {
            const all = await holdedGetAll('/invoicing/v1/expenses', k);
            rawInvoices = all.filter(inv => {
              const s = inv.status;
              return s === 1 || s === 3 || s === 4;
            });
          } catch(e) { /* ignore */ }
        }

        const seen = new Set();
        for (const inv of rawInvoices) {
          const id = inv.id || inv._id;
          if (!id || seen.has(id)) continue;
          seen.add(id);

          // Calculate pending amount
          const totalAmt   = parseFloat(inv.total ?? inv.amount ?? inv.subtotal ?? 0);
          const paidAmt    = parseFloat(inv.paid  ?? inv.amountPaid ?? inv.paidAmount ?? 0);
          const pendingAmt = Math.max(0, totalAmt - paidAmt);
          // Include even if pendiente=0 so user can see all invoices; filter in UI
          // But skip fully paid and void
          if (inv.status === 2 || inv.status === 5) continue;

          // Date fields — Holded uses Unix timestamps
          const fechaEmisionDate = tsToDate(inv.date ?? inv.created ?? inv.createdAt);
          const vencimientoDate  = tsToDate(inv.dueDate ?? inv.due_date ?? inv.expDate ?? inv.expirationDate);

          // Forma de pago
          const formaPago = inv.paymentMethodInfo?.name
            || inv.paymentMethod?.name
            || inv.paymentMethodName
            || inv.payMethod
            || inv.fpago
            || '';

          // Proyecto
          const proyecto = inv.projectInfo?.name
            || inv.project?.name
            || inv.projectName
            || inv.project
            || inv.tag
            || '';

          // Cuenta contable
          const cuenta = inv.accountInfo?.name
            || inv.account?.name
            || inv.accountName
            || inv.ledgerAccount
            || inv.category
            || '';

          // Contact IBAN for SEPA
          const contactIBAN = inv.contactInfo?.iban
            || inv.contact?.iban
            || inv.iban
            || inv.bankIban
            || '';

          allFacturas.push({
            id,
            holdedId:     id,
            sociedad:     soc,
            apiKeyEnv:    envName,
            // The 9 display columns
            fechaEmision: isoDate(fechaEmisionDate),
            vencimiento:  isoDate(vencimientoDate),
            num:          inv.docNumber || inv.num || inv.number || inv.ref || '',
            proveedor:    inv.contactName || inv.contact?.name || inv.contactInfo?.name || '',
            proyecto,
            cuenta,
            formaPago,
            pendiente:    pendingAmt,
            totalAmount:  totalAmt,
            paidAmount:   paidAmt,
            estado:       expenseStatusLabel(inv.status),
            estadoCode:   inv.status ?? 1,
            // Extra for SEPA
            currency:     inv.currency || 'EUR',
            contactIBAN,
            contactId:    inv.contactId || inv.contact?.id || inv.contactInfo?.id || '',
          });
        }
      } catch(e) {
        console.error(`facturas ${envName}:`, e.message);
        errors.push({ env: envName, soc, error: e.message });
      }
    }));

    // Sort: overdue first, then by vencimiento asc
    allFacturas.sort((a, b) => {
      if (!a.vencimiento && !b.vencimiento) return 0;
      if (!a.vencimiento) return 1;
      if (!b.vencimiento) return -1;
      return a.vencimiento.localeCompare(b.vencimiento);
    });

    res.json({ success:true, count:allFacturas.length, data:allFacturas, errors });
  } catch(err) {
    console.error('/api/facturas:', err.message);
    res.status(500).json({ success:false, error:err.message });
  }
});

// ─── GET /api/remesas ─────────────────────────────────────────────────
app.get('/api/remesas', async (req, res) => {
  try {
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    const allRemesas = [];
    await Promise.allSettled(envs.map(async envName => {
      const k = apiKey(envName);
      if (!k) return;
      const soc = ACCOUNTS_MAP.find(a => a.apiKeyEnv === envName)?.sociedad || envName;
      for (const ep of ['/invoicing/v1/paymentorders', '/invoicing/v1/treasury/paymentorders']) {
        try {
          const data = await holdedGet(ep, k);
          if (!data) continue;
          const list = Array.isArray(data) ? data : (data.items||data.data||[]);
          list.forEach(rem => {
            allRemesas.push({
              id: rem.id||rem._id, name: rem.name||rem.concept||rem.id, sociedad:soc,
              date: rem.date ? new Date(rem.date>1e10?rem.date:rem.date*1000).toISOString() : new Date().toISOString(),
              status: rem.status===2?'completed':rem.status===1?'sent':'pending',
              total: rem.amount||0,
              transactions: (rem.payments||rem.items||[]).map(tx=>({
                creditorName:tx.contactName||tx.name||'', creditorIBAN:tx.iban||tx.creditorIBAN||'',
                debtorIBAN:rem.iban||'', amount:tx.amount||0, concept:tx.concept||'',
                invoiceId:tx.invoiceId||tx.docId||null,
              })),
            });
          });
          break;
        } catch(e) { /* try next */ }
      }
    }));
    allRemesas.sort((a,b) => new Date(b.date)-new Date(a.date));
    res.json({ success:true, data:allRemesas });
  } catch(err) { res.status(500).json({success:false, error:err.message}); }
});

// ─── POST /api/create-remesa ──────────────────────────────────────────
app.post('/api/create-remesa', async (req, res) => {
  try {
    const { sociedad, debtorIBAN, facturaIds, concepto, fechaRemesa } = req.body;
    if (!sociedad||!debtorIBAN||!facturaIds?.length)
      return res.status(400).json({success:false,error:'Faltan campos: sociedad, debtorIBAN, facturaIds'});
    if (!concepto)
      return res.status(400).json({success:false,error:'El concepto es obligatorio'});

    const k = apiKeyForSoc(sociedad);
    if (!k) return res.status(400).json({success:false,error:`Sin API key para ${sociedad}`});

    // Fetch selected invoices
    let rawInvoices = [];
    const statuses = [1,3,4];
    for (const s of statuses) {
      try {
        const items = await holdedGetAll(`/invoicing/v1/expenses?status=${s}`, k);
        rawInvoices = rawInvoices.concat(items);
      } catch(e) {}
    }
    if (!rawInvoices.length) {
      try {
        rawInvoices = await holdedGetAll('/invoicing/v1/expenses', k);
      } catch(e) {}
    }

    const selected = rawInvoices.filter(inv => facturaIds.includes(inv.id||inv._id));
    if (!selected.length)
      return res.status(400).json({success:false,error:'No se encontraron las facturas seleccionadas en Holded'});

    const transactions = selected.map(inv => ({
      creditorName: inv.contactName||inv.contact?.name||'',
      creditorIBAN: inv.iban||inv.contact?.iban||inv.bankIban||'',
      amount:       Math.max(0,(inv.total??inv.amount??0)-(inv.paid??inv.amountPaid??0)),
      concept:      `Documento ${inv.docNumber||inv.num||inv.id}`,
      invoiceId:    inv.id||inv._id,
      docNumber:    inv.docNumber||inv.num||'',
    }));
    const total = transactions.reduce((s,t)=>s+t.amount,0);
    const execDateObj = fechaRemesa ? new Date(fechaRemesa.split('/').reverse().join('-')) : new Date();
    const execDate  = isoDate(execDateObj);
    const creaDtTm  = new Date().toISOString().replace('Z','');
    const debtorAcc = ACCOUNTS_MAP.find(a=>a.iban.replace(/\s/g,'')===debtorIBAN.replace(/\s/g,''));
    const bic       = BIC_MAP[debtorAcc?.banco]||'NOTPROVIDED';
    const cif       = CIF_MAP[sociedad]||'NOTPROVIDED';
    const msgId     = `Holded/${Date.now()}`;

    const txXml = transactions.map(tx =>
      `<CdtTrfTxInf>` +
        `<PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId>` +
        `<Amt><InstdAmt Ccy="EUR">${tx.amount.toFixed(2)}</InstdAmt></Amt>` +
        `<Cdtr><Nm>${escapeXml(tx.creditorName)}</Nm></Cdtr>` +
        `<CdtrAcct><Id><IBAN>${escapeXml(tx.creditorIBAN)}</IBAN></Id></CdtrAcct>` +
        `<RmtInf><Ustrd>${escapeXml(tx.concept)}</Ustrd></RmtInf>` +
      `</CdtTrfTxInf>`
    ).join('');

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03 pain.001.001.03.xsd">` +
      `<CstmrCdtTrfInitn><GrpHdr>` +
        `<MsgId>${msgId}</MsgId><CreDtTm>${creaDtTm}</CreDtTm>` +
        `<NbOfTxs>${transactions.length}</NbOfTxs><CtrlSum>${total.toFixed(2)}</CtrlSum>` +
        `<InitgPty><Nm>${escapeXml(sociedad)}</Nm><Id><OrgId><Othr><Id>${escapeXml(cif)}</Id></Othr></OrgId></Id></InitgPty>` +
      `</GrpHdr>` +
      `<PmtInf>` +
        `<PmtInfId>${msgId}/1</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg>` +
        `<NbOfTxs>${transactions.length}</NbOfTxs><CtrlSum>${total.toFixed(2)}</CtrlSum>` +
        `<PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf>` +
        `<ReqdExctnDt>${execDate}</ReqdExctnDt>` +
        `<Dbtr><Nm>${escapeXml(sociedad)}</Nm></Dbtr>` +
        `<DbtrAcct><Id><IBAN>${debtorIBAN}</IBAN></Id></DbtrAcct>` +
        `<DbtrAgt><FinInstnId><BIC>${bic}</BIC></FinInstnId></DbtrAgt>` +
        `<ChrgBr>SLEV</ChrgBr>${txXml}` +
      `</PmtInf></CstmrCdtTrfInitn></Document>`;

    // Register in Holded (non-fatal)
    let holdedRemesaId = null;
    try {
      const treasury = await holdedGet('/invoicing/v1/treasury', k);
      const tAcc = (Array.isArray(treasury)?treasury:[]).find(a=>(a.iban||'').replace(/\s/g,'')=== debtorIBAN.replace(/\s/g,''));
      const payload = { name:concepto, concept:concepto, accountId:tAcc?.id||'',
        date:Math.floor(execDateObj.getTime()/1000), amount:total,
        payments:transactions.map(t=>({docId:t.invoiceId,amount:t.amount,concept:t.concept})) };
      for (const ep of ['/invoicing/v1/paymentorders','/invoicing/v1/treasury/paymentorders']) {
        try { const c=await holdedPost(ep,k,payload); if(c){holdedRemesaId=c.id||c._id;break;} } catch(e){}
      }
    } catch(e) { console.warn('Holded remesa registration (non-fatal):', e.message); }

    res.json({ success:true, xml, remesaId:holdedRemesaId, msgId, total, count:transactions.length, execDate, concepto,
      transactions: transactions.map(t=>({creditorName:t.creditorName,creditorIBAN:t.creditorIBAN,amount:t.amount,concept:t.concept,invoiceId:t.invoiceId})) });
  } catch(err) {
    console.error('/api/create-remesa:', err.message);
    res.status(500).json({success:false,error:err.message});
  }
});

// ─── POST /api/mark-paid ──────────────────────────────────────────────
// Marks each invoice as Pagado in Holded with: amount, accountId (bank), date, concept
app.post('/api/mark-paid', async (req, res) => {
  try {
    const { transactions, debtorIBAN, fechaRemesa, concepto } = req.body;
    if (!transactions?.length) return res.status(400).json({success:false,error:'Sin transacciones'});

    const execDateObj = fechaRemesa ? new Date(fechaRemesa.split('/').reverse().join('-')) : new Date();
    const execTs      = Math.floor(execDateObj.getTime()/1000);
    const results     = [];

    for (const tx of transactions) {
      const k = apiKeyForSoc(tx.sociedad);
      if (!k) { results.push({invoiceId:tx.invoiceId,ok:false,error:'Sin API key'}); continue; }
      try {
        // Get treasury account ID matching debtorIBAN
        const treasury = await holdedGet('/invoicing/v1/treasury', k);
        const tAcc = (Array.isArray(treasury)?treasury:[])
          .find(a=>(a.iban||'').replace(/\s/g,'')=== debtorIBAN.replace(/\s/g,''));

        // POST /invoicing/v1/expenses/{id}/pay — registers payment on the invoice
        await holdedPost(`/invoicing/v1/expenses/${tx.invoiceId}/pay`, k, {
          date:      execTs,
          amount:    tx.amount,
          accountId: tAcc?.id || '',
          concept:   concepto || 'Pago remesa SEPA',
          notes:     `Cuenta: ${debtorIBAN} | Fecha: ${isoDate(execDateObj)} | Remesa SEPA`,
        });
        results.push({invoiceId:tx.invoiceId, ok:true});
      } catch(e) {
        console.error(`mark-paid ${tx.invoiceId}:`, e.message);
        results.push({invoiceId:tx.invoiceId, ok:false, error:e.message});
      }
    }
    const okCount  = results.filter(r=>r.ok).length;
    const errCount = results.filter(r=>!r.ok).length;
    res.json({success:true, okCount, errCount, results});
  } catch(err) { res.status(500).json({success:false,error:err.message}); }
});

// ─── POST /api/remesa-complete ────────────────────────────────────────
app.post('/api/remesa-complete', async (req, res) => {
  try {
    const { remesaId } = req.body;
    if (!remesaId) return res.status(400).json({success:false,error:'Falta remesaId'});
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    let updated = false;
    await Promise.allSettled(envs.map(async envName => {
      const k = apiKey(envName);
      if (!k || updated) return;
      for (const ep of ['/invoicing/v1/paymentorders','/invoicing/v1/treasury/paymentorders']) {
        try { await holdedPut(`${ep}/${remesaId}`,k,{status:2}); updated=true; break; } catch(e){}
      }
    }));
    res.json({success:true,updated});
  } catch(err) { res.status(500).json({success:false,error:err.message}); }
});

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
