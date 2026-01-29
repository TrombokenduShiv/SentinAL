import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white relative overflow-hidden">
      
      {/* Background grid + neutral red glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6">
        <div className="text-2xl font-bold tracking-wider">
          <span className="text-red-500">Sentin</span>AL
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 text-sm border border-red-500 text-red-400 hover:bg-red-500 hover:text-black transition"
        >
          Launch Dashboard
        </button>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 mt-32">
        <div className="inline-block mb-6 px-4 py-1 text-xs tracking-widest border border-red-500/40 text-red-400">
          AI-POWERED COPYRIGHT ENFORCEMENT
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          <span className="block">Monitor the Web.</span>
          <span className="block text-red-500">Enforce Ownership.</span>
          <span className="block">In Real Time.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-zinc-400 text-lg">
          SentinAL detects digital piracy and territorial copyright violations,
          verifies evidence integrity, and initiates enforcement workflows —
          all from a single command dashboard.
        </p>

        <div className="mt-12 flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-7 py-3 bg-red-600 hover:bg-red-500 text-black font-semibold transition"
          >
            View Live Threats
          </button>

          <button className="px-7 py-3 border border-zinc-700 hover:border-red-500 text-zinc-300 transition">
            How It Works
          </button>
        </div>
      </section>

      {/* SYSTEM OVERVIEW */}
      <section className="relative z-10 mt-40 px-10 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Detection Layer",
            desc: "Continuously scans the open web and platforms for copyright infringements.",
          },
          {
            title: "Verification Layer",
            desc: "Validates evidence authenticity using cryptographic hash verification.",
          },
          {
            title: "Enforcement Layer",
            desc: "Automates legal notices and enforcement actions across jurisdictions.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#111113]/80 backdrop-blur border border-zinc-800 p-6 rounded-lg hover:border-red-500 transition"
          >
            <h3 className="text-lg font-semibold text-red-400">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-40 py-10 text-center text-xs text-zinc-500">
        Built for Bharat Hackathon · SentinAL © 2026
      </footer>
    </div>
  );
}
