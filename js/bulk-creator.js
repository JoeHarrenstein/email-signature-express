/**
 * Bulk Creator Module
 * Handles bulk signature creation wizard (3 steps)
 */

const BulkCreator = {
  // State
  currentStep: 1,
  employees: [],
  removedIndices: new Set(),
  filenames: new Map(),

  // Loaded company template
  loadedTemplate: null,
  companyDefaults: {},

  // Design template options (shared format with SignatureBuilder, dark mode-safe defaults)
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

  // DOM elements
  elements: {},

  /**
   * Initialize bulk creator
   */
  init() {
    this.cacheElements();
    this.bindModeEvents();
    this.bindStep1Events();
    this.bindStep2Events();
    this.bindStep3Events();
    this.bindTemplateEvents();
    this.bindLogoInfoEvent();
    this.updateTemplatePreview();
  },

  /**
   * Cache DOM element references
   */
  cacheElements() {
    this.elements = {
      // Mode tabs
      modeTabs: document.querySelectorAll('.mode-tab'),
      singlePanel: document.getElementById('panel-single'),
      bulkPanel: document.getElementById('panel-bulk'),

      // Step indicator
      steps: document.querySelectorAll('.step-indicator .step'),
      stepConnectors: document.querySelectorAll('.step-connector'),

      // Step panels
      step1: document.getElementById('bulk-step-1'),
      step2: document.getElementById('bulk-step-2'),
      step3: document.getElementById('bulk-step-3'),

      // Step 1 controls
      logoUrlInput: document.getElementById('bulk-logo-url'),
      logoFileInput: document.getElementById('bulk-logo-file'),
      logoPreviewWrapper: document.getElementById('bulk-logo-preview-wrapper'),
      logoPreview: document.getElementById('bulk-logo-preview'),
      logoRemoveBtn: document.getElementById('bulk-logo-remove'),
      templatePreview: document.getElementById('bulk-template-preview'),
      nextBtn1: document.getElementById('bulk-next-1'),

      // Template controls
      bulkLoadTemplateBtn: document.getElementById('bulk-load-template-btn'),
      bulkTemplateFileInput: document.getElementById('bulk-template-file-input'),
      bulkTemplateIndicator: document.getElementById('bulk-template-indicator'),

      // Step 2 controls
      downloadTemplateBtn: document.getElementById('download-template'),
      csvFileInput: document.getElementById('csv-file'),
      pasteTextarea: document.getElementById('paste-data'),
      parsePasteBtn: document.getElementById('parse-paste'),
      importResults: document.getElementById('import-results'),
      importSuccess: document.getElementById('import-success'),
      employeeCount: document.getElementById('employee-count'),
      importTableHeader: document.getElementById('import-table-header'),
      importTableBody: document.getElementById('import-table-body'),
      importError: document.getElementById('import-error'),
      errorText: document.getElementById('error-text'),
      backBtn2: document.getElementById('bulk-back-2'),
      nextBtn2: document.getElementById('bulk-next-2'),

      // Step 3 controls
      signatureCount: document.getElementById('signature-count'),
      signatureSearch: document.getElementById('signature-search'),
      signatureGrid: document.getElementById('signature-grid'),
      downloadZipBtn: document.getElementById('download-zip'),
      downloadPreviewBtn: document.getElementById('download-preview-page'),
      backBtn3: document.getElementById('bulk-back-3'),
      startOverBtn: document.getElementById('bulk-start-over')
    };
  },

  /**
   * Bind mode switching events
   */
  bindModeEvents() {
    this.elements.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;

        // Update tab states
        this.elements.modeTabs.forEach(t => {
          t.classList.toggle('active', t.dataset.mode === mode);
          t.setAttribute('aria-selected', t.dataset.mode === mode);
        });

        // Show/hide panels
        this.elements.singlePanel.classList.toggle('active', mode === 'single');
        this.elements.bulkPanel.classList.toggle('active', mode === 'bulk');
      });
    });
  },

  /**
   * Bind Step 1 events (Design Template)
   */
  bindStep1Events() {
    // Logo tabs
    document.querySelectorAll('[data-bulk-logo-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchLogoTab(tab.dataset.bulkLogoTab);
      });
    });

    // Logo URL input
    if (this.elements.logoUrlInput) {
      this.elements.logoUrlInput.addEventListener('input', Utils.debounce(() => {
        this.designOptions.logoUrl = this.elements.logoUrlInput.value.trim();
        this.designOptions.logoData = '';
        this.updateTemplatePreview();
      }, 300));
    }

    // Logo file upload
    if (this.elements.logoFileInput) {
      this.elements.logoFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const base64 = await Utils.fileToBase64(file);
          this.designOptions.logoData = base64;
          this.designOptions.logoUrl = '';
          this.showLogoPreview(base64);
          this.updateTemplatePreview();
        } catch (error) {
          Utils.showToast('Failed to upload logo', 'error');
        }
      });
    }

    // Logo remove
    if (this.elements.logoRemoveBtn) {
      this.elements.logoRemoveBtn.addEventListener('click', () => {
        this.designOptions.logoData = '';
        if (this.elements.logoPreviewWrapper) {
          this.elements.logoPreviewWrapper.classList.add('hidden');
        }
        if (this.elements.logoFileInput) {
          this.elements.logoFileInput.value = '';
        }
        this.updateTemplatePreview();
      });
    }

    // Logo position
    document.querySelectorAll('[data-bulk-position]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.designOptions.logoPosition = btn.dataset.bulkPosition;
        document.querySelectorAll('[data-bulk-position]').forEach(b => {
          b.classList.toggle('active', b.dataset.bulkPosition === this.designOptions.logoPosition);
        });
        this.updateTemplatePreview();
      });
    });

    // Logo size
    document.querySelectorAll('[data-bulk-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.designOptions.logoSize = btn.dataset.bulkSize;
        document.querySelectorAll('[data-bulk-size]').forEach(b => {
          b.classList.toggle('active', b.dataset.bulkSize === this.designOptions.logoSize);
        });
        this.updateTemplatePreview();
      });
    });

    // Color pickers and hex inputs
    const colorMappings = [
      { id: 'bulk-name-color', key: 'nameColor' },
      { id: 'bulk-title-color', key: 'titleColor' },
      { id: 'bulk-link-color', key: 'linkColor' },
      { id: 'bulk-separator-color', key: 'separatorColor' },
      { id: 'bulk-icon-color', key: 'iconColor' }
    ];

    colorMappings.forEach(({ id, key }) => {
      const picker = document.getElementById(id);
      const hexInput = document.getElementById(`${id}-value`);

      if (picker) {
        // Color picker changes -> update hex input
        picker.addEventListener('input', () => {
          this.designOptions[key] = picker.value;
          if (hexInput) {
            hexInput.value = picker.value.toUpperCase();
            hexInput.classList.remove('invalid');
          }
          this.updateTemplatePreview();
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
            this.updateTemplatePreview();
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
            this.updateTemplatePreview();
          }
        });
      }
    });

    // Icon style toggle
    const bulkIconStyleBtns = document.querySelectorAll('[data-bulk-icon-style]');
    const bulkIconColorOption = document.getElementById('bulk-icon-color-option');

    bulkIconStyleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const style = btn.dataset.bulkIconStyle;
        this.designOptions.iconStyle = style;

        // Update button states
        bulkIconStyleBtns.forEach(b => {
          b.classList.toggle('active', b.dataset.bulkIconStyle === style);
          b.setAttribute('aria-pressed', b.dataset.bulkIconStyle === style);
        });

        // Show/hide icon color option based on style
        if (bulkIconColorOption) {
          bulkIconColorOption.classList.toggle('hidden', style === 'branded');
        }

        this.updateTemplatePreview();
      });
    });

    // Separator style
    const separatorSelect = document.getElementById('bulk-separator-style');
    if (separatorSelect) {
      separatorSelect.addEventListener('change', () => {
        this.designOptions.separatorStyle = separatorSelect.value;
        this.updateTemplatePreview();
      });
    }

    // Font family
    const fontFamilySelect = document.getElementById('bulk-font-family');
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', () => {
        this.designOptions.fontFamily = fontFamilySelect.value;
        this.updateTemplatePreview();
      });
    }

    // Background option
    const addBackgroundCheckbox = document.getElementById('bulk-add-background');
    const backgroundColorWrapper = document.getElementById('bulk-background-color-wrapper');
    const backgroundColorPicker = document.getElementById('bulk-background-color');
    const backgroundColorInput = document.getElementById('bulk-background-color-value');

    if (addBackgroundCheckbox) {
      addBackgroundCheckbox.addEventListener('change', () => {
        this.designOptions.addBackground = addBackgroundCheckbox.checked;
        if (backgroundColorWrapper) {
          backgroundColorWrapper.classList.toggle('hidden', !addBackgroundCheckbox.checked);
        }
        this.updateTemplatePreview();
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
        this.updateTemplatePreview();
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
          this.updateTemplatePreview();
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
          this.updateTemplatePreview();
        }
      });
    }

    // Preview background toggle for template preview
    document.querySelectorAll('[data-bulk-preview-bg]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-bulk-preview-bg]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const isDark = btn.dataset.bulkPreviewBg === 'dark';
        const previewContainer = document.getElementById('bulk-template-preview');
        if (previewContainer) {
          previewContainer.classList.toggle('dark-bg', isDark);
        }
      });
    });

    // Next button
    if (this.elements.nextBtn1) {
      this.elements.nextBtn1.addEventListener('click', () => {
        this.goToStep(2);
      });
    }
  },

  /**
   * Bind Step 2 events (Import Data)
   */
  bindStep2Events() {
    // Download template
    if (this.elements.downloadTemplateBtn) {
      this.elements.downloadTemplateBtn.addEventListener('click', () => {
        CsvHandler.downloadTemplate();
        Utils.showToast('CSV template downloaded', 'success');
      });
    }

    // CSV file upload
    if (this.elements.csvFileInput) {
      this.elements.csvFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = CsvHandler.parseCSV(event.target.result);
          this.handleParseResult(result);
        };
        reader.onerror = () => {
          this.showError('Failed to read the file.');
        };
        reader.readAsText(file);
      });
    }

    // Parse pasted data
    if (this.elements.parsePasteBtn) {
      this.elements.parsePasteBtn.addEventListener('click', () => {
        const text = this.elements.pasteTextarea?.value;
        if (!text || !text.trim()) {
          this.showError('Please paste data first.');
          return;
        }
        const result = CsvHandler.parseTSV(text);
        this.handleParseResult(result);
      });
    }

    // Navigation
    if (this.elements.backBtn2) {
      this.elements.backBtn2.addEventListener('click', () => {
        this.goToStep(1);
      });
    }

    if (this.elements.nextBtn2) {
      this.elements.nextBtn2.addEventListener('click', () => {
        this.goToStep(3);
      });
    }
  },

  /**
   * Bind Step 3 events (Preview & Export)
   */
  bindStep3Events() {
    // Search filter
    if (this.elements.signatureSearch) {
      this.elements.signatureSearch.addEventListener('input', Utils.debounce(() => {
        this.renderSignatureGrid();
      }, 200));
    }

    // Background toggle
    document.querySelectorAll('[data-bulk-bg]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-bulk-bg]').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', b === btn);
        });

        const isDark = btn.dataset.bulkBg === 'dark';
        document.querySelectorAll('.signature-card').forEach(card => {
          card.classList.toggle('dark-bg', isDark);
        });
      });
    });

    // Download ZIP
    if (this.elements.downloadZipBtn) {
      this.elements.downloadZipBtn.addEventListener('click', () => {
        this.downloadZip();
      });
    }

    // Download Preview Page
    if (this.elements.downloadPreviewBtn) {
      this.elements.downloadPreviewBtn.addEventListener('click', () => {
        this.downloadPreviewPage();
      });
    }

    // Navigation
    if (this.elements.backBtn3) {
      this.elements.backBtn3.addEventListener('click', () => {
        this.goToStep(2);
      });
    }

    if (this.elements.startOverBtn) {
      this.elements.startOverBtn.addEventListener('click', () => {
        this.startOver();
      });
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
   * Switch logo tab (URL/Upload)
   */
  switchLogoTab(tab) {
    document.querySelectorAll('[data-bulk-logo-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bulkLogoTab === tab);
    });

    document.getElementById('bulk-logo-tab-url')?.classList.toggle('hidden', tab !== 'url');
    document.getElementById('bulk-logo-tab-upload')?.classList.toggle('hidden', tab !== 'upload');
  },

  /**
   * Show logo preview
   */
  showLogoPreview(src) {
    if (this.elements.logoPreviewWrapper && this.elements.logoPreview) {
      this.elements.logoPreview.src = src;
      this.elements.logoPreviewWrapper.classList.remove('hidden');
    }
  },

  /**
   * Bind template loading events
   */
  bindTemplateEvents() {
    const loadBtn = this.elements.bulkLoadTemplateBtn;
    const fileInput = this.elements.bulkTemplateFileInput;

    if (loadBtn && fileInput) {
      loadBtn.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', async (e) => {
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
        fileInput.value = '';
      });
    }
  },

  /**
   * Bind logo info button event (shares modal with single signature mode)
   */
  bindLogoInfoEvent() {
    const infoBtn = document.getElementById('bulk-logo-info-btn');
    const modal = document.getElementById('logo-info-modal');
    const closeBtn = document.getElementById('logo-info-close');

    if (!infoBtn || !modal) return;

    // Open modal
    infoBtn.addEventListener('click', () => {
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    });
  },

  /**
   * Apply a loaded template to bulk creator
   * @param {Object} template - Parsed template data
   */
  applyTemplate(template) {
    this.loadedTemplate = template;

    // Apply design options
    if (template.design) {
      this.designOptions = { ...this.designOptions, ...template.design };

      // Apply to UI
      this.applyDesignToUI();

      // Handle logo
      if (template.design.logoData) {
        this.showLogoPreview(template.design.logoData);
        this.switchLogoTab('upload');
      } else if (template.design.logoUrl) {
        if (this.elements.logoUrlInput) {
          this.elements.logoUrlInput.value = template.design.logoUrl;
        }
        this.switchLogoTab('url');
      }
    }

    // Store company defaults for merging with CSV data
    if (template.companyFields) {
      this.companyDefaults = { ...template.companyFields };
    }

    // Update template status indicator
    this.updateBulkTemplateStatus(template.templateName);

    // Update preview
    this.updateTemplatePreview();
  },

  /**
   * Apply design options to UI controls
   */
  applyDesignToUI() {
    const opts = this.designOptions;

    // Logo URL
    if (this.elements.logoUrlInput && opts.logoUrl) {
      this.elements.logoUrlInput.value = opts.logoUrl;
    }

    // Logo position buttons
    document.querySelectorAll('[data-bulk-position]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bulkPosition === opts.logoPosition);
    });

    // Logo size buttons
    document.querySelectorAll('[data-bulk-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bulkSize === opts.logoSize);
    });

    // Color pickers and hex inputs
    const colorMappings = [
      { id: 'bulk-name-color', key: 'nameColor' },
      { id: 'bulk-title-color', key: 'titleColor' },
      { id: 'bulk-link-color', key: 'linkColor' },
      { id: 'bulk-separator-color', key: 'separatorColor' },
      { id: 'bulk-icon-color', key: 'iconColor' }
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
    const separatorSelect = document.getElementById('bulk-separator-style');
    if (separatorSelect && opts.separatorStyle) {
      separatorSelect.value = opts.separatorStyle;
    }

    // Icon style toggle
    const bulkIconStyleBtns = document.querySelectorAll('[data-bulk-icon-style]');
    const bulkIconColorOption = document.getElementById('bulk-icon-color-option');
    bulkIconStyleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bulkIconStyle === opts.iconStyle);
      btn.setAttribute('aria-pressed', btn.dataset.bulkIconStyle === opts.iconStyle);
    });
    if (bulkIconColorOption && opts.iconStyle === 'branded') {
      bulkIconColorOption.classList.add('hidden');
    }

    // Font family
    const fontFamilySelect = document.getElementById('bulk-font-family');
    if (fontFamilySelect && opts.fontFamily) {
      fontFamilySelect.value = opts.fontFamily;
    }

    // Background option
    const addBackgroundCheckbox = document.getElementById('bulk-add-background');
    const backgroundColorWrapper = document.getElementById('bulk-background-color-wrapper');
    const backgroundColorPicker = document.getElementById('bulk-background-color');
    const backgroundColorInput = document.getElementById('bulk-background-color-value');

    if (addBackgroundCheckbox) {
      addBackgroundCheckbox.checked = opts.addBackground === true || opts.addBackground === 'true';
      if (backgroundColorWrapper) {
        backgroundColorWrapper.classList.toggle('hidden', !addBackgroundCheckbox.checked);
      }
    }

    if (backgroundColorPicker && opts.backgroundColor) {
      backgroundColorPicker.value = opts.backgroundColor;
    }

    if (backgroundColorInput && opts.backgroundColor) {
      backgroundColorInput.value = opts.backgroundColor.toUpperCase();
    }
  },

  /**
   * Update the bulk template status indicator
   * @param {string} templateName - Name of loaded template (or null to clear)
   */
  updateBulkTemplateStatus(templateName) {
    const indicator = this.elements.bulkTemplateIndicator;
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
   * Update template preview (Step 1)
   */
  updateTemplatePreview() {
    if (!this.elements.templatePreview) return;

    // Use company defaults if loaded, otherwise use placeholders
    const placeholderData = {
      name: '[Name]',
      title: '[Title]',
      company: this.companyDefaults.company || '[Company]',
      phone: '[Phone]',
      email: '[Email]',
      address1: this.companyDefaults.address1 || '[Address]',
      address2: this.companyDefaults.address2 || '',
      city: this.companyDefaults.city || '',
      state: this.companyDefaults.state || '',
      zip: this.companyDefaults.zip || '',
      website: this.companyDefaults.website || '[Website]',
      facebook: this.companyDefaults.facebook || '',
      instagram: this.companyDefaults.instagram || '',
      twitter: this.companyDefaults.twitter || '',
      linkedin: this.companyDefaults.linkedin || '',
      youtube: this.companyDefaults.youtube || ''
    };

    const html = SignatureRenderer.render(placeholderData, this.designOptions);
    this.elements.templatePreview.querySelector('.preview-content').innerHTML = html;
  },

  /**
   * Handle CSV/TSV parse result
   */
  handleParseResult(result) {
    if (result.error) {
      this.showError(result.error);
      this.elements.nextBtn2.disabled = true;
      return;
    }

    // Merge company defaults with each employee record
    // Company defaults fill in missing fields but don't override CSV data
    this.employees = result.data.map(emp => {
      const merged = { ...this.companyDefaults };
      // Only copy non-empty values from employee
      Object.entries(emp).forEach(([key, value]) => {
        if (value && value.trim()) {
          merged[key] = value;
        }
      });
      return merged;
    });

    this.removedIndices.clear();
    this.filenames = CsvHandler.generateFilenames(this.employees);

    // Show success
    this.elements.importError?.classList.add('hidden');
    this.elements.importResults?.classList.remove('hidden');
    this.elements.employeeCount.textContent = this.employees.length;

    // Build preview table
    this.renderImportTable(result.headers);

    // Enable next button
    this.elements.nextBtn2.disabled = false;

    Utils.showToast(`Loaded ${this.employees.length} employees`, 'success');
  },

  /**
   * Show import error
   */
  showError(message) {
    this.elements.importResults?.classList.add('hidden');
    this.elements.importError?.classList.remove('hidden');
    this.elements.errorText.textContent = message;
  },

  /**
   * Render import preview table
   */
  renderImportTable(headers) {
    const displayHeaders = ['Name', 'Title', 'Email', 'Phone'];

    // Header row
    this.elements.importTableHeader.innerHTML = displayHeaders
      .map(h => `<th>${h}</th>`)
      .join('');

    // Data rows (first 5)
    const preview = this.employees.slice(0, 5);
    this.elements.importTableBody.innerHTML = preview.map(emp => {
      const cells = [
        emp.name || '',
        emp.title || '',
        emp.email || '',
        emp.phone ? Formatters.formatPhone(emp.phone) : ''
      ];
      return `<tr>${cells.map(c => `<td>${Utils.escapeHtml(c)}</td>`).join('')}</tr>`;
    }).join('');

    if (this.employees.length > 5) {
      this.elements.importTableBody.innerHTML += `
        <tr><td colspan="4" style="text-align: center; color: var(--text-muted);">
          ... and ${this.employees.length - 5} more
        </td></tr>
      `;
    }
  },

  /**
   * Render signature grid (Step 3)
   */
  renderSignatureGrid() {
    if (!this.elements.signatureGrid) return;

    const searchTerm = (this.elements.signatureSearch?.value || '').toLowerCase().trim();
    const isDark = document.querySelector('[data-bulk-bg="dark"]')?.classList.contains('active');

    // Filter employees
    const filtered = this.employees.filter((emp, index) => {
      if (this.removedIndices.has(index)) return false;
      if (searchTerm && !emp.name.toLowerCase().includes(searchTerm)) return false;
      return true;
    });

    // Update count
    const total = this.employees.length - this.removedIndices.size;
    if (searchTerm && filtered.length !== total) {
      this.elements.signatureCount.textContent = `Showing ${filtered.length} of ${total} signatures`;
    } else {
      this.elements.signatureCount.textContent = `Showing ${total} signatures`;
    }

    // Render cards
    if (filtered.length === 0) {
      this.elements.signatureGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">&#128196;</div>
          <p class="empty-state-text">No signatures to display</p>
        </div>
      `;
      return;
    }

    this.elements.signatureGrid.innerHTML = filtered.map((emp, filteredIndex) => {
      const originalIndex = this.employees.indexOf(emp);
      const html = SignatureRenderer.render(emp, this.designOptions);

      return `
        <div class="signature-card${isDark ? ' dark-bg' : ''}" data-index="${originalIndex}">
          <div class="signature-card-header">
            <h4 class="signature-card-name">${Utils.escapeHtml(emp.name)}</h4>
            <div class="signature-card-actions">
              <button class="card-action-btn copy-btn" title="Copy signature" data-index="${originalIndex}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button class="card-action-btn remove-btn" title="Remove from export" data-index="${originalIndex}">
                &times;
              </button>
            </div>
          </div>
          <div class="signature-card-content">${html}</div>
        </div>
      `;
    }).join('');

    // Bind card action buttons
    this.elements.signatureGrid.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        const html = SignatureRenderer.render(this.employees[index], this.designOptions);
        Utils.copyToClipboard(html).then(success => {
          Utils.showToast(success ? 'Signature copied!' : 'Failed to copy', success ? 'success' : 'error');
        });
      });
    });

    this.elements.signatureGrid.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        this.removedIndices.add(index);
        this.renderSignatureGrid();
      });
    });
  },

  /**
   * Go to a specific step
   */
  goToStep(stepNum) {
    this.currentStep = stepNum;

    // Update step indicators
    this.elements.steps.forEach((step, index) => {
      const num = index + 1;
      step.classList.remove('active', 'completed');

      if (num < stepNum) {
        step.classList.add('completed');
      } else if (num === stepNum) {
        step.classList.add('active');
      }
    });

    // Update connectors
    this.elements.stepConnectors.forEach((connector, index) => {
      connector.classList.toggle('completed', index < stepNum - 1);
    });

    // Show/hide step panels
    this.elements.step1?.classList.toggle('active', stepNum === 1);
    this.elements.step2?.classList.toggle('active', stepNum === 2);
    this.elements.step3?.classList.toggle('active', stepNum === 3);

    // Special handling for Step 3
    if (stepNum === 3) {
      this.renderSignatureGrid();
    }
  },

  /**
   * Start over - reset wizard
   */
  startOver() {
    this.employees = [];
    this.removedIndices.clear();
    this.filenames.clear();

    // Clear file input
    if (this.elements.csvFileInput) {
      this.elements.csvFileInput.value = '';
    }

    // Clear paste textarea
    if (this.elements.pasteTextarea) {
      this.elements.pasteTextarea.value = '';
    }

    // Hide import results
    this.elements.importResults?.classList.add('hidden');
    this.elements.importError?.classList.add('hidden');

    // Disable next button
    if (this.elements.nextBtn2) {
      this.elements.nextBtn2.disabled = true;
    }

    // Clear search
    if (this.elements.signatureSearch) {
      this.elements.signatureSearch.value = '';
    }

    // Go to Step 1
    this.goToStep(1);

    Utils.showToast('Wizard reset', 'success');
  },

  /**
   * Download signatures as ZIP
   */
  async downloadZip() {
    if (typeof JSZip === 'undefined') {
      Utils.showToast('ZIP library not loaded', 'error');
      return;
    }

    const activeEmployees = this.employees.filter((_, i) => !this.removedIndices.has(i));

    if (activeEmployees.length === 0) {
      Utils.showToast('No signatures to export', 'error');
      return;
    }

    Utils.showToast('Generating ZIP file...', 'success');

    try {
      const zip = new JSZip();
      const usedFilenames = new Map();

      activeEmployees.forEach(emp => {
        const html = SignatureRenderer.render(emp, this.designOptions);
        let filename = CsvHandler.generateFilename(emp.name);

        // Handle duplicates
        const count = usedFilenames.get(filename) || 0;
        usedFilenames.set(filename, count + 1);
        if (count > 0) {
          filename = `${filename}-${count + 1}`;
        }

        zip.file(`${filename}.html`, html);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const date = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `signatures-${date}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Utils.showToast(`Downloaded ${activeEmployees.length} signatures`, 'success');
    } catch (error) {
      console.error('ZIP generation failed:', error);
      Utils.showToast('Failed to generate ZIP', 'error');
    }
  },

  /**
   * Download preview page with all signatures
   */
  downloadPreviewPage() {
    const activeEmployees = this.employees.filter((_, i) => !this.removedIndices.has(i));

    if (activeEmployees.length === 0) {
      Utils.showToast('No signatures to export', 'error');
      return;
    }

    const signatures = activeEmployees.map((emp, index) => {
      const html = SignatureRenderer.render(emp, this.designOptions);
      return `
        <div class="signature-item">
          <div class="signature-header">
            <h3>${Utils.escapeHtml(emp.name)}</h3>
            <button class="copy-btn" onclick="copySignature(${index})">Copy</button>
          </div>
          <div class="signature-content" id="sig-${index}">
            ${html}
          </div>
        </div>
      `;
    }).join('\n');

    const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Signatures Preview</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
      background: #f8f9fa;
    }
    h1 { color: #1a1a2e; margin-bottom: 8px; }
    .subtitle { color: #6c757d; margin-bottom: 32px; }
    .signature-item {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .signature-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
    .signature-header h3 {
      margin: 0;
      font-size: 14px;
      color: #1a1a2e;
    }
    .copy-btn {
      padding: 6px 14px;
      background: #4a90a4;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .copy-btn:hover { background: #3d7a8c; }
    .copy-btn.copied {
      background: #28a745;
    }
    .signature-content {
      padding: 16px;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a2e;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      display: none;
    }
    .toast.show { display: block; }
  </style>
</head>
<body>
  <h1>Email Signatures</h1>
  <p class="subtitle">Generated ${new Date().toLocaleDateString()} - ${activeEmployees.length} signatures</p>

  ${signatures}

  <div class="toast" id="toast">Signature copied!</div>

  <script>
    const signatures = ${JSON.stringify(activeEmployees.map(emp => SignatureRenderer.render(emp, this.designOptions)))};

    function copySignature(index) {
      const html = signatures[index];
      const blob = new Blob([html], { type: 'text/html' });
      const item = new ClipboardItem({ 'text/html': blob });

      navigator.clipboard.write([item]).then(() => {
        showToast();
        const btn = document.querySelectorAll('.copy-btn')[index];
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback
        const temp = document.createElement('div');
        temp.innerHTML = html;
        document.body.appendChild(temp);
        const range = document.createRange();
        range.selectNode(temp);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        document.body.removeChild(temp);
        showToast();
      });
    }

    function showToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  </script>
</body>
</html>`;

    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signatures-preview.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Utils.showToast('Preview page downloaded', 'success');
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BulkCreator;
}
