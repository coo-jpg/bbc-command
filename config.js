// BBCSS Ops - Supabase Config & Shared Utilities
const SUPABASE_URL = 'https://iqccddabidfcrsbdehiq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxY2NkZGFiaWRmY3JzYmRlaGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODQyMDQsImV4cCI6MjA4NzY2MDIwNH0.tKb-l9TnlSDVsG7zHUJTdd5kt5vWCYKtvQYwVjz0xos';

const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- AUTH HELPERS ----
const Auth = {
  async getSession() {
    const { data } = await _supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    const session = await this.getSession();
    if (!session) return null;
    const { data } = await _supabase
      .from('app_users')
      .select('*, user_roles(role_name, permissions)')
      .eq('email', session.user.email)
      .single();
    return data;
  },

  async requireAuth(redirectTo = 'index.html') {
    const session = await this.getSession();
    if (!session) { window.location.href = redirectTo; return null; }
    const user = await this.getUser();
    if (!user || !user.is_active) { await _supabase.auth.signOut(); window.location.href = redirectTo; return null; }
    return user;
  },

  async requireManager(redirectTo = 'dashboard.html') {
    const user = await this.requireAuth();
    if (!user) return null;
    const role = user.user_roles?.role_name || '';
    if (!['manager', 'admin', 'superadmin'].includes(role.toLowerCase())) {
      Toast.show('Access denied. Manager role required.', 'error');
      setTimeout(() => window.location.href = redirectTo, 1500);
      return null;
    }
    return user;
  },

  isManager(user) {
    const role = user?.user_roles?.role_name?.toLowerCase() || '';
    return ['manager', 'admin', 'superadmin'].includes(role);
  },

  isAdmin(user) {
    const role = user?.user_roles?.role_name?.toLowerCase() || '';
    return ['admin', 'superadmin'].includes(role);
  },

  async logout() {
    await _supabase.auth.signOut();
    window.location.href = 'index.html';
  }
};

// ---- TOAST ----
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'success', duration = 3500) {
    this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
    this.container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, duration);
  }
};

// ---- MODAL HELPERS ----
const Modal = {
  create(id, title, bodyHtml, footerHtml = '', large = false) {
    let el = document.getElementById(id);
    if (el) el.remove();
    el = document.createElement('div');
    el.id = id;
    el.className = 'modal-overlay hidden';
    el.innerHTML = `
      <div class="modal ${large ? 'modal-lg' : ''}">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="modal-close" onclick="Modal.close('${id}')">✕</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>`;
    el.addEventListener('click', e => { if (e.target === el) Modal.close(id); });
    document.body.appendChild(el);
    return el;
  },
  open(id) { document.getElementById(id)?.classList.remove('hidden'); },
  close(id) { document.getElementById(id)?.classList.add('hidden'); },
  toggle(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
  }
};

// ---- DATE HELPERS ----
const DateUtil = {
  format(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },
  isOverdue(dueDate) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  },
  daysOverdue(dueDate) {
    if (!dueDate) return 0;
    const diff = new Date(new Date().toDateString()) - new Date(dueDate);
    return Math.floor(diff / 86400000);
  },
  today() {
    return new Date().toISOString().split('T')[0];
  },
  monthYear() {
    return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }
};

// ---- FILE UPLOAD HELPER ----
const FileUpload = {
  async upload(file, bucket, path) {
    const { data, error } = await _supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: url } = _supabase.storage.from(bucket).getPublicUrl(path);
    return url.publicUrl;
  },
  async uploadGuardDoc(file, guardId, docType) {
    const ext = file.name.split('.').pop();
    return await this.upload(file, 'guard-docs', `${guardId}/${docType}.${ext}`);
  },
  async uploadGuardPhoto(file, guardId) {
    const ext = file.name.split('.').pop();
    return await this.upload(file, 'guard-photos', `${guardId}/photo.${ext}`);
  },
  async uploadTrainingImage(file, unitId, name) {
    const ext = file.name.split('.').pop();
    const ts = Date.now();
    return await this.upload(file, 'training-images', `${unitId}/${ts}_${name}.${ext}`);
  },
  async uploadUnitSop(file, unitId, name) {
    const ext = file.name.split('.').pop();
    const ts = Date.now();
    return await this.upload(file, 'unit-sops', `${unitId}/${ts}_${name}.${ext}`);
  }
};

// ---- NAV HIGHLIGHT ----
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('href') === page) el.classList.add('active');
  });
}

// ---- RENDER SIDEBAR ----
function renderSidebar(user) {
  const isManager = Auth.isManager(user);
  const isAdmin = Auth.isAdmin(user);
  const initials = ((user?.full_name || 'U').split(' ').map(w => w[0]).join('').toUpperCase()).slice(0,2);
  return `
    <div class="sidebar-logo">
      <img src="assets/logo.png" alt="BBCSS" onerror="this.style.display='none'">
      <div class="sidebar-logo-text">
        <div class="brand">BBCSS Ops</div>
        <div class="sub">Black Belt Commandos</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Operations</div>
      <a href="dashboard.html" class="nav-item"><span class="nav-icon">📊</span> Dashboard</a>
      <a href="guards.html" class="nav-item"><span class="nav-icon">👮</span> Guard Profiles</a>
      <a href="units.html" class="nav-item"><span class="nav-icon">🏢</span> Unit Profiles</a>
      ${isAdmin ? `<div class="nav-section-label">Admin</div><a href="admin.html" class="nav-item"><span class="nav-icon">⚙️</span> Admin Controls</a>` : ''}
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">${initials}</div>
        <div>
          <div class="user-name">${user?.full_name || 'User'}</div>
          <div class="user-role">${user?.user_roles?.role_name || 'Viewer'}</div>
        </div>
      </div>
      <button class="btn-logout" onclick="Auth.logout()">⏻ Sign Out</button>
    </div>`;
}

// ---- CLOCK ----
function startClock(elId) {
  function tick() {
    const el = document.getElementById(elId);
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}
