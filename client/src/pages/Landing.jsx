import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Subtle floating dot animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const dots = Array.from({ length: 38 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.3 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 60, 20, ${d.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.root}>
      {/* Animated dot canvas background */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Top nav bar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <img src="/logo.png" alt="NMIMS Logo" style={styles.logo}
            onError={e => { e.target.style.display = 'none'; }} />
          <nav style={styles.nav}>
            <button onClick={() => navigate('/login')} style={styles.navBtn}>Login</button>
            <button onClick={() => navigate('/signup')} style={styles.navBtnAccent}>Sign Up</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main style={styles.hero}>
        <div style={styles.badge}>Academic Portal — 2024–2025</div>

        <h1 style={styles.h1}>
          Mukesh Patel School of<br />
          <span style={styles.h1Accent}>Technology Management</span><br />
          &amp; Engineering
        </h1>

        <p style={styles.sub}>
          A unified digital portal for students, faculty, and administration.<br />
          Attendance, results, timetables, tickets — all in one place.
        </p>

        <button
          onClick={() => navigate('/login')}
          style={styles.cta}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(14,165,233,0.30)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,0.20)';
          }}
        >
          Get Started →
        </button>

        <p style={styles.hint}>Students · Faculty · Administrators</p>
      </main>

      {/* Feature chips */}
      <div style={styles.chips}>
        {[
          '📋 Attendance Tracker',
          '📊 Exam Results',
          '📅 Academic Calendar',
          '💳 Fee Status',
          '🎫 Help Desk',
          '📁 Resources',
        ].map(f => (
          <span key={f} style={styles.chip}>{f}</span>
        ))}
      </div>

      {/* New Interactive Scroll Section */}
      <section style={styles.featuresSection}>
        <div className="reveal-on-scroll" style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Everything you need to succeed</h2>
          <p style={styles.sectionSub}>A modernized platform built to enhance academic performance.</p>
        </div>
        
        <div style={styles.grid}>
          {[
            { title: "Real-time Attendance", desc: "Track your presence vividly with our interactive UI.", icon: "📅", delay: "" },
            { title: "Instant Ticketing", desc: "Raise issues and track resolutions effortlessly.", icon: "🎫", delay: "delay-100" },
            { title: "Centralized Results", desc: "View ICA, Term End, and internal marks the moment they are available.", icon: "📊", delay: "delay-200" },
          ].map((item, i) => (
            <div key={i} className={`reveal-on-scroll interactive-card-element ${item.delay}`} style={styles.card}>
              <div style={styles.cardIcon}>{item.icon}</div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Basic Footer */}
      <footer style={styles.footer}>
        <p>© 2024–2025 Mukesh Patel School of Technology Management & Engineering.</p>
      </footer>
    </div>
  );
};

const CREAM_BG   = '#F0E8D6';
const CREAM_SURF = '#FAF4EA';
const CREAM_DEEP = '#E5D9C5';
const BORDER     = '#C4A87E';
const TEXT_DARK  = '#1A1208';
const TEXT_MID   = '#5C4A2A';
const ACCENT     = '#0EA5E9';

const styles = {
  root: {
    minHeight: '100vh',
    backgroundColor: CREAM_BG,
    backgroundImage: 'radial-gradient(circle, rgba(90,60,20,0.07) 1px, transparent 1px)',
    backgroundSize: '22px 22px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  canvas: {
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    width: '100%',
    backgroundColor: CREAM_SURF,
    borderBottom: `1px solid ${BORDER}`,
    position: 'relative',
    zIndex: 10,
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.85rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    height: '48px',
    width: 'auto',
    objectFit: 'contain',
  },
  nav: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  navBtn: {
    padding: '0.45rem 1.1rem',
    background: 'transparent',
    border: `1px solid ${BORDER}`,
    borderRadius: '8px',
    color: TEXT_MID,
    fontWeight: 500,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    fontFamily: 'inherit',
  },
  navBtnAccent: {
    padding: '0.45rem 1.1rem',
    background: ACCENT,
    border: '1px solid transparent',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    fontFamily: 'inherit',
  },
  hero: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '5rem 2rem 3rem',
    position: 'relative',
    zIndex: 5,
    maxWidth: '820px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    padding: '0.3rem 1rem',
    background: CREAM_DEEP,
    border: `1px solid ${BORDER}`,
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: TEXT_MID,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '2rem',
  },
  h1: {
    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: TEXT_DARK,
    margin: '0 0 1.5rem',
  },
  h1Accent: {
    color: ACCENT,
  },
  sub: {
    fontSize: '1.05rem',
    lineHeight: 1.75,
    color: TEXT_MID,
    maxWidth: '580px',
    margin: '0 auto 2.5rem',
  },
  cta: {
    padding: '0.9rem 2.4rem',
    background: ACCENT,
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    boxShadow: '0 4px 16px rgba(14,165,233,0.20)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    fontFamily: 'inherit',
    marginBottom: '1.2rem',
  },
  hint: {
    fontSize: '0.78rem',
    color: TEXT_MID,
    opacity: 0.65,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.6rem',
    justifyContent: 'center',
    padding: '2rem 2rem 3rem',
    position: 'relative',
    zIndex: 5,
  },
  chip: {
    padding: '0.4rem 1rem',
    backgroundColor: CREAM_SURF,
    border: `1px solid ${BORDER}`,
    borderRadius: '999px',
    fontSize: '0.82rem',
    fontWeight: 500,
    color: TEXT_MID,
  },
  featuresSection: {
    width: '100%',
    padding: '4rem 2rem 6rem',
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
    fontWeight: 800,
    color: TEXT_DARK,
    letterSpacing: '-0.02em',
    margin: '0 0 1rem',
  },
  sectionSub: {
    fontSize: '1.05rem',
    color: TEXT_MID,
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1000px',
  },
  card: {
    backgroundColor: CREAM_SURF,
    border: `1px solid ${BORDER}`,
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
  },
  cardIcon: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: TEXT_DARK,
    marginBottom: '0.75rem',
    letterSpacing: '-0.01em',
  },
  cardDesc: {
    fontSize: '0.95rem',
    color: TEXT_MID,
    lineHeight: 1.6,
  },
  footer: {
    width: '100%',
    padding: '2rem',
    textAlign: 'center',
    borderTop: `1px solid ${BORDER}`,
    position: 'relative',
    zIndex: 10,
    backgroundColor: CREAM_BG,
    fontSize: '0.85rem',
    color: TEXT_MID,
  }
};

export default Landing;
