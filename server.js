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

// ─── MAPS ─────────────────────────────────────────────────────────────
const BIC_MAP = {
  SANTANDER:'BSCHESMMXXX', SABADELL:'BSABESBBXXX', ABANCA:'ABNAESMMXXX',
  BBVA:'BBVAESMMXXX', BANKINTER:'BKBKESMMXXX', CAIXA:'CAIXESBBXXX',
};
const CIF_MAP = {
  'BALDORIA GROUP':'B10593044','BEATA BALDORIA':'B56221948',
  'BEATA PASTA GROUP':'B56305527','BEATA PASTA GV':'B75660381',
  'BEATA PASTA SMART':'B21782412','BEATA PASTA FELIPE':'B21779517',
  'BEATA PASTA CALEIDO':'B23845951','BEATA PASTA SUR':'B23845944',
};
const ACCOUNTS_MAP = [
  { holdedName:'BALDORIA SANTANDER',   banco:'SANTANDER', sociedad:'BALDORIA GROUP',      restaurante:'Baldoria',   iban:'ES5100496733262116292134', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'HOLDING SANTANDER',    banco:'SANTANDER', sociedad:'BEATA BALDORIA',       restaurante:'Holding',    iban:'ES0200496733222716305627', color:'#e7ddb1', apiKeyEnv:'API_BEATA_BALDORIA' },
  { holdedName:'BILBAO SANTANDER',     banco:'SANTANDER', sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES1500496733212816307204', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'PRINCESA SANTANDER',   banco:'SANTANDER', sociedad:'BEATA PASTA GROUP',    restaurante:'Princesa',   iban:'ES6200496733212816310141', color:'#DC4C4C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GOYA SANTANDER',       banco:'SANTANDER', sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES4300496733262116331563', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'GV SANTANDER',         banco:'SANTANDER', sociedad:'BEATA PASTA GV',       restaurante:'GV',         iban:'ES5500496733252416326691', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GV' },
  { holdedName:'CALLAO SANTANDER',     banco:'SANTANDER', sociedad:'BEATA PASTA SMART',    restaurante:'Callao',     iban:'ES5700496733212816331571', color:'#FEDEA9', apiKeyEnv:'API_BEATA_PASTA_SMART' },
  { holdedName:'BERNABEU SANTANDER',   banco:'SANTANDER', sociedad:'BEATA PASTA SMART',    restaurante:'Bernabeu',   iban:'ES2800496733202916332837', color:'#FEDEA9', apiKeyEnv:'API_BEATA_PASTA_SMART' },
  { holdedName:'FOOD TRUCK SANTANDER', banco:'SANTANDER', sociedad:'BEATA PASTA GROUP',    restaurante:'Food Truck', iban:'ES4200496733292016317838', color:'#F7D021', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'HOLDING NADA',         banco:'SANTANDER', sociedad:'BEATA BALDORIA',       restaurante:'Holding',    iban:'ES0300496733262116310167', color:'#e7ddb1', apiKeyEnv:'API_BEATA_BALDORIA' },
  { holdedName:'GRAN VIA SANTANDER',   banco:'SANTANDER', sociedad:'BEATA PASTA GROUP',    restaurante:'GV',         iban:'ES3100496733252416317811', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'CALEIDO SANTANDER',    banco:'SANTANDER', sociedad:'BEATA PASTA CALEIDO',  restaurante:'Caleido',    iban:'ES1000496733252416339238', color:'#d36c6e', apiKeyEnv:'API_BEATA_PASTA_CALEIDO' },
  { holdedName:'SUR SANTANDER',        banco:'SANTANDER', sociedad:'BEATA PASTA SUR',      restaurante:'Parque Sur', iban:'ES7200496733292016339220', color:'#fdd495', apiKeyEnv:'API_BEATA_PASTA_SUR' },
  { holdedName:'BALDORIA SABADELL',    banco:'SABADELL',  sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES9300817112880002361344', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BALDORIA PRESTAMO',    banco:'SABADELL',  sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES1900817112800002550860', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'HOLDING SABADELL',     banco:'SABADELL',  sociedad:'BEATA BALDORIA',       restaurante:'Holding',    iban:'ES9100817112820002446452', color:'#e7ddb1', apiKeyEnv:'API_BEATA_BALDORIA' },
  { holdedName:'BILBAO SABADELL',      banco:'SABADELL',  sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES1600817112890002434752', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'PRINCESA SABADELL',    banco:'SABADELL',  sociedad:'BEATA PASTA GROUP',    restaurante:'Princesa',   iban:'ES8000817112860002475457', color:'#DC4C4C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GV SABADELL',          banco:'SABADELL',  sociedad:'BEATA PASTA GV',       restaurante:'GV',         iban:'ES3600817112840002534256', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GV' },
  { holdedName:'CALEIDO SABADELL',     banco:'SABADELL',  sociedad:'BEATA PASTA CALEIDO',  restaurante:'Caleido',    iban:'ES8800817112830002594867', color:'#d36c6e', apiKeyEnv:'API_BEATA_PASTA_CALEIDO' },
  { holdedName:'SUR SABADELL',         banco:'SABADELL',  sociedad:'BEATA PASTA SUR',      restaurante:'Parque Sur', iban:'ES8000817112840002594768', color:'#fdd495', apiKeyEnv:'API_BEATA_PASTA_SUR' },
  { holdedName:'BALDORIA RENTING',     banco:'SABADELL',  sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES1500817112860002304937', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BALDORIA ABANCA',      banco:'ABANCA',    sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES4320801208243040033442', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BILBAO ABANCA',        banco:'ABANCA',    sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES5820801208243040041320', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'PRINCESA ABANCA',      banco:'ABANCA',    sociedad:'BEATA PASTA GROUP',    restaurante:'Princesa',   iban:'ES2420801208243040041544', color:'#DC4C4C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GOYA ABANCA',          banco:'ABANCA',    sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES9120801249673040000776', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'GRAN VIA BBVA',        banco:'BBVA',      sociedad:'BEATA PASTA GROUP',    restaurante:'GV',         iban:'ES2201820901640202403599', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GV BBVA',              banco:'BBVA',      sociedad:'BEATA PASTA GV',       restaurante:'GV',         iban:'ES5401820901670202404622', color:'#333366', apiKeyEnv:'API_BEATA_PASTA_GV' },
  { holdedName:'GOYA BBVA',            banco:'BBVA',      sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES6201820901680202409764', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'BALDORIA BANKINTER',   banco:'BANKINTER', sociedad:'BALDORIA GROUP',       restaurante:'Baldoria',   iban:'ES2601280016670100082901', color:'#84ceff', apiKeyEnv:'API_BALDORIA' },
  { holdedName:'BILBAO BANKINTER',     banco:'BANKINTER', sociedad:'BEATA PASTA GROUP',    restaurante:'Bilbao',     iban:'ES8601280016690100082887', color:'#FFBE5C', apiKeyEnv:'API_BEATA_PASTA_GROUP' },
  { holdedName:'GOYA BANKINTER',       banco:'BANKINTER', sociedad:'BEATA PASTA FELIPE',   restaurante:'Goya',       iban:'ES6001280016630100082873', color:'#df6c49', apiKeyEnv:'API_BEATA_PASTA_FELIPE' },
  { holdedName:'SUR CAIXA',            banco:'CAIXA',     sociedad:'BEATA PASTA SUR',      restaurante:'Parque Sur', iban:'ES1121008652850200124985', color:'#fdd495', apiKeyEnv:'API_BEATA_PASTA_SUR' },
];

const SOC_API = {};
ACCOUNTS_MAP.forEach(a => { SOC_API[a.sociedad] = a.apiKeyEnv; });

// ─── Key helpers ──────────────────────────────────────────────────────
// V2 Bearer token (purchases)  → API_XXX
// V1 key header (treasury)     → API_XXX_V1  (falls back to API_XXX if not set)
function apiKey(env)     { return process.env[env] || null; }
function apiKeyV1(env)   { return process.env[env+'_V1'] || process.env[env] || null; }
function apiKeyForSoc(s) { const e=SOC_API[s]; return e?apiKey(e):null; }
function apiKeyV1ForSoc(s){ const e=SOC_API[s]; return e?apiKeyV1(e):null; }

// ─── Escape / date helpers ────────────────────────────────────────────
function escapeXml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function isoDate(d){ return (d&&d instanceof Date&&!isNaN(d))?d.toISOString().substring(0,10):''; }
function parseDate(v){
  if(!v) return null;
  if(typeof v==='number') return new Date(v>1e10?v:v*1000);
  const d=new Date(v); return isNaN(d)?null:d;
}
// Holded v2 returns amounts as "1.234,56" (Spanish locale) — parse correctly
function ph(v){
  if(v===undefined||v===null) return 0;
  if(typeof v==='number') return v;
  return parseFloat(String(v).replace(/\./g,'').replace(',','.')) || 0;
}

// ─── V1 fetch (treasury) — header: key ───────────────────────────────
async function v1Fetch(method, endpoint, token, body){
  const ctrl=new AbortController();
  const t=setTimeout(()=>ctrl.abort(),12000);
  try {
    const opts={method,signal:ctrl.signal,headers:{key:token,'Content-Type':'application/json','Accept':'application/json'}};
    if(body) opts.body=JSON.stringify(body);
    const r=await fetch('https://api.holded.com/api'+endpoint,opts);
    clearTimeout(t);
    const text=await r.text();
    if(!text||text.trim()==='') return null;
    if(text.trim().startsWith('<')) throw new Error('Holded v1 HTML ('+r.status+'): '+endpoint);
    const json=JSON.parse(text);
    if(!r.ok) throw new Error('Holded v1 '+r.status+': '+JSON.stringify(json).substring(0,200));
    return json;
  } catch(e){clearTimeout(t);throw e;}
}
const v1Get=(ep,k)=>v1Fetch('GET',ep,k,null);

async function v1GetAll(endpoint,key,maxPages=20){
  let page=1,results=[];
  while(page<=maxPages){
    const sep=endpoint.includes('?')?'&':'?';
    const data=await v1Get(endpoint+sep+'page='+page+'&limit=100',key);
    if(!data) break;
    const items=Array.isArray(data)?data:(data.items||data.data||[]);
    if(!items.length) break;
    results=results.concat(items);
    if(items.length<100) break;
    page++;
  }
  return results;
}

// ─── V2 fetch (purchases) — header: Authorization: Bearer ────────────
async function v2Fetch(method, endpoint, token, body){
  const ctrl=new AbortController();
  const t=setTimeout(()=>ctrl.abort(),12000);
  try {
    const opts={method,signal:ctrl.signal,headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json','Accept':'application/json'}};
    if(body) opts.body=JSON.stringify(body);
    const r=await fetch('https://api.holded.com/api/v2'+endpoint,opts);
    clearTimeout(t);
    const text=await r.text();
    if(!text||text.trim()==='') return null;
    if(text.trim().startsWith('<')) throw new Error('Holded v2 HTML ('+r.status+'): '+endpoint);
    const json=JSON.parse(text);
    if(!r.ok) throw new Error('Holded v2 '+r.status+': '+JSON.stringify(json).substring(0,300));
    return json;
  } catch(e){clearTimeout(t);throw e;}
}
const v2Get=(ep,k)=>v2Fetch('GET',ep,k,null);
const v2Post=(ep,k,b)=>v2Fetch('POST',ep,k,b);

async function v2GetAll(endpoint,key,maxPages=20){
  let results=[],cursor=null,page=0;
  while(page<maxPages){
    const sep=endpoint.includes('?')?'&':'?';
    const url=cursor?endpoint+sep+'cursor='+cursor+'&limit=100':endpoint+sep+'limit=100';
    const data=await v2Get(url,key);
    if(!data) break;
    const items=Array.isArray(data)?data:(data.data||data.items||[]);
    if(!items.length) break;
    results=results.concat(items);
    cursor=data.meta?.nextCursor||data.nextCursor||null;
    if(!cursor||items.length<100) break;
    page++;
  }
  return results;
}

function purchaseStatusLabel(s){
  const m={pending:'Pendiente',draft:'Borrador',paid:'Pagado',overdue:'Vencida',partial:'Parcial',voided:'Anulada',0:'Borrador',1:'Pendiente',2:'Pagado',3:'Parcial',4:'Vencida',5:'Anulada'};
  return m[s]??String(s);
}
function purchaseStatusCode(s){
  if(typeof s==='number') return s;
  return {pending:1,draft:0,paid:2,partial:3,overdue:4,voided:5}[s]??1;
}

// ─── GET /api/health ──────────────────────────────────────────────────
app.get('/api/health',(req,res)=>{
  const envs=[...new Set(ACCOUNTS_MAP.map(a=>a.apiKeyEnv))];
  res.json({status:'ok',apiV1keys:envs.filter(e=>process.env[e+'_V1']),apiV2keys:envs.filter(e=>process.env[e]),timestamp:new Date().toISOString()});
});

// ─── GET /api/debug/facturas ──────────────────────────────────────────
app.get('/api/debug/facturas',async(req,res)=>{
  const envName=req.query.env||'API_BEATA_PASTA_GROUP';
  const k=apiKey(envName);
  if(!k) return res.json({error:'No v2 key for: '+envName});
  const results={};
  // Test all lookup endpoints + 1 purchase sample
  const endpoints=[
    '/purchases?limit=1',
    '/accounting/expense-accounts?limit=5',
    '/expense-accounts?limit=5',
    '/expenses-accounts?limit=5',
    '/payment-methods?limit=10',
    '/projects?limit=10',
  ];
  for(const ep of endpoints){
    try{
      const r=await fetch('https://api.holded.com/api/v2'+ep,{
        headers:{'Authorization':'Bearer '+k,'Accept':'application/json'},
        signal:AbortSignal.timeout(8000),
      });
      const text=await r.text();
      const isHtml=text.trim().startsWith('<');
      let parsed=null;
      if(!isHtml){try{parsed=JSON.parse(text);}catch(e){}}
      const items=Array.isArray(parsed)?parsed:(parsed&&(parsed.data||parsed.items||[]));
      results[ep]={
        status:r.status,
        isJson:!isHtml&&parsed!==null,
        itemCount:Array.isArray(items)?items.length:0,
        // Full first item to see field names
        firstItem:Array.isArray(items)?(items[0]||null):parsed,
      };
    }catch(e){results[ep]={error:e.message};}
  }
  res.json({envName,apiVersion:'v2',timestamp:new Date().toISOString(),results});
});


// ─── GET /api/debug/balances ──────────────────────────────────────────
app.get('/api/debug/balances',async(req,res)=>{
  const envs=[...new Set(ACCOUNTS_MAP.map(a=>a.apiKeyEnv))];
  const allAccounts=[];
  await Promise.allSettled(envs.map(async envName=>{
    const k=apiKeyV1(envName);
    if(!k) return;
    try{
      const data=await v1Get('/invoicing/v1/treasury',k);
      const accs=Array.isArray(data)?data:[];
      accs.forEach(acc=>allAccounts.push({envName,id:acc.id,name:acc.name,iban:acc.iban,balance:acc.balance}));
    }catch(e){allAccounts.push({envName,error:e.message});}
  }));
  res.json({count:allAccounts.length,accounts:allAccounts});
});

// ─── GET /api/balances ────────────────────────────────────────────────
// Uses V1 API (key: header) for treasury balances
app.get('/api/balances',async(req,res)=>{
  try{
    const envs=[...new Set(ACCOUNTS_MAP.map(a=>a.apiKeyEnv))];
    const results=await Promise.allSettled(envs.map(async envName=>{
      const k=apiKeyV1(envName);
      if(!k) return {envName,accounts:[]};
      try{
        const data=await v1Get('/invoicing/v1/treasury',k);
        return {envName,accounts:Array.isArray(data)?data:[]};
      }catch(e){console.error('balances',envName,e.message);return{envName,accounts:[],error:e.message};}
    }));

    const byName={},byIban={},allAccounts=[];
    results.forEach(r=>{
      if(r.status==='fulfilled'&&r.value?.accounts){
        r.value.accounts.forEach(acc=>{
          allAccounts.push({envName:r.value.envName,name:acc.name,iban:acc.iban,balance:acc.balance});
          if(acc.name) byName[acc.name.toUpperCase().trim()]=acc.balance??0;
          if(acc.iban) byIban[acc.iban.replace(/[\s-]/g,'').toUpperCase()]=acc.balance??0;
        });
      }
    });

    const data=ACCOUNTS_MAP.map(a=>{
      const ci=a.iban.replace(/[\s-]/g,'').toUpperCase();
      let saldo=null,matchedBy=null;
      if(byName[a.holdedName.toUpperCase()]!==undefined){saldo=byName[a.holdedName.toUpperCase()];matchedBy='name';}
      else if(byIban[ci]!==undefined){saldo=byIban[ci];matchedBy='iban';}
      return{banco:a.banco,sociedad:a.sociedad,restaurante:a.restaurante,iban:a.iban,color:a.color,holdedName:a.holdedName,saldo,matchedBy};
    });

    res.json({success:true,updatedAt:new Date().toISOString(),found:data.filter(d=>d.saldo!==null).length,notFound:data.filter(d=>d.saldo===null).map(d=>d.holdedName),allHoldedAccounts:allAccounts,data});
  }catch(err){console.error('/api/balances:',err.message);res.status(500).json({success:false,error:err.message});}
});

// ─── GET /api/facturas ────────────────────────────────────────────────
// Uses V2 API (Bearer) for purchases
// Fetches: purchases, expense-accounts (for cuenta names), payment-methods + projects (for names)
app.get('/api/facturas',async(req,res)=>{
  try{
    const envs=[...new Set(ACCOUNTS_MAP.map(a=>a.apiKeyEnv))];
    const allFacturas=[],errors=[];

    await Promise.allSettled(envs.map(async envName=>{
      const k=apiKey(envName);
      if(!k) return;
      const soc=ACCOUNTS_MAP.find(a=>a.apiKeyEnv===envName)?.sociedad||envName;
      try{
        // Fetch purchases + lookup tables in parallel
        const [pendRes,ovrRes,parRes,acctRes,pmRes,projRes]=await Promise.allSettled([
          v2GetAll('/purchases?status=pending',k),
          v2GetAll('/purchases?status=overdue',k),
          v2GetAll('/purchases?status=partial',k),
          // Expense accounts for cuenta names
          v2GetAll('/accounting/expense-accounts',k).catch(()=>v2GetAll('/expense-accounts',k).catch(()=>[])),
          // Payment methods for forma de pago names
          v2GetAll('/payment-methods',k).catch(()=>[]),
          // Projects for project names
          v2GetAll('/projects',k).catch(()=>[]),
        ]);

        let rawInvoices=[];
        [pendRes,ovrRes,parRes].forEach(r=>{if(r.status==='fulfilled'&&Array.isArray(r.value))rawInvoices=rawInvoices.concat(r.value);});
        if(rawInvoices.length===0){
          try{const all=await v2GetAll('/purchases',k);rawInvoices=all.filter(inv=>!['paid','voided'].includes(inv.status));}
          catch(e){errors.push({env:envName,soc,error:'fallback: '+e.message});}
        }

        // Build lookup maps: ID → name
        const acctMap={},pmMap={},projMap={};
        if(acctRes.status==='fulfilled'&&Array.isArray(acctRes.value))
          acctRes.value.forEach(a=>{if(a.id) acctMap[a.id]=a.name||a.account_name||'';});
        if(pmRes.status==='fulfilled'&&Array.isArray(pmRes.value))
          pmRes.value.forEach(p=>{if(p.id) pmMap[p.id]=p.name||p.payment_method||'';});
        if(projRes.status==='fulfilled'&&Array.isArray(projRes.value))
          projRes.value.forEach(p=>{if(p.id) projMap[p.id]=p.name||p.title||'';});

        const seen=new Set();
        for(const inv of rawInvoices){
          const id=inv.id||inv._id;
          if(!id||seen.has(id)) continue;
          seen.add(id);
          if(['paid','voided'].includes(inv.status)||inv.status===2||inv.status===5) continue;

          const totalAmt=ph(inv.total??inv.subtotal??inv.amount);
          let pendingAmt,paidAmt;
          if(inv.payments_pending!==undefined&&inv.payments_pending!==null){
            pendingAmt=ph(inv.payments_pending);
            paidAmt=ph(inv.payments_total);
          } else {
            paidAmt=ph(inv.paid??inv.paidAmount??inv.amountPaid??0);
            pendingAmt=Math.max(0,totalAmt-paidAmt);
          }
          pendingAmt=Math.max(0,pendingAmt);
          paidAmt=Math.max(0,paidAmt);

          // Resolve field values
          const lineAccountId=(inv.lines&&inv.lines[0])?inv.lines[0].account||'':'';
          const lineProjectId=(inv.lines&&inv.lines[0])?inv.lines[0].project_id||'':'';
          const cuentaName=acctMap[lineAccountId]||'';   // empty string if ID not resolved
          const pmName=pmMap[inv.payment_method_id]||'';  // empty string if not resolved
          const projName=projMap[lineProjectId]||'';       // empty string if not resolved

          // Fix status: if partial but nothing paid → really pending
          let dispStatus=inv.status,dispCode=purchaseStatusCode(inv.status);
          if(pendingAmt<=0.01&&totalAmt>0){dispStatus='paid';dispCode=2;}
          else if(inv.status==='partial'&&Math.abs(pendingAmt-totalAmt)<0.02){dispStatus='pending';dispCode=1;}

          allFacturas.push({
            id,holdedId:id,sociedad:soc,apiKeyEnv:envName,
            fechaEmision:isoDate(parseDate(inv.date??inv.created??inv.createdAt)),
            vencimiento: isoDate(parseDate(inv.due_date??inv.dueDate??inv.expDate)),
            num:         inv.document_number||inv.docNumber||inv.number||inv.ref||'',
            proveedor:   inv.contact_name||inv.contactName||inv.contact?.name||'',
            proyecto:    projName,
            cuenta:      cuentaName,
            cuentaId:    lineAccountId,
            formaPago:   pmName,
            pendiente:   pendingAmt,
            totalAmount: totalAmt,
            paidAmount:  paidAmt,
            estado:      purchaseStatusLabel(dispStatus),
            estadoCode:  dispCode,
            currency:    inv.currency||'EUR',
            contactIBAN: inv.contact_iban||inv.iban||'',
            contactId:   inv.contact_id||inv.contactId||'',
          });
        }
      }catch(e){errors.push({env:envName,soc,error:e.message});}
    }));

    allFacturas.sort((a,b)=>(a.vencimiento||'').localeCompare(b.vencimiento||''));
    res.json({success:true,count:allFacturas.length,data:allFacturas,errors});
  }catch(err){res.status(500).json({success:false,error:err.message});}
});

// ─── GET /api/remesas ─────────────────────────────────────────────────
app.get('/api/remesas',async(req,res)=>{
  try{
    const envs=[...new Set(ACCOUNTS_MAP.map(a=>a.apiKeyEnv))];
    const allRemesas=[];
    await Promise.allSettled(envs.map(async envName=>{
      const k=apiKeyV1(envName);
      if(!k) return;
      const soc=ACCOUNTS_MAP.find(a=>a.apiKeyEnv===envName)?.sociedad||envName;
      for(const ep of['/invoicing/v1/paymentorders','/invoicing/v1/treasury/paymentorders']){
        try{
          const data=await v1Get(ep,k);
          if(!data) continue;
          const list=Array.isArray(data)?data:(data.items||data.data||[]);
          list.forEach(rem=>{
            allRemesas.push({
              id:rem.id||rem._id,name:rem.name||rem.concept||rem.id,sociedad:soc,
              date:rem.date?new Date(rem.date>1e10?rem.date:rem.date*1000).toISOString():new Date().toISOString(),
              status:rem.status===2?'completed':rem.status===1?'sent':'pending',
              total:rem.amount||0,
              transactions:(rem.payments||rem.items||[]).map(tx=>({
                creditorName:tx.contactName||tx.name||'',creditorIBAN:tx.iban||tx.creditorIBAN||'',
                debtorIBAN:rem.iban||'',amount:tx.amount||0,concept:tx.concept||'',invoiceId:tx.invoiceId||tx.docId||null,
              })),
            });
          });
          break;
        }catch(e){}
      }
    }));
    allRemesas.sort((a,b)=>new Date(b.date)-new Date(a.date));
    res.json({success:true,data:allRemesas});
  }catch(err){res.status(500).json({success:false,error:err.message});}
});

// ─── POST /api/create-remesa ──────────────────────────────────────────
app.post('/api/create-remesa',async(req,res)=>{
  try{
    const{sociedad,debtorIBAN,facturaIds,concepto,fechaRemesa}=req.body;
    if(!sociedad||!debtorIBAN||!facturaIds?.length)
      return res.status(400).json({success:false,error:'Faltan: sociedad, debtorIBAN, facturaIds'});
    if(!concepto) return res.status(400).json({success:false,error:'El concepto es obligatorio'});

    const k=apiKeyForSoc(sociedad);
    if(!k) return res.status(400).json({success:false,error:'Sin API key v2 para '+sociedad});

    // Fetch invoices
    let rawInvoices=[];
    const fr=await Promise.allSettled([
      v2GetAll('/purchases?status=pending',k),v2GetAll('/purchases?status=overdue',k),v2GetAll('/purchases?status=partial',k),
    ]);
    fr.forEach(r=>{if(r.status==='fulfilled')rawInvoices=rawInvoices.concat(r.value||[]);});
    if(!rawInvoices.length){try{rawInvoices=await v2GetAll('/purchases',k);}catch(e){}}

    const selected=rawInvoices.filter(inv=>facturaIds.includes(inv.id||inv._id));
    if(!selected.length) return res.status(400).json({success:false,error:'No se encontraron las facturas en Holded'});

    const transactions=selected.map(inv=>({
      creditorName:inv.contact_name||inv.contactName||'',
      creditorIBAN:inv.contact_iban||inv.iban||'',
      amount:inv.payments_pending!==undefined?ph(inv.payments_pending):Math.max(0,ph(inv.total??inv.amount??0)-ph(inv.paid??inv.amountPaid??0)),
      concept:'Documento '+(inv.document_number||inv.num||inv.id),
      invoiceId:inv.id||inv._id,
    }));
    const total=transactions.reduce((s,t)=>s+t.amount,0);
    const execDateObj=fechaRemesa?new Date(fechaRemesa.split('/').reverse().join('-')):new Date();
    const execDate=isoDate(execDateObj);
    const creaDtTm=new Date().toISOString().replace('Z','');
    const debtorAcc=ACCOUNTS_MAP.find(a=>a.iban.replace(/\s/g,'')===debtorIBAN.replace(/\s/g,''));
    const bic=BIC_MAP[debtorAcc?.banco]||'NOTPROVIDED';
    const cif=CIF_MAP[sociedad]||'NOTPROVIDED';
    const msgId='Holded/'+Date.now();

    const txXml=transactions.map(tx=>
      '<CdtTrfTxInf><PmtId><EndToEndId>NOTPROVIDED</EndToEndId></PmtId>'+
      '<Amt><InstdAmt Ccy="EUR">'+tx.amount.toFixed(2)+'</InstdAmt></Amt>'+
      '<Cdtr><Nm>'+escapeXml(tx.creditorName)+'</Nm></Cdtr>'+
      '<CdtrAcct><Id><IBAN>'+escapeXml(tx.creditorIBAN)+'</IBAN></Id></CdtrAcct>'+
      '<RmtInf><Ustrd>'+escapeXml(tx.concept)+'</Ustrd></RmtInf></CdtTrfTxInf>'
    ).join('');

    const xml='<?xml version="1.0" encoding="UTF-8"?>'+
      '<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03 pain.001.001.03.xsd">'+
      '<CstmrCdtTrfInitn><GrpHdr><MsgId>'+msgId+'</MsgId><CreDtTm>'+creaDtTm+'</CreDtTm>'+
      '<NbOfTxs>'+transactions.length+'</NbOfTxs><CtrlSum>'+total.toFixed(2)+'</CtrlSum>'+
      '<InitgPty><Nm>'+escapeXml(sociedad)+'</Nm><Id><OrgId><Othr><Id>'+escapeXml(cif)+'</Id></Othr></OrgId></Id></InitgPty>'+
      '</GrpHdr><PmtInf><PmtInfId>'+msgId+'/1</PmtInfId><PmtMtd>TRF</PmtMtd><BtchBookg>false</BtchBookg>'+
      '<NbOfTxs>'+transactions.length+'</NbOfTxs><CtrlSum>'+total.toFixed(2)+'</CtrlSum>'+
      '<PmtTpInf><SvcLvl><Cd>SEPA</Cd></SvcLvl></PmtTpInf>'+
      '<ReqdExctnDt>'+execDate+'</ReqdExctnDt>'+
      '<Dbtr><Nm>'+escapeXml(sociedad)+'</Nm></Dbtr>'+
      '<DbtrAcct><Id><IBAN>'+debtorIBAN+'</IBAN></Id></DbtrAcct>'+
      '<DbtrAgt><FinInstnId><BIC>'+bic+'</BIC></FinInstnId></DbtrAgt>'+
      '<ChrgBr>SLEV</ChrgBr>'+txXml+
      '</PmtInf></CstmrCdtTrfInitn></Document>';

    // Register remesa in Holded via V1 (non-fatal)
    let holdedRemesaId=null;
    try{
      const kV1=apiKeyV1ForSoc(sociedad);
      if(kV1){
        const treasury=await v1Get('/invoicing/v1/treasury',kV1);
        const tAcc=(Array.isArray(treasury)?treasury:[]).find(a=>(a.iban||'').replace(/\s/g,'')===debtorIBAN.replace(/\s/g,''));
        const payload={name:concepto,concept:concepto,accountId:tAcc?.id||'',date:Math.floor(execDateObj.getTime()/1000),amount:total,
          payments:transactions.map(t=>({docId:t.invoiceId,amount:t.amount,concept:t.concept}))};
        for(const ep of['/invoicing/v1/paymentorders','/invoicing/v1/treasury/paymentorders']){
          try{const c=await v1Fetch('POST',ep,kV1,payload);if(c){holdedRemesaId=c.id||c._id;break;}}catch(e){}
        }
      }
    }catch(e){console.warn('remesa registration (non-fatal):',e.message);}

    res.json({success:true,xml,remesaId:holdedRemesaId,msgId,total,count:transactions.length,execDate,concepto,
      transactions:transactions.map(t=>({creditorName:t.creditorName,creditorIBAN:t.creditorIBAN,amount:t.amount,concept:t.concept,invoiceId:t.invoiceId}))});
  }catch(err){res.status(500).json({success:false,error:err.message});}
});

// ─── POST /api/mark-paid ──────────────────────────────────────────────
// Marks each purchase as paid via V2 POST /purchases/{id}/payments
// Gets banking account ID from V1 treasury (V2 /banking-accounts not in production yet)
app.post('/api/mark-paid',async(req,res)=>{
  try{
    const{transactions,debtorIBAN,fechaRemesa,concepto}=req.body;
    if(!transactions?.length) return res.status(400).json({success:false,error:'Sin transacciones'});
    const execDateObj=fechaRemesa?new Date(fechaRemesa.split('/').reverse().join('-')):new Date();
    const results=[];

    for(const tx of transactions){
      const envName=SOC_API[tx.sociedad]||'';
      const k=apiKey(envName);      // V2 for the purchase payment
      const kV1=apiKeyV1(envName);  // V1 for treasury lookup
      if(!k){results.push({invoiceId:tx.invoiceId,ok:false,error:'Sin API key v2'});continue;}
      try{
        // Get bank account ID from V1 treasury
        let bankingAccountId='';
        if(kV1){
          try{
            const treasury=await v1Get('/invoicing/v1/treasury',kV1);
            const tAcc=(Array.isArray(treasury)?treasury:[]).find(a=>(a.iban||'').replace(/\s/g,'')===debtorIBAN.replace(/\s/g,''));
            bankingAccountId=tAcc?.id||'';
          }catch(e){}
        }
        // POST payment to V2
        await v2Post('/purchases/'+tx.invoiceId+'/payments',k,{
          date:isoDate(execDateObj),
          amount:tx.amount,
          banking_account_id:bankingAccountId,
          concept:concepto||'Pago remesa SEPA',
          notes:'Cuenta: '+debtorIBAN+' | Fecha: '+isoDate(execDateObj),
        });
        results.push({invoiceId:tx.invoiceId,ok:true});
      }catch(e){
        console.error('mark-paid',tx.invoiceId,e.message);
        results.push({invoiceId:tx.invoiceId,ok:false,error:e.message});
      }
    }
    res.json({success:true,okCount:results.filter(r=>r.ok).length,errCount:results.filter(r=>!r.ok).length,results});
  }catch(err){res.status(500).json({success:false,error:err.message});}
});

app.listen(PORT,()=>console.log('✅ Servidor en puerto '+PORT+' — V1 treasury + V2 purchases'));
