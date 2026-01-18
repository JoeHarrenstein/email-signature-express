/**
 * Signature Renderer Module
 * Generates HTML signature output with table-based layout
 */

const SignatureRenderer = {
  // Default colors (dark mode-safe values)
  defaults: {
    nameColor: '#2c3e50',
    titleColor: '#555555',
    linkColor: '#2980b9',
    separatorColor: '#555555',
    iconColor: '#2980b9',
    separatorStyle: 'pipe',
    logoPosition: 'left',
    logoSize: 'medium',
    addBackground: false,
    backgroundColor: '#ffffff',
    fontFamily: 'arial'
  },

  // Separator characters
  separators: {
    pipe: ' | ',
    bullet: ' \u2022 ',
    dash: ' \u2014 ',
    none: '  '
  },

  // Logo sizes in pixels
  logoSizes: {
    small: 60,
    medium: 100,
    large: 150
  },

  // Font family mappings for email-safe fonts
  fontFamilies: {
    arial: 'Arial, sans-serif',
    helvetica: 'Helvetica, Arial, sans-serif',
    georgia: 'Georgia, serif',
    times: 'Times New Roman, Times, serif',
    verdana: 'Verdana, Geneva, sans-serif',
    tahoma: 'Tahoma, Geneva, sans-serif'
  },

  // Social media icon SVGs - will be dynamically colored
  getSocialIcon(platform, color) {
    const icons = {
      facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
      instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0h-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.078 1.915-6.278 6.278-.058 1.28-.072 1.688-.072 4.948 0 3.259.014 3.668.072 4.948.2 4.358 1.915 6.078 6.278 6.278 1.28.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.073-1.915 6.278-6.278.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-1.915-6.073-6.278-6.278-1.28-.058-1.689-.072-4.948-.072zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>`,
      twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L.25 2.25H6.96l4.714 6.231zm-1.161 17.52h1.833L5.86 3.926H3.858z"/></svg>`,
      linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
      youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    };

    // Convert SVG to base64 data URI
    const svg = icons[platform] || '';
    if (!svg) return '';
    return 'data:image/svg+xml;base64,' + btoa(svg);
  },

  /**
   * Render signature HTML
   * @param {Object} data - Form data
   * @param {Object} options - Rendering options (colors, separator, logo, etc.)
   * @returns {string} HTML signature
   */
  render(data, options = {}) {
    const opts = { ...this.defaults, ...options };
    const separator = this.separators[opts.separatorStyle] || this.separators.pipe;
    const coloredSeparator = `<span style="color: ${opts.separatorColor};">${separator}</span>`;
    const fontStack = this.fontFamilies[opts.fontFamily] || this.fontFamilies.arial;

    // Build content sections
    const sections = [];

    // Line 1: Name (required)
    if (data.name?.trim()) {
      sections.push(this.renderName(data.name, opts.nameColor));
    }

    // Line 2: Title & Company
    const titleCompany = this.renderTitleCompany(data.title, data.company, coloredSeparator, opts.titleColor);
    if (titleCompany) sections.push(titleCompany);

    // Line 3: Department (NEW)
    const department = this.renderDepartment(data.department, opts.titleColor);
    if (department) sections.push(department);

    // Line 4: Contact (Phone, Mobile, Fax, Email)
    const contact = this.renderContact(data.phone, data.mobile, data.fax, data.email, coloredSeparator, opts.titleColor, opts.linkColor);
    if (contact) sections.push(contact);

    // Line 5: Address (uses plain separator since paragraph has color)
    const address = this.renderAddress(data, separator, opts.titleColor);
    if (address) sections.push(address);

    // Line 6: Website
    const website = this.renderWebsite(data.website, opts.linkColor);
    if (website) sections.push(website);

    // Line 7: Calendar/Booking Link (NEW)
    const calendar = this.renderCalendar(data.calendar, opts.linkColor);
    if (calendar) sections.push(calendar);

    // Line 8: Social icons (uses iconColor, falls back to linkColor)
    const social = this.renderSocial(data, opts.iconColor || opts.linkColor);
    if (social) sections.push(social);

    // Line 9: Legal Disclaimer (NEW)
    const disclaimer = this.renderDisclaimer(data.disclaimer, opts.titleColor);
    if (disclaimer) sections.push(disclaimer);

    const content = sections.join('');

    // Check if we have a logo
    const logoSrc = opts.logoData || opts.logoUrl;
    let signatureHtml;

    if (logoSrc) {
      const logoWidth = this.logoSizes[opts.logoSize] || this.logoSizes.medium;
      const websiteHref = data.website ? Formatters.formatWebsiteHref(data.website) : '';

      if (opts.logoPosition === 'top') {
        signatureHtml = this.wrapWithLogoTop(content, logoSrc, logoWidth, websiteHref, fontStack);
      } else {
        signatureHtml = this.wrapWithLogoLeft(content, logoSrc, logoWidth, websiteHref, fontStack);
      }
    } else {
      // No logo - simple table
      signatureHtml = this.wrapInTable(content, fontStack);
    }

    // Wrap with background if enabled
    if (opts.addBackground) {
      signatureHtml = this.wrapWithBackground(signatureHtml, opts.backgroundColor || '#ffffff');
    }

    return signatureHtml;
  },

  /**
   * Wrap signature with background container for dark mode compatibility
   */
  wrapWithBackground(signatureHtml, backgroundColor) {
    return `<table cellpadding="0" cellspacing="0" border="0" style="background-color: ${backgroundColor}; border-radius: 4px;">
  <tr>
    <td style="padding: 12px;">
${signatureHtml}
    </td>
  </tr>
</table>`;
  },

  /**
   * Wrap content in email-compatible table (no logo)
   */
  wrapInTable(content, fontStack = 'Arial, sans-serif') {
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; font-size: 14px; line-height: 1.4; color: #333333;">
  <tr>
    <td style="vertical-align: top;">
${content}
    </td>
  </tr>
</table>`;
  },

  /**
   * Wrap content with logo on the left
   */
  wrapWithLogoLeft(content, logoSrc, logoWidth, websiteHref, fontStack = 'Arial, sans-serif') {
    const logoImg = `<img src="${logoSrc}" alt="Logo" width="${logoWidth}" style="display: block; border: 0;">`;
    const logoCell = websiteHref
      ? `<a href="${websiteHref}" style="text-decoration: none;">${logoImg}</a>`
      : logoImg;

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; font-size: 14px; line-height: 1.4; color: #333333;">
  <tr>
    <td style="vertical-align: top; padding-right: 15px;">
      ${logoCell}
    </td>
    <td style="vertical-align: top;">
${content}
    </td>
  </tr>
</table>`;
  },

  /**
   * Wrap content with logo above
   */
  wrapWithLogoTop(content, logoSrc, logoWidth, websiteHref, fontStack = 'Arial, sans-serif') {
    const logoImg = `<img src="${logoSrc}" alt="Logo" width="${logoWidth}" style="display: block; border: 0;">`;
    const logoCell = websiteHref
      ? `<a href="${websiteHref}" style="text-decoration: none;">${logoImg}</a>`
      : logoImg;

    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: ${fontStack}; font-size: 14px; line-height: 1.4; color: #333333;">
  <tr>
    <td style="padding-bottom: 10px;">
      ${logoCell}
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top;">
${content}
    </td>
  </tr>
</table>`;
  },

  /**
   * Render name line
   */
  renderName(name, color) {
    const escapedName = Utils.escapeHtml(name.trim());
    return `      <p style="margin: 0 0 2px 0; font-weight: bold; font-size: 16px; color: ${color};">${escapedName}</p>\n`;
  },

  /**
   * Render title and company line
   */
  renderTitleCompany(title, company, separator, color) {
    const parts = [];
    if (title?.trim()) parts.push(Utils.escapeHtml(title.trim()));
    if (company?.trim()) parts.push(Utils.escapeHtml(company.trim()));

    if (parts.length === 0) return '';

    return `      <p style="margin: 0 0 8px 0; color: ${color};">${parts.join(separator)}</p>\n`;
  },

  /**
   * Render department line
   */
  renderDepartment(department, color) {
    if (!department?.trim()) return '';
    return `      <p style="margin: 0 0 8px 0; color: ${color};">${Utils.escapeHtml(department.trim())}</p>\n`;
  },

  /**
   * Render contact line (phone, mobile, fax, email)
   * Splits into multiple lines if more than 2 items to avoid overly long lines on mobile
   */
  renderContact(phone, mobile, fax, email, separator, textColor, linkColor) {
    const parts = [];

    if (phone?.trim()) {
      parts.push(Utils.escapeHtml(Formatters.formatPhone(phone)));
    }

    if (mobile?.trim()) {
      parts.push(`M: ${Utils.escapeHtml(Formatters.formatPhone(mobile))}`);
    }

    if (fax?.trim()) {
      parts.push(`Fax: ${Utils.escapeHtml(Formatters.formatPhone(fax))}`);
    }

    if (email?.trim()) {
      const escapedEmail = Utils.escapeHtml(email.trim());
      parts.push(`<a href="mailto:${escapedEmail}" style="color: ${linkColor}; text-decoration: none;">${escapedEmail}</a>`);
    }

    if (parts.length === 0) return '';

    // If 2 or fewer items, keep on one line
    if (parts.length <= 2) {
      return `      <p style="margin: 0 0 4px 0; color: ${textColor};">${parts.join(separator)}</p>\n`;
    }

    // If more than 2 items, split into multiple lines (2 items per line max)
    const lines = [];
    for (let i = 0; i < parts.length; i += 2) {
      const lineParts = parts.slice(i, i + 2);
      lines.push(lineParts.join(separator));
    }

    return lines.map((line, index) => {
      const margin = index === lines.length - 1 ? '4px' : '2px';
      return `      <p style="margin: 0 0 ${margin} 0; color: ${textColor};">${line}</p>\n`;
    }).join('');
  },

  /**
   * Render address line(s)
   * If total length < 40 chars, single line; otherwise splits into separate lines
   */
  renderAddress(data, separator, color) {
    // Gather the parts
    const address1 = data.address1?.trim() || '';
    const address2 = data.address2?.trim() || '';
    const city = data.city?.trim() || '';
    const state = data.state?.trim() || '';
    const zip = data.zip?.trim() || '';

    // Build city/state/zip string
    let cityStateZip = '';
    if (city) {
      cityStateZip = city;
      if (state || zip) {
        cityStateZip += ', ';
      }
    }
    if (state) {
      cityStateZip += state;
      if (zip) {
        cityStateZip += ' ';
      }
    }
    if (zip) {
      cityStateZip += zip;
    }

    // Collect non-empty parts
    const parts = [address1, address2, cityStateZip].filter(p => p);

    if (parts.length === 0) return '';

    // Calculate total length (with separators)
    const totalLength = parts.join(separator).length;

    // If short enough, put on one line
    if (totalLength < 40) {
      const combined = parts.map(p => Utils.escapeHtml(p)).join(separator);
      return `      <p style="margin: 0 0 8px 0; color: ${color};">${combined}</p>\n`;
    }

    // Otherwise, split into separate lines
    return parts.map((part, index) => {
      const margin = index === parts.length - 1 ? '8px' : '2px';
      return `      <p style="margin: 0 0 ${margin} 0; color: ${color};">${Utils.escapeHtml(part)}</p>\n`;
    }).join('');
  },

  /**
   * Render website line
   */
  renderWebsite(website, color) {
    if (!website?.trim()) return '';

    const display = Formatters.formatWebsiteDisplay(website);
    const href = Formatters.formatWebsiteHref(website);

    return `      <p style="margin: 0 0 8px 0;"><a href="${href}" style="color: ${color}; text-decoration: none;">${Utils.escapeHtml(display)}</a></p>\n`;
  },

  /**
   * Render calendar/booking link
   */
  renderCalendar(calendar, color) {
    if (!calendar?.trim()) return '';

    const display = Formatters.formatWebsiteDisplay(calendar);
    const href = Formatters.formatWebsiteHref(calendar);

    return `      <p style="margin: 0 0 8px 0;"><a href="${href}" style="color: ${color}; text-decoration: none;">&#128197; Schedule a Meeting</a></p>\n`;
  },

  /**
   * Render social icons
   */
  renderSocial(data, linkColor) {
    const platforms = [
      { key: 'facebook', alt: 'Facebook' },
      { key: 'instagram', alt: 'Instagram' },
      { key: 'twitter', alt: 'X' },
      { key: 'linkedin', alt: 'LinkedIn' },
      { key: 'youtube', alt: 'YouTube' }
    ];

    const activeIcons = platforms.filter(p => data[p.key]?.trim());

    if (activeIcons.length === 0) return '';

    const icons = activeIcons.map(p => {
      const url = Formatters.formatSocialUrl(data[p.key]);
      const iconSrc = this.getSocialIcon(p.key, linkColor);
      return `<a href="${url}" style="text-decoration: none; margin-right: 8px;"><img src="${iconSrc}" alt="${p.alt}" width="20" height="20" style="display: inline-block; vertical-align: middle; border: 0;"></a>`;
    }).join('\n        ');

    return `      <p style="margin: 0;">\n        ${icons}\n      </p>\n`;
  },

  /**
   * Render legal disclaimer
   */
  renderDisclaimer(disclaimer, color) {
    if (!disclaimer?.trim()) return '';

    const lines = disclaimer.trim().split(/\n/).map(line =>
      Utils.escapeHtml(line.trim())
    ).filter(line => line);

    if (lines.length === 0) return '';

    return `      <p style="margin: 16px 0 0 0; font-size: 10px; line-height: 1.3; color: ${color}; font-style: italic;">${lines.join('<br>')}</p>\n`;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SignatureRenderer;
}
