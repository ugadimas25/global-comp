# EmailJS Setup Guide untuk Global Climate Solution

## 📧 Cara Setup EmailJS untuk Notifikasi Email

### 1. Buat Akun EmailJS
1. Kunjungi https://www.emailjs.com/
2. Daftar dengan email ugadimas@gmail.com
3. Verifikasi email Anda

### 2. Setup Email Service
1. Di dashboard EmailJS, klik **"Email Services"**
2. Klik **"Add New Service"**
3. Pilih **"Gmail"** 
4. Ikuti instruksi untuk menghubungkan Gmail Anda
5. Catat **Service ID** (contoh: service_gcs2025)

### 3. Buat Email Template
1. Klik **"Email Templates"**
2. Klik **"Create New Template"**
3. Gunakan template ini:

**Subject:** 🎉 New Subscription - {{plan_type}} Plan

**Content:**
```
Halo Admin Global Climate Solution!

Ada subscription baru:

👤 User: {{user_name}}
📧 Email: {{user_email}}
💰 Plan: {{plan_type}} ({{plan_price}})
🕐 Waktu: {{timestamp}}

💬 Pesan: {{message}}

---
Global Climate Solution Notification System
```

4. Catat **Template ID** (contoh: template_subscription)

### 4. Dapatkan User ID
1. Klik **"Account"** di menu
2. Salin **User ID** Anda

### 5. Update Konfigurasi
Ganti nilai di file `js/main.js`:

```javascript
const EMAILJS_CONFIG = {
  serviceID: 'service_xxxxx',      // Ganti dengan Service ID Anda
  templateID: 'template_xxxxx',    // Ganti dengan Template ID Anda  
  userID: 'user_xxxxx',           // Ganti dengan User ID Anda
  adminEmail: 'ugadimas@gmail.com'
};
```

### 6. Test Notification
1. Buka website Global Climate Solution
2. Klik Subscribe
3. Pilih Pro atau Ultra plan
4. Cek email ugadimas@gmail.com

## 🔒 Keamanan
- EmailJS menggunakan HTTPS untuk semua komunikasi
- User ID publik aman untuk frontend
- Rate limiting otomatis untuk mencegah spam

## 📋 Template Variables
- `{{plan_type}}` - Jenis plan (PRO/ULTRA)
- `{{user_name}}` - Nama user dari localStorage
- `{{user_email}}` - Email user (default: "Not provided")
- `{{timestamp}}` - Waktu subscription (format Indonesia)
- `{{plan_price}}` - Harga plan
- `{{message}}` - Pesan deskripsi

## 🚀 Features
✅ Email notifikasi otomatis untuk Pro & Ultra plans
✅ Tidak ada notifikasi untuk Basic plan (gratis)
✅ Informasi user dari session
✅ Timestamp Indonesia
✅ Fallback jika EmailJS gagal load
✅ Konfirmasi visual ke user bahwa admin sudah diberitahu
