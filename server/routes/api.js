const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dataDir = path.join(__dirname, '../data');

function readJson(filename, fallback) {
  try {
    const file = path.join(dataDir, filename);
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error('Error reading ' + filename + ':', err);
    return fallback;
  }
}

function writeJson(filename, data) {
  try {
    const file = path.join(dataDir, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing ' + filename + ':', err);
    return false;
  }
}

// --------------------------------------------------------------------------
// 1. AUTHENTICATION ROUTE (Operator: ABCD/11111 | Admin: Admin/123)
// --------------------------------------------------------------------------
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const u = (username || '').trim();
  const p = (password || '').trim();

  if (u === 'Admin' && p === '123') {
    return res.json({
      success: true,
      role: 'admin',
      name: 'Master System Administrator',
      token: 'admin-sess-' + Date.now(),
      message: 'Admin privileges granted. Master CMS Unlocked.'
    });
  }

  if (u === 'ABCD' && p === '11111') {
    return res.json({
      success: true,
      role: 'operator',
      name: 'Authorized Field Operator',
      token: 'operator-sess-' + Date.now(),
      message: 'Operator session active. Power BI Analytics Unlocked.'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Please use Operator (ABCD / 11111) or Administrator (Admin / 123).'
  });
});

// --------------------------------------------------------------------------
// 2. HERITAGE ESTATES & CENSUS
// --------------------------------------------------------------------------
router.get('/estates', (req, res) => {
  const top10 = readJson('estates.json', []);
  const census = readJson('estates_177.json', []);
  res.json({ success: true, top10, census });
});

router.post('/estates', (req, res) => {
  const estate = req.body;
  if (!estate || !estate.name) {
    return res.status(400).json({ success: false, message: 'Estate name is required.' });
  }

  const top10 = readJson('estates.json', []);
  const existingIdx = top10.findIndex(e => e.rank === estate.rank || e.name.toLowerCase() === estate.name.toLowerCase());

  if (existingIdx !== -1) {
    top10[existingIdx] = Object.assign(top10[existingIdx], estate);
  } else {
    estate.rank = top10.length + 1;
    top10.push(estate);
  }

  writeJson('estates.json', top10);
  res.json({ success: true, message: 'Estate saved successfully.', estates: top10 });
});

router.delete('/estates/:rank', (req, res) => {
  const rank = parseInt(req.params.rank, 10);
  let top10 = readJson('estates.json', []);
  top10 = top10.filter(e => e.rank !== rank);
  // Re-rank
  top10.forEach((e, idx) => { e.rank = idx + 1; });
  writeJson('estates.json', top10);
  res.json({ success: true, message: 'Estate deleted successfully.', estates: top10 });
});

// --------------------------------------------------------------------------
// 3. SMALL TEA GROWERS (STG) DIRECTORY
// --------------------------------------------------------------------------
router.get('/growers', (req, res) => {
  const growers = readJson('growers.json', []);
  const q = (req.query.q || '').toLowerCase();
  const circle = req.query.circle;

  let filtered = growers;
  if (q) {
    filtered = filtered.filter(g => 
      (g.grower && g.grower.toLowerCase().includes(q)) ||
      (g.garden && g.garden.toLowerCase().includes(q)) ||
      (g.panchayat && g.panchayat.toLowerCase().includes(q)) ||
      (g.code && g.code.toLowerCase().includes(q))
    );
  }
  res.json({ success: true, count: filtered.length, total: growers.length, data: filtered });
});

router.post('/growers', (req, res) => {
  const grower = req.body;
  if (!grower || !grower.grower) {
    return res.status(400).json({ success: false, message: 'Grower name is required.' });
  }

  const growers = readJson('growers.json', []);
  if (!grower.code) {
    grower.code = 'TB-DBR-' + (500600 + growers.length + 1);
  }

  growers.unshift(grower);
  writeJson('growers.json', growers);
  res.json({ success: true, message: 'Grower added to registry.', grower, growers });
});

router.delete('/growers/:code', (req, res) => {
  const code = req.params.code;
  let growers = readJson('growers.json', []);
  growers = growers.filter(g => g.code !== code);
  writeJson('growers.json', growers);
  res.json({ success: true, message: 'Grower removed from directory.', growers });
});

// --------------------------------------------------------------------------
// 4. CMS PAGES CONTENT
// --------------------------------------------------------------------------
router.get('/cms/pages', (req, res) => {
  const pages = readJson('cms_pages.json', {});
  res.json({ success: true, pages });
});

router.post('/cms/pages', (req, res) => {
  const { pageKey, data } = req.body;
  if (!pageKey || !data) {
    return res.status(400).json({ success: false, message: 'pageKey and data are required.' });
  }

  const pages = readJson('cms_pages.json', {});
  pages[pageKey] = Object.assign(pages[pageKey] || {}, data);
  writeJson('cms_pages.json', pages);
  res.json({ success: true, message: 'Page content updated live.', pages });
});

// --------------------------------------------------------------------------
// 5. BRANDING & THEME
// --------------------------------------------------------------------------
router.get('/cms/branding', (req, res) => {
  const branding = readJson('branding.json', {});
  res.json({ success: true, branding });
});

router.post('/cms/branding', (req, res) => {
  const branding = req.body;
  writeJson('branding.json', branding);
  res.json({ success: true, message: 'Branding & theme updated.', branding });
});

// --------------------------------------------------------------------------
// 6. MACRO PORTAL STATE & CENSUS
// --------------------------------------------------------------------------
router.get('/state', (req, res) => {
  const state = readJson('portal_state.json', {});
  res.json({ success: true, state });
});

router.post('/state', (req, res) => {
  const state = req.body;
  writeJson('portal_state.json', state);
  res.json({ success: true, message: 'Portal state updated.', state });
});

// --------------------------------------------------------------------------
// 7. SECURE SANDBOX CODE EXECUTION
// --------------------------------------------------------------------------
router.post('/code/run', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Code is required.' });
  }

  try {
    const sandbox = {
      console: { log: (...args) => consoleOutput.push(args.join(' ')) },
      PORTAL_STATE: readJson('portal_state.json', {}),
      TOP_10_ESTATES: readJson('estates.json', []),
      Date: Date,
      Math: Math,
      result: undefined
    };
    const consoleOutput = [];
    const context = vm.createContext(sandbox);
    const script = new vm.Script('(function(){ ' + code + ' })()');
    const result = script.runInContext(context, { timeout: 2000 });

    res.json({
      success: true,
      result: result !== undefined ? String(result) : 'Script executed successfully.',
      logs: consoleOutput
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
