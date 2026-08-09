export function About() {
  return (
    <section id="about" className="section about-section" aria-label="About">
      <div className="section-heading">
        <span className="section-kicker">01 · IDENTIFICATION</span>
        <h2>ABOUT ME</h2>
      </div>

      <div className="panel mission-profile">
        <div className="panel-title">MISSION PROFILE</div>
        <p className="about-lead">
          Information Technology graduate specializing in systems administration,
          virtualization, hardware infrastructure, and web development.
        </p>
        <p className="about-body">
          I've worked hands-on with real infrastructure — from deploying Windows and Linux
          systems to administering Proxmox VE virtual machines and providing Tier 1 technical
          support at a Local Government Unit. Outside of systems work, I build full-stack web
          applications and IoT-integrated solutions, most notably ENERDUO, my award-winning
          capstone project.
        </p>

        <dl className="profile-grid">
          <div>
            <dt>NAME</dt>
            <dd>Elijah Christian M. De Dios</dd>
          </div>
          <div>
            <dt>FIELD</dt>
            <dd>Information Technology</dd>
          </div>
          <div>
            <dt>SPECIALIZATION</dt>
            <dd>Systems • Networking • Web Development • Technical Support</dd>
          </div>
          <div>
            <dt>STATUS</dt>
            <dd className="status-available">
              <span className="status-dot" /> Available for Opportunities
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
