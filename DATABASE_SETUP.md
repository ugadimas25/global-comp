# 🗄️ Database Setup - Global Climate Solution

## 📋 Overview

Database sistem untuk Global Climate Solution menggunakan **Supabase** dengan 4 tabel utama:
- **users** - User registration & authentication
- **subscriptions** - Subscription tracking dengan email notifications
- **email_logs** - Email notification tracking
- **user_sessions** - Login session management

---

## 🚀 Setup Instructions

### **1. Create Supabase Project**

1. **Go to https://supabase.com**
2. **Click "New Project"**
3. **Organization:** Your personal account
4. **Project Name:** `global-climate-solution`
5. **Database Password:** Strong password (save this!)
6. **Region:** Singapore (closest to Indonesia)
7. **Click "Create new project"**

### **2. Execute Database Schema**

Di **SQL Editor** Supabase, jalankan script berikut:

```sql
-- Users table untuk sign up system
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  company VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE
);

-- Subscriptions table untuk tracking subscription
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'pro', 'ultra')),
  plan_price VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  email_notification_sent BOOLEAN DEFAULT FALSE,
  compliance_type VARCHAR(50),
  metadata JSONB
);

-- Email notifications log
CREATE TABLE email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  user_id UUID REFERENCES users(id),
  email_type VARCHAR(50) NOT NULL,
  email_status VARCHAR(20) DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_response JSONB
);

-- User sessions untuk login tracking
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_token VARCHAR(255) UNIQUE,
  login_time TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX idx_email_logs_subscription_id ON email_logs(subscription_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read access for authentication
CREATE POLICY "Allow public read access for authentication" ON users
    FOR SELECT USING (true);

-- Allow public insert for registration
CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Allow public access to subscriptions (for anonymous subscription tracking)
CREATE POLICY "Allow public access to subscriptions" ON subscriptions
    FOR ALL USING (true);

-- Allow public access to email logs
CREATE POLICY "Allow public access to email logs" ON email_logs
    FOR ALL USING (true);

-- Allow public access to user sessions
CREATE POLICY "Allow public access to user sessions" ON user_sessions
    FOR ALL USING (true);
```

### **3. Get Supabase Credentials**

Di **Settings → API**:
- **Project URL:** `https://your-project.supabase.co`
- **anon/public key:** `eyJ...` (for client-side)

### **4. Update Configuration Files**

#### **Update main.js:**
```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

#### **Update login.html:**
```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

#### **Update signup.html:**
```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

#### **Update admin.html:**
```javascript
// Supabase Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

---

## 📊 Database Features

### **🔐 User Authentication System**
- **Sign Up:** `signup.html` - User registration dengan name, email, company, password
- **Login:** `login.html` - Database authentication + fallback ke hardcoded credentials
- **Session Management:** Auto-logout setelah 24 jam

### **💰 Subscription Tracking**
- **Real-time saving** subscription data ke database
- **Email notification** integration dengan EmailJS
- **Plan tracking:** Basic (gratis), Pro ($25), Ultra ($100)
- **Compliance tracking:** EUDR, Rainforest Alliance, FSC

### **📧 Email Notification System**
- **Automatic logging** semua email notifications
- **Success/failure tracking** 
- **Response tracking** dari EmailJS

### **📈 Admin Dashboard**
- **Real-time statistics:** Users, subscriptions, emails, conversion rate
- **Data tables:** Recent users, subscriptions, email logs
- **Auto-refresh** setiap 30 detik
- **Access:** `admin.html`

---

## 🔄 Data Flow

```
1. User Sign Up → users table
2. User Login → update last_login + create user_sessions
3. User Subscribe → subscriptions table + email_logs table
4. Admin Dashboard → real-time data dari semua tables
```

---

## 📋 Sample Data

### **Test User:**
```sql
INSERT INTO users (name, email, password_hash, company) VALUES 
('Ugadimas Test', 'ugadimas@test.com', 'hashed_password', 'Test Company');
```

### **Test Subscription:**
```sql
INSERT INTO subscriptions (user_id, plan_type, plan_price, compliance_type) VALUES 
('user-uuid', 'pro', '$25.00/month', 'EUDR');
```

---

## 🎯 Testing Checklist

### **✅ Sign Up System:**
1. Buka `signup.html`
2. Isi form registration
3. Check database: user baru masuk ke `users` table
4. Auto-redirect ke `login.html`

### **✅ Login System:**
1. Login dengan user baru
2. Check database: `last_login` updated
3. Session created di `user_sessions` table

### **✅ Subscription System:**
1. Login → Subscribe → Choose Pro/Ultra
2. Check database: new record di `subscriptions` table
3. Check email: notification ke ugadimas@gmail.com
4. Check database: email logged di `email_logs` table

### **✅ Admin Dashboard:**
1. Buka `admin.html`
2. View statistics: users, subscriptions, emails
3. Check tables: recent data displayed
4. Test refresh button

---

## 🚀 Deployment

1. **Update configuration** dengan Supabase credentials
2. **Test locally** semua fitur
3. **Commit & push** ke repository
4. **Deploy** ke Vercel/Netlify/GitHub Pages

---

## 📞 Support

Jika ada masalah:
1. **Check Supabase logs** di dashboard
2. **Check browser console** untuk JavaScript errors
3. **Verify** semua credentials sudah benar
4. **Test** database connection di browser console

**Database Global Climate Solution siap digunakan! 🌍✨**
