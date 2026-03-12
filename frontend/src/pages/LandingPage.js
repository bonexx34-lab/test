import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    axios.post(`${API}/track-visit`).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/subscribe`, { email: email.trim() });
      if (res.data.success) {
        toast.success(res.data.message);
        setEmail("");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.detail;
      if (Array.isArray(msg)) {
        toast.error("Please enter a valid email address.");
      } else if (typeof msg === "string") {
        toast.error(msg);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F5F0EB] overflow-hidden" data-testid="landing-page">
      <div className="grain-overlay" />
      <div className="soft-shape soft-shape-1" />
      <div className="soft-shape soft-shape-2" />
      <div className="soft-shape soft-shape-3" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav
          className={`px-6 md:px-12 py-8 flex items-center justify-between ${
            mounted ? "animate-fade-in animate-delay-100" : "opacity-0"
          }`}
          data-testid="navbar"
        >
          <span className="text-[#1A1A1A] text-lg tracking-[-0.03em] font-semibold">
            CuratedCloset
          </span>
          <a
            href="/admin"
            className="opacity-0 text-sm px-4 py-2 cursor-pointer select-none"
            data-testid="admin-link"
            aria-label="Admin"
          >
            Admin
          </a>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-12">
          <div className="max-w-3xl w-full text-center">
            {/* Headline */}
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] leading-[0.95] text-[#1A1A1A] mb-4 ${
                mounted ? "animate-fade-in-up animate-delay-200" : "opacity-0"
              }`}
              data-testid="hero-headline"
            >
              CuratedCloset
            </h1>

            {/* Sub-headline */}
            <p
              className={`text-lg md:text-xl text-[#6B6760] tracking-wide mb-6 ${
                mounted ? "animate-fade-in-up animate-delay-300" : "opacity-0"
              }`}
              data-testid="hero-subheadline"
            >
              for Creators &amp; Brands
            </p>

            {/* Tagline */}
            <p
              className={`text-xs sm:text-sm uppercase tracking-[0.35em] text-[#B4983A] font-semibold mb-8 ${
                mounted ? "animate-fade-in-up animate-delay-400" : "opacity-0"
              }`}
              data-testid="hero-tagline"
            >
              CURATE. CONVERT.
            </p>

            {/* Baseline */}
            <p
              className={`text-base md:text-lg text-[#5A5650] leading-relaxed mb-6 ${
                mounted ? "animate-fade-in-up animate-delay-500" : "opacity-0"
              }`}
              data-testid="hero-baseline"
            >
              Stay focused on what matters. CC handles the rest.
            </p>

            {/* Keywords */}
            <p
              className={`text-sm text-[#A09A90] mb-10 ${
                mounted ? "animate-fade-in-up animate-delay-500" : "opacity-0"
              }`}
              data-testid="hero-keywords"
            >
              Affiliate hub&ensp;&middot;&ensp;Owned audience&ensp;&middot;&ensp;Automated resale
            </p>

            {/* CTA Glass Card */}
            <div
              className={`glass-card rounded-2xl p-5 md:p-6 max-w-md mx-auto ${
                mounted ? "animate-fade-in-up animate-delay-600" : "opacity-0"
              }`}
              data-testid="cta-card"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-[#F5F0EB]/60 border border-[#E2DDD5] text-[#1A1A1A] placeholder:text-[#B8B3A6] rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#B4983A]/30 focus:border-[#B4983A]/20 transition-shadow duration-300"
                  data-testid="email-input"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#1A1A1A] text-white rounded-full px-6 py-3.5 text-sm font-semibold hover:brightness-125 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  data-testid="submit-button"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Join the guestlist \u2192"
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className={`px-6 md:px-12 py-10 text-center ${
            mounted ? "animate-fade-in animate-delay-800" : "opacity-0"
          }`}
          data-testid="footer"
        >
          <p className="text-[#C5C0B6] text-[11px] tracking-wide">
            Patent-pending concept &amp; technology
          </p>
        </footer>
      </div>
    </div>
  );
}
