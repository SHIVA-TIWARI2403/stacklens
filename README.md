# 🌐 StackLens — Website Tech Stack & Architecture Inspector

An open-source, fullstack web application that inspects any website URL to uncover its frontend frameworks, backend languages, servers, CMS, and AI-powered architectural breakdown.

## ✨ Features

- **🔍 Multi-Layer Detection Engine:**
  - **HTTP Response Headers:** Server headers, `X-Powered-By`, reverse proxies.
  - **Cookie Signatures:** Detects PHP (`PHPSESSID`), Java (`JSESSIONID`), Django (`csrftoken`), Express (`connect.sid`), Laravel, etc.
  - **DOM & Meta Tags:** WordPress, Next.js (`__NEXT_DATA__`), Nuxt (`__NUXT_DATA__`), Vue, Angular, Svelte, Webflow, etc.
  - **Asset Signatures:** Tailwind CSS classes, Bootstrap, CDN assets, script sources.
- **🤖 AI Architectural Intelligence:**
  - Explains *how* the site is structured: Frontend Role, Backend Role, Infrastructure & CDN, and practical tips on how to clone the stack.
  - Works with Google Gemini API (Free tier) or intelligent offline heuristic fallback.
- **⚡ Super Fast:**
  - Lightweight Cheerio + Native Fetch parser completes scans in under 1 second.
- **📊 100% Free Hosting:**
  - Ready for 1-click deployment on Vercel or Netlify.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Configure Gemini API
Copy `.env.example` to `.env.local` and add your Google Gemini API key:
```bash
cp .env.example .env.local
```
*(If no API key is provided, StackLens uses its built-in rule-based architectural explainer!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploy to Vercel (100% Free)
1. Push this project to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **Deploy**.
