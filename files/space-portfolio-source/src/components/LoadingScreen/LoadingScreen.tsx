import { useEffect, useState } from 'react';

const STEPS = ['INITIALIZING SYSTEM...', 'LOADING ENVIRONMENT...', 'LOADING GALAXY...', 'ESTABLISHING CONNECTION...'];

interface LoadingScreenProps {
  onEnter: () => void;
  exiting: boolean;
}

export function LoadingScreen({ onEnter, exiting }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (stepIndex >= STEPS.length) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 380);
    return () => clearTimeout(t);
  }, [stepIndex]);

  return (
    <div className={`loading-screen${exiting ? ' exiting' : ''}`} role="status" aria-label="Loading">
      <div className="loading-stars" aria-hidden="true">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="loading-panel">
        <div className="loading-log">
          {STEPS.slice(0, stepIndex).map((s, i) => (
            <div key={i} className="loading-log-line">
              <span className="ok">✓</span> {s}
            </div>
          ))}
        </div>

        {ready ? (
          <div className="loading-ready">
            <div className="system-ready">SYSTEM READY</div>
            <button className="enter-btn" onClick={onEnter} autoFocus>
              <span>ENTER UNIVERSE</span>
            </button>
          </div>
        ) : (
          <div className="loading-current">{STEPS[stepIndex]}</div>
        )}
      </div>
    </div>
  );
}
