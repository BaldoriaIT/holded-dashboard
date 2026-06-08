const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── Servir el dashboard HTML estático ───────────────────────────────
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Mapeo: nombre en Holded → metadatos del dashboard ───────────────
// Las API keys se leen de variables de entorno (configuradas en Render)
const ACCOUNTS_MAP = [
  { holdedName: "BALDORIA SANTANDER",  banco: "SANTANDER",  sociedad: "BALDORIA GROUP",      restaurante: "Baldoria",   iban: "ES5100496733262116292134", color: "#84ceff", apiKeyEnv: "API_BALDORIA" },
  { holdedName: "HOLDING SANTANDER",   banco: "SANTANDER",  sociedad: "BEATA BALDORIA",       restaurante: "Holding",    iban: "ES0200496733222716305627", color: "#e7ddb1", apiKeyEnv: "API_BEATA_BALDORIA" },
  { holdedName: "BILBAO SANTANDER",    banco: "SANTANDER",  sociedad: "BEATA PASTA GROUP",    restaurante: "Bilbao",     iban: "ES1500496733212816307204", color: "#FFBE5C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "PRINCESA SANTANDER",  banco: "SANTANDER",  sociedad: "BEATA PASTA GROUP",    restaurante: "Princesa",   iban: "ES6200496733212816310141", color: "#DC4C4C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "GV SANTANDER",        banco: "SANTANDER",  sociedad: "BEATA PASTA GV",       restaurante: "GV",         iban: "ES5500496733252416326691", color: "#333366", apiKeyEnv: "API_BEATA_PASTA_GV" },
  { holdedName: "CALLAO SANTANDER",    banco: "SANTANDER",  sociedad: "BEATA PASTA SMART",    restaurante: "Callao",     iban: "ES5700496733212816331571", color: "#FEDEA9", apiKeyEnv: "API_BEATA_PASTA_SMART" },
  { holdedName: "BERNABEU SANTANDER",  banco: "SANTANDER",  sociedad: "BEATA PASTA SMART",    restaurante: "Bernabeu",   iban: "ES2800496733202916332837", color: "#FEDEA9", apiKeyEnv: "API_BEATA_PASTA_SMART" },
  { holdedName: "GOYA SANTANDER",      banco: "SANTANDER",  sociedad: "BEATA PASTA FELIPE",   restaurante: "Goya",       iban: "ES4300496733262116331563", color: "#df6c49", apiKeyEnv: "API_BEATA_PASTA_FELIPE" },
  { holdedName: "FOOD TRUCK SANTANDER",banco: "SANTANDER",  sociedad: "BEATA PASTA GROUP",    restaurante: "Food Truck", iban: "ES4200496733292016317838", color: "#F7D021", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "HOLDING NADA",        banco: "SANTANDER",  sociedad: "BEATA BALDORIA",       restaurante: "Holding",    iban: "ES0300496733262116310167", color: "#e7ddb1", apiKeyEnv: "API_BEATA_BALDORIA" },
  { holdedName: "GRAN VIA SANTANDER",  banco: "SANTANDER",  sociedad: "BEATA PASTA GROUP",    restaurante: "GV",         iban: "ES3100496733252416317811", color: "#333366", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "CALEIDO SANTANDER",   banco: "SANTANDER",  sociedad: "BEATA PASTA CALEIDO",  restaurante: "Caleido",    iban: "ES1000496733252416339238", color: "#d36c6e", apiKeyEnv: "API_BEATA_PASTA_CALEIDO" },
  { holdedName: "SUR SANTANDER",       banco: "SANTANDER",  sociedad: "BEATA PASTA SUR",      restaurante: "Parque Sur", iban: "ES7200496733292016339220", color: "#fdd495", apiKeyEnv: "API_BEATA_PASTA_SUR" },
  { holdedName: "BALDORIA SABADELL",   banco: "SABADELL",   sociedad: "BALDORIA GROUP",       restaurante: "Baldoria",   iban: "ES9300817112880002361344", color: "#84ceff", apiKeyEnv: "API_BALDORIA" },
  { holdedName: "BALDORIA PRESTAMO",   banco: "SABADELL",   sociedad: "BALDORIA GROUP",       restaurante: "Baldoria",   iban: "ES1900817112800002550860", color: "#84ceff", apiKeyEnv: "API_BALDORIA" },
  { holdedName: "HOLDING SABADELL",    banco: "SABADELL",   sociedad: "BEATA BALDORIA",       restaurante: "Holding",    iban: "ES9100817112820002446452", color: "#e7ddb1", apiKeyEnv: "API_BEATA_BALDORIA" },
  { holdedName: "BILBAO SABADELL",     banco: "SABADELL",   sociedad: "BEATA PASTA GROUP",    restaurante: "Bilbao",     iban: "ES1600817112890002434752", color: "#FFBE5C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "PRINCESA SABADELL",   banco: "SABADELL",   sociedad: "BEATA PASTA GROUP",    restaurante: "Princesa",   iban: "ES8000817112860002475457", color: "#DC4C4C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "GV SABADELL",         banco: "SABADELL",   sociedad: "BEATA PASTA GV",       restaurante: "GV",         iban: "ES3600817112840002534256", color: "#333366", apiKeyEnv: "API_BEATA_PASTA_GV" },
  { holdedName: "CALEIDO SABADELL",    banco: "SABADELL",   sociedad: "BEATA PASTA CALEIDO",  restaurante: "Caleido",    iban: "ES8800817112830002594867", color: "#d36c6e", apiKeyEnv: "API_BEATA_PASTA_CALEIDO" },
  { holdedName: "SUR SABADELL",        banco: "SABADELL",   sociedad: "BEATA PASTA SUR",      restaurante: "Parque Sur", iban: "ES8000817112840002594768", color: "#fdd495", apiKeyEnv: "API_BEATA_PASTA_SUR" },
  { holdedName: "BALDORIA RENTING",    banco: "SABADELL",   sociedad: "BALDORIA GROUP",       restaurante: "Baldoria",   iban: "ES1500817112860002304937", color: "#84ceff", apiKeyEnv: "API_BALDORIA" },
  { holdedName: "BALDORIA ABANCA",     banco: "ABANCA",     sociedad: "BALDORIA GROUP",       restaurante: "Baldoria",   iban: "ES4320801208243040033442", color: "#84ceff", apiKeyEnv: "API_BALDORIA" },
  { holdedName: "BILBAO ABANCA",       banco: "ABANCA",     sociedad: "BEATA PASTA GROUP",    restaurante: "Bilbao",     iban: "ES5820801208243040041320", color: "#FFBE5C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "PRINCESA ABANCA",     banco: "ABANCA",     sociedad: "BEATA PASTA GROUP",    restaurante: "Princesa",   iban: "ES2420801208243040041544", color: "#DC4C4C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "GOYA ABANCA",         banco: "ABANCA",     sociedad: "BEATA PASTA FELIPE",   restaurante: "Goya",       iban: "ES9120801249673040000776", color: "#df6c49", apiKeyEnv: "API_BEATA_PASTA_FELIPE" },
  { holdedName: "GRAN VIA BBVA",       banco: "BBVA",       sociedad: "BEATA PASTA GROUP",    restaurante: "GV",         iban: "ES2201820901640202403599", color: "#333366", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "GV BBVA",             banco: "BBVA",       sociedad: "BEATA PASTA GV",       restaurante: "GV",         iban: "ES5401820901670202404622", color: "#333366", apiKeyEnv: "API_BEATA_PASTA_GV" },
  { holdedName: "GOYA BBVA",           banco: "BBVA",       sociedad: "BEATA PASTA FELIPE",   restaurante: "Goya",       iban: "ES6201820901680202409764", color: "#df6c49", apiKeyEnv: "API_BEATA_PASTA_FELIPE" },
  { holdedName: "BALDORIA BANKINTER",  banco: "BANKINTER",  sociedad: "BALDORIA GROUP",       restaurante: "Baldoria",   iban: "ES2601280016670100082901", color: "#84ceff", apiKeyEnv: "API_BALDORIA" },
  { holdedName: "BILBAO BANKINTER",    banco: "BANKINTER",  sociedad: "BEATA PASTA GROUP",    restaurante: "Bilbao",     iban: "ES8601280016690100082887", color: "#FFBE5C", apiKeyEnv: "API_BEATA_PASTA_GROUP" },
  { holdedName: "GOYA BANKINTER",      banco: "BANKINTER",  sociedad: "BEATA PASTA FELIPE",   restaurante: "Goya",       iban: "ES6001280016630100082873", color: "#df6c49", apiKeyEnv: "API_BEATA_PASTA_FELIPE" },
  { holdedName: "SUR CAIXA",           banco: "CAIXA",      sociedad: "BEATA PASTA SUR",      restaurante: "Parque Sur", iban: "ES1121008652850200124985", color: "#fdd495", apiKeyEnv: "API_BEATA_PASTA_SUR" },
];

// ─── Obtener API keys únicas necesarias ──────────────────────────────
function getUniqueApiKeys() {
  const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
  const keys = {};
  envs.forEach(envName => {
    keys[envName] = process.env[envName] || null;
  });
  return keys;
}

// ─── Llamar a Holded para una API key dada ───────────────────────────
async function fetchHoldedTreasury(apiKey) {
  const response = await fetch('https://api.holded.com/api/invoicing/v1/treasury', {
    headers: {
      'key': apiKey,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error(`Holded error ${response.status}`);
  return response.json();
}

// ─── Endpoint principal: /api/balances ───────────────────────────────
app.get('/api/balances', async (req, res) => {
  try {
    const apiKeys = getUniqueApiKeys();
    
    // Llamar a Holded en paralelo para todas las sociedades
    const apiKeyList = Object.entries(apiKeys).filter(([, v]) => v !== null);
    
    if (apiKeyList.length === 0) {
      return res.status(500).json({ error: 'No API keys configured. Add them in Render environment variables.' });
    }

    // Fetch all treasuries in parallel
    const results = await Promise.allSettled(
      apiKeyList.map(async ([envName, apiKey]) => {
        const data = await fetchHoldedTreasury(apiKey);
        return { envName, accounts: data };
      })
    );

    // Build a lookup: holdedName → balance
    const balanceLookup = {};
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const accounts = result.value.accounts;
        if (Array.isArray(accounts)) {
          accounts.forEach(acc => {
            // Holded returns: { id, name, balance, ... }
            if (acc.name) {
              balanceLookup[acc.name.toUpperCase().trim()] = acc.balance ?? 0;
            }
          });
        }
      }
    });

    // Map to dashboard format
    const dashboardData = ACCOUNTS_MAP.map(account => ({
      banco:       account.banco,
      sociedad:    account.sociedad,
      restaurante: account.restaurante,
      iban:        account.iban,
      color:       account.color,
      holdedName:  account.holdedName,
      saldo:       balanceLookup[account.holdedName.toUpperCase()] ?? null,
    }));

    const found    = dashboardData.filter(d => d.saldo !== null).length;
    const notFound = dashboardData.filter(d => d.saldo === null).map(d => d.holdedName);

    res.json({
      success:   true,
      updatedAt: new Date().toISOString(),
      found,
      notFound,
      data:      dashboardData,
    });

  } catch (err) {
    console.error('Error fetching Holded:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const apiKeys = getUniqueApiKeys();
  const configured = Object.entries(apiKeys).filter(([,v]) => v !== null).map(([k]) => k);
  const missing    = Object.entries(apiKeys).filter(([,v]) => v === null).map(([k]) => k);
  res.json({
    status: 'ok',
    keysConfigured: configured,
    keysMissing: missing,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🔑 API keys esperadas: API_BALDORIA, API_BEATA_BALDORIA, API_BEATA_PASTA_GROUP, API_BEATA_PASTA_GV, API_BEATA_PASTA_SMART, API_BEATA_PASTA_FELIPE, API_BEATA_PASTA_CALEIDO, API_BEATA_PASTA_SUR`);
});
