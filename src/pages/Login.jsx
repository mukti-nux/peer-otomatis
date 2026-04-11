import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { getInstansi, getUsers, loginGuru, registerSiswa, getKelas } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [instansiList, setInstansiList] = useState([]);
  const [instansiLoading, setInstansiLoading] = useState(true);
  const [selectedInstansi, setSelectedInstansi] = useState('');
  const [guruList, setGuruList] = useState([]);
  const [guruLoading, setGuruLoading] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState('');
  const [kodeUnik, setKodeUnik] = useState('');
  const [kelasList, setKelasList] = useState([]);
  const [kelasLoading, setKelasLoading] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [nisn, setNisn] = useState('');
  
  useEffect(() => {
    fetchInstansi();
  }, []);
  
  useEffect(() => {
    if (role === 'guru' && selectedInstansi) {
      fetchGuruList(selectedInstansi);
    }
    if (role === 'siswa' && selectedInstansi) {
      fetchKelasList(selectedInstansi);
    }
  }, [selectedInstansi, role]);
  
  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      const userData = JSON.parse(session);
      navigate(userData.role === 'guru' ? '/dashboard-guru' : '/dashboard-siswa');
    }
  }, [navigate]);
  
  const fetchInstansi = async () => {
    setInstansiLoading(true);
    try {
      const data = await getInstansi();
      setInstansiList(data);
      if (data.length === 1) setSelectedInstansi(data[0].id);
    } catch (err) {
      console.error('Error fetching instansi:', err);
      setError('Gagal mengambil daftar instansi');
    } finally {
      setInstansiLoading(false);
    }
  };
  
  const fetchGuruList = async (instansi_id) => {
    setGuruLoading(true);
    try {
      const data = await getUsers(instansi_id, 'guru');
      setGuruList(data);
    } catch (err) {
      console.error('Error fetching guru list:', err);
    } finally {
      setGuruLoading(false);
    }
  };
  
  const fetchKelasList = async (instansi_id) => {
    setKelasLoading(true);
    try {
      const data = await getKelas(instansi_id);
      setKelasList(data);
    } catch (err) {
      console.error('Error fetching kelas list:', err);
    } finally {
      setKelasLoading(false);
    }
  };
  
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setSelectedGuru('');
    setKodeUnik('');
    setNamaLengkap('');
    setSelectedKelas('');
    setNisn('');
  };
  
  const handleInstansiChange = (e) => {
    setSelectedInstansi(Number(e.target.value));
    setError('');
    setGuruList([]);
    setKelasList([]);
    setSelectedGuru('');
    setSelectedKelas('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedInstansi) { setError('Pilih instansi terlebih dahulu'); return; }
    if (role === 'guru') await handleLoginGuru();
    else await handleRegisterSiswa();
  };
  
  const handleLoginGuru = async () => {
    if (!selectedGuru) { setError('Pilih nama guru'); return; }
    if (!kodeUnik) { setError('Masukkan kode unik'); return; }
    setLoading(true);
    try {
      const response = await loginGuru(selectedInstansi, selectedGuru, kodeUnik);
      if (response?.status === 'success' && response?.data) {
        const userData = {
          id: response.data.id, 
          nama: response.data.nama, 
          role: response.data.role,
          kelas: null, 
          instansi_id: response.data.instansi_id, 
          instansi: response.data.instansi
        };
        localStorage.setItem('user_session', JSON.stringify(userData));
        navigate('/dashboard-guru');
      } else {
        setError(response?.message || 'Login gagal. Kode unik salah.');
      }
    } catch (err) {
      console.error('Error login guru:', err);
      setError('Login gagal. Kode unik salah atau terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegisterSiswa = async () => {
    if (!namaLengkap.trim()) { setError('Masukkan nama lengkap'); return; }
    if (!selectedKelas) { setError('Pilih kelas'); return; }
    setLoading(true);
    try {
      const response = await registerSiswa({
        nama: namaLengkap.trim(), 
        kelas: selectedKelas, 
        instansi_id: selectedInstansi, 
        nisn: nisn.trim()
      });
      if (response?.status === 'success' && response?.data) {
        const selectedInstansiData = instansiList.find(i => i.id === selectedInstansi);
        const userData = {
          id: response.data.id, 
          nama: response.data.nama, 
          role: response.data.role,
          kelas: response.data.kelas, 
          instansi_id: response.data.instansi_id,
          instansi: selectedInstansiData?.nama || ''
        };
        localStorage.setItem('user_session', JSON.stringify(userData));
        navigate('/dashboard-siswa');
      } else {
        setError(response?.message || 'Registrasi gagal.');
      }
    } catch (err) {
      console.error('Error register siswa:', err);
      setError('Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem PR Sekolah</h1>
          <p className="text-slate-500 mt-2">Silakan masuk untuk melanjutkan</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pilih Instansi <span className="text-red-500">*</span>
            </label>
            {instansiLoading ? (
              <div className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500">Memuat...</div>
            ) : (
              <select 
                value={selectedInstansi} 
                onChange={handleInstansiChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Pilih Instansi</option>
                {instansiList.map(instansi => (
                  <option key={instansi.id} value={instansi.id}>{instansi.nama} ({instansi.kode})</option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Login Sebagai</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'guru' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="role" value="guru" checked={role === 'guru'} onChange={() => handleRoleChange('guru')} disabled={!selectedInstansi} className="sr-only" />
                <svg className={`w-8 h-8 mb-2 ${role === 'guru' ? 'text-primary' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`font-medium ${role === 'guru' ? 'text-primary' : 'text-slate-600'}`}>Guru</span>
              </label>
              <label className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'siswa' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="role" value="siswa" checked={role === 'siswa'} onChange={() => handleRoleChange('siswa')} disabled={!selectedInstansi} className="sr-only" />
                <svg className={`w-8 h-8 mb-2 ${role === 'siswa' ? 'text-primary' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={`font-medium ${role === 'siswa' ? 'text-primary' : 'text-slate-600'}`}>Siswa</span>
              </label>
            </div>
          </div>
          
          {role === 'guru' && selectedInstansi && (
            <div className="animate-fadeIn space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Guru <span className="text-red-500">*</span></label>
                {guruLoading ? (
                  <div className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500">Memuat...</div>
                ) : (
                  <select 
                    value={selectedGuru} 
                    onChange={(e) => setSelectedGuru(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">Pilih Guru</option>
                    {guruList.map(guru => (
                      <option key={guru.id} value={guru.id}>{guru.nama}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kode Unik <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={kodeUnik} 
                  onChange={(e) => setKodeUnik(e.target.value)} 
                  placeholder="Masukkan kode unik"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                />
              </div>
            </div>
          )}
          
          {role === 'siswa' && selectedInstansi && (
            <div className="animate-fadeIn space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={namaLengkap} 
                  onChange={(e) => setNamaLengkap(e.target.value)} 
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kelas <span className="text-red-500">*</span></label>
                {kelasLoading ? (
                  <div className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500">Memuat...</div>
                ) : (
                  <select 
                    value={selectedKelas} 
                    onChange={(e) => setSelectedKelas(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map(kelas => (
                      <option key={kelas.id} value={kelas.nama}>{kelas.nama}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">NISN <span className="text-slate-400">(opsional)</span></label>
                <input 
                  type="text" 
                  value={nisn} 
                  onChange={(e) => setNisn(e.target.value)} 
                  placeholder="Masukkan NISN"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          
          <Button type="submit" variant="primary" size="lg" className="w-full mt-6" loading={loading}>
            {role === 'guru' ? 'Login' : 'Masuk'}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Sistem Manajemen PR Sekolah v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
