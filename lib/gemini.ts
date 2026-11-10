import { DetectedTech } from './technologies';

export interface ArchitectureSummary {
  overview: string;
  frontendRole: string;
  backendRole: string;
  infrastructureRole: string;
  cloneTips: string;
}

export async function generateArchitectureSummary(
  targetUrl: string,
  detected: DetectedTech[]
): Promise<ArchitectureSummary> {
  const apiKey = process.env.GEMINI_API_KEY;

  const techNames = detected.map(t => `${t.name} (${t.category})`).join(', ');

  // If Gemini API Key is available, call Gemini API
  if (apiKey) {
    try {
      const prompt = `You are a Principal Software Architect analyzing a website.
Target Website: ${targetUrl}
Detected Technologies: ${techNames}

Provide a concise, ultra-clear architectural breakdown of how this website is structured.
Reply ONLY with a valid JSON object matching this TypeScript interface (no markdown, no backticks):
{
  "overview": "2-3 sentences explaining the overarching stack and architectural approach.",
  "frontendRole": "1-2 sentences on what powers the user interface and client experience.",
  "backendRole": "1-2 sentences on how server-side logic and APIs operate (or serverless).",
  "infrastructureRole": "1-2 sentences on how hosting, CDN, and caching are distributed.",
  "cloneTips": "1-2 sentences with practical advice on how a modern developer would build a clone of this stack."
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            overview: parsed.overview || 'Architecture successfully analyzed.',
            frontendRole: parsed.frontendRole || '',
            backendRole: parsed.backendRole || '',
            infrastructureRole: parsed.infrastructureRole || '',
            cloneTips: parsed.cloneTips || ''
          };
        }
      }
    } catch (err) {
      console.error('Gemini API call failed, falling back to heuristic engine:', err);
    }
  }

  // Smart Heuristic Fallback (works 100% offline & without API key)
  const frontend = detected.filter(t => t.category === 'frontend').map(t => t.name);
  const backend = detected.filter(t => t.category === 'backend').map(t => t.name);
  const cms = detected.filter(t => t.category === 'cms' || t.category === 'ecommerce').map(t => t.name);
  const hosting = detected.filter(t => t.category === 'hosting' || t.category === 'server').map(t => t.name);
  const styling = detected.filter(t => t.category === 'styling').map(t => t.name);

  let overview = `${targetUrl} appears to be built using a modern decoupled architecture.`;
  if (cms.length > 0) {
    overview = `${targetUrl} is powered by ${cms.join(' and ')}, providing content management and dynamic storefront/page capabilities.`;
  } else if (frontend.includes('Next.js')) {
    overview = `${targetUrl} utilizes a hybrid Next.js application framework combining Server-Side Rendering (SSR) and client interactivity.`;
  } else if (frontend.length > 0) {
    overview = `${targetUrl} relies on ${frontend.join(', ')} for a dynamic Single Page Application (SPA) experience.`;
  }

  const frontendRole = frontend.length > 0
    ? `The frontend is driven by ${frontend.join(', ')}${styling.length ? ` styled with ${styling.join(', ')}` : ''}, ensuring responsive rendering and reactive state updates.`
    : 'Standard HTML5, CSS3, and modern browser APIs handle the client presentation layer.';

  const backendRole = backend.length > 0
    ? `Server-side operations and API handling are routed through ${backend.join(', ')}.`
    : (cms.length > 0 
        ? `${cms[0]}'s internal PHP/Node API layer handles dynamic transactions and data persistence.`
        : 'Backend runs on serverless edge handlers or a microservices proxy concealing origin infrastructure.');

  const infrastructureRole = hosting.length > 0
    ? `Traffic routing, SSL termination, and asset caching are handled by ${hosting.join(' and ')}.`
    : 'Assets and pages are distributed through global edge caching nodes for low-latency delivery.';

  const cloneTips = frontend.includes('Next.js') || frontend.includes('React')
    ? 'To build a similar website, you can use Next.js 14 with Tailwind CSS on Vercel, paired with a headless database like Supabase or PostgreSQL.'
    : (cms.includes('WordPress')
        ? 'You can recreate this stack quickly with a managed WordPress host or a headless WordPress setup using GraphQL.'
        : 'Start with a standard React + Tailwind frontend connected to a Node.js/Express or Python backend API.');

  return {
    overview,
    frontendRole,
    backendRole,
    infrastructureRole,
    cloneTips
  };
}
