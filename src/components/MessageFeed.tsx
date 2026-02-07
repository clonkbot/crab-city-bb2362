import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface MessageFeedProps {
  onClose: () => void;
}

export function MessageFeed({ onClose }: MessageFeedProps) {
  const history = useQuery(api.messages.getHistory);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a1628]/95 backdrop-blur-md border-l border-[#4ECDC4]/20 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4ECDC4]/20">
          <h2 className="font-silkscreen text-[#4ECDC4] text-lg flex items-center gap-2">
            <span>💬</span> MESSAGE FEED
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history === undefined ? (
            <div className="text-center py-8">
              <div className="text-3xl animate-bounce">🦀</div>
              <p className="font-dm text-[#95E1D3]/50 mt-2 text-sm">Loading...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🦐</div>
              <p className="font-dm text-[#95E1D3]/50 text-sm">
                No messages yet. Be the first to speak!
              </p>
            </div>
          ) : (
            history.map((msg: Doc<"messages">) => (
              <div
                key={msg._id}
                className="bg-[#1a2f4a]/60 rounded-xl p-3 border border-[#4ECDC4]/10 hover:border-[#4ECDC4]/30 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">🦀</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-silkscreen text-[#4ECDC4] text-xs truncate">
                        {msg.handle}
                      </span>
                      <span className="font-dm text-[#95E1D3]/40 text-[10px] flex-shrink-0">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="font-dm text-white/90 text-sm leading-relaxed break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#4ECDC4]/20 text-center">
          <p className="font-dm text-[#95E1D3]/40 text-xs">
            Last 100 messages • Updates in real-time
          </p>
        </div>
      </div>
    </>
  );
}
