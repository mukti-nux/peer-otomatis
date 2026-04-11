import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { formatDate } from '../utils/dateHelper';

const WAPreviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  prData,
  loading = false
}) => {
  if (!prData) return null;

  const generateWAPreview = () => {
    const kelasDisplay = prData.kelas?.replace('-', ' ') || '';
    const session = JSON.parse(localStorage.getItem('user_session'));
    return `📚 PR BARU — ${kelasDisplay}
Mapel     : ${prData.mapel}
Judul     : ${prData.judul}
Deskripsi : ${prData.deskripsi || '-'}
Deadline  : ${formatDate(prData.deadline)} ⏰
Dari Guru : ${session?.nama || prData.nama_guru || '-'}

Segera dikerjakan ya! 💪
— Disampaikan oleh Sistem PR Sekolah`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Konfirmasi Kirim WhatsApp"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Batal
          </Button>
          <Button
            variant="wa"
            onClick={() => onConfirm(prData)}
            loading={loading}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.118 1.545 5.886L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Kirim Pesan
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-slate-600">
          Pesan berikut akan dikirim ke grup WhatsApp kelas <strong>{prData.kelas}</strong>:
        </p>

        {/* Preview WhatsApp Message */}
        <div className="bg-[#DCF8C6] rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-slate-800">
            {generateWAPreview()}
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-yellow-700 font-medium">Peringatan</p>
              <p className="text-xs text-yellow-600 mt-1">
                Pastikan nomor grup WhatsApp sudah benar. Pesan yang sudah dikirim tidak dapat dicabut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WAPreviewModal;
