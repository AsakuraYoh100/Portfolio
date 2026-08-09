import { skillCategories } from '../../data/skills';

export function Skills() {
  return (
    <section id="skills" className="section skills-section" aria-label="Skills">
      <div className="section-heading">
        <span className="section-kicker">02 · CAPABILITIES</span>
        <h2>SKILLS</h2>
      </div>

      <div className="skills-grid">
        {skillCategories.map((cat, i) => (
          <div
            className="panel skill-panel"
            key={cat.id}
            style={{ ['--accent' as any]: cat.color, animationDelay: `${i * 0.06}s` }}
          >
            <div className="skill-panel-head">
              <span className="skill-glyph" aria-hidden="true">
                {cat.glyph}
              </span>
              <span>{cat.label}</span>
            </div>
            <ul className="skill-list">
              {cat.skills.map((s) => (
                <li key={s}>
                  <span className="skill-tick" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
