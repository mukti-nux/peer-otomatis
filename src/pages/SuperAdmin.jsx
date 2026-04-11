import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { ToastContainer, useToast } from '../components/Toast';
import {
  getInstansi, addInstansi, updateInstansi, deleteInstansi,
  getUsers, addGuru, updateGuru, deleteGuru,
  getKelas, addKelas, deleteKelas,
  getMapel, addMapel, deleteMapel,
  getWAGroups, updateWAGroup,
  getWALogs,
  getPRByKelas, deletePR
} from '../services/api';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('instansi');
  const { toasts, removeToast, success, error } = useToast();

  // ============================================
  // INSTANSI TAB
  // ============================================
  const [instansiList, setInstansiList] = useState([]);
  const [instansiLoading, setInstansiLoading] = useState(false);
  const [showAddInstansiModal, setShowAddInstansiModal] = useState(false);
  const [showEditInstansiModal, setShowEditInstansiModal] = useState(false);
  const [showDeleteInstansiModal, setShowDeleteInstansiModal] = useState(false);
  const [selectedInstansi, setSelectedInstansi] = useState(null);
  const [instansiForm, setInstansiForm] = useState({ nama: '', kode: '', alamat: '' });

  const loadInstansi = async () => {
    setInstansiLoading(true);
    try {
      const response = await getInstansi();
      if (response?.status === 'success') {
        setInstansiList(response.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading instansi:', err);
      error('Gagal memuat data instansi');
    } finally {
      setInstansiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'instansi') {
      loadInstansi();
    }
  }, [activeTab]);

  const handleAddInstansi = async () => {
    if (!instansiForm.nama || !instansiForm.kode) {
      error('Nama dan kode wajib diisi');
      return;
    }
    try {
      const response = await addInstansi(instansiForm);
      if (response?.status === 'success') {
        success('Instansi berhasil ditambahkan');
        setShowAddInstansiModal(false);
        setInstansiForm({ nama: '', kode: '', alamat: '' });
        loadInstansi();
      } else {
        error('Gagal menambahkan instansi');
      }
    } catch (err) {
      error('Gagal menambahkan instansi');
    }
  };

  const handleEditInstansi = async () => {
    if (!instansiForm.nama || !instansiForm.kode) {
      error('Nama dan kode wajib diisi');
      return;
    }
    try {
      const response = await updateInstansi({ id: selectedInstansi.id, ...instansiForm });
      if (response?.status === 'success') {
        success('Instansi berhasil diupdate');
        setShowEditInstansiModal(false);
        loadInstansi();
      } else {
        error('Gagal mengupdate instansi');
      }
    } catch (err) {
      error('Gagal mengupdate instansi');
    }
  };

  const handleDeleteInstansi = async () => {
    try {
      const response = await deleteInstansi(selectedInstansi.id);
      if (response?.status === 'success') {
        success('Instansi berhasil dihapus');
        setShowDeleteInstansiModal(false);
        loadInstansi();
      } else {
        error('Gagal menghapus instansi');
      }
    } catch (err) {
      error('Gagal menghapus instansi');
    }
  };

  // ============================================
  // GURU TAB
  // ============================================
  const [guruList, setGuruList] = useState([]);
  const [guruLoading, setGuruLoading] = useState(false);
  const [guruSearch, setGuruSearch] = useState('');
  const [selectedGuruInstansi, setSelectedGuruInstansi] = useState(null);
  const [showAddGuruModal, setShowAddGuruModal] = useState(false);
  const [showEditGuruModal, setShowEditGuruModal] = useState(false);
  const [showDeleteGuruModal, setShowDeleteGuruModal] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [guruForm, setGuruForm] = useState({ nama: '', kode_unik: '', instansi_id: '' });

  const loadGuru = async () => {
    if (!selectedGuruInstansi) {
      setGuruList([]);
      return;
    }
    setGuruLoading(true);
    try {
      const response = await getUsers(selectedGuruInstansi, 'guru');
      if (response?.status === 'success') {
        setGuruList(response.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading guru:', err);
    } finally {
      setGuruLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'guru') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'guru' && selectedGuruInstansi) {
      loadGuru();
    }
  }, [activeTab, selectedGuruInstansi]);

  const filteredGuru = useMemo(() => {
    if (!guruSearch) return guruList;
    return guruList.filter(g => 
      g.nama?.toLowerCase().includes(guruSearch.toLowerCase()) ||
      g.kode_unik?.toLowerCase().includes(guruSearch.toLowerCase())
    );
  }, [guruList, guruSearch]);

  const handleAddGuru = async () => {
    if (!guruForm.nama || !guruForm.kode_unik || !guruForm.instansi_id) {
      error('Semua field wajib diisi');
      return;
    }
    try {
      const response = await addGuru(guruForm);
      if (response?.status === 'success') {
        success('Guru berhasil ditambahkan');
        setShowAddGuruModal(false);
        setGuruForm({ nama: '', kode_unik: '', instansi_id: selectedGuruInstansi });
        loadGuru();
      } else {
        error('Gagal menambahkan guru');
      }
    } catch (err) {
      error('Gagal menambahkan guru');
    }
  };

  const handleEditGuru = async () => {
    if (!guruForm.nama || !guruForm.kode_unik) {
      error('Nama dan kode unik wajib diisi');
      return;
    }
    try {
      const response = await updateGuru({ id: selectedGuru.id, nama: guruForm.nama, kode_unik: guruForm.kode_unik });
      if (response?.status === 'success') {
        success('Guru berhasil diupdate');
        setShowEditGuruModal(false);
        loadGuru();
      } else {
        error('Gagal mengupdate guru');
      }
    } catch (err) {
      error('Gagal mengupdate guru');
    }
  };

  const handleDeleteGuru = async () => {
    try {
      const response = await deleteGuru(selectedGuru.id);
      if (response?.status === 'success') {
        success('Guru berhasil dihapus');
        setShowDeleteGuruModal(false);
        loadGuru();
      } else {
        error('Gagal menghapus guru');
      }
    } catch (err) {
      error('Gagal menghapus guru');
    }
  };

  // ============================================
  // SISWA TAB
  // ============================================
  const [siswaList, setSiswaList] = useState([]);
  const [siswaLoading, setSiswaLoading] = useState(false);
  const [siswaSearch, setSiswaSearch] = useState('');
  const [selectedSiswaInstansi, setSelectedSiswaInstansi] = useState(null);
  const [selectedSiswaKelas, setSelectedSiswaKelas] = useState(null);
  const [siswaKelasList, setSiswaKelasList] = useState([]);
  const [showDeleteSiswaModal, setShowDeleteSiswaModal] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);

  const loadSiswa = async () => {
    if (!selectedSiswaInstansi || !selectedSiswaKelas) {
      setSiswaList([]);
      return;
    }
    setSiswaLoading(true);
    try {
      const response = await getUsers(selectedSiswaInstansi, 'siswa');
      if (response?.status === 'success') {
        // Filter by kelas on frontend (API might not support kelas filter)
        const filtered = (response.data?.data || []).filter(s => s.kelas === selectedSiswaKelas);
        setSiswaList(filtered);
      }
    } catch (err) {
      console.error('Error loading siswa:', err);
    } finally {
      setSiswaLoading(false);
    }
  };

  const loadSiswaKelas = async () => {
    if (!selectedSiswaInstansi) return;
    try {
      const response = await getKelas(selectedSiswaInstansi);
      if (response?.status === 'success') {
        setSiswaKelasList(response.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading kelas:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'siswa') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'siswa' && selectedSiswaInstansi) {
      loadSiswaKelas();
      setSelectedSiswaKelas(null);
      setSiswaList([]);
    }
  }, [activeTab, selectedSiswaInstansi]);

  useEffect(() => {
    if (activeTab === 'siswa' && selectedSiswaKelas) {
      loadSiswa();
    }
  }, [activeTab, selectedSiswaKelas]);

  const filteredSiswa = useMemo(() => {
    if (!siswaSearch) return siswaList;
    return siswaList.filter(s => 
      s.nama?.toLowerCase().includes(siswaSearch.toLowerCase()) ||
      s.nisn?.toLowerCase().includes(siswaSearch.toLowerCase())
    );
  }, [siswaList, siswaSearch]);

  // ============================================
  // KELAS TAB
  // ============================================
  const [kelasList, setKelasList] = useState([]);
  const [kelasLoading, setKelasLoading] = useState(false);
  const [selectedKelasInstansi, setSelectedKelasInstansi] = useState(null);
  const [showAddKelasModal, setShowAddKelasModal] = useState(false);
  const [showDeleteKelasModal, setShowDeleteKelasModal] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [kelasForm, setKelasForm] = useState({ nama: '' });

  const loadKelas = async () => {
    if (!selectedKelasInstansi) {
      setKelasList([]);
      return;
    }
    setKelasLoading(true);
    try {
      const response = await getKelas(selectedKelasInstansi);
      if (response?.status === 'success') {
        setKelasList(response.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading kelas:', err);
    } finally {
      setKelasLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'kelas') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'kelas' && selectedKelasInstansi) {
      loadKelas();
    }
  }, [activeTab, selectedKelasInstansi]);

  const handleAddKelas = async () => {
    if (!kelasForm.nama || !selectedKelasInstansi) {
      error('Nama kelas wajib diisi');
      return;
    }
    try {
      const response = await addKelas(kelasForm.nama, selectedKelasInstansi);
      if (response?.status === 'success') {
        success('Kelas berhasil ditambahkan');
        setShowAddKelasModal(false);
        setKelasForm({ nama: '' });
        loadKelas();
      } else {
        error('Gagal menambahkan kelas');
      }
    } catch (err) {
      error('Gagal menambahkan kelas');
    }
  };

  const handleDeleteKelas = async () => {
    try {
      const response = await deleteKelas(selectedKelas.id, selectedKelasInstansi);
      if (response?.status === 'success') {
        success('Kelas berhasil dihapus');
        setShowDeleteKelasModal(false);
        loadKelas();
      } else {
        error('Gagal menghapus kelas');
      }
    } catch (err) {
      error('Gagal menghapus kelas');
    }
  };

  // ============================================
  // MAPEL TAB
  // ============================================
  const [mapelList, setMapelList] = useState([]);
  const [mapelLoading, setMapelLoading] = useState(false);
  const [mapelSearch, setMapelSearch] = useState('');
  const [selectedMapelInstansi, setSelectedMapelInstansi] = useState(null);
  const [showAddMapelModal, setShowAddMapelModal] = useState(false);
  const [showDeleteMapelModal, setShowDeleteMapelModal] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [mapelForm, setMapelForm] = useState({ nama: '' });

  const loadMapel = async () => {
    if (!selectedMapelInstansi) {
      setMapelList([]);
      return;
    }
    setMapelLoading(true);
    try {
      const response = await getMapel(selectedMapelInstansi);
      if (response?.status === 'success') {
        setMapelList(response.data?.data || []);
      }
    } catch (err) {
      console.error('Error loading mapel:', err);
    } finally {
      setMapelLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mapel') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'mapel' && selectedMapelInstansi) {
      loadMapel();
    }
  }, [activeTab, selectedMapelInstansi]);

  const filteredMapel = useMemo(() => {
    if (!mapelSearch) return mapelList;
    return mapelList.filter(m => m.nama?.toLowerCase().includes(mapelSearch.toLowerCase()));
  }, [mapelList, mapelSearch]);

  const handleAddMapel = async () => {
    if (!mapelForm.nama || !selectedMapelInstansi) {
      error('Nama mapel wajib diisi');
      return;
    }
    try {
      const response = await addMapel(mapelForm.nama, selectedMapelInstansi);
      if (response?.status === 'success') {
        success('Mapel berhasil ditambahkan');
        setShowAddMapelModal(false);
        setMapelForm({ nama: '' });
        loadMapel();
      } else {
        error('Gagal menambahkan mapel');
      }
    } catch (err) {
      error('Gagal menambahkan mapel');
    }
  };

  const handleDeleteMapel = async () => {
    try {
      const response = await deleteMapel(selectedMapel.id, selectedMapelInstansi);
      if (response?.status === 'success') {
        success('Mapel berhasil dihapus');
        setShowDeleteMapelModal(false);
        loadMapel();
      } else {
        error('Gagal menghapus mapel');
      }
    } catch (err) {
      error('Gagal menghapus mapel');
    }
  };

  // ============================================
  // GRUP WA TAB
  // ============================================
  const [waGroupsList, setWAGroupsList] = useState([]);
  const [waGroupsLoading, setWAGroupsLoading] = useState(false);
  const [selectedWAInstansi, setSelectedWAInstansi] = useState(null);
  const [waKelasList, setWAKelasList] = useState([]);
  const [showAddWAGroupModal, setShowAddWAGroupModal] = useState(false);
  const [waGroupForm, setWAGroupForm] = useState({ kelas: '', group_id: '', keterangan: '' });

  const loadWAGroups = async () => {
    if (!selectedWAInstansi) {
      setWAGroupsList([]);
      return;
    }
    setWAGroupsLoading(true);
    try {
      const [groupsRes, kelasRes] = await Promise.all([
        getWAGroups(selectedWAInstansi),
        getKelas(selectedWAInstansi)
      ]);
      if (groupsRes?.status === 'success') {
        setWAGroupsList(groupsRes.data || []);
      }
      if (kelasRes?.status === 'success') {
        setWAKelasList(kelasRes.data || []);
      }
    } catch (err) {
      console.error('Error loading WA groups:', err);
    } finally {
      setWAGroupsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'grup-wa') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'grup-wa' && selectedWAInstansi) {
      loadWAGroups();
    }
  }, [activeTab, selectedWAInstansi]);

  const handleUpdateWAGroup = async () => {
    if (!waGroupForm.kelas || !waGroupForm.group_id || !selectedWAInstansi) {
      error('Kelas dan Group ID wajib diisi');
      return;
    }
    try {
      const response = await updateWAGroup({
        kelas: waGroupForm.kelas,
        group_id: waGroupForm.group_id,
        instansi_id: selectedWAInstansi,
        keterangan: waGroupForm.keterangan
      });
      if (response?.status === 'success') {
        success('Grup WA berhasil diupdate');
        setShowAddWAGroupModal(false);
        setWAGroupForm({ kelas: '', group_id: '', keterangan: '' });
        loadWAGroups();
      } else {
        error('Gagal mengupdate grup WA');
      }
    } catch (err) {
      error('Gagal mengupdate grup WA');
    }
  };

  // ============================================
  // LOG WA TAB
  // ============================================
  const [waLogsList, setWALogsList] = useState([]);
  const [waLogsLoading, setWALogsLoading] = useState(false);
  const [waLogsSearch, setWaLogsSearch] = useState('');
  const [selectedLogInstansi, setSelectedLogInstansi] = useState(null);
  const [selectedLogKelas, setSelectedLogKelas] = useState(null);
  const [selectedLogStatus, setSelectedLogStatus] = useState(null);
  const [logDateFrom, setLogDateFrom] = useState(null);
  const [logDateTo, setLogDateTo] = useState(null);
  const [logKelasList, setLogKelasList] = useState([]);

  const loadWALogs = async () => {
    if (!selectedLogInstansi) {
      setWALogsList([]);
      return;
    }
    setWALogsLoading(true);
    try {
      const params = { instansi_id: selectedLogInstansi };
      if (selectedLogKelas) params.kelas = selectedLogKelas;
      if (selectedLogStatus) params.status = selectedLogStatus;
      if (logDateFrom) params.date_from = logDateFrom;
      if (logDateTo) params.date_to = logDateTo;

      const response = await getWALogs(params);
      if (response?.status === 'success') {
        // Sort by waktu descending (newest first) and limit to 50
        const sorted = (response.data || []).sort((a, b) => 
          new Date(b.waktu || b.created_at) - new Date(a.waktu || a.created_at)
        ).slice(0, 50);
        setWALogsList(sorted);
      }
    } catch (err) {
      console.error('Error loading WA logs:', err);
    } finally {
      setWALogsLoading(false);
    }
  };

  const loadLogKelas = async () => {
    if (!selectedLogInstansi) return;
    try {
      const response = await getKelas(selectedLogInstansi);
      if (response?.status === 'success') {
        setLogKelasList(response.data || []);
      }
    } catch (err) {
      console.error('Error loading kelas:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'log-wa') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'log-wa' && selectedLogInstansi) {
      loadLogKelas();
      setSelectedLogKelas(null);
      loadWALogs();
    }
  }, [activeTab, selectedLogInstansi]);

  useEffect(() => {
    if (activeTab === 'log-wa' && selectedLogInstansi) {
      loadWALogs();
    }
  }, [activeTab, selectedLogKelas, selectedLogStatus, logDateFrom, logDateTo]);

  const filteredLogs = useMemo(() => {
    if (!waLogsSearch) return waLogsList;
    return waLogsList.filter(log => 
      log.judul?.toLowerCase().includes(waLogsSearch.toLowerCase()) ||
      log.pesan?.toLowerCase().includes(waLogsSearch.toLowerCase())
    );
  }, [waLogsList, waLogsSearch]);

  const exportCSV = () => {
    const headers = ['No', 'Waktu', 'Kelas', 'Judul PR', 'Status', 'Pesan'];
    const rows = filteredLogs.map((log, idx) => [
      idx + 1,
      log.waktu || log.created_at || '-',
      log.kelas || '-',
      log.judul || '-',
      log.status || '-',
      (log.pesan || '').replace(/\n/g, ' ')
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-wa-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================
  // PR TAB
  // ============================================
  const [prList, setPRList] = useState([]);
  const [prLoading, setPRLoading] = useState(false);
  const [prSearch, setPRSearch] = useState('');
  const [selectedPRInstansi, setSelectedPRInstansi] = useState(null);
  const [selectedPRKelas, setSelectedPRKelas] = useState(null);
  const [selectedPRMapel, setSelectedPRMapel] = useState(null);
  const [prKelasList, setPRKelasList] = useState([]);
  const [prMapelList, setPRMapelList] = useState([]);
  const [showDeletePRModal, setShowDeletePRModal] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);

  const loadPR = async () => {
    if (!selectedPRInstansi || !selectedPRKelas) {
      setPRList([]);
      return;
    }
    setPRLoading(true);
    try {
      const response = await getPRByKelas(selectedPRKelas, selectedPRInstansi);
      if (response?.status === 'success') {
        setPRList(response.data || []);
      }
    } catch (err) {
      console.error('Error loading PR:', err);
    } finally {
      setPRLoading(false);
    }
  };

  const loadPRKelas = async () => {
    if (!selectedPRInstansi) return;
    try {
      const response = await getKelas(selectedPRInstansi);
      if (response?.status === 'success') {
        setPRKelasList(response.data || []);
      }
    } catch (err) {
      console.error('Error loading kelas:', err);
    }
  };

  const loadPRMapel = async () => {
    if (!selectedPRInstansi) return;
    try {
      const response = await getMapel(selectedPRInstansi);
      if (response?.status === 'success') {
        setPRMapelList(response.data || []);
      }
    } catch (err) {
      console.error('Error loading mapel:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'pr') {
      loadInstansi();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'pr' && selectedPRInstansi) {
      loadPRKelas();
      loadPRMapel();
      setSelectedPRKelas(null);
      setSelectedPRMapel(null);
      setPRList([]);
    }
  }, [activeTab, selectedPRInstansi]);

  useEffect(() => {
    if (activeTab === 'pr' && selectedPRKelas) {
      loadPR();
    }
  }, [activeTab, selectedPRKelas]);

  const filteredPR = useMemo(() => {
    let result = prList;
    if (selectedPRMapel) {
      result = result.filter(p => p.mapel === selectedPRMapel);
    }
    if (prSearch) {
      result = result.filter(p => 
        p.judul?.toLowerCase().includes(prSearch.toLowerCase()) ||
        p.mapel?.toLowerCase().includes(prSearch.toLowerCase())
      );
    }
    return result;
  }, [prList, selectedPRMapel, prSearch]);

  const handleDeletePR = async () => {
    try {
      const response = await deletePR(selectedPR.id);
      if (response?.status === 'success') {
        success('PR berhasil dihapus');
        setShowDeletePRModal(false);
        loadPR();
      } else {
        error('Gagal menghapus PR');
      }
    } catch (err) {
      error('Gagal menghapus PR');
    }
  };

  const getDeadlineVariant = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate - now;
    const days = diff / (1000 * 60 * 60 * 24);
    if (days < 0) return 'danger';
    if (days < 1) return 'warning';
    return 'success';
  };

  // ============================================
  // RENDER HELPERS
  // ============================================
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 bg-slate-700/50 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );

  const getSelectedInstansiName = () => {
    const found = instansiList.find(i => i.id === selectedGuruInstansi || i.id === selectedSiswaInstansi || 
      i.id === selectedKelasInstansi || i.id === selectedMapelInstansi || i.id === selectedWAInstansi || 
      i.id === selectedLogInstansi || i.id === selectedPRInstansi);
    return found?.nama || '';
  };

  return (
    <SuperAdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-6">
        {/* INSTANSI TAB */}
        {activeTab === 'instansi' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Manajemen Instansi</h2>
                <p className="text-slate-400 text-sm mt-1">Kelola semua instansi pendidikan</p>
              </div>
              <Button onClick={() => setShowAddInstansiModal(true)}>Tambah Instansi</Button>
            </div>

            {instansiLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Kode</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Alamat</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {instansiList.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-slate-400">Belum ada instansi</td>
                        </tr>
                      ) : (
                        instansiList.map((inst, idx) => (
                          <tr key={inst.id} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                            <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                            <td className="px-4 py-3 text-white font-medium">{inst.nama}</td>
                            <td className="px-4 py-3 text-slate-300">{inst.kode}</td>
                            <td className="px-4 py-3 text-slate-300">{inst.alamat || '-'}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedInstansi(inst);
                                    setInstansiForm({ nama: inst.nama, kode: inst.kode, alamat: inst.alamat || '' });
                                    setShowEditInstansiModal(true);
                                  }}
                                  className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedInstansi(inst);
                                    setShowDeleteInstansiModal(true);
                                  }}
                                  className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* GURU TAB */}
        {activeTab === 'guru' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Manajemen Guru</h2>
                <p className="text-slate-400 text-sm mt-1">Kelola data guru</p>
              </div>
              <Button onClick={() => {
                setGuruForm({ nama: '', kode_unik: '', instansi_id: selectedGuruInstansi || '' });
                setShowAddGuruModal(true);
              }} disabled={!selectedGuruInstansi}>Tambah Guru</Button>
            </div>

            <FilterBar
              showInstansi={true}
              showSearch={true}
              searchPlaceholder="Cari nama atau kode guru..."
              instansiList={instansiList}
              selectedInstansi={selectedGuruInstansi}
              onInstansiChange={setSelectedGuruInstansi}
              searchQuery={guruSearch}
              onSearchChange={setGuruSearch}
              infoText={selectedGuruInstansi ? `Menampilkan ${filteredGuru.length} guru dari ${getSelectedInstansiName()}` : 'Pilih instansi terlebih dahulu'}
              loading={guruLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Kode Unik</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {guruLoading ? (
                      <tr><td colSpan="4" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : filteredGuru.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400">
                          {selectedGuruInstansi ? 'Belum ada guru' : 'Pilih instansi terlebih dahulu'}
                        </td>
                      </tr>
                    ) : (
                      filteredGuru.map((guru, idx) => (
                        <tr key={guru.id} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-white font-medium">{guru.nama}</td>
                          <td className="px-4 py-3 text-slate-300">{guru.kode_unik}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => {
                                setSelectedGuru(guru);
                                setGuruForm({ nama: guru.nama, kode_unik: guru.kode_unik, instansi_id: guru.instansi_id });
                                setShowEditGuruModal(true);
                              }} className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">Edit</button>
                              <button onClick={() => { setSelectedGuru(guru); setShowDeleteGuruModal(true); }} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">Hapus</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* SISWA TAB */}
        {activeTab === 'siswa' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Manajemen Siswa</h2>
                <p className="text-slate-400 text-sm mt-1">Kelola data siswa</p>
              </div>
            </div>

            <FilterBar
              showInstansi={true}
              showKelas={true}
              showSearch={true}
              searchPlaceholder="Cari nama atau NISN..."
              instansiList={instansiList}
              kelasList={siswaKelasList}
              selectedInstansi={selectedSiswaInstansi}
              selectedKelas={selectedSiswaKelas}
              onInstansiChange={setSelectedSiswaInstansi}
              onKelasChange={setSelectedSiswaKelas}
              searchQuery={siswaSearch}
              onSearchChange={setSiswaSearch}
              infoText={selectedSiswaKelas ? `Menampilkan ${filteredSiswa.length} siswa dari kelas ${selectedSiswaKelas} — ${getSelectedInstansiName()}` : 'Pilih instansi dan kelas'}
              loading={siswaLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Kelas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">NISN</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Terdaftar</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {siswaLoading ? (
                      <tr><td colSpan="6" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : filteredSiswa.length === 0 ? (
                      <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400">{selectedSiswaKelas ? 'Belum ada siswa' : 'Pilih instansi dan kelas'}</td></tr>
                    ) : (
                      filteredSiswa.map((siswa, idx) => (
                        <tr key={siswa.id} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-white font-medium">{siswa.nama}</td>
                          <td className="px-4 py-3 text-slate-300">{siswa.kelas}</td>
                          <td className="px-4 py-3 text-slate-300">{siswa.nisn || '-'}</td>
                          <td className="px-4 py-3 text-slate-300">{siswa.created_at ? new Date(siswa.created_at).toLocaleDateString('id-ID') : '-'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { setSelectedSiswa(siswa); setShowDeleteSiswaModal(true); }} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* KELAS TAB */}
        {activeTab === 'kelas' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Manajemen Kelas</h2>
                <p className="text-slate-400 text-sm mt-1">Kelola data kelas</p>
              </div>
              <Button onClick={() => { setKelasForm({ nama: '' }); setShowAddKelasModal(true); }} disabled={!selectedKelasInstansi}>Tambah Kelas</Button>
            </div>
          
            <FilterBar
              showInstansi={true}
              selectedInstansi={selectedKelasInstansi}
              onInstansiChange={setSelectedKelasInstansi}
              infoText={selectedKelasInstansi ? `${kelasList.length} kelas terdaftar di ${getSelectedInstansiName()}` : 'Pilih instansi'}
              loading={kelasLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Nama Kelas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {kelasLoading ? (
                      <tr><td colSpan="3" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : kelasList.length === 0 ? (
                      <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-400">{selectedKelasInstansi ? 'Belum ada kelas' : 'Pilih instansi'}</td></tr>
                    ) : (
                      kelasList.map((kelas, idx) => (
                        <tr key={kelas.id} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-white font-medium">{kelas.nama}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { setSelectedKelas(kelas); setShowDeleteKelasModal(true); }} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MAPEL TAB */}
        {activeTab === 'mapel' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Manajemen Mapel</h2>
                <p className="text-slate-400 text-sm mt-1">Kelola mata pelajaran</p>
              </div>
              <Button onClick={() => { setMapelForm({ nama: '' }); setShowAddMapelModal(true); }} disabled={!selectedMapelInstansi}>Tambah Mapel</Button>
            </div>

            <FilterBar
              showInstansi={true}
              showSearch={true}
              searchPlaceholder="Cari nama mapel..."
              instansiList={instansiList}
              selectedInstansi={selectedMapelInstansi}
              onInstansiChange={setSelectedMapelInstansi}
              searchQuery={mapelSearch}
              onSearchChange={setMapelSearch}
              infoText={selectedMapelInstansi ? `${filteredMapel.length} mata pelajaran di ${getSelectedInstansiName()}` : 'Pilih instansi'}
              loading={mapelLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Nama Mapel</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {mapelLoading ? (
                      <tr><td colSpan="3" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : filteredMapel.length === 0 ? (
                      <tr><td colSpan="3" className="px-4 py-8 text-center text-slate-400">{selectedMapelInstansi ? 'Belum ada mapel' : 'Pilih instansi'}</td></tr>
                    ) : (
                      filteredMapel.map((mapel, idx) => (
                        <tr key={mapel.id} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-white font-medium">{mapel.nama}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => { setSelectedMapel(mapel); setShowDeleteMapelModal(true); }} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* GRUP WA TAB */}
        {activeTab === 'grup-wa' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Grup WhatsApp</h2>
                <p className="text-slate-400 text-sm mt-1">Kelola grup WA per kelas</p>
              </div>
              <Button onClick={() => { setWAGroupForm({ kelas: '', group_id: '', keterangan: '' }); setShowAddWAGroupModal(true); }} disabled={!selectedWAInstansi}>Update Grup WA</Button>
            </div>

            <FilterBar
              showInstansi={true}
              selectedInstansi={selectedWAInstansi}
              onInstansiChange={setSelectedWAInstansi}
              infoText={selectedWAInstansi ? `${waGroupsList.filter(g => g.group_id && g.group_id !== 'PENDING').length} grup aktif dari ${waKelasList.length} total kelas` : 'Pilih instansi'}
              loading={waGroupsLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Kelas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Group ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Keterangan</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {waGroupsLoading ? (
                      <tr><td colSpan="5" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : waGroupsList.length === 0 ? (
                      <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">{selectedWAInstansi ? 'Belum ada data grup WA' : 'Pilih instansi'}</td></tr>
                    ) : (
                      waGroupsList.map((group, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-white font-medium">{group.kelas}</td>
                          <td className="px-4 py-3 text-slate-300 font-mono text-sm">{group.group_id || '-'}</td>
                          <td className="px-4 py-3 text-slate-300">{group.keterangan || '-'}</td>
                          <td className="px-4 py-3">
                            <Badge variant={group.group_id && group.group_id !== 'PENDING' ? 'success' : 'danger'}>
                              {group.group_id && group.group_id !== 'PENDING' ? 'Aktif' : 'Belum diisi'}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* LOG WA TAB */}
        {activeTab === 'log-wa' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Log WhatsApp</h2>
                <p className="text-slate-400 text-sm mt-1">Riwayat pengiriman notifikasi WA</p>
              </div>
              <Button onClick={exportCSV} disabled={filteredLogs.length === 0}>Export CSV</Button>
            </div>

            <FilterBar
              showInstansi={true}
              showKelas={true}
              showStatus={true}
              showDateRange={true}
              showSearch={true}
              searchPlaceholder="Cari judul PR..."
              statusOptions={[
                { value: 'terkirim', label: 'Terkirim' },
                { value: 'gagal', label: 'Gagal' }
              ]}
              instansiList={instansiList}
              kelasList={logKelasList}
              selectedInstansi={selectedLogInstansi}
              selectedKelas={selectedLogKelas}
              selectedStatus={selectedLogStatus}
              dateFrom={logDateFrom}
              dateTo={logDateTo}
              onInstansiChange={setSelectedLogInstansi}
              onKelasChange={setSelectedLogKelas}
              onStatusChange={setSelectedLogStatus}
              onDateFromChange={setLogDateFrom}
              onDateToChange={setLogDateTo}
              searchQuery={waLogsSearch}
              onSearchChange={setWaLogsSearch}
              infoText={selectedLogInstansi ? `Menampilkan ${filteredLogs.length} log` : 'Pilih instansi'}
              loading={waLogsLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Waktu</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Kelas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Judul PR</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Pesan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {waLogsLoading ? (
                      <tr><td colSpan="5" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : filteredLogs.length === 0 ? (
                      <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-400">{selectedLogInstansi ? 'Belum ada log' : 'Pilih instansi'}</td></tr>
                    ) : (
                      filteredLogs.map((log, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-slate-300">{log.waktu ? new Date(log.waktu).toLocaleString('id-ID') : '-'}</td>
                          <td className="px-4 py-3 text-white">{log.kelas || '-'}</td>
                          <td className="px-4 py-3 text-slate-300">{log.judul || '-'}</td>
                          <td className="px-4 py-3">
                            <Badge variant={log.status === 'terkirim' ? 'success' : 'danger'}>
                              {log.status === 'terkirim' ? 'Terkirim' : 'Gagal'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-300 text-sm max-w-xs truncate">{log.pesan || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* PR TAB */}
        {activeTab === 'pr' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Monitoring PR</h2>
                <p className="text-slate-400 text-sm mt-1">Pantau semua PR yang dibuat</p>
              </div>
            </div>

            <FilterBar
              showInstansi={true}
              showKelas={true}
              showMapel={true}
              showSearch={true}
              searchPlaceholder="Cari judul PR..."
              statusOptions={[
                { value: 'terkirim', label: 'Terkirim' },
                { value: 'gagal', label: 'Gagal' }
              ]}
              instansiList={instansiList}
              kelasList={prKelasList}
              mapelList={prMapelList}
              selectedInstansi={selectedPRInstansi}
              selectedKelas={selectedPRKelas}
              selectedMapel={selectedPRMapel}
              onInstansiChange={setSelectedPRInstansi}
              onKelasChange={setSelectedPRKelas}
              onMapelChange={setSelectedPRMapel}
              searchQuery={prSearch}
              onSearchChange={setPRSearch}
              infoText={selectedPRKelas ? `Menampilkan ${filteredPR.length} PR` : 'Pilih instansi dan kelas'}
              loading={prLoading}
            />

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Mapel</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Judul</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">WA</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {prLoading ? (
                      <tr><td colSpan="6" className="px-4 py-4"><LoadingSkeleton /></td></tr>
                    ) : filteredPR.length === 0 ? (
                      <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400">{selectedPRKelas ? 'Belum ada PR' : 'Pilih instansi dan kelas'}</td></tr>
                    ) : (
                      filteredPR.map((pr, idx) => (
                        <tr key={pr.id} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                          <td className="px-4 py-3 text-slate-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-white">{pr.mapel}</td>
                          <td className="px-4 py-3 text-slate-300">{pr.judul}</td>
                          <td className="px-4 py-3">
                            <Badge variant={getDeadlineVariant(pr.deadline)}>{pr.deadline}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={pr.wa_status === 'terkirim' ? 'success' : pr.wa_status === 'gagal' ? 'danger' : 'neutral'}>
                              {pr.wa_status === 'terkirim' ? 'Terkirim' : pr.wa_status === 'gagal' ? 'Gagal' : '-'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => { setSelectedPR(pr); setShowDeletePRModal(true); }} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      {/* Add Instansi Modal */}
      <Modal isOpen={showAddInstansiModal} onClose={() => setShowAddInstansiModal(false)} title="Tambah Instansi">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Instansi</label>
            <input type="text" value={instansiForm.nama} onChange={(e) => setInstansiForm({ ...instansiForm, nama: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Contoh: SMK Muktilabs" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kode</label>
            <input type="text" value={instansiForm.kode} onChange={(e) => setInstansiForm({ ...instansiForm, kode: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Contoh: SMK-MUKTI-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Alamat</label>
            <textarea value={instansiForm.alamat} onChange={(e) => setInstansiForm({ ...instansiForm, alamat: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" rows="3" placeholder="Alamat lengkap"></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddInstansiModal(false)}>Batal</Button>
            <Button onClick={handleAddInstansi}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Instansi Modal */}
      <Modal isOpen={showEditInstansiModal} onClose={() => setShowEditInstansiModal(false)} title="Edit Instansi">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Instansi</label>
            <input type="text" value={instansiForm.nama} onChange={(e) => setInstansiForm({ ...instansiForm, nama: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kode</label>
            <input type="text" value={instansiForm.kode} onChange={(e) => setInstansiForm({ ...instansiForm, kode: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Alamat</label>
            <textarea value={instansiForm.alamat} onChange={(e) => setInstansiForm({ ...instansiForm, alamat: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" rows="3"></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowEditInstansiModal(false)}>Batal</Button>
            <Button onClick={handleEditInstansi}>Update</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Instansi Modal */}
      <Modal isOpen={showDeleteInstansiModal} onClose={() => setShowDeleteInstansiModal(false)} title="Hapus Instansi">
        <p className="text-slate-300 mb-4">Apakah Anda yakin ingin menghapus instansi <strong className="text-white">{selectedInstansi?.nama}</strong>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteInstansiModal(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDeleteInstansi}>Hapus</Button>
        </div>
      </Modal>

      {/* Add Guru Modal */}
      <Modal isOpen={showAddGuruModal} onClose={() => setShowAddGuruModal(false)} title="Tambah Guru">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Guru</label>
            <input type="text" value={guruForm.nama} onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Nama lengkap" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kode Unik (NIP)</label>
            <input type="text" value={guruForm.kode_unik} onChange={(e) => setGuruForm({ ...guruForm, kode_unik: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="NIP atau kode khusus" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddGuruModal(false)}>Batal</Button>
            <Button onClick={handleAddGuru}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Guru Modal */}
      <Modal isOpen={showEditGuruModal} onClose={() => setShowEditGuruModal(false)} title="Edit Guru">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Guru</label>
            <input type="text" value={guruForm.nama} onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kode Unik</label>
            <input type="text" value={guruForm.kode_unik} onChange={(e) => setGuruForm({ ...guruForm, kode_unik: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowEditGuruModal(false)}>Batal</Button>
            <Button onClick={handleEditGuru}>Update</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Guru Modal */}
      <Modal isOpen={showDeleteGuruModal} onClose={() => setShowDeleteGuruModal(false)} title="Hapus Guru">
        <p className="text-slate-300 mb-4">Apakah Anda yakin ingin menghapus guru <strong className="text-white">{selectedGuru?.nama}</strong>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteGuruModal(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDeleteGuru}>Hapus</Button>
        </div>
      </Modal>

      {/* Delete Siswa Modal */}
      <Modal isOpen={showDeleteSiswaModal} onClose={() => setShowDeleteSiswaModal(false)} title="Hapus Siswa">
        <p className="text-slate-300 mb-4">Apakah Anda yakin ingin menghapus siswa <strong className="text-white">{selectedSiswa?.nama}</strong>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteSiswaModal(false)}>Batal</Button>
          <Button variant="danger" onClick={() => { error('Fitur hapus siswa belum tersedia'); setShowDeleteSiswaModal(false); }}>Hapus</Button>
        </div>
      </Modal>

      {/* Add Kelas Modal */}
      <Modal isOpen={showAddKelasModal} onClose={() => setShowAddKelasModal(false)} title="Tambah Kelas">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Kelas</label>
            <input type="text" value={kelasForm.nama} onChange={(e) => setKelasForm({ nama: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Contoh: XI-RPL" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddKelasModal(false)}>Batal</Button>
            <Button onClick={handleAddKelas}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Kelas Modal */}
      <Modal isOpen={showDeleteKelasModal} onClose={() => setShowDeleteKelasModal(false)} title="Hapus Kelas">
        <p className="text-slate-300 mb-4">Apakah Anda yakin ingin menghapus kelas <strong className="text-white">{selectedKelas?.nama}</strong>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteKelasModal(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDeleteKelas}>Hapus</Button>
        </div>
      </Modal>

      {/* Add Mapel Modal */}
      <Modal isOpen={showAddMapelModal} onClose={() => setShowAddMapelModal(false)} title="Tambah Mapel">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Mapel</label>
            <input type="text" value={mapelForm.nama} onChange={(e) => setMapelForm({ nama: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Contoh: Matematika" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddMapelModal(false)}>Batal</Button>
            <Button onClick={handleAddMapel}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Mapel Modal */}
      <Modal isOpen={showDeleteMapelModal} onClose={() => setShowDeleteMapelModal(false)} title="Hapus Mapel">
        <p className="text-slate-300 mb-4">Apakah Anda yakin ingin menghapus mapel <strong className="text-white">{selectedMapel?.nama}</strong>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeleteMapelModal(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDeleteMapel}>Hapus</Button>
        </div>
      </Modal>

      {/* Update WA Group Modal */}
      <Modal isOpen={showAddWAGroupModal} onClose={() => setShowAddWAGroupModal(false)} title="Update Grup WhatsApp">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Kelas</label>
            <select value={waGroupForm.kelas} onChange={(e) => setWAGroupForm({ ...waGroupForm, kelas: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
              <option value="">Pilih Kelas</option>
              {waKelasList.map((k) => (
                <option key={k.id} value={k.nama}>{k.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Group ID WA</label>
            <input type="text" value={waGroupForm.group_id} onChange={(e) => setWAGroupForm({ ...waGroupForm, group_id: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono" placeholder="628xxx@g.us" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Keterangan</label>
            <input type="text" value={waGroupForm.keterangan} onChange={(e) => setWAGroupForm({ ...waGroupForm, keterangan: e.target.value })} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Contoh: Grup WA XI RPL" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowAddWAGroupModal(false)}>Batal</Button>
            <Button onClick={handleUpdateWAGroup}>Simpan</Button>
          </div>
        </div>
      </Modal>

      {/* Delete PR Modal */}
      <Modal isOpen={showDeletePRModal} onClose={() => setShowDeletePRModal(false)} title="Hapus PR">
        <p className="text-slate-300 mb-4">Apakah Anda yakin ingin menghapus PR <strong className="text-white">{selectedPR?.judul}</strong>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowDeletePRModal(false)}>Batal</Button>
          <Button variant="danger" onClick={handleDeletePR}>Hapus</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </SuperAdminLayout>
  );
};

export default SuperAdmin;
      
