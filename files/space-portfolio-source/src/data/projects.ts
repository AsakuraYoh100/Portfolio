export interface Mission {
  id: string;
  code: string; // MISSION 01
  name: string;
  tagline: string;
  role: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  award?: string;
  status: 'MISSION COMPLETE' | 'IN PROGRESS' | 'STANDBY';
}

export const missions: Mission[] = [
  {
    id: 'enerduo',
    code: 'MISSION 01',
    name: 'ENERDUO',
    tagline: 'Solar-Hybrid Emergency Charging Station',
    role: 'Lead Systems & Network Developer',
    description:
      'A solar-hybrid emergency charging station with an integrated digital lifeline — combining renewable energy with a real-time web dashboard for monitoring power generation, battery status, and system health, online or offline.',
    tech: ['ESP32', 'HTML', 'CSS', 'JavaScript', 'Supabase', 'GitHub', 'Vercel'],
    githubUrl: 'https://github.com/AsakuraYoh100/deleonsolarpower-website',
    featured: true,
    award: 'BEST CAPSTONE AWARD',
    status: 'MISSION COMPLETE',
  },
  {
    id: 'natureflow',
    code: 'MISSION 02',
    name: 'NATURE FLOW',
    tagline: 'Smart Automated Irrigation System',
    role: 'Systems & IoT Developer',
    description:
      'An automated irrigation platform built to assist farmers through IoT sensors, automated water distribution, and a smart monitoring dashboard — paired with a companion mobile application.',
    tech: ['IoT Sensors', 'Mobile App', 'Database', 'Smart Monitoring'],
    githubUrl: 'https://github.com/AsakuraYoh100',
    status: 'MISSION COMPLETE',
  },
  {
    id: 'next',
    code: 'MISSION 03',
    name: 'NEXT MISSION',
    tagline: 'Currently in development',
    role: '—',
    description: 'A new mission is being planned. Check back soon for the next transmission.',
    tech: [],
    status: 'STANDBY',
  },
];
