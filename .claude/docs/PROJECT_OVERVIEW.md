# Email Signature Generator - Project Overview

## Vision

A free, open-source web-based email signature generator that runs entirely client-side. No server required, no data leaves the user's computer. Downloadable from GitHub and works by simply opening `index.html` in any modern browser.

**Target Users:**
- Individual employees creating their own professional signature
- IT/HR departments creating consistent signatures for entire teams via bulk creation

**Deployment Flexibility:**
- Run locally by downloading and opening index.html
- Host on GitHub Pages, Netlify, or any static hosting
- Deploy to company intranet for internal use

---

## Technology Stack

- **Pure HTML5, CSS3, JavaScript (ES6+)** - No frameworks, no build step required
- **No external dependencies** except:
  - JSZip library for ZIP file creation (bundle locally for offline use)
- **localStorage** for persisting user design preferences
- **Clipboard API** for copy functionality (with fallback)
- **FileReader API** for CSV and image upload handling

---

## File Structure

```
email-signature-generator/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js              # Main app initialization, theme handling, tab switching
│   ├── signature-builder.js # Single signature form and preview logic
│   ├── bulk-creator.js     # Bulk creation mode logic
│   ├── signature-renderer.js # Generates HTML signature output
│   ├── csv-handler.js      # CSV parsing and template generation
│   ├── formatters.js       # Phone, URL, address formatting utilities
│   └── utils.js            # Clipboard, localStorage, ZIP utilities
├── assets/
│   └── icons/              # Social media icons (base64 or small PNGs)
│       ├── facebook.png
│       ├── instagram.png
│       ├── x-twitter.png
│       ├── linkedin.png
│       ├── youtube.png
│       └── email.png
├── templates/
│   └── signature-template.csv
└── README.md
```

---

## Implementation Phases

Build in this order, testing each phase before moving to the next:

### Phase 1: Core Single Signature
- Basic form with all fields
- Live preview that updates as user types
- Copy to clipboard functionality
- Phone and URL auto-formatting
- Conditional field rendering (no orphan separators)

**Reference:** `SINGLE_SIGNATURE.md`, `SIGNATURE_OUTPUT.md`

### Phase 2: Design Customization
- Logo input (URL and file upload with base64 conversion)
- Logo position (left/above) and size options
- Color pickers for name, title, links, separators
- Separator style dropdown
- localStorage persistence of design preferences

**Reference:** `SINGLE_SIGNATURE.md` (Logo & Design sections), `DESIGN_SYSTEM.md`

### Phase 3: App Theming
- Light/Dark mode toggle for app interface
- System preference detection
- Independent light/dark toggle for signature preview background
- CSS custom properties for theme tokens

**Reference:** `DESIGN_SYSTEM.md`

### Phase 4: Bulk Creation Mode
- Template designer (same options as single builder)
- CSV template download
- CSV upload and parsing
- Paste from spreadsheet option
- Preview grid of all signatures
- Export as ZIP of individual HTML files
- Export as single preview page

**Reference:** `BULK_CREATOR.md`

### Phase 5: Polish & Documentation
- Fade-up animations on load
- "How to Import" modal with email client instructions
- Accessibility audit and fixes
- Mobile optimization
- Final README and documentation

**Reference:** `DESIGN_SYSTEM.md`, `TESTING_CHECKLIST.md`, `README_TEMPLATE.md`

---

## Specification Documents

| Document | Purpose |
|----------|---------|
| `SINGLE_SIGNATURE.md` | Form fields, inputs, logo options, design controls, preview, actions |
| `BULK_CREATOR.md` | CSV handling, multi-step wizard, preview grid, export options |
| `SIGNATURE_OUTPUT.md` | HTML structure, inline styles, conditional rendering, examples |
| `DESIGN_SYSTEM.md` | Colors, theming, component styles, animations, accessibility |
| `TESTING_CHECKLIST.md` | QA checklist, browser compatibility, test cases |
| `README_TEMPLATE.md` | User-facing README for the final GitHub repository |

---

## Key Technical Decisions

1. **Table-based HTML output** - For maximum email client compatibility
2. **Inline styles only** - No external CSS in signature output
3. **Base64 logo option** - So signatures work without external hosting
4. **No personal data persistence** - Only design preferences saved (privacy)
5. **Bundled JSZip** - Works offline, no CDN dependency
6. **US phone formatting** - Auto-format to (XXX) XXX-XXXX pattern
7. **Two-letter state codes** - Dropdown with US state abbreviations

---

## Browser Support

Target modern browsers (last 2 versions):
- Chrome (recommended)
- Firefox
- Safari
- Edge

Required APIs: Clipboard API, FileReader, localStorage, CSS Custom Properties, Flexbox/Grid
