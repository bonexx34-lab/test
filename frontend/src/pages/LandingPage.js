import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div className="relative min-h-screen bg-[#050505] overflow-hidden" data-testid="landing-page">
      {/* Background layers */}
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      {/* Gradient orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav
          className={`px-6 md:px-12 py-8 flex items-center justify-between ${
            mounted ? "animate-fade-in animate-delay-100" : "opacity-0"
          }`}
          data-testid="navbar"
        >
          <span
            className="text-[#F5F5F7] text-lg tracking-[-0.03em] font-semibold"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            CuratedCloset
          </span>
          <a
            href="/admin"
            className="text-[#A1A1AA] text-sm tracking-wide hover:text-[#F5F5F7] transition-colors duration-300"
            data-testid="admin-link"
          >
            Admin
          </a>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-12">
          <div className="max-w-3xl w-full text-left md:text-center">
            {/* Brand name */}
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.05em] leading-[0.95] text-[#F5F5F7] mb-4 ${
                mounted ? "animate-fade-in-up animate-delay-200" : "opacity-0"
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
              data-testid="hero-headline"
            >
              CuratedCloset
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg md:text-xl text-[#A1A1AA] tracking-wide mb-6 ${
                mounted ? "animate-fade-in-up animate-delay-300" : "opacity-0"
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
              data-testid="hero-subheadline"
            >
              for Creators &amp; Brands
            </p>

            {/* Tagline */}
            <p
              className={`text-sm uppercase tracking-[0.3em] text-[#D4AF37] font-medium mb-10 ${
                mounted ? "animate-fade-in-up animate-delay-400" : "opacity-0"
              }`}
              data-testid="hero-tagline"
            >
              Curate. Convert.
            </p>

            {/* Body copy */}
            <p
              className={`text-base md:text-lg text-[#71717A] leading-relaxed max-w-lg mx-auto md:mx-auto mb-12 ${
                mounted ? "animate-fade-in-up animate-delay-500" : "opacity-0"
              }`}
              style={{ fontFamily: "'Manrope', sans-serif" }}
              data-testid="hero-body"
            >
              Be independent. Get your own CuratedCloset to grow and monetize your activity.
            </p>

            {/* CTA Glass Card */}
            <div
              className={`glass-card rounded-2xl p-6 md:p-8 max-w-md mx-auto md:mx-auto ${
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
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] text-[#F5F5F7] placeholder:text-white/20 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40 transition-shadow duration-300 backdrop-blur-sm"
                  data-testid="email-input"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-[#F5F5F7] text-[#050505] rounded-full px-6 py-3.5 text-sm font-semibold hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  data-testid="submit-button"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Get started
                      <ArrowRight className="w-4 h-4" />
                    </>
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
          <p className="text-[#3F3F46] text-xs tracking-widest uppercase">
            curatedcloset.cc
          </p>
        </footer>
      </div>
    </div>
  );
}
