/**
 * App Module
 * Main application initialization, theme handling, and accessibility
 */

const App = {
  // Theme state
  currentTheme: 'light',

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme BEFORE DOM is fully ready to prevent flash
    this.initThemeEarly();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onReady());
    } else {
      this.onReady();
    }
  },

  /**
   * Initialize theme early to prevent flash of wrong theme
   */
  initThemeEarly() {
    const savedTheme = this.getSavedTheme();

    if (savedTheme === 'dark' || (savedTheme === 'system' && this.prefersDark())) {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.currentTheme = 'dark';
    } else {
      this.currentTheme = 'light';
    }
  },

  /**
   * Called when DOM is ready
   */
  onReady() {
    // Initialize theme toggle
    this.initThemeToggle();

    // Listen for system theme changes
    this.listenForSystemThemeChange();

    // Initialize keyboard navigation for tabs
    this.initTabKeyboardNav();

    // Initialize keyboard navigation for toggle groups
    this.initToggleKeyboardNav();

    // Initialize signature builder
    SignatureBuilder.init();

    // Initialize bulk creator
    BulkCreator.init();

    console.log('Email Signature Generator initialized');
  },

  /**
   * Get saved theme preference from localStorage
   * @returns {string} 'light', 'dark', or 'system'
   */
  getSavedTheme() {
    try {
      return localStorage.getItem('sig_appTheme') || 'system';
    } catch (e) {
      return 'system';
    }
  },

  /**
   * Save theme preference to localStorage
   * @param {string} theme - 'light', 'dark', or 'system'
   */
  saveTheme(theme) {
    try {
      localStorage.setItem('sig_appTheme', theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  },

  /**
   * Check if system prefers dark mode
   * @returns {boolean}
   */
  prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * Initialize theme toggle button
   */
  initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Update button state based on current theme
    this.updateToggleButton();
  },

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    if (this.currentTheme === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  },

  /**
   * Set the theme
   * @param {string} theme - 'light' or 'dark'
   */
  setTheme(theme) {
    this.currentTheme = theme;

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Save preference (save actual theme, not 'system')
    this.saveTheme(theme);

    // Update button state
    this.updateToggleButton();
  },

  /**
   * Update toggle button appearance
   */
  updateToggleButton() {
    const toggleBtn = document.getElementById('theme-toggle');

    if (!toggleBtn) return;

    const isDark = this.currentTheme === 'dark';
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  },

  /**
   * Listen for system theme preference changes
   */
  listenForSystemThemeChange() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Only auto-switch if user hasn't set a manual preference
    const handleChange = (e) => {
      const savedTheme = this.getSavedTheme();

      // If user has set 'system' preference, follow system
      if (savedTheme === 'system') {
        this.setTheme(e.matches ? 'dark' : 'light');
        // Reset to system so it continues to follow
        this.saveTheme('system');
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Older browsers
      mediaQuery.addListener(handleChange);
    }
  },

  /**
   * Initialize keyboard navigation for tab panels (arrow keys)
   */
  initTabKeyboardNav() {
    const tablists = document.querySelectorAll('[role="tablist"]');

    tablists.forEach(tablist => {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      if (tabs.length < 2) return;

      tablist.addEventListener('keydown', (e) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

        const currentIndex = Array.from(tabs).findIndex(tab =>
          tab === document.activeElement
        );

        if (currentIndex === -1) return;

        let nextIndex;

        switch (e.key) {
          case 'ArrowRight':
            nextIndex = (currentIndex + 1) % tabs.length;
            break;
          case 'ArrowLeft':
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = tabs.length - 1;
            break;
        }

        e.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    });
  },

  /**
   * Initialize keyboard navigation for toggle button groups
   */
  initToggleKeyboardNav() {
    const toggleGroups = document.querySelectorAll('.toggle-group[role="radiogroup"]');

    toggleGroups.forEach(group => {
      const buttons = group.querySelectorAll('.toggle-btn');
      if (buttons.length < 2) return;

      group.addEventListener('keydown', (e) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

        const currentIndex = Array.from(buttons).findIndex(btn =>
          btn === document.activeElement
        );

        if (currentIndex === -1) return;

        let nextIndex;
        const isHorizontal = ['ArrowLeft', 'ArrowRight'].includes(e.key);

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % buttons.length;
        } else {
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        }

        e.preventDefault();
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });
  }
};

// Start the app
App.init();
