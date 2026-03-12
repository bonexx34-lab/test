import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Trash2, ArrowLeft, Users, Loader2, RefreshCw, Eye, TrendingUp, Lock } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      if (res.data.success) {
        onLogin();
      }
    } catch {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6" data-testid="admin-login">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-[#B4983A]/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-5 h-5 text-[#B4983A]" />
          </div>
          <h1
            className="text-2xl font-bold tracking-[-0.03em] text-[#1A1A1A] mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Admin Access
          </h1>
          <p className="text-sm text-[#8A857C]">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white border border-[#E2DED6] text-[#1A1A1A] placeholder:text-[#B8B3A6] rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#B4983A]/40 focus:border-[#B4983A]/30 transition-shadow duration-300 mb-3"
            data-testid="admin-password-input"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-xs mb-3" data-testid="login-error">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#F7F5F0] rounded-xl px-6 py-3.5 text-sm font-semibold hover:bg-[#2A2A2A] hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200 disabled:opacity-50"
            data-testid="admin-login-button"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-[#9C9789] hover:text-[#1A1A1A] transition-colors duration-300" data-testid="back-to-home">
            Back to CuratedCloset
          </a>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCards({ analytics }) {
  const cards = [
    {
      label: "Total Visits",
      value: analytics.total_visits,
      icon: Eye,
      color: "text-[#6B6760]",
      bg: "bg-[#6B6760]/10",
    },
    {
      label: "Subscribers",
      value: analytics.total_subscribers,
      icon: Users,
      color: "text-[#B4983A]",
      bg: "bg-[#B4983A]/10",
    },
    {
      label: "Conversion",
      value: `${analytics.conversion_rate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-600/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" data-testid="analytics-cards">
      {cards.map((card) => (
        <div key={card.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center flex-shrink-0`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-[#1A1A1A]" data-testid={`analytics-${card.label.toLowerCase().replace(' ', '-')}`}>
              {card.value}
            </p>
            <p className="text-xs text-[#8A857C] uppercase tracking-wider">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [analytics, setAnalytics] = useState({ total_visits: 0, total_subscribers: 0, conversion_rate: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/admin/subscribers`),
        axios.get(`${API}/admin/analytics`),
      ]);
      setSubscribers(subsRes.data.subscribers);
      setTotal(subsRes.data.total);
      setAnalytics(analyticsRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = () => {
    window.open(`${API}/admin/subscribers/export`, "_blank");
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await axios.delete(`${API}/admin/subscribers/${id}`);
      if (res.data.success) {
        toast.success("Subscriber removed");
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        setTotal((prev) => prev - 1);
        setAnalytics((prev) => ({
          ...prev,
          total_subscribers: prev.total_subscribers - 1,
          conversion_rate: prev.total_visits > 0
            ? Math.round(((prev.total_subscribers - 1) / prev.total_visits) * 10000) / 100
            : 0,
        }));
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to delete subscriber");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1A1A1A]" data-testid="admin-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-[#9C9789] hover:text-[#1A1A1A] transition-colors duration-300"
              data-testid="back-link"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-[-0.03em]"
                style={{ fontFamily: "'Inter', sans-serif" }}
                data-testid="admin-title"
              >
                Dashboard
              </h1>
              <p className="text-[#8A857C] text-sm mt-1">
                CuratedCloset Analytics &amp; Subscribers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#E2DED6] text-[#9C9789] hover:text-[#1A1A1A] hover:border-[#B8B3A6] transition-colors duration-300"
              data-testid="refresh-button"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              disabled={total === 0}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F7F5F0] rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#2A2A2A] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="export-button"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Analytics */}
        <AnalyticsCards analytics={analytics} />

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20" data-testid="loading-state">
            <Loader2 className="w-6 h-6 animate-spin text-[#9C9789]" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state">
            <p className="text-[#8A857C] text-sm">No subscribers yet.</p>
            <p className="text-[#B8B3A6] text-xs mt-2">
              Emails will appear here once people sign up.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden" data-testid="subscribers-table">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E8E4DC] hover:bg-transparent">
                  <TableHead className="text-[#8A857C] text-xs uppercase tracking-wider font-medium py-4 px-5">
                    Email
                  </TableHead>
                  <TableHead className="text-[#8A857C] text-xs uppercase tracking-wider font-medium py-4 px-5">
                    Date
                  </TableHead>
                  <TableHead className="text-[#8A857C] text-xs uppercase tracking-wider font-medium py-4 px-5 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="border-[#F0ECE4] hover:bg-[#F0ECE4]/50"
                    data-testid={`subscriber-row-${sub.id}`}
                  >
                    <TableCell className="py-4 px-5 text-sm text-[#1A1A1A]">
                      {sub.email}
                    </TableCell>
                    <TableCell className="py-4 px-5 text-sm text-[#8A857C]">
                      {formatDate(sub.subscribed_at)}
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleting === sub.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#9C9789] hover:text-red-500 hover:bg-red-50 transition-colors duration-300 disabled:opacity-50"
                        data-testid={`delete-button-${sub.id}`}
                        title="Delete"
                      >
                        {deleting === sub.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
