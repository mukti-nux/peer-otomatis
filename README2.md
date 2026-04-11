# 📚 Sistem Manajemen PR Sekolah
> Dokumentasi teknis untuk developer & admin sistem

---

## 🏗️ Arsitektur Sistem

```
Frontend (React + Vite)
        ↓
n8n Webhook (https://n8n.muktilabs.my.id/webhook)
        ↓
PostgreSQL (pr_sekolah)
        ↓
Fonnte API → WhatsApp Grup Kelas
```

---

## 🗄️ Database PostgreSQL

**Nama Database:** `pr_sekolah`  
**User:** `pr_user`  
**Host:** `localhost` (PostgreSQL berjalan langsung di VM, bukan Docker)

### Masuk ke PostgreSQL
```bash
sudo -u postgres psql -d pr_sekolah
```

### Struktur Tabel

| Tabel | Fungsi |
|---|---|
| `instansi` | Data sekolah/instansi |
| `users` | Data guru & siswa |
| `kelas` | Daftar kelas per instansi |
| `mapel` | Daftar mata pelajaran per instansi |
| `pr` | Data pekerjaan rumah |
| `submissions` | Pengumpulan tugas siswa |
| `wa_groups` | Mapping kelas → Group ID WhatsApp |
| `wa_logs` | Riwayat pengiriman notifikasi WA |

---

## 👤 Manajemen Pengguna

### Tambah Guru Baru
```sql
INSERT INTO users (nama, role, kelas, instansi_id, kode_unik)
VALUES ('Nama Guru', 'guru', NULL, 1, 'KODE_UNIK_GURU');
```
> `kode_unik` dipakai sebagai password login guru. Contoh: NIP atau kode khusus.

### Hapus Guru
```sql
DELETE FROM users WHERE id = ID_GURU AND role = 'guru';
```

### Lihat Semua Guru
```sql
SELECT u.id, u.nama, u.kode_unik, i.nama as instansi
FROM users u
LEFT JOIN instansi i ON u.instansi_id = i.id
WHERE u.role = 'guru';
```

### Edit Kode Unik Guru
```sql
UPDATE users SET kode_unik = 'KODE_BARU' WHERE id = ID_GURU;
```

### Lihat Semua Siswa
```sql
SELECT u.id, u.nama, u.kelas, u.nisn, i.nama as instansi
FROM users u
LEFT JOIN instansi i ON u.instansi_id = i.id
WHERE u.role = 'siswa'
ORDER BY u.kelas, u.nama;
```

### Hapus Data Siswa
```sql
DELETE FROM users WHERE id = ID_SISWA AND role = 'siswa';
```

---

## 🏫 Manajemen Instansi (Multi-Sekolah)

### Tambah Instansi/Sekolah Baru
```sql
INSERT INTO instansi (nama, kode, alamat)
VALUES ('SMK Contoh 3', 'SMK-CONTOH-3', 'Jl. Contoh No.3');
```

### Lihat Semua Instansi
```sql
SELECT * FROM instansi;
```

### Setelah tambah instansi baru, tambah guru pertamanya:
```sql
INSERT INTO users (nama, role, kelas, instansi_id, kode_unik)
VALUES ('Admin Sekolah', 'guru', NULL, ID_INSTANSI_BARU, 'kode123');
```

---

## 📋 Manajemen Kelas

### Tambah Kelas Baru (via SQL)
```sql
INSERT INTO kelas (nama, instansi_id)
VALUES ('X-AKL', 1);
```

### Hapus Kelas
```sql
DELETE FROM kelas WHERE id = ID_KELAS AND instansi_id = 1;
```

### Lihat Semua Kelas per Instansi
```sql
SELECT * FROM kelas WHERE instansi_id = 1 ORDER BY nama;
```

> **Catatan:** Bisa juga tambah/hapus kelas langsung dari halaman **Manajemen** di UI (khusus guru).

---

## 📖 Manajemen Mata Pelajaran

### Tambah Mapel Baru (via SQL)
```sql
INSERT INTO mapel (nama, instansi_id)
VALUES ('Akuntansi', 1);
```

### Hapus Mapel
```sql
DELETE FROM mapel WHERE id = ID_MAPEL AND instansi_id = 1;
```

### Lihat Semua Mapel per Instansi
```sql
SELECT * FROM mapel WHERE instansi_id = 1 ORDER BY nama;
```

> **Catatan:** Bisa juga tambah/hapus mapel langsung dari halaman **Manajemen** di UI (khusus guru).

---

## 📱 Manajemen WhatsApp Bot

### Setup Awal Fonnte
1. Login ke [fonnte.com](https://fonnte.com)
2. Klik device → copy **Token**
3. Simpan token di node **HTTP Request** workflow `KIRIM WA` di n8n

### Cara Dapat Group ID Kelas
1. Masukkan nomor bot ke grup WA kelas
2. Kirim pesan test dari dashboard Fonnte → **Send Message**
3. Buka **Logs** di Fonnte → lihat kolom **target** → format: `628xxx@g.us`

### Tambah/Update Group ID Kelas
```sql
-- Update group ID yang sudah ada
UPDATE wa_groups
SET group_id = '628xxx@g.us'
WHERE kelas = 'XI-RPL' AND instansi_id = 1;

-- Tambah kelas baru ke wa_groups
INSERT INTO wa_groups (kelas, group_id, instansi_id, keterangan)
VALUES ('X-AKL', '628xxx@g.us', 1, 'Grup WA X AKL');
```

### Lihat Semua Grup WA
```sql
SELECT * FROM wa_groups ORDER BY instansi_id, kelas;
```

### Cek Riwayat Pengiriman WA
```sql
SELECT * FROM wa_logs ORDER BY sent_at DESC LIMIT 20;
```

### Ganti Token Fonnte
Buka n8n → workflow **KIRIM WA** → node **HTTP Request** → ubah nilai header `Authorization` dengan token baru.

### Nomor WA Kena Restrict/Ban
1. Login Fonnte → disconnect device lama
2. Scan ulang QR dengan nomor baru
3. Update nomor di semua grup WA kelas
4. Tidak perlu ubah apapun di n8n atau database

---

## 🔄 Workflow n8n

**URL n8n:** https://n8n.muktilabs.my.id  
**Semua workflow harus berstatus Published/Active**

| Workflow | Endpoint | Method |
|---|---|---|
| LOGIN | `/webhook/login` | POST |
| REGISTER SISWA | `/webhook/register-siswa` | POST |
| GET INSTANSI | `/webhook/get-instansi` | GET |
| GET USERS | `/webhook/get-users` | GET |
| GET KELAS | `/webhook/get-kelas` | GET |
| GET MAPEL | `/webhook/get-mapel` | GET |
| ADD KELAS | `/webhook/add-kelas` | POST |
| ADD MAPEL | `/webhook/add-mapel` | POST |
| DELETE KELAS | `/webhook/delete-kelas` | POST |
| DELETE MAPEL | `/webhook/delete-mapel` | POST |
| CREATE PR | `/webhook/create-pr` | POST |
| GET PR | `/webhook/get-pr` | GET |
| UPDATE PR | `/webhook/update-pr` | POST |
| DELETE PR | `/webhook/delete-pr` | POST |
| KIRIM WA | `/webhook/kirim-wa` | POST |
| REMINDER HARIAN | Cron jam 07:00 | Auto |

### Jika Ada Workflow yang Mati
1. Buka n8n → halaman Workflows
2. Cari workflow yang statusnya bukan **Published**
3. Toggle **Active** → ON

---

## 🖥️ Deployment & Server

### Cek Status Docker n8n
```bash
docker ps
docker logs n8n
```

### Restart n8n
```bash
cd ~/n8n_data
docker compose down && docker compose up -d
```

### Cek Status PostgreSQL
```bash
sudo systemctl status postgresql
```

### Restart PostgreSQL
```bash
sudo systemctl restart postgresql
```

### Backup Database
```bash
sudo -u postgres pg_dump pr_sekolah > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
sudo -u postgres psql pr_sekolah < backup_YYYYMMDD.sql
```

---

## 🌐 Environment & Konfigurasi

| Item | Value |
|---|---|
| Domain n8n | https://n8n.muktilabs.my.id |
| PostgreSQL DB | pr_sekolah |
| PostgreSQL User | pr_user |
| n8n Container | Docker (port 5678) |
| WA Gateway | Fonnte (fonnte.com) |
| Cron Reminder | Setiap hari jam 07:00 |

### Credential di n8n
- **PostgreSQL PR Sekolah** → koneksi ke database
- **Fonnte Token** → Header Auth untuk kirim WA

---

## 🚀 Pengembangan Selanjutnya

### Fitur yang Belum Aktif
- [ ] `wa_status` di response CREATE PR (saat ini masih `"pending"` dari n8n, sudah ditangani di frontend)
- [ ] Endpoint `resend-wa` untuk kirim ulang notifikasi dari UI
- [ ] Manajemen submissions (pengumpulan tugas siswa)
- [ ] Dashboard admin multi-instansi
- [ ] Notifikasi email SMTP sebagai backup WA

### Menambah Instansi Sekolah Baru
1. Insert ke tabel `instansi`
2. Insert guru pertama ke tabel `users`
3. Insert kelas ke tabel `kelas`
4. Insert mapel ke tabel `mapel`
5. Insert group WA ke tabel `wa_groups`
6. Daftarkan nomor bot ke semua grup WA kelas baru

### Menambah Role Admin
```sql
INSERT INTO users (nama, role, kelas, instansi_id, kode_unik)
VALUES ('Super Admin', 'admin', NULL, 1, 'admin_kode_rahasia');
```
> Perlu update frontend untuk handle role `admin` jika diperlukan.

---

## 🔧 Troubleshooting

| Problem | Solusi |
|---|---|
| WA tidak terkirim | Cek token Fonnte masih valid, cek group_id di wa_groups |
| 500 error di endpoint | Buka n8n → Executions → cek node yang merah |
| Workflow tidak jalan | Pastikan status Published/Active di n8n |
| Data tidak muncul di frontend | Cek BASE_URL di api.js sudah `/webhook` bukan `/webhook-test` |
| Login gagal | Cek kode_unik di tabel users sudah benar |
| PostgreSQL tidak bisa diakses | Cek pg_hba.conf sudah ada range IP Docker |
| n8n tidak bisa konek DB | Cek credential PostgreSQL di n8n, test connection |

---

*README ini dibuat berdasarkan setup sistem PR Sekolah di VM Ubuntu 22.04 dengan n8n Docker + PostgreSQL native.*
