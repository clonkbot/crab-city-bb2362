import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { CrabCity } from "./components/CrabCity";
import "./styles.css";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">🦀</div>
          <p className="mt-4 text-[#4ECDC4] font-silkscreen text-lg tracking-wider">
            Loading Crab City...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <CrabCity />;
}
