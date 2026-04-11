import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Badge from '../components/Badge';
import { ToastContainer, useToast } from '../components/Toast';
import { getPRAllKelas } from '../services/api';

const NotifikasiWA = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [user, setUser] = useState(null);
  const [prList, setPrList] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      const data = await getPRAllKelas(instansiId);
      // Filter PR dengan wa_status
      const prWithWAStatus = data.filter(pr => pr.wa_status);
      // Sort by created_at descending (terbaru dulu)
      prWithWAStatus.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPrList(prWithWAStatus);
    } catch (error) {
      console.error('Error fetching PR:', error);
      toast.error('Gagal memuat data');
      setPrList([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (waStatus) => {
    switch (waStatus) {
      case 'terkirim':
        return <Badge variant="success">✓ Terkirim</Badge>;
      case 'pending':
        return <Badge variant="warning">⏳ Pending</Badge>;
      case 'failed':
        return <Badge variant="danger">✗ Gagal</Badge>;
      default:
        return <Badge variant="neutral">- Belum Kirim</Badge>;
    }
  };
  
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Notifikasi WhatsApp</h1>
          <p className="text-slate-500 mt-1">Log dan status pengiriman notifikasi WA untuk setiap PR</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
            <p className="text-sm text-slate-500">Terkirim</p>
            <p className="text-2xl font-bold text-green-600">
              {prList.filter(pr => pr.wa_status === 'terkirim').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {prList.filter(pr => pr.wa_status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
            <p className="text-sm text-slate-500">Gagal</p>
            <p className="text-2xl font-bold text-red-600">
              {prList.filter(pr => pr.wa_status === 'failed').length}
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-slate-500">Memuat log notifikasi...</p>
          </div>
        ) : prList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Log Notifikasi</h3>
            <p className="text-slate-500">Log notifikasi WhatsApp akan muncul di sini setelah PR dibuat dengan opsi kirim WA aktif.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">PR / Mapel</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status WA</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal Kirim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prList.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{pr.judul}</p>
                        <p className="text-sm text-slate-500">{pr.mapel}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{pr.kelas}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{pr.deadline}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{pr.nama_guru || '-'}</td>
                    <td className="px-6 py-4">{getStatusBadge(pr.wa_status)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {pr.wa_sent_at ? formatDateTime(pr.wa_sent_at) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifikasiWA;
