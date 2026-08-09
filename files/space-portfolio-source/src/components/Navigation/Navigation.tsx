import { useState } from 'react';
import type { SectionId } from '../../hooks/useScrollProgress';

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'contact', label: 'CONTACT' },
];

export function Navigation({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false);

  function go(id: SectionId) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  }

  return (
    <>
      <nav className="nav-hud" aria-label="Main navigation">
        <div className="nav-hud-logo">ECDD</div>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={active === item.id ? 'active' : ''}
                onClick={() => go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button
        className="nav-mobile-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="nav-mobile-panel">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={active === item.id ? 'active' : ''}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
