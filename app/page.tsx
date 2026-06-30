"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Scroll-driven frame sequence animation ──
 * 300 JPG frames in /frames/ — canvas draws the frame
 * corresponding to scroll progress through a tall section.
 */
const TOTAL_FRAMES = 300;

function ScrollFrameSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const rafRef = useRef<number>(0);

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        count++;
        setLoaded(count);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => { imgs.length = 0; };
  }, []);

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // cover fit
      const ar = img.naturalWidth / img.naturalHeight;
      const car = w / h;
      let dw = w, dh = h, dx = 0, dy = 0;
      if (ar > car) { dh = h; dw = h * ar; dx = (w - dw) / 2; }
      else { dw = w; dh = w / ar; dy = (h - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!mounted) return;
        const sec = sectionRef.current;
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const vh = window.innerHeight;
        // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
        const total = sec.offsetHeight - vh;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / total));
        const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
        drawFrame(frameIdx);
        // Reveal text elements based on progress vs data-mid
        const texts = sec.querySelectorAll(".reveal-text");
        texts.forEach((el) => {
          const mid = parseFloat(el.getAttribute("data-mid") || "0.5");
          const dist = Math.abs(progress - mid);
          el.classList.toggle("reveal-in", dist < 0.15);
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, loaded]);

  const pct = Math.round((loaded / TOTAL_FRAMES) * 100);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "200vh" }}>
      {/* Sticky canvas container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ display: loaded > 0 ? "block" : "none" }}
        />
        {/* Loading overlay */}
        {loaded < TOTAL_FRAMES && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
            <div className="text-purple-400 text-sm tracking-widest mb-4">LOADING ANIMATION</div>
            <div className="w-48 h-1 bg-purple-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-white/30 text-xs mt-3">{pct}%</div>
          </div>
        )}
        {/* Text overlay — fades in/out based on scroll */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <div className="text-center px-6">
            <p className="text-sm text-purple-400 mb-3 tracking-wider reveal-text" data-mid="0.15">THE EXPERIENCE</p>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight reveal-text" data-mid="0.25">
              Luxury that <span className="gradient-text">moves with you.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mt-6 text-lg reveal-text" data-mid="0.35">
              From the moment it arrives to the moment you swap — every detail designed for delight.
            </p>
            <p className="text-white/30 max-w-md mx-auto mt-12 text-sm reveal-text" data-mid="0.75">
              Keep scrolling to see the full experience unfold.
            </p>
          </div>
        </div>
        {/* Gradient vignette for readability */}
        <div className="absolute inset-0 pointer-events-none z-15" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,5,20,0.5) 100%)" }} />
        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-15" style={{ background: "linear-gradient(to bottom, transparent, #0a0510)" }} />
      </div>
    </section>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal observer — adds .enhanced to hide, then .visible to show
  // If JS doesn't run, .reveal stays visible (no .enhanced added)
  useEffect(() => {
    // First add .enhanced to all reveals (hides them)
    document.querySelectorAll(".reveal").forEach((el) => {
      el.classList.add("enhanced");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal.enhanced").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navItems = ["Collection", "How It Works", "Plans", "About"];

  const plans = [
    { name: "Essential", price: "$99", period: "/mo", pieces: "1 piece at a time", swaps: "1 swap / month", tier: "Lab-grown diamond rings & earrings", popular: false },
    { name: "Standard", price: "$199", period: "/mo", pieces: "2 pieces at a time", swaps: "2 swaps / month", tier: "Rings, earrings, bracelets & pendants", popular: true },
    { name: "Luxury", price: "$399", period: "/mo", pieces: "3 pieces at a time", swaps: "Unlimited swaps", tier: "Full collection incl. statement necklaces", popular: false },
  ];

  const steps = [
    { num: "01", title: "Subscribe", desc: "Pick a plan that fits your style. Choose 1, 2, or 3 pieces at a time from our lab-grown diamond collection." },
    { num: "02", title: "Receive", desc: "Your curated jewelry arrives in signature packaging. Wear it, flaunt it, live in it — it's yours for the month." },
    { num: "03", title: "Swap Every Month", desc: "Want something new? Swap any piece for a fresh style. No commitment, no pressure, just pure sparkle." },
  ];

  const collection = [
    { name: "Halo Diamond Ring", type: "Rings", desc: "1.2ct round-cut lab diamond, platinum band" },
    { name: "Tennis Bracelet", type: "Bracelets", desc: "3ct total, lab diamonds, white gold" },
    { name: "Drop Pendant", type: "Necklaces", desc: "0.8ct pear-cut, 18k rose gold chain" },
    { name: "Stud Earrings", type: "Earrings", desc: "1ct each, classic round-cut lab diamonds" },
    { name: "Eternity Band", type: "Rings", desc: "2ct total, channel-set, platinum" },
    { name: "Cuban Chain", type: "Necklaces", desc: "4mm lab diamonds, 18k gold, 18 inch" },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />

      {/* Background orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="orb" style={{ top: "-5%", left: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(107, 33, 168, 0.3), transparent)" }} />
        <div className="orb float-up-2" style={{ top: "30%", right: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent)" }} />
        <div className="orb float-up-3" style={{ bottom: "0%", left: "20%", width: "450px", height: "450px", background: "radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent)" }} />
      </div>
      <div className="fixed inset-0 grid-pattern z-0 pointer-events-none opacity-40" />

      <div className="relative z-10">
        {/* === NAV === */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? "glass-dark py-3" : "py-5"}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
            <div className="flex items-center gap-3 fade-in fade-in-1">
              <img src="/logo.jpg" alt="Pristine" className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400/30" />
              <span className="text-lg font-semibold tracking-tight">Pristine</span>
            </div>
            <div className="hidden md:flex items-center gap-8 fade-in fade-in-2">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="text-sm text-white/60 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <a href="#plans" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium hover:scale-105 transition-transform fade-in fade-in-3">
              Start Subscription →
            </a>
            <button className="md:hidden text-white/80" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden glass-dark mt-3 mx-4 rounded-2xl p-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white py-1">{item}</a>
              ))}
              <a href="#plans" onClick={() => setMenuOpen(false)} className="text-sm text-purple-300 py-1">Start Subscription →</a>
            </div>
          )}
        </nav>

        {/* === HERO === */}
        <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 fade-in fade-in-1">
              <div className="w-2 h-2 rounded-full bg-purple-400 pulse-dot" />
              <span className="text-xs text-white/70 tracking-wide">WORLD'S FIRST LAB DIAMOND JEWELRY SUBSCRIPTION</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="block shimmer-text fade-in fade-in-2">Wear luxury.</span>
              <span className="block fade-in fade-in-3">Swap anytime.</span>
              <span className="block gradient-text fade-in fade-in-4">Always sparkling.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed fade-in fade-in-5">
              Subscribe to lab-grown diamond jewelry. Wear it. Swap it. Repeat.
              No commitment, no pressure — just endless brilliance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in fade-in-6">
              <a href="#plans" className="group flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium hover:scale-105 transition-transform glow-pulse">
                Choose Your Plan →
              </a>
              <a href="#collection" className="flex items-center gap-2 px-8 py-4 rounded-full glass text-white font-medium hover:bg-purple-500/10 transition-all">
                View Collection
              </a>
            </div>
          </div>

          {/* Floating jewelry sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { top: "15%", left: "10%", delay: "0s" },
              { top: "25%", right: "15%", delay: "0.5s" },
              { top: "60%", left: "8%", delay: "1s" },
              { top: "70%", right: "12%", delay: "1.5s" },
              { top: "40%", left: "5%", delay: "2s" },
              { top: "50%", right: "5%", delay: "2.5s" },
            ].map((s, i) => (
              <div key={i} className="absolute sparkle" style={{ top: s.top, left: s.left, right: s.right, animationDelay: s.delay }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" fill="rgba(192, 132, 252, 0.6)" />
                </svg>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-in fade-in-6">
            <div className="w-6 h-10 rounded-full border-2 border-purple-400/30 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 rounded-full bg-purple-400/60 scroll-dot" />
            </div>
          </div>
        </section>

        {/* === MARQUEE === */}
        <section className="py-10 border-y border-purple-500/10 overflow-hidden">
          <div className="flex marquee-track whitespace-nowrap">
            {[0, 1].map((idx) => (
              <div key={idx} className="flex items-center gap-12 px-6">
                {["LAB-GROWN DIAMONDS", "ETHICAL LUXURY", "SWAP ANYTIME", "NO COMMITMENT", "CERTIFIED QUALITY", "FREE INSURANCE", "CANCEL ANYTIME"].map((text) => (
                  <span key={text} className="text-sm font-medium text-purple-300/30 tracking-widest">
                    {text} <span className="text-purple-500/40 mx-4">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section id="how-it-works" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 reveal">
              <p className="text-sm text-purple-400 mb-3 tracking-wider">HOW IT WORKS</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Simple as <span className="gradient-text">sparkle.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={step.num} className="reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="glass glow-border rounded-3xl p-10 card-hover h-full">
                    <div className="text-7xl font-bold text-purple-500/10 mb-6">{step.num}</div>
                    {/* Animated jewelry icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-400/5 flex items-center justify-center mb-6 float-up" style={{ animationDelay: `${i * 0.5}s` }}>
                      {i === 0 && <span className="text-3xl">💎</span>}
                      {i === 1 && <span className="text-3xl">📦</span>}
                      {i === 2 && <span className="text-3xl">✨</span>}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === COLLECTION === */}
        <section id="collection" className="py-32 px-6 md:px-12 border-y border-purple-500/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 reveal">
              <p className="text-sm text-purple-400 mb-3 tracking-wider">THE COLLECTION</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Curated <span className="gradient-text">brilliance.</span>
              </h2>
              <p className="text-white/40 mt-4 max-w-xl mx-auto">Lab-grown diamonds, ethically crafted. Every piece certified, every sparkle real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.map((item, i) => (
                <div key={item.name} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="group glass glow-border rounded-3xl overflow-hidden card-hover cursor-pointer">
                    {/* Jewelry visual — animated gradient placeholder */}
                    <div className="relative h-64 overflow-hidden ring-shine" style={{ background: `linear-gradient(135deg, ${["rgba(107,33,168,0.15)", "rgba(168,85,247,0.12)", "rgba(124,58,237,0.1)", "rgba(192,132,252,0.08)", "rgba(107,33,168,0.12)", "rgba(168,85,247,0.1)"][i]}, rgba(10,0,18,0.8))` }}>
                      {/* Large jewelry emoji as visual */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-7xl float-up" style={{ animationDelay: `${i * 0.3}s` }}>
                          {item.type === "Rings" && "💍"}
                          {item.type === "Bracelets" && "📿"}
                          {item.type === "Necklaces" && "📿"}
                          {item.type === "Earrings" && "💎"}
                        </div>
                      </div>
                      {/* Sparkles */}
                      <div className="absolute top-4 right-4 sparkle" style={{ animationDelay: `${i * 0.2}s` }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(192,132,252,0.5)"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" /></svg>
                      </div>
                      <div className="absolute bottom-6 left-6 sparkle" style={{ animationDelay: `${i * 0.3 + 0.5}s` }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(192,132,252,0.4)"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" /></svg>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-6">
                      <p className="text-xs text-purple-400/70 tracking-wider mb-2">{item.type.toUpperCase()}</p>
                      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-white/30">Included in subscription</span>
                        <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === SCROLL-DRIVEN VIDEO ANIMATION — Frame sequence === */}
        <ScrollFrameSection />

        {/* === EXPERIENCE CARDS === */}
        <section className="py-24 px-6 md:px-12 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { emoji: "📭", label: "Unbox", desc: "Signature purple packaging" },
                { emoji: "💍", label: "Wear", desc: "Slip it on, instantly radiant" },
                { emoji: "✨", label: "Shine", desc: "Lab diamonds, real brilliance" },
                { emoji: "🔄", label: "Swap", desc: "Return for something new" },
              ].map((step, i) => (
                <div key={step.label} className="reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="glass glow-border rounded-3xl p-8 card-hover">
                    <div className="text-6xl mb-4 float-up" style={{ animationDelay: `${i * 0.4}s` }}>{step.emoji}</div>
                    <h3 className="text-lg font-semibold mb-1">{step.label}</h3>
                    <p className="text-white/40 text-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === PLANS === */}
        <section id="plans" className="py-32 px-6 md:px-12 border-y border-purple-500/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 reveal">
              <p className="text-sm text-purple-400 mb-3 tracking-wider">CHOOSE YOUR PLAN</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Plans that fit <span className="gradient-text">your sparkle.</span>
              </h2>
              <p className="text-white/40 mt-4 max-w-xl mx-auto">Cancel anytime. No hidden fees. Free insurance included on every plan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => (
                <div key={plan.name} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className={`relative glass glow-border rounded-3xl p-8 card-hover h-full ${plan.popular ? "ring-2 ring-purple-500/40" : ""}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-medium">
                        MOST POPULAR
                      </div>
                    )}
                    <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                      <span className="text-white/40">{plan.period}</span>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-sm text-white/70">{plan.pieces}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-sm text-white/70">{plan.swaps}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-sm text-white/70">{plan.tier}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-sm text-white/70">Free insurance included</span>
                      </div>
                    </div>
                    <a href="#contact" className={`block text-center py-3.5 rounded-full font-medium transition-all ${plan.popular ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:scale-105" : "glass text-white hover:bg-purple-500/10"}`}>
                      Start {plan.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <section id="about" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 reveal">
              <p className="text-sm text-purple-400 mb-3 tracking-wider">MEMBER STORIES</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Loved by <span className="gradient-text">thousands.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: "I've worn a different diamond ring every month for 6 months. My friends think I'm rich. I'm just smart.", name: "Aisha K.", role: "Member since Jan 2026" },
                { quote: "The quality is stunning. Lab-grown diamonds that look better than anything I've seen at traditional jewelers.", name: "Marcus T.", role: "Luxury Plan member" },
                { quote: "Cancelled my old jewelry insurance. Pristine covers everything and I get new pieces to wear. No brainer.", name: "Sofia R.", role: "Standard Plan member" },
              ].map((t, i) => (
                <div key={t.name} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="glass rounded-2xl p-8 card-hover h-full">
                    <div className="flex gap-1 mb-6 text-purple-400 text-lg">★★★★★</div>
                    <p className="text-white/70 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-white/40">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA === */}
        <section id="contact" className="py-32 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="text-xs text-white/70 tracking-wide">NOW ACCEPTING MEMBERS · LIMITED SPOTS</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Ready to <span className="gradient-text">sparkle?</span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join the jewelry revolution. Subscribe today, wear tomorrow, swap forever.
            </p>

            <a href="#plans" className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium hover:scale-105 transition-transform glow-pulse">
              Start Your Subscription →
            </a>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/30">
              {["Instagram", "TikTok", "Pinterest", "Contact"].map((social) => (
                <a key={social} href="#" className="hover:text-purple-400 transition-colors">{social}</a>
              ))}
            </div>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="py-8 px-6 md:px-12 border-t border-purple-500/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Pristine" className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-400/30" />
              <span className="text-sm text-white/50">Pristine — Luxury Jewelry Subscription</span>
            </div>
            <p className="text-xs text-white/30">© 2026 Pristine. Lab-grown diamonds. Ethical luxury.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}