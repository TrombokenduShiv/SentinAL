import { useState } from "react";
import LiveThreatLog from "./components/LiveThreatLog";
import MapVisualizer from "./components/MapVisualizer";
import ActionConsole from "./components/ActionConsole";
import useViolations from "./hooks/useViolations";

export default function App() {
  const { violations, loading } = useViolations(); // 👈 loading comes from hook
  const [selectedViolation, setSelectedViolation] = useState(null);

  return (
    <div className="h-screen bg-black text-white grid grid-cols-12 gap-2 p-4">
      
      {/* Left Panel */}
      <div className="col-span-3 border border-zinc-800 rounded-lg overflow-hidden">
        <LiveThreatLog
          violations={violations}
          loading={loading}
          selectedViolation={selectedViolation}
          onSelect={setSelectedViolation}
        />
      </div>

      {/* Center Panel */}
      <div className="col-span-6 border border-zinc-800 rounded-lg h-full">
        <MapVisualizer
          violations={violations}
          selectedViolation={selectedViolation}
          loading={loading}   // 👈 now exists
        />
      </div>

      {/* Right Panel */}
      <div className="col-span-3 border border-zinc-800 rounded-lg">
        <ActionConsole selectedViolation={selectedViolation} />
      </div>
    </div>
  );
}
