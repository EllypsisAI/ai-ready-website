"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ReportData } from "@/types/report";
import ReportOverview from "@/components/app/report/ReportOverview";
import ReportRoadmap from "@/components/app/report/ReportRoadmap";
import ReportQuickWins from "@/components/app/report/ReportQuickWins";
import ReportCodeSnippets from "@/components/app/report/ReportCodeSnippets";
import ReportGuide from "@/components/app/report/ReportGuide";
import ReportPageAnalysis from "@/components/app/report/ReportPageAnalysis";

export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId as string;
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "roadmap" | "quickwins" | "code" | "guide" | "pages">("overview");

  useEffect(() => {
    if (!reportId) {
      setError("No report ID provided");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        if (!response.ok) {
          throw new Error("Report not found");
        }
        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-heat-100 border-t-transparent rounded-full mx-auto" />
          <p className="body-large text-white/70">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="title-h2 text-red-500">Report Not Found</h1>
          <p className="body-large text-white/70">{error || "This report doesn't exist."}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-heat-100 hover:bg-heat-120 rounded-12 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="title-h4 gradient-fire">AI Readiness Report</h1>
              <p className="body-small text-white/50 mt-1">{report.url}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="body-small text-white/50">Overall Score</div>
                <div className="title-h3 gradient-fire">{report.overallScore}%</div>
              </div>
              <button className="px-4 py-2 bg-heat-100 hover:bg-heat-120 rounded-12 transition-colors body-medium">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 bg-black/30 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: "overview", label: "Overview" },
              { id: "roadmap", label: "Roadmap" },
              { id: "quickwins", label: "Quick Wins" },
              { id: "code", label: "Code Snippets" },
              { id: "guide", label: "Implementation Guide" },
              { id: "pages", label: `Pages (${report.pagesAnalyzed})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 body-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-heat-100 text-white"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && <ReportOverview report={report} />}
          {activeTab === "roadmap" && <ReportRoadmap roadmap={report.roadmap} />}
          {activeTab === "quickwins" && <ReportQuickWins quickWins={report.quickWins} />}
          {activeTab === "code" && <ReportCodeSnippets snippets={report.codeSnippets} />}
          {activeTab === "guide" && <ReportGuide guide={report.plainEnglishGuide} />}
          {activeTab === "pages" && <ReportPageAnalysis pages={report.pages} />}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="body-small text-white/40">
            Generated on {new Date(report.generatedAt).toLocaleDateString()} at{" "}
            {new Date(report.generatedAt).toLocaleTimeString()}
          </p>
          <p className="body-small text-white/30 mt-2">
            Report ID: {report.id}
          </p>
        </div>
      </footer>
    </div>
  );
}
