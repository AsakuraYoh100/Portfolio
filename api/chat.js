// api/chat.js
// Vercel serverless function — server-side brain for "Elijah AI".
// Uses Google's Gemini API, which has a genuinely free tier (no credit
// card required) as long as billing is never enabled on the project.
// The API key is read from an environment variable and NEVER sent to
// the browser — the client only ever talks to this endpoint.

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// ---- Safe destinations. The model may only reference these keys — it
// can never invent an arbitrary URL or section id. ----
const SECTION_IDS = ['hero', 'enerduo', 'projects', 'stack', 'experience', 'about', 'edu-ach', 'contact'];
const EXTERNAL_URLS = {
  enerduo: 'https://enerduo.vercel.app/',
  github: 'https://github.com/AsakuraYoh100',
  portfolio: 'https://portfolio-sooty-three-25.vercel.app/'
};

// ---- Portfolio knowledge (source of truth, kept in sync with the
// content actually shown on the site). Nothing here should be invented
// — only what the portfolio / resume already states. ----
const portfolioData = {
  profile: {
    name: 'Elijah Christian De Dios',
    education: 'Bachelor of Science in Information Technology (BSIT)',
    school: 'Asia Pacific College of Advanced Studies',
    location: 'Philippines (Bataan)',
    status: 'BSIT Graduate, open to work',
    areas: ['IT Support', 'Help Desk', 'System Administration', 'Web Development', 'IoT Development']
  },
  skills: {
    programming: ['C++', 'C#', 'Java', 'Python', 'Turbo C'],
    web: ['HTML5', 'CSS3', 'JavaScript', 'React', 'PHP', 'MySQL', 'REST APIs'],
    systems: ['Windows', 'Linux', 'Ubuntu Server', 'Proxmox VE', 'Virtual Machines', 'Networking',
      'Server Deployment', 'Tier 1 Support', 'Printer Support', 'Hardware'],
    tools: ['Git', 'GitHub', 'VS Code', 'MS Office', 'Excel', 'Google Workspace'],
    creative: ['Photoshop', 'Premiere Pro', 'CapCut Pro', 'DaVinci Resolve', 'Canva', 'Drone Piloting']
  },
  experience: [{
    role: 'MIS Intern',
    org: 'Management Information System — Local Government Unit, Hermosa, Bataan',
    dates: 'August 2025 — December 2025',
    responsibilities: [
      'Windows and Linux operating system deployment',
      'Hardware and software troubleshooting',
      'Tier 1 technical support',
      'Printer, router, switch, and network connectivity troubleshooting',
      'Computer and network device maintenance',
      'Proxmox VE virtual machines',
      'Ubuntu Server administration and maintenance',
      'Oracle database support',
      'Technical documentation and IT asset inventories'
    ]
  }],
  projects: [
    {
      name: 'ENERDUO',
      type: 'Smart Hybrid Charging Station',
      award: 'Best Capstone Award 2026',
      url: 'https://enerduo.vercel.app/',
      technologies: ['ESP32', 'IoT', 'Web Development', 'Renewable Energy', 'Database (Supabase)', 'Real-time Monitoring', 'GitHub', 'Vercel'],
      description: 'Award-winning capstone project — a smart hybrid charging station powered by renewable energy sources, featuring real-time monitoring, intelligent power management, and offline/online web access designed for disaster-resilient use.',
      actions: { live: 'https://enerduo.vercel.app/', caseStudy: 'enerduo' }
    },
    { name: 'Nature Flow', type: 'Automated IoT irrigation system' }
  ],
  achievements: ['Best Capstone Award 2026 (ENERDUO)'],
  contact: { note: 'Reach Elijah through the contact section of the portfolio.' }
};

// ---- very small in-memory rate limiter (best-effort; resets on cold start) ----
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const rateBuckets = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateBuckets.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

function buildSystemPrompt() {
  return `You are "Elijah AI", the portfolio assistant embedded in the personal portfolio website of ${portfolioData.profile.name}, a ${portfolioData.profile.status} from ${portfolioData.profile.school} in ${portfolioData.profile.location}.

You may ONLY use the following portfolio knowledge. Never invent employers, job titles, certifications, projects, or technologies that are not listed here. If asked something not covered, say plainly you don't have that information in Elijah's portfolio.

PORTFOLIO KNOWLEDGE (JSON):
${JSON.stringify(portfolioData, null, 2)}

RULES:
- Never claim to be Elijah. You are his AI portfolio assistant.
- Be concise, professional, technical when relevant, friendly, and slightly futuristic — not overly robotic, not exaggerated marketing. Prefer "has hands-on experience with" / "has worked with" over "is an expert".
- Never fabricate experience, projects, certifications, or employers.
- ENERDUO is Elijah's strongest/featured project (Best Capstone Award 2026). Recommend it when asked about his best or strongest work.
- If the user seems to be a recruiter or asks "why hire Elijah" or activates recruiter mode, give a concise, credible answer combining software development, IT support, systems administration, networking, IoT, hardware troubleshooting, and the award-winning capstone.
- You can trigger safe UI actions by returning the "action" field: {"type":"navigate"|"highlight","target": one of ${JSON.stringify(SECTION_IDS)}} to scroll/highlight a portfolio section, {"type":"open_external","target": one of ${JSON.stringify(Object.keys(EXTERNAL_URLS))}} to open an allowlisted external link, {"type":"resume"} to point to the resume, {"type":"contact"} to go to the contact section, or {"type":"none"} if no action fits. Never output a URL or section id outside these allowlists.
- Respond ONLY with strict JSON matching this schema, no markdown, no extra text:
{"message": "string reply to show the user", "action": {"type": "navigate|highlight|open_external|resume|contact|none", "target": "string, only when required by the type"}}`;
}

function sanitizeAction(action) {
  if (!action || typeof action !== 'object') return { type: 'none' };
  const type = action.type;
  if (type === 'navigate' || type === 'highlight') {
    if (SECTION_IDS.includes(action.target)) return { type, target: action.target };
    return { type: 'none' };
  }
  if (type === 'open_external') {
    if (Object.prototype.hasOwnProperty.call(EXTERNAL_URLS, action.target)) {
      return { type, target: action.target, url: EXTERNAL_URLS[action.target] };
    }
    return { type: 'none' };
  }
  if (type === 'resume' || type === 'contact') return { type };
  return { type: 'none' };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString().split(',')[0].trim();
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'rate_limited' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'server_not_configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || !Array.isArray(body.messages)) {
    res.status(400).json({ error: 'invalid_request' });
    return;
  }

  // Validate & clamp the conversation history.
  const MAX_MESSAGES = 16;
  const MAX_CHARS = 800;
  const cleanHistory = body.messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (cleanHistory.length === 0) {
    res.status(400).json({ error: 'invalid_request' });
    return;
  }

  // Gemini uses "user" / "model" roles instead of "user" / "assistant".
  const geminiContents = cleanHistory.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const payload = {
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: geminiContents,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 400,
      responseMimeType: 'application/json'
    }
  };

  try {
    const upstream = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      res.status(502).json({ error: 'upstream_error' });
      return;
    }

    const data = await upstream.json();
    const raw = data && data.candidates && data.candidates[0]
      && data.candidates[0].content && data.candidates[0].content.parts
      && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;

    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }

    if (!parsed || typeof parsed.message !== 'string') {
      res.status(502).json({ error: 'bad_model_output' });
      return;
    }

    res.status(200).json({
      message: parsed.message.slice(0, 2000),
      action: sanitizeAction(parsed.action)
    });
  } catch (err) {
    res.status(502).json({ error: 'upstream_unreachable' });
  }
};
