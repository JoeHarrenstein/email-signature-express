# Design System Specification

This document covers the visual design, theming, component styles, and animations for the app interface.

---

## App Theme: Light & Dark Mode

The application interface supports both light and dark modes.

### System Detection
On first load, detect user's system preference:
```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### Manual Toggle
- Prominent toggle switch in the app header
- Sun/moon icons or similar visual indicator
- Clicking toggles between light and dark

### Persistence
Save preference to localStorage:
```javascript
localStorage.setItem('sig_appTheme', 'dark'); // or 'light' or 'system'
```

### CSS Custom Properties

Use CSS variables for easy theming:

```css
:root {
  /* Light mode (default) */
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #e9ecef;
  --text-primary: #1a1a2e;
  --text-secondary: #6c757d;
  --text-muted: #adb5bd;
  --accent: #4a90a4;
  --accent-hover: #3d7a8c;
  --accent-faded: rgba(74, 144, 164, 0.15);
  --border: #e9ecef;
  --border-focus: #4a90a4;
  --shadow: rgba(0, 0, 0, 0.05);
  --shadow-hover: rgba(0, 0, 0, 0.1);
  --success: #28a745;
  --error: #dc3545;
  --warning: #ffc107;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #252542;
  --bg-tertiary: #3d3d5c;
  --text-primary: #f8f9fa;
  --text-secondary: #adb5bd;
  --text-muted: #6c757d;
  --accent: #6db3c9;
  --accent-hover: #8ac4d4;
  --accent-faded: rgba(109, 179, 201, 0.2);
  --border: #3d3d5c;
  --border-focus: #6db3c9;
  --shadow: rgba(0, 0, 0, 0.2);
  --shadow-hover: rgba(0, 0, 0, 0.3);
  --success: #34d058;
  --error: #f85149;
  --warning: #f0ad4e;
}
```

---

## Preview Background Toggle

**Separate from app theme.** This lets users test how their signature looks in different email clients.

### Implementation
Two buttons above the preview pane:
- **"Light"** - Sets preview background to #ffffff
- **"Dark"** - Sets preview background to #1a1a2e

This is independent of the app's light/dark mode. User could be in dark mode app but previewing signature on light background.

### Purpose
- Gmail dark mode vs light mode
- Outlook dark theme
- Apple Mail appearance settings
- Ensure logo visibility on both backgrounds

---

## Layout

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
```

### Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| > 1024px (Desktop) | Form and preview side-by-side (60/40 split) |
| 768-1024px (Tablet) | Stacked, full-width sections |
| < 768px (Mobile) | Single column, optimized touch targets |

### Spacing Scale
Use consistent spacing:
- `4px` - Tight (between related elements)
- `8px` - Small
- `16px` - Medium (default padding)
- `24px` - Large (section spacing)
- `32px` - Extra large (major sections)

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Scale

| Element | Size | Weight |
|---------|------|--------|
| Page title | 28px | 600 |
| Section header | 18px | 600 |
| Body text | 16px | 400 |
| Small/helper text | 14px | 400 |
| Labels | 14px | 500 |

### Line Height
- Headings: 1.2
- Body: 1.5

---

## Components

### Input Fields

```css
input, select, textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px; /* Prevents zoom on iOS */
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-faded);
}

input::placeholder {
  color: var(--text-muted);
}
```

### Clear (×) Buttons

Position inside input, right-aligned:

```css
.input-wrapper {
  position: relative;
}

.clear-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  padding: 0;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.input-wrapper:hover .clear-button,
.input-wrapper input:focus + .clear-button,
.clear-button:focus {
  opacity: 1;
}
```

### Buttons

**Primary Button:**
```css
.btn-primary {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.btn-primary:active {
  transform: translateY(0);
}
```

**Secondary Button:**
```css
.btn-secondary {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--text-secondary);
}
```

### Cards

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}
```

### Tabs / Segmented Control

```css
.tabs {
  display: flex;
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 4px;
}

.tab {
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tab.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  box-shadow: 0 1px 3px var(--shadow);
}
```

### Color Pickers

Use native `<input type="color">` with custom styling:

```css
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-picker {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}
```

### Toggle Switch

For light/dark and position toggles:

```css
.toggle {
  position: relative;
  width: 48px;
  height: 26px;
  background: var(--bg-tertiary);
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle.active {
  background: var(--accent);
}

.toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle.active::after {
  transform: translateX(22px);
}
```

### Modal

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s;
}

.modal-backdrop.visible {
  opacity: 1;
}

.modal {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform 0.2s;
}

.modal-backdrop.visible .modal {
  transform: scale(1);
}
```

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 24px;
  box-shadow: 0 4px 16px var(--shadow-hover);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
}

.toast.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast.success {
  border-left: 4px solid var(--success);
}
```

---

## Animations

### Page Load

Subtle fade-up on main content:

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-content {
  animation: fadeUp 0.4s ease-out;
}

/* Stagger sections */
.section:nth-child(1) { animation-delay: 0ms; }
.section:nth-child(2) { animation-delay: 50ms; }
.section:nth-child(3) { animation-delay: 100ms; }
```

### Transitions

All interactive elements: `transition: [property] 0.2s ease;`

- Buttons: background, transform, box-shadow
- Inputs: border-color, box-shadow
- Tabs: background, color
- Cards: box-shadow (on hover if applicable)

---

## Accessibility

### Focus States
All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Color Contrast
- Text on backgrounds: minimum 4.5:1 ratio
- UI components: minimum 3:1 ratio
- Test both light and dark modes

### Labels
- All form inputs have associated `<label>` elements
- Use `aria-label` for icon-only buttons
- Labels can be visually hidden if design requires:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

### ARIA
- Tabs: `role="tablist"`, `role="tab"`, `aria-selected`
- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Toast: `role="status"`, `aria-live="polite"`

### Keyboard Navigation
- All interactive elements reachable via Tab
- Escape closes modals
- Enter activates buttons
- Arrow keys navigate tabs (optional enhancement)
