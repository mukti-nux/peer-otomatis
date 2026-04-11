import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import PRTable from '../components/PRTable';
import PRModal from '../components/PRModal';
import { ToastContainer, useToast } from '../components/Toast';
import { createPR, getAllPR, updatePR, deletePR, getKelas, getMapel } from '../services/api';

const DashboardGuru = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [user, setUser] = useState(null);
  const [prList, setPrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterKelas, setFilterKelas] = useState('');
  const [kelasList, setKelasList] = useState([]);
  
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
    fetchKelas(userData.instansi_id);
    fetchData(userData.instansi_id);
  }, [navigate]);
  
  const fetchKelas = async (instansiId) => {
    try {
      const response = await getKelas(instansiId);
      if (response?.status === 'success' && response?.data) {
        setKelasList(response.data);
      }
    } catch (err) {
      console.error('Error fetching kelas:', err);
    }
  };
  
  const fetchData = async (instansiId) => {
    setLoading(true);
    try {
      const response = await getAllPR(instansiId);
      if (response?.status === 'success' && response?.data) {
        setPrList(response.data);
      } else {
        setPrList([]);
      }
    } catch (error) {
      console.error('Error fetching PR:', error);
      toast.error('Gagal terhubung ke server, coba lagi');
      setPrList([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddPR = () => {
    setEditData(null);
    setIsPRModalOpen(true);
  };
  
  const handleEditPR = (pr) => {
    setEditData(pr);
    setIsPRModalOpen(true);
  };
  
  const handleDeletePR = (pr) => {
    setDeleteTarget(pr);
    setIsDeleteConfirmOpen(true);
  };
  
  const handlePRSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        guru_id: user.id,
        nama_guru: user.nama,
        instansi_id: user.instansi_id
      };
      
      if (editData) {
        await updatePR({ ...payload, id: editData.id });
        toast.success('PR berhasil diperbarui');
      } else {
        await createPR(payload);
        toast.success('PR berhasil dibuat');
      }
      
      setIsPRModalOpen(false);
      fetchData(user.instansi_id);
    } catch (error) {
      console.error('Error saving PR:', error);
      toast.error('Gagal menyimpan PR');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitLoading(true);
    try {
      await deletePR(deleteTarget.id);
      toast.success('PR berhasil dihapus');
      setIsDeleteConfirmOpen(false);
      setDeleteTarget(null);
      fetchData(user.instansi_id);
    } catch (error) {
      console.error('Error deleting PR:', error);
      toast.error('Gagal menghapus PR');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const filteredPRList = filterKelas 
    ? prList.filter(pr => pr.kelas === filterKelas) 
    : prList;
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Selamat datang, {user.nama}</h1>
          <p className="text-slate-500 mt-1">Kelola Pekerjaan Rumah untuk siswa</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map(kelas => (
                <option key={kelas.id} value={kelas.nama}>{kelas.nama}</option>
              ))}
            </select>
            {filterKelas && (
              <span className="text-sm text-slate-500">{filteredPRList.length} PR untuk {filterKelas}</span>
            )}
          </div>
          <Button variant="primary" onClick={handleAddPR}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah PR
          </Button>
        </div>
        
        <PRTable 
          prList={filteredPRList} 
          onEdit={handleEditPR}
          onDelete={handleDeletePR}
          loading={loading}
        />
      </div>
      
      <PRModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        onSubmit={handlePRSubmit}
        editData={editData}
        loading={submitLoading}
        kelasList={kelasList}
        user={user}
      />
      
      {isDeleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-fadeIn p-6">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Hapus PR?</h3>
                <p className="text-slate-500 mb-6">
                  Apakah Anda yakin ingin menghapus PR "<strong>{deleteTarget.judul}</strong>"? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Batal</Button>
                  <Button variant="danger" onClick={handleConfirmDelete} loading={submitLoading}>Hapus</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGuru;
