import { Doc } from "../../convex/_generated/dataModel";

interface MessageBubbleProps {
  message: Doc<"messages">;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const age = Date.now() - message.createdAt;
  const opacity = Math.max(0.3, 1 - (age / 30000));

  return (
    <div
      className="message-bubble absolute transform -translate-x-1/2 pointer-events-none"
      style={{
        left: `${message.positionX}%`,
        top: `${Math.max(5, message.positionY - 12)}%`,
        opacity,
        maxWidth: 'min(250px, 70vw)',
      }}
    >
      <div className="speech-bubble px-3 md:px-4 py-2 md:py-3">
        <p className="font-dm text-[#0a1628] text-xs md:text-sm leading-relaxed break-words">
          {message.text}
        </p>
        <p className="font-silkscreen text-[#4ECDC4] text-[9px] md:text-[10px] mt-1 opacity-70">
          — {message.handle}
        </p>
      </div>
    </div>
  );
}
