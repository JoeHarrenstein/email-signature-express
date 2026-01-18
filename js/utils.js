/**
 * Utils Module
 * Clipboard, toast notifications, and general utilities
 */

const Utils = {
  /**
   * Copy HTML to clipboard for pasting into email clients
   * @param {string} html - HTML content to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(html) {
    try {
      // Create a temporary container with the HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Select the content
      const range = document.createRange();
      range.selectNodeContents(container);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Try modern clipboard API first
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          const blob = new Blob([html], { type: 'text/html' });
          const clipboardItem = new ClipboardItem({
            'text/html': blob,
            'text/plain': new Blob([container.textContent], { type: 'text/plain' })
          });
          await navigator.clipboard.write([clipboardItem]);
          document.body.removeChild(container);
          return true;
        } catch (clipError) {
          // Fall through to execCommand
        }
      }

      // Fallback to execCommand
      const success = document.execCommand('copy');

      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(container);

      return success;
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type ('success', 'error')
   * @param {number} duration - Duration in ms (default: 3000)
   */
  showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (!toast || !toastMessage) return;

    // Update message and type
    toastMessage.textContent = message;
    toast.className = 'toast ' + type;

    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Hide after duration
    setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  },

  /**
   * Debounce function for input handling
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Get form data as object
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} Form data
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  },

  /**
   * Escape HTML entities
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // ===========================================
  // LocalStorage Utilities
  // ===========================================

  /**
   * Default design preferences
   * Colors chosen for dark mode compatibility in email clients
   */
  designDefaults: {
    logoPosition: 'left',
    logoSize: 'medium',
    nameColor: '#2c3e50',
    titleColor: '#555555',
    linkColor: '#2980b9',
    separatorColor: '#555555',
    iconColor: '#2980b9',
    separatorStyle: 'pipe',
    logoUrl: '',
    logoData: '',
    addBackground: false,
    backgroundColor: '#ffffff',
    fontFamily: 'arial'
  },

  /**
   * Save a design preference to localStorage
   * @param {string} key - Preference key (without prefix)
   * @param {string} value - Value to save
   */
  savePref(key, value) {
    try {
      localStorage.setItem(`sig_${key}`, value);
    } catch (e) {
      console.warn('Could not save preference:', e);
    }
  },

  /**
   * Load a design preference from localStorage
   * @param {string} key - Preference key (without prefix)
   * @param {string} defaultValue - Default value if not found
   * @returns {string} Saved value or default
   */
  loadPref(key, defaultValue = '') {
    try {
      const value = localStorage.getItem(`sig_${key}`);
      return value !== null ? value : defaultValue;
    } catch (e) {
      console.warn('Could not load preference:', e);
      return defaultValue;
    }
  },

  /**
   * Load all design preferences
   * @returns {Object} Design preferences object
   */
  loadAllPrefs() {
    const prefs = {};
    for (const [key, defaultValue] of Object.entries(this.designDefaults)) {
      prefs[key] = this.loadPref(key, defaultValue);
    }
    return prefs;
  },

  /**
   * Save all design preferences
   * @param {Object} prefs - Preferences object
   */
  saveAllPrefs(prefs) {
    for (const [key, value] of Object.entries(prefs)) {
      if (key in this.designDefaults) {
        this.savePref(key, value);
      }
    }
  },

  /**
   * Reset design preferences to defaults
   */
  resetPrefs() {
    for (const key of Object.keys(this.designDefaults)) {
      try {
        localStorage.removeItem(`sig_${key}`);
      } catch (e) {
        console.warn('Could not remove preference:', e);
      }
    }
  },

  /**
   * Convert file to base64 data URI
   * @param {File} file - File to convert
   * @returns {Promise<string>} Base64 data URI
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
