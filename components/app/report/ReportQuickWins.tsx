import { QuickWin } from "@/types/report";
import { motion } from "framer-motion";

interface Props {
  quickWins: QuickWin[];
}

export default function ReportQuickWins({ quickWins }: Props) {
  if (quickWins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="body-large text-white/50">No quick wins identified</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="title-h3 text-white mb-2">Quick Wins</h2>
        <p className="body-large text-white/60">
          High-impact improvements you can implement quickly. These changes typically take less than 2 hours and can significantly boost your AI readiness score.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickWins.map((win, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-heat-100/10 to-heat-200/10 border border-heat-100/20 rounded-12 p-6 hover:border-heat-100/40 transition-colors"
          >
            {/* Icon & Title */}
            <div className="flex items-start space-x-3 mb-4">
              <div className="text-3xl">⚡</div>
              <div className="flex-1">
                <h3 className="title-h5 text-white mb-2">{win.title}</h3>
                <p className="body-medium text-white/70">{win.description}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <div className="body-small text-white/50 mb-1">Est. Score Impact</div>
                <div className="title-h5 gradient-fire">+{win.estimatedImpact}%</div>
              </div>
              <div className="text-right">
                <div className="body-small text-white/50 mb-1">Time to Implement</div>
                <div className="body-medium text-white">{win.timeToImplement}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-white/5 border border-white/10 rounded-12 p-6 mt-8">
        <h3 className="title-h5 text-white mb-3">💡 Pro Tip</h3>
        <p className="body-medium text-white/70">
          Start with quick wins to build momentum. Completing 2-3 of these can improve your score by 20-30% in just a few hours, making them perfect for demonstrating progress to stakeholders.
        </p>
      </div>
    </div>
  );
}
