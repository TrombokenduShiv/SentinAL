import LiveThreatLog from "./components/LiveThreatLog";
import MapVisualizer from "./components/MapVisualizer";
import ActionConsole from "./components/ActionConsole";

export default function App() {
  const mockViolations = [
    { id: 1, location: "RU" },
    { id: 2, location: "CN" },
  ];
  return (
    <div className="h-screen bg-black text-white grid grid-cols-12 gap-2 p-4">
      {/* Left Panel */}
      <div className="col-span-3 border border-zinc-800 rounded-lg">
        <LiveThreatLog />
      </div>

      {/* Center Panel */}
      <div className="col-span-6 border border-zinc-800 rounded-lg h-full">
        <MapVisualizer violations={mockViolations} />
      </div>

      {/* Right Panel */}
      <div className="col-span-3 border border-zinc-800 rounded-lg">
        <ActionConsole />
      </div>
    </div>
  );
}
