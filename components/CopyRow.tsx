'use client';
import { useState } from 'react';
export default function CopyRow({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="bank-row">
      <div><span>{label}</span><b>{value}</b></div>
      <button type="button" className="btn btn-sm" onClick={() => { navigator.clipboard?.writeText(value); setOk(true); setTimeout(() => setOk(false), 1500); }}>{ok ? 'Copied' : 'Copy'}</button>
    </div>
  );
}
