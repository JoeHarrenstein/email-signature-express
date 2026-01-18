# Email Signature Generator

A free, open-source tool for creating professional email signatures. Works entirely in your browser - no server required, no data leaves your computer.

**🔗 Try it now: [signatures.harrenstein.com](https://signatures.harrenstein.com)**

## Features

- **Easy to use** - Simple form-based interface with live preview
- **Customizable** - Colors, fonts, layouts, logo options, and separator styles
- **Company templates** - Save and load design settings to maintain brand consistency
- **Responsive** - Works on desktop, tablet, and mobile
- **Dark mode** - For the app interface, plus optional signature backgrounds for dark email clients
- **Preview backgrounds** - Test how your signature looks in light and dark email clients
- **Bulk creation** - Generate signatures for your whole team from a CSV file
- **One-click copy** - Paste directly into your email client
- **Private** - All processing happens locally in your browser
- **Accessible** - Keyboard navigation, screen reader support, and reduced motion support

## Getting Started

### Option 1: Use Online

Visit **[signatures.harrenstein.com](https://signatures.harrenstein.com)** - no download required!

### Option 2: Download and Run Locally

1. Click the green **Code** button above and select **Download ZIP**
2. Extract the ZIP file to any folder
3. Open `index.html` in your browser
4. That's it!

### Option 3: Clone the Repository

```bash
git clone https://github.com/JoeHarrenstein/email-signature-express.git
cd email-signature-express
# Open index.html in your browser
```

## How to Use

### Creating a Single Signature

1. Fill in your information in the form (only Name is required)
2. Add your company logo via URL or file upload
3. Add optional fields: department, mobile phone, calendar/booking link
4. Customize colors, fonts, and layout in the Design Options section
5. Preview your signature on both light and dark backgrounds
6. Click **Copy Signature**
7. Open your email client's signature settings and paste
8. Optionally, save your design as a **Company Template** for reuse

### Creating Signatures in Bulk

1. Switch to the **Bulk Create** tab
2. Design your template (logo, colors, fonts) or **Load Template** from a saved file
3. Click **Download CSV Template**
4. Fill in employee information in Excel or Google Sheets
5. Save and upload the completed CSV (or paste directly from your spreadsheet)
6. Review all generated signatures with search/filter
7. Click **Download All as ZIP** to get individual HTML files, or **Download Preview Page** to get a single HTML file with all signatures

## Importing Your Signature

After copying your signature, paste it into your email client:

### Gmail
1. Click the gear icon and select "See all settings"
2. Scroll to the "Signature" section
3. Click "Create new" and name your signature
4. Paste (Ctrl+V / Cmd+V) in the signature text box
5. Click "Save Changes"

### Outlook (Desktop)
1. Go to File > Options > Mail > Signatures
2. Click "New" to create a new signature
3. Paste your signature (Ctrl+V)
4. Set as default for new messages and/or replies
5. Click "OK"

### Apple Mail
1. Open Mail > Settings (or Preferences)
2. Click the "Signatures" tab
3. Click + to add a new signature
4. Paste your signature (Cmd+V)
5. Drag to the email account you want to use

**Tip:** Make sure to paste as rich text (not plain text) to preserve formatting.

## Customization Options

| Option | Description |
|--------|-------------|
| Logo Position | Display logo to the left of or above your signature |
| Logo Size | Small (60px), Medium (100px), or Large (150px) |
| Name Color | Color for your name |
| Title/Company Color | Color for title, company, and contact info |
| Link Color | Color for website and email links |
| Separator Style | Pipe (\|), Bullet (•), Dash (—), or None |
| Font Family | Arial, Helvetica, Georgia, Times New Roman, Verdana, or Tahoma |
| Icon Style | Solid (single color) or Brand (original platform colors) |
| Dark Mode Background | Optional background color to ensure readability in dark email clients |

## Supported Social Platforms

Add links to any of these platforms - only the ones you fill in will appear:

- Facebook
- Instagram
- X (Twitter)
- LinkedIn
- YouTube

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Privacy

This app runs entirely in your browser. Your personal information never leaves your computer - there's no server, no database, no tracking.

Design preferences (colors, logo position, etc.) are saved in your browser's localStorage so you don't have to reconfigure each time. Personal information (name, email, phone, etc.) is intentionally NOT saved.

## Self-Hosting

Since this is a static website with no backend, you can host it anywhere:

- **GitHub Pages** - Free, easy setup
- **Netlify / Vercel** - Free tier available, custom domains supported
- **Company intranet** - Just upload the files to any web server
- **Local network** - Run on an internal server for your team

## Accessibility

This app is built with accessibility in mind:

- Full keyboard navigation support
- Screen reader compatible with proper ARIA labels
- Respects `prefers-reduced-motion` for users who prefer minimal animations
- High contrast focus indicators
- Skip link for quick navigation
- WCAG 2.1 compliant touch targets on mobile

## Project Structure

```
email-signature-express/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── app.js          # Main app logic and theme handling
│   ├── signature-builder.js  # Single signature form
│   ├── bulk-creator.js      # Bulk creation wizard
│   ├── signature-renderer.js # Generates HTML output
│   ├── csv-handler.js       # CSV parsing
│   ├── formatters.js        # Phone/URL formatting
│   ├── utils.js             # Utilities
│   ├── branded-icons.js     # Brand-colored social icons (base64)
│   └── jszip.min.js         # ZIP library
├── assets/
│   └── icons/          # Social media icons (PNG)
└── templates/
    └── signature-template.csv
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development

No build process required. Just edit the files and refresh your browser.

## License

MIT License - Feel free to use, modify, and distribute.

## Acknowledgments

- JSZip library for bulk export functionality
- Icons from various open-source icon sets
