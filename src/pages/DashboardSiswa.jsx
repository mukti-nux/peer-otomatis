import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PRCard from '../components/PRCard';
import { ToastContainer, useToast } from '../components/Toast';
import { getPRByKelas } from '../services/api';

const DashboardSiswa = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [user, setUser] = useState(null);
  const [prList, setPrList] = useState([]);
  const [completedPRs, setCompletedPRs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(session);
    if (parsedUser.role !== 'siswa') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
    
    // Load completed PRs from localStorage
    const savedCompleted = localStorage.getItem(`completed_prs_${parsedUser.kelas}`);
    if (savedCompleted) {
      setCompletedPRs(JSON.parse(savedCompleted));
    }
    
    fetchData(parsedUser.kelas, parsedUser.instansi_id);
  }, [navigate]);
  
  const fetchData = async (kelas, instansiId) => {
    setLoading(true);
    try {
      const response = await getPRByKelas(kelas, instansiId);
      if (response?.status === 'success' && response?.data) {
        const sorted = response.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setPrList(sorted);
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
  
  const handleToggleStatus = (prId, isCompleted) => {
    let newCompleted;
    if (isCompleted) {
      newCompleted = [...completedPRs, prId];
    } else {
      newCompleted = completedPRs.filter(id => id !== prId);
    }
    setCompletedPRs(newCompleted);
    localStorage.setItem(`completed_prs_${user?.kelas}`, JSON.stringify(newCompleted));
    
    if (isCompleted) {
      toast.success('PR ditandai selesai');
    }
  };
  
  if (!user) return null;
  
  const totalPR = prList.length;
  const completedCount = prList.filter(pr => completedPRs.includes(pr.id)).length;
  const pendingCount = totalPR - completedCount;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Halo {user.nama} — Kelas {user.kelas}
          </h1>
          <p className="text-slate-500 mt-1">Berikut daftar PR yang harus kamu kerjakan</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-primary">
            <p className="text-sm text-slate-500">Total PR</p>
            <p className="text-2xl font-bold text-primary">{totalPR}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
            <p className="text-sm text-slate-500">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
            <p className="text-sm text-slate-500">Selesai</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-slate-500">Memuat daftar PR...</p>
          </div>
        ) : prList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Tidak Ada PR</h3>
            <p className="text-slate-500">Tidak ada PR untuk kelas {user.kelas} saat ini. Santai!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prList.map(pr => (
              <PRCard
                key={pr.id}
                pr={pr}
                onToggleStatus={handleToggleStatus}
                isCompleted={completedPRs.includes(pr.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSiswa;
