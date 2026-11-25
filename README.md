# NSTU Cover Page Generator 🎓

A modern, responsive, client-side web application designed for students of **Noakhali Science and Technology University (NSTU)** to generate university-standard academic cover pages in under 60 seconds.

Built to solve the formatting headaches of misaligned tables, distorted logos, and inconsistent margins in Microsoft Word, this application creates professional assignment cover pages that can be downloaded as **fully selectable vector PDF** or **editable Microsoft Word (DOCX)** with native Word tables.

---

## ✨ Features

- **🏛️ 100% Authentic NSTU Format**: Recreated based on official NSTU assignment cover pages, complete with university crest and Institute of Information Technology (IIT) logo.
- **📄 Dual Export Formats**:
  - **Editable Word (DOCX)**: Real Microsoft Word paragraphs, custom fonts, embedded high-res logos, and native Word 2-column tables with `#002060` navy blue shading (not a screenshot dump).
  - **Selectable Vector PDF**: Crisp vector typography generated via `jsPDF`. All text is searchable and selectable.
  - **Direct Print**: Print-optimized stylesheet (`@media print`) for 1-click browser printing.
- **🖼️ Dual Logo Management**:
  - Pre-loaded with official high-resolution **NSTU Crest** and **IIT Department Logo**.
  - Upload custom department logos (drag & drop or file picker).
  - 1-click restore to default university logos.
  - Option to toggle between single logo or dual logos.
- **⚡ Real-Time Live A4 Preview**:
  - Live side-by-side preview with real A4 dimensions (210mm × 297mm).
  - Instant re-rendering as you type in any form field.
  - Zoom controls: Zoom In, Zoom Out, 100%, and Fit to Screen width.
- **🎨 Deep Customization**:
  - **Typography**: Times New Roman (Academic default), Georgia, Garamond, Arial, Inter.
  - **Color Palette**: Classic NSTU Navy (`#002060`), Royal Blue (`#1E3A8A`), Deep Navy (`#0A1D30`), Academic Maroon (`#800000`), Forest Green (`#14532D`), or custom hex color picker.
  - **Page Margins**: Normal (1 inch / 25mm), Compact (18mm), or Wide (30mm).
  - **Logo Sizing**: Adjust logo height from 50px to 110px.
  - **Table Width**: Slider to adjust table width from 80% to 100%.
  - **Page Borders**: None, Single Line Academic, or Double Line Academic Border.
- **💾 Automatic LocalStorage Persistence**: All form details and design preferences are preserved in the browser's `localStorage`. Refreshing or closing the tab will never lose your work.
- **📋 Academic Preset Templates**: 1-click quick-fill templates for Software Metrics Lab, Algorithms Lab Report, Software Engineering Project Report, and Term Paper / Research.
- **📱 Fully Responsive**: Seamless experience across smartphones, tablets, laptops, and desktop monitors. Features a mobile tab switcher ("1. Edit Form" / "2. Live Preview & Download").
- **🎉 Modern UX**: Smooth animations, Lucide icons, toast notifications, and celebratory confetti upon download.

---

## 🚀 Getting Started

The application is completely self-contained with offline-first client libraries, requiring zero build steps or database configuration.

### Option 1: Run with Python (Recommended)

```bash
# In the project root directory:
python3 -m http.server 5173
```
Then open your browser at:
```
http://localhost:5173
```

### Option 2: Run with Node / NPM

```bash
# Using npx serve:
npm start

# Or using the built-in python script:
npm run serve
```
Open your browser at:
```
http://localhost:5173
```

### Option 3: Double-Click to Open (Offline)

Simply double-click `index.html` in your file manager or drag it into any web browser (Google Chrome, Firefox, Safari, Edge). It works 100% offline!

---

## 🌐 Deployment Guide (Free & Instant)

Since this is a 100% static client-side web application with zero server or database dependencies, you can deploy it in under 60 seconds anywhere:

### 1. GitHub Pages (Free)
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for NSTU Cover Page Generator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Your website is instantly live at `https://<your-username>.github.io/<repo-name>/`!

### 2. Vercel (Free)
1. Run `npx vercel` in the project root, or connect your GitHub repo on [vercel.com](https://vercel.com).
2. Framework Preset: **Other** (Root Directory: `./`).
3. Click **Deploy**.

### 3. Netlify (Free Drag & Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder directly into the browser window.
3. Your website is live within seconds with a free `.netlify.app` domain!

---

## 📂 Project Structure

```
Cover Page Generator/
├── index.html              # Main single-page application and UI markup
├── css/
│   └── style.css           # Academic typography, A4 layout & @media print styles
├── js/
│   ├── default-logos.js    # Embedded high-res base64 NSTU & IIT logos
│   ├── presets.js          # Academic templates & NSTU department lists
│   ├── docx-export.js      # Native Microsoft Word (.docx) generator with Word tables
│   ├── pdf-export.js       # Vector selectable PDF exporter & print integration
│   └── app.js              # Application state, live preview, auto-save & events
├── libs/
│   ├── docx.umd.js         # Client-side Microsoft Word document builder
│   ├── jspdf.umd.min.js    # Client-side vector PDF generation engine
│   ├── lucide.js           # Beautiful open-source Lucide icon suite
│   ├── tailwind.js         # Offline Tailwind CSS compiler
│   └── confetti.browser.min.js # Celebration animations on download
├── assets/
│   └── logos/
│       ├── nstu-logo.png   # Official NSTU university crest
│       └── iit-logo.png    # Institute of Information Technology (IIT) logo
├── sample coverpage/       # Original reference template files
├── package.json            # NPM scripts & metadata
└── README.md               # Documentation & usage guide
```

---

## 🛠️ Technologies Used

- **HTML5 & Vanilla JavaScript (ES6+)**: Fast, reactive, zero framework overhead.
- **Tailwind CSS**: Utility-first CSS styling for a responsive, clean interface.
- **docx.js**: Generates true `.docx` OpenXML files with paragraphs, images, and shaded tables.
- **jsPDF**: Generates compliant vector A4 PDFs with selectable, copyable text.
- **Lucide Icons**: Crisp, modern iconography.
- **Canvas Confetti**: Delightful user feedback upon document download.

---

## 📝 Form Fields Guide

1. **Course & Document Information**:
   - **University Name**: Defaults to `Noakhali Science and Technology University`.
   - **Assignment Type**: Select from presets (Assignment Report, Lab Report, Project Report, Term Paper, Thesis) or enter custom text.
   - **Assignment Topic**: Full title of the assignment or report.
   - **Course Title**: Name of the academic course (e.g., *Software Metrics Lab*).
   - **Course Code**: Departmental course code (e.g., *SE 3204*).
   - **Submission Date**: Formatted date with "Today" and "Tomorrow" quick buttons.

2. **Student Information ("Submitted by")**:
   - Student Name, Student ID (e.g., *ASH2325015M*), Session (e.g., *2022-23*), Department/Institute, University Name.

3. **Teacher Information ("Supervised by")**:
   - Teacher's Name, Designation (e.g., *Assistant Professor*), Department, University Name.

---

## 📄 License

MIT License. Designed and created for the students and faculty of **Noakhali Science and Technology University**.
