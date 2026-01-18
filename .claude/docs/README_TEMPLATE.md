# Email Signature Generator

A free, open-source tool for creating professional email signatures. Works entirely in your browser—no server required, no data leaves your computer.

![Screenshot placeholder - add actual screenshot here]

## Features

- ✨ **Easy to use** - Simple form-based interface
- 🎨 **Customizable** - Colors, layouts, logo options, and separator styles
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🌙 **Dark mode** - For the app interface
- 🔍 **Preview backgrounds** - Test how your signature looks in light and dark email clients
- 👥 **Bulk creation** - Generate signatures for your whole team from a CSV file
- 📋 **One-click copy** - Paste directly into your email client
- 🔒 **Private** - All processing happens locally in your browser

## Getting Started

### Option 1: Use Online

Visit [your-hosted-url-here] to use the app immediately.

### Option 2: Download and Run Locally

1. Click the green **Code** button above and select **Download ZIP**
2. Extract the ZIP file to any folder
3. Open `index.html` in your browser
4. That's it!

### Option 3: Clone the Repository

```bash
git clone https://github.com/yourusername/email-signature-generator.git
cd email-signature-generator
# Open index.html in your browser
```

## How to Use

### Creating a Single Signature

1. Fill in your information in the form (only Name is required)
2. Add your company logo via URL or file upload
3. Customize colors and layout in the Design Options section
4. Preview your signature on both light and dark backgrounds
5. Click **Copy Signature**
6. Open your email client's signature settings and paste

### Creating Signatures in Bulk

1. Switch to the **Bulk Create** tab
2. Design your company template (logo, colors, layout)
3. Click **Download CSV Template**
4. Fill in employee information in Excel or Google Sheets
5. Save and upload the completed CSV
6. Review all generated signatures
7. Click **Download All as ZIP** to get individual HTML files

## Importing Your Signature

After copying your signature, you'll need to paste it into your email client. Click the **How to Import** button in the app for detailed instructions for:

- Gmail
- Outlook (Desktop)
- Outlook (Mobile)
- Apple Mail (macOS)
- Apple Mail (iOS)

**Tip:** Use your browser's paste (Ctrl+V / Cmd+V) rather than "Paste as plain text" to preserve formatting.

## Customization Options

| Option | Description |
|--------|-------------|
| Logo Position | Display logo to the left of or above your signature |
| Logo Size | Small (60px), Medium (100px), or Large (150px) |
| Name Color | Color for your name |
| Title/Company Color | Color for title, company, and contact info |
| Link Color | Color for website and email links |
| Separator Style | Pipe (|), Bullet (•), Dash (—), or None |

## Supported Social Platforms

Add links to any of these platforms—only the ones you fill in will appear:

- Facebook
- Instagram
- X (Twitter)
- LinkedIn
- YouTube

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Privacy

This app runs entirely in your browser. Your personal information never leaves your computer—there's no server, no database, no tracking.

Design preferences (colors, logo position, etc.) are saved in your browser's localStorage so you don't have to reconfigure each time. Personal information (name, email, phone, etc.) is intentionally NOT saved.

## Self-Hosting

Since this is a static website with no backend, you can host it anywhere:

- **GitHub Pages** - Free, easy setup
- **Netlify / Vercel** - Free tier available, custom domains supported
- **Company intranet** - Just upload the files to any web server
- **Local network** - Run on an internal server for your team

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development

No build process required. Just edit the files and refresh your browser.

```
email-signature-generator/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── app.js          # Main app logic
│   ├── signature-builder.js
│   ├── bulk-creator.js
│   ├── signature-renderer.js
│   ├── csv-handler.js
│   ├── formatters.js
│   └── utils.js
├── assets/
│   └── icons/          # Social media icons
└── templates/
    └── signature-template.csv
```

## License

MIT License - Feel free to use, modify, and distribute.

## Acknowledgments

- Social media icons: [credit icon source]
- JSZip library for bulk export functionality

---

Made with ❤️ for teams who want professional, consistent email signatures.
