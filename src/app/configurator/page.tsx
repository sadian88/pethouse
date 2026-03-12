'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import PetPresets from '@/components/controls/PetPresets';
import StyleSelector from '@/components/controls/StyleSelector';
import DimensionSliders, { DoorSliders, MaterialSliders } from '@/components/controls/DimensionSliders';
import OptionsPanel from '@/components/controls/OptionsPanel';
import ExportPanel from '@/components/controls/ExportPanel';
import Section from '@/components/controls/Section';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';

const Scene3D = dynamic(() => import('@/components/configurator/Scene3D'), { ssr: false });

export default function ConfiguratorPage() {
  const { resetConfig, config } = useConfiguratorStore();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--cream-200)' }}>

      {/* Header */}
      <header style={{
        flexShrink: 0,
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 0 var(--border-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--teal-100)', fontSize: 14,
            }}>🏠</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: 16,
              color: 'var(--cream-900)',
              letterSpacing: '-0.02em',
            }}>PetHouseCase</span>
          </Link>

          <span style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-lo)',
            letterSpacing: '0.05em',
          }}>
            {config.petType === 'cat' ? 'Gato' : 'Perro'} · {config.petSize} · {config.style}
          </span>
        </div>

        <button
          onClick={resetConfig}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-lo)',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '5px 14px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = 'var(--teal-500)';
            el.style.borderColor = 'var(--teal-300)';
            el.style.background = 'var(--teal-100)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = 'var(--text-lo)';
            el.style.borderColor = 'var(--border)';
            el.style.background = 'transparent';
          }}
        >
          Resetear
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: 256,
          flexShrink: 0,
          background: 'var(--bg-panel)',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        }}>
          <Section title="Mascota y estilo" defaultOpen>
            <PetPresets />
            <div style={{ paddingTop: 10 }}>
              <StyleSelector />
            </div>
          </Section>
          <Section title="Dimensiones" defaultOpen>
            <DimensionSliders />
          </Section>
          <Section title="Puerta">
            <DoorSliders />
          </Section>
          <Section title="Material">
            <MaterialSliders />
          </Section>
          <Section title="Opciones">
            <OptionsPanel />
          </Section>
          <Section title="Exportar">
            <ExportPanel />
          </Section>
        </aside>

        {/* 3D Viewer */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, overflow: 'hidden', gap: 8 }}>
          <div style={{ flex: 1, minHeight: 0, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <Scene3D />
          </div>
          <p style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-hint)',
            letterSpacing: '0.06em',
          }}>
            Arrastra para rotar · Scroll para zoom
          </p>
        </main>
      </div>
    </div>
  );
}
