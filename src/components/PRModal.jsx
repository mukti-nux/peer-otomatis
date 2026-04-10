import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import Toggle from './Toggle';
import { formatDateInput } from '../utils/dateHelper';
import { getMapel } from '../services/api';

const PRModal = ({ isOpen, onClose, onSubmit, editData = null, loading = false, kelasList = [], user = null }) => {
  const [formData, setFormData] = useState({
    mapel: '',
    kelas: '',
    judul: '',
    deskripsi: '',
    deadline: '',
    kirim_wa: true
  });
  
  const [mapelList, setMapelList] = useState([]);
  const [mapelLoading, setMapelLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditMode = !!editData;
  
  useEffect(() => {
    if (isOpen && user?.instansi_id) {
      fetchMapel(user.instansi_id);
    }
  }, [isOpen, user]);
  
  useEffect(() => {
    if (editData) {
      setFormData({
        mapel: editData.mapel || '',
        kelas: editData.kelas || '',
        judul: editData.judul || '',
        deskripsi: editData.deskripsi || '',
        deadline: formatDateInput(editData.deadline) || '',
        kirim_wa: editData.kirim_wa || false
      });
    } else {
      setFormData({ mapel: '', kelas: '', judul: '', deskripsi: '', deadline: '', kirim_wa: true });
    }
    setErrors({});
  }, [editData, isOpen]);
  
  const fetchMapel = async (instansiId) => {
    setMapelLoading(true);
    try {
      const response = await getMapel(instansiId);
      if (response?.status === 'success' && response?.data) {
        setMapelList(response.data);
      }
    } catch (err) {
      console.error('Error fetching mapel:', err);
    } finally {
      setMapelLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleToggle = (checked) => setFormData(prev => ({ ...prev, kirim_wa: checked }));
  
  const validate = () => {
    const newErrors = {};
    if (!formData.mapel.trim()) newErrors.mapel = 'Mapel wajib diisi';
    if (!formData.kelas) newErrors.kelas = 'Kelas wajib dipilih';
    if (!formData.judul.trim()) newErrors.judul = 'Judul wajib diisi';
    if (!formData.deadline) newErrors.deadline = 'Deadline wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit PR' : 'Tambah PR Baru'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            {mapelLoading ? (
              <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500">Memuat...</div>
            ) : mapelList.length > 0 ? (
              <select
                name="mapel" value={formData.mapel} onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.mapel ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="">Pilih Mapel</option>
                {mapelList.map(m => <option key={m.id} value={m.nama}>{m.nama}</option>)}
              </select>
            ) : (
              <input
                type="text" name="mapel" value={formData.mapel} onChange={handleChange}
                placeholder="Contoh: Matematika"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.mapel ? 'border-red-500' : 'border-slate-300'}`}
              />
            )}
            {errors.mapel && <p className="mt-1 text-sm text-red-500">{errors.mapel}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Kelas <span className="text-red-500">*</span>
            </label>
            <select
              name="kelas" value={formData.kelas} onChange={handleChange} disabled={isEditMode}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.kelas ? 'border-red-500' : 'border-slate-300'} ${isEditMode ? 'bg-slate-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Pilih Kelas</option>
              {kelasList.map(kelas => <option key={kelas.id} value={kelas.nama}>{kelas.nama}</option>)}
            </select>
            {errors.kelas && <p className="mt-1 text-sm text-red-500">{errors.kelas}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Judul PR <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="judul" value={formData.judul} onChange={handleChange}
            placeholder="Contoh: Latihan Integral"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.judul ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
          <textarea
            name="deskripsi" value={formData.deskripsi} onChange={handleChange}
            rows={3} placeholder="Contoh: Kerjakan soal hal 45-50"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="date" name="deadline" value={formData.deadline} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.deadline ? 'border-red-500' : 'border-slate-300'}`}
          />
          {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
        </div>
        
        {!isEditMode && (
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Kirim Notifikasi WhatsApp</p>
                <p className="text-sm text-slate-500">Kirim notifikasi ke grup kelas</p>
              </div>
              <Toggle checked={formData.kirim_wa} onChange={handleToggle} />
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default PRModal;
