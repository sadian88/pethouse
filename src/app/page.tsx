import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
  {
    color: 'var(--teal-100)',
    icon: '◈',
    iconColor: 'var(--teal-400)',
    title: 'Paramétrico',
    desc: 'Ajusta cada dimensión en tiempo real. El modelo 3D se actualiza al instante.',
  },
  {
    color: 'var(--rose-100)',
    icon: '◎',
    iconColor: 'var(--rose-400)',
    title: 'Estilos de casita',
    desc: 'Clásica, moderna o A-Frame. Adaptados a gatos y perros de cualquier talla.',
  },
  {
    color: 'var(--peach-100)',
    icon: '◻',
    iconColor: 'var(--peach-300)',
    title: 'Planos de corte',
    desc: 'Exporta SVG o DXF con finger joints y compensación de kerf incluidos.',
  },
];

const SPECS = [
  { label: 'Formatos',   value: 'SVG · DXF',              color: 'var(--teal-200)' },
  { label: 'Estilos',    value: '3 diseños',               color: 'var(--rose-200)' },
  { label: 'Materiales', value: 'MDF · Plywood · Acrílico', color: 'var(--peach-200)' },
  { label: 'Uniones',    value: 'Plana · Finger Joint',    color: 'var(--teal-100)' },
];

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-page)', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>

      {/* Soft blob decorations */}
      <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-5%', right: '5%',
          width: '45vw', height: '45vw',
          background: 'radial-gradient(circle, var(--teal-100) 0%, transparent 65%)',
          opacity: 0.7,
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: '35vw', height: '35vw',
          background: 'radial-gradient(circle, var(--rose-100) 0%, transparent 65%)',
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '40%',
          width: '25vw', height: '25vw',
          background: 'radial-gradient(circle, var(--peach-100) 0%, transparent 65%)',
          opacity: 0.5,
        }} />
      </div>

      {/* Nav */}
      <nav className="animate-fade-in" style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--teal-200)', fontSize: 17,
          }}>🏠</span>
          <span className="font-display" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: 18,
            color: 'var(--text-hi)', letterSpacing: '-0.02em',
          }}>PetHouseCase</span>
        </div>
        <Link href="/configurator" className="nav-link">Abrir app →</Link>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative', zIndex: 10,
        padding: '40px 64px 72px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 48,
      }}>
        {/* Left — text */}
        <div style={{ maxWidth: 560 }}>
          <p className="animate-fade-up" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--teal-400)',
            marginBottom: 20,
          }}>
            Diseño paramétrico · Corte láser
          </p>

          <h1 className="animate-fade-up delay-100 font-display" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: 'var(--cream-900)',
            marginBottom: 24,
          }}>
            La casita perfecta<br />
            <span style={{ color: 'var(--teal-400)' }}>para tu mascota.</span>
          </h1>

          <p className="animate-fade-up delay-200" style={{
            fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
            color: 'var(--text-mid)',
            maxWidth: 460,
            lineHeight: 1.75,
            marginBottom: 40,
          }}>
            Configura dimensiones, estilo y materiales en tiempo real.
            Descarga planos listos para corte láser o CNC.
          </p>

          <div className="animate-fade-up delay-300" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <Link href="/configurator" className="cta-btn">
              Empezar a diseñar →
            </Link>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-lo)', letterSpacing: '0.05em' }}>
              sin registro · gratis
            </span>
          </div>
        </div>

        {/* Right — hero image */}
        <div className="animate-fade-up delay-200" style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: '-15%',
            background: 'radial-gradient(circle, var(--teal-100) 0%, transparent 68%)',
            borderRadius: '50%',
            zIndex: 0,
          }} />
          <Image
            src="/banner.png"
            alt="Casita para mascotas con planos de corte"
            width={620}
            height={520}
            priority
            style={{
              position: 'relative', zIndex: 1,
              objectFit: 'contain',
              filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.13))',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* Specs pills */}
      <div className="animate-fade-up delay-400" style={{
        position: 'relative', zIndex: 10,
        padding: '0 64px', marginBottom: 72,
        display: 'flex', flexWrap: 'wrap', gap: 10,
      }}>
        {SPECS.map(({ label, value, color }) => (
          <div key={label} className="spec-pill" style={{ background: color }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--cream-700)', marginBottom: 4 }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--cream-900)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 64px 96px' }}>
        <p className="animate-fade-up" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10, letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-lo)',
          marginBottom: 24,
        }}>Características</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {FEATURES.map(({ color, icon, iconColor, title, desc }, i) => (
            <div key={title} className={`feature-card animate-fade-up delay-${(i + 2) * 100}`}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: 12,
                background: color, marginBottom: 18,
                fontSize: 20, color: iconColor,
                fontFamily: 'var(--font-mono)',
              }}>{icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20, fontWeight: 700,
                color: 'var(--cream-900)',
                marginBottom: 8,
                letterSpacing: '-0.02em',
              }}>{title}</h3>
              <p style={{ color: 'var(--text-mid)', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 10,
        padding: '20px 64px 36px',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-lo)' }}>
          PetHouseCase
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-hint)', letterSpacing: '0.05em' }}>
          Generador paramétrico de casitas para mascotas
        </span>
      </footer>
    </main>
  );
}
