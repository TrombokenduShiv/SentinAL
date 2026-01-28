import useViolations from "../hooks/useViolations";

export default function LiveThreatLog() {
  const { violations } = useViolations();

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">Live Threat Log</h2>

      {violations.map((v) => (
        <div
          key={v.id}
          className="border border-zinc-800 rounded-lg p-3 bg-zinc-900"
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-xs px-2 py-1 rounded font-semibold ${
                v.status === "PIRACY"
                  ? "bg-red-600"
                  : "bg-orange-500"
              }`}
            >
              {v.status}
            </span>
            <span className="text-xs text-zinc-400">
              {new Date(v.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <p className="mt-2 font-medium">{v.asset_name}</p>
          <p className="text-sm text-zinc-400">
            Server: {v.location}
          </p>
        </div>
      ))}
    </div>
  );
}
