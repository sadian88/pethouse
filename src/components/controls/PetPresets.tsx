'use client';

import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { PetType, PetSize } from '@/types';

const PET_ICONS: Record<PetType, string> = { cat: '🐱', dog: '🐶' };
const PET_LABELS: Record<PetType, string> = { cat: 'Gato', dog: 'Perro' };
const SIZES: PetSize[] = ['S', 'M', 'L', 'XL'];

export default function PetPresets() {
  const { config, applyPreset } = useConfiguratorStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {(['cat', 'dog'] as PetType[]).map((pet) => {
          const active = config.petType === pet;
          return (
            <button key={pet} onClick={() => applyPreset(pet, config.petSize)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 0', borderRadius: 10,
              border: `1.5px solid ${active ? 'var(--teal-300)' : 'var(--border)'}`,
              background: active ? 'var(--teal-100)' : 'var(--bg-card)',
              color: active ? 'var(--teal-500)' : 'var(--text-mid)',
              fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 16 }}>{PET_ICONS[pet]}</span>
              {PET_LABELS[pet]}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
        {SIZES.map((size) => {
          const disabled = config.petType === 'cat' && size === 'XL';
          const active = config.petSize === size && !disabled;
          return (
            <button key={size} disabled={disabled} onClick={() => applyPreset(config.petType, size)} style={{
              padding: '5px 0', borderRadius: 8,
              border: `1.5px solid ${active ? 'var(--teal-300)' : 'var(--border)'}`,
              background: active ? 'var(--teal-300)' : disabled ? 'var(--cream-200)' : 'var(--bg-card)',
              color: active ? '#fff' : disabled ? 'var(--cream-400)' : 'var(--text-mid)',
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
            }}>{size}</button>
          );
        })}
      </div>
    </div>
  );
}
