# Signature HTML Output Specification

This document covers the HTML structure and rendering logic for generated signatures.

---

## Output Requirements

The generated signature HTML must be compatible with all major email clients.

### Rules

1. **Inline styles only** - No `<style>` tags, no CSS classes
2. **Table-based layout** - Maximum email client compatibility
3. **No JavaScript** - Static HTML only
4. **Images as URLs or base64** - Embedded images use data URIs
5. **Explicit dimensions** - Always set width/height on images
6. **Border: 0 on images** - Prevents blue link borders
7. **Font stack** - `font-family: Arial, sans-serif;`
8. **Absolute URLs** - All links must include `https://`

---

## HTML Structure: Logo Left

```html
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333333;">
  <tr>
    <!-- Logo cell -->
    <td style="vertical-align: top; padding-right: 15px;">
      <a href="https://www.company.com" style="text-decoration: none;">
        <img src="[LOGO_URL_OR_BASE64]" alt="Company Logo" width="100" style="display: block; border: 0;">
      </a>
    </td>
    <!-- Content cell -->
    <td style="vertical-align: top;">
      <!-- Name -->
      <p style="margin: 0 0 2px 0; font-weight: bold; font-size: 16px; color: [NAME_COLOR];">
        Jane Smith
      </p>
      <!-- Title & Company -->
      <p style="margin: 0 0 8px 0; color: [TITLE_COLOR];">
        Marketing Manager | Acme Corporation
      </p>
      <!-- Contact info -->
      <p style="margin: 0 0 4px 0; color: [TITLE_COLOR];">
        (555) 123-4567 | jane@company.com
      </p>
      <!-- Address -->
      <p style="margin: 0 0 8px 0; color: [TITLE_COLOR];">
        123 Main Street | Suite 400 | Minneapolis, MN 55401
      </p>
      <!-- Website -->
      <p style="margin: 0 0 8px 0;">
        <a href="https://www.company.com" style="color: [LINK_COLOR]; text-decoration: none;">www.company.com</a>
      </p>
      <!-- Social icons -->
      <p style="margin: 0;">
        <a href="https://facebook.com/company" style="text-decoration: none; margin-right: 8px;">
          <img src="[FACEBOOK_ICON_BASE64]" alt="Facebook" width="20" height="20" style="display: inline-block; vertical-align: middle; border: 0;">
        </a>
        <a href="https://linkedin.com/company/acme" style="text-decoration: none; margin-right: 8px;">
          <img src="[LINKEDIN_ICON_BASE64]" alt="LinkedIn" width="20" height="20" style="display: inline-block; vertical-align: middle; border: 0;">
        </a>
      </p>
    </td>
  </tr>
</table>
```

---

## HTML Structure: Logo Above

```html
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333333;">
  <!-- Logo row -->
  <tr>
    <td style="padding-bottom: 10px;">
      <a href="https://www.company.com" style="text-decoration: none;">
        <img src="[LOGO_URL_OR_BASE64]" alt="Company Logo" width="100" style="display: block; border: 0;">
      </a>
    </td>
  </tr>
  <!-- Content row -->
  <tr>
    <td>
      <!-- Name -->
      <p style="margin: 0 0 2px 0; font-weight: bold; font-size: 16px; color: [NAME_COLOR];">
        Jane Smith
      </p>
      <!-- Remaining content same as above -->
    </td>
  </tr>
</table>
```

---

## HTML Structure: No Logo

When no logo is provided, use a simpler single-cell table:

```html
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #333333;">
  <tr>
    <td>
      <!-- All content here -->
    </td>
  </tr>
</table>
```

---

## Conditional Field Rendering

**Critical:** The signature must look clean regardless of which fields are populated. Never show empty labels, orphaned separators, or blank sections.

### Display Logic by Field

| Field | Always Show | Show If Populated |
|-------|-------------|-------------------|
| Name | ✓ (required) | - |
| Logo | - | ✓ |
| Title | - | ✓ |
| Company | - | ✓ |
| Email | - | ✓ |
| Phone | - | ✓ |
| Fax | - | ✓ |
| Address | - | ✓ (any component) |
| Website | - | ✓ |
| Social icons | - | ✓ (only icons with URLs) |

### Separator Logic

Build arrays of non-empty values, then join with separator. This ensures separators only appear between actual values.

```javascript
// Example: Building contact line
const contactParts = [];
if (phone) contactParts.push(formatPhone(phone));
if (fax) contactParts.push(`Fax: ${formatPhone(fax)}`);
if (email) contactParts.push(email);

// Join only if there are parts
const contactLine = contactParts.length > 0 
  ? contactParts.join(` ${separator} `)  // e.g., " | "
  : null;

// Only render the <p> tag if contactLine exists
```

### Line-by-Line Rendering

**Line 1: Name**
- Always rendered (required field)
- Format: `{Name}`

**Line 2: Title & Company**
| Title | Company | Output |
|-------|---------|--------|
| ✓ | ✓ | `{Title} [sep] {Company}` |
| ✓ | ✗ | `{Title}` |
| ✗ | ✓ | `{Company}` |
| ✗ | ✗ | *Don't render this line* |

**Line 3: Contact (Phone, Fax, Email)**
- Build array of populated values
- Join with separator
- If all empty: *Don't render this line*
- Fax format: `Fax: (555) 123-4567`

**Line 4: Address**
- Only render if at least Address1 OR City is populated
- Format: `{Address1} [sep] {Address2} [sep] {City}, {State} {ZIP}`
- Omit empty components

**Line 5: Website**
- Only render if website is populated
- Display format: `www.company.com`
- Link href: `https://www.company.com`

**Line 6: Social Icons**
- Only render if at least one social URL is provided
- Only show icons for platforms with URLs
- Icons displayed inline with small margin between

### Section Spacing

- Use consistent `margin-bottom` on each `<p>` tag
- `margin: 0 0 2px 0;` for Name (tight)
- `margin: 0 0 8px 0;` for other sections (breathing room)
- `margin: 0;` for last element (social icons)

---

## Example Outputs

### Full Signature (All Fields)

```
[LOGO]  Jane Smith
        Marketing Manager | Acme Corporation
        (555) 123-4567 | Fax: (555) 987-6543 | jane@acme.com
        123 Main St | Suite 400 | Minneapolis, MN 55401
        www.acme.com
        [FB] [IG] [X] [LI] [YT]
```

### Minimal Signature (Name + Phone + Email)

```
Jane Smith
(555) 123-4567 | jane@acme.com
```

### Medium Signature (No Fax, No Address2, No Social)

```
[LOGO]  Jane Smith
        Marketing Manager | Acme Corporation
        (555) 123-4567 | jane@acme.com
        123 Main St | Minneapolis, MN 55401
        www.acme.com
```

### Name + Title Only (No Company)

```
Jane Smith
Marketing Manager
```

---

## Logo Sizing

Apply size based on user selection:

| Size | Width Attribute |
|------|-----------------|
| Small | 60 |
| Medium | 100 |
| Large | 150 |

Let height auto-scale to maintain aspect ratio (don't set height attribute unless needed).

---

## Social Icon Rendering

Only render icons that have corresponding URLs:

```javascript
const socialPlatforms = [
  { key: 'facebook', icon: FACEBOOK_ICON_BASE64, alt: 'Facebook' },
  { key: 'instagram', icon: INSTAGRAM_ICON_BASE64, alt: 'Instagram' },
  { key: 'twitter', icon: TWITTER_ICON_BASE64, alt: 'X' },
  { key: 'linkedin', icon: LINKEDIN_ICON_BASE64, alt: 'LinkedIn' },
  { key: 'youtube', icon: YOUTUBE_ICON_BASE64, alt: 'YouTube' },
];

// Filter to only those with URLs
const activeSocials = socialPlatforms.filter(p => data[p.key]);

// If none active, don't render social section at all
if (activeSocials.length === 0) return '';

// Otherwise, render icons
```

Ensure social URLs have `https://` protocol for the href.

---

## Color Application

Replace placeholders with user-selected colors:

| Placeholder | Default | User Setting |
|-------------|---------|--------------|
| `[NAME_COLOR]` | #1a1a2e | nameColor picker |
| `[TITLE_COLOR]` | #6c757d | titleColor picker |
| `[LINK_COLOR]` | #4a90a4 | linkColor picker |

Separator uses `[TITLE_COLOR]` by default, or `separatorColor` if separately configurable.

---

## Email Client Compatibility Notes

### Gmail
- Handles table layouts well
- Supports inline styles
- May strip some CSS properties

### Outlook (Desktop)
- Uses Word rendering engine
- Tables are essential
- Some CSS like `line-height` may behave differently

### Outlook (Web/Mobile)
- Better CSS support than desktop
- Still prefer tables for layout

### Apple Mail
- Good CSS support
- Tables work well
- Base64 images display correctly

### General Tips
- Keep HTML simple
- Avoid CSS shorthand (use `margin-top`, `margin-right`, etc. separately if issues arise)
- Test in multiple clients
