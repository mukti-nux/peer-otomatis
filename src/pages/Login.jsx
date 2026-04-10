import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const KELAS_OPTIONS = ['X-TKJ', 'X-RPL', 'X-MM', 'XI-TKJ', 'XI-RPL', 'XI-MM', 'XII-TKJ', 'XII-RPL', 'XII-MM'];

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    nama: '',
    kelas: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData(prev => ({ ...prev, role, kelas: '' }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.role) newErrors.role = 'Pilih role Anda';
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (formData.role === 'siswa' && !formData.kelas) {
      newErrors.kelas = 'Pilih kelas Anda';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // Simpan session ke localStorage
    const userData = {
      role: formData.role,
      nama: formData.nama.trim(),
      kelas: formData.role === 'siswa' ? formData.kelas : null
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirect ke dashboard sesuai role
    setTimeout(() => {
      setLoading(false);
      if (formData.role === 'guru') {
        navigate('/guru');
      } else {
        navigate('/siswa');
      }
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem PR Sekolah</h1>
          <p className="text-slate-500 mt-2">Silakan masuk untuk melanjutkan</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Login Sebagai
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.role === 'guru' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="role" value="guru" checked={formData.role === 'guru'} onChange={handleRoleChange} className="sr-only" />
                <svg className={`w-8 h-8 mb-2 ${formData.role === 'guru' ? 'text-primary' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`font-medium ${formData.role === 'guru' ? 'text-primary' : 'text-slate-600'}`}>Guru</span>
              </label>
              
              <label 
                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.role === 'siswa' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input type="radio" name="role" value="siswa" checked={formData.role === 'siswa'} onChange={handleRoleChange} className="sr-only" />
                <svg className={`w-8 h-8 mb-2 ${formData.role === 'siswa' ? 'text-primary' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={`font-medium ${formData.role === 'siswa' ? 'text-primary' : 'text-slate-600'}`}>Siswa</span>
              </label>
            </div>
            {errors.role && <p className="mt-2 text-sm text-red-500">{errors.role}</p>}
          </div>
          
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama Anda"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.nama ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
          </div>
          
          {/* Kelas (hanya untuk siswa) */}
          {formData.role === 'siswa' && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
              <select
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.kelas ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="">Pilih Kelas</option>
                {KELAS_OPTIONS.map(kelas => (
                  <option key={kelas} value={kelas}>{kelas}</option>
                ))}
              </select>
              {errors.kelas && <p className="mt-1 text-sm text-red-500">{errors.kelas}</p>}
            </div>
          )}
          
          {/* Submit Button */}
          <Button type="submit" variant="primary" size="lg" className="w-full mt-6" loading={loading}>
            Masuk
          </Button>
        </form>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Sistem Manajemen PR Sekolah v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
