import React from 'react';

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="gradient-mesh absolute inset-0 opacity-60"></div>

      <div className="bg-blob blob-anim" style={{ width: 420, height: 420, left: -80, top: -60, background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), rgba(79,70,229,0.06))' }} />
      <div className="bg-blob blob-anim" style={{ width: 360, height: 360, right: -100, top: 40, background: 'radial-gradient(circle at 70% 70%, rgba(14,165,233,0.12), rgba(14,165,233,0.04))', animationDuration: '16s' }} />
      <div className="bg-blob blob-anim" style={{ width: 260, height: 260, left: 40, bottom: -80, background: 'radial-gradient(circle at 30% 70%, rgba(236,72,153,0.08), rgba(236,72,153,0.02))', animationDuration: '20s' }} />
    </div>
  );
}
