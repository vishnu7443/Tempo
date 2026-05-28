/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, Check, Users, Sparkles, AlertCircle, 
  Clock, Shield, Globe2, Layers, Repeat, Zap, Play,
  Plus, Calendar as CalendarIcon, ArrowUpRight, Copy, CheckSquare,
  Volume2, ToggleLeft, Moon, Sun, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CalendarWidget from "./components/CalendarWidget";

// Testimonials Data
const TESTIMONIALS = [
  {
    quote: "Tempo cut my scheduling overhead by 80%. What used to take 15 emails now takes zero — the AI just knows. It protects my focus time like a true chief of staff.",
    name: "Sarah K.",
    role: "Head of Sales @ Stripe",
    stars: 5,
    highlight: "overhead by 80%"
  },
  {
    quote: "Our entire agency switched from Calendly. The calendar preview alone convinced the team in one demo. It's just exceptionally beautiful, visual and responsive.",
    name: "Marcus T.",
    role: "Creative Director @ Monogram Studio",
    stars: 5,
    highlight: "exceptionally beautiful"
  },
  {
    quote: "The automated buffers have saved us from at least 3 client disasters this quarter. No more back-to-back 6-hour runs without a break.",
    name: "Priya M.",
    role: "Chief of Staff @ Vesper Capital",
    stars: 5,
    highlight: "saved us from disasters"
  },
  {
    quote: "I work across 4 timezones daily. Tempo handles it. I stopped doing timezone math or sending wrong coordinate details entirely.",
    name: "James O.",
    role: "Remote Engineering Lead",
    stars: 5,
    highlight: "timezone math"
  },
  {
    quote: "Best SaaS onboarding I've ever experienced. Connected my calendar, shared my link, had my first reservation book in under four minutes.",
    name: "Anna L.",
    role: "Independent Consultant",
    stars: 5,
    highlight: "under four minutes"
  },
  {
    quote: "Tempo made me look organized to my premium clients before I even showed up. That professional trust starts with the booking experience.",
    name: "David C.",
    role: "Executive Coach",
    stars: 5,
    highlight: "trust starts with booking"
  }
];

export default function App() {
  // Page Entry sequence
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);

  // Floating Nav background transition
  const [scrolled, setScrolled] = useState(false);

  // Cursor tracker state
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<"normal" | "hoverable" | "clickable">("normal");

  // User details
  const userGeo = "San Francisco, CA";

  // Navigation menu toggle for mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active step in "How it Works" timeline
  const [activeStep, setActiveStep] = useState(1);

  // Pricing monthly/annually
  const [isAnnual, setIsAnnual] = useState(true);

  // Copy-link simulation state in Step 3 visual
  const [linkCopied, setLinkCopied] = useState(false);

  // Heatmap hover indexes
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Dynamic Dashboard variables
  const [timeZone, setTimeZone] = useState("UTC-7 (Pacific Time)");
  const [analogTime, setAnalogTime] = useState("");
  const dashboardCardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(25);
  const [rotateY, setRotateY] = useState(-10);
  const [scale, setScale] = useState(0.85);

  // Stagger states
  const [revealHeroText, setRevealHeroText] = useState(false);

  // Handle magnetic custom cursor loop
  useEffect(() => {
    const handleMouseMove = (e: MouseMoveEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Dynamic scale/lerpfollow ring
    let animationId: number;
    const updateRing = () => {
      setRingPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationId = requestAnimationFrame(updateRing);
    };
    updateRing();

    // Track scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial sequence timer
    const overlayTimer = setTimeout(() => {
      setIsIntroFinished(true);
    }, 1800);

    const overlayClearTimer = setTimeout(() => {
      setIsOverlayHidden(true);
      setRevealHeroText(true);
    }, 2800);

    // Modern Clock in Sidebar
    const clockInterval = setInterval(() => {
      const now = new Date();
      setAnalogTime(now.toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(overlayTimer);
      clearTimeout(overlayClearTimer);
      clearInterval(clockInterval);
    };
  }, [mousePos]);

  // Handle active cursor modifications
  const handleMouseEnterElement = (type: "hoverable" | "clickable") => {
    setCursorType(type);
  };

  const handleMouseLeaveElement = () => {
    setCursorType("normal");
  };

  // Simulated timezone options mapping
  const timeZonesList = [
    "UTC-7 (Pacific Standard)",
    "UTC-4 (Eastern Standard)",
    "UTC+0 (Greenwich Mean Time)",
    "UTC+2 (Central European)",
    "UTC+5.5 (Indian Standard)",
    "UTC+9 (Japan Standard)"
  ];

  // Dynamic parallax computation for actual 3D visual on scroll
  useEffect(() => {
    const handleScrollDepth = () => {
      if (!dashboardCardRef.current) return;
      const rect = dashboardCardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how close the center of components is to viewport center
      const elementCenter = rect.top + rect.height / 2;
      const fraction = Math.min(Math.max(elementCenter / viewportHeight, 0), 1);
      
      // Fraction goes from 1.0 (at bottom) to 0.0 (at top)
      const currentRotateX = Math.round(25 * fraction);
      const currentRotateY = Math.round(-10 * fraction);
      const currentScale = 0.85 + (0.15 * (1 - fraction));
      
      setRotateX(currentRotateX);
      setRotateY(currentRotateY);
      setScale(parseFloat(currentScale.toFixed(2)));
    };

    window.addEventListener("scroll", handleScrollDepth);
    return () => window.removeEventListener("scroll", handleScrollDepth);
  }, []);

  return (
    <div id="tempo-saas-root" className="min-h-screen relative font-sans selection:bg-[#FF4D00] selection:text-white bg-[#FAFAF7] text-[#1A1714]">
      
      {/* 2. CUSTOM MAGNETIC CURSOR */}
      <div 
        className="custom-cursor-dot hidden md:block" 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px`,
          width: cursorType === "normal" ? "6px" : "0px",
          height: cursorType === "normal" ? "6px" : "0px"
        }} 
      />
      <div 
        className="custom-cursor-ring hidden md:block" 
        style={{ 
          left: `${ringPos.x}px`, 
          top: `${ringPos.y}px`,
          width: cursorType === "normal" ? "36px" : cursorType === "hoverable" ? "60px" : "48px",
          height: cursorType === "normal" ? "36px" : cursorType === "hoverable" ? "60px" : "48px",
          backgroundColor: cursorType === "hoverable" ? "rgba(255, 77, 0, 0.1)" : cursorType === "clickable" ? "rgba(255, 77, 0, 0.2)" : "transparent",
          borderColor: cursorType === "normal" ? "#FF4D00" : "transparent"
        }} 
      />

      {/* 1. PAGE ENTRY SLIDE WELCOMING BLOCK */}
      {!isOverlayHidden && (
        <div 
          id="entry-overlay-banner" 
          className="fixed inset-0 bg-[#F2EFE8] z-[99999] flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isIntroFinished ? "translateY(100%)" : "translateY(0%)",
          }}
        >
          <div className="text-center">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#FF4D00] block mb-3 animate-pulse">Initializing Tempo System</span>
            <div className="flex items-center space-x-3 text-[#1A1714]">
              <span className="text-4xl font-bold tracking-tighter">TEMPO</span>
              <span className="text-xl italic font-serif text-[#FF4D00]">◫</span>
            </div>
            <div className="mt-8 overflow-hidden w-40 h-[1.5px] bg-[#D4CEC5] mx-auto rounded-full">
              <div className="h-full bg-[#FF4D00] animate-[marquee_1.8s_linear_infinite]" style={{ width: "40%" }} />
            </div>
          </div>
        </div>
      )}

      {/* 3. FLOATING NAVIGATION BAR */}
      <nav 
        id="tempo-floating-navigation"
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92vw] max-w-7xl rounded-full border border-[#D4CEC5] transition-all duration-300 z-50 px-6 py-3 flex items-center justify-between ${
          scrolled 
            ? "bg-[#FAFAF7]/90 backdrop-blur-xl shadow-lg shadow-[#1A1714]/5 md:py-3.5" 
            : "bg-transparent md:py-4.5"
        }`}
      >
        {/* Brand Wordmark & Icon */}
        <a 
          href="#"
          id="nav-logo-root"
          className="flex items-center space-x-2 cursor-pointer group"
          onMouseEnter={() => handleMouseEnterElement("clickable")}
          onMouseLeave={handleMouseLeaveElement}
        >
          <span className="text-lg font-bold text-[#FF4D00] tracking-tighter group-hover:scale-110 transition-transform">◫</span>
          <span className="text-lg font-extrabold tracking-tight text-[#1A1714]">TEMPO</span>
        </a>

        {/* Desktop Anchor Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {["Features", "How it Works", "Integrations", "Pricing", "Testimonials"].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-xs font-semibold text-[#3D3733] tracking-wide uppercase hover:text-[#FF4D00] transition-colors relative underline-hover-grow"
              onMouseEnter={() => handleMouseEnterElement("hoverable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right Nav Action buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            className="text-xs font-semibold text-[#3D3733] hover:text-[#FF4D00] transition-colors"
            onMouseEnter={() => handleMouseEnterElement("clickable")}
            onMouseLeave={handleMouseLeaveElement}
          >
            Sign in
          </button>
          <a
            href="#cta"
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#CC3D00] text-white text-xs font-bold tracking-tight rounded-full transition-all hover:shadow-md hover:shadow-[#FF4D00]/20 inline-block text-center"
            onMouseEnter={() => handleMouseEnterElement("clickable")}
            onMouseLeave={handleMouseLeaveElement}
          >
            Start free →
          </a>
        </div>

        {/* Mobile Navigation toggle icon */}
        <button 
          id="mobile-hud-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 md:hidden text-[#1A1714] focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-drawer-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#FAFAF7] z-40 pt-24 px-6 md:hidden flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col space-y-6">
              {["Features", "How it Works", "Integrations", "Pricing", "Testimonials"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold tracking-tight text-[#1A1714] hover:text-[#FF4D00]"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="flex flex-col space-y-3">
              <button 
                className="w-full text-center py-3 border border-[#D4CEC5] rounded-full text-sm font-semibold text-[#3D3733]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </button>
              <a
                href="#cta"
                className="w-full text-center py-3 bg-[#FF4D00] text-white rounded-full text-sm font-bold tracking-tight inline-block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start free →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. HERO SECTION */}
      <section id="hero" className="relative pt-36 md:pt-48 pb-20 overflow-hidden bg-[#FAFAF7]">
        {/* Soft Noise Grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none bg-[url('https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=1200')] bg-repeat" />
        
        {/* Background gradient fade elements */}
        <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-[#FF4D00]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-[5%] w-[35vw] h-[35vw] bg-[#1DB954]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Hero Left Column Text elements */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealHeroText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Intelligent Label indicator */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={revealHeroText ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                id="hero-badge-marker" 
                className="inline-flex items-center space-x-2 bg-[#1A1714] text-[#FAFAF7] px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span>Next-generation calendar optimizer</span>
              </motion.div>

              {/* Spectacular Headline reveal typography */}
              <h1 id="hero-title" className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight font-sans font-extrabold text-[#1A1714]">
                <div className="overflow-hidden block py-1">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={revealHeroText ? { y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    SCHEDULE
                  </motion.span>
                </div>
                <div className="overflow-hidden block py-1">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={revealHeroText ? { y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block italic font-serif font-light text-[#FF4D00]"
                  >
                    intelligent,
                  </motion.span>
                </div>
                <div className="overflow-hidden block py-1">
                  <motion.span 
                    initial={{ y: "100%" }}
                    animate={revealHeroText ? { y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    meet perfectly.
                  </motion.span>
                </div>
              </h1>
            </motion.div>

            {/* Description copy text */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={revealHeroText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-[#7A736B] leading-relaxed max-w-lg font-sans font-normal"
            >
              Tempo replaces the grueling coordination of reservation slots with an AI-augmented engine that values your time. Guard your deep-focus hours, eliminate double-bookings, and coordinate with teams instantly.
            </motion.p>

            {/* Micro Call-to-Actions Row */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={revealHeroText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2"
            >
              <a 
                href="#cta"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF4D00] hover:bg-[#CC3D00] text-white text-sm font-bold tracking-tight rounded-full transition-all shadow-md hover:shadow-lg hover:shadow-[#FF4D00]/25 flex items-center justify-center space-x-2"
                onMouseEnter={() => handleMouseEnterElement("clickable")}
                onMouseLeave={handleMouseLeaveElement}
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-4 rounded-full border border-[#D4CEC5] bg-white hover:bg-[#F2EFE8] text-xs font-mono font-semibold tracking-wide uppercase text-[#3D3733] transition-colors flex items-center justify-center space-x-2"
                onMouseEnter={() => handleMouseEnterElement("clickable")}
                onMouseLeave={handleMouseLeaveElement}
              >
                <span>Discover step logic</span>
                <span className="text-[10px] text-[#7A736B]">↓</span>
              </a>
            </motion.div>

            {/* Trust Pile Avatar Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={revealHeroText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <div className="flex -space-x-3.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Active professional partner avatar"
                    className="w-9 h-9 rounded-full border-2 border-[#FAFAF7] object-cover ring-1 ring-[#D4CEC5]"
                    referrerPolicy="no-referrer"
                    onMouseEnter={() => handleMouseEnterElement("hoverable")}
                    onMouseLeave={handleMouseLeaveElement}
                  />
                ))}
              </div>
              <div className="font-mono text-xs text-[#7A736B] leading-tight space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#FF4D00] font-bold text-sm">★★★★★</span>
                  <span className="text-[#1A1714] font-semibold">4.9/5 Rating</span>
                </div>
                <p>Trusted by <span className="text-[#1A1714] font-medium underline decoration-[#FF4D00]">50,000+ engineers</span>, creators & support teams</p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Column Interactive widget */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* Visual background shadows */}
            <div className="absolute top-[10%] inset-0 bg-[#FF4D00]/5 blur-[80px] rounded-full pointer-events-none" />
            
            <motion.div 
              id="hero-calendar-container"
              initial={{ opacity: 0, x: 40 }}
              animate={revealHeroText ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md pointer-events-auto"
            >
              <CalendarWidget />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 5. COMPANIES SCROLL TICKER */}
      <section id="marquee-ticker" className="bg-[#F2EFE8] border-y border-[#D4CEC5] py-7 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7A736B] block">
            Coordinating schedules for teams at world-class companies
          </span>
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          {/* Animated endless sliding track */}
          <div className="animate-marquee-custom flex whitespace-nowrap space-x-20 shrink-0 text-xl font-bold tracking-widest text-[#B5AFA8]">
            {/* Set 1 */}
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">GOOGLE</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">STRIPE</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">NOTION</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">LINEAR</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">VERCEL</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">FIGMA</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">LOOM</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">SUPERHUMAN</span>
            <span className="text-[#D4CEC5]">·</span>
            {/* Set 2 duplicate to prevent loops cuts */}
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">GOOGLE</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">STRIPE</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">NOTION</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">LINEAR</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">VERCEL</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">FIGMA</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">LOOM</span>
            <span className="text-[#D4CEC5]">·</span>
            <span className="hover:text-[#FF4D00] transition-colors font-sans cursor-default">SUPERHUMAN</span>
            <span className="text-[#D4CEC5]">·</span>
          </div>
        </div>
      </section>

      {/* 6. FEATURES BENTO GRID */}
      <section id="features" className="py-24 md:py-32 bg-[#FAFAF7] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Header titles */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4D00] block">Designed for Modern Teams</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans text-[#1A1714]">
              Everything your traditional calendar was <span className="italic font-serif font-normal text-[#FF4D00]">missing.</span>
            </h2>
            <p className="text-[#7A736B] text-sm md:text-base font-sans max-w-lg">
              Designed according to human standards of execution: zero noise, maximum visual efficiency. Here is how your time becomes unified.
            </p>
          </motion.div>

          {/* Interactive Asymmetric Bento Matrix (12 Column) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            
            {/* Card 1: AI Heatmap Visualization (Col span 8, Row span 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-8 bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 group hover:-translate-y-1 cursor-crosshair min-h-[440px]"
              onMouseEnter={() => handleMouseEnterElement("hoverable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 bg-[#FF4D00]/10 border border-[#FF4D00]/20 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide text-[#FF4D00]">
                  <Sparkles className="w-3  h-3" />
                  <span>Protected Focus Zones</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#1A1714]">Dynamic Scheduling Heatmaps</h3>
                <p className="text-xs md:text-sm text-[#7A736B] max-w-md">
                  Observe when you operate with peak focus. Meet during administrative availability windows; protect early mornings. Hover over the blocks below to view availability weight score.
                </p>
              </div>

              {/* Working Heatmap React Grid */}
              <div className="my-6 bg-[#FAFAF7] border border-[#D4CEC5] p-5 rounded-2xl relative">
                <div className="flex justify-between items-center text-xs font-medium text-[#7A736B] mb-3">
                  <span>Weekly Booking Density</span>
                  <span className="text-[#FF4D00] text-xs font-semibold">Interactive matrix</span>
                </div>
                
                {/* 7 column grid, 4 rows representing 4 weeks */}
                <div className="grid grid-cols-7 gap-2.5">
                  {Array.from({ length: 4 }).map((_, rIdx) => (
                    Array.from({ length: 7 }).map((_, cIdx) => {
                      // Generate varying layout depths representing booking densites
                      const weight = (rIdx * 2 + cIdx * 3) % 5;
                      const weightColors = [
                        "bg-[#F2EFE8]",           // Empty weight
                        "bg-[#FFF0EB]",           // Pale density
                        "bg-[#FFCCB3]",           // Mid density
                        "bg-[#FF9966]",           // High density
                        "bg-[#FF4D00]"            // Peak density
                      ];
                      
                      const isHovered = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx;

                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`aspect-square rounded-md ${weightColors[weight]} transition-all duration-150 relative cursor-pointer ${
                            isHovered ? "scale-110 ring-2 ring-[#FF4D00] shadow-sm z-10" : ""
                          }`}
                        >
                          {/* Rich Floating Mini HUD tooltip inside element */}
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-[#1A1714] text-white p-2 rounded-lg text-xs whitespace-nowrap z-20 pointer-events-none shadow-md">
                              <div>{`Slot Focus Weight: ${weight * 20}%`}</div>
                              <div className="text-[#FF4D00] mt-0.5">{weight === 0 ? "Protected Zone" : `${weight * 2} events active`}</div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3 text-xs text-[#7A736B]">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#3D3733]">
                <span className="font-medium">Tempo Availability Hub</span>
                <span className="text-[#FF4D00] font-semibold flex items-center space-x-1">
                  <span>Visualize availability models</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>

            {/* Card 2: One Link, Infinite Options (Col span 4) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onMouseEnter={() => handleMouseEnterElement("clickable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF4D00]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] tracking-tight">One Link, Infinite Options</h3>
                  <p className="text-xs text-[#7A736B] mt-2 leading-relaxed">
                    Set separate pages for Quick Syncs, In-depth Consultations, or Studio tours. Tempo redirects guests dynamically based on query structures.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4CEC5] space-y-2">
                {["30-min Coffee Sync", "60-min Deep Consult", "15-min Technical triage"].map((title, i) => (
                  <div key={i} className="flex justify-between items-center text-xs bg-[#FAFAF7] p-2 rounded-lg border border-[#D4CEC5]/60 font-mono text-[#3D3733]">
                    <span>{title}</span>
                    <span className="text-emerald-500 font-bold">✓ Active</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Smart Conflict Detection (Col span 4) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-105px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 hover:-translate-y-1 cursor-default"
              onMouseEnter={() => handleMouseEnterElement("hoverable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30]">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] tracking-tight">Real-Time Collision Guard</h3>
                  <p className="text-xs text-[#7A736B] mt-2 leading-relaxed">
                    Our scheduling logic executes instant database scans against internal and external synced calendars. Overlaps are halted before they manifest.
                  </p>
                </div>
              </div>

              {/* Working conflict SVG layout animation */}
              <div className="my-4 bg-white p-4 rounded-xl border border-[#D4CEC5] relative overflow-hidden h-28 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#FF3B30] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
                  <span>Conflict Intercepted</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded text-[9px] font-mono px-2 text-[#FF3B30] flex justify-between items-center">
                    <span>9:30 AM Client Pitch (Overlap)</span>
                    <span>Halted</span>
                  </div>
                  <div className="h-4 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded text-[9px] font-mono px-2 text-[#1DB954] flex justify-between items-center">
                    <span>10:00 AM Client Pitch (Offset Buffer)</span>
                    <span>Resolved</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Global Time Zone Intelligence (Col span 4) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-105px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onMouseEnter={() => handleMouseEnterElement("clickable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF4D00]">
                  <Globe2 className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] tracking-tight">Time Zone Native Engine</h3>
                  <p className="text-xs text-[#7A736B] mt-2 leading-relaxed">
                    Never calculate differences again. Guests pick in local hours, you see appointments mapped automatically inside clean home coordinate templates.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-[#FAFAF7] border border-[#D4CEC5]/60 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#7A736B]">New York (EST)</span>
                  <span className="font-semibold text-[#1A1714]">06:12 AM</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-[#D4CEC5]/40 pt-1.5">
                  <span className="text-[#7A736B]">London (GMT)</span>
                  <span className="font-semibold text-[#1A1714]">11:12 AM</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-[#D4CEC5]/40 pt-1.5">
                  <span className="text-[#FF4D00]">User Coordinate</span>
                  <span className="font-semibold text-[#FF4D00]">10:12 AM (UTC)</span>
                </div>
              </div>
            </motion.div>

            {/* Card 5: Smart Buffer Guards (Col span 4) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-105px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 hover:-translate-y-1 cursor-default"
              onMouseEnter={() => handleMouseEnterElement("hoverable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF4D00]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1714] tracking-tight">Dynamic Buffers Setup</h3>
                  <p className="text-xs text-[#7A736B] mt-2 leading-relaxed">
                    Protect sanity automatically. Insert smart spacing boundaries of 10, 15, or 30 minutes before and after any booking structures instantly.
                  </p>
                </div>
              </div>

              <div className="my-2 bg-[#FAFAF7] border border-[#D4CEC5] p-3 rounded-lg flex items-center justify-between font-mono text-[11px] text-[#3D3733]">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
                  <span>Buffer Boundary Guard</span>
                </div>
                <span className="bg-[#FFF0EB] text-[#FF4D00] font-bold px-2 py-0.5 rounded-md border border-[#FF4D00]/20">+15m Buffer Active</span>
              </div>
            </motion.div>

            {/* Card 6: Collaborative Availability Array (Col span 8) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-8 bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 group hover:-translate-y-1 cursor-pointer min-h-[300px]"
              onMouseEnter={() => handleMouseEnterElement("clickable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 bg-[#FFF0EB] border border-[#FF4D00]/25 px-2.5 py-1 rounded text-xs font-bold tracking-wide text-[#FF4D00]">
                  <Users className="w-3.5 h-3.5" />
                  <span>Team Coordination Panel</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1714]">Unified Team Availability</h3>
                <p className="text-xs md:text-sm text-[#7A736B] max-w-lg">
                  Integrate schedules across department leads automatically. Show overlay coordinates or identify the exact intersection where your entire executive suite is free.
                </p>
              </div>

              <div className="my-6 bg-white border border-[#D4CEC5] rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-4 text-[10px] font-mono text-[#7A736B]">
                  <div className="w-20 text-right font-semibold">Sarah (Sales):</div>
                  <div className="flex-1 h-3.5 bg-[#FFF0EB] rounded-lg border border-[#FF4D00]/20 relative overflow-hidden">
                    <span className="absolute left-[30%] right-[30%] bg-transparent flex h-full items-center justify-center font-bold text-[#FF4D00] text-[8px] tracking-wider bg-[#FF4D00]/20">FREE SYNC ZONE</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-[10px] font-mono text-[#7A736B] border-t border-[#D4CEC5]/40 pt-2">
                  <div className="w-20 text-right font-semibold">Alex (Product):</div>
                  <div className="flex-1 h-3.5 bg-[#FFF0EB] rounded-lg border border-[#FF4D00]/20 relative overflow-hidden">
                    <span className="absolute left-[15%] right-[25%] bg-[#FF4D00]/15" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-[10px] font-mono text-[#7A736B] border-t border-[#D4CEC5]/40 pt-2">
                  <div className="w-20 text-right font-semibold">Marcus (Design):</div>
                  <div className="flex-1 h-3.5 bg-[#FFF0EB] rounded-lg border border-[#FF4D00]/20 relative overflow-hidden">
                    <span className="absolute left-[20%] right-[40%] bg-[#FF4D00]/15" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-[#3D3733]">
                <span>Tempo Multi-User Engine v10.4</span>
                <span className="text-[#FF4D00]">Try Collaborative links →</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#F2EFE8] border-y border-[#D4CEC5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4D00] block">Simple Onboarding</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1714]">
              Four steps to clockwork scheduling.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            
            {/* Visual Steps column */}
            <div className="lg:col-span-8 space-y-12">
              {[
                {
                  num: "01",
                  title: "Connect existing calendars",
                  desc: "Instantly link Google Calendar, Outlook, iCloud, or custom CalDAV setups in under 30 seconds. One clean connection point compiles it all.",
                  hud: (
                    <div className="flex items-center justify-center bg-white p-4 border border-[#D4CEC5] rounded-2xl shadow-sm overflow-hidden h-full">
                      <div className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs">
                        <span className="bg-[#1A1714] text-white px-2.5 py-1.5 rounded-xl font-semibold shadow-sm text-center truncate max-w-[80px]">Google</span>
                        <span className="text-[#7A736B] font-mono text-[10px]">←</span>
                        <span className="bg-[#FF4D00] text-white px-3 py-2 rounded-2xl text-[11px] font-bold tracking-wide shadow-md border border-[#FF4D00]/10 shrink-0 text-center">TEMPO</span>
                        <span className="text-[#7A736B] font-mono text-[10px]">→</span>
                        <span className="bg-[#1C1C1A] text-white px-2.5 py-1.5 rounded-xl font-semibold shadow-sm text-center truncate max-w-[80px]">Outlook</span>
                      </div>
                    </div>
                  )
                },
                {
                  num: "02",
                  title: "Establish individual guidelines",
                  desc: "Assign preferred hours, minimum notice times, buffer constraints, or meeting types. Tempo respects your exact physical boundaries as absolute.",
                  hud: (
                    <div className="bg-white p-4 border border-[#D4CEC5] rounded-2xl shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-sans font-bold text-[#7A736B] uppercase tracking-wider">
                        <span>Ideal Work Block Hours</span>
                        <span className="text-[#FF4D00]">Enforced</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#FAFAF7] border border-[#D4CEC5] rounded-xl text-[11px] font-semibold text-[#1A1714]">
                        <span className="truncate pr-1">Minimum Prep Period: 2 hours</span>
                        <input type="checkbox" checked readOnly className="accent-[#FF4D00] w-3.5 h-3.5 cursor-default shrink-0" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-[#FAFAF7] border border-[#D4CEC5] rounded-xl text-[11px] font-semibold text-[#1A1714]">
                        <span className="truncate pr-1">Buffer Guard: 15m before/after</span>
                        <input type="checkbox" checked readOnly className="accent-[#FF4D00] w-3.5 h-3.5 cursor-default shrink-0" />
                      </div>
                    </div>
                  )
                },
                {
                  num: "03",
                  title: "Deploy coordinate link",
                  desc: "Distribute your customized calendar link. Clients, partners, or colleagues select slots immediately based on local hour conversions.",
                  hud: (
                    <div className="bg-white p-4 border border-[#D4CEC5] rounded-2xl shadow-sm flex items-center justify-between gap-3 overflow-hidden">
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-[#7A736B] uppercase tracking-wider block">YOUR SECURE LINK</span>
                        <span className="text-xs font-bold text-[#FF4D00] truncate block">tempo.io/calendar/swarn</span>
                      </div>
                      <button 
                        onClick={() => {
                          setLinkCopied(true);
                          setTimeout(() => setLinkCopied(false), 2000);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center space-x-1 shrink-0 shadow-sm ${
                          linkCopied 
                            ? "bg-[#1DB954] text-white" 
                            : "bg-[#1A1714] text-white hover:bg-[#FF4D00]"
                        }`}
                        onMouseEnter={() => handleMouseEnterElement("clickable")}
                        onMouseLeave={handleMouseLeaveElement}
                      >
                        {linkCopied ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.5px]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )
                },
                {
                  num: "04",
                  title: "Meetings materialize seamlessly",
                  desc: "Rescheduling parameters are validated automatically. Cal invites, confirmation notifications, and reminders are dispatched dynamically.",
                  hud: (
                    <div className="bg-[#EFFFFA] border border-[#1DB954]/25 p-4 rounded-2xl flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-[#white] shrink-0 shadow-sm">
                        <Check className="w-4 h-4 stroke-[2.5px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-[#1DB954] uppercase tracking-wider block">STATUS REPORT</span>
                        <h4 className="text-xs font-extrabold text-[#1A1714] truncate">Calendar Fully Aligned</h4>
                        <p className="text-[11px] text-[#7A736B] truncate">Invites mirrored to Google and Outlook.</p>
                      </div>
                    </div>
                  )
                }
              ].map((step, idx) => (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-[#D4CEC5]/40 pb-8 last:border-b-0 last:pb-0"
                  onMouseEnter={() => setActiveStep(idx + 1)}
                >
                  {/* Step label index */}
                  <div className="col-span-1 flex lg:justify-center">
                    <span className={`text-3xl lg:text-4xl font-extrabold tracking-tight font-serif ${
                      activeStep === idx + 1 ? "text-[#FF4D00]" : "text-[#D4CEC5]"
                    }`}>
                      {step.num}
                    </span>
                  </div>
                  
                  {/* Detail details */}
                  <div className="lg:col-span-6 space-y-2">
                    <h3 className="text-lg md:text-xl font-bold font-sans text-[#1A1714]">{step.title}</h3>
                    <p className="text-xs md:text-sm text-[#7A736B] leading-relaxed max-w-md">{step.desc}</p>
                  </div>

                  {/* Right hand HUD container */}
                  <div className="lg:col-span-5">
                    {step.hud}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sticky visual tracker on desktop */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:col-span-4 lg:block sticky top-32 self-start bg-[#E8E2D9] rounded-3xl p-8 border border-[#D4CEC5] space-y-6"
            >
              <span className="text-xs uppercase tracking-wider text-[#FF4D00] font-semibold block">Onboarding Progress</span>
              <div className="space-y-4">
                {[
                  "1. Sync your current diaries",
                  "2. Set custom buffering rules",
                  "3. Personalize booking link",
                  "4. Automation & alerts active"
                ].map((item, i) => {
                  const isActive = activeStep === i + 1;
                  return (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isActive 
                          ? "bg-[#FAFAF7] border-[#FF4D00] pl-6 text-[#1A1714] font-semibold shadow-sm" 
                          : "bg-transparent border-transparent text-[#7A736B]"
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#D4CEC5] pt-4 text-center">
                <span className="text-[10px] text-[#7A736B] uppercase block">Synchronization Status</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">✓ Active & Secured</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 8. INTEGRATIONS (DARK VARIANT FOR RYTHM BREATHING SPACE) */}
      <section id="integrations" className="py-24 md:py-32 bg-[#1A1714] text-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Header descriptions */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4D00] block">Connected Integrations</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-white">
              Ecosystem aligned. Syncs with your everyday workflow tools.
            </h2>
            <p className="text-[#8F8A83] text-sm md:text-base font-sans max-w-xl">
              Integrate smoothly with all the major productivity platforms you already use. Sync parameters directly across collaborative environments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Integrated network constellation graph */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex justify-center relative py-12 bg-[#1C1C1A] border border-[#2D2D2A] rounded-3xl overflow-hidden min-h-[380px] items-center"
            >
              {/* Spinning subtle orbital concentric structures */}
              <div className="absolute w-80 h-80 rounded-full border border-[#2D2D2A] animate-spin pointer-events-none" style={{ animationDuration: "35s" }} />
              <div className="absolute w-56 h-56 rounded-full border border-[#2D2D2A] border-dashed animate-spin pointer-events-none" style={{ animationDuration: "20s" }} />

              {/* Centered Tempo Star */}
              <motion.div 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                className="w-16 h-16 rounded-full bg-[#FF4D00] flex items-center justify-center text-white z-10 relative shadow-[0_0_40px_rgba(255,77,0,0.4)] group"
                onMouseEnter={() => handleMouseEnterElement("hoverable")}
                onMouseLeave={handleMouseLeaveElement}
              >
                <span className="text-2xl font-bold font-mono">◫</span>
              </motion.div>

               {/* Orbital Constellations Nodes */}
              {[
                { 
                  label: "Slack", 
                  top: "16%", 
                  left: "21%", 
                  bg: "bg-[#1C1C1A]/90 border-neutral-800",
                  textColor: "text-[#FAFAF7]",
                  logo: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 animate-pulse">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042z" fill="#36C5F0"/>
                      <path d="M8.823 5.043a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043z" fill="#2EB67D"/>
                      <path d="M18.958 8.824a2.528 2.528 0 0 1 2.521-2.52 2.528 2.528 0 0 1 2.521 2.52a2.528 2.528 0 0 1-2.521 2.523h-2.521V8.824zm-1.261 0a2.528 2.528 0 0 1-2.52 2.523h-5.043a2.528 2.528 0 0 1-2.521-2.523V3.782a2.528 2.528 0 0 1 2.521-2.521h5.043c1.392 0 2.52 1.13 2.52 2.521v5.042z" fill="#ECB22E"/>
                      <path d="M15.177 18.958a2.528 2.528 0 0 1-2.52 2.521 2.528 2.528 0 0 1-2.521-2.521v-2.521h2.521a2.528 2.528 0 0 1 2.52 2.521zm0-1.261a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.521-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52/2.52H15.177z" fill="#E01E5A"/>
                    </svg>
                  )
                },
                { 
                  label: "Notion", 
                  top: "24%", 
                  left: "76%", 
                  bg: "bg-[#1C1C1A]/90 border-neutral-800", 
                  textColor: "text-[#FAFAF7]",
                  logo: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white shrink-0">
                      <path d="M4.17 3.51c.32-.47.88-.73 1.46-.73h11.95c.53 0 1.05.22 1.39.61v.01c.33.37.49.86.43 1.34l-1 8.24-.95 7.64c-.06.49-.47.88-.97.91h-12c-.52 0-1.01-.21-1.34-.58V21c-.34-.37-.5-.87-.44-1.35l1-8.24.93-7.53c.06-.5.48-.9 1-.92v.15zm2.81 3.52v9.34h2.29V9.34L14.7 17h.31l3.52-7.79v7.13h2.3V5.55h-3.15L13.11 13.5 9.28 5.55H6.98v1.48z" />
                    </svg>
                  )
                },
                { 
                  label: "Salesforce", 
                  top: "76%", 
                  left: "18%", 
                  bg: "bg-[#1C1C1A]/90 border-neutral-800", 
                  textColor: "text-[#FAFAF7]",
                  logo: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M12.922 6.84c-1.189 0-2.227.674-2.735 1.66A3.676 3.676 0 0 0 8.01 7.28a3.676 3.676 0 0 0-3.666 3.325 3.3 3.3 0 0 0-2.316 3.163c0 1.83 1.5 3.313 3.342 3.313h10.972c2.164 0 3.918-1.745 3.918-3.9 0-1.922-1.396-3.522-3.238-3.842a4.417 4.417 0 0 0-4.11-2.499z" fill="#00A1E0"/>
                    </svg>
                  )
                },
                { 
                  label: "HubSpot", 
                  top: "80%", 
                  left: "65%", 
                  bg: "bg-[#1C1C1A]/90 border-neutral-800", 
                  textColor: "text-[#FAFAF7]",
                  logo: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M20 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-5c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#FF7A59"/>
                      <circle cx="12" cy="4" r="2" fill="#FF7A59"/>
                      <circle cx="5" cy="16" r="1.5" fill="#FF7A59"/>
                      <line x1="12" y1="4" x2="12" y2="7" stroke="#FF7A59" strokeWidth="1.5" />
                      <line x1="5" y1="16" x2="8.5" y2="13.5" stroke="#FF7A59" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )
                },
                { 
                  label: "Zoom", 
                  top: "45%", 
                  left: "81%", 
                  bg: "bg-[#1C1C1A]/90 border-neutral-800", 
                  textColor: "text-[#FAFAF7]",
                  logo: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <rect width="24" height="24" rx="5" fill="#2D8CFF"/>
                      <path d="M6 8.5C6 7.672 6.672 7 7.5 7h5A1.5 1.5 0 0 1 14 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 6 13.5v-5zm10 1.25l3-2.25v9l-3-2.25v-4.5z" fill="#FFFFFF"/>
                    </svg>
                  )
                }
              ].map((node, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${node.bg} transform -translate-x-1/2 -translate-y-1/2 cursor-crosshair hover:scale-110 active:scale-95 transition-all duration-300 z-15`}
                  style={{ top: node.top, left: node.left }}
                  onMouseEnter={() => handleMouseEnterElement("hoverable")}
                  onMouseLeave={handleMouseLeaveElement}
                >
                  {node.logo}
                  <span className={`${node.textColor} font-sans text-xs font-semibold tracking-wide`}>{node.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Bulleted specifics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs text-[#FF4D00] uppercase tracking-wider block">OUTSTANDING SPECS</span>
                <p className="text-xs text-[#8F8A83] leading-relaxed">
                  Tempo interacts natively, sending webhooks to Salesforce, Zapier, Stripe billing engines, Microsoft Teams portals, Slack channels, and Linear dashboards.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Direct OAuth2.0 Setup", icon: <Shield className="w-4 h-4 text-[#FF4D00]" /> },
                  { title: "Real-time Webhook hooks", icon: <Zap className="w-4 h-4 text-[#FF4D00]" /> },
                  { title: "Two-way Calendar mirror", icon: <Repeat className="w-4 h-4 text-[#FF4D00]" /> },
                  { title: "Multi-system routing", icon: <Layers className="w-4 h-4 text-[#FF4D00]" /> }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#1C1C1A] border border-[#2D2D2A] rounded-xl flex items-center space-x-2.5">
                    {item.icon}
                    <span className="text-xs font-mono font-medium text-white">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-24 md:py-32 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* Header titles with custom monthly/annually custom pill selector */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-xl space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4D00] block">Subscription Plans</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-sans text-[#1A1714]">
                Simple pricing. <span className="italic font-serif font-light text-[#FF4D00]">Maximum coordination value.</span>
              </h2>
            </div>

            {/* Selector slider toggler */}
            <div className="flex items-center space-x-3 self-start">
              <span className={`text-xs font-mono ${!isAnnual ? "text-[#FF4D00] font-bold" : "text-[#7A736B]"}`}>Monthly Billing</span>
              <button
                onClick={() => {
                  setIsAnnual(!isAnnual);
                }}
                className="w-12 h-6 rounded-full bg-[#E8E2D9] p-1 flex items-center transition-all duration-300 pointer-events-auto"
                onMouseEnter={() => handleMouseEnterElement("clickable")}
                onMouseLeave={handleMouseLeaveElement}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-[#FF4D00] transition-all duration-300 ${
                    isAnnual ? "translate-x-6" : "translate-x-0"
                  }`} 
                />
              </button>
              <div className="flex items-center space-x-1.5 font-mono">
                <span className={`text-xs ${isAnnual ? "text-[#FF4D00] font-bold" : "text-[#7A736B]"}`}>Annual Sync</span>
                <span className="text-[10px] bg-[#FFF0EB] text-[#FF4D00] px-2 py-0.5 rounded-full font-bold border border-[#FF4D00]/25">Save 25%</span>
              </div>
            </div>
          </motion.div>

          {/* Pricing tiers matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
            
            {/* Solo Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F2EFE8] border border-[#D4CEC5] p-8 rounded-3xl flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#7A736B] block font-semibold mb-1">Basic Plan</span>
                  <h3 className="text-2xl font-bold font-sans text-[#1A1714] mt-1">Solo Planner</h3>
                  <p className="text-xs text-[#7A736B] mt-2">Perfect for independent consultants, creators, and professionals needing pristine standard calendars.</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tighter text-[#1A1714] font-mono">$0</span>
                  <span className="text-[#7A736B] text-xs font-mono ml-2">free forever</span>
                </div>

                <ul className="space-y-3.5 text-xs text-[#3D3733] border-t border-[#D4CEC5] pt-6 font-sans">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>1 synced primary calendar (Google/Outlook)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>Standard core booking coordination link</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>Local coordinate time-zone auto tracking</span>
                  </li>
                  <li className="flex items-center space-x-2.5 text-[#B5AFA8] line-through">
                    <span>Dynamic multi-user availability charts</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href="#cta"
                  className="w-full text-center py-3 border border-[#1A1714] text-[#1A1714] hover:bg-[#1A1714] hover:text-white text-xs font-bold font-mono tracking-wide uppercase rounded-full transition-all inline-block"
                  onMouseEnter={() => handleMouseEnterElement("clickable")}
                  onMouseLeave={handleMouseLeaveElement}
                >
                  Start free
                </a>
              </div>
            </motion.div>

            {/* Pro Tier (Highlighted) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F2EFE8] border-2 border-[#FF4D00] p-8 rounded-3xl flex flex-col justify-between relative hover:-translate-y-1 transition-all duration-300 shadow-[0_24px_48px_rgba(255,77,0,0.06)]"
            >
              {/* Highlight Ribbon */}
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#FF4D00] text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
                Most Popular
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#FF4D00] block font-semibold mb-1">Tempo Pro Plan</span>
                  <h3 className="text-2xl font-bold font-sans text-[#1A1714] mt-1">Tempo Pro Engine</h3>
                  <p className="text-xs text-[#7A736B] mt-2">For busy practitioners, startup directors, and operators managing high meeting frequency weekly.</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tighter text-[#1A1714] font-mono">
                    {isAnnual ? "$9" : "$12"}
                  </span>
                  <span className="text-[#7A736B] text-xs font-mono ml-2">per user / month</span>
                </div>

                <ul className="space-y-3.5 text-xs text-[#3D3733] border-t border-[#D4CEC5] pt-6 font-sans">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span className="font-semibold text-black">Unlimited secondary calendar syncs</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>Dynamic protected Heatmaps routing</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>Collision Guard & Instant buffers selection</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>AI peak performance focus protection analytics</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href="#cta"
                  className="w-full text-center py-3 bg-[#FF4D00] text-white hover:bg-[#CC3D00] text-xs font-bold font-mono tracking-wide uppercase rounded-full transition-all inline-block shadow-md shadow-[#FF4D00]/20"
                  onMouseEnter={() => handleMouseEnterElement("clickable")}
                  onMouseLeave={handleMouseLeaveElement}
                >
                  Start free 14-day trial
                </a>
              </div>
            </motion.div>

            {/* Teams Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F2EFE8] border border-[#D4CEC5] p-8 rounded-3xl flex flex-col justify-between hover:border-[#FF4D00] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#7A736B] block font-semibold mb-1">Enterprise Plan</span>
                  <h3 className="text-2xl font-bold font-sans text-[#1A1714] mt-1">Tempo Enterprise</h3>
                  <p className="text-xs text-[#7A736B] mt-2">Designed dynamically for multi-user coordination, agencies, support hubs, and enterprise scale.</p>
                </div>

                <div className="flex items-baseline font-sans">
                  <span className="text-5xl font-extrabold tracking-tighter text-[#1A1714] font-mono">
                    {isAnnual ? "$19" : "$25"}
                  </span>
                  <span className="text-[#7A736B] text-xs font-mono ml-2">per user / month</span>
                </div>

                <ul className="space-y-3.5 text-xs text-[#3D3733] border-t border-[#D4CEC5] pt-6 font-sans">
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span className="font-semibold text-black">Unified team availability overlay maps</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>Round-robin programmatic assign routings</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>SAML, single sign-on & enterprise SOC-2 compliance</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-[#1DB954]" />
                    <span>Dedicated engineer account coordinator support</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href="#cta"
                  className="w-full text-center py-3 border border-[#1A1714] text-[#1A1714] hover:bg-[#1A1714] hover:text-white text-xs font-bold font-mono tracking-wide uppercase rounded-full transition-all inline-block"
                  onMouseEnter={() => handleMouseEnterElement("clickable")}
                  onMouseLeave={handleMouseLeaveElement}
                >
                  Contact sales
                </a>
              </div>
            </motion.div>

          </div>

          {/* Bottom Trust Indicators */}
          <div className="pt-4 text-center">
            <p className="font-mono text-xs text-[#B5AFA8]">
              ✓ No credit card required to test Solo  ·  ✓ Cancel trial anytime with one click  ·  ✓ SOC-2 Type II Certified Secure
            </p>
          </div>

        </div>
      </section>

      {/* 10. TESTIMONIALS (MASONRY GRID WITH MOUSE GRADIENTS) */}
      <section id="testimonials" className="py-24 bg-[#F2EFE8] border-y border-[#D4CEC5]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4D00] block">Client Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1714]">
              Validated by practitioners running on tight schedules.
            </h2>
          </motion.div>

          {/* Genuine Masonry coordinates layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FAFAF7] border border-[#D4CEC5] p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between hover:border-[#FF4D00] transition-colors group cursor-text"
                onMouseEnter={() => handleMouseEnterElement("hoverable")}
                onMouseLeave={handleMouseLeaveElement}
                style={{ minHeight: idx % 3 === 0 ? "280px" : "240px" }}
              >
                {/* Spot glow ambient highlights */}
                <div className="absolute inset-0 radial-spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="text-[#FF4D00] font-mono text-xs">★★★★★</div>
                  <p className="text-sm md:text-base text-[#1A1714] leading-relaxed font-serif italic text-pretty">
                    {/* Inline highlight markup implementation */}
                    {t.quote.split(t.highlight).map((text, sIdx, arr) => (
                      <React.Fragment key={sIdx}>
                        {text}
                        {sIdx < arr.length - 1 && (
                          <span className="text-[#FF4D00] font-sans font-bold not-italic underline decoration-wavy decoration-[#FF4D00]/25">
                            {t.highlight}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#D4CEC5] flex items-center justify-between relative z-10 font-mono">
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1714] font-sans">{t.name}</h4>
                    <span className="text-[10px] text-[#7A736B] tracking-tight">{t.role}</span>
                  </div>
                  <div className="text-[9px] text-[#FF4D00] uppercase font-bold tracking-wider">Verified User</div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. DASHBOARD REVEAL WITH SCROLL 3D PERSPECTIVE */}
      <section id="the-product" className="py-28 md:py-36 bg-[#1A1714] text-[#FAFAF7] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#FF4D00]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4 mx-auto text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4D00] block">The Control Panel</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
              Designed for absolute interface sanity.
            </h2>
            <p className="text-[#8F8A83] text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Every detail optimized to save seconds. The dashboard provides clear administrative HUDs, timezone adjustments, and quick summaries. Scroll downward to tilt page structures.
            </p>
          </motion.div>

          {/* 3D PERSPECTIVE WRAPPER CONTAINER */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center pt-8 pointer-events-none md:pointer-events-auto"
            style={{ perspective: "1200px" }}
          >
            <div
              id="dashboard-frame-tilt"
              ref={dashboardCardRef}
              className="w-full max-w-5xl bg-[#1C1C1A] border border-[#2D2D2A] rounded-3xl p-4 md:p-6 shadow-[0_48px_96px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out flex flex-col justify-between"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transition: "transform 0.15s ease-out"
              }}
            >
              {/* Fake Chrome window frame headers bar */}
              <div className="flex items-center justify-between border-b border-[#2D2D2A] pb-3 mb-4 text-[11px] text-[#8F8A83]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5 matches-dots">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]/30" />
                  </div>
                  <span className="font-semibold text-[#FAFAF7] pl-2">App Interface Preview : Daily Slot Allocator</span>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4 font-mono text-[10px]">
                  <div className="bg-[#1A1714] border border-[#2D2D2A] px-2.5 py-1 rounded text-[#FF4D00] font-medium flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] animate-ping inline-block" />
                    <span>Focus Guardian: Enforced</span>
                  </div>
                </div>
              </div>

              {/* Multi-Panel Dashboard Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-white">
                
                {/* Left sidebar Mock */}
                <div className="md:col-span-3 border-r border-[#2D2D2A]/60 pr-4 space-y-4 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8F8A83] uppercase tracking-wider">Quick Actions</span>
                    </div>
                    
                    {/* Quick navigation elements list */}
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2 bg-[#FF4D00]/15 border border-[#FF4D00]/25 text-[#FF4D00] rounded-lg font-bold flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Core HUD Controller</span>
                      </div>
                      <div className="p-2 hover:bg-[#2D2D2A]/50 transition-colors rounded-lg flex items-center space-x-2 text-[#8F8A83] cursor-pointer">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Shared Bookings</span>
                      </div>
                      <div className="p-2 hover:bg-[#2D2D2A]/50 transition-colors rounded-lg flex items-center space-x-2 text-[#8F8A83] cursor-pointer">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Allocation Links</span>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar digital analog watch */}
                  <div className="bg-[#1A1714] border border-[#2D2D2A] p-3 rounded-xl">
                    <span className="text-[9px] font-mono text-[#8F8A83] uppercase block">Home Coordinate time</span>
                    <span className="text-sm font-bold font-mono text-[#FF4D00] block mt-1 tracking-widest">{analogTime || "10:12:57 AM"}</span>
                    <span className="text-[9px] text-[#B5AFA8] font-mono">May 28, 2026</span>
                  </div>
                </div>

                {/* Center Week appointments Mock */}
                <div className="md:col-span-6 space-y-4 text-left">
                  <div className="flex justify-between items-center bg-[#1A1714] p-2 rounded-xl border border-[#2D2D2A]">
                    <span className="text-xs text-[#8F8A83] font-medium pl-1">Weekly Schedule Preview</span>
                    <span className="text-[10px] font-mono text-white font-bold bg-[#FF4D00] px-2.5 py-0.5 rounded-full">JUNE 2026</span>
                  </div>
 
                  {/* Scheduled mock timeline blocks */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {[
                      { day: "MO 01", title: "Global Sync meeting with Engineering", time: "10:00 - 10:30 UTC", status: "confirmed" },
                      { day: "TU 02", title: "Sarah // Stripe Executive Consult", time: "14:00 - 15:00 UTC", status: "confirmed" },
                      { day: "WE 03", title: "Deep Focus Block (Protected)", time: "09:00 - 12:00 UTC", status: "focus" },
                      { day: "TH 04", title: "Technical architecture roadmap review", time: "16:30 - 17:00 UTC", status: "pending" }
                    ].map((evt, idx) => (
                      <div key={idx} className="bg-[#2D2D2A]/40 border border-[#2D2D2A]/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[#1A1714] border border-[#2D2D2A] p-1 px-2 rounded-lg font-mono text-[9px] font-bold text-[#FF4D00] text-center min-w-[42px]">
                            {evt.day}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white tracking-tight">{evt.title}</h4>
                            <span className="font-mono text-[9px] text-[#8F8A83] block mt-0.5">{evt.time}</span>
                          </div>
                        </div>
 
                        {/* Event tags */}
                        {evt.status === "confirmed" && <span className="bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-[8px] font-mono uppercase font-semibold p-1 px-2 rounded-full">ACTIVE</span>}
                        {evt.status === "focus" && <span className="bg-[#FF4D00]/10 border border-[#FF4D00]/30 text-[#FF4D00] text-[8px] font-mono uppercase font-semibold p-1 px-2 rounded-full">PROTECTED</span>}
                        {evt.status === "pending" && <span className="bg-[#E8E2D9]/10 border border-[#E8E2D9]/30 text-[#E8E2D9] text-[8px] font-mono uppercase font-semibold p-1 px-2 rounded-full">QUEUED</span>}
                      </div>
                    ))}
                  </div>
                </div>
 
                {/* Right Interactive AI Suggestions Panel */}
                <div className="md:col-span-3 space-y-4 text-left">
                  <span className="text-xs uppercase tracking-wider text-[#8F8A83] font-semibold block">Smart Suggestions</span>
                  
                  {/* Smart dynamic recommendation list */}
                  <div className="space-y-2">
                    {[
                      { text: "Shift standup invitation forward 15m to resolve calendar collision.", action: "ADJUST" },
                      { text: "Auto-reserve tomorrow morning block for deep creative writing.", action: "RESERVE" },
                      { text: "Apply a 15-minute buffer after your upcoming client consult.", action: "BUFFER" }
                    ].map((rec, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-[#1F1F1D] border border-[#2D2D2A] rounded-xl flex flex-col justify-between hover:bg-[#FF4D00]/5 hover:border-[#FF4D00]/40 transition-colors group cursor-pointer"
                        onMouseEnter={() => handleMouseEnterElement("hoverable")}
                        onMouseLeave={handleMouseLeaveElement}
                      >
                        <p className="text-xs text-[#8F8A83] leading-relaxed group-hover:text-white transition-colors">{rec.text}</p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#2D2D2A]/60">
                          <span className="bg-[#FF4D00]/15 text-[#FF4D00] text-[8px] font-mono uppercase font-bold p-0.5 px-1.5 rounded">{rec.action}</span>
                          <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">Apply →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 12. CTA SECTION (FULL BURNT ORANGE VIEWPORT WITH ELECTRIC BOUNDARY EFFECTS) */}
      <section id="cta" className="min-h-screen bg-[#FF4D00] text-[#FAFAF7] relative flex flex-col justify-between overflow-hidden py-16 pointer-events-auto">
        
        {/* Particle / Shader visual vector loops */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=1200')] bg-repeat select-none pointer-events-none" />

        {/* Ambient white glowing radial spotlight under variables */}
        <div className="absolute inset-0 radial-spotlight-white pointer-events-none opacity-[0.4]" />

        {/* Top spacer */}
        <div className="max-w-7xl mx-auto px-6 pt-12 self-start">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] block text-white">Optimize Your Time Today</span>
        </div>

        {/* Giant Typographic Center block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 text-center select-none space-y-8 z-10"
        >
          <h2 className="text-6xl sm:text-[8rem] md:text-[11rem] font-black tracking-tighter leading-[0.8] font-sans text-white text-pretty select-none uppercase">
            YOUR <br />
            <span className="font-serif italic font-light lowercase">schedule,</span> <br />
            MASTERED.
          </h2>

          <p className="text-base sm:text-lg text-white/80 font-medium max-w-md mx-auto leading-relaxed">
            Connect existing calendar accounts, deploy unique URL configurations, and align availability indices instantly. Zero fee obligations active.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => window.location.href = "#cta"}
              className="w-full sm:w-auto px-10 py-5 bg-[#FAFAF7] text-[#FF4D00] hover:text-[#CC3D00] text-sm font-bold tracking-tight rounded-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-center uppercase"
              onMouseEnter={() => handleMouseEnterElement("clickable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              Configure account instantly
            </button>
            <button 
              onClick={() => window.location.href = "#how-it-works"}
              className="w-full sm:w-auto px-8 py-5 border border-white/40 text-white hover:bg-white/10 text-xs font-mono font-semibold tracking-wide uppercase rounded-full transition-all text-center"
              onMouseEnter={() => handleMouseEnterElement("clickable")}
              onMouseLeave={handleMouseLeaveElement}
            >
              Analyze Step Guidelines
            </button>
          </div>
        </motion.div>

        {/* Dynamic Trust footer elements inside CTA */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <span className="font-mono text-[10px] text-white/50 uppercase">Tempo Scheduling Platform v1.1 Core</span>
          <span className="font-mono text-[10px] text-white/50 uppercase">★★★★★ Unified 4.9/5 Rating Certified</span>
          <span className="font-mono text-[10px] text-white/50 uppercase">SOC-2 Security Compliances</span>
        </div>

      </section>

      {/* 13. WARM EDITORIAL FOOTER */}
      <footer className="bg-[#1A1714] text-[#FAFAF7] pt-20 border-t border-[#2D2D2A] relative overflow-hidden">
        
        {/* Large horizontally moving TEMPO text backdrop element */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[20%] select-none opacity-5 pointer-events-none">
          <span className="text-[16rem] md:text-[24rem] font-extrabold tracking-tighter text-[#FFF] block text-center font-sans">TEMPO</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10 pb-12">
          
          {/* Top Newsletter row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#2D2D2A]">
            
            {/* Wordmark logo & description */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-[#FF4D00]">◫</span>
                <span className="text-xl font-extrabold tracking-tight">TEMPO</span>
              </div>
              <p className="text-xs md:text-sm text-[#8F8A83] max-w-md leading-relaxed">
                Your time, finally intelligent. Standardize availability models, eliminate dynamic collision, and meet optimally without friction.
              </p>
            </div>

            {/* Subscriptions signup newsletter block */}
            <div className="lg:col-span-6 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF4D00] block text-left">Newsletter for busy operators</span>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <input 
                  type="email" 
                  placeholder="Enter secure email coordinate..." 
                  className="w-full bg-[#2D2D2A] border border-[#3D3733]/60 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FF4D00] font-mono text-left"
                />
                <button 
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#FF4D00] text-white text-xs font-bold font-mono tracking-tight rounded-xl hover:bg-[#CC3D00] transition-colors uppercase whitespace-nowrap"
                  onMouseEnter={() => handleMouseEnterElement("clickable")}
                  onMouseLeave={handleMouseLeaveElement}
                >
                  Join List
                </button>
              </div>
            </div>

          </div>

          {/* Grid columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8F8A83] mb-4">PRODUCT CORE</h4>
              <ul className="space-y-2.5 text-xs text-[#8F8A83]">
                <li><a href="#features" className="hover:text-[#FF4D00] transition-colors">Heatmaps Controller</a></li>
                <li><a href="#features" className="hover:text-[#FF4D00] transition-colors">Collision Guard</a></li>
                <li><a href="#integrations" className="hover:text-[#FF4D00] transition-colors">Ecosystem Integrations</a></li>
                <li><a href="#pricing" className="hover:text-[#FF4D00] transition-colors">Enterprise Systems</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8F8A83] mb-4">COMPANY LIFE</h4>
              <ul className="space-y-2.5 text-xs text-[#8F8A83]">
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">About Story</a></li>
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Engineers Changelog</a></li>
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Support Channels</a></li>
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Studio Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8F8A83] mb-4">SECURITY PORTAL</h4>
              <ul className="space-y-2.5 text-xs text-[#8F8A83]">
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Security Overview</a></li>
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Privacy Principles</a></li>
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Terms of Use Map</a></li>
                <li><a href="#" className="hover:text-[#FF4D00] transition-colors">Compliance Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8F8A83] mb-4">COORDINATE LINKS</h4>
              <ul className="space-y-2.5 text-xs text-[#8F8A83]">
                <li><a href="https://twitter.com" target="_blank" className="hover:text-[#FF4D00] transition-colors">Twitter (X) Hub</a></li>
                <li><a href="https://linkedin.com" target="_blank" className="hover:text-[#FF4D00] transition-colors">LinkedIn Directory</a></li>
                <li><a href="https://github.com" target="_blank" className="hover:text-[#FF4D00] transition-colors">GitHub Repository</a></li>
                <li><a href="https://loom.com" target="_blank" className="hover:text-[#FF4D00] transition-colors">Loom Presentations</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom attribution block */}
          <div className="pt-8 border-t border-[#2D2D2A]/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#8F8A83]">
            <span>© 2026 TEMPO CALENDAR SAAS INC. ALL RIGHTS REGISTERED SECURITY CODES ENABLED.</span>
            <span className="text-white flex items-center space-x-1">
              <span>MADE WITH PRISTINE SWISS CONVENTIONS FOR YOUR FOCUS ◫</span>
            </span>
          </div>

        </div>

      </footer>

    </div>
  );
}

// Custom mouse move event interface for TypeScript types safety
interface MouseMoveEvent {
  clientX: number;
  clientY: number;
}
