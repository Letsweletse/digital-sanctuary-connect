'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Track = { id: string; title: string; speaker: string; src: string; cover?: string | null };
type Ctx = { track: Track | null; playing: boolean; play: (t: Track) => void; toggle: () => void };
const PlayerCtx = createContext<Ctx>({ track: null, playing: false, play: () => {}, toggle: () => {} });
export const usePlayer = () => useContext(PlayerCtx);

function fmt(s: number) {
  if (!isFinite(s)) return '0:00';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0), [d, setD] = useState(0), [rate, setRate] = useState(1);

  useEffect(() => { document.body.classList.toggle('has-player', !!track); }, [track]);
  useEffect(() => {
    if (!track || !audio.current) return;
    try { const saved = Number(localStorage.getItem('pos:' + track.id) || 0); if (saved > 5) audio.current.currentTime = saved; } catch {}
  }, [track]);

  const play = (tr: Track) => {
    if (track?.id === tr.id) { toggle(); return; }
    setTrack(tr);
    setTimeout(() => { audio.current?.play().catch(() => {}); }, 30);
    fetch(`/api/sermons/${tr.id}/play`, { method: 'POST' }).catch(() => {});
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: tr.title, artist: tr.speaker, album: 'Gate Gaborone', artwork: tr.cover ? [{ src: tr.cover, sizes: '512x512' }] : [] });
    }
  };
  const toggle = () => { const a = audio.current; if (!a) return; a.paused ? a.play().catch(() => {}) : a.pause(); };
  const skip = (s: number) => { const a = audio.current; if (a) a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + s)); };
  const cycle = () => { const r = rate >= 2 ? 1 : rate + 0.25; setRate(r); if (audio.current) audio.current.playbackRate = r; };

  return (
    <PlayerCtx.Provider value={{ track, playing, play, toggle }}>
      {children}
      {track && (
        <div className="player" role="region" aria-label="Sermon player">
          <audio ref={audio} src={track.src} preload="metadata"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
            onTimeUpdate={e => { const c = e.currentTarget.currentTime; setT(c); if (Math.floor(c) % 5 === 0) { try { localStorage.setItem('pos:' + track.id, String(c)); } catch {} } }}
            onLoadedMetadata={e => { setD(e.currentTarget.duration); e.currentTarget.playbackRate = rate; }} />
          <div className="in">
            <button className="pp" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>}
            </button>
            <div style={{ minWidth: 0 }}>
              <div className="t">{track.title}</div>
              <div className="bar">
                <button className="x" onClick={() => skip(-15)} aria-label="Back 15 seconds">−15</button>
                <span>{fmt(t)}</span>
                <input type="range" min={0} max={d || 0} step={1} value={t} onChange={e => { if (audio.current) audio.current.currentTime = Number(e.target.value); }} aria-label="Seek" />
                <span>{fmt(d)}</span>
                <button className="x" onClick={() => skip(30)} aria-label="Forward 30 seconds">+30</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="rate" onClick={cycle} aria-label="Playback speed">{rate}×</button>
              <button className="x" onClick={() => { audio.current?.pause(); setTrack(null); }} aria-label="Close player">✕</button>
            </div>
          </div>
        </div>
      )}
    </PlayerCtx.Provider>
  );
}
