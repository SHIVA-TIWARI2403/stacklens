<h1 align="center">🔍 StackLens — Hacker-Grade Web Tech & Architecture Inspector</h1>

<p align="center">
  <b>Uncover the full engineering stack, reverse proxies, CSP forensic policies, and security posture of any website in seconds.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Open_Source-100%25_Free-00C7B7?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="Open Source" />
</p>

---

## 🌟 What is StackLens?

**StackLens** is a military-grade web reconnaissance and technology stack inspector. Enter any domain (e.g. `flipkart.com`, `netflix.com`, `vercel.com`), and within seconds StackLens intercepts network signals, decomposes Content-Security-Policy (CSP) headers, inspects cookies, DOM bundles, and server signatures to tell you **exactly what technologies are used and how they are architected**.

---

## ⚡ Key Capabilities

### 🕵️ 1. Multi-Layer Forensic Detection
* **HTTP Response Headers:** Server disclosure banners, `X-Powered-By`, reverse proxies, and caching layers (Cloudflare, Akamai, Varnish, Fastly).
* **Cookie Signatures:** Detects backend session states (`PHPSESSID` for PHP, `JSESSIONID` for Java, `csrftoken` for Django/Python, `connect.sid` for Express/Node.js, `ak_bmsc` for Akamai Bot Manager).
* **Content-Security-Policy (CSP) Mining:** Deconstructs modern CSP policies to discover private APIs, WebSockets, cloud analytics, and payment gateways (Stripe, Razorpay, Paytm, Google Maps, New Relic, Datadog).
* **DOM & Script Bundles:** Detects React, React Native for Web, Next.js (`__NEXT_DATA__`), Nuxt (`__NUXT_DATA__`), Vue, Angular, SvelteKit, Webflow, Shopify, WordPress.

### 🛡️ 2. Security Posture Audit
* Evaluates **Strict-Transport-Security (HSTS)** implementation.
* Checks for **Clickjacking Defense (`X-Frame-Options`)**.
* Detects **Server Banner Leaks** and exposed infrastructure identifiers.
* Calculates a dynamic **Security Grade (A, B, C)** with intercepted forensic metrics.

### 🤖 3. AI Architectural Intelligence
* Built-in integration with **Google Gemini 1.5 Flash API** (with smart offline heuristic fallback).
* Explains the overarching architecture, Frontend role, Backend & API handling, and provides practical **Clone Guidance** for developers.

---

## 🏗️ Architectural Flow

```
[Target Domain]
      │
      ▼
[Lightweight Native Fetcher (Browser Emulation & AbortController)]
      │
      ├──► Layer 1: HTTP Response Headers & Server Banners
      ├──► Layer 2: Cookie Forensic Interception
      ├──► Layer 3: CSP (Content Security Policy) Deep Mining
      ├──► Layer 4: Cheerio DOM & Script Bundle Decompiler
      └──► Layer 5: Asset & CSS Framework Pattern Engine
      │
      ▼
[Rule Engine & Confidence Scoring (100+ Technologies)]
      │
      ▼
[Gemini AI Architectural Summarizer]
      │
      ▼
[Live Hacker-Grade Dashboard with Category Filters & Evidence Inspector]
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/SHIVA-TIWARI2403/stacklens.git
cd stacklens
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Set up Google Gemini API Key
Create a `.env.local` file:
```bash
cp .env.example .env.local
```
Add your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If no API key is provided, StackLens uses its built-in rule-based architectural explainer!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploy for Free on Vercel

1. Fork or import this repository on [Vercel](https://vercel.com).
2. Click **Deploy**.
3. Your web tech inspector is live globally in under 60 seconds with free SSL.

---

<p align="center">
  Crafted by <a href="https://github.com/SHIVA-TIWARI2403"><b>Shiva Tiwari</b></a> 🚀
</p>
