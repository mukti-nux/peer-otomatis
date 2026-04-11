import React, { useEffect, useRef } from 'react';

const FilterBar = ({
  showInstansi,
  showKelas,
  showSearch,
  showStatus,
  showDateRange,
  showMapel,
  searchPlaceholder = 'Cari...',
  statusOptions = [],
  instansiList = [],
  kelasList = [],
  mapelList = [],
  selectedInstansi,
  selectedKelas,
  selectedMapel,
  selectedStatus,
  searchQuery,
  dateFrom,
  dateTo,
  onInstansiChange,
  onKelasChange,
  onMapelChange,
  onStatusChange,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  infoText,
  extraAction,
  loading = false
}) => {
  const searchInputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && searchQuery !== undefined) {
        // Search is already handled by the onChange
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 mb-4">
      {/* Info Text */}
      {infoText && (
        <div className="text-sm text-purple-300 font-medium mb-4">
          {infoText}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Instansi Dropdown */}
        {showInstansi && (
          <div className="min-w-[200px]">
            <select
              value={selectedInstansi || ''}
              onChange={(e) => onInstansiChange?.(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Semua Instansi</option>
              {instansiList.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Kelas Dropdown */}
        {showKelas && (
          <div className="min-w-[180px]">
            <select
              value={selectedKelas || ''}
              onChange={(e) => onKelasChange?.(e.target.value || null)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!selectedInstansi}
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((kelas) => (
                <option key={kelas.id || kelas.nama} value={kelas.nama}>
                  {kelas.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Mapel Dropdown */}
        {showMapel && (
          <div className="min-w-[180px]">
            <select
              value={selectedMapel || ''}
              onChange={(e) => onMapelChange?.(e.target.value || null)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!selectedInstansi}
            >
              <option value="">Semua Mapel</option>
              {mapelList.map((mapel) => (
                <option key={mapel.id} value={mapel.nama}>
                  {mapel.nama}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        {showStatus && statusOptions.length > 0 && (
          <div className="min-w-[150px]">
            <select
              value={selectedStatus || ''}
              onChange={(e) => onStatusChange?.(e.target.value || null)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range */}
        {showDateRange && (
          <>
            <div className="min-w-[140px]">
              <input
                type="date"
                value={dateFrom || ''}
                onChange={(e) => onDateFromChange?.(e.target.value || null)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Dari tanggal"
              />
            </div>
            <span className="text-slate-400 text-sm">—</span>
            <div className="min-w-[140px]">
              <input
                type="date"
                value={dateTo || ''}
                onChange={(e) => onDateToChange?.(e.target.value || null)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Sampai tanggal"
              />
            </div>
          </>
        )}

        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Extra Action */}
        {extraAction && (
          <div className="ml-auto">
            {extraAction}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 animate-pulse w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
