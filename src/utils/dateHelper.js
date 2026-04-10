import { format, formatDistanceToNow, differenceInDays, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} Tanggal dalam format "Senin, 20 Juli 2025"
 */
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "EEEE, d MMMM yyyy", { locale: id });
};

/**
 * Format tanggal pendek
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} Tanggal dalam format "20/07/2025"
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

/**
 * Format tanggal untuk input date
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} Tanggal dalam format "2025-07-20"
 */
export const formatDateInput = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Format waktu
 * @param {string|Date} date - Waktu yang akan diformat
 * @returns {string} Waktu dalam format "10:00"
 */
export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
};

/**
 * Format tanggal dan waktu lengkap
 * @param {string|Date} date - Tanggal dan waktu
 * @returns {string} Format "20 Juli 2025, 10:00"
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "d MMMM yyyy, 'pukul' HH:mm", { locale: id });
};

/**
 * Get countdown text untuk deadline
 * @param {string|Date} deadline - Tanggal deadline
 * @returns {object} Object dengan text dan type (safe, warning, danger)
 */
export const getCountdown = (deadline) => {
  if (!deadline) return { text: '', type: 'safe' };
  
  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const deadlineOnly = new Date(deadlineDate);
  deadlineOnly.setHours(0, 0, 0, 0);
  
  const days = differenceInDays(deadlineOnly, now);
  
  if (isPast(deadlineOnly)) {
    return { text: 'Terlambat', type: 'danger' };
  }
  if (isToday(deadlineOnly)) {
    return { text: 'HARI INI!', type: 'danger' };
  }
  if (isTomorrow(deadlineOnly)) {
    return { text: 'Besok!', type: 'warning' };
  }
  if (days <= 3) {
    return { text: `${days} hari lagi`, type: 'warning' };
  }
  return { text: `${days} hari lagi`, type: 'safe' };
};

/**
 * Get deadline color berdasarkan urgency
 * @param {string|Date} deadline - Tanggal deadline
 * @returns {string} Nama warna Tailwind
 */
export const getDeadlineColor = (deadline) => {
  const countdown = getCountdown(deadline);
  return countdown.type;
};

/**
 * Get border color untuk card PR berdasarkan urgency
 * @param {string|Date} deadline - Tanggal deadline
 * @returns {string} Kelas Tailwind untuk border
 */
export const getPRCardBorderColor = (deadline) => {
  const countdown = getCountdown(deadline);
  switch (countdown.type) {
    case 'danger':
      return 'border-l-red-500';
    case 'warning':
      return 'border-l-yellow-500';
    default:
      return 'border-l-green-500';
  }
};

/**
 * Get badge color untuk WA status
 * @param {string} status - Status WA (terkirim/gagal)
 * @returns {string} Kelas Tailwind untuk badge
 */
export const getWAStatusBadge = (status) => {
  return status === 'terkirim' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
};

/**
 * Format relative time (misal "2 jam yang lalu")
 * @param {string|Date} date - Tanggal
 * @returns {string} Waktu relatif
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
};
