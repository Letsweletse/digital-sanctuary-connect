'use client';
import { useState } from 'react';
import { usePlayer } from './Player';

type S = { id: string; slug: string; title: string; speaker: string; audio_url: string | null; youtube_url: string | null; cover_image: string | null };
export default function SermonActions({ s, siteUrl, compact = false, left = false }: { s: S; siteUrl: string; compact?: boolean; left?: boolean }) {
  const { play, track, playing } = usePlayer();
  const [copied, setCopied] = useState(false);
  const url = `${siteUrl}/sermons/${s.slug}`;
  const isMe = track?.id === s.id;
  const wa = `https://wa.me/?text=${encodeURIComponent(`🎧 ${s.title} – ${s.speaker}\nListen or download from Gate Gaborone:\n${url}`)}`;
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: s.title, text: `${s.title} – ${s.speaker}`, url }); return; } catch { return; } }
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  return (
    <div className={`acts${left ? ' left' : ''}`}>
      {s.audio_url && (
        <button className="iconbtn play" onClick={() => play({ id: s.id, title: s.title, speaker: s.speaker, src: s.audio_url!, cover: s.cover_image })}>
          {isMe && playing ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>}
          {isMe && playing ? 'Pause' : 'Listen'}
        </button>
      )}
      {s.audio_url && (
        <a className="iconbtn" href={`/api/sermons/${s.id}/download`} rel="nofollow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" /></svg>{!compact && 'Download'}
        </a>
      )}
      {s.youtube_url && (
        <a className="iconbtn" href={s.youtube_url} target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12 31 31 0 001 16.8a3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.1V8.9l5.8 3.1z" /></svg>{!compact && 'Watch'}
        </a>
      )}
      <a className="iconbtn wa" href={wa} target="_blank" rel="noopener" aria-label="Share on WhatsApp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 002 17.6L.5 23.5l6-1.6a11.8 11.8 0 0014-18.4zM12 21.3a9.6 9.6 0 01-4.9-1.3l-.4-.2-3.6.9 1-3.5-.2-.4A9.6 9.6 0 1112 21.3zm5.3-7.2c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.9 7.9 0 01-2.3-1.4 8.7 8.7 0 01-1.6-2c-.2-.3 0-.4.1-.6l.4-.5.3-.5a.5.5 0 000-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.3 3.3 0 00-1 2.5 5.8 5.8 0 001.2 3.1 13.2 13.2 0 005.1 4.5c1.8.8 2.5.8 3.4.7a2.9 2.9 0 001.9-1.3 2.3 2.3 0 00.2-1.3c-.1-.2-.3-.2-.6-.4z" /></svg>{!compact && 'Share'}
      </a>
      {!compact && <button className="iconbtn" onClick={share}>{copied ? 'Link copied' : 'Copy link'}</button>}
    </div>
  );
}
