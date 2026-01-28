import { useState } from "react";

export default function ActionConsole({ selectedViolation }) {
  const [showVerify, setShowVerify] = useState(false);
  const [enforcing, setEnforcing] = useState(false);
  const [enforced, setEnforced] = useState(false);

  const canAct = Boolean(selectedViolation);

  function handleVerify() {
    setShowVerify(true);
  }

  function handleEnforce() {
    setEnforcing(true);

    // Fake enforcement delay (demo-safe)
    setTimeout(() => {
      setEnforcing(false);
      setEnforced(true);

      // Fake PDF download
      const blob = new Blob(
        ["LEGAL NOTICE\n\nViolation confirmed and enforcement issued."],
        { type: "application/pdf" }
      );
      const url = URL.createObjectURL(blob);
      window.open(url);
    }, 2000);
  }

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold">Action Console</h2>

      {!selectedViolation && (
        <p className="text-sm text-zinc-400">
          Select a violation to take action.
        </p>
      )}

      {selectedViolation && (
        <div className="text-sm text-zinc-300 border border-zinc-800 rounded p-3">
          <p className="font-medium">{selectedViolation.asset_name}</p>
          <p className="text-xs text-zinc-400 mt-1">
            {selectedViolation.type} • {selectedViolation.location}
          </p>
        </div>
      )}

      <button
        disabled={!canAct}
        onClick={handleVerify}
        className={`w-full py-2 rounded transition ${
          canAct
            ? "bg-zinc-700 hover:bg-zinc-600"
            : "bg-zinc-900 text-zinc-500 cursor-not-allowed"
        }`}
      >
        VERIFY EVIDENCE
      </button>

      <button
        disabled={!canAct || enforcing}
        onClick={handleEnforce}
        className={`w-full py-2 rounded transition ${
          canAct
            ? "bg-red-600 hover:bg-red-500"
            : "bg-zinc-900 text-zinc-500 cursor-not-allowed"
        }`}
      >
        {enforcing
          ? "Issuing Legal Notice…"
          : enforced
          ? "Notice Sent ✓"
          : "ENFORCE"}
      </button>

      {/* VERIFY MODAL */}
      {showVerify && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-80">
            <h3 className="text-green-500 font-semibold">
              SHA-256 Hash Verified
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Evidence integrity confirmed. Chain of custody intact.
            </p>
            <button
              onClick={() => setShowVerify(false)}
              className="mt-4 text-sm text-blue-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
