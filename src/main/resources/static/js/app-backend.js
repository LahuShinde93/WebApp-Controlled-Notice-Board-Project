/* ============================================
   SMART NOTICE BOARD — Backend Integration
   ============================================ */

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

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

// ─── API Helper Functions ───
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    showToast(error.message || 'An error occurred', 'error');
    throw error;
  }
}

// ─── Custom Confirm Dialog ───
function showConfirmDialog({ title, message, confirmText, cancelText, type, onConfirm }) {
  const existing = document.querySelector('.confirm-overlay');
  if (existing) existing.remove();

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
  requestAnimationFrame(() => overlay.classList.add('active'));

  document.getElementById('confirmCancelBtn').addEventListener('click', () => closeConfirmDialog());
  document.getElementById('confirmSureBtn').addEventListener('click', () => {
    closeConfirmDialog();
    if (typeof onConfirm === 'function') onConfirm();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeConfirmDialog();
  });

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

// ─── Sidebar Toggle ───
function initSidebar() {
  const toggle = document.querySelector('.menu-toggle');
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

function setActiveSidebarLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
}

// ============================================
//   LOGIN PAGE
// ============================================
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    try {
      const response = await apiCall('/auth/login', 'POST', { email, password });
      if (response.status === 'SUCCESS') {
        localStorage.setItem('user', JSON.stringify(response.data));
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'index.html', 1200);
      }
    } catch (error) {
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirm = document.getElementById('regConfirm').value.trim();

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

    try {
      const response = await apiCall('/auth/register', 'POST', { name, email, password });
      if (response.status === 'SUCCESS') {
        showToast('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
      }
    } catch (error) {
      // Error already shown by apiCall
    }
  });
}

// ============================================
//   DASHBOARD PAGE
// ============================================
async function initDashboard() {
  const totalEl = document.getElementById('totalNotices');
  if (!totalEl) return;

  try {
    const response = await apiCall('/dashboard/stats');
    if (response.status === 'SUCCESS') {
      const stats = response.data;
      animateCounter(document.getElementById('totalNotices'), stats.totalNotices);
      animateCounter(document.getElementById('activeNotices'), stats.activeNotices);
      animateCounter(document.getElementById('expiredNotices'), stats.expiredNotices);
      animateCounter(document.getElementById('totalCategories'), stats.totalCategories);
    }
    
    await renderRecentNotices();
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
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

async function renderRecentNotices() {
  const container = document.getElementById('recentNoticesList');
  if (!container) return;

  try {
    const response = await apiCall('/notices');
    if (response.status === 'SUCCESS') {
      const recent = response.data.slice(0, 5);
      container.innerHTML = recent.map(n => `
        <div class="notice-list-item">
          <span class="notice-title">${n.title}</span>
          <span class="badge badge-${n.status.toLowerCase()}">${n.status}</span>
        </div>
      `).join('');
    }
  } catch (error) {
    container.innerHTML = '<p style="color: var(--gray-400); text-align: center;">Failed to load notices</p>';
  }
}

// ============================================
//   CREATE NOTICE PAGE
// ============================================
async function initCreateNotice() {
  const form = document.getElementById('createNoticeForm');
  if (!form) return;

  // Populate category dropdown
  const catSelect = document.getElementById('noticeCategory');
  if (catSelect) {
    try {
      console.log('Loading categories for dropdown...');
      const response = await apiCall('/categories');
      console.log('Categories response:', response);
      
      if (response.status === 'SUCCESS') {
        if (response.data && response.data.length > 0) {
          response.data.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.name;
            opt.textContent = cat.name;
            catSelect.appendChild(opt);
          });
          console.log(`Loaded ${response.data.length} categories`);
        } else {
          console.warn('No categories found. Please create categories first.');
          showToast('No categories found. Please create categories first.', 'info');
        }
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      showToast('Failed to load categories. Please check if backend is running.', 'error');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('noticeTitle').value.trim();
    const description = document.getElementById('noticeDescription').value.trim();
    const category = document.getElementById('noticeCategory').value;
    const priority = document.getElementById('noticePriority').value;
    const status = document.getElementById('noticeStatus').value;
    const expiryDate = document.getElementById('noticeExpiry').value;

    if (!title || !description || !category || !priority || !status) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      const response = await apiCall('/notices', 'POST', {
        title,
        description,
        category,
        priority,
        status,
        expiryDate: expiryDate || null
      });
      
      if (response.status === 'SUCCESS') {
        showToast('Notice created successfully!', 'success');
        form.reset();
      }
    } catch (error) {
      // Error already shown by apiCall
    }
  });

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
async function initManageNotices() {
  const tableBody = document.getElementById('noticesTableBody');
  if (!tableBody) return;

  await renderNoticesTable();

  const searchInput = document.getElementById('searchNotices');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderNoticesTable(term);
    });
  }
}

async function renderNoticesTable(filter = '') {
  const tableBody = document.getElementById('noticesTableBody');
  if (!tableBody) return;

  try {
    const response = await apiCall('/notices');
    if (response.status === 'SUCCESS') {
      let notices = response.data;
      
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
          <td>${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'N/A'}</td>
          <td><span class="badge badge-${n.status.toLowerCase()}">${n.status}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-icon edit" onclick="editNotice('${n.id}')" title="Edit">
                <i class="fas fa-pen"></i>
              </button>
              <button class="btn-icon delete" onclick="deleteNotice('${n.id}')" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:40px;color:var(--error);">
          <i class="fas fa-exclamation-triangle" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
          Failed to load notices
        </td>
      </tr>`;
  }
}

async function deleteNotice(id) {
  try {
    const response = await apiCall(`/notices/${id}`);
    const notice = response.data;
    
    showConfirmDialog({
      title: 'Delete Notice?',
      message: `Are you sure you want to delete <strong>"${notice.title}"</strong>? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await apiCall(`/notices/${id}`, 'DELETE');
          showToast('Notice deleted successfully!', 'success');
          await renderNoticesTable();
        } catch (error) {
          // Error already shown by apiCall
        }
      }
    });
  } catch (error) {
    showToast('Failed to load notice details', 'error');
  }
}

async function editNotice(id) {
  try {
    const response = await apiCall(`/notices/${id}`);
    if (response.status === 'SUCCESS') {
      const notice = response.data;
      
      document.getElementById('editNoticeId').value = notice.id;
      document.getElementById('editNoticeTitle').value = notice.title;
      document.getElementById('editNoticeDescription').value = notice.description;
      document.getElementById('editNoticePriority').value = notice.priority;
      document.getElementById('editNoticeStatus').value = notice.status;

      // Populate category dropdown
      const catSelect = document.getElementById('editNoticeCategory');
      const catResponse = await apiCall('/categories');
      if (catResponse.status === 'SUCCESS') {
        catSelect.innerHTML = '<option value="">Select Category</option>';
        catResponse.data.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat.name;
          opt.textContent = cat.name;
          if (cat.name === notice.category) opt.selected = true;
          catSelect.appendChild(opt);
        });
      }

      document.getElementById('editModal').classList.add('active');
    }
  } catch (error) {
    showToast('Failed to load notice', 'error');
  }
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
}

function initEditModal() {
  const form = document.getElementById('editNoticeForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editNoticeId').value;
    const title = document.getElementById('editNoticeTitle').value.trim();
    const description = document.getElementById('editNoticeDescription').value.trim();
    const category = document.getElementById('editNoticeCategory').value;
    const priority = document.getElementById('editNoticePriority').value;
    const status = document.getElementById('editNoticeStatus').value;

    try {
      const response = await apiCall(`/notices/${id}`, 'PUT', {
        title,
        description,
        category,
        priority,
        status
      });
      
      if (response.status === 'SUCCESS') {
        showToast('Notice updated successfully!', 'success');
        closeEditModal();
        await renderNoticesTable();
      }
    } catch (error) {
      // Error already shown by apiCall
    }
  });
}

// ============================================
//   CATEGORIES PAGE
// ============================================
async function initCategories() {
  await renderCategories();

  const addForm = document.getElementById('addCategoryForm');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('newCategoryName');
      const name = nameInput.value.trim();
      
      if (!name) {
        showToast('Category name cannot be empty.', 'error');
        return;
      }

      try {
        const response = await apiCall('/categories', 'POST', {
          name,
          icon: 'fas fa-folder'
        });
        
        if (response.status === 'SUCCESS') {
          showToast('Category added successfully!', 'success');
          nameInput.value = '';
          await renderCategories();
        }
      } catch (error) {
        // Error already shown by apiCall
      }
    });
  }
}

async function renderCategories() {
  const container = document.getElementById('categoryList');
  if (!container) return;

  try {
    const response = await apiCall('/categories');
    if (response.status === 'SUCCESS') {
      const categories = response.data;
      
      if (categories.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No categories yet</h3>
            <p>Add a category to get started.</p>
          </div>`;
        return;
      }

      container.innerHTML = categories.map((cat, i) => `
        <div class="category-item fade-in fade-in-delay-${(i % 4) + 1}">
          <div class="cat-info">
            <div class="cat-icon"><i class="${cat.icon}"></i></div>
            <div>
              <div class="cat-name">${cat.name}</div>
              <div class="cat-count">${cat.count} notice${cat.count !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div class="category-actions">
            <button class="btn-icon edit" onclick="editCategory('${cat.id}')" title="Edit">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn-icon delete" onclick="deleteCategory('${cat.id}')" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    container.innerHTML = '<p style="color: var(--error); text-align: center;">Failed to load categories</p>';
  }
}

async function deleteCategory(id) {
  try {
    const response = await apiCall(`/categories/${id}`);
    const cat = response.data;
    
    showConfirmDialog({
      title: 'Delete Category?',
      message: `Are you sure you want to delete the category <strong>"${cat.name}"</strong>? Notices in this category will not be deleted.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          await apiCall(`/categories/${id}`, 'DELETE');
          showToast('Category deleted!', 'success');
          await renderCategories();
        } catch (error) {
          // Error already shown by apiCall
        }
      }
    });
  } catch (error) {
    showToast('Failed to load category', 'error');
  }
}

async function editCategory(id) {
  try {
    const response = await apiCall(`/categories/${id}`);
    const cat = response.data;
    const newName = prompt('Edit category name:', cat.name);
    
    if (newName && newName.trim()) {
      await apiCall(`/categories/${id}`, 'PUT', {
        name: newName.trim(),
        icon: cat.icon
      });
      showToast('Category updated!', 'success');
      await renderCategories();
    }
  } catch (error) {
    // Error already shown by apiCall
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
      localStorage.removeItem('user');
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
