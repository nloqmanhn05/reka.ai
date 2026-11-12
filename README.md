# reka.ai

Autonomous AI Agent Studio for Malaysian SMEs. Pure vanilla HTML5, CSS3, and JavaScript — zero frameworks, bundlers, or build dependencies.

## Web Server Architecture
- **Server Type:** Static Web Server (JAMstack / Client-Side Only)
- **Backend Runtime:** None required (no Node.js, Python, or PHP process needed to serve the site)
- **Serving Requirements:** Any HTTP server capable of serving static assets with byte-range support for `.mp4` video streaming and MIME types for `.woff2` font files.
- **Form Handling:** Front-end form validation with client-side status handling; can connect directly to any REST webhook (e.g. Supabase, Make.com, n8n, Formspree, or custom AI agent API endpoint).

## Structure
- `index.html` — Semantic landing page (Hero, About, Projects, 3-Tier Services & Pricing, Contact, Footer)
- `css/style.css` — Dark aesthetic, flat button kinetic system, responsive layout, direct hex/rgba color codes
- `js/main.js` — Mobile menu drawer, scroll animations, sticky header, form validation text-swap, cursor-following repo button
- `assets/projects/` — Engineering project preview thumbnails
- `hero-compat.mp4` — Background video
- `*.woff2` — Local fonts (*Inter* and *Instrument Serif Italic*)

## Run Locally
Serve the directory with any local static file server:
```bash
# Node.js
npx serve .

# Python 3
python -m http.server 8000

# VS Code
Use the "Live Server" extension (Right-click index.html -> Open with Live Server)
```

## Production Deployment
Upload this folder directly to any static web server or CDN host:
- **Cloud/Edge CDN:** Cloudflare Pages, Vercel, Netlify, GitHub Pages, Firebase Hosting
- **Traditional Web Server:** Nginx, Apache HTTP Server, or Caddy
