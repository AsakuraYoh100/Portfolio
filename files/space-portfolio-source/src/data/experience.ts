export interface LogEntry {
  id: string;
  dateRange: string;
  role: string;
  org: string;
  tags: string[];
  points: string[];
}

export const experienceLog: LogEntry[] = [
  {
    id: 'lgu-intern',
    dateRange: '2024 · INTERNSHIP',
    role: 'MIS Intern',
    org: 'Management Information System — Local Government Unit, Hermosa, Bataan',
    tags: ['IT Support', 'Systems Admin', 'Virtualization'],
    points: [
      'Installed and configured Windows and Linux operating systems on government workstations',
      'Provided Tier 1 technical support and help desk assistance to office personnel',
      'Diagnosed and resolved hardware, software, and printer issues across departments',
      'Deployed and administered virtual machines using the Proxmox VE hypervisor',
      'Assisted with Ubuntu Server administration, server maintenance, and Oracle database support',
      'Installed RJ45 cabling and troubleshot routers, switches, and network connectivity',
      'Maintained technical documentation, reports, and IT asset inventories',
    ],
  },
  {
    id: 'capstone',
    dateRange: '2023 — 2026 · ACADEMIC',
    role: 'Capstone Project Leader',
    org: 'BS Information Technology — ENERDUO & Nature Flow',
    tags: ['Best Capstone 2026', 'IoT', 'Web Development'],
    points: [
      'Led development of ENERDUO — a solar-hybrid emergency charging station with ESP32 and a real-time web dashboard',
      'Directed the systems and network architecture, including offline/online operation modes',
      'Co-developed Nature Flow, an automated IoT irrigation platform with a mobile companion app',
      'Awarded Best Capstone Project 2026 for technical execution and innovation',
    ],
  },
];
