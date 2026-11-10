export type TechCategory = 
  | 'frontend' 
  | 'backend' 
  | 'cms' 
  | 'styling' 
  | 'analytics' 
  | 'hosting' 
  | 'server'
  | 'ecommerce'
  | 'database'
  | 'security'
  | 'payment';

export interface TechRule {
  name: string;
  category: TechCategory;
  description: string;
  website: string;
  icon: string;
  color?: string;
  headers?: { key: string; valueRegex?: RegExp; reason: string }[];
  cookies?: { pattern: RegExp; reason: string }[];
  meta?: { name?: string; property?: string; contentRegex: RegExp; reason: string }[];
  scripts?: { pattern: RegExp; reason: string }[];
  html?: { pattern: RegExp; reason: string }[];
  csp?: { pattern: RegExp; reason: string }[];
}

export interface DetectedTech {
  name: string;
  category: TechCategory;
  description: string;
  website: string;
  icon: string;
  color: string;
  confidence: number;
  evidence: string[];
}

export const TECHNOLOGY_DATABASE: TechRule[] = [
  // ==========================================
  // 1. FRONTEND FRAMEWORKS & UI LIBRARIES
  // ==========================================
  {
    name: 'React Native for Web',
    category: 'frontend',
    description: 'Meta\'s cross-platform React Native rendering engine compiled directly for web browsers.',
    website: 'https://necolas.github.io/react-native-web/',
    icon: '📱',
    color: 'bg-cyan-600/10 text-cyan-400 border-cyan-500/20',
    html: [
      { pattern: /id="react-native-stylesheet"/i, reason: 'React Native for Web stylesheet container ("react-native-stylesheet") found' },
      { pattern: /stylesheet-group=/i, reason: 'React Native Web atomic style grouping detected' }
    ]
  },
  {
    name: 'React',
    category: 'frontend',
    description: 'Declarative component-based UI JavaScript library maintained by Meta.',
    website: 'https://react.dev',
    icon: '⚛️',
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    html: [
      { pattern: /data-reactroot/i, reason: 'DOM element with "data-reactroot" attribute found' },
      { pattern: /data-reactid/i, reason: 'Legacy React identifier "data-reactid" found' },
      { pattern: /react\.production\.min\.js/i, reason: 'React CDN runtime script found' },
      { pattern: /react-dom/i, reason: 'React DOM dependencies detected' },
      { pattern: /id="react-native-stylesheet"/i, reason: 'React Native Web implementation identified' },
      { pattern: /__REACT_DEVTOOLS_GLOBAL_HOOK__/i, reason: 'React DevTools Hook reference found' }
    ],
    scripts: [
      { pattern: /react(-dom)?(\.production|\.min|\.development)?\.js/i, reason: 'React script tag included' }
    ]
  },
  {
    name: 'Next.js',
    category: 'frontend',
    description: 'The React Framework for the Web with Server-Side Rendering & App Router.',
    website: 'https://nextjs.org',
    icon: '⚡',
    color: 'bg-black text-white dark:bg-zinc-800',
    headers: [
      { key: 'x-powered-by', valueRegex: /Next\.js/i, reason: 'Header "X-Powered-By: Next.js" found' },
    ],
    html: [
      { pattern: /<script[^>]+id="__NEXT_DATA__"/i, reason: 'Next.js data initialization script (__NEXT_DATA__) present' },
      { pattern: /\/_next\/static\//i, reason: 'Assets loaded from "/_next/static/" directory' },
      { pattern: /<next-route-announcer/i, reason: 'Next.js route announcer element found' },
    ],
    scripts: [
      { pattern: /\/_next\/static\//i, reason: 'Next.js client-side bundle loaded' }
    ]
  },
  {
    name: 'Nuxt.js',
    category: 'frontend',
    description: 'Intuitive Vue Framework for building universal web applications.',
    website: 'https://nuxt.com',
    icon: '💚',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    html: [
      { pattern: /<div[^>]+id="__nuxt"/i, reason: 'Nuxt root mounting container (<div id="__nuxt">) found' },
      { pattern: /<script[^>]+id="__NUXT_DATA__"/i, reason: 'Nuxt 3 data payload script found' },
      { pattern: /\/_nuxt\//i, reason: 'Assets loaded from "/_nuxt/" folder' },
    ]
  },
  {
    name: 'Vue.js',
    category: 'frontend',
    description: 'Progressive JavaScript framework for building user interfaces.',
    website: 'https://vuejs.org',
    icon: '🟢',
    color: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20',
    html: [
      { pattern: /data-v-[a-f0-9]{6,8}/i, reason: 'Vue scoped CSS attribute ("data-v-xxxxxx") detected' },
      { pattern: /vue\.runtime|vue\.min\.js/i, reason: 'Vue.js core runtime included' },
    ]
  },
  {
    name: 'Angular',
    category: 'frontend',
    description: 'Component-based framework for scalable enterprise web applications by Google.',
    website: 'https://angular.dev',
    icon: '🅰️',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    html: [
      { pattern: /ng-version=/i, reason: 'Angular attribute "ng-version" found on root tag' },
      { pattern: /_ngcontent-|ng-controller/i, reason: 'Angular component content scoping found' },
    ]
  },
  {
    name: 'Svelte / SvelteKit',
    category: 'frontend',
    description: 'Cybernetically enhanced web apps with no virtual DOM overhead.',
    website: 'https://svelte.dev',
    icon: '🔥',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    html: [
      { pattern: /class="[^"]*svelte-[a-z0-9]+/i, reason: 'Svelte scoped CSS class "svelte-xxxxxx" found' },
      { pattern: /data-sveltekit/i, reason: 'SvelteKit router attribute detected' },
    ]
  },
  {
    name: 'Astro',
    category: 'frontend',
    description: 'All-in-one web framework designed for content-focused speed (Islands architecture).',
    website: 'https://astro.build',
    icon: '🚀',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    html: [
      { pattern: /data-astro-cid-/i, reason: 'Astro component ID attribute found' },
      { pattern: /<astro-island/i, reason: 'Astro Island component container found' },
    ]
  },
  {
    name: 'Remix',
    category: 'frontend',
    description: 'Full stack web framework focused on web standards and modern UX.',
    website: 'https://remix.run',
    icon: '💿',
    color: 'bg-zinc-800 text-white border-zinc-700',
    html: [
      { pattern: /window\.__remixContext/i, reason: 'Remix hydration context ("__remixContext") found' }
    ]
  },
  {
    name: 'HTMX',
    category: 'frontend',
    description: 'Modern high-power attributes for HTML without complex client JavaScript frameworks.',
    website: 'https://htmx.org',
    icon: '⚡',
    html: [
      { pattern: /hx-get|hx-post|hx-target|hx-swap/i, reason: 'HTMX interactive markup attributes ("hx-*") detected' }
    ]
  },
  {
    name: 'Alpine.js',
    category: 'frontend',
    description: 'Rugged, minimal tool for composing behavior directly in your HTML.',
    website: 'https://alpinejs.dev',
    icon: '🏔️',
    color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    html: [
      { pattern: /x-data|x-init|x-show|x-bind/i, reason: 'Alpine.js reactive directives ("x-data", "x-show") found' }
    ]
  },
  {
    name: 'jQuery',
    category: 'frontend',
    description: 'Classic DOM manipulation and traversal JavaScript library.',
    website: 'https://jquery.com',
    icon: '📜',
    color: 'bg-blue-600/10 text-blue-600 border-blue-600/20',
    scripts: [
      { pattern: /jquery([.-]\d+)*(\.min)?\.js/i, reason: 'jQuery script tag included in head or body' }
    ],
    html: [
      { pattern: /jquery\.min\.js/i, reason: 'jQuery reference found in source code' }
    ]
  },

  // ==========================================
  // 2. STYLING & UI FRAMEWORKS
  // ==========================================
  {
    name: 'Tailwind CSS',
    category: 'styling',
    description: 'Utility-first CSS framework for rapid and modern custom UI building.',
    website: 'https://tailwindcss.com',
    icon: '🎨',
    color: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    html: [
      { pattern: /class="[^"]*\b(flex|grid|items-center|justify-between|space-y-|p-[0-9]|px-[0-9]|py-[0-9]|bg-[a-z]+-[0-9]{2,3}|text-[a-z]+-[0-9]{2,3})\b[^"]*"/i, reason: 'Distinctive Tailwind utility classes detected in HTML markup' },
      { pattern: /tailwindcss/i, reason: 'Tailwind stylesheet link or comments found' }
    ]
  },
  {
    name: 'Bootstrap',
    category: 'styling',
    description: 'Popular responsive front-end component library.',
    website: 'https://getbootstrap.com',
    icon: '🅱️',
    color: 'bg-indigo-600/10 text-indigo-600 border-indigo-600/20',
    html: [
      { pattern: /class="[^"]*\b(container-fluid|col-md-|col-lg-|navbar-brand|btn-primary|d-flex)\b[^"]*"/i, reason: 'Bootstrap grid & component class signatures found' },
      { pattern: /bootstrap(\.min)?\.(css|js)/i, reason: 'Bootstrap CSS/JS bundle found' }
    ]
  },
  {
    name: 'Material UI (MUI)',
    category: 'styling',
    description: 'Google Material Design component library for React.',
    website: 'https://mui.com',
    icon: '🔷',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    html: [
      { pattern: /class="[^"]*Mui[A-Z][a-zA-Z]+-root/i, reason: 'MUI prefixed component classes ("MuiButton-root", etc.) found' }
    ]
  },
  {
    name: 'Chakra UI',
    category: 'styling',
    description: 'Simple, modular and accessible component library for React.',
    website: 'https://chakra-ui.com',
    icon: '⚡',
    color: 'bg-teal-600/10 text-teal-400 border-teal-600/20',
    html: [
      { pattern: /class="[^"]*chakra-[a-z]+/i, reason: 'Chakra UI CSS classes ("chakra-button", etc.) detected' }
    ]
  },

  // ==========================================
  // 3. BACKEND & RUNTIMES
  // ==========================================
  {
    name: 'Node.js / Express',
    category: 'backend',
    description: 'JavaScript runtime & minimalist web framework for server-side apps.',
    website: 'https://expressjs.com',
    icon: '🟢',
    color: 'bg-green-600/10 text-green-600 border-green-600/20',
    headers: [
      { key: 'x-powered-by', valueRegex: /Express/i, reason: 'Header "X-Powered-By: Express" detected' }
    ],
    cookies: [
      { pattern: /connect\.sid/i, reason: 'Express session cookie ("connect.sid") identified' }
    ]
  },
  {
    name: 'PHP',
    category: 'backend',
    description: 'Server-side scripting language powering WordPress, Laravel, and millions of sites.',
    website: 'https://php.net',
    icon: '🐘',
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    headers: [
      { key: 'x-powered-by', valueRegex: /PHP/i, reason: 'Header "X-Powered-By: PHP" present' }
    ],
    cookies: [
      { pattern: /PHPSESSID/i, reason: 'Standard PHP session cookie ("PHPSESSID") detected' }
    ]
  },
  {
    name: 'Laravel',
    category: 'backend',
    description: 'Elegant PHP web application framework with expressive syntax.',
    website: 'https://laravel.com',
    icon: '🔴',
    color: 'bg-red-600/10 text-red-600 border-red-600/20',
    cookies: [
      { pattern: /laravel_session/i, reason: 'Laravel default session cookie ("laravel_session") found' }
    ],
    headers: [
      { key: 'set-cookie', valueRegex: /laravel_session/i, reason: 'Laravel session cookie set by server' }
    ]
  },
  {
    name: 'Python (Django)',
    category: 'backend',
    description: 'High-level Python web framework encouraging rapid, secure development.',
    website: 'https://www.djangoproject.com',
    icon: '🐍',
    color: 'bg-emerald-700/10 text-emerald-700 border-emerald-700/20',
    cookies: [
      { pattern: /csrftoken/i, reason: 'Django default CSRF token cookie ("csrftoken") found' },
      { pattern: /sessionid/i, reason: 'Django standard session ID pattern' }
    ]
  },
  {
    name: 'Ruby on Rails',
    category: 'backend',
    description: 'Server-side web app framework in Ruby emphasizing convention over configuration.',
    website: 'https://rubyonrails.org',
    icon: '💎',
    color: 'bg-rose-600/10 text-rose-600 border-rose-600/20',
    headers: [
      { key: 'x-powered-by', valueRegex: /Phusion Passenger|Rails/i, reason: 'Rails or Passenger application server header detected' },
      { key: 'x-runtime', reason: 'Header "X-Runtime" (standard Rails metric) present' }
    ],
    cookies: [
      { pattern: /_session_id/i, reason: 'Rails convention session cookie found' }
    ]
  },
  {
    name: 'ASP.NET / C#',
    category: 'backend',
    description: 'Cross-platform, open-source framework by Microsoft for modern cloud web apps.',
    website: 'https://dotnet.microsoft.com',
    icon: '🔷',
    color: 'bg-purple-600/10 text-purple-600 border-purple-600/20',
    headers: [
      { key: 'x-powered-by', valueRegex: /ASP\.NET/i, reason: 'Header "X-Powered-By: ASP.NET" detected' },
      { key: 'x-aspnet-version', reason: 'Header "X-AspNet-Version" present' }
    ],
    cookies: [
      { pattern: /ASP\.NET_SessionId/i, reason: 'ASP.NET session cookie found' },
      { pattern: /__RequestVerificationToken/i, reason: 'ASP.NET anti-forgery token found' }
    ]
  },
  {
    name: 'Java / Spring Boot',
    category: 'backend',
    description: 'Enterprise Java backend framework for microservices and scalable web platforms.',
    website: 'https://spring.io',
    icon: '☕',
    color: 'bg-amber-600/10 text-amber-600 border-amber-600/20',
    cookies: [
      { pattern: /JSESSIONID/i, reason: 'Java EE / Spring session cookie ("JSESSIONID") found' }
    ]
  },

  // ==========================================
  // 4. CMS & E-COMMERCE PLATFORMS
  // ==========================================
  {
    name: 'WordPress',
    category: 'cms',
    description: 'World\'s most popular Content Management System, powering 40%+ of the web.',
    website: 'https://wordpress.org',
    icon: '📝',
    color: 'bg-sky-600/10 text-sky-600 border-sky-600/20',
    meta: [
      { name: 'generator', contentRegex: /WordPress/i, reason: 'Meta tag generator specifies "WordPress"' }
    ],
    html: [
      { pattern: /\/wp-content\/(themes|plugins)\//i, reason: 'WordPress core folder structure ("/wp-content/") found in HTML' },
      { pattern: /\/wp-includes\//i, reason: 'WordPress internal scripts ("/wp-includes/") linked' }
    ]
  },
  {
    name: 'Shopify',
    category: 'ecommerce',
    description: 'Complete e-commerce platform powering online stores and global commerce.',
    website: 'https://shopify.com',
    icon: '🛍️',
    color: 'bg-lime-600/10 text-lime-600 border-lime-600/20',
    headers: [
      { key: 'x-shopify-stage', reason: 'Shopify internal edge routing header detected' },
      { key: 'server', valueRegex: /cloudflare/i, reason: 'Shopify Cloudflare edge proxy' }
    ],
    html: [
      { pattern: /cdn\.shopify\.com/i, reason: 'Assets loaded from Shopify CDN' },
      { pattern: /Shopify\.shop\s*=/i, reason: 'Global "Shopify.shop" JavaScript object initialized' }
    ]
  },
  {
    name: 'WooCommerce',
    category: 'ecommerce',
    description: 'Open-source e-commerce plugin for WordPress.',
    website: 'https://woocommerce.com',
    icon: '🛒',
    color: 'bg-purple-600/10 text-purple-600 border-purple-600/20',
    html: [
      { pattern: /woocommerce/i, reason: 'WooCommerce style hooks and scripts found' }
    ]
  },
  {
    name: 'Webflow',
    category: 'cms',
    description: 'Visual web design platform, CMS, and hosting software-as-a-service.',
    website: 'https://webflow.com',
    icon: '🎨',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    meta: [
      { name: 'generator', contentRegex: /Webflow/i, reason: 'Meta generator indicates "Webflow"' }
    ],
    html: [
      { pattern: /uploads-ssl\.webflow\.com|w-nav|w-dropdown/i, reason: 'Webflow assets CDN and "w-" prefixed UI classes found' }
    ]
  },
  {
    name: 'Wix',
    category: 'cms',
    description: 'Cloud-based website builder platform.',
    website: 'https://wix.com',
    icon: '✨',
    color: 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20',
    meta: [
      { name: 'generator', contentRegex: /Wix\.com/i, reason: 'Meta generator indicates "Wix.com"' }
    ],
    html: [
      { pattern: /static\.wixstatic\.com/i, reason: 'Assets loaded from Wix static CDN' }
    ]
  },
  {
    name: 'Drupal',
    category: 'cms',
    description: 'Open source content management system for complex enterprise web applications.',
    website: 'https://drupal.org',
    icon: '💧',
    color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    headers: [
      { key: 'x-drupal-cache', reason: 'Header "X-Drupal-Cache" detected' },
      { key: 'x-generator', valueRegex: /Drupal/i, reason: 'Header "X-Generator: Drupal" found' }
    ],
    html: [
      { pattern: /Drupal\.settings/i, reason: 'Drupal JavaScript settings object present' }
    ]
  },

  // ==========================================
  // 5. HOSTING, CDN & EDGE NETWORKS
  // ==========================================
  {
    name: 'Akamai CDN',
    category: 'hosting',
    description: 'Enterprise global content delivery network and cybersecurity platform.',
    website: 'https://www.akamai.com',
    icon: '🌐',
    color: 'bg-blue-600/10 text-blue-500 border-blue-500/20',
    headers: [
      { key: 'ak-grn', reason: 'Akamai Global Request Number ("ak-grn") header detected' },
      { key: 'x-akamai-transformed', reason: 'Akamai asset transformation trace header found' },
      { key: 'server', valueRegex: /AkamaiGHost/i, reason: 'Server header indicates Akamai Global Host' }
    ],
    cookies: [
      { pattern: /ak_bmsc|_abck|bm_sz/i, reason: 'Akamai Bot Manager security cookie found' }
    ]
  },
  {
    name: 'Cloudflare',
    category: 'hosting',
    description: 'Global CDN, DDoS protection, DNS, and edge worker security platform.',
    website: 'https://cloudflare.com',
    icon: '☁️',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    headers: [
      { key: 'cf-ray', reason: 'Cloudflare Ray ID ("CF-Ray") tracking header detected' },
      { key: 'cf-cache-status', reason: 'Cloudflare edge caching status header found' },
      { key: 'server', valueRegex: /cloudflare/i, reason: 'Server header identifies "cloudflare"' }
    ],
    cookies: [
      { pattern: /cf_clearance|__cf_bm/i, reason: 'Cloudflare security bot clearance cookie found' }
    ]
  },
  {
    name: 'Vercel',
    category: 'hosting',
    description: 'Frontend cloud platform for static & hybrid deployment with global Edge Network.',
    website: 'https://vercel.com',
    icon: '▲',
    color: 'bg-black text-white dark:bg-zinc-800',
    headers: [
      { key: 'x-vercel-id', reason: 'Vercel deployment server trace header ("X-Vercel-Id") found' },
      { key: 'server', valueRegex: /vercel/i, reason: 'Server header identifies "Vercel"' }
    ]
  },
  {
    name: 'Netlify',
    category: 'hosting',
    description: 'Cloud computing and web development platform for modern Jamstack sites.',
    website: 'https://netlify.com',
    icon: '🌐',
    color: 'bg-teal-600/10 text-teal-600 border-teal-600/20',
    headers: [
      { key: 'x-nf-request-id', reason: 'Netlify request tracing ID ("X-NF-Request-Id") found' },
      { key: 'server', valueRegex: /Netlify/i, reason: 'Server header indicates "Netlify"' }
    ]
  },
  {
    name: 'AWS CloudFront / S3',
    category: 'hosting',
    description: 'Amazon Web Services global fast content delivery network.',
    website: 'https://aws.amazon.com/cloudfront',
    icon: '📦',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    headers: [
      { key: 'x-amz-cf-id', reason: 'AWS CloudFront tracking header ("X-Amz-Cf-Id") detected' },
      { key: 'x-amz-request-id', reason: 'AWS S3 / API Gateway origin header' }
    ],
    cookies: [
      { pattern: /AWSALB|AWSALBCORS/i, reason: 'AWS Application Load Balancer sticky cookie detected' }
    ]
  },
  {
    name: 'Fastly CDN',
    category: 'hosting',
    description: 'Edge cloud platform programmable content delivery network.',
    website: 'https://fastly.com',
    icon: '⚡',
    color: 'bg-rose-600/10 text-rose-500 border-rose-500/20',
    headers: [
      { key: 'x-fastly-request-id', reason: 'Fastly request tracing ID detected' },
      { key: 'fastly-restarts', reason: 'Fastly edge cache restart trace found' }
    ]
  },
  {
    name: 'Nginx',
    category: 'server',
    description: 'High-performance HTTP web server, reverse proxy, and load balancer.',
    website: 'https://nginx.org',
    icon: '🟢',
    color: 'bg-green-700/10 text-green-700 border-green-700/20',
    headers: [
      { key: 'server', valueRegex: /nginx/i, reason: 'Server header explicitly specifies "nginx"' }
    ]
  },
  {
    name: 'Apache HTTP Server',
    category: 'server',
    description: 'Decentralized open-source cross-platform web server.',
    website: 'https://httpd.apache.org',
    icon: '🪶',
    color: 'bg-red-700/10 text-red-700 border-red-700/20',
    headers: [
      { key: 'server', valueRegex: /apache/i, reason: 'Server header specifies "Apache"' }
    ]
  },
  {
    name: 'Varnish Cache',
    category: 'server',
    description: 'High-performance HTTP accelerator and reverse proxy caching software.',
    website: 'https://varnish-cache.org',
    icon: '⚡',
    headers: [
      { key: 'x-varnish', reason: 'Header "X-Varnish" trace id detected' },
      { key: 'via', valueRegex: /varnish/i, reason: 'Via proxy header discloses Varnish' }
    ]
  },

  // ==========================================
  // 6. ANALYTICS, MONITORING & DEV TOOLS
  // ==========================================
  {
    name: 'New Relic',
    category: 'analytics',
    description: 'Observability and application performance monitoring platform.',
    website: 'https://newrelic.com',
    icon: '📈',
    color: 'bg-cyan-700/10 text-cyan-400 border-cyan-500/20',
    html: [
      { pattern: /js-agent\.newrelic\.com|NREUM/i, reason: 'New Relic APM client browser monitoring script detected' }
    ],
    csp: [
      { pattern: /newrelic\.com|nr-data\.net/i, reason: 'New Relic reporting endpoint configured in CSP' }
    ]
  },
  {
    name: 'Google Analytics / Tag Manager',
    category: 'analytics',
    description: 'Web analytics service by Google to track and report website traffic.',
    website: 'https://marketingplatform.google.com/about/analytics/',
    icon: '📊',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    scripts: [
      { pattern: /googletagmanager\.com|google-analytics\.com\/analytics\.js/i, reason: 'Google Analytics / Tag Manager script loaded' }
    ],
    html: [
      { pattern: /gtag\('config'|dataLayer\s*=/i, reason: 'Google Tag dataLayer configuration detected' },
      { pattern: /googletagmanager\.com/i, reason: 'Google Tag Manager referenced in CSP or source' }
    ],
    csp: [
      { pattern: /googletagmanager\.com|google-analytics\.com/i, reason: 'Google Tag Manager allowed in CSP' }
    ]
  },
  {
    name: 'Sentry',
    category: 'analytics',
    description: 'Application performance monitoring and error tracking software for developers.',
    website: 'https://sentry.io',
    icon: '🛡️',
    color: 'bg-purple-600/10 text-purple-400 border-purple-500/20',
    html: [
      { pattern: /browser\.sentry-cdn\.com|Sentry\.init/i, reason: 'Sentry client SDK initialization detected' }
    ],
    csp: [
      { pattern: /sentry\.io/i, reason: 'Sentry crash reporting endpoint found in CSP' }
    ]
  },
  {
    name: 'Datadog',
    category: 'analytics',
    description: 'Cloud-scale monitoring and security observability platform.',
    website: 'https://datadoghq.com',
    icon: '🐕',
    color: 'bg-purple-700/10 text-purple-400 border-purple-600/20',
    html: [
      { pattern: /datadog-rum/i, reason: 'Datadog Real User Monitoring (RUM) client script found' }
    ],
    csp: [
      { pattern: /datadoghq\.com/i, reason: 'Datadog telemetry endpoint allowed in CSP' }
    ]
  },
  {
    name: 'Hotjar',
    category: 'analytics',
    description: 'Behavior analytics and user feedback service with heatmaps and recordings.',
    website: 'https://hotjar.com',
    icon: '🔥',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    scripts: [
      { pattern: /static\.hotjar\.com/i, reason: 'Hotjar tracking script loaded' }
    ],
    csp: [
      { pattern: /hotjar\.com/i, reason: 'Hotjar heatmap endpoint configured in CSP' }
    ]
  },

  // ==========================================
  // 7. PAYMENT & FINTECH GATEWAYS
  // ==========================================
  {
    name: 'Stripe',
    category: 'payment',
    description: 'Financial infrastructure and payment processing gateway.',
    website: 'https://stripe.com',
    icon: '💳',
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    scripts: [
      { pattern: /js\.stripe\.com\/v3/i, reason: 'Stripe payments client SDK script detected' }
    ],
    csp: [
      { pattern: /stripe\.com/i, reason: 'Stripe checkout API connection defined in CSP' }
    ]
  },
  {
    name: 'Paytm Payment Gateway',
    category: 'payment',
    description: 'India\'s leading digital payment gateway and financial services provider.',
    website: 'https://business.paytm.com',
    icon: '💰',
    color: 'bg-sky-600/10 text-sky-400 border-sky-500/20',
    html: [
      { pattern: /paytmClientId|securegw\.paytm\.in/i, reason: 'Paytm merchant client credentials or gateway detected' }
    ]
  },
  {
    name: 'Razorpay',
    category: 'payment',
    description: 'Complete payments solution for Indian businesses.',
    website: 'https://razorpay.com',
    icon: '⚡',
    color: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    scripts: [
      { pattern: /checkout\.razorpay\.com/i, reason: 'Razorpay Checkout script bundle loaded' }
    ],
    csp: [
      { pattern: /razorpay\.com/i, reason: 'Razorpay API permissions declared in CSP' }
    ]
  },
  {
    name: 'PayPal',
    category: 'payment',
    description: 'Global online payments system supporting worldwide money transfers.',
    website: 'https://paypal.com',
    icon: '🅿️',
    color: 'bg-blue-700/10 text-blue-400 border-blue-600/20',
    scripts: [
      { pattern: /paypal\.com\/sdk\/js/i, reason: 'PayPal JavaScript SDK loaded' }
    ]
  },

  // ==========================================
  // 8. CLOUD BACKEND & DATABASES
  // ==========================================
  {
    name: 'Google Maps Platform',
    category: 'analytics',
    description: 'Dynamic maps, geolocation, and routing APIs by Google.',
    website: 'https://mapsplatform.google.com',
    icon: '🗺️',
    color: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    csp: [
      { pattern: /maps\.googleapis\.com|maps\.gstatic\.com/i, reason: 'Google Maps API authorized in CSP policy' }
    ],
    scripts: [
      { pattern: /maps\.googleapis\.com\/maps\/api/i, reason: 'Google Maps JavaScript API loaded' }
    ]
  },
  {
    name: 'Firebase',
    category: 'database',
    description: 'Google app development platform with Realtime Database, Firestore, and Auth.',
    website: 'https://firebase.google.com',
    icon: '🔥',
    color: 'bg-amber-600/10 text-amber-500 border-amber-500/20',
    csp: [
      { pattern: /firebaseio\.com|googleapis\.com\/v1beta1\/projects/i, reason: 'Firebase Realtime / Firestore backend connection found' }
    ],
    html: [
      { pattern: /firebaseapp\.com|firebase\.initializeApp/i, reason: 'Firebase SDK initialization found' }
    ]
  },
  {
    name: 'Supabase',
    category: 'database',
    description: 'Open source Firebase alternative with Postgres database, Authentication, and Edge Functions.',
    website: 'https://supabase.com',
    icon: '⚡',
    color: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    csp: [
      { pattern: /\.supabase\.co/i, reason: 'Supabase Postgres/API cluster endpoint identified in CSP' }
    ]
  }
];

export function inspectCollectedData(
  headers: Record<string, string>,
  cookies: string[],
  html: string,
  scripts: string[],
  metaList: { name?: string; property?: string; content: string }[],
  cspString: string
): DetectedTech[] {
  const results: DetectedTech[] = [];
  const lowerHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    lowerHeaders[k.toLowerCase()] = v;
  }

  for (const tech of TECHNOLOGY_DATABASE) {
    const evidence: string[] = [];
    let score = 0;

    // 1. Check Headers
    if (tech.headers) {
      for (const h of tech.headers) {
        const val = lowerHeaders[h.key.toLowerCase()];
        if (val) {
          if (!h.valueRegex || h.valueRegex.test(val)) {
            evidence.push(h.reason);
            score += 40;
          }
        }
      }
    }

    // 2. Check Cookies
    if (tech.cookies) {
      for (const c of tech.cookies) {
        for (const cookieStr of cookies) {
          if (c.pattern.test(cookieStr)) {
            evidence.push(c.reason);
            score += 35;
            break;
          }
        }
      }
    }

    // 3. Check Meta Tags
    if (tech.meta) {
      for (const m of tech.meta) {
        for (const meta of metaList) {
          const nameMatch = !m.name || (meta.name && meta.name.toLowerCase() === m.name.toLowerCase());
          const propMatch = !m.property || (meta.property && meta.property.toLowerCase() === m.property.toLowerCase());
          if ((nameMatch || propMatch) && m.contentRegex.test(meta.content)) {
            evidence.push(m.reason);
            score += 40;
            break;
          }
        }
      }
    }

    // 4. Check HTML Patterns
    if (tech.html) {
      for (const p of tech.html) {
        if (p.pattern.test(html)) {
          evidence.push(p.reason);
          score += 30;
          break;
        }
      }
    }

    // 5. Check Script Sources
    if (tech.scripts) {
      for (const s of tech.scripts) {
        for (const src of scripts) {
          if (s.pattern.test(src)) {
            evidence.push(s.reason);
            score += 35;
            break;
          }
        }
      }
    }

    // 6. CSP (Content Security Policy) Deep Forensic Mining
    if (tech.csp && cspString) {
      for (const c of tech.csp) {
        if (c.pattern.test(cspString)) {
          evidence.push(c.reason);
          score += 35;
          break;
        }
      }
    }

    if (evidence.length > 0) {
      const confidence = Math.min(100, Math.max(50, score));
      results.push({
        name: tech.name,
        category: tech.category,
        description: tech.description,
        website: tech.website,
        icon: tech.icon,
        color: tech.color || 'bg-zinc-800 text-zinc-300 border-zinc-700',
        confidence,
        evidence: Array.from(new Set(evidence))
      });
    }
  }

  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
}
