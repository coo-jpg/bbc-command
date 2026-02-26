# BBCSS Ops Portal
### Black Belt Commandos Security Systems Pvt Ltd

A full-featured security operations management portal built with pure HTML/CSS/JavaScript + Supabase backend.

---

## 📁 File Structure

```
bbcss-ops/
├── index.html           ← Login page
├── dashboard.html       ← Page 1: Dashboard
├── guards.html          ← Page 2: Guard Profiles
├── units.html           ← Page 3: Unit Profiles
├── admin.html           ← Page 4: Admin Controls
├── tasks-overdue.html   ← Overdue Task Log
├── css/
│   └── style.css        ← All styles (dark blue + neon green)
├── js/
│   └── config.js        ← Supabase config + shared utilities
└── assets/
    └── logo.png         ← ⚠ ADD YOUR LOGO HERE
```

---

## 🚀 Deployment Steps (GitHub Pages)

### Step 1 – Add your logo
- Copy your `3D_Logo_Transparent.png` file into the `assets/` folder
- Rename it to `logo.png`

### Step 2 – Create GitHub Repository
1. Go to https://github.com/new
2. Name it `bbcss-ops` (or any name you prefer)
3. Set it to **Private** (recommended for security)
4. Click **Create repository**

### Step 3 – Push files
Open terminal/command prompt in this folder and run:
```bash
git init
git add .
git commit -m "Initial BBCSS Ops deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bbcss-ops.git
git push -u origin main
```

### Step 4 – Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under "Source" select **Deploy from branch**
4. Select branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Wait ~2 minutes, then your site is live at:
   `https://YOUR_USERNAME.github.io/bbcss-ops/`

---

## 👤 First Time Setup – Create Admin Account

After deploying, you need to create the first admin user via Supabase:

1. Go to https://supabase.com → Your project → **Authentication** → **Users**
2. Click **Add user** → Enter email + password for your admin
3. Then go to **Table Editor** → `app_users` table → **Insert row**:
   - `email`: same email as above
   - `full_name`: Admin's full name
   - `role_id`: Look up the `user_roles` table, copy the `id` of the `superadmin` role
   - `is_active`: `true`

Now log in at your deployed URL.

---

## 🎭 Role Permissions

| Role | Access |
|------|--------|
| **superadmin** | Full access including user management |
| **admin** | Full access + create/manage users |
| **manager** | Edit guards, units, tasks, incidents — no user management |
| **viewer** | Read-only, custom permissions per account |

---

## 📄 Pages Overview

### Dashboard (`dashboard.html`)
- Live on-shift snapshot for today
- Open incidents snapshot with severity
- Task tracker with overdue highlighting + completion remarks
- Training image carousel with unit banners
- All managers can add shifts, incidents, tasks

### Guard Profiles (`guards.html`)
- Search by Guard ID, name, unit
- Stat tiles: total active, attrition this month, resigned, absconding, star performers
- Guard cards with photo, status, alerts for missing documents
- Full profile modal: Personal, Employment, Documents, HR tabs
- Manager actions: edit, star performer, salary hold, penalty, termination recommendation, status change
- Star performers banner at top

### Unit Profiles (`units.html`)
- All unit cards with contact info, strength
- Unit detail: Overview, Guards, Incidents, Ops & Shortages, SOPs, Mgmt Recs tabs
- Shortage logging by rank + reason
- Reserves list management
- SOP upload and view
- Management recommendations

### Admin Controls (`admin.html`)
- Admin/Superadmin only
- User account management (activate/deactivate, edit roles)
- Create viewer accounts with granular permission toggles
- Role & permissions overview

### Overdue Tasks Log (`tasks-overdue.html`)
- Currently overdue tasks table
- Historical log of all tasks completed after due date

---

## 🗄️ Supabase Project Details

- **Project**: BBCSS Ops
- **Region**: ap-south-1 (Mumbai)
- **URL**: https://iqccddabidfcrsbdehiq.supabase.co

### Storage Buckets
- `guard-photos` – Guard passport photos
- `guard-docs` – All guard documents (Aadhaar, resignation letters, etc.)
- `training-images` – Training session photos
- `unit-sops` – Unit SOP documents

---

## 🔒 Security Notes

1. The `anon` key in `config.js` is safe to expose – it's a public key with Row Level Security (RLS) enforced
2. All sensitive operations require authentication
3. Manager/Admin role checks are enforced both in UI and via RLS policies
4. Keep your GitHub repo **private** to protect configuration details
5. Regularly rotate your Supabase keys from the Supabase dashboard

---

## 📞 Support

For technical issues, check:
- Supabase dashboard logs: https://supabase.com/dashboard/project/iqccddabidfcrsbdehiq/logs/edge-logs
- Browser console (F12) for JS errors
