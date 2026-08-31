import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { EmailItem } from "../types";
import { formatCurrency } from "../utils/exportUtils";

interface AiQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EmailItem[];
}

export const AiQueryModal: React.FC<AiQueryModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [history, setHistory] = useState<{ query: string; response: string }[]>([]);

  if (!isOpen) return null;

  const suggestedQueries = [
    "Summarize my SaaS and cloud infrastructure expenses",
    "List all Apple Store receipts and calculate total spent",
    "What are my tax deductible business expenses?",
    "Are there any invoices currently due or pending payment?",
    "Break down my travel and flight costs across accounts",
  ];

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim() || loading) return;

    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          items: items.slice(0, 40),
        }),
      });

      const data = await res.json();
      const resText = data.answer || "Unable to retrieve insights.";
      setAnswer(resText);
      setHistory((prev) => [{ query: q, response: resText }, ...prev]);
      if (!queryToAsk) setQuestion("");
    } catch (err: any) {
      setAnswer("Error querying AI assistant: " + (err?.message || "Check network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gemini Mail Assistant
              </h3>
              <p className="text-xs text-slate-500">
                Ask questions across all {items.length} active invoices and receipts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Suggested Queries */}
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Try asking:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQueries.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(sq)}
                  className="px-2.5 py-1 rounded-full text-xs bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 border border-slate-200 transition-colors text-left"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Current Answer / Loading State */}
          {loading && (
            <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-5 flex items-center gap-3 text-purple-900 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 shrink-0" />
              <div>
                <p className="font-semibold">Analyzing email dataset with Gemini 3.7 Flash...</p>
                <p className="text-purple-700 text-[11px]">Searching accounts, calculating spend totals, and matching line items.</p>
              </div>
            </div>
          )}

          {answer && !loading && (
            <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-5 text-xs text-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-purple-800 font-bold uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Insight</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-slate-900 text-xs font-sans">
                {answer}
              </div>
            </div>
          )}

          {/* Previous Queries in Session */}
          {history.length > 1 && (
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="text-xs font-semibold text-slate-400">Previous in this session:</div>
              {history.slice(1).map((h, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="font-semibold text-slate-800">Q: {h.query}</div>
                  <div className="text-slate-600 line-clamp-2">{h.response}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-question-input"
              type="text"
              placeholder="e.g. How much did I pay for Adobe and Figma combined?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
            <button
              id="btn-submit-ai"
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
