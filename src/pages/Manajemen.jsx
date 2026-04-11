import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { ToastContainer, useToast } from '../components/Toast';
import { getKelas, addKelas, deleteKelas, getMapel, addMapel, deleteMapel } from '../services/api';

const Manajemen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('kelas');
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [newKelas, setNewKelas] = useState('');
  const [newMapel, setNewMapel] = useState('');
  
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(session);
    if (userData.role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(userData);
    fetchData(userData.instansi_id);
  }, [navigate]);
  
  const fetchData = async (instansiId) => {
    setLoading(true);
    try {
      const [kelas, mapel] = await Promise.all([
        getKelas(instansiId),
        getMapel(instansiId)
      ]);
      setKelasList(kelas);
      setMapelList(mapel);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddKelas = async (e) => {
    e.preventDefault();
    if (!newKelas.trim()) return;
    
    setSubmitLoading(true);
    try {
      await addKelas(newKelas.trim(), user.instansi_id);
      toast.success('Kelas berhasil ditambahkan');
      setNewKelas('');
      fetchData(user.instansi_id);
    } catch (error) {
      console.error('Error adding kelas:', error);
      toast.error('Gagal menambahkan kelas');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleDeleteKelas = async (id) => {
    if (!window.confirm('Yakin ingin menghapus kelas ini?')) return;
    
    setSubmitLoading(true);
    try {
      await deleteKelas(id, user.instansi_id);
      toast.success('Kelas berhasil dihapus');
      fetchData(user.instansi_id);
    } catch (error) {
      console.error('Error deleting kelas:', error);
      toast.error('Gagal menghapus kelas');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleAddMapel = async (e) => {
    e.preventDefault();
    if (!newMapel.trim()) return;
    
    setSubmitLoading(true);
    try {
      await addMapel(newMapel.trim(), user.instansi_id);
      toast.success('Mapel berhasil ditambahkan');
      setNewMapel('');
      fetchData(user.instansi_id);
    } catch (error) {
      console.error('Error adding mapel:', error);
      toast.error('Gagal menambahkan mapel');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleDeleteMapel = async (id) => {
    if (!window.confirm('Yakin ingin menghapus mapel ini?')) return;
    
    setSubmitLoading(true);
    try {
      await deleteMapel(id, user.instansi_id);
      toast.success('Mapel berhasil dihapus');
      fetchData(user.instansi_id);
    } catch (error) {
      console.error('Error deleting mapel:', error);
      toast.error('Gagal menghapus mapel');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Manajemen</h1>
          <p className="text-slate-500 mt-1">Kelola kelas dan mata pelajaran</p>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('kelas')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'kelas' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📚 Kelas
          </button>
          <button
            onClick={() => setActiveTab('mapel')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'mapel' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📖 Mata Pelajaran
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-slate-500">Memuat...</p>
          </div>
        ) : activeTab === 'kelas' ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Add Form */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <form onSubmit={handleAddKelas} className="flex gap-3">
                <input
                  type="text"
                  value={newKelas}
                  onChange={(e) => setNewKelas(e.target.value)}
                  placeholder="Nama kelas baru (contoh: XII-RPL)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button type="submit" variant="primary" loading={submitLoading}>
                  Tambah
                </Button>
              </form>
            </div>
            
            {/* Table */}
            {kelasList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p>Belum ada kelas. Tambahkan kelas baru di atas.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Kelas</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kelasList.map((kelas, index) => (
                    <tr key={kelas.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{kelas.nama}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteKelas(kelas.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Add Form */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <form onSubmit={handleAddMapel} className="flex gap-3">
                <input
                  type="text"
                  value={newMapel}
                  onChange={(e) => setNewMapel(e.target.value)}
                  placeholder="Nama mapel baru (contoh: Matematika)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button type="submit" variant="primary" loading={submitLoading}>
                  Tambah
                </Button>
              </form>
            </div>
            
            {/* Table */}
            {mapelList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p>Belum ada mapel. Tambahkan mapel baru di atas.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Mapel</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mapelList.map((mapel, index) => (
                    <tr key={mapel.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{mapel.nama}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteMapel(mapel.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Manajemen;
