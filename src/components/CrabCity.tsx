import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Crab } from "./Crab";
import { MessageBubble } from "./MessageBubble";
import { MessageFeed } from "./MessageFeed";

export function CrabCity() {
  const { signOut } = useAuthActions();
  const myCrab = useQuery(api.crabs.getMyCrab);
  const activeCrabs = useQuery(api.crabs.getActiveCrabs);
  const recentMessages = useQuery(api.messages.getRecentMessages);

  const getOrCreateCrab = useMutation(api.crabs.getOrCreateMyCrab);
  const updatePosition = useMutation(api.crabs.updatePosition);
  const postMessage = useMutation(api.messages.post);

  const [message, setMessage] = useState("");
  const [showFeed, setShowFeed] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Initialize crab on mount
  useEffect(() => {
    getOrCreateCrab();
  }, [getOrCreateCrab]);

  // Update position periodically to stay "active"
  useEffect(() => {
    if (!myCrab) return;

    const interval = setInterval(() => {
      updatePosition({ x: myCrab.positionX, y: myCrab.positionY });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [myCrab, updatePosition]);

  const handleCityClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cityRef.current || !myCrab) return;
    if ((e.target as HTMLElement).closest('button, input, form')) return;

    const rect = cityRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp to reasonable bounds
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(10, Math.min(85, y));

    updatePosition({ x: clampedX, y: clampedY });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await postMessage({ text: message.trim() });
    setMessage("");
  };

  return (
    <div className="min-h-[100dvh] ocean-bg relative overflow-hidden">
      {/* Animated bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 15}px`,
              height: `${8 + Math.random() * 15}px`,
              animationDuration: `${10 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/80 backdrop-blur-md border-b border-[#4ECDC4]/20">
        <div className="flex items-center justify-between px-3 md:px-6 py-3">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">🦀</span>
            <h1 className="font-silkscreen text-base md:text-xl text-[#4ECDC4]">CRAB CITY</h1>
          </div>

          {myCrab && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a2f4a] rounded-full border border-[#4ECDC4]/30">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: myCrab.color }}
              />
              <span className="font-dm text-sm text-[#95E1D3]">
                {myCrab.handle}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFeed(!showFeed)}
              className="p-2 md:px-3 md:py-1.5 text-[#FFE66D] hover:bg-[#FFE66D]/10 rounded-lg transition-colors font-dm text-sm flex items-center gap-1"
            >
              <span className="text-lg">💬</span>
              <span className="hidden md:inline">Feed</span>
            </button>
            <button
              onClick={() => signOut()}
              className="p-2 md:px-3 md:py-1.5 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors font-dm text-sm"
            >
              <span className="md:hidden">🚪</span>
              <span className="hidden md:inline">Leave</span>
            </button>
          </div>
        </div>
      </header>

      {/* City Area */}
      <div
        ref={cityRef}
        onClick={handleCityClick}
        className="absolute inset-0 pt-16 pb-24 cursor-crosshair"
        style={{ minHeight: '100dvh' }}
      >
        {/* City buildings silhouette at bottom */}
        <div className="absolute bottom-20 left-0 right-0 h-40 md:h-60 city-silhouette bg-[#0a1628]/90 pointer-events-none" />

        {/* Neon signs */}
        <div className="absolute top-20 md:top-24 left-4 md:left-8 font-silkscreen text-[#FF6B6B] text-xs md:text-sm neon-text opacity-60">
          CORAL CAFE
        </div>
        <div className="absolute top-32 md:top-40 right-4 md:right-12 font-silkscreen text-[#4ECDC4] text-xs md:text-sm neon-text opacity-60">
          KELP BAR
        </div>
        <div className="absolute bottom-40 md:bottom-48 left-1/4 font-silkscreen text-[#FFE66D] text-xs neon-text opacity-50">
          SHELL SHOP
        </div>

        {/* Active crabs */}
        {activeCrabs?.map((crab: Doc<"crabs">) => (
          <Crab
            key={crab._id}
            crab={crab}
            isMe={crab._id === myCrab?._id}
          />
        ))}

        {/* Message bubbles */}
        {recentMessages?.map((msg: Doc<"messages">) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}

        {/* Instructions */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
          <p className="font-dm text-[#95E1D3]/50 text-xs md:text-sm">
            Click anywhere to move · Type below to speak
          </p>
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628]/90 backdrop-blur-md border-t border-[#4ECDC4]/20 p-3 md:p-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2 md:gap-3">
          {myCrab && (
            <div className="sm:hidden flex items-center gap-1 px-2 py-1 bg-[#1a2f4a] rounded-lg border border-[#4ECDC4]/30 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: myCrab.color }}
              />
              <span className="font-dm text-[#95E1D3] truncate max-w-[60px]">
                {myCrab.handle}
              </span>
            </div>
          )}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something..."
            maxLength={200}
            className="flex-1 px-4 py-3 bg-[#1a2f4a] border border-[#4ECDC4]/30 rounded-xl font-dm text-white placeholder-[#95E1D3]/40 input-glow focus:outline-none text-sm md:text-base min-w-0"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 md:px-6 py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A8A0] text-[#0a1628] font-silkscreen text-xs md:text-sm rounded-xl hover:from-[#5DD9D1] hover:to-[#4ECDC4] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4ECDC4]/20 whitespace-nowrap"
          >
            <span className="hidden md:inline">SEND</span>
            <span className="md:hidden">📤</span>
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-2 font-dm text-[#4ECDC4]/30 text-[10px] md:text-xs">
          Requested by @OxPaulius · Built by @clonkbot
        </p>
      </div>

      {/* Message Feed Sidebar */}
      {showFeed && (
        <MessageFeed onClose={() => setShowFeed(false)} />
      )}
    </div>
  );
}
