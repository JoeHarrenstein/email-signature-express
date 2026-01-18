/**
 * Formatters Module
 * Phone, URL, and address formatting utilities
 */

const Formatters = {
  /**
   * Format phone number to (XXX) XXX-XXXX for US numbers
   * @param {string} phone - Raw phone input
   * @returns {string} Formatted phone number
   */
  formatPhone(phone) {
    if (!phone) return '';

    // Strip all non-numeric characters
    const digits = phone.replace(/\D/g, '');

    // If 11 digits starting with 1, drop the leading 1
    const normalized = (digits.length === 11 && digits.startsWith('1'))
      ? digits.slice(1)
      : digits;

    // If exactly 10 digits, format as (XXX) XXX-XXXX
    if (normalized.length === 10) {
      return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
    }

    // Otherwise return original (international or other format)
    return phone.trim();
  },

  /**
   * Format website URL for display (strip protocol, ensure www., remove trailing slash)
   * @param {string} url - Raw URL input
   * @returns {string} Display-formatted URL
   */
  formatWebsiteDisplay(url) {
    if (!url) return '';

    let formatted = url.trim();

    // Remove protocol
    formatted = formatted.replace(/^https?:\/\//, '');

    // Add www. if not present and not a subdomain
    if (!formatted.startsWith('www.') && !formatted.includes('.') === false) {
      // Check if it's just domain.com (not subdomain.domain.com)
      const parts = formatted.split('/')[0].split('.');
      if (parts.length === 2 || (parts.length > 2 && parts[0] !== 'www')) {
        // Only add www. to simple domains
        if (parts.length === 2) {
          formatted = 'www.' + formatted;
        }
      }
    }

    // Ensure www. prefix if domain starts without it
    if (!formatted.startsWith('www.')) {
      const domainPart = formatted.split('/')[0];
      const domainParts = domainPart.split('.');
      // Add www. only for simple two-part domains
      if (domainParts.length === 2) {
        formatted = 'www.' + formatted;
      }
    }

    // Remove trailing slash
    formatted = formatted.replace(/\/$/, '');

    return formatted;
  },

  /**
   * Format website URL for href (ensure https://)
   * @param {string} url - Raw URL input
   * @returns {string} Href-formatted URL
   */
  formatWebsiteHref(url) {
    if (!url) return '';

    let formatted = url.trim();

    // Remove existing protocol
    formatted = formatted.replace(/^https?:\/\//, '');

    // Add https://
    return 'https://' + formatted;
  },

  /**
   * Format address from components
   * @param {Object} addressParts - Address components
   * @param {string} addressParts.address1
   * @param {string} addressParts.address2
   * @param {string} addressParts.city
   * @param {string} addressParts.state
   * @param {string} addressParts.zip
   * @param {string} separator - Separator character (default: ' | ')
   * @returns {string} Formatted address
   */
  formatAddress({ address1, address2, city, state, zip }, separator = ' | ') {
    const parts = [];

    if (address1?.trim()) {
      parts.push(address1.trim());
    }

    if (address2?.trim()) {
      parts.push(address2.trim());
    }

    // Build city/state/zip part
    const locationParts = [];
    if (city?.trim()) {
      locationParts.push(city.trim());
    }

    let stateZip = '';
    if (state?.trim()) {
      stateZip = state.trim();
    }
    if (zip?.trim()) {
      stateZip = stateZip ? `${stateZip} ${zip.trim()}` : zip.trim();
    }

    if (locationParts.length > 0 && stateZip) {
      parts.push(`${locationParts.join(', ')}, ${stateZip}`);
    } else if (locationParts.length > 0) {
      parts.push(locationParts.join(', '));
    } else if (stateZip) {
      parts.push(stateZip);
    }

    return parts.join(separator);
  },

  /**
   * Ensure social media URL has https:// protocol
   * @param {string} url - Social media URL
   * @returns {string} URL with protocol
   */
  formatSocialUrl(url) {
    if (!url) return '';

    let formatted = url.trim();

    // If already has protocol, return as-is
    if (formatted.match(/^https?:\/\//)) {
      return formatted;
    }

    // Add https://
    return 'https://' + formatted;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Formatters;
}
