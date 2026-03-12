'use client';

import { useConfiguratorStore } from '@/lib/store/configuratorStore';

function Toggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, cursor: 'pointer' }}>
      <div>
        <p style={{ fontSize: 12, color: 'var(--cream-800)', fontWeight: 500, margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 10, color: 'var(--text-lo)', marginTop: 1 }}>{desc}</p>}
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
        <div style={{
          width: 32, height: 17, borderRadius: 9,
          background: checked ? 'var(--teal-300)' : 'var(--cream-300)',
          transition: 'background 0.2s',
        }} />
        <div style={{
          position: 'absolute', top: 2,
          left: checked ? 17 : 2,
          width: 13, height: 13, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          transition: 'left 0.2s',
        }} />
      </div>
    </label>
  );
}

export default function OptionsPanel() {
  const { config, updateConfig } = useConfiguratorStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle label="Ventilación" desc="Orificios laterales de aire"
        checked={config.hasVentilation} onChange={(v) => updateConfig({ hasVentilation: v })} />

      {config.hasVentilation && (
        <div style={{ paddingLeft: 10, borderLeft: '2px solid var(--teal-200)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>Tamaño orificios</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cream-800)' }}>
              {config.ventilationSize}<span style={{ color: 'var(--text-hint)', marginLeft: 1 }}>mm</span>
            </span>
          </div>
          <input type="range" min={5} max={30} step={1} value={config.ventilationSize}
            onChange={(e) => updateConfig({ ventilationSize: Number(e.target.value) })} />
        </div>
      )}

      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-lo)', marginBottom: 6 }}>
          Tipo de unión
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {(['flat', 'finger'] as const).map((jt) => {
            const active = config.jointType === jt;
            return (
              <button key={jt} onClick={() => updateConfig({ jointType: jt })} style={{
                padding: '6px 0', borderRadius: 8,
                border: `1.5px solid ${active ? 'var(--teal-300)' : 'var(--border)'}`,
                background: active ? 'var(--teal-300)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-mid)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {jt === 'flat' ? 'Plana' : 'Finger Joint'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>Comp. kerf</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cream-800)' }}>
            {config.kerfCompensation}<span style={{ color: 'var(--text-hint)', marginLeft: 1 }}>mm</span>
          </span>
        </div>
        <input type="range" min={0} max={0.5} step={0.05} value={config.kerfCompensation}
          onChange={(e) => updateConfig({ kerfCompensation: Number(e.target.value) })} />
      </div>
    </div>
  );
}
