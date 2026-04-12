/* ============================================
   SMART NOTICE BOARD — Main JavaScript
   ============================================ */

// ─── Sample Data Store (simulates backend) ───
const DataStore = {
  notices: [
    { id: 1, title: 'Exam Schedule Update',       category: 'Academic',      priority: 'High',   status: 'Active',  date: '2026-04-10', description: 'Updated exam schedule for semester 6.' },
    { id: 2, title: 'Holiday Announcement',        category: 'General',       priority: 'Medium', status: 'Expired', date: '2026-03-25', description: 'Campus closed on March 30 for Holi.' },
    { id: 3, title: 'Event Reminder',              category: 'Events',        priority: 'Low',    status: 'Active',  date: '2026-04-08', description: 'Annual tech fest on April 15.' },
    { id: 4, title: 'Library Timings Changed',     category: 'Administrative',priority: 'Medium', status: 'Active',  date: '2026-04-05', description: 'Library open from 8 AM to 10 PM starting April.' },
    { id: 5, title: 'Sports Day Registration',     category: 'Events',        priority: 'High',   status: 'Active',  date: '2026-04-12', description: 'Register before April 20 for sports day.' },
    { id: 6, title: 'Fee Payment Deadline',        category: 'Administrative',priority: 'High',   status: 'Active',  date: '2026-04-01', description: 'Last date for fee payment is April 30.' },
    { id: 7, title: 'Workshop on AI & ML',         category: 'Academic',      priority: 'Medium', status: 'Active',  date: '2026-04-09', description: '2-day workshop starting April 18.' },
    { id: 8, title: 'Blood Donation Camp',         category: 'General',       priority: 'Low',    status: 'Expired', date: '2026-03-15', description: 'Blood donation camp was held on March 20.' },
  ],

  categories: [
    { id: 1, name: 'Academic',       icon: 'fas fa-graduation-cap', count: 2 },
    { id: 2, name: 'General',        icon: 'fas fa-bullhorn',       count: 2 },
    { id: 3, name: 'Events',         icon: 'fas fa-calendar-alt',   count: 2 },
    { id: 4, name: 'Administrative', icon: 'fas fa-building',       count: 2 },
    { id: 5, name: 'Urgent',         icon: 'fas fa-exclamation-triangle', count: 0 },
  ],

  nextNoticeId: 9,
  nextCategoryId: 6,
};

// ─── Utility Helpers ───
function getActiveNotices()  { return DataStore.notices.filter(n => n.status === 'Active');  }
function getExpiredNotices()  { return DataStore.notices.filter(n => n.status === 'Expired'); }

// ─── Toast Notification ───
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
  toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Custom Confirm Dialog ───
function showConfirmDialog({ title, message, confirmText, cancelText, type, onConfirm }) {
  // Remove any existing confirm dialog
  const existing = document.querySelector('.confirm-overlay');
  if (existing) existing.remove();

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  overlay.id = 'confirmDialog';

  const iconClass = type === 'danger' ? 'fas fa-trash-alt' : 'fas fa-exclamation-triangle';
  const iconType = type || 'danger';
  const btnClass = type === 'warning' ? 'btn btn-primary' : 'btn btn-confirm-delete';
  const btnIcon = type === 'warning' ? 'fas fa-sign-out-alt' : 'fas fa-trash-alt';

  overlay.innerHTML = `
    <div class="confirm-dialog">
      <div class="confirm-icon ${iconType}">
        <i class="${iconClass}"></i>
      </div>
      <h3 class="confirm-title">${title || 'Are you sure?'}</h3>
      <p class="confirm-message">${message || 'This action cannot be undone.'}</p>
      <div class="confirm-actions">
        <button class="btn btn-cancel" id="confirmCancelBtn">
          <i class="fas fa-times"></i> ${cancelText || 'Cancel'}
        </button>
        <button class="${btnClass}" id="confirmSureBtn">
          <i class="${btnIcon}"></i> ${confirmText || 'Delete'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Cancel button
  document.getElementById('confirmCancelBtn').addEventListener('click', () => {
    closeConfirmDialog();
  });

  // Confirm button
  document.getElementById('confirmSureBtn').addEventListener('click', () => {
    closeConfirmDialog();
    if (typeof onConfirm === 'function') onConfirm();
  });

  // Click outside to cancel
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeConfirmDialog();
  });

  // Escape key to cancel
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeConfirmDialog();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function closeConfirmDialog() {
  const overlay = document.querySelector('.confirm-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

// ─── Sidebar Toggle (Mobile) ───
function initSidebar() {
  const toggle  = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// ─── Mark Active Sidebar Link ───
function setActiveSidebarLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    }
  });
}

// ============================================
//   LOGIN PAGE
// ============================================
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Simple validation
    if (email === 'admin@noticeboard.com' && password === 'admin123') {
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = 'index.html', 1200);
    } else {
      showToast('Invalid email or password.', 'error');
    }
  });
}

// ============================================
//   REGISTRATION PAGE
// ============================================
function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirm  = document.getElementById('regConfirm').value.trim();

    if (!name || !email || !password || !confirm) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    showToast('Registration successful! Redirecting to login...', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);
  });
}

// ============================================
//   DASHBOARD PAGE
// ============================================
function initDashboard() {
  const totalEl   = document.getElementById('totalNotices');
  const activeEl  = document.getElementById('activeNotices');
  const expiredEl = document.getElementById('expiredNotices');
  const catEl     = document.getElementById('totalCategories');

  if (!totalEl) return; // not on dashboard page

  // Animate counters
  animateCounter(totalEl, DataStore.notices.length);
  animateCounter(activeEl, getActiveNotices().length);
  animateCounter(expiredEl, getExpiredNotices().length);
  animateCounter(catEl, DataStore.categories.length);

  // Render recent notices
  renderRecentNotices();
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 40);
}

function renderRecentNotices() {
  const container = document.getElementById('recentNoticesList');
  if (!container) return;

  const recent = DataStore.notices.slice(0, 5);
  container.innerHTML = recent.map(n => `
    <div class="notice-list-item">
      <span class="notice-title">${n.title}</span>
      <span class="badge badge-${n.status.toLowerCase()}">${n.status}</span>
    </div>
  `).join('');
}

// ============================================
//   CREATE NOTICE PAGE
// ============================================
function initCreateNotice() {
  const form = document.getElementById('createNoticeForm');
  if (!form) return;

  // Populate category dropdown
  const catSelect = document.getElementById('noticeCategory');
  if (catSelect) {
    DataStore.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = cat.name;
      catSelect.appendChild(opt);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title       = document.getElementById('noticeTitle').value.trim();
    const description = document.getElementById('noticeDescription').value.trim();
    const category    = document.getElementById('noticeCategory').value;
    const priority    = document.getElementById('noticePriority').value;
    const status      = document.getElementById('noticeStatus').value;

    if (!title || !description || !category || !priority || !status) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const newNotice = {
      id: DataStore.nextNoticeId++,
      title,
      description,
      category,
      priority,
      status,
      date: new Date().toISOString().split('T')[0],
    };

    DataStore.notices.unshift(newNotice);

    // Update category count
    const cat = DataStore.categories.find(c => c.name === category);
    if (cat) cat.count++;

    showToast('Notice created successfully!', 'success');
    form.reset();
  });

  // Reset button
  const resetBtn = document.getElementById('resetFormBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      showToast('Form has been reset.', 'info');
    });
  }
}

// ============================================
//   MANAGE NOTICES PAGE
// ============================================
function initManageNotices() {
  const tableBody = document.getElementById('noticesTableBody');
  if (!tableBody) return;

  renderNoticesTable();

  // Search
  const searchInput = document.getElementById('searchNotices');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderNoticesTable(term);
    });
  }
}

function renderNoticesTable(filter = '') {
  const tableBody = document.getElementById('noticesTableBody');
  if (!tableBody) return;

  let notices = DataStore.notices;
  if (filter) {
    notices = notices.filter(n =>
      n.title.toLowerCase().includes(filter) ||
      n.category.toLowerCase().includes(filter) ||
      n.status.toLowerCase().includes(filter)
    );
  }

  if (notices.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:40px;color:var(--gray-400);">
          <i class="fas fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
          No notices found
        </td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = notices.map((n, i) => `
    <tr class="fade-in fade-in-delay-${(i % 4) + 1}">
      <td><strong>${n.title}</strong></td>
      <td>${n.category}</td>
      <td><span class="badge badge-${n.priority.toLowerCase()}">${n.priority}</span></td>
      <td>${n.date}</td>
      <td><span class="badge badge-${n.status.toLowerCase()}">${n.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editNotice(${n.id})" title="Edit">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn-icon delete" onclick="deleteNotice(${n.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function deleteNotice(id) {
  const notice = DataStore.notices.find(n => n.id === id);
  if (!notice) return;

  showConfirmDialog({
    title: 'Delete Notice?',
    message: `Are you sure you want to delete <strong>"${notice.title}"</strong>? This action cannot be undone.`,
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: () => {
      const idx = DataStore.notices.findIndex(n => n.id === id);
      if (idx !== -1) {
        const removed = DataStore.notices.splice(idx, 1)[0];
        const cat = DataStore.categories.find(c => c.name === removed.category);
        if (cat && cat.count > 0) cat.count--;
        showToast('Notice deleted successfully!', 'success');
        if (typeof applyFilters === 'function') applyFilters(); else renderNoticesTable();
      }
    }
  });
}

function editNotice(id) {
  const notice = DataStore.notices.find(n => n.id === id);
  if (!notice) return;

  // Populate modal
  document.getElementById('editNoticeId').value          = notice.id;
  document.getElementById('editNoticeTitle').value       = notice.title;
  document.getElementById('editNoticeDescription').value = notice.description;
  document.getElementById('editNoticePriority').value    = notice.priority;
  document.getElementById('editNoticeStatus').value      = notice.status;

  // Populate edit category dropdown
  const catSelect = document.getElementById('editNoticeCategory');
  catSelect.innerHTML = '<option value="">Select Category</option>';
  DataStore.categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.name;
    opt.textContent = cat.name;
    if (cat.name === notice.category) opt.selected = true;
    catSelect.appendChild(opt);
  });

  // Show modal
  document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
}

function initEditModal() {
  const form = document.getElementById('editNoticeForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById('editNoticeId').value);
    const notice = DataStore.notices.find(n => n.id === id);
    if (!notice) return;

    notice.title       = document.getElementById('editNoticeTitle').value.trim();
    notice.description = document.getElementById('editNoticeDescription').value.trim();
    notice.category    = document.getElementById('editNoticeCategory').value;
    notice.priority    = document.getElementById('editNoticePriority').value;
    notice.status      = document.getElementById('editNoticeStatus').value;

    showToast('Notice updated successfully!', 'success');
    closeEditModal();
    if (typeof applyFilters === 'function') applyFilters(); else renderNoticesTable();
  });
}

// ============================================
//   CATEGORIES PAGE
// ============================================
function initCategories() {
  renderCategories();

  const addForm = document.getElementById('addCategoryForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('newCategoryName');
      const name = nameInput.value.trim();
      if (!name) {
        showToast('Category name cannot be empty.', 'error');
        return;
      }
      if (DataStore.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        showToast('Category already exists!', 'error');
        return;
      }

      DataStore.categories.push({
        id: DataStore.nextCategoryId++,
        name,
        icon: 'fas fa-folder',
        count: 0,
      });

      showToast('Category added successfully!', 'success');
      nameInput.value = '';
      renderCategories();
    });
  }
}

function renderCategories() {
  const container = document.getElementById('categoryList');
  if (!container) return;

  if (DataStore.categories.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-folder-open"></i>
        <h3>No categories yet</h3>
        <p>Add a category to get started.</p>
      </div>`;
    return;
  }

  container.innerHTML = DataStore.categories.map((cat, i) => `
    <div class="category-item fade-in fade-in-delay-${(i % 4) + 1}">
      <div class="cat-info">
        <div class="cat-icon"><i class="${cat.icon}"></i></div>
        <div>
          <div class="cat-name">${cat.name}</div>
          <div class="cat-count">${cat.count} notice${cat.count !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="category-actions">
        <button class="btn-icon edit" onclick="editCategory(${cat.id})" title="Edit">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn-icon delete" onclick="deleteCategory(${cat.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function deleteCategory(id) {
  const cat = DataStore.categories.find(c => c.id === id);
  if (!cat) return;

  showConfirmDialog({
    title: 'Delete Category?',
    message: `Are you sure you want to delete the category <strong>"${cat.name}"</strong>? Notices in this category will not be deleted.`,
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: () => {
      const idx = DataStore.categories.findIndex(c => c.id === id);
      if (idx !== -1) {
        DataStore.categories.splice(idx, 1);
        showToast('Category deleted!', 'success');
        renderCategories();
      }
    }
  });
}

function editCategory(id) {
  const cat = DataStore.categories.find(c => c.id === id);
  if (!cat) return;
  const newName = prompt('Edit category name:', cat.name);
  if (newName && newName.trim()) {
    cat.name = newName.trim();
    showToast('Category updated!', 'success');
    renderCategories();
  }
}

// ============================================
//   LOGOUT
// ============================================
function logout() {
  showConfirmDialog({
    title: 'Logout?',
    message: 'Are you sure you want to logout from the admin dashboard?',
    confirmText: 'Yes, Logout',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: () => {
      showToast('Logging out...', 'info');
      setTimeout(() => window.location.href = 'login.html', 1000);
    }
  });
}

// ============================================
//   INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  setActiveSidebarLink();
  initLoginPage();
  initRegisterPage();
  initDashboard();
  initCreateNotice();
  initManageNotices();
  initEditModal();
  initCategories();
});
