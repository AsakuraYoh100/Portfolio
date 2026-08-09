import { experienceLog } from '../../data/experience';

export function Experience() {
  return (
    <section id="experience" className="section experience-section" aria-label="Experience">
      <div className="section-heading">
        <span className="section-kicker">04 · LOGBOOK</span>
        <h2>EXPERIENCE LOG</h2>
      </div>

      <div className="log-timeline">
        {experienceLog.map((entry) => (
          <div className="log-entry" key={entry.id}>
            <div className="log-marker" aria-hidden="true" />
            <div className="panel log-panel">
              <div className="log-date">{entry.dateRange}</div>
              <h3 className="log-role">{entry.role}</h3>
              <div className="log-org">{entry.org}</div>
              <div className="log-tags">
                {entry.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <ul className="log-points">
                {entry.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
