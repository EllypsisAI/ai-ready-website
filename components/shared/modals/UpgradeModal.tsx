"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  currentScore?: number;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  url,
  currentScore,
}: UpgradeModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, email }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        setError("Failed to create checkout session");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-black border-2 border-heat-100/30 rounded-12 w-full max-w-2xl pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-heat-100/20 to-heat-200/20 p-8 border-b border-heat-100/20">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="title-h3 gradient-fire mb-2">
                  Get Your Complete AI Readiness Report
                </h2>
                <p className="body-large text-white/70">
                  Unlock the full analysis with actionable recommendations
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Current Score */}
                {currentScore !== undefined && (
                  <div className="bg-white/5 border border-white/10 rounded-12 p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="body-small text-white/50 mb-1">
                          Your Current Score
                        </p>
                        <p className="title-h2 gradient-fire">{currentScore}%</p>
                      </div>
                      <div className="text-4xl">📊</div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4 mb-6">
                  <h3 className="title-h5 text-white mb-4">
                    What You'll Get for $49:
                  </h3>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-heat-100 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="body-medium text-white font-semibold">
                        Multi-Page Analysis (Up to 20 Pages)
                      </p>
                      <p className="body-small text-white/60">
                        Comprehensive audit of your entire site, not just one page
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-heat-100 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="body-medium text-white font-semibold">
                        Prioritized Implementation Roadmap
                      </p>
                      <p className="body-small text-white/60">
                        AI-powered recommendations ranked by impact and effort
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-heat-100 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="body-medium text-white font-semibold">
                        Quick Wins & Code Snippets
                      </p>
                      <p className="body-small text-white/60">
                        Copy-paste solutions you can implement immediately
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-heat-100 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="body-medium text-white font-semibold">
                        Plain English Guide
                      </p>
                      <p className="body-small text-white/60">
                        Step-by-step instructions for non-technical teams
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-heat-100 text-sm">✓</span>
                    </div>
                    <div>
                      <p className="body-medium text-white font-semibold">
                        Downloadable PDF Report
                      </p>
                      <p className="body-small text-white/60">
                        Professional report you can share with your team
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-4">
                  <div>
                    <label className="body-small text-white/70 mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-12 text-white placeholder:text-white/40 focus:outline-none focus:border-heat-100 transition-colors"
                      disabled={isLoading}
                    />
                    {error && (
                      <p className="body-small text-red-400 mt-2">{error}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="body-small text-white/50 mb-1">
                      Analyzing: <span className="text-white/70 font-mono">{url}</span>
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-heat-100 hover:bg-heat-120 disabled:bg-heat-100/50 disabled:cursor-not-allowed rounded-12 transition-all active:scale-[0.98] group"
                  >
                    <span className="title-h5 text-white">
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          <span>Processing...</span>
                        </span>
                      ) : (
                        "Get Full Report for $49"
                      )}
                    </span>
                  </button>

                  <p className="body-small text-white/40 text-center">
                    Secure payment powered by Stripe • Report delivered in 2-3 minutes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
