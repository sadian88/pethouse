'use client';

import { useConfiguratorStore } from '@/lib/store/configuratorStore';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit = 'mm', onChange }: SliderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cream-800)', fontWeight: 500 }}>
          {value}<span style={{ color: 'var(--text-hint)', marginLeft: 1 }}>{unit}</span>
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '5px 0', borderRadius: 8,
    border: `1.5px solid ${active ? 'var(--teal-300)' : 'var(--border)'}`,
    background: active ? 'var(--teal-300)' : 'var(--bg-card)',
    color: active ? '#fff' : 'var(--text-mid)',
    fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
  };
}

export default function DimensionSliders() {
  const { config, updateConfig } = useConfiguratorStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Slider label="Ancho"       value={config.width}  min={200} max={1200} step={10} onChange={(v) => updateConfig({ width: v })} />
      <Slider label="Alto"        value={config.height} min={200} max={1000} step={10} onChange={(v) => updateConfig({ height: v })} />
      <Slider label="Profundidad" value={config.depth}  min={200} max={1200} step={10} onChange={(v) => updateConfig({ depth: v })} />
    </div>
  );
}

export function DoorSliders() {
  const { config, updateConfig } = useConfiguratorStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <label style={{ display: 'block', fontSize: 11, color: 'var(--text-mid)', marginBottom: 5 }}>
          Nombre de la mascota
        </label>
        <input type="text" value={config.petName}
          onChange={(e) => updateConfig({ petName: e.target.value })}
          placeholder="Ej: Luna, Max…" maxLength={20}
          style={{
            width: '100%', padding: '7px 10px',
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: 8, color: 'var(--cream-900)',
            fontSize: 12, outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--teal-300)'; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; }}
        />
      </div>

      {config.petName.trim() && (
        <div style={{ paddingLeft: 10, borderLeft: '2px solid var(--teal-200)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Slider label="Tamaño texto" value={config.petNameSize} min={8} max={50} step={1}
            onChange={(v) => updateConfig({ petNameSize: v })} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>Grueso</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cream-800)' }}>{config.petNameWeight}</span>
            </div>
            <input type="range" min={100} max={900} step={100} value={config.petNameWeight}
              onChange={(e) => updateConfig({ petNameWeight: Number(e.target.value) })} />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {(['arch', 'rectangular', 'circular'] as const).map((shape) => (
          <button key={shape} onClick={() => updateConfig({ doorShape: shape })} style={chipStyle(config.doorShape === shape)}>
            {shape === 'arch' ? 'Arco' : shape === 'rectangular' ? 'Rect.' : 'Circular'}
          </button>
        ))}
      </div>

      <Slider label="Ancho puerta" value={config.doorWidth}  min={80}  max={400} step={5} onChange={(v) => updateConfig({ doorWidth: v })} />
      <Slider label="Alto puerta"  value={config.doorHeight} min={100} max={500} step={5} onChange={(v) => updateConfig({ doorHeight: v })} />
    </div>
  );
}

export function RoofSliders() {
  const { config, updateConfig } = useConfiguratorStore();
  if (config.style !== 'classic') return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Slider label="Ángulo" value={config.roofAngle}    min={15} max={60} step={1} unit="°" onChange={(v) => updateConfig({ roofAngle: v })} />
      <Slider label="Alero"  value={config.roofOverhang} min={0}  max={80} step={5}           onChange={(v) => updateConfig({ roofOverhang: v })} />
    </div>
  );
}

export function MaterialSliders() {
  const { config, updateConfig } = useConfiguratorStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <select value={config.materialType}
        onChange={(e) => updateConfig({ materialType: e.target.value as never })}
        style={{
          width: '100%', padding: '7px 10px',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: 8, color: 'var(--cream-800)',
          fontSize: 12, outline: 'none', cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23c0a492' stroke-width='2' stroke-linecap='round' d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
        }}>
        <option value="plywood">Madera contrachapada</option>
        <option value="mdf">MDF</option>
        <option value="acrylic">Acrílico</option>
        <option value="custom">Personalizado</option>
      </select>
      <Slider label="Grosor" value={config.materialThickness} min={3} max={18} step={1} unit="mm"
        onChange={(v) => updateConfig({ materialThickness: v })} />
    </div>
  );
}
