import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import PRTable from '../components/PRTable';
import PRModal from '../components/PRModal';
import WAPreviewModal from '../components/WAPreviewModal';
import WALogTable from '../components/WALogTable';
import { ToastContainer, useToast } from '../components/Toast';
import { createPR, getAllPR, updatePR, deletePR, resendWANotification } from '../services/api';

const KELAS_OPTIONS = ['X-TKJ', 'X-RPL', 'X-MM', 'XI-TKJ', 'XI-RPL', 'XI-MM', 'XII-TKJ', 'XII-RPL', 'XII-MM'];

const DashboardGuru = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [user, setUser] = useState(null);
  const [prList, setPrList] = useState([]);
  const [waLogs, setWaLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);
  const [isWAPreviewOpen, setIsWAPreviewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pendingPRData, setPendingPRData] = useState(null);
  
  const [filterKelas, setFilterKelas] = useState('');
  const [activeTab, setActiveTab] = useState('pr');
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'guru') {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    fetchData();
  }, [navigate]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllPR();
      console.log('API Response:', response);
      
      if (response?.status === 'success' && response?.data) {
        setPrList(response.data);
      } else {
        setPrList([]);
      }
      
      const savedLogs = localStorage.getItem('wa_logs');
      setWaLogs(savedLogs ? JSON.parse(savedLogs) : []);
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
    if (formData.kirim_wa && !editData) {
      setPendingPRData(formData);
      setIsWAPreviewOpen(true);
    } else {
      await submitPR(formData, editData?.id);
    }
  };
  
  const submitPR = async (formData, editId = null) => {
    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        guru_id: 1,
        ...(editId && { id: editId })
      };
      
      if (editId) {
        await updatePR(payload);
        toast.success('PR berhasil diperbarui');
      } else {
        await createPR(payload);
        toast.success('PR berhasil dibuat');
      }
      
      setIsPRModalOpen(false);
      setIsWAPreviewOpen(false);
      setPendingPRData(null);
      fetchData();
    } catch (error) {
      console.error('Error saving PR:', error);
      toast.error('Gagal menyimpan PR');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleWAPreviewConfirm = async () => {
    await submitPR(pendingPRData);
  };
  
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitLoading(true);
    try {
      await deletePR(deleteTarget.id);
      toast.success('PR berhasil dihapus');
      setIsDeleteConfirmOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting PR:', error);
      toast.error('Gagal menghapus PR');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleResendWA = async (prId) => {
    setSubmitLoading(true);
    try {
      await resendWANotification(prId);
      toast.success('Notifikasi WA berhasil dikirim ulang');
      fetchData();
    } catch (error) {
      console.error('Error resending WA:', error);
      toast.error('Gagal mengirim notifikasi WA');
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
        
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('pr')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'pr' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            📋 Daftar PR
          </button>
          <button
            onClick={() => setActiveTab('wa')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'wa' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            📱 Riwayat WhatsApp
          </button>
        </div>
        
        {activeTab === 'pr' ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Semua Kelas</option>
                  {KELAS_OPTIONS.map(kelas => (
                    <option key={kelas} value={kelas}>{kelas}</option>
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
          </>
        ) : (
          <WALogTable 
            logs={waLogs} 
            onResend={handleResendWA}
            loading={loading}
          />
        )}
      </div>
      
      <PRModal
        isOpen={isPRModalOpen}
        onClose={() => setIsPRModalOpen(false)}
        onSubmit={handlePRSubmit}
        editData={editData}
        loading={submitLoading}
      />
      
      <WAPreviewModal
        isOpen={isWAPreviewOpen}
        onClose={() => setIsWAPreviewOpen(false)}
        onConfirm={handleWAPreviewConfirm}
        onCancel={() => { setIsWAPreviewOpen(false); setPendingPRData(null); }}
        prData={pendingPRData}
        loading={submitLoading}
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
