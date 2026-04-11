import axios from 'axios';

const BASE_URL = 'https://n8n.muktilabs.my.id/webhook';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor untuk log error
api.interceptors.response.use(
  response => response,
  error => {
    console.error('[API] Error:', error.message);
    return Promise.reject(error);
  }
);

// ── AUTH ──────────────────────────────────────────
export const loginGuru = async (instansi_id, user_id, kode_unik) => {
  const res = await api.post('/login', { instansi_id, user_id, kode_unik });
  return res.data;
};

export const registerSiswa = async (payload) => {
  const res = await api.post('/register-siswa', payload);
  return res.data;
};

export const loginSuperadmin = async (username, password) => {
  const res = await api.post('/superadmin-login', { username, password });
  return res.data;
};

// ── INSTANSI ──────────────────────────────────────
export const getInstansi = async () => {
  const res = await api.get('/get-instansi');
  return res.data.data;
};

export const addInstansi = async (payload) => {
  const res = await api.post('/add-instansi', payload);
  return res.data;
};

export const updateInstansi = async (payload) => {
  const res = await api.post('/update-instansi', payload);
  return res.data;
};

export const deleteInstansi = async (id) => {
  const res = await api.post('/delete-instansi', { id });
  return res.data;
};

// ── USERS ─────────────────────────────────────────
export const getUsers = async (instansi_id, role, kelas = '') => {
  let url = `/get-users?instansi_id=${instansi_id}&role=${role}`;
  if (kelas) url += `&kelas=${kelas}`;
  const res = await api.get(url);
  return res.data.data;
};

export const addGuru = async (payload) => {
  const res = await api.post('/add-guru', payload);
  return res.data;
};

export const updateGuru = async (payload) => {
  const res = await api.post('/update-guru', payload);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.post('/delete-guru', { id });
  return res.data;
};

// ── KELAS ─────────────────────────────────────────
export const getKelas = async (instansi_id) => {
  const res = await api.get(`/get-kelas?instansi_id=${instansi_id}`);
  return res.data.data;
};

export const addKelas = async (nama, instansi_id) => {
  const res = await api.post('/add-kelas', { nama, instansi_id });
  return res.data;
};

export const deleteKelas = async (id, instansi_id) => {
  const res = await api.post('/delete-kelas', { id, instansi_id });
  return res.data;
};

// ── MAPEL ─────────────────────────────────────────
export const getMapel = async (instansi_id) => {
  const res = await api.get(`/get-mapel?instansi_id=${instansi_id}`);
  return res.data.data;
};

export const addMapel = async (nama, instansi_id) => {
  const res = await api.post('/add-mapel', { nama, instansi_id });
  return res.data;
};

export const deleteMapel = async (id, instansi_id) => {
  const res = await api.post('/delete-mapel', { id, instansi_id });
  return res.data;
};

// ── PR ────────────────────────────────────────────
export const getPR = async (kelas, instansi_id) => {
  const res = await api.get(`/get-pr?kelas=${kelas}&instansi_id=${instansi_id}`);
  return res.data.data;
};

export const getPRAllKelas = async (instansi_id) => {
  const kelasList = await getKelas(instansi_id);
  const results = await Promise.all(
    kelasList.map(k => getPR(k.nama, instansi_id).catch(() => []))
  );
  return results.flat();
};

export const createPR = async (payload) => {
  const res = await api.post('/create-pr', payload);
  return res.data;
};

export const updatePR = async (payload) => {
  const res = await api.post('/update-pr', payload);
  return res.data;
};

export const deletePR = async (id) => {
  const res = await api.post('/delete-pr', { id });
  return res.data;
};

// ── WHATSAPP ──────────────────────────────────────
export const kirimWA = async (payload) => {
  const res = await api.post('/kirim-wa', payload);
  return res.data;
};

export const getWAGroups = async (instansi_id) => {
  const res = await api.get(`/get-wa-groups?instansi_id=${instansi_id}`);
  return res.data.data;
};

export const updateWAGroup = async (payload) => {
  const res = await api.post('/update-wa-group', payload);
  return res.data;
};

export const getWALogs = async (instansi_id) => {
  const res = await api.get(`/get-wa-logs?instansi_id=${instansi_id}`);
  return res.data.data;
};

export default api;
