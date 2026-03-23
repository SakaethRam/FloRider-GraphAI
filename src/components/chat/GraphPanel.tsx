import { useEffect, useRef } from 'react';
import { Minimize2, Layers } from 'lucide-react';

interface GNode {
  x: number; y: number; vx: number; vy: number; r: number; label: string;
}

const labels = ['Order', 'Invoice', 'Payment', 'Delivery', 'Customer', 'Product', 'Shipment', 'Vendor'];

const GraphPanel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GNode[]>([]);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    nodesRef.current = labels.map((label) => ({
      x: 80 + Math.random() * (w - 160),
      y: 80 + Math.random() * (h - 160),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 18 + Math.random() * 8,
      label,
    }));

    const edges = [
      [0,1],[0,3],[1,2],[2,4],[3,5],[4,5],[0,4],[5,6],[6,7],[1,7]
    ];

    const draw = () => {
      ctx.save();
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;

      // Edges
      for (const [a, b] of edges) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }

      // Nodes
      for (const node of nodes) {
        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.04)';
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 15, 20, 0.9)';
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = 'rgba(200, 210, 230, 0.8)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);

        // Move
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 40 || node.x > w - 40) node.vx *= -1;
        if (node.y < 40 || node.y > h - 40) node.vy *= -1;
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative flex-1 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--glow-blue)/0.04),transparent_60%)]" />

      {/* Controls */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Minimize2 size={12} /> Minimize
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Layers size={12} /> Overlay
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default GraphPanel;
