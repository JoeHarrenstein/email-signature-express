# Testing Checklist

Use this checklist to verify the app works correctly before release.

---

## Single Signature Builder

### Form Inputs
- [ ] All text inputs accept and display text correctly
- [ ] Clear (×) buttons appear when input has content
- [ ] Clear buttons remove content and refocus input
- [ ] State dropdown shows all US state abbreviations
- [ ] Email input shows validation error for invalid format
- [ ] Required indicator appears on Name field
- [ ] Placeholder text displays correctly in all fields

### Phone Formatting
- [ ] `5071234567` → `(507) 123-4567`
- [ ] `507-123-4567` → `(507) 123-4567`
- [ ] `507.123.4567` → `(507) 123-4567`
- [ ] `(507) 123-4567` → `(507) 123-4567` (unchanged)
- [ ] `15071234567` → `(507) 123-4567` (drops leading 1)
- [ ] `+1 507 123 4567` → `(507) 123-4567`
- [ ] `44 20 7946 0958` → `44 20 7946 0958` (international unchanged)

### Website Formatting
- [ ] `https://www.company.com` displays as `www.company.com`
- [ ] `http://company.com` displays as `www.company.com`
- [ ] `www.company.com` displays as `www.company.com`
- [ ] `company.com` displays as `www.company.com`
- [ ] Links use `https://` in href

### Logo
- [ ] URL input accepts URL and displays in preview
- [ ] Upload accepts PNG, JPG, GIF, SVG files
- [ ] Uploaded image converts to base64 and displays
- [ ] Logo position "Left" places logo beside content
- [ ] Logo position "Above" places logo above content
- [ ] Logo size Small shows 60px width
- [ ] Logo size Medium shows 100px width
- [ ] Logo size Large shows 150px width

### Design Options
- [ ] Color pickers open and allow color selection
- [ ] Name color changes name text in preview
- [ ] Title/Company color changes relevant text
- [ ] Link color changes website and email links
- [ ] Separator dropdown offers: Pipe, Bullet, Dash, None
- [ ] Selected separator appears in preview

### Live Preview
- [ ] Preview updates as user types (debounced)
- [ ] Light background toggle shows white background
- [ ] Dark background toggle shows dark background
- [ ] Preview accurately represents final signature

### Conditional Rendering
- [ ] Name only → minimal signature, no errors
- [ ] Name + Phone + Email → single contact line with separator
- [ ] Title without Company → shows title alone
- [ ] Company without Title → shows company alone
- [ ] Title + Company → shows both with separator
- [ ] No Fax → contact line has no gap
- [ ] No Address2 → address line has no gap
- [ ] No social links → social section doesn't render
- [ ] One social link → only that icon appears
- [ ] All fields populated → full signature renders

### Actions
- [ ] "Copy Signature" copies HTML to clipboard
- [ ] Success toast appears after copy
- [ ] "How to Import" opens modal
- [ ] Modal tabs switch between email clients
- [ ] Modal close button works
- [ ] Escape key closes modal

---

## Bulk Creator

### Step 1: Design Template
- [ ] All design controls work (same as single builder)
- [ ] Preview shows placeholders like [Name], [Title]
- [ ] "Next" button advances to Step 2

### Step 2: Import Data
- [ ] "Download CSV Template" downloads correct file
- [ ] CSV template has all required headers
- [ ] "Upload CSV" accepts .csv files
- [ ] Valid CSV parses and shows row count
- [ ] Invalid CSV shows error message
- [ ] Missing Name column shows error
- [ ] Empty CSV shows error
- [ ] Paste from spreadsheet works with tab-separated data
- [ ] "Back" returns to Step 1
- [ ] "Next" advances to Step 3

### Step 3: Preview & Export
- [ ] All signatures display in grid
- [ ] Each card shows employee name
- [ ] Each card has working "Copy" button
- [ ] "Remove" button removes signature from list
- [ ] Light/Dark toggle changes all preview backgrounds
- [ ] Search filters signatures by name
- [ ] "Download All as ZIP" downloads .zip file
- [ ] ZIP contains individual .html files
- [ ] Files named correctly (firstname-lastname.html)
- [ ] "Download Preview Page" downloads single HTML
- [ ] Preview page shows all signatures
- [ ] Preview page copy buttons work

---

## Theming

### App Theme
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Toggle switches between modes
- [ ] System preference detected on first load
- [ ] Theme preference persists after refresh

### localStorage
- [ ] Design preferences save on change
- [ ] Preferences restore on page reload
- [ ] Logo data persists (if uploaded)
- [ ] Personal info does NOT persist (privacy)

---

## Responsiveness

### Desktop (>1024px)
- [ ] Form and preview display side-by-side
- [ ] All controls accessible

### Tablet (768-1024px)
- [ ] Layout stacks appropriately
- [ ] Touch targets adequate size

### Mobile (<768px)
- [ ] Single column layout
- [ ] All functionality accessible
- [ ] No horizontal scrolling
- [ ] Inputs don't zoom page (16px font)

---

## Browser Compatibility

Test in each browser:

### Chrome
- [ ] All features work
- [ ] Clipboard API functions
- [ ] File upload works
- [ ] ZIP download works

### Firefox
- [ ] All features work
- [ ] Clipboard API functions
- [ ] File upload works
- [ ] ZIP download works

### Safari
- [ ] All features work
- [ ] Clipboard API functions (may need fallback)
- [ ] File upload works
- [ ] ZIP download works

### Edge
- [ ] All features work
- [ ] Clipboard API functions
- [ ] File upload works
- [ ] ZIP download works

---

## Email Client Paste Test

Copy signature and paste into:

### Gmail (Web)
- [ ] Signature displays correctly
- [ ] Links are clickable
- [ ] Logo displays
- [ ] Social icons display

### Outlook (Desktop)
- [ ] Signature displays correctly
- [ ] Layout intact (table renders properly)
- [ ] Links work
- [ ] Images display

### Outlook (Web)
- [ ] Signature displays correctly
- [ ] All elements render

### Apple Mail (Mac)
- [ ] Signature displays correctly
- [ ] Images display
- [ ] Links work

### Apple Mail (iOS)
- [ ] Signature displays correctly
- [ ] Renders well on mobile

---

## Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Screen reader announces form labels
- [ ] Color contrast passes WCAG AA
- [ ] Modal traps focus appropriately
- [ ] Escape closes modal

---

## Edge Cases

- [ ] Very long name doesn't break layout
- [ ] Very long company name handled
- [ ] Special characters in name (José, O'Brien) work
- [ ] Empty form shows only Name required error on copy
- [ ] Rapid clicking doesn't cause issues
- [ ] Large CSV (500+ rows) handles gracefully
- [ ] Duplicate names in bulk get unique filenames

---

## Performance

- [ ] Page loads quickly (<2 seconds)
- [ ] Preview updates feel instant
- [ ] No visible lag when typing
- [ ] Bulk preview renders smoothly
- [ ] ZIP generation completes in reasonable time
