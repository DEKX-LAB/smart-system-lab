export function WorkflowVisual({ className = "" }: { className?: string }) {
  // Nodes positioned in a connected flow
  const nodes = [
    { x: 40, y: 60, label: "Trigger" },
    { x: 160, y: 30, label: "AI" },
    { x: 160, y: 130, label: "DB" },
    { x: 290, y: 80, label: "WhatsApp" },
    { x: 410, y: 40, label: "Alert" },
    { x: 410, y: 140, label: "Log" },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5],
  ];

  return (
    <svg
      viewBox="0 0 460 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.58 0.21 274)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="oklch(0.58 0.21 274)" stopOpacity="1" />
          <stop offset="100%" stopColor="oklch(0.58 0.21 274)" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="oklch(0.58 0.21 274)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.58 0.21 274)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {edges.map(([a, b], i) => {
        const n1 = nodes[a], n2 = nodes[b];
        return (
          <line
            key={i}
            x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
            stroke="url(#edge)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            style={{
              animation: `flow-line 3s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        );
      })}

      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="22" fill="url(#nodeGlow)" />
          <circle
            cx={n.x} cy={n.y} r="6"
            fill="oklch(0.58 0.21 274)"
            style={{
              transformOrigin: `${n.x}px ${n.y}px`,
              animation: `pulse-dot 2.4s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
          <circle
            cx={n.x} cy={n.y} r="9"
            fill="none"
            stroke="oklch(0.95 0.012 90)"
            strokeOpacity="0.15"
          />
          <text
            x={n.x} y={n.y + 28}
            textAnchor="middle"
            fontSize="9"
            fontFamily="Inter, sans-serif"
            fill="oklch(0.66 0.012 260)"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
