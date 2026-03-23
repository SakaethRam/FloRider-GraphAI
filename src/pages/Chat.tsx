import { useState } from 'react';
import TopNav from '@/components/chat/TopNav';
import GraphPanel from '@/components/chat/GraphPanel';
import ChatPanel from '@/components/chat/ChatPanel';
import Footer from '@/components/shared/Footer';
import { MessageSquare, Network } from 'lucide-react';

const Chat = () => {
  const [mobileView, setMobileView] = useState<'graph' | 'chat'>('chat');

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopNav />

      {/* Mobile toggle */}
      <div className="flex lg:hidden border-b border-border">
        {(['graph', 'chat'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm transition-colors ${
              mobileView === v ? 'text-foreground bg-secondary' : 'text-muted-foreground'
            }`}
          >
            {v === 'graph' ? <Network size={14} /> : <MessageSquare size={14} />}
            {v === 'graph' ? 'Graph' : 'Chat'}
          </button>
        ))}
      </div>

      {/* Desktop split */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`${mobileView === 'graph' ? 'flex' : 'hidden'} lg:flex lg:w-[60%] flex-1 lg:flex-none`}>
          <GraphPanel />
        </div>
        <div className={`${mobileView === 'chat' ? 'flex' : 'hidden'} lg:flex lg:w-[40%] flex-1 lg:flex-none flex-col`}>
          <ChatPanel />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;
