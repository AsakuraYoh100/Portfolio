import { missions } from '../../data/projects';
import { MissionCard } from './MissionCard';

export function Projects() {
  return (
    <section id="projects" className="section projects-section" aria-label="Projects">
      <div className="section-heading">
        <span className="section-kicker">03 · MISSIONS</span>
        <h2>PROJECTS</h2>
      </div>

      <div className="missions-grid">
        {missions.map((m) => (
          <MissionCard mission={m} key={m.id} />
        ))}
      </div>
    </section>
  );
}
