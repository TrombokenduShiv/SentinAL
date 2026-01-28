export default function VerifyModal({ onClose }) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h3 className="text-green-500 font-semibold">
            SHA-256 Hash Verified
          </h3>
          <p className="text-sm text-zinc-400 mt-2">
            Chain of custody intact. Evidence is court-admissible.
          </p>
          <button onClick={onClose} className="mt-4 text-sm text-blue-400">
            Close
          </button>
        </div>
      </div>
    );
  }
  