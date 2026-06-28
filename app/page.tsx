"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Shield,
  Globe,
  Code2,
  Palette,
  Rocket,
  Check,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Spotlight follow */}
      <div
        className="spotlight fixed inset-0 pointer-events-none z-0"
        style={{ "--mx": `${mousePos.x}%`, "--my": `${mousePos.y}%` } as React.CSSProperties}
      />

      {/* Background orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="orb absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent)" }}
        />
        <div
          className="orb absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(129,140,248,0.12), transparent)", animationDelay: "5s" }}
        />
        <div
          className="orb absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1), transparent)", animationDelay: "10s" }}
        />
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 grid-pattern z-0 pointer-events-none opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">Pristine</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {["Work", "Services", "Process", "About"].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <motion.a
              href="#contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.a>

            <button
              className="md:hidden text-white/80"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden mt-4 glass rounded-2xl p-4 flex flex-col gap-3"
              >
                {["Work", "Services", "Process", "About"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-white/70 hover:text-white py-1"
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-white py-1"
                >
                  Get Started →
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center justify-center px-6 md:px-12"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-white/70 tracking-wide">
                INTRODUCING PRISTINE · DIGITAL CRAFT STUDIO
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="block gradient-text"
              >
                We build
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="block"
              >
                pristine
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="block gradient-text-blue"
              >
                digital experiences.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              A design-led studio crafting products with obsessive attention to
              detail — from first pixel to final deploy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#work"
                className="group flex items-center gap-2 px-7 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform"
              >
                View Our Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="group flex items-center gap-2 px-7 py-4 rounded-full glass text-white font-medium hover:bg-white/5 transition-all"
              >
                Start a Project
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 rounded-full bg-white/40"
              />
            </div>
          </motion.div>
        </section>

        {/* Trusted by marquee */}
        <section className="py-12 border-y border-white/5 overflow-hidden">
          <div className="flex marquee-track whitespace-nowrap">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-16 px-8">
                {["NEBULA", "AURORA", "VERTEX", "QUANTUM", "CELESTE", "PHASE", "ZENITH", "ORBIT"].map(
                  (brand) => (
                    <span
                      key={brand}
                      className="text-2xl font-bold text-white/20 tracking-widest"
                    >
                      {brand}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-sm text-blue-400 mb-3 tracking-wider">WHAT WE DO</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Services that <span className="gradient-text-blue">ship.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Palette, title: "Design Systems", desc: "Scalable design tokens, component libraries, and brand guidelines that keep teams fast." },
                { icon: Code2, title: "Web Development", desc: "Next.js, React, TypeScript. Production-grade code with 100% type safety and tests." },
                { icon: Rocket, title: "Product Strategy", desc: "From concept to launch. We help you find product-market fit and ship with confidence." },
                { icon: Zap, title: "Motion & Interaction", desc: "Framer Motion, micro-interactions, and scroll-driven storytelling that captivates users." },
                { icon: Shield, title: "Performance Audits", desc: "Core Web Vitals, Lighthouse scores, and bundle optimization to keep you lightning-fast." },
                { icon: Globe, title: "Deployment & DevOps", desc: "CI/CD pipelines, edge deployment, and infrastructure that scales with your growth." },
              ].map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group glass glow-border rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                    <service.icon className="w-6 h-6 text-white/80" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Work / Showcase */}
        <section id="work" className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-sm text-blue-400 mb-3 tracking-wider">SELECTED WORK</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Crafted with <span className="gradient-text-blue">precision.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Aurora Finance", category: "FinTech Platform", gradient: "from-blue-600/20 to-indigo-600/20", desc: "A real-time portfolio dashboard with AI-driven insights. 200K+ users." },
                { title: "Nebula Commerce", category: "E-Commerce", gradient: "from-purple-600/20 to-pink-600/20", desc: "Headless commerce with 0.3s page loads. $12M GMV in year one." },
                { title: "Vertex Health", category: "HealthTech", gradient: "from-emerald-600/20 to-teal-600/20", desc: "HIPAA-compliant patient portal serving 50+ clinics nationwide." },
                { title: "Celeste Media", category: "Media & Publishing", gradient: "from-orange-600/20 to-red-600/20", desc: "Content platform with 10M monthly readers and edge-rendered articles." },
              ].map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative glass rounded-3xl p-8 md:p-10 overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-xs text-white/40 tracking-wider mb-2">{project.category}</p>
                        <h3 className="text-2xl md:text-3xl font-bold">{project.title}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                        <ArrowRight className="w-4 h-4 group-hover:text-black transition-colors" />
                      </div>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{project.desc}</p>
                    {/* Mock preview */}
                    <div className="mt-8 h-32 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                      <div className="flex gap-2">
                        {[0, 1, 2].map((dot) => (
                          <div
                            key={dot}
                            className="w-2 h-2 rounded-full bg-white/20"
                            style={{ animation: `pulse 1.5s ${dot * 0.2}s infinite` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="py-32 px-6 md:px-12 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-sm text-blue-400 mb-3 tracking-wider">HOW WE WORK</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                A process built for <span className="gradient-text-blue">momentum.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { num: "01", icon: Layers, title: "Discover", desc: "Deep-dive into your goals, users, and constraints. We define what success looks like." },
                { num: "02", icon: Palette, title: "Design", desc: "Wireframes, prototypes, and design systems. We iterate until every pixel feels right." },
                { num: "03", icon: Code2, title: "Build", desc: "Production code with type safety, tests, and CI/CD. Ship to staging weekly." },
                { num: "04", icon: Rocket, title: "Launch", desc: "Performance audits, edge deployment, monitoring. We don't just launch — we celebrate." },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="text-6xl font-bold text-white/5 mb-4">{step.num}</div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "120+", label: "Projects Shipped" },
              { value: "40+", label: "Happy Clients" },
              { value: "8 yrs", label: "Of Craft" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-7xl font-bold gradient-text-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="about" className="py-32 px-6 md:px-12 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-sm text-blue-400 mb-3 tracking-wider">CLIENT VOICES</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Don't just take <span className="gradient-text-blue">our word.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: "Pristine delivered our platform in 6 weeks. The attention to detail was unlike anything we'd seen. Every interaction felt considered.", name: "Sarah Chen", role: "CEO, Aurora Finance" },
                { quote: "They didn't just build our app — they redesigned how we think about user experience. Our conversion rate jumped 340%.", name: "Marcus Webb", role: "Founder, Nebula Commerce" },
                { quote: "Working with Pristine felt like having a senior team of 20. Fast, precise, and always one step ahead.", name: "Dr. Aisha Patel", role: "CTO, Vertex Health" },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Sparkles key={idx} className="w-4 h-4 text-blue-400" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-white/40">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-32 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/70 tracking-wide">AVAILABLE FOR NEW PROJECTS · Q3 2026</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                Let's build something <span className="gradient-text-blue">pristine.</span>
              </h2>
              <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                Tell us about your project. We'll respond within 24 hours with
                a tailored plan and timeline.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:hello@pristine.studio"
                  className="group flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform"
                >
                  hello@pristine.studio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-white/30">
                {["Twitter", "LinkedIn", "Dribbble", "GitHub"].map((social) => (
                  <a key={social} href="#" className="hover:text-white/60 transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                <span className="text-black font-bold text-xs">P</span>
              </div>
              <span className="text-sm text-white/50">Pristine Digital Studio</span>
            </div>
            <p className="text-xs text-white/30">© 2026 Pristine. Crafted with obsessive detail.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}