import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Mesh / radial background at bottom */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[60%]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%, hsl(30 40% 88% / 0.7) 0%, transparent 70%)',
          }}
        />
        {/* Concentric grid lines */}
        <svg
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[50%] opacity-[0.18]"
          viewBox="0 0 1200 500"
          fill="none"
          preserveAspectRatio="none"
        >
          {[...Array(12)].map((_, i) => (
            <ellipse
              key={i}
              cx="600"
              cy="500"
              rx={120 + i * 80}
              ry={40 + i * 35}
              stroke="hsl(24 60% 55%)"
              strokeWidth="0.6"
            />
          ))}
          {[...Array(24)].map((_, i) => {
            const angle = (i * Math.PI) / 24;
            const x2 = 600 + Math.cos(angle) * 1100;
            const y2 = 500 - Math.sin(angle) * 500;
            return (
              <line
                key={`r-${i}`}
                x1="600"
                y1="500"
                x2={x2}
                y2={y2}
                stroke="hsl(24 60% 55%)"
                strokeWidth="0.4"
              />
            );
          })}
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-popover text-sm text-muted-foreground mb-8"
        >
          <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wide">
            New
          </span>
          Now with brand new AI integration
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance mb-6"
        >
          All your work pulled
          <br />
          into one powerful place
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-muted-foreground max-w-lg text-pretty mb-10 leading-relaxed"
        >
          Organize tasks and projects in one connected, accessible platform.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate('/chat')}
          className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium text-base transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
        >
          Get started
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
