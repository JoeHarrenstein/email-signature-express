# Single Signature Builder Specification

This document covers the main signature creation interface - the default view when the app loads.

---

## Form Layout

Organize the form into clear sections with subtle visual separation.

### Section: Personal Information

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Name | Text input | Yes | "Jane Smith" |
| Title | Text input | No | "Marketing Manager" |
| Email | Email input | No | "jane@company.com" |

### Section: Contact Details

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Phone | Text input | No | "5551234567" |
| Fax | Text input | No | "5551234568" |
| Address 1 | Text input | No | "123 Main Street" |
| Address 2 | Text input | No | "Suite 400" |
| City | Text input | No | "Minneapolis" |
| State | Dropdown | No | Two-letter abbreviations |
| ZIP | Text input | No | "55401" |

**US State Dropdown Options:**
AL, AK, AZ, AR, CA, CO, CT, DE, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY, DC

### Section: Company Information

| Field | Type | Required | Placeholder |
|-------|------|----------|-------------|
| Company Name | Text input | No | "Acme Corporation" |
| Website | Text input | No | "www.company.com" |

### Section: Social Links

Display as a row of icon buttons. When clicked, each reveals a text input field.

| Platform | Placeholder |
|----------|-------------|
| Facebook | "facebook.com/company" |
| Instagram | "instagram.com/company" |
| X (Twitter) | "x.com/company" |
| LinkedIn | "linkedin.com/company" |
| YouTube | "youtube.com/@company" |

---

## Form Input Behavior

### Clear Buttons
- Each populated input shows a small (×) button on the right side
- Click clears the field and returns focus to it
- Only visible when input has content

### Validation
- Email field validates format on blur
- Phone accepts any format (will be auto-formatted)
- Name field shows subtle "required" indicator

### Auto-Formatting on Blur

**Phone Numbers:**

| User Input | Formatted Output |
|------------|------------------|
| 5071234567 | (507) 123-4567 |
| 507-123-4567 | (507) 123-4567 |
| 507.123.4567 | (507) 123-4567 |
| (507) 123-4567 | (507) 123-4567 |
| 15071234567 | (507) 123-4567 |
| +1 507 123 4567 | (507) 123-4567 |
| 44 20 7946 0958 | 44 20 7946 0958 (unchanged - international) |

**Logic:**
1. Strip all non-numeric characters
2. If 10 digits: format as `(XXX) XXX-XXXX`
3. If 11 digits starting with 1: drop leading 1, format as `(XXX) XXX-XXXX`
4. Otherwise: leave as-is (international or extension)

**Website URLs:**

| User Input | Display | Link href |
|------------|---------|-----------|
| https://www.company.com | www.company.com | https://www.company.com |
| http://company.com | www.company.com | https://www.company.com |
| www.company.com | www.company.com | https://www.company.com |
| company.com | www.company.com | https://www.company.com |
| https://company.com/page/ | www.company.com/page | https://company.com/page |

**Logic:**
1. Remove `http://` or `https://` for display
2. Ensure `www.` prefix for display
3. Remove trailing slash for display
4. Always use `https://` for the actual link href

**Address Formatting:**

Combine fields with separators:
- Full: `{Address1} | {Address2} | {City}, {State} {ZIP}`
- No Address2: `{Address1} | {City}, {State} {ZIP}`
- Only City/State/ZIP: `{City}, {State} {ZIP}`

Only show components that have values. Separator only appears between populated fields.

---

## Logo Section

Two-tab interface for logo input:

### Tab: URL
- Text input for image URL
- Placeholder: "https://company.com/logo.png"
- Help text: "Enter the URL of your logo image. Must be publicly accessible."

### Tab: Upload
- File input accepting: .png, .jpg, .jpeg, .gif, .svg
- On file select: convert to base64 data URI
- Show small preview thumbnail of uploaded image
- Help text: "Logo will be embedded in the signature. Recommended: PNG with transparent background, max 200px wide."

### Logo Options (shown below tabs)

**Position:** Toggle or radio buttons
- "Left of signature"
- "Above signature"

**Size:** Slider or preset buttons
- Small (60px width)
- Medium (100px width)
- Large (150px width)

---

## Design Options

Collapsible section (collapsed by default for simplicity).

### Color Pickers

| Setting | Default | Applied To |
|---------|---------|------------|
| Name Color | #1a1a2e | Name text |
| Title/Company Color | #6c757d | Title, company name, address |
| Link Color | #4a90a4 | Website, email, social icons |
| Separator Color | #6c757d | Separator characters |

### Separator Style Dropdown

- Pipe: ` | `
- Bullet: ` • `
- Dash: ` — `
- None (space only)

---

## Live Preview Pane

### Layout
- **Desktop:** Right side, side-by-side with form
- **Mobile:** Below the form

### Behavior
- Updates in real-time as user types
- Debounce input for performance (150-200ms)
- Shows exactly what the signature will look like

### Background Toggle
Independent of app theme - allows testing signature appearance:
- **Light background** button (#ffffff)
- **Dark background** button (#1a1a2e)

This simulates how the signature looks in different email clients (light mode Gmail vs dark mode Outlook, etc.).

---

## Action Buttons

### Primary: "Copy Signature"
- Copies the signature HTML to clipboard
- Uses Clipboard API with execCommand fallback
- Shows success toast: "✓ Signature copied! Ready to paste into your email client."

### Secondary: "How to Import"
Opens modal dialog with tabbed interface:
- **Gmail** tab
- **Outlook Desktop** tab
- **Outlook Mobile** tab
- **Apple Mail (Mac)** tab
- **Apple Mail (iOS)** tab

Each tab contains step-by-step instructions (placeholder content initially - to be filled in later).

Include note: "You may need to paste as 'rich text' or use browser paste (Ctrl+V / Cmd+V), not plain text paste."

---

## Data Persistence (localStorage)

**Save these design preferences:**
- `sig_logoPosition`: "left" | "top"
- `sig_logoSize`: "small" | "medium" | "large"
- `sig_nameColor`: hex color
- `sig_titleColor`: hex color
- `sig_linkColor`: hex color
- `sig_separatorColor`: hex color
- `sig_separatorStyle`: "pipe" | "bullet" | "dash" | "none"
- `sig_logoData`: base64 data URI (if uploaded)
- `sig_logoUrl`: URL string (if using URL mode)

**Do NOT save:**
- Personal information (Name, Email, Phone, etc.) - privacy consideration

---

## Social Media Icons

Bundle these icons (20x20px, simple/monochrome design):
1. Facebook (f logo)
2. Instagram (camera icon)
3. X/Twitter (X logo)
4. LinkedIn (in logo)
5. YouTube (play button)
6. Email (envelope)

Store as base64 strings in JavaScript constants. Use as data URIs in signature output.

Icons should work on both light and dark backgrounds.
