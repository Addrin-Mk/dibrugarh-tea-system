const API_BASE = '/api';

export async function loginApi(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function fetchEstatesApi() {
  const res = await fetch(`${API_BASE}/estates`);
  return res.json();
}

export async function saveEstateApi(estate) {
  const res = await fetch(`${API_BASE}/estates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estate)
  });
  return res.json();
}

export async function deleteEstateApi(rank) {
  const res = await fetch(`${API_BASE}/estates/${rank}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchGrowersApi(q = '') {
  const res = await fetch(`${API_BASE}/growers${q ? '?q=' + encodeURIComponent(q) : ''}`);
  return res.json();
}

export async function saveGrowerApi(grower) {
  const res = await fetch(`${API_BASE}/growers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(grower)
  });
  return res.json();
}

export async function deleteGrowerApi(code) {
  const res = await fetch(`${API_BASE}/growers/${encodeURIComponent(code)}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchCmsPagesApi() {
  const res = await fetch(`${API_BASE}/cms/pages`);
  return res.json();
}

export async function saveCmsPageApi(pageKey, data) {
  const res = await fetch(`${API_BASE}/cms/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageKey, data })
  });
  return res.json();
}

export async function fetchBrandingApi() {
  const res = await fetch(`${API_BASE}/cms/branding`);
  return res.json();
}

export async function saveBrandingApi(branding) {
  const res = await fetch(`${API_BASE}/cms/branding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(branding)
  });
  return res.json();
}

export async function fetchStateApi() {
  const res = await fetch(`${API_BASE}/state`);
  return res.json();
}

export async function saveStateApi(state) {
  const res = await fetch(`${API_BASE}/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });
  return res.json();
}

export async function runCodeApi(code) {
  const res = await fetch(`${API_BASE}/code/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  return res.json();
}

export const api = {
  login: loginApi,
  fetchEstates: fetchEstatesApi,
  saveEstate: saveEstateApi,
  deleteEstate: deleteEstateApi,
  fetchGrowers: fetchGrowersApi,
  saveGrower: saveGrowerApi,
  deleteGrower: deleteGrowerApi,
  fetchCmsPages: fetchCmsPagesApi,
  saveCmsPage: saveCmsPageApi,
  fetchBranding: fetchBrandingApi,
  saveBranding: saveBrandingApi,
  fetchState: fetchStateApi,
  saveState: saveStateApi,
  runCode: runCodeApi
};
