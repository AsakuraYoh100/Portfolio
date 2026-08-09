export interface SkillCategory {
  id: string;
  label: string;
  glyph: string; // small unicode/HUD glyph, no external icon deps
  color: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'systems',
    label: 'SYSTEMS & SERVERS',
    glyph: '◈',
    color: '#3b82f6',
    skills: ['Proxmox VE', 'Ubuntu Server', 'Linux', 'Windows'],
  },
  {
    id: 'network',
    label: 'NETWORKING & HARDWARE',
    glyph: '◉',
    color: '#22d3ee',
    skills: [
      'RJ45 Cable Crimping',
      'Network Installation',
      'Hardware Troubleshooting',
      'Printer Troubleshooting',
    ],
  },
  {
    id: 'programming',
    label: 'PROGRAMMING',
    glyph: '◇',
    color: '#8b5cf6',
    skills: ['C++', 'C#', 'Java', 'Python'],
  },
  {
    id: 'web',
    label: 'WEB DEVELOPMENT',
    glyph: '◆',
    color: '#f59e0b',
    skills: ['HTML5', 'CSS3', 'JavaScript'],
  },
  {
    id: 'tools',
    label: 'TOOLS',
    glyph: '◎',
    color: '#f472b6',
    skills: ['Visual Studio Code', 'Adobe Premiere Pro', 'DaVinci Resolve', 'CapCut'],
  },
];
