import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const [view, setView] = useState<'graph' | 'table'>('graph');
  const navigate = useNavigate();

  return (
    <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <button onClick={() => navigate('/home')} className="hover:text-foreground transition-colors">Home</button>
        <ChevronRight size={14} />
        <span>Mapping</span>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">Order to Cash</span>
      </div>

      <div className="flex items-center bg-secondary rounded-lg p-0.5 text-sm">
        {(['graph', 'table'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded-md capitalize transition-all duration-200 ${
              view === v
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === 'graph' ? 'Graph View' : 'Table View'}
          </button>
        ))}
      </div>
    </header>
  );
};

export default TopNav;
