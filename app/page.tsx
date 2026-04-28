'use client';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { MdChevronRight, MdEmojiEvents, MdFavoriteBorder, MdGpsFixed, MdElectricBolt, MdArrowDownward, MdStar, MdShield, MdTrendingUp } from 'react-icons/md';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { HiUserGroup } from 'react-icons/hi';

/* ─── Reusable animated text reveal ─── */
function RevealText({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating particle ─── */
function Particle({ x, y, size, duration, delay }: { x: number; y: number; size: number; duration: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[#1a5c42]/20 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Score card component ─── */
function ScoreCard({ score, date, delay }: { score: number; date: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"
    >
      <span className="text-white/70 text-sm font-medium">{date}</span>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-white font-bold text-lg">{score}</span>
        <span className="text-white/50 text-xs">pts</span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 100, damping: 30 });

  const [hovered, setHovered] = useState<number | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: MdGpsFixed, title: 'Enter Scores', desc: 'Log your latest 5 Stableford scores. Clean interface, zero friction.', color: 'from-emerald-500/20 to-teal-500/10' },
    { icon: MdEmojiEvents, title: 'Monthly Draws', desc: 'Automatically enter monthly prize draws. Win by showing up consistently.', color: 'from-amber-500/20 to-orange-500/10' },
    { icon: MdFavoriteBorder, title: 'Give Back', desc: '10% minimum of every subscription flows to the charity you choose.', color: 'from-rose-500/20 to-pink-500/10' },
    { icon: MdElectricBolt, title: 'Instant Results', desc: 'Real-time draw results, automated winner verification, and fast payouts.', color: 'from-violet-500/20 to-purple-500/10' },
  ];

  const prizes = [
    { match: '5-Number', share: '40%', prize: 'Jackpot', icon:<Trophy/>, note: 'Rolls over if unclaimed' },
    { match: '4-Number', share: '35%', prize: 'Split Prize', icon:<Medal/>, note: 'Shared equally' },
    { match: '3-Number', share: '25%', prize: 'Split Prize', icon: <HiUserGroup/>, note: 'Shared equally' },
  ];

  const stats = [
    { value: 2400, suffix: '+', label: 'Active Golfers' },
    { value: 94, suffix: 'K', label: 'Prize Pool (£)' },
    { value: 18, suffix: '', label: 'Partner Charities' },
    { value: 99, suffix: '%', label: 'Payout Rate' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] text-zinc-900 overflow-x-hidden">

      {/* ─── NAVIGATION ─── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-100' : 'bg-transparent'}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-[#1a5c42] rounded-lg flex items-center justify-center mr-2"
            >
              <MdStar size={14} className="text-white fill-white" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">Digital</span>
            <span className="text-xl font-bold text-[#1a5c42] ml-1">Heroes</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600"
          >
            {[
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Prize Pool', href: '#prize-pool' },
              { label: 'Charities', href: '#charity' }
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ color: '#1a5c42' }}
                className="transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
            <Link href="/signup">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(26,92,66,0.3)' }}
            whileTap={{ scale: 0.96 }}
            className="px-5 py-2.5 bg-[#1a5c42] text-white rounded-full text-sm font-semibold transition-shadow"
          >
            Get Started
          </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5ef] via-[#fafaf8] to-[#f0f4ff]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a5c42]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-300/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        {/* Floating particles */}
        {[
          { x: 10, y: 20, size: 6, duration: 4, delay: 0 },
          { x: 85, y: 15, size: 10, duration: 5, delay: 1 },
          { x: 75, y: 70, size: 4, duration: 3.5, delay: 0.5 },
          { x: 20, y: 75, size: 8, duration: 4.5, delay: 1.5 },
          { x: 50, y: 10, size: 5, duration: 3, delay: 0.8 },
          { x: 90, y: 50, size: 7, duration: 5.5, delay: 2 },
        ].map((p, i) => <Particle key={i} {...p} />)}

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <motion.div
          style={{ y: springY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a5c42]/10 border border-[#1a5c42]/20 rounded-full text-[#1a5c42] text-sm font-semibold mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 bg-[#1a5c42] rounded-full"
            />
            Golf. Competition. Impact.
          </motion.div>

          {/* Headline — word-by-word stagger */}
          <div className="mb-6 overflow-hidden">
            {['Track Your Game.', 'Win Together.', 'Give Back.'].map((line, li) => (
              <div key={li} className="overflow-hidden">
                <motion.div
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 + li * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight ${
                    li === 0 ? 'text-zinc-900' : li === 1 ? 'text-[#1a5c42]' : 'text-zinc-400'
                  }`}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Score in Stableford format, compete in monthly draws, and know that every subscription directly supports the charity you choose.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(26,92,66,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 bg-[#1a5c42] text-white rounded-full font-semibold text-lg transition-shadow inline-flex items-center gap-3"
            >
              Start Free Trial
              <motion.span
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <MdChevronRight size={14} />
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-white border border-zinc-200 text-zinc-700 rounded-full font-semibold text-lg hover:border-zinc-300 hover:bg-zinc-50 transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-12 text-sm text-zinc-400"
          >
            {['No credit card required', '14-day free trial', 'Cancel anytime'].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <MdShield size={13} className="text-[#1a5c42]" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-zinc-400"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <MdArrowDownward size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-[#1a5c42] py-14">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <RevealText key={i} delay={i * 0.1} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealText className="text-center mb-16">
            <p className="text-sm font-semibold text-[#1a5c42] tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Simple. Engaging. Meaningful.</h2>
            <p className="text-xl text-zinc-500 max-w-xl mx-auto">Four steps that connect your golf game to something bigger than the scorecard.</p>
          </RevealText>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <RevealText key={i} delay={i * 0.1}>
                <motion.div
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative p-8 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-[#1a5c42]/30 hover:shadow-xl hover:shadow-[#1a5c42]/5 transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  {/* Step number */}
                  <motion.span
                    animate={hovered === i ? { opacity: 1, scale: 1 } : { opacity: 0.06, scale: 1 }}
                    className="absolute top-4 right-5 text-6xl font-black text-[#1a5c42] select-none transition-opacity"
                  >
                    {i + 1}
                  </motion.span>

                  {/* Gradient bg on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-12 h-12 bg-[#1a5c42]/10 rounded-xl flex items-center justify-center mb-5"
                    >
                      <f.icon className="text-[#1a5c42]" size={22} />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2 text-zinc-900">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </RevealText>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCORE ENTRY VISUAL ─── */}
      <section className="py-24 sm:py-32 bg-zinc-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,92,66,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <div>
              <RevealText>
                <p className="text-sm font-semibold text-emerald-400 tracking-widest uppercase mb-4">Score Entry</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                  Five scores.<br />One rolling window.
                </h2>
                <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                  Enter your latest 5 Stableford scores with dates. Each new entry automatically replaces the oldest — keeping your draw entries always current.
                </p>
              </RevealText>

              <RevealText delay={0.2}>
                <div className="space-y-3 mb-8">
                  {[
                    '1 score per date — no duplicates allowed',
                    'Scores range from 1 to 45 points',
                    'Displayed in reverse chronological order',
                    'Edit or delete any existing entry',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-zinc-300"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </RevealText>
            </div>

            {/* Right: animated score card UI */}
            <RevealText delay={0.3}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-semibold text-sm">My Scores</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-emerald-400 border border-emerald-400/30 px-3 py-1.5 rounded-full"
                  >
                    + Add Score
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {[
                    { score: 32, date: '18 Apr 2026' },
                    { score: 27, date: '12 Apr 2026' },
                    { score: 35, date: '5 Apr 2026' },
                    { score: 29, date: '28 Mar 2026' },
                    { score: 31, date: '22 Mar 2026' },
                  ].map((s, i) => (
                    <ScoreCard key={i} score={s.score} date={s.date} delay={0.5 + i * 0.1} />
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/50 text-xs">Draw numbers generated from scores</span>
                  <div className="flex gap-1.5">
                    {[32, 27, 35, 29, 31].map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.08, type: 'spring', stiffness: 300 }}
                        viewport={{ once: true }}
                        className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-xs font-bold"
                      >
                        {n}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* ─── PRIZE POOL ─── */}
      <section id="prize-pool" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealText className="text-center mb-16">
            <p className="text-sm font-semibold text-[#1a5c42] tracking-widest uppercase mb-3">Prize Pool</p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Real Prizes. Real Impact.</h2>
            <p className="text-xl text-zinc-500 max-w-xl mx-auto">
              A fixed share of every subscription flows into the monthly prize pool, distributed automatically.
            </p>
          </RevealText>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {prizes.map((prize, i) => (
              <RevealText key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(26,92,66,0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${i === 0 ? 'border-[#1a5c42] bg-[#1a5c42]' : 'border-zinc-200 bg-zinc-50 hover:border-[#1a5c42]/30'}`}
                >
                  {i === 0 && (
                    <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                      JACKPOT
                    </div>
                  )}
                  <div className="p-8">
                    <div className="text-4xl mb-4">{prize.icon}</div>
                    <p className={`text-sm font-semibold mb-1 ${i === 0 ? 'text-white/70' : 'text-zinc-500'}`}>{prize.match} Match</p>
                    <p className={`text-5xl font-black mb-2 ${i === 0 ? 'text-white' : 'text-zinc-900'}`}>{prize.share}</p>
                    <p className={`text-sm font-medium mb-1 ${i === 0 ? 'text-white/80' : 'text-zinc-700'}`}>{prize.prize}</p>
                    <p className={`text-xs ${i === 0 ? 'text-white/50' : 'text-zinc-400'}`}>{prize.note}</p>
                  </div>
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400" />
                  )}
                </motion.div>
              </RevealText>
            ))}
          </div>

          {/* Pool visualization bar */}
          <RevealText delay={0.3}>
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8">
              <p className="text-sm font-semibold text-zinc-500 mb-4">Pool Distribution</p>
              <div className="flex rounded-lg overflow-hidden h-10 gap-0.5">
                {[
                  { pct: 40, label: '40% Jackpot', bg: 'bg-[#1a5c42]' },
                  { pct: 35, label: '35% 4-Match', bg: 'bg-[#2d8a63]' },
                  { pct: 25, label: '25% 3-Match', bg: 'bg-[#5ab891]' },
                ].map((bar, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    style={{ width: `${bar.pct}%`, transformOrigin: 'left' }}
                    className={`${bar.bg} flex items-center justify-center text-white text-xs font-semibold rounded-sm`}
                  >
                    {bar.label}
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealText>
        </div>
      </section>

      {/* ─── CHARITY ─── */}
      <section id="charity" className="py-24 sm:py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <RevealText>
                <p className="text-sm font-semibold text-[#1a5c42] tracking-widest uppercase mb-4">Charity</p>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  Choose your cause.<br />Play your part.
                </h2>
                <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                  Select from our curated directory of charities aligned with golf, community, and social good. A minimum of 10% of your subscription goes directly to them — you can always give more.
                </p>
              </RevealText>

              <RevealText delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: MdFavoriteBorder, label: 'Community Golf', count: '6 charities' },
                    { icon: MdTrendingUp, label: 'Youth Sport', count: '4 charities' },
                    { icon: MdShield, label: 'Mental Health', count: '5 charities' },
                    { icon: MdStar, label: 'Environment', count: '3 charities' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-white rounded-xl border border-zinc-200 hover:border-[#1a5c42]/40 hover:shadow-md transition-all cursor-pointer"
                    >
                      <item.icon size={18} className="text-[#1a5c42] mb-2" />
                      <p className="text-sm font-semibold text-zinc-800">{item.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.count}</p>
                    </motion.div>
                  ))}
                </div>
              </RevealText>
            </div>

            {/* Charity contribution visual */}
            <RevealText delay={0.3}>
              <div className="relative">
                <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
                  <p className="text-sm font-semibold text-zinc-500 mb-6">Your £9.99/mo is doing this:</p>

                  {[
                    { label: 'Prize Pool', pct: 50, color: 'bg-[#1a5c42]' },
                    { label: 'Your Charity', pct: 20, color: 'bg-emerald-400' },
                    { label: 'Platform', pct: 30, color: 'bg-zinc-200' },
                  ].map((item, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-zinc-700">{item.label}</span>
                        <span className="text-zinc-500">{item.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          transition={{ delay: 0.6 + i * 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          viewport={{ once: true }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdFavoriteBorder size={18} className="text-emerald-600 fill-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">~£2/month minimum</p>
                      <p className="text-xs text-zinc-500">Goes directly to your chosen charity</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealText>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,92,66,0.35),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[#1a5c42]/40" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <RevealText>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border border-[#1a5c42]/40 rounded-2xl flex items-center justify-center mx-auto mb-8"
            >
              <MdStar size={24} className="text-[#1a5c42] fill-[#1a5c42]" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to make<br />an impact?
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              Join thousands of golfers combining passion, competition, and purpose. Start your free 14-day trial today.
            </p>

            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 20px 60px rgba(26,92,66,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-5 bg-[#1a5c42] text-white rounded-full font-bold text-lg transition-shadow inline-flex items-center gap-3 mb-6"
            >
              Subscribe Now
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              >
                <MdChevronRight size={20} />
              </motion.span>
            </motion.button>

            <p className="text-zinc-500 text-sm">No card required · 14 days free · Cancel anytime</p>
          </RevealText>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-zinc-950 border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a5c42] rounded-md flex items-center justify-center">
              <MdStar size={10} className="text-white fill-white" />
            </div>
            <span className="text-zinc-400 font-semibold">Digital Heroes</span>
          </div>
          <p>&copy; 2026 Digital Heroes · digitalheroes.co.in</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <motion.a key={item} href="#" whileHover={{ color: '#1a5c42' }} className="transition-colors text-zinc-500">
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}