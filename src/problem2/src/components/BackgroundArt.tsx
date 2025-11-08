export function BackgroundArt() {
  return (
    <div aria-hidden className="pointer-events-none">
      <div className="absolute inset-x-0 top-[-30%] h-[40rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_rgba(15,23,42,0))]" />
      <div className="absolute inset-x-0 bottom-[-40%] h-[50rem] bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.25),_rgba(15,23,42,0))]" />
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 rounded-full border border-cyan-500/20 px-12 py-20 blur-3xl" />
      </div>
    </div>
  )
}

