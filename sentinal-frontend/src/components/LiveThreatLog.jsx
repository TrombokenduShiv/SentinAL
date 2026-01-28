import ViolationSkeleton from "./ViolationSkeleton";

export default function LiveThreatLog({
  violations,
  loading,
  selectedViolation,
  onSelect,
}) {
  return (
    <div className="p-4 space-y-3 h-full">
      <h2 className="text-lg font-semibold">Live Threat Log</h2>

      {loading && (
        <div className="space-y-3">
          <ViolationSkeleton />
          <ViolationSkeleton />
          <ViolationSkeleton />
        </div>
      )}

      {!loading && (
        <div className="space-y-3 overflow-y-auto max-h-[85%]">
          {violations.map((v) => {
            const isSelected = selectedViolation?.id === v.id;

            return (
              <div
                key={v.id}
                onClick={() => onSelect(v)}
                className={`border rounded-lg p-3 cursor-pointer transition
              ${
                isSelected
                  ? "border-red-500 bg-zinc-800"
                  : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
              }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      v.type === "PIRACY" ? "bg-red-600" : "bg-orange-500"
                    }`}
                  >
                    {v.type}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="mt-2 font-medium">{v.asset_name}</p>
                <p className="text-sm text-zinc-400">Server: {v.location}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
