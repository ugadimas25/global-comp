# 🚀 QUICK SETUP - Supabase Configuration

## 📋 **Yang Perlu Anda Lakukan:**

### **1. 🔑 Get Supabase Credentials**

Di Supabase dashboard **"intesa-db"** → **Settings** → **API**:

**Copy nilai berikut:**
- **Project URL:** `https://xxxxxxxxx.supabase.co`
- **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **2. 📝 Update 4 Files Berikut:**

#### **File 1: `js/main.js`** (lines 4-5)
```javascript
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';        // 👈 GANTI
const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';  // 👈 GANTI
```

#### **File 2: `login.html`** (lines 520-521)
```javascript
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';        // 👈 GANTI
const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';  // 👈 GANTI
```

#### **File 3: `signup.html`** (lines 134-135)
```javascript
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';        // 👈 GANTI
const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';  // 👈 GANTI
```

#### **File 4: `admin.html`** (lines 398-399)
```javascript
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';        // 👈 GANTI
const SUPABASE_ANON_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';  // 👈 GANTI
```

### **3. 🧪 Test Complete System:**

#### **A. Test Sign Up:**
1. Buka `signup.html`
2. Register user baru
3. Check Supabase → users table

#### **B. Test Login:**
1. Login dengan user baru
2. Check Supabase → user_sessions table

#### **C. Test Subscription:**
1. Login → Subscribe → Choose Pro/Ultra
2. Check Supabase → subscriptions table
3. Check email → ugadimas@gmail.com
4. Check Supabase → email_logs table

#### **D. Test Admin Dashboard:**
1. Buka `admin.html`
2. View real-time statistics

### **4. 🚀 Deploy to Production:**

```bash
git add .
git commit -m "🗄️ Database Integration Complete"
git push origin main
```

---

## 🎯 **Ready untuk Production!**

✅ **Database Schema** - Complete  
✅ **File Structure** - Ready  
⏳ **Paste Credentials** - Your turn!  
⏳ **Testing** - After credentials  
⏳ **Deploy** - Final step  

**Just paste your Supabase URL & Key, then test! 🚀**
