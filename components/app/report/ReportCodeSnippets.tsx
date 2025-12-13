import { CodeSnippet } from "@/types/report";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  snippets: CodeSnippet[];
}

export default function ReportCodeSnippets({ snippets }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="body-large text-white/50">No code snippets generated</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="title-h3 text-white mb-2">Code Snippets</h2>
        <p className="body-large text-white/60">
          Ready-to-use code examples to fix specific issues. Copy and paste these into your project.
        </p>
      </div>

      <div className="space-y-6">
        {snippets.map((snippet, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-12 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="title-h5 text-white">{snippet.title}</h3>
                <div className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white/70">
                  {snippet.language}
                </div>
              </div>
              <p className="body-medium text-white/60 mb-2">{snippet.description}</p>
              {snippet.fileToModify && (
                <p className="body-small text-white/40">
                  File: <span className="font-mono text-heat-100">{snippet.fileToModify}</span>
                </p>
              )}
            </div>

            {/* Code Block */}
            <div className="relative">
              <div className="bg-black/50 p-6 overflow-x-auto">
                <pre className="font-mono text-sm text-white/90">
                  <code>{snippet.code}</code>
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(snippet.code, index)}
                className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded border border-white/20 text-xs text-white transition-colors"
              >
                {copiedIndex === index ? "✓ Copied!" : "Copy"}
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/10">
              <div className="body-small text-white/50">
                Fixes: <span className="text-white/70">{snippet.relatedCheck}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-white/5 border border-white/10 rounded-12 p-6 mt-8">
        <h3 className="title-h5 text-white mb-3">💻 Implementation Notes</h3>
        <ul className="space-y-2 body-medium text-white/70">
          <li className="flex items-start">
            <span className="text-heat-100 mr-2">•</span>
            <span>Test each snippet in a development environment before deploying to production</span>
          </li>
          <li className="flex items-start">
            <span className="text-heat-100 mr-2">•</span>
            <span>Adjust file paths and variable names to match your project structure</span>
          </li>
          <li className="flex items-start">
            <span className="text-heat-100 mr-2">•</span>
            <span>Run your linter/formatter after adding code to maintain consistency</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
