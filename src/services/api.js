import axios from 'axios';

// Base URL untuk n8n webhook
// Untuk development lokal: http://localhost:5678/webhook
// Untuk production: https://n8n.muktilabs.my.id/webhook
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

/**
 * Membuat PR baru
 * @param {Object} prData - Data PR
 * @returns {Promise} Response dari webhook
 */
export const createPR = async (prData) => {
  try {
    const response = await api.post('/create-pr', prData);
    return response.data;
  } catch (error) {
    console.error('Error creating PR:', error);
    throw error;
  }
};

/**
 * Mengambil daftar PR berdasarkan kelas
 * @param {string} kelas - Nama kelas (WAJIB)
 * @returns {Promise} Response dari webhook
 */
export const getPRByKelas = async (kelas) => {
  try {
    if (!kelas) {
      throw new Error('Parameter kelas wajib diisi');
    }
    const response = await api.get('/get-pr', { params: { kelas } });
    return response.data;
  } catch (error) {
    console.error('Error fetching PR:', error);
    throw error;
  }
};

/**
 * Mengambil semua PR (untuk guru - semua kelas)
 * @returns {Promise} Response dari webhook
 */
export const getAllPR = async () => {
  try {
    // Guru mengambil PR dari semua kelas yang diampu
    // Ambil dari semua kelas yang tersedia
    const KELAS_LIST = ['X-TKJ', 'X-RPL', 'X-MM', 'XI-TKJ', 'XI-RPL', 'XI-MM', 'XII-TKJ', 'XII-RPL', 'XII-MM'];
    const allPR = [];
    
    for (const kelas of KELAS_LIST) {
      try {
        const response = await api.get('/get-pr', { params: { kelas } });
        if (response.data?.status === 'success' && response.data?.data) {
          allPR.push(...response.data.data);
        }
      } catch (err) {
        console.warn(`Failed to fetch PR for kelas ${kelas}:`, err);
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

/**
 * Mengirim ulang notifikasi WA
 * @param {number} prId - ID PR
 * @returns {Promise} Response dari webhook
 */
export const resendWANotification = async (prId) => {
  try {
    const response = await api.post('/resend-wa', { pr_id: prId });
    return response.data;
  } catch (error) {
    console.error('Error resending WA notification:', error);
    throw error;
  }
};

export default api;
