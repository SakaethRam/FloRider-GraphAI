import { motion } from 'framer-motion';
import { Network, MessageCircle, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Network,
    title: 'Graph Visualization',
    description: 'Explore your data as an interactive network of entities and relationships. See connections that tables hide.',
  },
  {
    icon: MessageCircle,
    title: 'Natural Language Querying',
    description: 'Ask questions in plain English. Our AI translates intent into precise graph queries automatically.',
  },
  {
    icon: ShieldCheck,
    title: 'Data Integrity & Guardrails',
    description: 'Built-in validation ensures query accuracy. Every answer is traceable back to its source data.',
  },
];

const Features = () => (
  <section className="py-24 lg:py-32 border-t border-border">
    <div className="container mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">Built for Data Teams</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Every feature designed to reduce time-to-insight.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <Icon size={20} />
              </div>
              <h3 className="font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Features;
