'use client';

import { useState } from 'react';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { generateSVG, generateDXF } from '@/lib/export/svgExporter';

export default function ExportPanel() {
  const config = useConfiguratorStore((s) => s.config);
  const [loading, setLoading] = useState<string | null>(null);

  async function download(format: 'svg' | 'dxf') {
    setLoading(format);
    try {
      const { saveAs } = await import('file-saver');
      const content = format === 'svg' ? await generateSVG(config) : await generateDXF(config);
      const mime = format === 'svg' ? 'image/svg+xml' : 'application/dxf';
      saveAs(new Blob([content], { type: mime }), `pethouse-${config.petType}-${config.style}.${format}`);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(null);
    }
  }

  const { width, height, depth, materialThickness } = config;
  const wallH = Math.round(height * 0.65);
  const pieces = [
    { name: 'Piso',              qty: 1, dims: `${width}×${depth}` },
    { name: 'Pared frontal',     qty: 1, dims: `${width}×${wallH}` },
    { name: 'Pared trasera',     qty: 1, dims: `${width}×${wallH}` },
    { name: 'Paredes laterales', qty: 2, dims: `${depth}×${wallH}` },
    { name: 'Techo',             qty: 2, dims: 'Ver planos' },
  ];

  const DownloadIcon = () => (
    <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* BOM */}
      <div style={{
        background: 'var(--cream-100)',
        borderRadius: 10, padding: '10px 12px',
        border: '1px solid var(--border-soft)',
      }}>
        {pieces.map((p, i) => (
          <div key={p.name} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '4px 0',
            borderBottom: i < pieces.length - 1 ? '1px solid var(--cream-200)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>
              <span style={{ color: 'var(--teal-400)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.qty}×</span>
              {' '}{p.name}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-lo)' }}>{p.dims}</span>
          </div>
        ))}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-hint)', marginTop: 8 }}>
          {materialThickness}mm · {config.materialType}
        </p>
      </div>

      {/* Export buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <button onClick={() => download('svg')} disabled={loading === 'svg'} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px 0', borderRadius: 10,
          background: 'var(--teal-300)', color: '#fff',
          border: 'none', fontWeight: 800, fontSize: 12,
          cursor: loading === 'svg' ? 'wait' : 'pointer',
          opacity: loading === 'svg' ? 0.6 : 1,
          letterSpacing: '0.05em', transition: 'opacity 0.15s, background 0.15s',
          boxShadow: '0 2px 8px rgba(126,197,188,0.35)',
        }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--teal-400)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--teal-300)'; }}
        >
          {loading === 'svg' ? '…' : <><DownloadIcon /> SVG</>}
        </button>
        <button onClick={() => download('dxf')} disabled={loading === 'dxf'} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px 0', borderRadius: 10,
          background: 'var(--bg-card)', color: 'var(--cream-700)',
          border: '1.5px solid var(--border)',
          fontWeight: 800, fontSize: 12,
          cursor: loading === 'dxf' ? 'wait' : 'pointer',
          opacity: loading === 'dxf' ? 0.6 : 1,
          letterSpacing: '0.05em', transition: 'all 0.15s',
        }}
          onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal-300)'; (e.currentTarget as HTMLElement).style.color = 'var(--teal-500)'; } }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream-700)'; }}
        >
          {loading === 'dxf' ? '…' : <><DownloadIcon /> DXF</>}
        </button>
      </div>
    </div>
  );
}
