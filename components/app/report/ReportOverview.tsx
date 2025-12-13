import { ReportData } from "@/types/report";
import { motion } from "framer-motion";

interface Props {
  report: ReportData;
}

export default function ReportOverview({ report }: Props) {
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

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-12 p-6"
        >
          <div className="body-small text-white/50 mb-2">Overall Score</div>
          <div className="title-h2 gradient-fire">{report.overallScore}%</div>
          <div className="body-small text-white/40 mt-2">
            Based on {report.pagesAnalyzed} pages
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-12 p-6"
        >
          <div className="body-small text-white/50 mb-2">Pages Analyzed</div>
          <div className="title-h2 text-white">{report.pagesAnalyzed}</div>
          <div className="body-small text-white/40 mt-2">
            Comprehensive site audit
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-12 p-6"
        >
          <div className="body-small text-white/50 mb-2">Roadmap Items</div>
          <div className="title-h2 text-white">{report.roadmap.length}</div>
          <div className="body-small text-white/40 mt-2">
            Prioritized action items
          </div>
        </motion.div>
      </div>

      {/* Aggregated Checks */}
      <div className="space-y-4">
        <h2 className="title-h4 text-white">Site-Wide Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.aggregatedChecks.map((check, index) => (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-12 p-4 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="body-large text-white mb-1">{check.label}</h3>
                  <p className="body-small text-white/50">
                    {check.pagesAffected} of {check.totalPages} pages affected
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                    check.status
                  )}`}
                >
                  {check.averageScore}%
                </div>
              </div>
              {check.issues.length > 0 && (
                <div className="space-y-1 mb-3">
                  {check.issues.slice(0, 2).map((issue, i) => (
                    <div key={i} className="body-small text-white/40 flex items-start">
                      <span className="text-heat-100 mr-2">•</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="body-small text-white/60 italic">{check.recommendation}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-heat-100/10 to-heat-200/10 border border-heat-100/20 rounded-12 p-6">
        <h3 className="title-h5 text-white mb-4">What's Included in Your Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">📊</div>
            <div>
              <div className="body-medium text-white">Prioritized Roadmap</div>
              <div className="body-small text-white/60">
                {report.roadmap.length} action items ranked by impact
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="body-medium text-white">Quick Wins</div>
              <div className="body-small text-white/60">
                {report.quickWins.length} fast improvements you can make today
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💻</div>
            <div>
              <div className="body-medium text-white">Code Snippets</div>
              <div className="body-small text-white/60">
                {report.codeSnippets.length} copy-paste solutions
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-2xl">📖</div>
            <div>
              <div className="body-medium text-white">Plain English Guide</div>
              <div className="body-small text-white/60">
                {report.plainEnglishGuide.length} step-by-step sections
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
