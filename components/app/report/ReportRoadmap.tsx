import { RoadmapItem } from "@/types/report";
import { motion } from "framer-motion";

interface Props {
  roadmap: RoadmapItem[];
}

export default function ReportRoadmap({ roadmap }: Props) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-white/70";
    }
  };

  if (roadmap.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="body-large text-white/50">No roadmap items generated</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="title-h3 text-white mb-2">Implementation Roadmap</h2>
        <p className="body-large text-white/60">
          Prioritized action items to improve your AI readiness score. Start from the top for maximum impact.
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-12 p-6 hover:bg-white/8 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0">
                  <span className="title-h5 text-heat-100">{item.priority}</span>
                </div>
                <div className="flex-1">
                  <h3 className="title-h5 text-white mb-2">{item.title}</h3>
                  <p className="body-medium text-white/70">{item.description}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div
                className={`px-3 py-1 rounded-full border text-xs font-medium ${getImpactColor(
                  item.impact
                )}`}
              >
                {item.impact.toUpperCase()} IMPACT
              </div>
              <div className="flex items-center space-x-2 body-small text-white/50">
                <span>Effort:</span>
                <span className={getEffortColor(item.effort)}>{item.effort}</span>
              </div>
              <div className="flex items-center space-x-2 body-small text-white/50">
                <span>Category:</span>
                <span className="text-white/70">{item.category}</span>
              </div>
            </div>

            {/* Affected Pages */}
            {item.affectedPages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="body-small text-white/50 mb-2">
                  Affected pages ({item.affectedPages.length}):
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.affectedPages.slice(0, 5).map((page, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white/60"
                    >
                      {new URL(page).pathname || "/"}
                    </div>
                  ))}
                  {item.affectedPages.length > 5 && (
                    <div className="px-2 py-1 text-xs text-white/40">
                      +{item.affectedPages.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
