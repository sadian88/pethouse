'use client';

import { useState } from 'react';

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function Section({ title, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: '1px solid var(--border-soft)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--cream-200)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: open ? 'var(--teal-500)' : 'var(--text-lo)',
          transition: 'color 0.15s',
        }}>{title}</span>
        <svg style={{
          width: 12, height: 12,
          color: open ? 'var(--teal-400)' : 'var(--cream-400)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s, color 0.15s',
          flexShrink: 0,
        }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div style={{ padding: '2px 16px 14px' }}>{children}</div>}
    </div>
  );
}
