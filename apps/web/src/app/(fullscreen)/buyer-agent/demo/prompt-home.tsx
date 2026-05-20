"use client";

import { useState } from "react";
import { promptCategories, type PromptItem } from "./scenario-data";
import { Search, Send } from "lucide-react";

interface PromptHomeProps {
  onPromptClick: (text: string, targetScene?: string) => void;
}

export function PromptHome({ onPromptClick }: PromptHomeProps) {
  const [activeCategory, setActiveCategory] = useState(promptCategories[0].id);
  const [inputValue, setInputValue] = useState("");

  const category = promptCategories.find((c) => c.id === activeCategory)!;

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    onPromptClick(text);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full overflow-y-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center text-white text-lg shadow-sm">
          🧮
        </div>
        <h1 className="text-xl font-semibold text-slate-800">Import Copilot</h1>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Search input */}
      <div className="w-full max-w-2xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your import needs and let the copilot help..."
            className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]/40 transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {promptCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  isActive
                    ? "bg-[#7c3aed] text-white border-[#7c3aed] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt cards */}
      <div className="w-full max-w-2xl space-y-2.5">
        {category.prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onClick={() => onPromptClick(prompt.text, prompt.targetScene)}
          />
        ))}
      </div>

      {/* Quick entries */}
      <div className="w-full max-w-2xl mt-8 pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-400 mb-3">Quick Access</p>
        <div className="flex flex-wrap gap-2">
          {["TLC Calculation", "Bulk Inquiry", "Compliance Check", "HS Code Lookup", "Channel Compare", "Trade Terms"].map((label) => (
            <span
              key={label}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PromptCard({ prompt, onClick }: { prompt: PromptItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 rounded-xl border border-slate-100 bg-white hover:border-[#7c3aed]/20 hover:bg-[#7c3aed]/[0.02] hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-sm mt-0.5 flex-shrink-0">💬</span>
        <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900">
          {prompt.text}
        </span>
      </div>
    </button>
  );
}
