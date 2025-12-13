import { PageAnalysis } from "@/types/report";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  pages: PageAnalysis[];
}

export default function ReportPageAnalysis({ pages }: Props) {
  const [selectedPage, setSelectedPage] = useState<PageAnalysis | null>(pages[0] || null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "fail":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="body-large text-white/50">No pages analyzed</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="title-h3 text-white mb-2">Page-by-Page Analysis</h2>
        <p className="body-large text-white/60">
          Detailed breakdown of every page analyzed. Click on a page to see specific issues and recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="title-h5 text-white mb-4">Pages ({pages.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => setSelectedPage(page)}
                className={`w-full p-4 rounded-12 text-left transition-all ${
                  selectedPage?.url === page.url
                    ? "bg-heat-100/20 border-2 border-heat-100/50"
                    : "bg-white/5 border border-white/10 hover:bg-white/8"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="body-medium text-white truncate flex-1 pr-2">
                    {page.title}
                  </div>
                  <div className="text-sm font-medium text-heat-100">
                    {page.overallScore}%
                  </div>
                </div>
                <div className="body-small text-white/40 truncate font-mono text-xs">
                  {new URL(page.url).pathname || "/"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Page Details */}
        <div className="lg:col-span-2">
          {selectedPage && (
            <motion.div
              key={selectedPage.url}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-12 p-6"
            >
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <h3 className="title-h4 text-white mb-2">{selectedPage.title}</h3>
                <p className="body-small text-white/50 font-mono mb-4">{selectedPage.url}</p>
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="body-small text-white/50">Overall Score</div>
                    <div className="title-h3 gradient-fire">{selectedPage.overallScore}%</div>
                  </div>
                  <div>
                    <div className="body-small text-white/50">Analyzed</div>
                    <div className="body-medium text-white/70">
                      {new Date(selectedPage.analyzedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checks */}
              <div className="space-y-4">
                <h4 className="title-h5 text-white mb-4">Check Results</h4>
                {selectedPage.checks.map((check, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-12 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h5 className="body-large text-white mb-1">{check.label}</h5>
                        <p className="body-small text-white/60">{check.details}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                          check.status
                        )}`}
                      >
                        {check.score}%
                      </div>
                    </div>
                    {check.status !== "pass" && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="body-small text-white/50 mb-1">Recommendation:</p>
                        <p className="body-small text-white/70 italic">{check.recommendation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Insights */}
              {selectedPage.aiInsights && selectedPage.aiInsights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="title-h5 text-white mb-4">AI-Powered Insights</h4>
                  <div className="space-y-4">
                    {selectedPage.aiInsights.map((insight, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-heat-100/10 to-heat-200/10 border border-heat-100/20 rounded-12 p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="body-large text-white">{insight.label}</h5>
                          <div
                            className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                              insight.status
                            )}`}
                          >
                            {insight.score}%
                          </div>
                        </div>
                        <p className="body-medium text-white/70 mb-3">{insight.details}</p>
                        {insight.actionItems && insight.actionItems.length > 0 && (
                          <div className="space-y-1">
                            <p className="body-small text-white/50 mb-2">Action items:</p>
                            {insight.actionItems.map((item, i) => (
                              <div key={i} className="flex items-start">
                                <span className="text-heat-100 mr-2">•</span>
                                <span className="body-small text-white/70">{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
