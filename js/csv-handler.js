/**
 * CSV Handler Module
 * Handles CSV parsing, validation, and template generation
 */

const CsvHandler = {
  // Expected column headers (matches form fields)
  expectedHeaders: [
    'Name', 'Title', 'Department', 'Email', 'Phone', 'Mobile', 'Fax',
    'Address1', 'Address2', 'City', 'State', 'ZIP',
    'Company', 'Website', 'Calendar', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube',
    'Disclaimer'
  ],

  // Field name mapping (lowercase header to camelCase field)
  fieldMapping: {
    'name': 'name',
    'title': 'title',
    'department': 'department',
    'email': 'email',
    'phone': 'phone',
    'mobile': 'mobile',
    'fax': 'fax',
    'address1': 'address1',
    'address2': 'address2',
    'city': 'city',
    'state': 'state',
    'zip': 'zip',
    'company': 'company',
    'website': 'website',
    'calendar': 'calendar',
    'facebook': 'facebook',
    'instagram': 'instagram',
    'twitter': 'twitter',
    'linkedin': 'linkedin',
    'youtube': 'youtube',
    'disclaimer': 'disclaimer'
  },

  /**
   * Generate CSV template with example data
   * @returns {string} CSV content
   */
  generateTemplate() {
    const headers = this.expectedHeaders.join(',');
    const examples = [
      'John Smith,Software Engineer,Engineering,john@company.com,5551234567,5551234568,,123 Main St,Suite 100,Minneapolis,MN,55401,Acme Corp,www.acme.com,calendly.com/jsmith,facebook.com/acme,instagram.com/acme,,linkedin.com/company/acme,,',
      'Jane Doe,Marketing Manager,Marketing,jane@company.com,5559876543,5559876544,5551111111,456 Oak Ave,,St. Paul,MN,55101,Acme Corp,www.acme.com,,,,,linkedin.com/company/acme,youtube.com/@acme,"This email is confidential."'
    ];

    return headers + '\n' + examples.join('\n');
  },

  /**
   * Download CSV template file
   */
  downloadTemplate() {
    const content = this.generateTemplate();
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signature-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Parse CSV string into array of employee objects
   * @param {string} csvText - Raw CSV content
   * @returns {Object} { data: [], headers: [], error: null } or { data: [], headers: [], error: string }
   */
  parseCSV(csvText) {
    if (!csvText || !csvText.trim()) {
      return { data: [], headers: [], error: 'The uploaded file is empty.' };
    }

    const lines = this.splitLines(csvText);

    if (lines.length === 0) {
      return { data: [], headers: [], error: 'The uploaded file contains no data.' };
    }

    // Parse header row
    const headerLine = lines[0];
    const headers = this.parseLine(headerLine);

    if (headers.length === 0) {
      return { data: [], headers: [], error: 'Could not parse headers from the file.' };
    }

    // Validate required Name column
    const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
    if (nameIndex === -1) {
      return { data: [], headers: [], error: "CSV must include a 'Name' column." };
    }

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      const values = this.parseLine(line);
      const employee = this.mapRowToObject(headers, values);

      // Validate name field
      if (!employee.name || !employee.name.trim()) {
        continue; // Skip rows without a name
      }

      data.push(employee);
    }

    if (data.length === 0) {
      return { data: [], headers, error: 'The uploaded file contains headers but no valid employee data.' };
    }

    return { data, headers, error: null };
  },

  /**
   * Parse tab-separated data (from spreadsheet paste)
   * @param {string} tsvText - Raw TSV content
   * @returns {Object} { data: [], headers: [], error: null } or { data: [], headers: [], error: string }
   */
  parseTSV(tsvText) {
    if (!tsvText || !tsvText.trim()) {
      return { data: [], headers: [], error: 'No data to parse.' };
    }

    // Convert TSV to CSV format and parse
    const lines = tsvText.split(/\r?\n/).filter(line => line.trim());

    if (lines.length === 0) {
      return { data: [], headers: [], error: 'No data to parse.' };
    }

    // Auto-detect delimiter (tab vs comma)
    const firstLine = lines[0];
    const hasTab = firstLine.includes('\t');
    const delimiter = hasTab ? '\t' : ',';

    // Parse header row
    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));

    if (headers.length === 0) {
      return { data: [], headers: [], error: 'Could not parse headers from the data.' };
    }

    // Validate required Name column
    const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
    if (nameIndex === -1) {
      return { data: [], headers: [], error: "Data must include a 'Name' column." };
    }

    // Parse data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const employee = this.mapRowToObject(headers, values);

      if (!employee.name || !employee.name.trim()) {
        continue;
      }

      data.push(employee);
    }

    if (data.length === 0) {
      return { data: [], headers, error: 'The pasted data contains headers but no valid employee data.' };
    }

    return { data, headers, error: null };
  },

  /**
   * Split CSV content into lines, respecting quoted fields
   * @param {string} text - CSV content
   * @returns {string[]} Array of lines
   */
  splitLines(text) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentLine += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
          currentLine += char;
        }
      } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
        if (currentLine.trim()) {
          lines.push(currentLine);
        }
        currentLine = '';
        if (char === '\r') i++; // Skip \n in \r\n
      } else if (char !== '\r') {
        currentLine += char;
      }
    }

    if (currentLine.trim()) {
      lines.push(currentLine);
    }

    return lines;
  },

  /**
   * Parse a single CSV line into fields
   * @param {string} line - CSV line
   * @returns {string[]} Array of field values
   */
  parseLine(line) {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    fields.push(current.trim());
    return fields;
  },

  /**
   * Map header/value pairs to an employee object
   * @param {string[]} headers - Column headers
   * @param {string[]} values - Row values
   * @returns {Object} Employee object
   */
  mapRowToObject(headers, values) {
    const employee = {};

    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      const fieldName = this.fieldMapping[normalizedHeader];

      if (fieldName) {
        employee[fieldName] = values[index] ? values[index].trim() : '';
      }
    });

    return employee;
  },

  /**
   * Generate filename from employee name
   * @param {string} name - Employee name
   * @param {number} [duplicateIndex] - Index for duplicate names
   * @returns {string} Sanitized filename (without extension)
   */
  generateFilename(name, duplicateIndex = 0) {
    let filename = name
      .toLowerCase()
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens
      .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens

    if (!filename) {
      filename = 'signature';
    }

    if (duplicateIndex > 0) {
      filename += `-${duplicateIndex + 1}`;
    }

    return filename;
  },

  /**
   * Generate unique filenames for all employees
   * @param {Object[]} employees - Array of employee objects
   * @returns {Map} Map of employee index to filename
   */
  generateFilenames(employees) {
    const filenames = new Map();
    const usedNames = new Map(); // Track how many times each name appears

    employees.forEach((employee, index) => {
      const baseName = this.generateFilename(employee.name);

      // Check for duplicates
      const count = usedNames.get(baseName) || 0;
      usedNames.set(baseName, count + 1);

      if (count === 0) {
        filenames.set(index, baseName);
      } else {
        filenames.set(index, `${baseName}-${count + 1}`);
      }
    });

    return filenames;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CsvHandler;
}
