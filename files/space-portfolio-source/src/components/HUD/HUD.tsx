import { useEffect, useState } from 'react';

function randCoord(base: number) {
  return (base + (Math.random() - 0.5) * 4).toFixed(2).padStart(6, '0');
}

export function HUD() {
  const [coords, setCoords] = useState({ x: '048.29', y: '092.41', z: '018.72' });

  useEffect(() => {
    const id = setInterval(() => {
      setCoords({ x: randCoord(48), y: randCoord(92), z: randCoord(18) });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hud" aria-hidden="true">
      <div className="hud-block hud-tl">
        <span>SYSTEM ONLINE</span>
        <span>SIGNAL STABLE</span>
        <span>ENVIRONMENT: DEEP SPACE</span>
      </div>
      <div className="hud-block hud-br">
        <span>X: {coords.x}</span>
        <span>Y: {coords.y}</span>
        <span>Z: {coords.z}</span>
      </div>
    </div>
  );
}
