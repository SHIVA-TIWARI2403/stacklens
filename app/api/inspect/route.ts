import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { inspectCollectedData, DetectedTech } from '@/lib/technologies';
import { generateArchitectureSummary } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    let target = body.url?.trim();

    if (!target) {
      return NextResponse.json({ error: 'Please enter a valid website URL.' }, { status: 400 });
    }

    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(target);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format provided.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        redirect: 'follow'
      });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      const isAbort = fetchErr?.name === 'AbortError';
      return NextResponse.json(
        { error: isAbort ? 'Website took too long to respond (timeout 10s).' : `Could not reach target website: ${fetchErr?.message || 'Connection failed'}` },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeout);
    }

    const headersMap: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headersMap[key] = val;
    });

    const setCookiesHeader = response.headers.get('set-cookie') || '';
    const cookies = setCookiesHeader ? setCookiesHeader.split(/,\s*(?=[a-zA-Z0-9_-]+=)/) : [];

    const rawHtml = await response.text();
    const $ = cheerio.load(rawHtml);

    // Extract CSP (Content Security Policy) from headers or meta tag
    let cspString = response.headers.get('content-security-policy') || 
                    response.headers.get('content-security-policy-report-only') || '';
    if (!cspString) {
      const metaCsp = $('meta[http-equiv="Content-Security-Policy" i]').attr('content');
      if (metaCsp) cspString = metaCsp;
    }

    const scriptSources: string[] = [];
    $('script').each((_, el) => {
      const src = $(el).attr('src');
      if (src) scriptSources.push(src);
    });

    const metaList: { name?: string; property?: string; content: string }[] = [];
    $('meta').each((_, el) => {
      const name = $(el).attr('name');
      const property = $(el).attr('property');
      const content = $(el).attr('content') || '';
      if (content) {
        metaList.push({ name, property, content });
      }
    });

    // 🕵️ HACKER RECONNAISSANCE AUDIT
    const reconClues: string[] = [];
    let securityScore = 100;

    // Check HSTS
    if (response.headers.get('strict-transport-security')) {
      reconClues.push('✅ Strict-Transport-Security (HSTS) is actively enforced.');
    } else {
      securityScore -= 20;
      reconClues.push('⚠️ Missing HSTS header (SSL downgrade vulnerability risk).');
    }

    // Check CSP
    if (cspString) {
      reconClues.push('🛡️ Content-Security-Policy (CSP) is implemented & mined for endpoints.');
    } else {
      securityScore -= 20;
      reconClues.push('⚠️ Missing Content-Security-Policy (Vulnerable to XSS injections).');
    }

    // Check Clickjacking (X-Frame-Options)
    const xFrame = response.headers.get('x-frame-options');
    if (xFrame) {
      reconClues.push(`🔒 Clickjacking defense active: "X-Frame-Options: ${xFrame}".`);
    } else {
      securityScore -= 15;
      reconClues.push('⚠️ Missing X-Frame-Options (Vulnerable to iframe clickjacking).');
    }

    // Server Disclosure Check
    const serverHeader = response.headers.get('server');
    if (serverHeader) {
      reconClues.push(`🔍 Server banner disclosed: "${serverHeader}".`);
    } else {
      reconClues.push('🛡️ Server header is hidden/obfuscated (Hardened against banner grabbing).');
    }

    // Detect technologies with CSP integration
    const detected: DetectedTech[] = inspectCollectedData(
      headersMap,
      cookies,
      rawHtml,
      scriptSources,
      metaList,
      cspString
    );

    // Group by category
    const categories: Record<string, DetectedTech[]> = {
      frontend: [],
      backend: [],
      styling: [],
      cms: [],
      ecommerce: [],
      hosting: [],
      server: [],
      analytics: [],
      payment: [],
      database: []
    };

    for (const item of detected) {
      if (categories[item.category]) {
        categories[item.category].push(item);
      }
    }

    // Generate Architectural AI Breakdown
    const architecture = await generateArchitectureSummary(parsedUrl.hostname, detected);

    const scanTimeMs = Date.now() - startTime;

    return NextResponse.json({
      url: parsedUrl.toString(),
      hostname: parsedUrl.hostname,
      status: response.status,
      scanTimeMs,
      totalDetected: detected.length,
      detected,
      categories,
      architecture,
      recon: {
        securityScore: Math.max(20, securityScore),
        grade: securityScore >= 80 ? 'A' : (securityScore >= 60 ? 'B' : 'C'),
        clues: reconClues,
        cookiesCount: cookies.length,
        scriptsCount: scriptSources.length
      }
    });

  } catch (error: any) {
    console.error('Inspection error:', error);
    return NextResponse.json(
      { error: `Internal scanning error: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
