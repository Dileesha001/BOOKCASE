# 📚 BOOKCASE — Sri Lanka's Premier Literary Sanctuary

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-10B981?style=for-the-badge&logo=github)
![Theme](https://img.shields.io/badge/Theme-Dual%20Obsidian%20%26%20Emerald-D4A017?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**BOOKCASE** is a state-of-the-art, luxury online bookstore web application crafted with pure HTML5, Vanilla JavaScript, and advanced CSS3 design systems. Featuring dynamic GSAP animations, a dual-theme system (Obsidian Gold & Emerald Sage), 3D book showcases, real-time stock indicators, and full multi-tier mobile responsiveness.

🌐 **Live Website**: [https://dileesha001.github.io/BOOKCASE/](https://dileesha001.github.io/BOOKCASE/)

---

## ✨ Key Features

### 🌙 Emerald & Obsidian Dual Theme System
- **Dark Mode**: Deep obsidian forest background (`#050c08`) with ambient radial emerald glows, rich gold badge accents (`#D4A017`), and gold primary CTAs.
- **Light Mode**: Soft emerald sage background (`#EFF5F2`) with pure white cards (`#FFFFFF`), lush emerald green logo filter, and rich emerald CTAs (`#10B981`).

### 📚 Curated Library Collections
- 9 curated book categories with custom vector SVG icons:
  - 📈 **Trending Now**
  - ⭐ **All-Time Best Sellers**
  - 🎓 **Education**
  - 📖 **Novels**
  - 🌐 **Translations**
  - ✍️ **Short Stories**
  - 🚀 **Sci-Fi**
  - 🪐 **Fiction**
  - 🌹 **Poetry**

### 📖 3D Featured Highlight Showcase
- Interactive *Mandodari by Mohan Raj Madawala* spotlight featuring a 3D book frame with floating ambient radial glow.
- Anchored 20% OFF luxury gold seal badge with circular mask rendering and continuous spring floating pulse animations (`@keyframes sealPulse`).

### 🟢🔴 Real-Time Stock Availability System
- **In Stock**: Pulsing emerald green status dot (`🟢`) with ambient glow halo.
- **Out of Stock**: Glowing crimson red status dot (`🔴`), red status badge, and disabled "Sold Out" buttons.

### 💬 Sanctuary Concierge & Contact Hub
- Equal-baseline 2-master-card layout (`.contact-info-card` & `.contact-form`).
- Includes an interactive 3D Literary Sanctuary animation card with a floating SVG book, particle glow, and live online concierge status.
- Centered full-width Mobile App showcase banner.

### 📱 100% Mobile & Tablet Responsive Design
- Side-by-side 2-column mobile book grids (`repeat(2, 1fr)`).
- Slide-down mobile drawer navigation (`.mobile-nav-drawer`) triggered by a smooth hamburger menu button.
- Zero layout shifts or overflow on mobile phones, tablets, or wide desktop displays.

---

## 🛠️ Technology Stack

- **Structure**: HTML5 (Semantic Architecture & SEO Title/Meta Tags)
- **Logic**: Vanilla JavaScript (ES6+ Modules, Theme Switching, Cart Drawer, Live Search)
- **Styling**: Vanilla CSS3 (Custom Tokens, Glassmorphism, Micro-Animations, Multi-Tier `@media` Breakpoints)
- **Animations**: GSAP 3 (GreenSock Animation Platform) + ScrollTrigger, CSS Keyframe Animations
- **Typography**: Google Fonts (*Playfair Display*, *Cormorant Garamond*, *Cinzel*, *EB Garamond*, *Great Vibes*, *Inter*)

---

## 📁 Repository Structure

```
Project-02/
├── index.html                # Main Landing Page
├── README.md                 # Project Documentation
├── CSS/
│   ├── stylesheet.css        # Master Design System & Core Styles
│   ├── dark-mode.css         # Obsidian & Gold Theme Overrides
│   ├── light-mode.css        # Soft Sage & Emerald Light Theme Overrides
│   └── auth.css              # Authentication Pages Styling
├── JS/
│   ├── script.js             # Theme Switching, Search & Cart Logic
│   └── luxury-animations.js  # GSAP ScrollTrigger & Reveal Animations
├── Images/                   # 3D Graphic Assets, Seals & Book Covers
└── pages/                    # Subpages & Authentication Views
    ├── Bestsellers.html
    ├── education.html
    ├── fiction.html
    ├── novels.html
    ├── poetry.html
    ├── scifi.html
    ├── shortstories.html
    ├── translations.html
    ├── trending.html
    ├── login.html
    └── signup.html
```

---

## 🚀 Getting Started Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dileesha001/BOOKCASE.git
   cd BOOKCASE
   ```

2. **Run Frontend Locally**:
   - Open `index.html` directly in any web browser.
   - Or use VS Code **Live Server** extension / `npx serve` for live reloading:
     ```bash
     npx serve .
     ```

3. **Run MongoDB Backend Server**:
   ```bash
   cd server
   npm install
   
   # Seed default database (Users, Inventory, Logging)
   npm run seed

   # Start Express API server
   npm start
   ```

---

## 🍃 MongoDB Database Architecture

The backend utilizes **MongoDB + Mongoose** structured into modular collections:

- 👤 **Users Collection (`users`)**: Stores user credentials (bcrypt hashed passwords), roles (`customer`, `staff`, `admin`), profile details, and timestamps.
- 📝 **Logging Collection (`logs`)**: Stores HTTP activity logs, audit trails, and security events. Features a **TTL Index** (`expires: 2592000`) for automatic 30-day log expiration.
- 📚 **Inventory Collection (`inventories`)**: Catalog of books, stock indicators (`In Stock` / `Out of Stock`), quantity counters, categories, and prices (LKR).
- 🛍️ **Orders Collection (`orders`)**: Multi-item purchases with stock deduction and order status management.


---

## 🌐 Live Hosting

Hosted on **GitHub Pages**:
- **URL**: [https://dileesha001.github.io/BOOKCASE/](https://dileesha001.github.io/BOOKCASE/)

---

## 👤 Author

**Dileesha Ravishan**
- GitHub: [@Dileesha001](https://github.com/Dileesha001)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
