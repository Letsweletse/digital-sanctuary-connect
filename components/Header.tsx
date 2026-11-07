'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '@/lib/site';

export default function Header() {
  const path = usePathname();
    const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="hdr">
      <div className="container in">
        <Link href="/" className="logo" aria-label="Gate Gaborone home"><img src="/img/logo-wordmark-dark.png" alt="Gate Gaborone" /></Link>
        <nav aria-label="Main">
          {NAV.map(n => <Link key={n.href} href={n.href} className={path?.startsWith(n.href) ? 'on' : ''}>{n.label}</Link>)}
          <Link href="/give" className="btn btn-dark btn-sm">Give</Link>
        </nav>
        <button className="burger" aria-label="Open menu" onClick={() => setOpen(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        </button>
      </div>
      {open && (
        <div className="mnav" role="dialog" aria-label="Menu">
          <button className="burger close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <Link href="/">Home</Link>
          {NAV.map(n => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/give">Give</Link>
        </div>
      )}
    </header>
  );
}
