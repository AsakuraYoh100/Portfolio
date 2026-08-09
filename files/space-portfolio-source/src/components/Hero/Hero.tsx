interface HeroProps {
  onExploreProjects: () => void;
}

export function Hero({ onExploreProjects }: HeroProps) {
  return (
    <section id="home" className="section hero-section" aria-label="Introduction">
      <div className="hero-inner">
        <div className="hero-eyebrow">WELCOME TO MY DIGITAL UNIVERSE</div>
        <h1 className="hero-name">ELIJAH CHRISTIAN M. DE DIOS</h1>
        <div className="hero-roles">IT SPECIALIST • SYSTEMS • WEB DEVELOPMENT • TECHNOLOGY</div>
        <p className="hero-copy">
          Welcome to my digital universe. Explore my work, skills, projects, and technology
          journey.
        </p>
        <div className="hero-actions">
          <a href="#about" className="btn-cosmic primary" onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            ENTER MY UNIVERSE
          </a>
          <button className="btn-cosmic ghost" onClick={onExploreProjects}>
            EXPLORE PROJECTS
          </button>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-hint-line" />
      </div>
    </section>
  );
}
