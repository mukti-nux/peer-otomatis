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
// ENDPOINT AUTH
// ============================================

/**
 * Mengambil daftar instansi
 * @returns {Promise} Response dari webhook
 */
export const getInstansi = async () => {
  try {
    const response = await api.get('/get-instansi');
    return response.data;
  } catch (error) {
    console.error('Error fetching instansi:', error);
    throw error;
  }
};

/**
 * Mengambil daftar users (untuk dropdown guru di login)
 * @param {number} instansiId - ID instansi
 * @param {string} role - Role user (guru/siswa)
 * @returns {Promise} Response dari webhook
 */
export const getUsers = async (instansiId, role) => {
  try {
    const response = await api.get('/get-users', { params: { instansi_id: instansiId, role } });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Login guru
 * @param {number} instansiId - ID instansi
 * @param {number} userId - ID user
 * @param {string} kodeUnik - Kode unik
 * @returns {Promise} Response dari webhook
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
 * @param {Object} data - Data siswa
 * @returns {Promise} Response dari webhook
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

// ============================================
// ENDPOINT KELAS & MAPEL
// ============================================

/**
 * Mengambil daftar kelas berdasarkan instansi
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
export const getKelas = async (instansiId) => {
  try {
    const response = await api.get('/get-kelas', { params: { instansi_id: instansiId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching kelas:', error);
    throw error;
  }
};

/**
 * Menambah kelas baru
 * @param {string} nama - Nama kelas
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
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

/**
 * Menghapus kelas
 * @param {number} id - ID kelas
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
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

/**
 * Mengambil daftar mapel berdasarkan instansi
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
export const getMapel = async (instansiId) => {
  try {
    const response = await api.get('/get-mapel', { params: { instansi_id: instansiId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching mapel:', error);
    throw error;
  }
};

/**
 * Menambah mapel baru
 * @param {string} nama - Nama mapel
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
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

/**
 * Menghapus mapel
 * @param {number} id - ID mapel
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
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
// ENDPOINT PR
// ============================================

/**
 * Mengirim notifikasi WA untuk PR
 * @param {Object} payload - Data untuk kirim WA
 * @returns {Promise} Response dari webhook
 */
export const kirimWA = async (payload) => {
  try {
    const response = await api.post('/kirim-wa', payload);
    return response.data;
  } catch (error) {
    console.error('Error sending WA notification:', error);
    throw error;
  }
};

/**
 * Membuat PR baru
 * @param {Object} prData - Data PR
 * @returns {Promise} Response dari webhook
 */
export const createPR = async (prData) => {
  try {
    const response = await api.post('/create-pr', prData);
    
    // Jika kirim_wa true dan response sukses, langsung kirim notifikasi WA
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
          pesan: `📚 *PR BARU — ${prData.kelas}*\n\nMapel     : ${prData.mapel}\nJudul     : ${pr.judul}\nDeskripsi : ${prData.deskripsi || '-'}\nDeadline  : ${prData.deadline} ⏰\n\nSegera dikerjakan ya! 💪\n— Sistem PR Sekolah`
        });
        // Update wa_status di response
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

/**
 * Mengambil daftar PR berdasarkan kelas dan instansi
 * @param {string} kelas - Nama kelas (WAJIB)
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
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

/**
 * Mengambil semua PR (untuk guru - semua kelas)
 * @param {number} instansiId - ID instansi
 * @returns {Promise} Response dari webhook
 */
export const getAllPR = async (instansiId) => {
  try {
    // Ambil daftar kelas dari API
    const kelasResponse = await getKelas(instansiId);
    if (kelasResponse?.status !== 'success' || !kelasResponse?.data) {
      return { status: 'success', data: [] };
    }
    
    const allPR = [];
    
    for (const kelasItem of kelasResponse.data) {
      try {
        const response = await api.get('/get-pr', { 
          params: { 
            kelas: kelasItem.nama,
            instansi_id: instansiId
          } 
        });
        if (response.data?.status === 'success' && response.data?.data) {
          allPR.push(...response.data.data);
        }
      } catch (err) {
        console.warn(`Failed to fetch PR for kelas ${kelasItem.nama}:`, err);
      }
    }
    
    // Sort by deadline
    allPR.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    return { status: 'success', data: allPR };
  } catch (error) {
    console.error('Error fetching all PR:', error);
    throw error;
  }
};

/**
 * Mengupdate PR
 * @param {Object} prData - Data PR yang akan diupdate
 * @returns {Promise} Response dari webhook
 */
export const updatePR = async (prData) => {
  try {
    const response = await api.post('/update-pr', prData);
    return response.data;
  } catch (error) {
    console.error('Error updating PR:', error);
    throw error;
  }
};

/**
 * Menghapus PR
 * @param {number} id - ID PR yang akan dihapus
 * @returns {Promise} Response dari webhook
 */
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
