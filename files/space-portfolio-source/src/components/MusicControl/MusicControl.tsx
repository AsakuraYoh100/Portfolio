interface MusicControlProps {
  isOn: boolean;
  onToggle: () => void;
}

export function MusicControl({ isOn, onToggle }: MusicControlProps) {
  return (
    <button
      className={`music-control${isOn ? ' on' : ''}`}
      onClick={onToggle}
      aria-pressed={isOn}
      aria-label={isOn ? 'Turn music off' : 'Turn music on'}
    >
      <span className="music-eq" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="music-label">
        MUSIC <em>{isOn ? 'ON' : 'OFF'}</em>
      </span>
    </button>
  );
}
