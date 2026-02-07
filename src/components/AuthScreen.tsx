import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Could not sign in anonymously");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] ocean-bg flex items-center justify-center p-4">
      {/* Animated bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-7xl md:text-8xl mb-4 animate-bounce">🦀</div>
          <h1 className="font-silkscreen text-3xl md:text-4xl text-[#4ECDC4] neon-text tracking-wider">
            CRAB CITY
          </h1>
          <p className="font-dm text-[#95E1D3] mt-2 text-sm md:text-base">
            Where crustaceans congregate
          </p>
        </div>

        {/* Auth form */}
        <div className="bg-[#1a2f4a]/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-[#4ECDC4]/20 shadow-xl shadow-[#4ECDC4]/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-dm text-[#95E1D3] text-sm mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="crab@ocean.sea"
                className="w-full px-4 py-3 bg-[#0a1628] border border-[#4ECDC4]/30 rounded-lg font-dm text-white placeholder-[#4ECDC4]/40 input-glow focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-dm text-[#95E1D3] text-sm mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0a1628] border border-[#4ECDC4]/30 rounded-lg font-dm text-white placeholder-[#4ECDC4]/40 input-glow focus:outline-none"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <p className="text-[#FF6B6B] font-dm text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A8A0] text-[#0a1628] font-silkscreen text-sm rounded-lg hover:from-[#5DD9D1] hover:to-[#4ECDC4] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4ECDC4]/30"
            >
              {isLoading ? "..." : flow === "signIn" ? "ENTER CITY" : "CREATE CRAB"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="font-dm text-[#95E1D3] text-sm hover:text-[#4ECDC4] transition-colors"
            >
              {flow === "signIn" ? "New crab? Sign up" : "Already a crab? Sign in"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#4ECDC4]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a2f4a] text-[#95E1D3]/60 font-dm">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnonymous}
            disabled={isLoading}
            className="w-full py-3 border-2 border-[#FF6B6B]/50 text-[#FF6B6B] font-silkscreen text-sm rounded-lg hover:bg-[#FF6B6B]/10 hover:border-[#FF6B6B] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🦞 VISIT AS GUEST
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="font-dm text-[#4ECDC4]/40 text-xs">
            Requested by @OxPaulius · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}
