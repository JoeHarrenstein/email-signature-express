# Email Signature Generator

## Project Overview

A free, open-source email signature generator that runs entirely client-side. No server required, no data leaves the user's computer. Users can download from GitHub and run by simply opening `index.html` in a browser.

**Full specifications are in `.claude/docs/` - read `PROJECT_OVERVIEW.md` first.**

## Documentation Structure

All detailed specifications are in `.claude/docs/`:

| File | Purpose |
|------|---------|
| `PROJECT_OVERVIEW.md` | **Start here.** Vision, tech stack, file structure, implementation phases |
| `SINGLE_SIGNATURE.md` | Form fields, input formatting (phone/URL/address), logo options, design controls, preview |
| `BULK_CREATOR.md` | CSV template, upload/parsing, 3-step wizard, preview grid, ZIP export |
| `SIGNATURE_OUTPUT.md` | HTML structure, table-based layout, conditional rendering, email client compatibility |
| `DESIGN_SYSTEM.md` | Colors, CSS custom properties, components, theming (light/dark), animations, accessibility |
| `TESTING_CHECKLIST.md` | Comprehensive QA checklist for all features |
| `README_TEMPLATE.md` | User-facing README for the final GitHub repo |

## Tech Stack

- **Pure HTML5, CSS3, JavaScript (ES6+)** - No frameworks, no build step
- **No external dependencies** except JSZip (bundled locally for ZIP export)
- **localStorage** for persisting design preferences
- **Clipboard API** for copy functionality
- **FileReader API** for CSV and image upload

## File Structure

```
email-signature-express/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js              # Main app initialization, theme handling
│   ├── signature-builder.js # Single signature form and preview
│   ├── bulk-creator.js     # Bulk creation mode
│   ├── signature-renderer.js # Generates HTML signature output
│   ├── csv-handler.js      # CSV parsing and template generation
│   ├── formatters.js       # Phone, URL, address formatting
│   └── utils.js            # Clipboard, localStorage, ZIP utilities
├── assets/
│   └── icons/              # Social media icons (base64 or small PNGs)
├── templates/
│   └── signature-template.csv
├── .claude/
│   └── docs/               # Project specifications
├── CLAUDE.md               # This file
└── README.md
```

## Current Phase

**Phase 1: Core Single Signature Builder**

Focus on:
1. Basic form with all input fields (Name, Title, Email, Phone, Fax, Address 1/2, City, State dropdown, ZIP, Company, Website, Social links)
2. Live preview pane that updates as user types
3. Copy to clipboard functionality
4. Phone number auto-formatting: any input → (XXX) XXX-XXXX
5. Website URL formatting: strip protocol for display, ensure www. prefix
6. Conditional field rendering - only show populated fields, no orphan separators

See `SINGLE_SIGNATURE.md` and `SIGNATURE_OUTPUT.md` for complete details.

## Implementation Phases

1. **Phase 1: Core Single Signature** - Form, preview, copy, formatting ← CURRENT
2. **Phase 2: Design Customization** - Logo upload, colors, separators, localStorage
3. **Phase 3: App Theming** - Light/dark mode, preview background toggle
4. **Phase 4: Bulk Creation** - CSV import, batch preview, ZIP export
5. **Phase 5: Polish** - Animations, "How to Import" modal, accessibility, README

## Key Constraints

### Must Follow
- **No build step** - App works by opening index.html directly
- **No frameworks** - Pure vanilla JavaScript only
- **Table-based HTML output** - For email client compatibility
- **Inline styles only** in signature output - No external CSS
- **Conditional rendering** - Never show empty fields or orphan separators
- **Base64 logo option** - So signatures work without external image hosting

### Formatting Rules

**Phone Numbers:**
- Strip non-numeric, format as (XXX) XXX-XXXX for 10-digit US numbers
- Leave international numbers unchanged

**Website URLs:**
- Display: `www.company.com` (strip protocol, ensure www.)
- Link href: Always use `https://`

**Address:**
- Combine: `{Address1} | {Address2} | {City}, {State} {ZIP}`
- Only show populated components, no empty separators

### US State Dropdown
AL, AK, AZ, AR, CA, CO, CT, DE, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY, DC

## Testing

Open `index.html` in a browser to test. No dev server needed.

Test cases to verify:
- All fields empty except Name → minimal signature renders
- All fields populated → full signature renders
- Various empty field combinations → no orphan separators
- Copy button → HTML copied to clipboard
- Paste into Gmail/Outlook → signature displays correctly

## Commands

```bash
# No build commands needed - just open in browser
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux

# Or use VS Code Live Server extension for auto-refresh during development
```

## Notes

- The frontend-design plugin is installed to help create polished, distinctive UI
- Focus on clean, minimal aesthetic with warm muted colors
- Rounded inputs (8px border-radius), subtle shadows, smooth transitions
- Support both light and dark app themes
- Preview background toggle (independent of app theme) to test signature appearance
