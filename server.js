// ─── GET /api/debug/facturas ─────────────────────────────────────────
app.get('/api/debug/facturas', async (req, res) => {
  const envName = req.query.env || 'API_BEATA_PASTA_GROUP';
  const k = apiKey(envName);
  if (!k) return res.json({ error:'No API key for env: '+envName, envVars: Object.keys(process.env).filter(e=>e.startsWith('API_')) });

  const keyInfo = { length: k.length, first4: k.substring(0,4), last4: k.slice(-4) };
  const results = {};

  const toTest = [
    '/invoicing/v1/treasury',                                    // known working
    '/invoicing/v1/documents?docType=purchase&page=1&limit=3',  // v1 docs API
    '/invoicing/v1/documents?docType=purchase&status=pending&page=1&limit=3',
    '/invoicing/v1/documents?docType=salesreceipt&page=1&limit=3', // test if ANY docType works
    '/invoicing/v1/documents?docType=invoice&page=1&limit=3',
    '/invoicing/v1/expenses?page=1&limit=3',
    '/invoicing/v1/bills?page=1&limit=3',
  ];

  for (const ep of toTest) {
    try {
      const r = await fetch('https://api.holded.com/api'+ep, {
        headers: { key: k, Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      const text = await r.text();
      const isHtml = text.trim().startsWith('<');
      let parsed = null;
      if (!isHtml) { try { parsed = JSON.parse(text); } catch(e) {} }
      const items = Array.isArray(parsed) ? parsed : (parsed?.items||parsed?.data||[]);
      results[ep] = {
        status: r.status,
        isHtml,
        isJson: !isHtml && parsed!==null,
        itemCount: items.length,
        // For treasury: show account names so we can fix the ACCOUNTS_MAP
        accountNames: ep.includes('treasury') ? items.map(a=>a.name||a.id) : undefined,
        keys: items[0] ? Object.keys(items[0]).slice(0,12) : [],
        preview: text.substring(0, isHtml ? 80 : 300),
      };
    } catch(e) {
      results[ep] = { error: e.message };
    }
  }
  res.json({ envName, keyInfo, timestamp: new Date().toISOString(), results });
});
