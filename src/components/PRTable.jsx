import React from 'react';
import Badge from './Badge';
import Button from './Button';
import { formatDate, getDeadlineColor } from '../utils/dateHelper';

const PRTable = ({ 
  prList, 
  onEdit, 
  onDelete, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-slate-500">Memuat data...</p>
        </div>
      </div>
    );
  }
  
  if (!prList || prList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center text-slate-500">
          <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg">Belum ada PR</p>
          <p className="text-sm">Klik tombol "+ Tambah PR" untuk membuat PR baru</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mapel</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelas</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Judul</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Deadline</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Notif WA</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {prList.map((pr, index) => {
               if (!pr) return null;
               const deadlineColor = pr.deadline ? getDeadlineColor(pr.deadline) : 'neutral';
               return (
                 <tr key={pr.id || index} className="hover:bg-slate-50 transition-colors">
                   <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                   <td className="px-4 py-3 text-sm font-medium text-slate-800">{pr.mapel || '-'}</td>
                   <td className="px-4 py-3 text-sm text-slate-600">{pr.kelas || '-'}</td>
                   <td className="px-4 py-3 text-sm text-slate-800 max-w-xs truncate">{pr.judul || '-'}</td>
                   <td className="px-4 py-3">
                     <Badge variant={deadlineColor}>
                       {pr.deadline ? formatDate(pr.deadline) : '-'}
                     </Badge>
                   </td>
                   <td className="px-4 py-3">
                     {pr.wa_status === 'terkirim' ? (
                       <Badge variant="success">✓ Terkirim</Badge>
                     ) : pr.wa_status === 'pending' ? (
                       <Badge variant="neutral">⏳ Pending</Badge>
                     ) : (
                       <Badge variant="neutral">-</Badge>
                     )}
                   </td>
                   <td className="px-4 py-3">
                     <div className="flex items-center gap-2">
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => onEdit(pr)}
                         className="text-primary hover:bg-primary/10"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                         </svg>
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => onDelete(pr)}
                         className="text-red-500 hover:bg-red-50"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                       </Button>
                     </div>
                   </td>
                 </tr>
               );
             })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRTable;
