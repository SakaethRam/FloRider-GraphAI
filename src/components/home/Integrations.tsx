import { motion } from 'framer-motion';
import {
  Layers,
  Instagram,
  Slack,
  Figma,
  Github,
  Twitter,
  Facebook,
  Linkedin,
  Globe,
  Pen,
  Puzzle,
  Code,
  Zap,
  BarChart3,
  FileText,
} from 'lucide-react';

const icons = [
  [Slack, Figma, Twitter, Facebook, Pen],
  [Github, Code, Layers, Instagram, Globe, Linkedin],
  [Zap, FileText, Puzzle, BarChart3, Slack],
];

const Integrations = () => (
  <section className="py-24 lg:py-32 border-t border-border">
    <div className="container mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Puzzle size={14} />
          <span className="uppercase tracking-widest text-xs font-medium">Integrations</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          Seamless <span className="italic font-light">Integrations</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Interact with all your favorite software without unnecessary fuss
        </p>
      </motion.div>

      {/* Icon grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto"
      >
        <div className="rounded-2xl border border-border bg-card/50 p-8 space-y-4">
          {icons.map((row, ri) => (
            <div key={ri} className="flex items-center justify-center gap-4 flex-wrap">
              {row.map((Icon, ci) => (
                <motion.div
                  key={`${ri}-${ci}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: ri * 0.06 + ci * 0.03 }}
                  className="w-12 h-12 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200 active:scale-[0.96]"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 italic">
          "Our AI automation plugs into your stack to create a unified, intelligent workflow"
        </p>
      </motion.div>
    </div>
  </section>
);

export default Integrations;
