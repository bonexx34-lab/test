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
import { Download, Trash2, ArrowLeft, Users, Loader2, RefreshCw } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/subscribers`);
      setSubscribers(res.data.subscribers);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

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
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7]" data-testid="admin-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors duration-300"
              data-testid="back-link"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-[-0.03em]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
                data-testid="admin-title"
              >
                Subscribers
              </h1>
              <p className="text-[#71717A] text-sm mt-1">
                Manage your CuratedCloset waitlist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubscribers}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.08] text-[#A1A1AA] hover:text-[#F5F5F7] hover:border-white/20 transition-colors duration-300"
              data-testid="refresh-button"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              disabled={total === 0}
              className="inline-flex items-center gap-2 bg-[#F5F5F7] text-[#050505] rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="export-button"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-xl p-5 mb-8 flex items-center gap-4" data-testid="stats-card">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight" data-testid="total-count">{total}</p>
            <p className="text-xs text-[#71717A] uppercase tracking-wider">Total subscribers</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20" data-testid="loading-state">
            <Loader2 className="w-6 h-6 animate-spin text-[#A1A1AA]" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state">
            <p className="text-[#71717A] text-sm">No subscribers yet.</p>
            <p className="text-[#3F3F46] text-xs mt-2">
              Emails will appear here once people sign up.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden" data-testid="subscribers-table">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-[#71717A] text-xs uppercase tracking-wider font-medium py-4 px-5">
                    Email
                  </TableHead>
                  <TableHead className="text-[#71717A] text-xs uppercase tracking-wider font-medium py-4 px-5">
                    Date
                  </TableHead>
                  <TableHead className="text-[#71717A] text-xs uppercase tracking-wider font-medium py-4 px-5 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow
                    key={sub.id}
                    className="border-white/[0.04] hover:bg-white/[0.02]"
                    data-testid={`subscriber-row-${sub.id}`}
                  >
                    <TableCell className="py-4 px-5 text-sm text-[#F5F5F7]">
                      {sub.email}
                    </TableCell>
                    <TableCell className="py-4 px-5 text-sm text-[#71717A]">
                      {formatDate(sub.subscribed_at)}
                    </TableCell>
                    <TableCell className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleting === sub.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#71717A] hover:text-red-400 hover:bg-red-400/10 transition-colors duration-300 disabled:opacity-50"
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
