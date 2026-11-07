'use client';
import { useEffect, useState } from 'react';
function left(t: number) {
  const d = Math.max(0, t - Date.now());
  return { Days: Math.floor(d / 864e5), Hours: Math.floor(d / 36e5) % 24, Minutes: Math.floor(d / 6e4) % 60, Seconds: Math.floor(d / 1e3) % 60 };
}
export default function Countdown({ target }: { target: string }) {
  const t = new Date(target).getTime();
  const [v, setV] = useState<ReturnType<typeof left> | null>(null);
  useEffect(() => { setV(left(t)); const i = setInterval(() => setV(left(t)), 1000); return () => clearInterval(i); }, [t]);
  return (
    <div className="countdown">
      <p className="cd-label">Event Countdown</p>
      <div className="cd-grid">
        {Object.entries(v ?? { Days: 0, Hours: 0, Minutes: 0, Seconds: 0 }).map(([k, n]) => (
          <div key={k}><b>{String(n).padStart(2, '0')}</b><span>{k}</span></div>))}
      </div>
    </div>
  );
}
