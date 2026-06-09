const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ─── ACCOUNT MAP ─────────────────────────────────────────────────────
const ACCOUNTS_MAP = [
  { holdedName:"BALDORIA SANTANDER",   banco:"SANTANDER",  sociedad:"BALDORIA GROUP",      restaurante:"Baldoria",   iban:"ES5100496733262116292134", color:"#84ceff", apiKeyEnv:"API_BALDORIA" },
  { holdedName:"HOLDING SANTANDER",    banco:"SANTANDER",  sociedad:"BEATA BALDORIA",       restaurante:"Holding",    iban:"ES0200496733222716305627", color:"#e7ddb1", apiKeyEnv:"API_BEATA_BALDORIA" },
  { holdedName:"BILBAO SANTANDER",     banco:"SANTANDER",  sociedad:"BEATA PASTA GROUP",    restaurante:"Bilbao",     iban:"ES1500496733212816307204", color:"#FFBE5C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"PRINCESA SANTANDER",   banco:"SANTANDER",  sociedad:"BEATA PASTA GROUP",    restaurante:"Princesa",   iban:"ES6200496733212816310141", color:"#DC4C4C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"GV SANTANDER",         banco:"SANTANDER",  sociedad:"BEATA PASTA GV",       restaurante:"GV",         iban:"ES5500496733252416326691", color:"#333366", apiKeyEnv:"API_BEATA_PASTA_GV" },
  { holdedName:"CALLAO SANTANDER",     banco:"SANTANDER",  sociedad:"BEATA PASTA SMART",    restaurante:"Callao",     iban:"ES5700496733212816331571", color:"#FEDEA9", apiKeyEnv:"API_BEATA_PASTA_SMART" },
  { holdedName:"BERNABEU SANTANDER",   banco:"SANTANDER",  sociedad:"BEATA PASTA SMART",    restaurante:"Bernabeu",   iban:"ES2800496733202916332837", color:"#FEDEA9", apiKeyEnv:"API_BEATA_PASTA_SMART" },
  { holdedName:"GOYA SANTANDER",       banco:"SANTANDER",  sociedad:"BEATA PASTA FELIPE",   restaurante:"Goya",       iban:"ES4300496733262116331563", color:"#df6c49", apiKeyEnv:"API_BEATA_PASTA_FELIPE" },
  { holdedName:"FOOD TRUCK SANTANDER", banco:"SANTANDER",  sociedad:"BEATA PASTA GROUP",    restaurante:"Food Truck", iban:"ES4200496733292016317838", color:"#F7D021", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"HOLDING NADA",         banco:"SANTANDER",  sociedad:"BEATA BALDORIA",       restaurante:"Holding",    iban:"ES0300496733262116310167", color:"#e7ddb1", apiKeyEnv:"API_BEATA_BALDORIA" },
  { holdedName:"GRAN VIA SANTANDER",   banco:"SANTANDER",  sociedad:"BEATA PASTA GROUP",    restaurante:"GV",         iban:"ES3100496733252416317811", color:"#333366", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"CALEIDO SANTANDER",    banco:"SANTANDER",  sociedad:"BEATA PASTA CALEIDO",  restaurante:"Caleido",    iban:"ES1000496733252416339238", color:"#d36c6e", apiKeyEnv:"API_BEATA_PASTA_CALEIDO" },
  { holdedName:"SUR SANTANDER",        banco:"SANTANDER",  sociedad:"BEATA PASTA SUR",      restaurante:"Parque Sur", iban:"ES7200496733292016339220", color:"#fdd495", apiKeyEnv:"API_BEATA_PASTA_SUR" },
  { holdedName:"BALDORIA SABADELL",    banco:"SABADELL",   sociedad:"BALDORIA GROUP",       restaurante:"Baldoria",   iban:"ES9300817112880002361344", color:"#84ceff", apiKeyEnv:"API_BALDORIA" },
  { holdedName:"BALDORIA PRESTAMO",    banco:"SABADELL",   sociedad:"BALDORIA GROUP",       restaurante:"Baldoria",   iban:"ES1900817112800002550860", color:"#84ceff", apiKeyEnv:"API_BALDORIA" },
  { holdedName:"HOLDING SABADELL",     banco:"SABADELL",   sociedad:"BEATA BALDORIA",       restaurante:"Holding",    iban:"ES9100817112820002446452", color:"#e7ddb1", apiKeyEnv:"API_BEATA_BALDORIA" },
  { holdedName:"BILBAO SABADELL",      banco:"SABADELL",   sociedad:"BEATA PASTA GROUP",    restaurante:"Bilbao",     iban:"ES1600817112890002434752", color:"#FFBE5C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"PRINCESA SABADELL",    banco:"SABADELL",   sociedad:"BEATA PASTA GROUP",    restaurante:"Princesa",   iban:"ES8000817112860002475457", color:"#DC4C4C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"GV SABADELL",          banco:"SABADELL",   sociedad:"BEATA PASTA GV",       restaurante:"GV",         iban:"ES3600817112840002534256", color:"#333366", apiKeyEnv:"API_BEATA_PASTA_GV" },
  { holdedName:"CALEIDO SABADELL",     banco:"SABADELL",   sociedad:"BEATA PASTA CALEIDO",  restaurante:"Caleido",    iban:"ES8800817112830002594867", color:"#d36c6e", apiKeyEnv:"API_BEATA_PASTA_CALEIDO" },
  { holdedName:"SUR SABADELL",         banco:"SABADELL",   sociedad:"BEATA PASTA SUR",      restaurante:"Parque Sur", iban:"ES8000817112840002594768", color:"#fdd495", apiKeyEnv:"API_BEATA_PASTA_SUR" },
  { holdedName:"BALDORIA RENTING",     banco:"SABADELL",   sociedad:"BALDORIA GROUP",       restaurante:"Baldoria",   iban:"ES1500817112860002304937", color:"#84ceff", apiKeyEnv:"API_BALDORIA" },
  { holdedName:"BALDORIA ABANCA",      banco:"ABANCA",     sociedad:"BALDORIA GROUP",       restaurante:"Baldoria",   iban:"ES4320801208243040033442", color:"#84ceff", apiKeyEnv:"API_BALDORIA" },
  { holdedName:"BILBAO ABANCA",        banco:"ABANCA",     sociedad:"BEATA PASTA GROUP",    restaurante:"Bilbao",     iban:"ES5820801208243040041320", color:"#FFBE5C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"PRINCESA ABANCA",      banco:"ABANCA",     sociedad:"BEATA PASTA GROUP",    restaurante:"Princesa",   iban:"ES2420801208243040041544", color:"#DC4C4C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"GOYA ABANCA",          banco:"ABANCA",     sociedad:"BEATA PASTA FELIPE",   restaurante:"Goya",       iban:"ES9120801249673040000776", color:"#df6c49", apiKeyEnv:"API_BEATA_PASTA_FELIPE" },
  { holdedName:"GRAN VIA BBVA",        banco:"BBVA",       sociedad:"BEATA PASTA GROUP",    restaurante:"GV",         iban:"ES2201820901640202403599", color:"#333366", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"GV BBVA",              banco:"BBVA",       sociedad:"BEATA PASTA GV",       restaurante:"GV",         iban:"ES5401820901670202404622", color:"#333366", apiKeyEnv:"API_BEATA_PASTA_GV" },
  { holdedName:"GOYA BBVA",            banco:"BBVA",       sociedad:"BEATA PASTA FELIPE",   restaurante:"Goya",       iban:"ES6201820901680202409764", color:"#df6c49", apiKeyEnv:"API_BEATA_PASTA_FELIPE" },
  { holdedName:"BALDORIA BANKINTER",   banco:"BANKINTER",  sociedad:"BALDORIA GROUP",       restaurante:"Baldoria",   iban:"ES2601280016670100082901", color:"#84ceff", apiKeyEnv:"API_BALDORIA" },
  { holdedName:"BILBAO BANKINTER",     banco:"BANKINTER",  sociedad:"BEATA PASTA GROUP",    restaurante:"Bilbao",     iban:"ES8601280016690100082887", color:"#FFBE5C", apiKeyEnv:"API_BEATA_PASTA_GROUP" },
  { holdedName:"GOYA BANKINTER",       banco:"BANKINTER",  sociedad:"BEATA PASTA FELIPE",   restaurante:"Goya",       iban:"ES6001280016630100082873", color:"#df6c49", apiKeyEnv:"API_BEATA_PASTA_FELIPE" },
  { holdedName:"SUR CAIXA",            banco:"CAIXA",      sociedad:"BEATA PASTA SUR",      restaurante:"Parque Sur", iban:"ES1121008652850200124985", color:"#fdd495", apiKeyEnv:"API_BEATA_PASTA_SUR" },
];

const INTERNAL_IBANS = new Set(ACCOUNTS_MAP.map(a => a.iban.replace(/\s/g, '')));

// Map sociedad → apiKeyEnv
const SOC_API = {};
ACCOUNTS_MAP.forEach(a => { SOC_API[a.sociedad] = a.apiKeyEnv; });

function apiKeyFor(envName) { return process.env[envName] || null; }
function apiKeyForSoc(soc) {
  const env = SOC_API[soc];
  return env ? apiKeyFor(env) : null;
}

async function holdedGet(endpoint, apiKey) {
  const r = await fetch(`https://api.holded.com/api${endpoint}`, {
    headers: { 'key': apiKey, 'Content-Type': 'application/json' }
  });
  if (!r.ok) throw new Error(`Holded ${r.status} on ${endpoint}`);
  return r.json();
}
async function holdedPost(endpoint, apiKey, body) {
  const r = await fetch(`https://api.holded.com/api${endpoint}`, {
    method: 'POST',
    headers: { 'key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Holded ${r.status} on POST ${endpoint}`);
  return r.json();
}
async function holdedPut(endpoint, apiKey, body) {
  const r = await fetch(`https://api.holded.com/api${endpoint}`, {
    method: 'PUT',
    headers: { 'key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Holded ${r.status} on PUT ${endpoint}`);
  return r.json();
}

// ─── GET /api/health ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
  const configured = envs.filter(e => process.env[e]);
  const missing = envs.filter(e => !process.env[e]);
  res.json({ status: 'ok', keysConfigured: configured, keysMissing: missing, timestamp: new Date().toISOString() });
});

// ─── GET /api/balances ───────────────────────────────────────────────
app.get('/api/balances', async (req, res) => {
  try {
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    const results = await Promise.allSettled(
      envs.map(async envName => {
        const key = apiKeyFor(envName);
        if (!key) return { envName, accounts: [] };
        const data = await holdedGet('/invoicing/v1/treasury', key);
        return { envName, accounts: Array.isArray(data) ? data : [] };
      })
    );
    const lookup = {};
    results.forEach(r => {
      if (r.status === 'fulfilled') {
        r.value.accounts.forEach(acc => {
          if (acc.name) lookup[acc.name.toUpperCase().trim()] = acc.balance ?? 0;
        });
      }
    });
    const data = ACCOUNTS_MAP.map(a => ({
      banco: a.banco, sociedad: a.sociedad, restaurante: a.restaurante,
      iban: a.iban, color: a.color, holdedName: a.holdedName,
      saldo: lookup[a.holdedName.toUpperCase()] ?? null,
    }));
    res.json({ success: true, updatedAt: new Date().toISOString(), found: data.filter(d => d.saldo !== null).length, notFound: data.filter(d => d.saldo === null).map(d => d.holdedName), data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/remesas ────────────────────────────────────────────────
app.get('/api/remesas', async (req, res) => {
  try {
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    const allRemesas = [];
    await Promise.allSettled(
      envs.map(async envName => {
        const key = apiKeyFor(envName);
        if (!key) return;
        const soc = ACCOUNTS_MAP.find(a => a.apiKeyEnv === envName)?.sociedad || envName;
        try {
          const data = await holdedGet('/invoicing/v1/treasury/paymentorders', key);
          const list = Array.isArray(data) ? data : (data.items || []);
          list.forEach(rem => {
            allRemesas.push({
              id: rem.id || rem._id,
              name: rem.name || rem.concept || rem.id,
              sociedad: soc,
              date: rem.date ? new Date(rem.date * 1000).toISOString() : rem.createdAt,
              status: rem.status === 2 ? 'completed' : rem.status === 1 ? 'sent' : 'pending',
              total: rem.amount || 0,
              debtorIBAN: rem.accountId || '',
              transactions: (rem.payments || rem.items || []).map(tx => ({
                creditorName: tx.contactName || tx.name || '',
                creditorIBAN: tx.iban || tx.creditorIBAN || '',
                amount: tx.amount || 0,
                concept: tx.concept || tx.description || '',
                invoiceId: tx.invoiceId || tx.docId || null,
              })),
            });
          });
        } catch(e) { console.error(`Remesas error for ${envName}:`, e.message); }
      })
    );
    allRemesas.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: allRemesas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/facturas ───────────────────────────────────────────────
app.get('/api/facturas', async (req, res) => {
  try {
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    const allFacturas = [];
    await Promise.allSettled(
      envs.map(async envName => {
        const key = apiKeyFor(envName);
        if (!key) return;
        const soc = ACCOUNTS_MAP.find(a => a.apiKeyEnv === envName)?.sociedad || envName;
        try {
          // Fetch unpaid purchase invoices
          const [purchases, sales] = await Promise.all([
            holdedGet('/invoicing/v1/expenses?status=pending&limit=100', key).catch(() => []),
            holdedGet('/invoicing/v1/invoices?status=pending&limit=100', key).catch(() => []),
          ]);
          const mapInvoice = (inv, type) => {
            const dueTs = inv.dueDate || inv.due_date || inv.expDate;
            const dueDate = dueTs > 1000000000000 ? new Date(dueTs) : new Date(dueTs * 1000);
            const totalAmt = inv.total || inv.amount || 0;
            const paidAmt = inv.paid || inv.amountPaid || 0;
            const pending = Math.max(0, totalAmt - paidAmt);
            if (pending === 0) return null;
            return {
              id: inv.id || inv._id,
              sociedad: soc,
              type,
              contactName: inv.contactName || inv.contact?.name || inv.clientName || '—',
              docNumber: inv.docNumber || inv.num || inv.number || '—',
              dueDate: dueDate.toISOString().substring(0, 10),
              totalAmount: totalAmt,
              pendingAmount: pending,
              currency: inv.currency || 'EUR',
              holdedId: inv.id || inv._id,
              apiKeyEnv: envName,
            };
          };
          (Array.isArray(purchases) ? purchases : (purchases.items || [])).forEach(inv => {
            const mapped = mapInvoice(inv, 'expense');
            if (mapped) allFacturas.push(mapped);
          });
          (Array.isArray(sales) ? sales : (sales.items || [])).forEach(inv => {
            const mapped = mapInvoice(inv, 'income');
            if (mapped) allFacturas.push(mapped);
          });
        } catch(e) { console.error(`Facturas error for ${envName}:`, e.message); }
      })
    );
    allFacturas.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    res.json({ success: true, count: allFacturas.length, data: allFacturas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/create-remesa ─────────────────────────────────────────
app.post('/api/create-remesa', async (req, res) => {
  try {
    const { sociedad, debtorIBAN, facturaIds } = req.body;
    if (!sociedad || !debtorIBAN || !facturaIds?.length) {
      return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' });
    }
    const apiKey = apiKeyForSoc(sociedad);
    if (!apiKey) return res.status(400).json({ success: false, error: `Sin API key para ${sociedad}` });

    // Get account ID for the debtorIBAN
    const treasury = await holdedGet('/invoicing/v1/treasury', apiKey);
    const debtorAcc = (Array.isArray(treasury) ? treasury : []).find(a => (a.iban || '').replace(/\s/g,'') === debtorIBAN.replace(/\s/g,''));
    const accountId = debtorAcc?.id || '';

    // Create payment order in Holded
    const holdedPayload = {
      accountId,
      concept: `Remesa SEPA ${new Date().toISOString().substring(0,10)}`,
      date: Math.floor(Date.now() / 1000),
      payments: facturaIds.map(id => ({ docId: id, amount: 0 })), // Holded will fill amounts
    };
    let remesaId = null, total = 0;
    try {
      const created = await holdedPost('/invoicing/v1/treasury/paymentorders', apiKey, holdedPayload);
      remesaId = created.id || created._id;
      total = created.amount || 0;
    } catch(e) {
      console.warn('Holded create remesa failed, building XML locally:', e.message);
    }

    // Build SEPA XML pain.001.001.03
    const debtorAccObj = ACCOUNTS_MAP.find(a => a.iban.replace(/\s/g,'') === debtorIBAN.replace(/\s/g,''));
    const debtorName = debtorAccObj ? debtorAccObj.sociedad : sociedad;
    // We need factura details — re-fetch or use cached
    const facturas = await (async () => {
      const r = await holdedGet('/invoicing/v1/expenses?status=pending&limit=500', apiKey).catch(() => []);
      return Array.isArray(r) ? r : (r.items || []);
    })();
    const selected = facturas.filter(f => facturaIds.includes(f.id || f._id));
    if (selected.length === 0 && facturaIds.length > 0) {
      // fallback: build minimal XML with IDs only
    }
    total = selected.reduce((s, f) => s + (f.total || f.amount || 0), 0);
    const msgId = `Holded/${remesaId || Date.now()}`;
    const execDate = new Date().toISOString().substring(0, 10);
    const txXml = selected.map((f, i) => `<CdtTrfTxInf><PmtId><EndToEndId>${f.docNumber || f.num || 'F'+i}</EndToEndId></PmtId><Amt><InstdAmt Ccy="${f.currency||'EUR'}">${((f.total||0)-(f.paid||0)).toFixed(2)}</InstdAmt></Amt><Cdtr><Nm>${escapeXml(f.contactName||'')}</Nm></Cdtr><CdtrAcct><Id><IBAN>${f.iban||''}</IBAN></Id></CdtrAcct><RmtInf><Ustrd>Documento ${f.docNumber||f.num||''}</Ustrd></RmtInf></CdtTrfTxInf>`).join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03"><CstmrCdtTrfInitn><GrpHdr><MsgId>${msgId}</MsgId><CreDtTm>${new Date().toISOString()}</CreDtTm><NbOfTxs>${selected.length||facturaIds.length}</NbOfTxs><CtrlSum>${total.toFixed(2)}</CtrlSum><InitgPty><Nm>${escapeXml(debtorName)}</Nm></InitgPty></GrpHdr><PmtInf><PmtInfId>${msgId}/1</PmtInfId><PmtMtd>TRF</PmtMtd><NbOfTxs>${selected.length||facturaIds.length}</NbOfTxs><CtrlSum>${total.toFixed(2)}</CtrlSum><PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf><ReqdExctnDt>${execDate}</ReqdExctnDt><Dbtr><Nm>${escapeXml(debtorName)}</Nm></Dbtr><DbtrAcct><Id><IBAN>${debtorIBAN}</IBAN></Id></DbtrAcct><ChrgBr>SLEV</ChrgBr>${txXml}</PmtInf></CstmrCdtTrfInitn></Document>`;

    res.json({ success: true, xml, remesaId, total, count: selected.length || facturaIds.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/remesa-complete ───────────────────────────────────────
app.post('/api/remesa-complete', async (req, res) => {
  try {
    const { remesaId } = req.body;
    if (!remesaId) return res.status(400).json({ success: false, error: 'Falta remesaId' });
    // Try to mark complete on each society (we don't know which one owns it)
    const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
    let updated = false;
    await Promise.allSettled(
      envs.map(async envName => {
        const key = apiKeyFor(envName);
        if (!key || updated) return;
        try {
          await holdedPut(`/invoicing/v1/treasury/paymentorders/${remesaId}`, key, { status: 2 });
          updated = true;
        } catch(e) { /* not this society */ }
      })
    );
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function escapeXml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
