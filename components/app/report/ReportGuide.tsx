import { GuideSection } from "@/types/report";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  guide: GuideSection[];
}

export default function ReportGuide({ guide }: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  if (guide.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="body-large text-white/50">No guide sections generated</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="title-h3 text-white mb-2">Plain English Implementation Guide</h2>
        <p className="body-large text-white/60">
          Step-by-step instructions written for everyone, regardless of technical background.
        </p>
      </div>

      <div className="space-y-4">
        {guide.map((section, index) => {
          const isExpanded = expandedSections.has(index);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-12 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-heat-100/20 border border-heat-100/30 flex items-center justify-center flex-shrink-0">
                    <span className="title-h5 text-heat-100">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="title-h5 text-white mb-1">{section.title}</h3>
                    <p className="body-medium text-white/60">{section.description}</p>
                  </div>
                </div>
                <div className={`text-white/50 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>

              {/* Content */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="pl-14 space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-white/70">{stepIndex + 1}</span>
                        </div>
                        <p className="body-medium text-white/80 flex-1">{step}</p>
                      </div>
                    ))}
                  </div>

                  {section.relatedChecks.length > 0 && (
                    <div className="pl-14 mt-4 pt-4 border-t border-white/10">
                      <div className="body-small text-white/50 mb-2">Related checks:</div>
                      <div className="flex flex-wrap gap-2">
                        {section.relatedChecks.map((check, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 bg-white/5 rounded text-xs text-white/60"
                          >
                            {check}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-br from-heat-100/10 to-heat-200/10 border border-heat-100/20 rounded-12 p-6 mt-8">
        <h3 className="title-h5 text-white mb-3">📖 How to Use This Guide</h3>
        <p className="body-medium text-white/70 mb-4">
          This guide is designed to be accessible to everyone, including those without technical backgrounds. Follow the steps in order, and don't hesitate to ask your development team for help with implementation.
        </p>
        <div className="space-y-2">
          <div className="flex items-start">
            <span className="text-heat-100 mr-2">1.</span>
            <span className="body-medium text-white/70">Click each section to expand the detailed steps</span>
          </div>
          <div className="flex items-start">
            <span className="text-heat-100 mr-2">2.</span>
            <span className="body-medium text-white/70">Share relevant sections with your team members</span>
          </div>
          <div className="flex items-start">
            <span className="text-heat-100 mr-2">3.</span>
            <span className="body-medium text-white/70">Check off completed steps to track progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
