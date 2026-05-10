export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
      {/* Static indigo radial glow top-left */}
      <div
        className="absolute -top-[10%] -left-[5%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-30"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
      />
      {/* Static fuchsia radial glow top-right */}
      <div
        className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20"
        style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)' }}
      />
      {/* Static cyan radial glow bottom */}
      <div
        className="absolute -bottom-[5%] left-[15%] w-[45vw] h-[45vw] rounded-full blur-[110px] opacity-15"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
      />
      {/* Bottom fade to solid */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/40 to-[#0a0a0f]/80" />
    </div>
  );
}
