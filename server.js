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

// ─── ACCOUNT NAMES MAP ───────────────────────────────────────────────
// Maps Holded expense account IDs → readable names (from /api/debug/accounts)
// Fill in after running /api/debug/accounts — these never change
const ACCOUNT_NAMES_MAP = {
  '6847f5a2ff76e59cf20749d7': 'Compras de mercancías',
  '6847f525ac998a20d90be399': 'Compras de mercancías',
  '6847f577761b4561f60caa9c': 'Compras de mercancías',
  '65c616122afff35e3c056605': 'Compras de mercancías',
  '69148143f822329cbf02fa9d': 'Compras de mercancías',
  '65fc47a58b8070718a0790da': 'Compras de mercancías',
  '68710fd46bde831a3108468f': 'Compras de mercancías',
  '686e761af1895a26d6024111': 'Compras de mercancías',
  '6888c2e0190a1c3ce90af3cd': 'Compras de mercancías',
  '691303d76f258177590ef0f4': 'Compras de mercancías',
  '6666e0253b19255eda02fff0': 'Compras de mercancías',
  '6863b889db489850bd0c0f9e': 'Compras de mercancías',
  '6847f577761b4561f60caa9b': 'Compras de mercancías',
  '686e761af1895a26d6024112': 'Compras de mercancías',
  '69148143f822329cbf02fa9c': 'Compras de mercancías',
  '6863bc292308d23b400eca65': 'Compras de mercancías',
  '6937e076eb2bf195a80225ea': 'Compras de mercancías',
  '686e761af1895a26d6024110': 'Compras de mercancías',
  '6888c2e0190a1c3ce90af3ce': 'Compras de mercancías',
  '6966664459fcaef4490424f5': 'Compras de mercancías',
  '6966664459fcaef4490424f6': 'Compras de mercancías',
  '69a7f70630233a19240591ef': 'Compras de mercancías',
  '65fc47a38b8070718a0790a8': 'Compras de mercancías',
  '6847f5a2ff76e59cf20749d8': 'Suministros',
  '6a0d7da07260afcfe30c2806': 'Suministros',
  '6888c2df82539749f5069eb7': 'Suministros',
  '69d7b3ddc16433a08208a9ea': 'Suministros',
  '69a81decbfc6c891c906171f': 'Suministros',
  '686e7619f1895a26d60240f8': 'Suministros',
  '6985c016d1909f3492066352': 'Suministros',
  '69666644e1c8d56bd5047f1b': 'Suministros',
  '686f8ce51619ba5fa20eb2d0': 'Servicios de profesionales',
  '686e657ac7f14ae5070b3294': 'Servicios de profesionales',
  '686faf2f441641c36d0e1054': 'Servicios de profesionales',
  '69a981e8b9b68f89de05332d': 'Servicios de profesionales',
  '69a9a94711552251be0b7d39': 'Servicios de profesionales',
  '69b2ebfaf7d87355430bddba': 'Servicios de profesionales',
  '6a01ba48a67422b1df095060': 'Servicios de profesionales',
  '6847f524ac998a20d90be36b': 'Servicios de profesionales',
  '68bac7a0265593642d08979c': 'Servicios de profesionales',
  '6966664459fcaef4490424f0': 'Servicios de profesionales',
  '686fa5be31d8e9ba1106defe': 'Servicios de profesionales',
  '6870f0ed198c2556b30afe2b': 'Servicios de profesionales',
  '686b9b099aff168dd70762c7': 'Servicios de profesionales',
  '6847f525ac998a20d90be398': 'Servicios de profesionales',
  '65fc47a58b8070718a0790d9': 'Servicios de profesionales',
  '691301583e76fc162e0a335b': 'Servicios de profesionales',
  '69fc66b148b4689fc00ad1a4': 'Servicios de profesionales',
  '6978b125c09eb64cc40cbefb': 'Servicios de profesionales',
  '686e761af1895a26d602410a': 'Servicios de profesionales',
  '686656306ec46bde8f0291b2': 'Arrendamientos y cánones',
  '69a8044c8014bf83c601336e': 'Arrendamientos y cánones',
  '68ca9ab64fa696e2ac0da2f7': 'Arrendamientos y cánones',
  '68ca99fc55c240e43d0da48d': 'Arrendamientos y cánones',
  '69a80279a243c35a9d038cbc': 'Arrendamientos y cánones',
  '686e761af1895a26d602410f': 'Arrendamientos y cánones',
  '69aefce0e0184c198e040d79': 'Arrendamientos y cánones',
  '69b3d4fd8c81ce846a075b50': 'Reparaciones y mantenimiento',
  '69a70cc75ad80197240e25c3': 'Reparaciones y mantenimiento',
  '69b3d2d9c9615f931a0c703b': 'Reparaciones y mantenimiento',
  '69a70b1598c1fcee32073c37': 'Reparaciones y mantenimiento',
  '6847f577761b4561f60caaa1': 'Reparaciones y mantenimiento',
  '6847f5a2ff76e59cf20749dc': 'Reparaciones y mantenimiento',
  '69b04fd7a4dca689c3063515': 'Servicios bancarios y similares',
  '69de6bb05ea4255c0006df49': 'Servicios bancarios y similares',
  '69723a2dfb8fa28d9604f12e': 'Servicios bancarios y similares',
  '686bcbe4cc157ba34409433b': 'Servicios bancarios y similares',
  '69c1067c4582f83da6002640': 'Servicios bancarios y similares',
  '686e36554fd1303a85022bc2': 'Suministros de energía',
  '68924ddfc11b16fb870da37c': 'Suministros de energía',
  '6966603dc24e76df820c123d': 'Suministros de energía',
  '68668786a0fefbed5204272d': 'Suministros de energía',
  '69c4057511c9baabb1017e6b': 'Suministros de energía',
  '68b98100020818dd5d048dd3': 'Suministros de agua',
  '686e79930e742b040409486e': 'Comunicaciones',
  '686bb83f8d121114d2049900': 'Comunicaciones',
  '686e761af1895a26d60240ff': 'Comunicaciones',
  '695fcd589a4d9cbf3e0810cb': 'Comunicaciones',
  '68710fd46bde831a31084681': 'Comunicaciones',
  '68710fd5852797852b01668d': 'Comunicaciones',
  '69ca82b065fea1f7480cc389': 'Comunicaciones',
  '686e65228910a17c9b0f3ce0': 'Sueldos y salarios',
  '69a6c81834ce2c4fc30c9cb8': 'Sueldos y salarios',
  '69417241b1139ffc860445ac': 'Sueldos y salarios',
  '68710fd46bde831a31084689': 'Sueldos y salarios',
  '6864fcce6c6fada5170b35b8': 'Sueldos y salarios',
  '6888c2e0190a1c3ce90af3bf': 'Sueldos y salarios',
  '6a2a964115a5fbf1cf0a5280': 'Sueldos y salarios',
  '660135b250a01eca5d043acf': 'Vestuario',
  '69a825362ef17720e40b1c2a': 'Vestuario',
  '69b2f2a274930bd2a40053e5': 'Vestuario',
  '6a0db7982197fcc2ba0aee76': 'Vestuario',
  '69a6d726c081d5a2ce0c873a': 'Vestuario',
  '69a8311d635ab076c70a697b': 'Vestuario',
  '660135b250a01eca5d043acd': 'Publicidad y relaciones públicas',
  '660135b150a01eca5d043a95': 'Publicidad y relaciones públicas',
  '69bd24b0525d48d3c200a32e': 'Publicidad y relaciones públicas',
  '69bd23cccc09dfb6520e932a': 'Publicidad y relaciones públicas',
  '69bd23e43338d190a40c0609': 'Publicidad y relaciones públicas',
  '6a1d769cdf687a7ba901be9e': 'Publicidad y relaciones públicas',
  '6a217bc6628530f6c2086df3': 'Publicidad y relaciones públicas',
  '69bd251c0c754e4d2a0b0165': 'Publicidad y relaciones públicas',
  '69bd21ee55cfc058ab044fa0': 'Publicidad y relaciones públicas',
  '69bd21f9d9f65193c1091ee5': 'Publicidad y relaciones públicas',
  '686e79930e742b0404094866': 'Limpieza',
  '68663cbe5a738604150499be': 'Limpieza',
  '69a95edf3524103f300000ad': 'Limpieza',
  '68651672b14d94d60b021172': 'Limpieza',
  '686fa5be31d8e9ba1106def6': 'Limpieza',
  '6932e9dccafb2460b0023a5b': 'Limpieza',
  '69666644e1c8d56bd5047f1a': 'Limpieza',
  '69a57264f7c6903ea50b7757': 'Limpieza',
  '6a1edc83b79dd4452601f5c3': 'Limpieza',
  '69a95f0747c95ff3290d8c1c': 'Limpieza',
  '69f31441d9c75bc3dc09c9e2': 'Limpieza',
  '69a701531384b3627001cd23': 'Seguridad',
  '69a702505ef31e9949079e46': 'Seguridad',
  '69a6ff70c644c614f300a745': 'Seguridad',
  '69a6fee97b7c6dc0f10f0e2f': 'Seguridad',
  '69a70032dbb43674f1066165': 'Seguridad',
  '69a95e75dda16395740aa08f': 'Seguridad',
  '69b9154e7d6c7e9d2d06944d': 'Seguridad',
  '6847f525ac998a20d90be39a': 'Equipamiento sala',
  '6a0d80bfc694eb0e9900c1fc': 'Equipamiento sala',
  '6847f577761b4561f60caa9d': 'Equipamiento sala',
  '69ccfb10f9816edb590071a8': 'Equipamiento cocina',
  '6a0d81438462b251470abda3': 'Equipamiento cocina',
  '69a81af8991a78ea3d0f5a38': 'Equipamiento cocina',
  '6a0d814f87779d1131079044': 'Vajilla y menaje',
  '6a0d80210d7b5da36a0c2493': 'Otros aprovisionamientos',
  '69b7d0398b46e40dd409fae8': 'Otros aprovisionamientos',
  '69b03ecd375ea70641039a5a': 'Otros aprovisionamientos',
  '68de8a0b24559736a10125b6': 'Transportes',
  '6995cf77bcf3cddd2d02cc93': 'Transportes',
  '6966603d1774664e150942bd': 'Otros tributos',
  '69147f7718aa68d3740ff0ca': 'Otros tributos',
  '69ca2ec9bf6cc7b36e072df6': 'Cargas sociales',
  '6966603dc24e76df820c123f': 'Constitución y gastos primer establecimiento',
  '69666644e1c8d56bd5047f26': 'Constitución y gastos primer establecimiento',
  '69147f7518aa68d3740ff05f': 'Obras y reformas',
  '6966603ff2e4a1ec1706a9ea': 'Mobiliario',
  '69c3be6ac43c56d175068dbf': 'Mobiliario',
  '69148142f822329cbf02fa48': 'Mobiliario',
  '6966603d1774664e150942bc': 'Servicios de profesionales',
  '6888c2e082539749f5069ec7': 'Servicios de profesionales',
  '6863c5a36497796c8c04474e': 'Otros servicios',
  '69a95cbe4cbc7a4e3d0424ad': 'Otros servicios',
  '6863c1bbe05bba2b3a0c1391': 'Otros servicios',
  '65fc47a48b8070718a0790ac': 'Otros servicios',
  '65c616122afff35e3c05660a': 'Otros servicios',
  '69b28a7fd89fdf8619084d92': 'Otros servicios',
  '69b290ec53cf8189ce01524c': 'Otros servicios',
  '65c616122afff35e3c05660e': 'Otros servicios',
  '6888c2e0190a1c3ce90af3c3': 'Otros servicios',
  '68710fd46bde831a3108468c': 'Otros servicios',
  '6888c2e082539749f5069ec3': 'Otros gastos',
  '6888c2e082539749f5069ec2': 'Otros gastos',
  '6888c2e082539749f5069ec1': 'Otros gastos',
  '6888c2e0190a1c3ce90af3cb': 'Otros gastos',
  '6932cd5bf321cb4fd105653e': 'Otros gastos',
};

// ─── TREASURY ACCOUNT IDS ────────────────────────────────────────────
// Hardcoded from Holded — holdedName → treasury account ID
// Used by mark-paid to assign the correct banking account
const TREASURY_ID_MAP = {
  'BALDORIA SANTANDER': '6848549e51ebcaed81069faf',
  'HOLDING SANTANDER': '68485ad483f8a5cc8a010698',
  'BILBAO SANTANDER': '68485c45c653ee6d650068bc',
  'PRINCESA SANTANDER': '68485c45c653ee6d650068bd',
  'GV SANTANDER': '68485da6914a5318b3031b44',
  'CALLAO SANTANDER': '6889f7560bf83f7cc0050ca2',
  'BERNABEU SANTANDER': '6889f7560bf83f7cc0050ca2',
  'GOYA SANTANDER': '68485e63501f9892df09ec46',
  'FOOD TRUCK SANTANDER': '68485c45c653ee6d650068be',
  'HOLDING NADA': '6a26e31ea5a671d9850d7d60',
  'GRAN VIA SANTANDER': '698dad721812eaa0eb0d5c0e',
  'CALEIDO SANTANDER': '699c286a59d09e48f80827af',
  'SUR SANTANDER': '699c27c25125eabaaa03c0a3',
  'BALDORIA SABADELL': '684be55a3dd5a8e3ff04c423',
  'BALDORIA PRESTAMO': '6a26e11df53951c32604a1ea',
  'HOLDING SABADELL': '6889f59d6df68fa34d0a29d8',
  'BILBAO SABADELL': '688794968cc925b1d5008bc9',
  'PRINCESA SABADELL': '688794968cc925b1d5008bca',
  'GV SABADELL': '6888f06d0b2c5493260914b9',
  'CALEIDO SABADELL': '6a26e21993d6edf9bb071126',
  'SUR SABADELL': '69fda2cf8c4bae5696090640',
  'BALDORIA RENTING': '684be55a3dd5a8e3ff04c422',
  'BALDORIA ABANCA': '684855fd959185e20d0d9733',
  'BILBAO ABANCA': '6889ee7e63ebcd97e201e50c',
  'PRINCESA ABANCA': '6889ee7e63ebcd97e201e50d',
  'GOYA ABANCA': '6a26e309f8e927f0370f8482',
  'GRAN VIA BBVA': '69c2c3442e178a6bed0ed42b',
  'GV BBVA': '6a26e3dd847e7460e803cef3',
  'GOYA BBVA': '6942d5d41fcb743ed00130f8',
  'BALDORIA BANKINTER': '6a26e0d956dbecf575093f89',
  'BILBAO BANKINTER': '6a26e5c6eb312f15360766c9',
  'GOYA BANKINTER': '6942dbc972ee4b725b0f3f6c',
  'SUR CAIXA': '6a26e6bda9ece85c2f0fed06',
};

// Treasury cache to avoid repeated fetches (5 minute TTL)
const _treasuryCache = {}; // { envName: { ts, data } }
async function getV1Treasury(envName) {
  const k = apiKeyV1(envName);
  if (!k) return [];
  const cached = _treasuryCache[envName];
  const now = Date.now();
  if (cached && (now - cached.ts) < 5*60*1000) return cached.data;
  const data = await withRetry(() => v1Get('/invoicing/v1/treasury', k));
  const accounts = Array.isArray(data) ? data : [];
  _treasuryCache[envName] = { ts: now, data: accounts };
  return accounts;
}

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

// ─── Retry helper for rate-limited calls ─────────────────────────────
async function withRetry(fn, retries=3, baseDelay=600) {
  for (let i=0; i<retries; i++) {
    try {
      return await fn();
    } catch(e) {
      const isRetryable = e.message && (
        e.message.includes('Premature close') ||
        e.message.includes('429') ||
        e.message.includes('ECONNRESET') ||
        e.message.includes('socket hang up')
      );
      if (!isRetryable || i===retries-1) throw e;
      const delay = baseDelay * Math.pow(2, i); // 600ms, 1200ms, 2400ms
      console.log(`Retry ${i+1}/${retries} after ${delay}ms: ${e.message}`);
      await new Promise(r=>setTimeout(r,delay));
    }
  }
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

// Extract meaningful cuenta name from line item description
// e.g. "Factura de servicios de X de PROVEEDOR" → trim to useful part
function lineItemNameClean(name) {
  if (!name) return '';
  // Remove "Factura de ... de PROVEEDOR" pattern, keep the service type
  const clean = name.replace(/\s*de\s+[A-Z][A-Z\s]+S\.?[AL]\.?.*$/i,'').replace(/^Factura\s+(de\s+)?/i,'').trim();
  return clean.length > 3 ? clean.substring(0,40) : '';
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
app.get('/api/debug/lookups',async(req,res)=>{
  const envName=req.query.env||'API_BALDORIA';
  const kV1=apiKeyV1(envName);
  const kV2=apiKey(envName);
  if(!kV1) return res.json({error:'No v1 key for: '+envName});
  const results={};
  // V1 endpoints (key: header)
  const v1eps=[
    '/invoicing/v1/treasury',
    '/invoicing/v1/expenseaccounts','/accounting/v1/expenseaccounts',
    '/invoicing/v1/accounts','/accounting/v1/accounts',
    '/invoicing/v1/paymentmethods','/invoicing/v1/payment-methods',
    '/projects/v1/projects','/invoicing/v1/projects',
  ];
  for(const ep of v1eps){
    try{
      const r=await fetch('https://api.holded.com/api'+ep+'?limit=5',{
        headers:{key:kV1,'Accept':'application/json'},signal:AbortSignal.timeout(6000)
      });
      const text=await r.text();
      const isHtml=text.trim().startsWith('<');
      let parsed=null;try{parsed=JSON.parse(text);}catch(e){}
      const items=Array.isArray(parsed)?parsed:(parsed&&(parsed.items||parsed.data)||[]);
      results['V1:'+ep]={status:r.status,isJson:!isHtml&&!!parsed,
        itemCount:Array.isArray(items)?items.length:0,
        items:Array.isArray(items)?items.slice(0,3).map(x=>({id:x.id,name:x.name,iban:x.iban})):null};
    }catch(e){results['V1:'+ep]={error:e.message};}
  }
  // V2 endpoint for purchases payment - show what fields it returns on OPTIONS
  res.json({envName,timestamp:new Date().toISOString(),results});
});

app.get('/api/debug/facturas',async(req,res)=>{
  const envName=req.query.env||'API_BALDORIA';
  const k=apiKey(envName);
  const kV1=apiKeyV1(envName);
  if(!k) return res.json({error:'No v2 key for: '+envName});

  const knownId='6a2152e1d60c3a4b77037cfc'; // known purchase ID
  const knownAcctId='69a95cbe4cbc7a4e3d0424ad'; // known account ID

  // Test: fetch same purchase via v1 — does it have account name?
  let v1Purchase=null;
  try{
    const r=await fetch('https://api.holded.com/api/invoicing/v1/documents/'+knownId,{
      headers:{key:kV1,'Accept':'application/json'},signal:AbortSignal.timeout(8000)});
    const t=await r.text();const isHtml=t.trim().startsWith('<');
    v1Purchase={status:r.status,isHtml,body:isHtml?null:JSON.parse(t)};
  }catch(e){v1Purchase={error:e.message};}

  // Test: v1 list of documents — do they have account names?
  let v1List=null;
  try{
    const r=await fetch('https://api.holded.com/api/invoicing/v1/documents?docType=purchase&limit=1',{
      headers:{key:kV1,'Accept':'application/json'},signal:AbortSignal.timeout(8000)});
    const t=await r.text();const isHtml=t.trim().startsWith('<');
    v1List={status:r.status,isHtml,keys:isHtml?[]:Object.keys(JSON.parse(t)[0]||{})};
  }catch(e){v1List={error:e.message};}

  // Test v2 payments endpoint
  let v2pay=null;
  try{
    const r=await fetch('https://api.holded.com/api/v2/purchases/'+knownId+'/payments',{
      headers:{'Authorization':'Bearer '+k},signal:AbortSignal.timeout(8000)});
    const t=await r.text();
    v2pay={status:r.status,isHtml:t.trim().startsWith('<'),preview:t.substring(0,200)};
  }catch(e){v2pay={error:e.message};}

  res.json({envName,v1Purchase,v1List,v2pay,tip:'Check v1Purchase.body for accountName field'});
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
    // Sequential calls with delay to avoid 429 rate limit
    const results=[];
    for(const envName of envs){
      const k=apiKeyV1(envName);
      if(!k){results.push({status:'fulfilled',value:{envName,accounts:[]}});continue;}
      try{
        const data=await getV1Treasury(envName);
        results.push({status:'fulfilled',value:{envName,accounts:Array.isArray(data)?data:[]}});
      }catch(e){
        console.error('balances',envName,e.message);
        results.push({status:'fulfilled',value:{envName,accounts:[],error:e.message}});
      }
      await new Promise(r=>setTimeout(r,500)); // 500ms between societies
    }

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

    // Sequential with delay to avoid 429
    for(const envName of envs){
      const k=apiKey(envName);
      if(!k) continue;
      const soc=ACCOUNTS_MAP.find(a=>a.apiKeyEnv===envName)?.sociedad||envName;
      try{
        // Fetch purchases (v2) + lookup tables (v1 — v2 endpoints return 403/404)
        const kV1lookup = apiKeyV1(envName);
        const [pendRes,ovrRes,parRes,acctRes,pmRes,projRes]=await Promise.allSettled([
          v2GetAll('/purchases?status=pending',k),
          v2GetAll('/purchases?status=overdue',k),
          v2GetAll('/purchases?status=partial',k),
          // Expense accounts — v1 works, v2 returns 404
          // Expense accounts: all known endpoints return HTML — skip for now
          // cuenta names will be resolved per-invoice via v2 after fetch
          Promise.resolve([]),
          // Payment methods: confirmed at /invoicing/v1/paymentmethods
          kV1lookup ? v1GetAll('/invoicing/v1/paymentmethods',kV1lookup).catch(()=>[]) : Promise.resolve([]),
          // Projects: try multiple v1 paths
          kV1lookup ? (async()=>{
            for(const ep of['/projects/v1/projects','/invoicing/v1/projects','/projects/v1/list']){
              try{const r=await v1GetAll(ep,kV1lookup);if(r&&r.length>0)return r;}catch(e){}
            }
            return [];
          })() : Promise.resolve([]),
        ]);

        let rawInvoices=[];
        [pendRes,ovrRes,parRes].forEach(r=>{if(r.status==='fulfilled'&&Array.isArray(r.value))rawInvoices=rawInvoices.concat(r.value);});
        if(rawInvoices.length===0){
          try{const all=await v2GetAll('/purchases',k);rawInvoices=all.filter(inv=>!['paid','voided'].includes(inv.status));}
          catch(e){errors.push({env:envName,soc,error:'fallback: '+e.message});}
        }

        // Fetch cobros (sales invoices) for CF13
        let rawSales=[];
        try{
          const [saleP,saleO]=await Promise.allSettled([
            v2GetAll('/invoices?status=pending',k),
            v2GetAll('/invoices?status=overdue',k),
          ]);
          [saleP,saleO].forEach(r=>{if(r.status==='fulfilled'&&Array.isArray(r.value))rawSales=rawSales.concat(r.value);});
        }catch(e){}

        // Build lookup maps: ID → name
        const acctMap={},pmMap={},projMap={};
        // acctRes is empty (no working endpoint) — resolve per-ID via v2 below
        if(pmRes.status==='fulfilled'&&Array.isArray(pmRes.value))
          pmRes.value.forEach(p=>{if(p.id) pmMap[p.id]=p.name||p.payment_method||'';});
        if(projRes.status==='fulfilled'&&Array.isArray(projRes.value))
          projRes.value.forEach(p=>{if(p.id) projMap[p.id]=p.name||p.title||'';});

        // Resolve cuenta names: try v1 GET /invoicing/v1/documents/{id} for each unique account ID
        // This is the only known path that might return account names in Holded
        if(kV1lookup){
          const uniqueAcctIds=[...new Set(rawInvoices.map(inv=>inv.lines?.[0]?.account).filter(Boolean))];
          // Fetch max 10 unique accounts to avoid rate limit
          const toFetch=uniqueAcctIds.slice(0,10);
          for(const acctId of toFetch){
            if(acctMap[acctId]) continue;
            // Try: GET first invoice that uses this account to extract account info from v1
            const sampleInv=rawInvoices.find(inv=>inv.lines?.[0]?.account===acctId);
            if(sampleInv){
              try{
                const v1inv=await v1Get('/invoicing/v1/documents/'+sampleInv.id,kV1lookup);
                if(v1inv){
                  // v1 might return accountName, account.name, or similar
                  const aName=v1inv.accountName||v1inv.account?.name||v1inv.ledgerAccount||
                    (v1inv.lines&&v1inv.lines[0]&&(v1inv.lines[0].accountName||v1inv.lines[0].account?.name))||'';
                  if(aName) acctMap[acctId]=aName;
                }
              }catch(e){}
            }
            await new Promise(r=>setTimeout(r,150)); // avoid 429
          }
        }

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
          // Allow negative amounts (credit notes / avoirs subtract from total)
          paidAmt=Math.max(0,paidAmt);

          // Resolve field values
          const lineAccountId=(inv.lines&&inv.lines[0])?inv.lines[0].account||'':'';
          const lineProjectId=(inv.lines&&inv.lines[0])?inv.lines[0].project_id||'':'';
          // acctMap populated from v1 /invoicing/v1/expenseaccounts (when available)
          // Fallback: use line name as cuenta description
          const lineItemName=(inv.lines&&inv.lines[0])?inv.lines[0].name||'':'';
          // Cuenta: check ACCOUNT_NAMES_MAP first (user-populated from Holded)
          // Format in Holded: "62100001 Compras de mercancías" → we want "Compras de mercancías"
          const extractAfterCode = (s) => {
            if (!s) return '';
            const m = String(s).match(/^\d{6,10}\s+(.+)$/);
            return m ? m[1].trim() : s.trim();
          };
          const cuentaRaw = ACCOUNT_NAMES_MAP[lineAccountId] || acctMap[lineAccountId] || '';
          const cuentaName = cuentaRaw ? extractAfterCode(cuentaRaw) : (lineAccountId ? lineItemNameClean(lineItemName) : '');
          const pmName=pmMap[inv.payment_method_id]||'';
          const projName=projMap[lineProjectId]||'';

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
            type:        'expense',
          });
        }

        // Push cobros (sales invoices) with type='income' for CF13
        const seenSales=new Set();
        for(const inv of rawSales){
          const id=inv.id||inv._id;
          if(!id||seenSales.has(id)) continue;
          seenSales.add(id);
          if(['paid','voided'].includes(inv.status)) continue;
          const totalAmt2=ph(inv.total??inv.subtotal??inv.amount);
          let pendingAmt2;
          if(inv.payments_pending!==undefined&&inv.payments_pending!==null) pendingAmt2=ph(inv.payments_pending);
          else { const paid2=ph(inv.paid??inv.paidAmount??0); pendingAmt2=Math.max(0,totalAmt2-paid2); }
          if(pendingAmt2<=0) continue;
          allFacturas.push({
            id:'sale_'+id,holdedId:id,sociedad:soc,apiKeyEnv:envName,
            fechaEmision:isoDate(parseDate(inv.date??inv.created)),
            vencimiento: isoDate(parseDate(inv.due_date??inv.dueDate)),
            num:         inv.document_number||inv.docNumber||inv.number||'',
            proveedor:   inv.contact_name||inv.contactName||'',
            proyecto:'',cuenta:'',formaPago:'',
            pendiente:pendingAmt2,totalAmount:totalAmt2,paidAmount:totalAmt2-pendingAmt2,
            estado:'Pendiente cobro',estadoCode:1,currency:inv.currency||'EUR',
            contactIBAN:'',contactId:inv.contact_id||'',
            type:'income',
          });
        }
      }catch(e){errors.push({env:envName,soc,error:e.message});}
      await new Promise(r=>setTimeout(r,300)); // 300ms between societies
    }

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
    const{transactions,debtorIBAN,debtorAccountName,fechaRemesa,concepto}=req.body;
    if(!transactions?.length) return res.status(400).json({success:false,error:'Sin transacciones'});
    const execDateObj=fechaRemesa?new Date(fechaRemesa.split('/').reverse().join('-')):new Date();
    const results=[];

    for(const tx of transactions){
      let envName=SOC_API[tx.sociedad]||'';
      // Fallback: if sociedad not found, try all envs to find the invoice
      if(!envName){
        for(const [soc,env] of Object.entries(SOC_API)){
          if(apiKey(env)){envName=env;break;}
        }
        console.warn('sociedad "'+tx.sociedad+'" not in SOC_API, using fallback envName='+envName);
      }
      const k=apiKey(envName);
      const kV1=apiKeyV1(envName);
      if(!k){results.push({invoiceId:tx.invoiceId,ok:false,error:'Sin API key para sociedad: '+(tx.sociedad||'desconocida')});continue;}
      try{
        // Get bank account ID — direct lookup from hardcoded TREASURY_ID_MAP
        // No API call needed — bypasses rate limits and v1/v2 auth issues
        let bankingAccountId = '';
        let accountName = '';
        const cleanIBAN = debtorIBAN.replace(/[\s-]/g,'').toUpperCase();
        const accEntry = ACCOUNTS_MAP.find(a => a.iban.replace(/[\s-]/g,'').toUpperCase() === cleanIBAN);
        if (accEntry) {
          accountName      = accEntry.holdedName;
          bankingAccountId = TREASURY_ID_MAP[accEntry.holdedName] || '';
        }
        if (!bankingAccountId && debtorAccountName) {
          bankingAccountId = TREASURY_ID_MAP[debtorAccountName] || '';
          if (!accountName) accountName = debtorAccountName;
        }
        console.log('mark-paid account: "'+accountName+'" id='+bankingAccountId+' iban='+debtorIBAN);
        // POST payment — try all known field names for banking account
        const paymentBody={
          date:isoDate(execDateObj),
          amount:tx.amount,
          concept:concepto||'Pago remesa SEPA',
          notes:'Cuenta: '+accountName+'  IBAN: '+debtorIBAN+' | Fecha: '+isoDate(execDateObj),
        };
        if(bankingAccountId){
          paymentBody.banking_account_id=bankingAccountId;
          paymentBody.bank_account_id=bankingAccountId;
          paymentBody.treasury_account_id=bankingAccountId;
        }
        // Mark as paid via v2 POST /purchases/{id}/payments
        // bankingAccountId from v1 treasury (matched by IBAN/holdedName)
        const v2PayBody = {
          date:    isoDate(execDateObj),
          amount:  tx.amount,
          concept: concepto||'Pago remesa SEPA',
          notes:   accountName ? 'Cuenta: '+accountName : undefined,
        };
        if (bankingAccountId) {
          // Try all known Holded v2 field names for banking account
          v2PayBody.banking_account_id  = bankingAccountId;
          v2PayBody.treasury_account_id = bankingAccountId;
          v2PayBody.account_id          = bankingAccountId;
        }

        let payOk = false;
        let lastError = '';

        // Attempt 1: v2
        try {
          await v2Post('/purchases/'+tx.invoiceId+'/payments', k, v2PayBody);
          payOk = true;
          console.log('v2 pay ✅ invoice='+tx.invoiceId+' account="'+accountName+'" bankId='+bankingAccountId);
        } catch(e1) {
          lastError = (e1.message||String(e1));
          console.warn('v2 pay failed:', lastError);
        }

        // Attempt 2: v1 (uses same v2 ID — may fail for old invoices)
        if (!payOk && kV1) {
          try {
            await v1Fetch('POST', '/invoicing/v1/documents/'+tx.invoiceId+'/pay', kV1, {
              date:      Math.floor(execDateObj.getTime()/1000),
              amount:    tx.amount,
              accountId: bankingAccountId||undefined,
              concept:   concepto||'Pago remesa SEPA',
            });
            payOk = true;
            console.log('v1 pay ✅ invoice='+tx.invoiceId);
          } catch(e2) {
            lastError = (e2.message||String(e2));
            console.warn('v1 pay failed:', lastError);
          }
        }

        results.push({invoiceId:tx.invoiceId, ok:payOk, error:payOk?undefined:lastError, bankingAccountId, accountName});
      }catch(e){
        const errMsg = (e && (e.message || String(e))) || 'Error desconocido';
        console.error('mark-paid',tx.invoiceId,errMsg);
        results.push({invoiceId:tx.invoiceId,ok:false,error:errMsg});
      }
    }
    res.json({success:true,okCount:results.filter(r=>r.ok).length,errCount:results.filter(r=>!r.ok).length,results});
  }catch(err){res.status(500).json({success:false,error:err.message});}
});


// ─── GET /api/debug/test-payment ─────────────────────────────────────
// Tests what field name Holded v2 uses for banking account in payments
// Usage: /api/debug/test-payment?env=API_BALDORIA&invoiceId=XXX&dryRun=1
app.get('/api/debug/test-payment', async (req, res) => {
  const envName = req.query.env || 'API_BALDORIA';
  const invoiceId = req.query.invoiceId;
  const dryRun = req.query.dryRun === '1';
  const k = apiKey(envName);
  if (!k) return res.json({error:'No v2 key for '+envName});
  if (!invoiceId) return res.json({error:'Need ?invoiceId=XXX', 
    tip:'Get an invoiceId from /api/facturas and pass it here'});

  // First get the invoice details to confirm it exists
  let invoice = null;
  try {
    const r = await fetch('https://api.holded.com/api/v2/purchases/'+invoiceId, {
      headers:{'Authorization':'Bearer '+k}, signal:AbortSignal.timeout(8000)
    });
    const t = await r.text();
    invoice = {status:r.status, isHtml:t.startsWith('<'), preview:t.substring(0,300)};
  } catch(e) { invoice = {error:e.message}; }

  if (dryRun) {
    return res.json({dryRun:true, invoice, 
      message:'Add dryRun=0 to actually test payment', 
      knownBankIds:Object.entries(TREASURY_ID_MAP).slice(0,5)});
  }

  // Try each possible field name with amount=0.01
  const bankId = '6848549e51ebcaed81069faf'; // BALDORIA SANTANDER
  const attempts = [];
  for (const [field, value] of [
    ['banking_account_id', bankId],
    ['treasury_account_id', bankId],
    ['account_id', bankId],
    ['bankAccountId', bankId],
    ['bank_account_id', bankId],
  ]) {
    const body = {date:isoDate(new Date()), amount:0.01, concept:'TEST borrar', [field]:value};
    try {
      const r = await fetch('https://api.holded.com/api/v2/purchases/'+invoiceId+'/payments', {
        method:'POST', headers:{'Authorization':'Bearer '+k,'Content-Type':'application/json'},
        body:JSON.stringify(body), signal:AbortSignal.timeout(8000)
      });
      const t = await r.text();
      let parsed; try{parsed=JSON.parse(t);}catch(e){parsed=t.substring(0,200);}
      attempts.push({field, status:r.status, ok:r.ok, response:parsed});
      if (r.ok) break; // stop on first success
    } catch(e) { attempts.push({field, error:e.message}); }
  }
  res.json({envName, invoiceId, bankId, attempts});
});

app.listen(PORT,()=>console.log('✅ Servidor en puerto '+PORT+' — V1 treasury + V2 purchases'));

// ─── GET /api/debug/accounts ─────────────────────────────────────────
// Lists all unique expense account IDs found across ALL societies
// Run once, copy the IDs, fill in ACCOUNT_NAMES_MAP above
app.get('/api/debug/accounts', async (req, res) => {
  const allIds = {};
  const envs = [...new Set(ACCOUNTS_MAP.map(a => a.apiKeyEnv))];
  for (const envName of envs) {
    const k = apiKey(envName);
    if (!k) continue;
    const soc = ACCOUNTS_MAP.find(a => a.apiKeyEnv === envName)?.sociedad || envName;
    try {
      const purchases = await v2GetAll('/purchases', k);
      purchases.forEach(inv => {
        if (inv.lines) inv.lines.forEach(l => {
          if (l.account) {
            if (!allIds[l.account]) allIds[l.account] = { count: 0, societies: [], sampleLineName: l.name || '' };
            allIds[l.account].count++;
            if (!allIds[l.account].societies.includes(soc)) allIds[l.account].societies.push(soc);
          }
        });
      });
    } catch(e) { /* skip */ }
    await new Promise(r => setTimeout(r, 400));
  }
  const sorted = Object.entries(allIds)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([id, info]) => ({ id, count: info.count, societies: info.societies, sampleLineName: info.sampleLineName }));
  res.json({ total: sorted.length, accounts: sorted,
    instructions: 'Add entries to ACCOUNT_NAMES_MAP in server.js: { "ID": "Nombre cuenta" }' });
});
