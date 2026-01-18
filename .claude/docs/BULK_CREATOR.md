# Bulk Creator Specification

This document covers the bulk signature creation mode for generating multiple signatures at once.

Access via tab/segmented control at top of app: **"Create Signature"** | **"Bulk Create"**

---

## Step Indicator

Visual stepper at top showing progress:

**1. Design Template** → **2. Import Data** → **3. Preview & Export**

Highlight current step, show completed steps with checkmark.

---

## Step 1: Design Template

### Purpose
Set the "master" design that applies to all signatures in the batch.

### Controls
Same design options as single signature builder:
- Logo input (URL or Upload)
- Logo position (Left / Above)
- Logo size (Small / Medium / Large)
- Color pickers (Name, Title/Company, Links, Separator)
- Separator style dropdown

### Preview
Shows template with placeholder text:
```
[Name]
[Title] | [Company]
[Phone] | [Email]
[Address]
www.[website]
[Social Icons]
```

### Navigation
- **"Next"** button to proceed to Step 2

---

## Step 2: Import Employee Data

### Option A: CSV Upload

**"Download CSV Template" button**

Downloads `signature-template.csv` with these headers:
```csv
Name,Title,Email,Phone,Fax,Address1,Address2,City,State,ZIP,Company,Website,Facebook,Instagram,Twitter,LinkedIn,YouTube
```

Include 2-3 example rows as reference:
```csv
Name,Title,Email,Phone,Fax,Address1,Address2,City,State,ZIP,Company,Website,Facebook,Instagram,Twitter,LinkedIn,YouTube
John Smith,Software Engineer,john@company.com,5551234567,,123 Main St,Suite 100,Minneapolis,MN,55401,Acme Corp,www.acme.com,facebook.com/acme,instagram.com/acme,,linkedin.com/company/acme,
Jane Doe,Marketing Manager,jane@company.com,5559876543,5551111111,456 Oak Ave,,St. Paul,MN,55101,Acme Corp,www.acme.com,,,,linkedin.com/company/acme,youtube.com/@acme
```

**"Upload CSV" button / Drag-drop zone**

- File input accepting .csv files
- Or drag-and-drop area
- Parse CSV client-side

### CSV Parsing Rules
- First row must be headers (required)
- Handle quoted fields: `"Smith, John"` for values containing commas
- Empty cells are valid (field not populated for that employee)
- Trim whitespace from all values
- Show validation errors for:
  - Missing required "Name" field
  - Malformed CSV structure
  - Invalid file type

### Option B: Paste from Spreadsheet

**Large textarea** for pasting tab-separated data

- Instructions: "Copy rows from Excel or Google Sheets (including header row) and paste here"
- Parse on paste or on blur
- Same validation as CSV upload

### After Successful Import

- Show summary: "✓ Loaded 47 employees"
- Preview table showing first 5 rows with horizontal scroll
- Columns: Name, Title, Email, Phone (truncated if many columns)
- **"Back"** and **"Next"** buttons

---

## Step 3: Preview & Export

### Signature Grid

Scrollable grid/list displaying all generated signatures.

**Each signature card shows:**
- Employee name (card header)
- Full signature preview
- **"Copy"** button (copies individual signature)
- **"Remove"** button (×) to exclude from export

### Grid Controls

**Background Toggle:**
- Light / Dark buttons
- Applies to all signature previews at once
- Helps verify signatures look good in both email themes

**Search/Filter:**
- Text input to filter by employee name
- Useful for large batches

**Count Display:**
- "Showing 47 signatures" or "Showing 12 of 47 signatures" when filtered

### Export Options

**Primary: "Download All as ZIP"**

Creates ZIP file containing individual HTML files.

Filename format: `firstname-lastname.html`
- Lowercase
- Spaces/special characters replaced with hyphens
- Examples: `john-smith.html`, `jane-doe.html`, `mary-jane-watson.html`

ZIP file named: `signatures.zip` or `signatures-[date].zip`

**Secondary: "Download Preview Page"**

Creates single HTML file with all signatures displayed:
- Each signature labeled with employee name
- Each has a working "Copy" button (JavaScript in the HTML)
- Useful for manager approval or printing
- Styled nicely for review

### Progress Indicator

For large exports (50+ signatures):
- Show progress bar or spinner
- "Generating signatures..." → "Creating ZIP file..." → "Done!"

### Navigation
- **"Back"** button to return to Step 2
- **"Start Over"** button to reset and return to Step 1

---

## State Management

### Persist During Session
- Template design choices (Step 1)
- Imported employee data (Step 2)
- Removed employees (Step 3 exclusions)

### Clear On
- Clicking "Start Over"
- Refreshing the page (or offer to restore via sessionStorage)

### Do NOT Persist to localStorage
- Employee data (privacy - don't save names/emails/phones between sessions)

---

## Edge Cases

### Empty CSV
- Show error: "The uploaded file contains no data rows."

### CSV with Only Headers
- Show error: "The uploaded file contains headers but no employee data."

### Missing Name Column
- Show error: "CSV must include a 'Name' column."

### Duplicate Names
- Allow duplicates (same name, different signatures)
- Append number to filename: `john-smith.html`, `john-smith-2.html`

### Very Large Batches (500+ rows)
- Show warning: "Large batch detected. Export may take a moment."
- Consider chunking/async processing

### Special Characters in Names
- Names like "José García" or "O'Brien"
- Sanitize for filename: `jose-garcia.html`, `obrien.html`
- Preserve original in signature content
