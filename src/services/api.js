import axios from 'axios';

// Base URL untuk n8n webhook
const BASE_URL = 'https://n8n.muktilabs.my.id/webhook';

// Create axios instance dengan konfigurasi default
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('[API] Error:', error.message);
    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS - Return response.data.data
// ============================================

/**
 * Mengambil daftar instansi
 * @returns {Promise} Array of instances
 */
export const getInstansi = async () => {
  try {
    const response = await api.get('/get-instansi');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching instansi:', error);
    throw error;
  }
};

/**
 * Mengambil daftar users
 * @param {number} instansiId - ID instansi
 * @param {string} role - Role user (guru/siswa)
 * @param {string} kelas - Filter by kelas (optional)
 * @returns {Promise} Array of users
 */
export const getUsers = async (instansiId, role, kelas = '') => {
  try {
    let url = `/get-users?instansi_id=${instansiId}&role=${role}`;
    if (kelas) {
      url += `&kelas=${kelas}`;
    }
    const response = await api.get(url);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Mengambil daftar kelas berdasarkan instansi
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Array of classes
 */
export const getKelas = async (instansiId) => {
  try {
    const response = await api.get('/get-kelas', { params: { instansi_id: instansiId } });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching kelas:', error);
    throw error;
  }
};

/**
 * Mengambil daftar mapel berdasarkan instansi
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Array of subjects
 */
export const getMapel = async (instansiId) => {
  try {
    const response = await api.get('/get-mapel', { params: { instansi_id: instansiId } });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching mapel:', error);
    throw error;
  }
};

/**
 * Mengambil PR berdasarkan kelas dan instansi
 * @param {string} kelas - Nama kelas
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Array of PRs
 */
export const getPR = async (kelas, instansiId) => {
  try {
    const response = await api.get('/get-pr', { 
      params: { 
        kelas,
        instansi_id: instansiId 
      } 
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching PR:', error);
    throw error;
  }
};

/**
 * Mengambil semua PR dari semua kelas
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Array of all PRs
 */
export const getAllPR = async (instansiId) => {
  try {
    const kelasResponse = await getKelas(instansiId);
    const allPR = [];
    
    for (const kelasItem of kelasResponse) {
      try {
        const response = await api.get('/get-pr', { 
          params: { 
            kelas: kelasItem.nama,
            instansi_id: instansiId
          } 
        });
        if (response.data?.data) {
          allPR.push(...response.data.data);
        }
      } catch (err) {
        console.warn(`Failed to fetch PR for kelas ${kelasItem.nama}:`, err);
      }
    }
    
    // Sort by deadline
    allPR.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    return allPR;
  } catch (error) {
    console.error('Error fetching all PR:', error);
    throw error;
  }
};

/**
 * Ambil daftar WA groups
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Array of WA groups
 */
export const getWAGroups = async (instansiId) => {
  try {
    const response = await api.get('/get-wa-groups', { params: { instansi_id: instansiId } });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching WA groups:', error);
    throw error;
  }
};

/**
 * Ambil daftar WA logs
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Array of WA logs
 */
export const getWALogs = async (instansiId) => {
  try {
    const response = await api.get('/get-wa-logs', { params: { instansi_id: instansiId } });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching WA logs:', error);
    throw error;
  }
};

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * Login guru
 */
export const loginGuru = async (instansiId, userId, kodeUnik) => {
  try {
    const response = await api.post('/login', {
      instansi_id: instansiId,
      user_id: userId,
      kode_unik: kodeUnik
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in guru:', error);
    throw error;
  }
};

/**
 * Register/masuk siswa
 */
export const registerSiswa = async (data) => {
  try {
    const response = await api.post('/register-siswa', {
      nama: data.nama,
      kelas: data.kelas,
      instansi_id: data.instansi_id,
      nisn: data.nisn || ''
    });
    return response.data;
  } catch (error) {
    console.error('Error registering siswa:', error);
    throw error;
  }
};

/**
 * Login Superadmin
 */
export const loginSuperadmin = async (username, password) => {
  try {
    const response = await api.post('/superadmin-login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error login superadmin:', error);
    throw error;
  }
};

// ============================================
// SUPERADMIN CRUD - INSTANSI
// ============================================

export const addInstansi = async (data) => {
  try {
    const response = await api.post('/add-instansi', data);
    return response.data;
  } catch (error) {
    console.error('Error adding instansi:', error);
    throw error;
  }
};

export const updateInstansi = async (data) => {
  try {
    const response = await api.post('/update-instansi', data);
    return response.data;
  } catch (error) {
    console.error('Error updating instansi:', error);
    throw error;
  }
};

export const deleteInstansi = async (id) => {
  try {
    const response = await api.post('/delete-instansi', { id });
    return response.data;
  } catch (error) {
    console.error('Error deleting instansi:', error);
    throw error;
  }
};

// ============================================
// SUPERADMIN CRUD - GURU
// ============================================

export const addGuru = async (data) => {
  try {
    const response = await api.post('/add-guru', data);
    return response.data;
  } catch (error) {
    console.error('Error adding guru:', error);
    throw error;
  }
};

export const updateGuru = async (data) => {
  try {
    const response = await api.post('/update-guru', data);
    return response.data;
  } catch (error) {
    console.error('Error updating guru:', error);
    throw error;
  }
};

export const deleteGuru = async (id) => {
  try {
    const response = await api.post('/delete-guru', { id });
    return response.data;
  } catch (error) {
    console.error('Error deleting guru:', error);
    throw error;
  }
};

// ============================================
// SUPERADMIN CRUD - KELAS
// ============================================

export const addKelas = async (nama, instansiId) => {
  try {
    const response = await api.post('/add-kelas', {
      nama,
      instansi_id: instansiId
    });
    return response.data;
  } catch (error) {
    console.error('Error adding kelas:', error);
    throw error;
  }
};

export const deleteKelas = async (id, instansiId) => {
  try {
    const response = await api.post('/delete-kelas', {
      id,
      instansi_id: instansiId
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting kelas:', error);
    throw error;
  }
};

// ============================================
// SUPERADMIN CRUD - MAPEL
// ============================================

export const addMapel = async (nama, instansiId) => {
  try {
    const response = await api.post('/add-mapel', {
      nama,
      instansi_id: instansiId
    });
    return response.data;
  } catch (error) {
    console.error('Error adding mapel:', error);
    throw error;
  }
};

export const deleteMapel = async (id, instansiId) => {
  try {
    const response = await api.post('/delete-mapel', {
      id,
      instansi_id: instansiId
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting mapel:', error);
    throw error;
  }
};

// ============================================
// SUPERADMIN CRUD - WA GROUP
// ============================================

export const updateWAGroup = async (data) => {
  try {
    const response = await api.post('/update-wa-group', data);
    return response.data;
  } catch (error) {
    console.error('Error updating WA group:', error);
    throw error;
  }
};

// ============================================
// PR ENDPOINTS
// ============================================

export const kirimWA = async (payload) => {
  try {
    const response = await api.post('/kirim-wa', payload);
    return response.data;
  } catch (error) {
    console.error('Error sending WA notification:', error);
    throw error;
  }
};

export const createPR = async (prData) => {
  try {
    const payload = {
      ...prData,
      nama_guru: prData.nama_guru || ''
    };
    
    const response = await api.post('/create-pr', payload);
    
    if (response.data?.status === 'success' && prData.kirim_wa === true && response.data?.data) {
      const pr = response.data.data;
      try {
        await kirimWA({
          kelas: prData.kelas,
          instansi_id: prData.instansi_id,
          pr_id: pr.id,
          judul: pr.judul,
          mapel: prData.mapel,
          deskripsi: prData.deskripsi || '',
          deadline: prData.deadline,
          nama_guru: prData.nama_guru || '',
          pesan: `📚 *PR BARU — ${prData.kelas}*\n\nMapel     : ${prData.mapel}\nJudul     : ${pr.judul}\nDeskripsi : ${prData.deskripsi || '-'}\nDeadline  : ${prData.deadline} ⏰\nDari Guru : ${prData.nama_guru || '-'}\n\nSegera dikerjakan ya! 💪\n— Sistem PR Sekolah`
        });
        response.data.wa_status = 'terkirim';
      } catch (waError) {
        console.error('Error sending WA notification:', waError);
        response.data.wa_status = 'failed';
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating PR:', error);
    throw error;
  }
};

export const getPRByKelas = async (kelas, instansiId) => {
  try {
    if (!kelas) {
      throw new Error('Parameter kelas wajib diisi');
    }
    const response = await api.get('/get-pr', { 
      params: { 
        kelas,
        instansi_id: instansiId 
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching PR:', error);
    throw error;
  }
};

export const updatePR = async (prData) => {
  try {
    const response = await api.post('/update-pr', prData);
    return response.data;
  } catch (error) {
    console.error('Error updating PR:', error);
    throw error;
  }
};

export const deletePR = async (id) => {
  try {
    const response = await api.post('/delete-pr', { id });
    return response.data;
  } catch (error) {
    console.error('Error deleting PR:', error);
    throw error;
  }
};

export default api;
