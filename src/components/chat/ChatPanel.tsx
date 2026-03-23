import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown, Bot } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  query?: string;
}

const mockMessages: Message[] = [
  { id: 1, role: 'user', text: 'Show me all orders linked to delayed deliveries in Q4.' },
  {
    id: 2,
    role: 'ai',
    text: 'I found 23 orders linked to delayed deliveries in Q4 2024. The primary bottleneck appears to be the Midwest distribution hub, accounting for 61% of delays.',
    query: 'MATCH (o:Order)-[:HAS_DELIVERY]->(d:Delivery)\nWHERE d.status = "delayed"\n  AND d.date >= date("2024-10-01")\nRETURN o, d\nORDER BY d.delay_days DESC',
  },
  { id: 3, role: 'user', text: 'Which vendors supplied those delayed orders?' },
  {
    id: 4,
    role: 'ai',
    text: 'Three vendors are involved: Acme Parts (12 orders), GlobalShip Co (7 orders), and Meridian Supply (4 orders). Acme Parts has the highest average delay of 8.3 days.',
  },
];

const ChatPanel = () => {
  const [messages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');
  const [expandedQuery, setExpandedQuery] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full border-l border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-6 rounded-md bg-primary/15 text-primary flex items-center justify-center">
            <Bot size={14} />
          </div>
          <h2 className="font-medium text-sm">Chat with Graph</h2>
        </div>
        <p className="text-xs text-muted-foreground ml-8">Order to Cash · Graph Agent</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}
              >
                <p>{msg.text}</p>

                {msg.query && (
                  <div className="mt-2">
                    <button
                      onClick={() => setExpandedQuery(expandedQuery === msg.id ? null : msg.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${expandedQuery === msg.id ? 'rotate-180' : ''}`}
                      />
                      Query Inspector
                    </button>
                    <AnimatePresence>
                      {expandedQuery === msg.id && (
                        <motion.pre
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-2 p-2.5 rounded-md bg-background text-xs text-muted-foreground font-mono overflow-x-auto border border-border"
                        >
                          {msg.query}
                        </motion.pre>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Status */}
      <div className="px-4 py-1.5">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          Agent is awaiting instructions
        </span>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analyze anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="p-1.5 rounded-md bg-primary text-primary-foreground hover:brightness-110 transition-all active:scale-95">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
