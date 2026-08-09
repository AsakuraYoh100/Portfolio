import type { Mission } from '../../data/projects';

export function MissionCard({ mission }: { mission: Mission }) {
  return (
    <article className={`panel mission-card${mission.featured ? ' featured' : ''}`}>
      <div className="mission-card-head">
        <span className="mission-code">{mission.code}</span>
        <span className={`mission-status status-${mission.status.split(' ')[0].toLowerCase()}`}>
          {mission.status}
        </span>
      </div>

      <h3 className="mission-name">{mission.name}</h3>
      <div className="mission-tagline">{mission.tagline}</div>

      {mission.award && (
        <div className="mission-badge">
          <span className="badge-star">★</span> {mission.award}
        </div>
      )}

      {mission.role !== '—' && <div className="mission-role">ROLE: {mission.role}</div>}
      <p className="mission-desc">{mission.description}</p>

      {mission.tech.length > 0 && (
        <div className="mission-tech">
          {mission.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}

      {(mission.githubUrl || mission.liveUrl) && (
        <div className="mission-actions">
          {mission.githubUrl && (
            <a href={mission.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-cosmic ghost sm">
              GITHUB
            </a>
          )}
          {mission.liveUrl && (
            <a href={mission.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-cosmic sm">
              LIVE DEMO
            </a>
          )}
        </div>
      )}
    </article>
  );
}
