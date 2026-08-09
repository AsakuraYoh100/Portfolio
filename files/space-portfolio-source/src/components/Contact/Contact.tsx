import { useState, type FormEvent } from 'react';

const SOCIALS = [
  {
    label: 'EMAIL',
    value: 'elijah.dedios26@gmail.com',
    href: 'mailto:elijah.dedios26@gmail.com',
  },
  {
    label: 'LINKEDIN',
    value: 'elijah-christian-m-de-dios',
    href: 'https://linkedin.com/in/elijah-christian-m-de-dios-2406a4211',
  },
  {
    label: 'GITHUB',
    value: 'AsakuraYoh100',
    href: 'https://github.com/AsakuraYoh100',
  },
  {
    label: 'FACEBOOK',
    value: 'elijahcdedios',
    href: 'https://facebook.com/elijahcdedios',
  },
];

export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();
    if (!name || !email || !message) return;

    // No backend endpoint exists yet, so this opens a pre-filled email —
    // a real "send" wire-up just needs an API route or form service swapped in here.
    const subject = encodeURIComponent(`Transmission from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:elijah.dedios26@gmail.com?subject=${subject}&body=${body}`;

    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="section contact-section" aria-label="Contact">
      <div className="section-heading">
        <span className="section-kicker">05 · TRANSMISSION CENTER</span>
        <h2>READY TO START A CONVERSATION?</h2>
      </div>

      <div className="contact-grid">
        <div className="panel contact-links">
          <div className="panel-title">OPEN CHANNELS</div>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="channel-row">
              <span className="channel-label">{s.label}</span>
              <span className="channel-value">{s.value}</span>
              <span className="channel-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>

        <form className="panel contact-form" onSubmit={handleSubmit}>
          <div className="panel-title">NEW TRANSMISSION</div>
          <label>
            NAME
            <input name="name" type="text" required autoComplete="name" />
          </label>
          <label>
            EMAIL
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            MESSAGE
            <textarea name="message" required rows={5} />
          </label>
          <button type="submit" className="btn-cosmic primary full">
            SEND TRANSMISSION
          </button>
          {sent && <div className="transmission-sent">TRANSMISSION SENT</div>}
        </form>
      </div>

      <div className="closing-message">Thanks for exploring my universe.</div>
    </section>
  );
}
