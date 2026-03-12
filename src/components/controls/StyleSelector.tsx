'use client';

import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { HouseStyle } from '@/types';

const STYLES: { value: HouseStyle; label: string; icon: string }[] = [
  { value: 'classic', label: 'Clásica', icon: '🏠' },
  { value: 'modern',  label: 'Moderna', icon: '🏢' },
  { value: 'aframe',  label: 'A-Frame', icon: '⛺' },
];

export default function StyleSelector() {
  const { config, updateConfig } = useConfiguratorStore();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
      {STYLES.map(({ value, label, icon }) => {
        const active = config.style === value;
        return (
          <button key={value} onClick={() => updateConfig({ style: value })} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 4px', borderRadius: 10, gap: 3,
            border: `1.5px solid ${active ? 'var(--teal-300)' : 'var(--border)'}`,
            background: active ? 'var(--teal-100)' : 'var(--bg-card)',
            color: active ? 'var(--teal-500)' : 'var(--text-mid)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
