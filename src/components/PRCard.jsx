import React from 'react';
import Badge from './Badge';
import Toggle from './Toggle';
import { formatDate, getCountdown, getPRCardBorderColor } from '../utils/dateHelper';

const PRCard = ({ pr, onToggleStatus, isCompleted }) => {
  const countdown = getCountdown(pr.deadline);
  const borderColor = getPRCardBorderColor(pr.deadline);
  const deskripsi = pr.deskripsi?.length > 100 
    ? pr.deskripsi.substring(0, 100) + '...' 
    : pr.deskripsi;
  
  return (
    <div className={`bg-white rounded-lg shadow-md border-l-4 ${borderColor} hover:shadow-lg transition-shadow duration-200`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <Badge variant="primary" className="mb-2">
              📚 {pr.mapel}
            </Badge>
            <h3 className="font-semibold text-slate-800 text-lg">{pr.judul}</h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={countdown.type}>
              ⏳ {countdown.text}
            </Badge>
            {/* WA Status - hanya tampilkan jika wa_status = "terkirim" */}
            {pr.wa_status === 'terkirim' && (
              <Badge variant="wa" size="xs">
                🔔 Notif WA
              </Badge>
            )}
            {pr.wa_status === 'pending' && (
              <Badge variant="neutral" size="xs">
                ⏳ Segera Hadir
              </Badge>
            )}
          </div>
        </div>
        
        {/* Deskripsi */}
        <p className="text-slate-600 text-sm mb-4">{deskripsi}</p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(pr.deadline)}</span>
          </div>
          
          {/* Status Toggle */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className={`text-xs ${isCompleted ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
              {isCompleted ? '✓ Selesai' : '☐ Belum'}
            </span>
            <Toggle
              checked={isCompleted}
              onChange={(checked) => onToggleStatus(pr.id, checked)}
              size="sm"
            />
          </div>
        </div>
        
        {/* WA Info - hanya tampilkan jika wa_status = "terkirim" */}
        {pr.wa_status === 'terkirim' && (
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.118 1.545 5.886L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Notif WA sudah dikirim ke grup kelas</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRCard;
