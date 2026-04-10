# SPEC.md - Sistem Manajemen PR Sekolah

## 1. Concept & Vision

Aplikasi web SPA untuk manajemen Pekerjaan Rumah (PR) sekolah yang menghubungkan Guru dan Siswa. Guru dapat membuat, mengedit, dan menghapus PR dengan notifikasi WhatsApp otomatis ke grup kelas. Siswa dapat melihat PR berdasarkan kelasnya dengan countdown deadline yang informatif. Desain clean, modern, dan school-friendly dengan tema biru tua profesional.

## 2. Design Language

### Aesthetic Direction
Clean, professional school management system dengan sentuhan modern dan friendly. Terinspirasi dari aplikasi education modern seperti Google Classroom.

### Color Palette
- **Primary**: `#1e3a5f` (Biru Tua - profesional, kepercayaan)
- **Secondary**: `#f8fafc` (Abu-abu sangat terang - background)
- **Accent**: `#f59e0b` (Kuning - highlight, urgensi)
- **Success**: `#10b981` (Hijau - deadline aman)
- **Warning**: `#eab308` (Kuning - deadline besok)
- **Danger**: `#ef4444` (Merah - deadline urgent/terlambat)
- **WhatsApp**: `#25D366` (Hijau WA - badge notifikasi)
- **Background**: `#ffffff` (Putih - cards, modals)
- **Text Primary**: `#1e293b` (Slate gelap)
- **Text Secondary**: `#64748b` (Slate medium)

### Typography
- **Font Family**: Inter (Google Fonts), fallback: system-ui, sans-serif
- **Headings**: Bold, sizes 2xl, xl, lg
- **Body**: Regular, size base (16px)
- **Captions**: Small, text-slate-500

### Spatial System
- Base unit: 4px (Tailwind default)
- Padding cards: 24px (p-6)
- Gap between elements: 16px (gap-4)
- Border radius: rounded-lg (8px) untuk cards, rounded-xl (12px) untuk modals

### Motion Philosophy
- Transitions: 200ms ease-out untuk hover states
- Modal: fade-in dengan scale transform
- Toast: slide-in dari atas
- Loading: pulse animation

## 3. Layout & Structure

### Page Structure
1. **Login Page** - Centered card dengan form sederhana
2. **Dashboard Guru** - Header + Filter dropdown + Tabel PR + Tab untuk Riwayat WA
3. **Dashboard Siswa** - Header + Grid cards PR

### Responsive Strategy
- Mobile: single column, stacked elements
- Tablet: 2 columns grid untuk cards
- Desktop: full table view, 3-4 columns grid

### Navigation
- Simple navbar dengan logo, user info, dan logout button
- Role-based routing (redirect berdasarkan role dari localStorage)

## 4. Features & Interactions

### Login Flow
1. User pilih role (Guru/Siswa) dari dropdown
2. User input nama
3. Jika Siswa, input kelas dari dropdown
4. Click "Masuk" → simpan ke localStorage → redirect ke dashboard sesuai role

### Guru Dashboard Features
- **Tabel PR**: Sortable, filterable by kelas
- **Tambah PR**: Modal dengan validasi, preview WA sebelum kirim
- **Edit PR**: Pre-filled form, opsi kirim ulang WA
- **Hapus PR**: Confirmation dialog
- **Deadline Indicators**: Color-coded badges
- **Riwayat WA**: Tab terpisah dengan log dan tombol kirim ulang

### Siswa Dashboard Features
- **Auto-fetch PR**: Berdasarkan kelas dari localStorage
- **PR Cards**: Grid layout dengan countdown
- **Status Toggle**: Siswa bisa tandai PR selesai (localStorage)
- **Countdown Display**: Real-time countdown ke deadline

### Interactions Detail
- **Toggle WA**: Switch dengan label, preview muncul di modal
- **Deadline Colors**: 
  - Merah: deadline hari ini atau lewat
  - Kuning: deadline besok
  - Hijau: deadline > 1 hari
- **Toast Notifications**: Success/error untuk semua operasi
- **Loading States**: Spinner pada buttons dan tables

## 5. Component Inventory

### Button
- Variants: primary, secondary, danger, success, wa
- States: default, hover (opacity-90), disabled (opacity-50), loading (spinner)

### Modal
- Overlay: bg-black/50 dengan backdrop blur
- Content: bg-white, rounded-xl, shadow-xl, max-w-md
- Header, body, footer sections

### Card (PRCard untuk Siswa)
- Border-left colored sesuai urgency
- Shadow on hover
- Badge untuk status

### Badge
- Variants: success, warning, danger, wa, neutral
- Pill shape, small text

### Toggle
- Switch style dengan label
- Green when on

### Table
- Striped rows
- Hoverable
- Responsive (scroll horizontal on mobile)

### Toast
- Fixed position top-right
- Auto dismiss 3 seconds
- Variants: success, error, info

## 6. Technical Approach

### Framework
- React 18+ dengan Vite
- Tailwind CSS untuk styling
- React Router v6 untuk routing

### State Management
- useState + useEffect untuk local state
- localStorage untuk persistence (user session, PR status siswa)

### API Integration
- Axios untuk HTTP requests
- Base URL: http://localhost:5678/webhook
- Endpoints:
  - POST /create-pr
  - GET /get-pr?kelas={kelas}
  - POST /update-pr
  - POST /delete-pr
  - POST /resend-wa

### Data Models

#### PR Object
```json
{
  "id": 1,
  "mapel": "Matematika",
  "kelas": "XI-RPL",
  "judul": "Latihan Integral",
  "deskripsi": "Kerjakan soal hal 45-50",
  "deadline": "2025-07-20",
  "guru_id": 1,
  "kirim_wa": true,
  "wa_status": "terkirim",
  "created_at": "2025-07-15T10:00:00Z"
}
```

#### User Session
```json
{
  "role": "guru|siswa",
  "nama": "Budi Santoso",
  "kelas": "XI-RPL" // hanya untuk siswa
}
```

#### WA Log Entry
```json
{
  "id": 1,
  "waktu_kirim": "2025-07-15T10:05:00Z",
  "kelas": "XI-RPL",
  "judul_pr": "Latihan Integral",
  "status": "terkirim|gagal"
}
```

### Utility Functions
- dateHelper.js: formatDate, getCountdown, getDeadlineColor

### Error Handling
- Try-catch pada semua API calls
- Toast notification untuk error messages
- Fallback UI states (empty states, error states)
