/**
 * Signature Builder Module
 * Handles form interactions, logo/design options, and live preview
 */

const SignatureBuilder = {
  form: null,
  previewContent: null,
  previewContainer: null,
  copyBtn: null,
  currentHtml: '',

  // Track loaded company template
  loadedTemplate: null,

  // Design options state (dark mode-safe defaults)
  designOptions: {
    logoPosition: 'left',
    logoSize: 'medium',
    logoUrl: '',
    logoData: '',
    nameColor: '#2c3e50',
    titleColor: '#555555',
    linkColor: '#2980b9',
    separatorColor: '#555555',
    iconColor: '#2980b9',
    iconStyle: 'solid',
    separatorStyle: 'pipe',
    addBackground: false,
    backgroundColor: '#ffffff',
    fontFamily: 'arial'
  },

  /**
   * Initialize the signature builder
   */
  init() {
    this.form = document.getElementById('signature-form');
    this.previewContent = document.getElementById('preview-content');
    this.previewContainer = document.getElementById('preview-container');
    this.copyBtn = document.getElementById('copy-btn');

    if (!this.form || !this.previewContent) {
      console.error('Required elements not found');
      return;
    }

    // Load saved preferences
    this.loadPreferences();

    // Bind all events
    this.bindEvents();
    this.bindLogoEvents();
    this.bindDesignEvents();
    this.initTemplateEvents();

    // Initial preview
    this.updatePreview();
  },

  /**
   * Load saved design preferences from localStorage
   */
  loadPreferences() {
    const saved = Utils.loadAllPrefs();

    // Merge with current state
    this.designOptions = { ...this.designOptions, ...saved };

    // Apply to UI elements
    this.applyPreferencesToUI();
  },

  /**
   * Apply loaded preferences to UI elements
   */
  applyPreferencesToUI() {
    const opts = this.designOptions;

    // Logo URL
    const logoUrlInput = document.getElementById('logo-url');
    if (logoUrlInput && opts.logoUrl) {
      logoUrlInput.value = opts.logoUrl;
    }

    // Logo position buttons
    document.querySelectorAll('[data-position]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.position === opts.logoPosition);
      btn.setAttribute('aria-checked', btn.dataset.position === opts.logoPosition);
    });

    // Logo size buttons
    document.querySelectorAll('[data-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === opts.logoSize);
      btn.setAttribute('aria-checked', btn.dataset.size === opts.logoSize);
    });

    // Color pickers and hex inputs
    const colorMappings = [
      { id: 'name-color', key: 'nameColor' },
      { id: 'title-color', key: 'titleColor' },
      { id: 'link-color', key: 'linkColor' },
      { id: 'separator-color', key: 'separatorColor' },
      { id: 'icon-color', key: 'iconColor' }
    ];

    colorMappings.forEach(({ id, key }) => {
      const picker = document.getElementById(id);
      const hexInput = document.getElementById(`${id}-value`);
      if (picker && opts[key]) {
        picker.value = opts[key];
      }
      if (hexInput && opts[key]) {
        hexInput.value = opts[key].toUpperCase();
        hexInput.classList.remove('invalid');
      }
    });

    // Separator style
    const separatorSelect = document.getElementById('separator-style');
    if (separatorSelect) {
      separatorSelect.value = opts.separatorStyle;
    }

    // Icon style toggle
    const iconStyleBtns = document.querySelectorAll('[data-icon-style]');
    const iconColorOption = document.getElementById('icon-color-option');
    iconStyleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.iconStyle === opts.iconStyle);
      btn.setAttribute('aria-pressed', btn.dataset.iconStyle === opts.iconStyle);
    });
    if (iconColorOption && opts.iconStyle === 'branded') {
      iconColorOption.classList.add('hidden');
    }

    // Font family
    const fontFamilySelect = document.getElementById('font-family');
    if (fontFamilySelect && opts.fontFamily) {
      fontFamilySelect.value = opts.fontFamily;
    }

    // Background option
    const addBackgroundCheckbox = document.getElementById('add-background');
    const backgroundColorWrapper = document.getElementById('background-color-wrapper');
    const backgroundColorPicker = document.getElementById('background-color');
    const backgroundColorInput = document.getElementById('background-color-value');

    if (addBackgroundCheckbox) {
      addBackgroundCheckbox.checked = opts.addBackground === true || opts.addBackground === 'true';
      if (backgroundColorWrapper) {
        backgroundColorWrapper.classList.toggle('hidden', !addBackgroundCheckbox.checked);
      }
    }

    if (backgroundColorPicker) {
      backgroundColorPicker.value = opts.backgroundColor || '#ffffff';
    }

    if (backgroundColorInput) {
      backgroundColorInput.value = (opts.backgroundColor || '#ffffff').toUpperCase();
    }

    // If there's saved logo data, show preview
    if (opts.logoData) {
      this.showLogoPreview(opts.logoData);
      // Switch to upload tab
      this.switchLogoTab('upload');
    }
  },

  /**
   * Bind form event listeners
   */
  bindEvents() {
    // Debounced preview update on input
    const debouncedUpdate = Utils.debounce(() => this.updatePreview(), 150);

    // Input events for live preview
    this.form.addEventListener('input', debouncedUpdate);
    this.form.addEventListener('change', () => this.updatePreview());

    // Phone/fax formatting on blur
    const phoneInput = document.getElementById('phone');
    const faxInput = document.getElementById('fax');

    if (phoneInput) {
      phoneInput.addEventListener('blur', (e) => {
        e.target.value = Formatters.formatPhone(e.target.value);
        this.updatePreview();
      });
    }

    if (faxInput) {
      faxInput.addEventListener('blur', (e) => {
        e.target.value = Formatters.formatPhone(e.target.value);
        this.updatePreview();
      });
    }

    // Mobile formatting on blur
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
      mobileInput.addEventListener('blur', (e) => {
        e.target.value = Formatters.formatPhone(e.target.value);
        this.updatePreview();
      });
    }

    // Website formatting on blur
    const websiteInput = document.getElementById('website');
    if (websiteInput) {
      websiteInput.addEventListener('blur', (e) => {
        const value = e.target.value.trim();
        if (value) {
          e.target.value = Formatters.formatWebsiteDisplay(value);
        }
        this.updatePreview();
      });
    }

    // Clear buttons
    this.initClearButtons();

    // Copy button
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copySignature());
    }

    // Preview background toggle
    this.initPreviewBgToggle();

    // Modal
    this.initModal();

    // Logo info modal
    this.initLogoInfoModal();
  },

  /**
   * Bind logo-related events
   */
  bindLogoEvents() {
    // Logo tabs
    const logoTabs = document.querySelectorAll('[data-logo-tab]');
    logoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchLogoTab(tab.dataset.logoTab);
      });
    });

    // Logo URL input
    const logoUrlInput = document.getElementById('logo-url');
    if (logoUrlInput) {
      logoUrlInput.addEventListener('input', Utils.debounce(() => {
        this.designOptions.logoUrl = logoUrlInput.value.trim();
        this.designOptions.logoData = ''; // Clear uploaded logo
        Utils.savePref('logoUrl', this.designOptions.logoUrl);
        Utils.savePref('logoData', '');
        this.updatePreview();
      }, 300));
    }

    // Logo file upload
    const logoFileInput = document.getElementById('logo-file');
    if (logoFileInput) {
      logoFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const base64 = await Utils.fileToBase64(file);
          this.designOptions.logoData = base64;
          this.designOptions.logoUrl = ''; // Clear URL
          Utils.savePref('logoData', base64);
          Utils.savePref('logoUrl', '');
          this.showLogoPreview(base64);
          this.updatePreview();
        } catch (error) {
          console.error('Failed to convert file:', error);
          Utils.showToast('Failed to upload logo', 'error');
        }
      });
    }

    // Logo remove button
    const logoRemoveBtn = document.getElementById('logo-remove');
    if (logoRemoveBtn) {
      logoRemoveBtn.addEventListener('click', () => {
        this.removeLogo();
      });
    }

    // Logo position toggle
    document.querySelectorAll('[data-position]').forEach(btn => {
      btn.addEventListener('click', () => {
        const position = btn.dataset.position;
        this.designOptions.logoPosition = position;
        Utils.savePref('logoPosition', position);

        // Update UI
        document.querySelectorAll('[data-position]').forEach(b => {
          b.classList.toggle('active', b.dataset.position === position);
          b.setAttribute('aria-checked', b.dataset.position === position);
        });

        this.updatePreview();
      });
    });

    // Logo size toggle
    document.querySelectorAll('[data-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        this.designOptions.logoSize = size;
        Utils.savePref('logoSize', size);

        // Update UI
        document.querySelectorAll('[data-size]').forEach(b => {
          b.classList.toggle('active', b.dataset.size === size);
          b.setAttribute('aria-checked', b.dataset.size === size);
        });

        this.updatePreview();
      });
    });
  },

  /**
   * Switch logo tab (URL/Upload)
   */
  switchLogoTab(tab) {
    // Update tab buttons
    document.querySelectorAll('[data-logo-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.logoTab === tab);
      btn.setAttribute('aria-selected', btn.dataset.logoTab === tab);
    });

    // Show/hide content
    document.getElementById('logo-tab-url')?.classList.toggle('hidden', tab !== 'url');
    document.getElementById('logo-tab-upload')?.classList.toggle('hidden', tab !== 'upload');
  },

  /**
   * Show logo preview
   */
  showLogoPreview(src) {
    const wrapper = document.getElementById('logo-preview-wrapper');
    const img = document.getElementById('logo-preview');

    if (wrapper && img) {
      img.src = src;
      wrapper.classList.remove('hidden');
    }
  },

  /**
   * Remove uploaded logo
   */
  removeLogo() {
    this.designOptions.logoData = '';
    Utils.savePref('logoData', '');

    // Hide preview
    const wrapper = document.getElementById('logo-preview-wrapper');
    if (wrapper) wrapper.classList.add('hidden');

    // Clear file input
    const fileInput = document.getElementById('logo-file');
    if (fileInput) fileInput.value = '';

    this.updatePreview();
  },

  /**
   * Bind design options events
   */
  bindDesignEvents() {
    // Collapsible design section
    const designToggle = document.getElementById('design-toggle');
    const designOptions = document.getElementById('design-options');

    if (designToggle && designOptions) {
      designToggle.addEventListener('click', () => {
        const expanded = designToggle.getAttribute('aria-expanded') === 'true';
        designToggle.setAttribute('aria-expanded', !expanded);
        designOptions.hidden = expanded;
      });
    }

    // Collapsible disclaimer section
    const disclaimerToggle = document.getElementById('disclaimer-toggle');
    const disclaimerContent = document.getElementById('disclaimer-content');

    if (disclaimerToggle && disclaimerContent) {
      disclaimerToggle.addEventListener('click', () => {
        const expanded = disclaimerToggle.getAttribute('aria-expanded') === 'true';
        disclaimerToggle.setAttribute('aria-expanded', !expanded);
        disclaimerContent.hidden = expanded;
      });
    }

    // Color pickers and hex inputs
    const colorMappings = [
      { id: 'name-color', key: 'nameColor' },
      { id: 'title-color', key: 'titleColor' },
      { id: 'link-color', key: 'linkColor' },
      { id: 'separator-color', key: 'separatorColor' },
      { id: 'icon-color', key: 'iconColor' }
    ];

    colorMappings.forEach(({ id, key }) => {
      const picker = document.getElementById(id);
      const hexInput = document.getElementById(`${id}-value`);

      if (picker) {
        // Color picker changes -> update hex input
        picker.addEventListener('input', () => {
          const color = picker.value;
          this.designOptions[key] = color;
          if (hexInput) {
            hexInput.value = color;
            hexInput.classList.remove('invalid');
          }
          Utils.savePref(key, color);
          this.updatePreview();
          this.checkContrast();
        });
      }

      if (hexInput) {
        // Hex input changes -> update color picker
        hexInput.addEventListener('input', () => {
          let value = hexInput.value.trim();

          // Add # if missing
          if (value && !value.startsWith('#')) {
            value = '#' + value;
            hexInput.value = value;
          }

          // Validate hex color
          if (this.isValidHexColor(value)) {
            hexInput.classList.remove('invalid');
            this.designOptions[key] = value;
            if (picker) picker.value = value;
            Utils.savePref(key, value);
            this.updatePreview();
            this.checkContrast();
          } else if (value.length > 0) {
            hexInput.classList.add('invalid');
          }
        });

        // On blur, try to fix common issues
        hexInput.addEventListener('blur', () => {
          let value = hexInput.value.trim();

          // Add # if missing
          if (value && !value.startsWith('#')) {
            value = '#' + value;
          }

          // Expand 3-char hex to 6-char (#abc -> #aabbcc)
          if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
            value = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
          }

          if (this.isValidHexColor(value)) {
            hexInput.value = value.toUpperCase();
            hexInput.classList.remove('invalid');
            this.designOptions[key] = value;
            if (picker) picker.value = value;
            Utils.savePref(key, value);
            this.updatePreview();
            this.checkContrast();
          }
        });
      }
    });

    // Icon style toggle
    const iconStyleBtns = document.querySelectorAll('[data-icon-style]');
    const iconColorOption = document.getElementById('icon-color-option');

    iconStyleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const style = btn.dataset.iconStyle;
        this.designOptions.iconStyle = style;
        Utils.savePref('iconStyle', style);

        // Update button states
        iconStyleBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.iconStyle === style);
          b.setAttribute('aria-pressed', b.dataset.iconStyle === style);
        });

        // Show/hide icon color option based on style
        if (iconColorOption) {
          iconColorOption.classList.toggle('hidden', style === 'branded');
        }

        this.updatePreview();
      });
    });

    // Separator style
    const separatorSelect = document.getElementById('separator-style');
    if (separatorSelect) {
      separatorSelect.addEventListener('change', () => {
        this.designOptions.separatorStyle = separatorSelect.value;
        Utils.savePref('separatorStyle', separatorSelect.value);
        this.updatePreview();
      });
    }

    // Font family
    const fontFamilySelect = document.getElementById('font-family');
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', () => {
        this.designOptions.fontFamily = fontFamilySelect.value;
        Utils.savePref('fontFamily', fontFamilySelect.value);
        this.updatePreview();
      });
    }

    // Background option
    const addBackgroundCheckbox = document.getElementById('add-background');
    const backgroundColorWrapper = document.getElementById('background-color-wrapper');
    const backgroundColorPicker = document.getElementById('background-color');
    const backgroundColorInput = document.getElementById('background-color-value');

    if (addBackgroundCheckbox) {
      addBackgroundCheckbox.addEventListener('change', () => {
        this.designOptions.addBackground = addBackgroundCheckbox.checked;
        Utils.savePref('addBackground', addBackgroundCheckbox.checked);
        if (backgroundColorWrapper) {
          backgroundColorWrapper.classList.toggle('hidden', !addBackgroundCheckbox.checked);
        }
        this.updatePreview();
      });
    }

    if (backgroundColorPicker) {
      backgroundColorPicker.addEventListener('input', () => {
        const color = backgroundColorPicker.value;
        this.designOptions.backgroundColor = color;
        if (backgroundColorInput) {
          backgroundColorInput.value = color.toUpperCase();
          backgroundColorInput.classList.remove('invalid');
        }
        Utils.savePref('backgroundColor', color);
        this.updatePreview();
      });
    }

    if (backgroundColorInput) {
      backgroundColorInput.addEventListener('input', () => {
        let value = backgroundColorInput.value.trim();
        if (value && !value.startsWith('#')) {
          value = '#' + value;
          backgroundColorInput.value = value;
        }
        if (this.isValidHexColor(value)) {
          backgroundColorInput.classList.remove('invalid');
          this.designOptions.backgroundColor = value;
          if (backgroundColorPicker) backgroundColorPicker.value = value;
          Utils.savePref('backgroundColor', value);
          this.updatePreview();
        } else if (value.length > 0) {
          backgroundColorInput.classList.add('invalid');
        }
      });

      backgroundColorInput.addEventListener('blur', () => {
        let value = backgroundColorInput.value.trim();
        if (value && !value.startsWith('#')) {
          value = '#' + value;
        }
        if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
          value = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
        }
        if (this.isValidHexColor(value)) {
          backgroundColorInput.value = value.toUpperCase();
          backgroundColorInput.classList.remove('invalid');
          this.designOptions.backgroundColor = value;
          if (backgroundColorPicker) backgroundColorPicker.value = value;
          Utils.savePref('backgroundColor', value);
          this.updatePreview();
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-design');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetDesign());
    }
  },

  /**
   * Validate hex color format
   * @param {string} color - Color string to validate
   * @returns {boolean} True if valid hex color
   */
  isValidHexColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  },

  /**
   * Calculate relative luminance of a color
   * @param {string} hex - Hex color
   * @returns {number} Luminance value 0-1
   */
  getLuminance(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color
   * @returns {Object|null} RGB values
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Check if a color has low contrast against dark backgrounds
   * @param {string} hex - Hex color
   * @returns {boolean} True if color may be hard to read in dark mode
   */
  isLowContrastForDarkMode(hex) {
    const luminance = this.getLuminance(hex);
    // Colors with luminance below 0.3 may be hard to see on dark backgrounds
    return luminance < 0.25;
  },

  /**
   * Check contrast of current colors and show/hide warning
   */
  checkContrast() {
    const warning = document.getElementById('contrast-warning');
    if (!warning) return;

    // Skip check if background is enabled (user is handling it)
    if (this.designOptions.addBackground) {
      warning.classList.add('hidden');
      return;
    }

    const colorsToCheck = [
      this.designOptions.nameColor,
      this.designOptions.titleColor,
      this.designOptions.linkColor,
      this.designOptions.iconColor
    ];

    const hasLowContrast = colorsToCheck.some(color =>
      color && this.isLowContrastForDarkMode(color)
    );

    warning.classList.toggle('hidden', !hasLowContrast);
  },

  /**
   * Reset design options to defaults
   */
  resetDesign() {
    // Reset to defaults
    Utils.resetPrefs();
    this.designOptions = { ...Utils.designDefaults };

    // Re-apply to UI
    this.applyPreferencesToUI();

    // Clear logo preview
    const wrapper = document.getElementById('logo-preview-wrapper');
    if (wrapper) wrapper.classList.add('hidden');

    // Clear logo URL input
    const logoUrlInput = document.getElementById('logo-url');
    if (logoUrlInput) logoUrlInput.value = '';

    // Clear file input
    const fileInput = document.getElementById('logo-file');
    if (fileInput) fileInput.value = '';

    // Update preview
    this.updatePreview();

    Utils.showToast('Design reset to defaults', 'success');
  },

  // ===========================================
  // Company Template Methods
  // ===========================================

  /**
   * Initialize template-related events
   */
  initTemplateEvents() {
    const saveTemplateBtn = document.getElementById('save-template-btn');
    const loadTemplateBtn = document.getElementById('load-template-btn');
    const templateFileInput = document.getElementById('template-file-input');
    const saveTemplateModal = document.getElementById('save-template-modal');
    const saveTemplateClose = document.getElementById('save-template-close');
    const saveTemplateCancel = document.getElementById('save-template-cancel');
    const saveTemplateConfirm = document.getElementById('save-template-confirm');
    const templateNameInput = document.getElementById('template-name');

    // Open save modal
    if (saveTemplateBtn) {
      saveTemplateBtn.addEventListener('click', () => {
        if (saveTemplateModal) {
          saveTemplateModal.classList.add('visible');
          saveTemplateModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          templateNameInput?.focus();
        }
      });
    }

    // Close save modal
    const closeSaveModal = () => {
      if (saveTemplateModal) {
        saveTemplateModal.classList.remove('visible');
        saveTemplateModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (templateNameInput) templateNameInput.value = '';
      }
    };

    saveTemplateClose?.addEventListener('click', closeSaveModal);
    saveTemplateCancel?.addEventListener('click', closeSaveModal);

    // Close on backdrop click
    saveTemplateModal?.addEventListener('click', (e) => {
      if (e.target === saveTemplateModal) closeSaveModal();
    });

    // Close on Escape
    saveTemplateModal?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSaveModal();
    });

    // Confirm save
    saveTemplateConfirm?.addEventListener('click', () => {
      const templateName = templateNameInput?.value.trim() || 'Company Template';
      const formData = Utils.getFormData(this.form);

      Utils.exportCompanyTemplate(this.designOptions, formData, templateName);
      Utils.showToast(`Template "${templateName}" saved!`, 'success');
      closeSaveModal();
    });

    // Load template button triggers file input
    if (loadTemplateBtn && templateFileInput) {
      loadTemplateBtn.addEventListener('click', () => {
        templateFileInput.click();
      });
    }

    // Handle file selection
    if (templateFileInput) {
      templateFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const template = Utils.parseCompanyTemplate(text);

          if (!template) {
            Utils.showToast('Invalid template file', 'error');
            return;
          }

          this.applyTemplate(template);
          Utils.showToast(`Template "${template.templateName || 'Unnamed'}" loaded!`, 'success');
        } catch (error) {
          console.error('Failed to load template:', error);
          Utils.showToast('Failed to load template file', 'error');
        }

        // Reset file input so same file can be selected again
        templateFileInput.value = '';
      });
    }
  },

  /**
   * Apply a loaded template to the form
   * @param {Object} template - Parsed template data
   */
  applyTemplate(template) {
    this.loadedTemplate = template;

    // Apply design options
    if (template.design) {
      this.designOptions = { ...this.designOptions, ...template.design };

      // Save to localStorage
      Utils.saveAllPrefs(this.designOptions);

      // Apply to UI
      this.applyPreferencesToUI();

      // Handle logo preview if there's logo data
      if (template.design.logoData) {
        this.showLogoPreview(template.design.logoData);
        this.switchLogoTab('upload');
      } else if (template.design.logoUrl) {
        const logoUrlInput = document.getElementById('logo-url');
        if (logoUrlInput) logoUrlInput.value = template.design.logoUrl;
        this.switchLogoTab('url');
      }
    }

    // Apply company fields
    if (template.companyFields) {
      Utils.companyFieldKeys.forEach(key => {
        const input = document.getElementById(key);
        if (input && template.companyFields[key]) {
          input.value = template.companyFields[key];

          // Trigger visibility of clear button
          const clearBtn = input.parentElement?.querySelector('.clear-button');
          if (clearBtn) {
            clearBtn.classList.add('visible');
            input.classList.add('has-value');
          }
        }
      });
    }

    // Update status indicator
    this.updateTemplateStatus(template.templateName);

    // Update preview
    this.updatePreview();
  },

  /**
   * Update the template status indicator
   * @param {string} templateName - Name of loaded template (or null to clear)
   */
  updateTemplateStatus(templateName) {
    const indicator = document.getElementById('template-indicator');
    if (!indicator) return;

    if (templateName) {
      indicator.textContent = templateName;
      indicator.classList.remove('inactive');
      indicator.classList.add('active');
    } else {
      indicator.textContent = 'No template loaded';
      indicator.classList.remove('active');
      indicator.classList.add('inactive');
    }
  },

  /**
   * Initialize clear buttons on inputs
   */
  initClearButtons() {
    const clearButtons = document.querySelectorAll('.clear-button');

    clearButtons.forEach(btn => {
      const wrapper = btn.closest('.input-wrapper');
      const input = wrapper?.querySelector('input');

      if (!input) return;

      // Update visibility based on input value
      const updateVisibility = () => {
        if (input.value.trim()) {
          btn.classList.add('visible');
          input.classList.add('has-value');
        } else {
          btn.classList.remove('visible');
          input.classList.remove('has-value');
        }
      };

      // Initial state
      updateVisibility();

      // Update on input
      input.addEventListener('input', updateVisibility);

      // Clear on click
      btn.addEventListener('click', () => {
        input.value = '';
        input.focus();
        updateVisibility();

        // Special handling for logo URL
        if (input.id === 'logo-url') {
          this.designOptions.logoUrl = '';
          Utils.savePref('logoUrl', '');
        }

        this.updatePreview();
      });
    });
  },

  /**
   * Initialize preview background toggle
   */
  initPreviewBgToggle() {
    const toggleBtns = document.querySelectorAll('.preview-bg-btn');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update button states
        toggleBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Update preview background
        const bg = btn.dataset.bg;
        if (bg === 'dark') {
          this.previewContainer.classList.add('dark-bg');
        } else {
          this.previewContainer.classList.remove('dark-bg');
        }
      });
    });
  },

  /**
   * Initialize modal
   */
  initModal() {
    const modal = document.getElementById('howto-modal');
    const modalContent = modal?.querySelector('.modal');
    const howtoBtn = document.getElementById('howto-btn');
    const closeBtn = document.getElementById('modal-close');
    const tabs = document.querySelectorAll('.modal .tab');

    if (!modal || !howtoBtn) return;

    // Get focusable elements inside modal
    const getFocusableElements = () => {
      return modalContent.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    // Open modal
    howtoBtn.addEventListener('click', () => {
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      closeBtn?.focus();
    });

    // Close modal
    const closeModal = () => {
      modal.classList.remove('visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
      howtoBtn.focus();
    };

    closeBtn?.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard handling - Escape and focus trap
    modal.addEventListener('keydown', (e) => {
      // Close on Escape
      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      // Focus trap - Tab key
      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: If on first element, move to last
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab: If on last element, move to first
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = `tab-${tab.dataset.tab}`;

        // Update tabs
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  },

  /**
   * Initialize logo info modal
   */
  initLogoInfoModal() {
    const modal = document.getElementById('logo-info-modal');
    const modalContent = modal?.querySelector('.modal');
    const infoBtn = document.getElementById('logo-info-btn');
    const closeBtn = document.getElementById('logo-info-close');

    if (!modal || !infoBtn) return;

    // Get focusable elements inside modal
    const getFocusableElements = () => {
      return modalContent.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    };

    // Open modal
    infoBtn.addEventListener('click', () => {
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    });

    // Close modal
    const closeModal = () => {
      modal.classList.remove('visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      infoBtn.focus();
    };

    closeBtn?.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard handling - Escape and focus trap
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      // Focus trap - Tab key
      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  },

  /**
   * Update the live preview
   */
  updatePreview() {
    const data = Utils.getFormData(this.form);

    // Check if we have at least a name
    if (!data.name?.trim()) {
      this.previewContent.innerHTML = '<p class="preview-placeholder">Enter your name to see the preview</p>';
      this.currentHtml = '';
      this.copyBtn.disabled = true;
      return;
    }

    // Build render options from design state
    const options = {
      nameColor: this.designOptions.nameColor,
      titleColor: this.designOptions.titleColor,
      linkColor: this.designOptions.linkColor,
      separatorColor: this.designOptions.separatorColor,
      iconColor: this.designOptions.iconColor,
      iconStyle: this.designOptions.iconStyle,
      separatorStyle: this.designOptions.separatorStyle,
      logoPosition: this.designOptions.logoPosition,
      logoSize: this.designOptions.logoSize,
      logoUrl: this.designOptions.logoUrl,
      logoData: this.designOptions.logoData,
      addBackground: this.designOptions.addBackground,
      backgroundColor: this.designOptions.backgroundColor,
      fontFamily: this.designOptions.fontFamily
    };

    // Generate signature HTML
    this.currentHtml = SignatureRenderer.render(data, options);

    // Update preview
    this.previewContent.innerHTML = this.currentHtml;
    this.copyBtn.disabled = false;
  },

  /**
   * Copy signature to clipboard
   */
  async copySignature() {
    if (!this.currentHtml) {
      Utils.showToast('Please enter your name first', 'error');
      return;
    }

    const success = await Utils.copyToClipboard(this.currentHtml);

    if (success) {
      Utils.showToast('Signature copied! Ready to paste into your email client.', 'success');
    } else {
      Utils.showToast('Failed to copy. Please try again.', 'error');
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SignatureBuilder;
}
