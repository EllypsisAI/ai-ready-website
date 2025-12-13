"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";

export default function PendingReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const reportIdParam = searchParams.get("report_id");
  const [status, setStatus] = useState<"processing" | "completed" | "error">("processing");
  const [reportId, setReportId] = useState<string | null>(reportIdParam);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!sessionId && !reportId) {
      setStatus("error");
      return;
    }

    // Poll for report completion
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/reports/status?reportId=${reportId || sessionId}`);
        const data = await response.json();

        if (data.status === "completed" && data.reportId) {
          setStatus("completed");
          setReportId(data.reportId);
          // Redirect to report after 2 seconds
          setTimeout(() => {
            router.push(`/report/${data.reportId}`);
          }, 2000);
        } else if (data.status === "failed") {
          setStatus("error");
        } else {
          // Still processing, check again
          if (retryCount < 60) { // Max 5 minutes (60 * 5 seconds)
            setTimeout(() => setRetryCount(retryCount + 1), 5000);
          } else {
            setStatus("error");
          }
        }
      } catch (error) {
        console.error("Failed to check status:", error);
        if (retryCount < 60) {
          setTimeout(() => setRetryCount(retryCount + 1), 5000);
        } else {
          setStatus("error");
        }
      }
    };

    checkStatus();
  }, [sessionId, reportId, retryCount, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Flame animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            <HeroFlame />
          </div>
        </div>

        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="title-h2 gradient-fire">
              Analyzing Your Website
            </h1>
            <p className="body-large text-white/70">
              We're running a comprehensive analysis of your website.
              This typically takes 2-3 minutes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-heat-100 animate-pulse" />
                <span className="text-white/50">Discovering pages...</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-heat-100 animate-pulse animation-delay-200" />
                <span className="text-white/50">Analyzing content...</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-heat-100 animate-pulse animation-delay-400" />
                <span className="text-white/50">Generating roadmap...</span>
              </div>
            </div>
            <p className="body-small text-white/40 mt-8">
              You'll receive an email when your report is ready.
              You can close this page if you'd like.
            </p>
          </motion.div>
        )}

        {status === "completed" && reportId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-6xl">✓</div>
            <h1 className="title-h2 gradient-fire">
              Report Ready!
            </h1>
            <p className="body-large text-white/70">
              Redirecting you to your personalized implementation guide...
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="title-h2 text-red-500">
              Something Went Wrong
            </h1>
            <p className="body-large text-white/70">
              We encountered an issue generating your report.
              Please contact support with your ID: {reportId || sessionId}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-heat-100 hover:bg-heat-120 rounded-12 transition-colors"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
