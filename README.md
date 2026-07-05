# 🚀 Portfolio — Interactive Web Portfolio

A beautiful, interactive, and JSON-configurable portfolio website. Fully static — ready to deploy on GitHub Pages.

![Portfolio Preview](assets/preview.jpg)

## ✨ Features

- 🌑 **Dark Glassmorphism UI** — premium dark theme with frosted glass effects
- ✨ **Animated particle background** with constellation connections
- 🖱️ **Custom cursor** with hover effects
- ⌨️ **Typing animation** in hero section
- 📦 **100% JSON-driven** — all content managed via `data.json`
- 📱 **Fully responsive** — looks great on all devices
- 🎨 **Smooth scroll-triggered animations** on all sections
- 🔍 **Project filtering** by category
- 📋 **Project modal** with detailed view
- ⏱️ **Experience timeline** (Work / Education tabs)
- 📬 **Contact form** (opens email client)
- 🚀 **GitHub Pages ready** — pure static HTML/CSS/JS

## 📁 File Structure

```
portfolio/
├── index.html          # Main page
├── data.json           ⭐ EDIT THIS to customize your portfolio
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    ├── avatar.jpg      # Your profile photo
    └── projects/
        ├── project1.jpg
        └── ...
```

## ⚙️ Configuration (data.json)

All portfolio content is managed in `data.json`. Here's what you can configure:

### Profile
```json
"profile": {
  "name": "Your Name",
  "title": "Your Title",
  "taglines": ["I build things...", "I love clean code..."],
  "bio": "Your bio text",
  "avatar": "assets/avatar.jpg",
  "email": "you@email.com",
  "phone": "+62 xxx",
  "location": "Your City, Country",
  "available": true,
  "availableText": "Open to opportunities"
}
```

### Social Links
```json
"social": [
  { "platform": "GitHub", "url": "https://github.com/you", "icon": "github" },
  { "platform": "LinkedIn", "url": "https://linkedin.com/in/you", "icon": "linkedin" }
]
```
Available icons: `github`, `linkedin`, `twitter`, `instagram`, `youtube`, `facebook`, `email`, `website`, `discord`, `telegram`

### Projects
```json
"projects": [
  {
    "id": 1,
    "title": "Project Name",
    "description": "Short description (shown on card)",
    "longDescription": "Detailed description (shown in modal)",
    "tags": ["React", "Node.js"],
    "category": "fullstack",        // fullstack | frontend | backend | tools | mobile
    "image": "assets/projects/img.jpg",
    "liveUrl": "https://demo.com",
    "githubUrl": "https://github.com/you/repo",
    "featured": true,
    "status": "Completed"           // Completed | In Progress | Open Source
  }
]
```

### Skills
```json
"skills": [
  {
    "category": "Frontend",
    "items": [
      { "name": "React.js", "level": 90, "icon": "⚛️" }
    ]
  }
]
```

### Experience
```json
"experience": [
  {
    "type": "work",                // work | education
    "title": "Job Title",
    "company": "Company Name",
    "period": "2022 - Present",
    "location": "Remote",
    "description": "What you did...",
    "tech": ["React", "Node.js"]
  }
]
```

## 🚀 Deploy to GitHub Pages

1. **Fork or clone** this repository
2. **Edit `data.json`** with your information
3. **Add your photos** to the `assets/` folder
4. **Push to GitHub**
5. Go to **Settings → Pages → Source → main branch**
6. Your portfolio will be live at `https://username.github.io/portfolio`

## 🖼️ Adding Your Photos

- **Profile photo**: Save as `assets/avatar.jpg` (recommended: 400×400px, square)
- **Project screenshots**: Save in `assets/projects/` folder and reference in `data.json`

## 🎨 Customizing Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
  --primary: #7c3aed;        /* Purple — main color */
  --primary-light: #a855f7;  /* Light purple */
  --secondary: #06b6d4;      /* Cyan — accent */
  --accent: #f59e0b;         /* Amber */
}
```

## 📋 License

MIT License — free to use for personal and commercial projects.

---

Built with ❤️ using HTML, CSS & JavaScript — No frameworks, no build tools needed!
