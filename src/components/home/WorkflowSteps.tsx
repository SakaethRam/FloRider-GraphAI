import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, GitBranch, MessageSquare, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Ingest & Unify',
    description:
      'We connect to your existing data sources — orders, deliveries, invoices, and payments — and unify them into a single source of truth.',
    visual: 'ingest',
  },
  {
    icon: GitBranch,
    title: 'Design & Implement',
    description:
      'We create tailored AI workflows that align with your goals. Our team builds, tests, and deploys smart systems that integrate into your operations seamlessly.',
    visual: 'build',
  },
  {
    icon: MessageSquare,
    title: 'Ask Questions',
    description:
      'Use natural language to query your data — no SQL required. Our AI translates intent into precise graph queries automatically.',
    visual: 'ask',
  },
];

/* Fake chart bars for the visual panel */
const ChartBars = () => {
  const bars = [62, 45, 78, 55, 90, 68, 82, 50, 72, 60];
  return (
    <div className="bg-card rounded-xl p-4 border border-border w-full max-w-[260px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-foreground">Activity</span>
        <span className="text-xs text-muted-foreground">Month</span>
      </div>
      <div className="flex items-end gap-1 h-20">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm bg-muted-foreground/20"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 border-t border-border pt-3">
        <div>
          <span className="text-xs text-muted-foreground">● Users</span>
          <p className="text-sm font-semibold text-foreground">3,6K</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">● Clicks</span>
          <p className="text-sm font-semibold text-foreground">2m</p>
        </div>
      </div>
    </div>
  );
};

/* Fake code block for visual panel */
const CodeBlock = () => (
  <div className="bg-card rounded-xl p-4 border border-border w-full max-w-[360px] font-mono text-xs text-muted-foreground leading-relaxed overflow-hidden">
    <p className="text-foreground/50 mb-1">{'// Build & Implement ->'}</p>
    <p>&nbsp;</p>
    <p>
      <span className="text-accent">async function</span>{' '}
      <span className="text-foreground">generateResponse</span>(prompt) {'{'}
    </p>
    <p>
      &nbsp;&nbsp;<span className="text-accent">const</span> response ={' '}
      <span className="text-accent">await</span> fetch(
      <span className="text-foreground/70">'https://api.openai…'</span>
      );
    </p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;method: 'POST',</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;headers: {'{'}</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json',</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer YOUR_API_KEY'</p>
    <p>&nbsp;&nbsp;&nbsp;&nbsp;{'}'},</p>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify({'{'} model: 'gpt-4',
    </p>
  </div>
);

const StepVisual = ({ step }: { step: number }) => (
  <div className="flex flex-col items-start gap-3 w-full">
    <ChartBars />
    <CodeBlock />
  </div>
);

const WorkflowSteps = () => {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % steps.length);
  }, []);

  useEffect(() => {
    if (hovering) return;
    const id = setInterval(next, 3500);
    return () => clearInterval(id);
  }, [hovering, next]);

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Database size={14} />
            <span className="uppercase tracking-widest text-xs font-medium">Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Our Simple & <span className="italic font-light">Smart Process</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything you need to collaborate, create, and scale, all in one place.
          </p>
        </motion.div>

        {/* Step tabs */}
        <div
          className="grid grid-cols-3 gap-2 mb-12"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {steps.map((step, i) => {
            const isActive = i === active;
            return (
              <button
                key={step.title}
                onClick={() => setActive(i)}
                className={`relative py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 border ${
                  isActive
                    ? 'bg-card border-border text-foreground'
                    : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                STEP {i + 1}
                {isActive && !hovering && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-accent rounded-b-lg"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3.5, ease: 'linear' }}
                    key={`progress-${active}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left: visual */}
            <div className="hidden lg:block">
              <StepVisual step={active} />
            </div>

            {/* Right: text */}
            <div className="flex flex-col justify-center">
              <span className="text-sm text-muted-foreground mb-2">
                {String(active + 1).padStart(2, '0')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                {steps[active].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                {steps[active].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkflowSteps;
