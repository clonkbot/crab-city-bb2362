import { Doc } from "../../convex/_generated/dataModel";

interface CrabProps {
  crab: Doc<"crabs">;
  isMe: boolean;
}

export function Crab({ crab, isMe }: CrabProps) {
  return (
    <div
      className="crab absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{
        left: `${crab.positionX}%`,
        top: `${crab.positionY}%`,
      }}
    >
      {/* Crab emoji with color tint overlay */}
      <div className="relative">
        <span
          className="text-3xl md:text-4xl block"
          style={{
            filter: isMe ? 'none' : `drop-shadow(0 0 8px ${crab.color})`,
          }}
        >
          🦀
        </span>

        {/* Glow effect for my crab */}
        {isMe && (
          <div
            className="absolute inset-0 rounded-full blur-md opacity-50 -z-10"
            style={{
              background: `radial-gradient(circle, ${crab.color} 0%, transparent 70%)`,
              transform: 'scale(2)',
            }}
          />
        )}
      </div>

      {/* Handle tooltip */}
      <div
        className={`
          absolute left-1/2 transform -translate-x-1/2
          px-2 py-0.5 rounded-full text-[10px] md:text-xs font-dm whitespace-nowrap
          transition-all duration-200
          ${isMe
            ? 'bottom-full mb-1 opacity-100'
            : 'top-full mt-1 opacity-0 group-hover:opacity-100'
          }
        `}
        style={{
          backgroundColor: isMe ? crab.color : '#1a2f4a',
          color: isMe ? '#0a1628' : '#95E1D3',
          border: isMe ? 'none' : '1px solid rgba(78, 205, 196, 0.3)',
        }}
      >
        {isMe ? '👆 YOU' : crab.handle}
      </div>
    </div>
  );
}
