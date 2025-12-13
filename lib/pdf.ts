import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { ReportData } from '@/types/report';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #FF6B35',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    borderLeft: '4px solid #FF6B35',
    paddingLeft: 10,
  },
  scoreBox: {
    backgroundColor: '#FFF5F2',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    border: '1px solid #FF6B35',
  },
  scoreTitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  checkItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    border: '1px solid #E5E5E5',
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  checkScore: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: 4,
  },
  checkDetails: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 6,
  },
  checkRecommendation: {
    fontSize: 10,
    color: '#888888',
    fontStyle: 'italic',
    paddingTop: 8,
    borderTop: '1px solid #E5E5E5',
  },
  roadmapItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFF5F2',
    borderRadius: 8,
    border: '1px solid #FFD4C4',
  },
  roadmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B35',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '30px',
    marginRight: 12,
  },
  roadmapTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  roadmapDescription: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 8,
  },
  roadmapMeta: {
    flexDirection: 'row',
    fontSize: 10,
    color: '#888888',
  },
  quickWin: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F0FFF4',
    borderRadius: 6,
    border: '1px solid #9AE6B4',
  },
  quickWinTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 6,
  },
  quickWinDescription: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 8,
  },
  quickWinMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    color: '#888888',
  },
  codeSnippet: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 6,
    border: '1px solid #E2E8F0',
  },
  codeTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  codeDescription: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 10,
  },
  codeBlock: {
    fontFamily: 'Courier',
    fontSize: 9,
    backgroundColor: '#1A202C',
    color: '#E2E8F0',
    padding: 10,
    borderRadius: 4,
  },
  guideSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    border: '1px solid #E2E8F0',
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  guideDescription: {
    fontSize: 11,
    color: '#4A5568',
    marginBottom: 10,
  },
  guideStep: {
    fontSize: 10,
    color: '#2D3748',
    marginBottom: 5,
    paddingLeft: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
    borderTop: '1px solid #E5E5E5',
    paddingTop: 10,
  },
});

// Helper to get score color
const getScoreColor = (status: string) => {
  switch (status) {
    case 'pass':
      return { backgroundColor: '#C6F6D5', color: '#22543D' };
    case 'warning':
      return { backgroundColor: '#FEF5E7', color: '#975A16' };
    case 'fail':
      return { backgroundColor: '#FED7D7', color: '#742A2A' };
    default:
      return { backgroundColor: '#E5E5E5', color: '#666666' };
  }
};

/**
 * Generate PDF document from report data
 */
export function generateReportPDF(report: ReportData) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Readiness Report</Text>
          <Text style={styles.subtitle}>{report.url}</Text>
          <Text style={styles.subtitle}>
            Generated on {new Date(report.generatedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreTitle}>Overall AI Readiness Score</Text>
          <Text style={styles.scoreValue}>{report.overallScore}%</Text>
          <Text style={{ fontSize: 11, color: '#666', marginTop: 10 }}>
            Based on analysis of {report.pagesAnalyzed} pages
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={{ fontSize: 12, color: '#333', lineHeight: 1.6 }}>
            This comprehensive AI readiness assessment analyzed {report.pagesAnalyzed} pages of your
            website to evaluate how well AI systems can understand and process your content. The
            report includes {report.roadmap.length} prioritized recommendations, {report.quickWins.length} quick
            wins, {report.codeSnippets.length} code snippets, and a detailed implementation guide.
          </Text>
        </View>
      </Page>

      {/* Aggregated Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Site-Wide Analysis</Text>
        {report.aggregatedChecks.map((check, index) => (
          <View key={index} style={styles.checkItem}>
            <View style={styles.checkHeader}>
              <Text style={styles.checkLabel}>{check.label}</Text>
              <Text style={[styles.checkScore, getScoreColor(check.status)]}>
                {check.averageScore}%
              </Text>
            </View>
            <Text style={styles.checkDetails}>
              Affects {check.pagesAffected} of {check.totalPages} pages
            </Text>
            <Text style={styles.checkRecommendation}>{check.recommendation}</Text>
          </View>
        ))}
      </Page>

      {/* Roadmap */}
      {report.roadmap.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Implementation Roadmap</Text>
          {report.roadmap.map((item, index) => (
            <View key={index} style={styles.roadmapItem}>
              <View style={styles.roadmapHeader}>
                <Text style={styles.priorityBadge}>{item.priority}</Text>
                <Text style={styles.roadmapTitle}>{item.title}</Text>
              </View>
              <Text style={styles.roadmapDescription}>{item.description}</Text>
              <View style={styles.roadmapMeta}>
                <Text>Impact: {item.impact.toUpperCase()}</Text>
                <Text style={{ marginLeft: 20 }}>Effort: {item.effort}</Text>
                <Text style={{ marginLeft: 20 }}>Category: {item.category}</Text>
              </View>
            </View>
          ))}
        </Page>
      )}

      {/* Quick Wins */}
      {report.quickWins.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Quick Wins</Text>
          {report.quickWins.map((win, index) => (
            <View key={index} style={styles.quickWin}>
              <Text style={styles.quickWinTitle}>{win.title}</Text>
              <Text style={styles.quickWinDescription}>{win.description}</Text>
              <View style={styles.quickWinMeta}>
                <Text>Est. Impact: +{win.estimatedImpact}%</Text>
                <Text>Time: {win.timeToImplement}</Text>
              </View>
            </View>
          ))}
        </Page>
      )}

      {/* Code Snippets */}
      {report.codeSnippets.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Code Snippets</Text>
          {report.codeSnippets.map((snippet, index) => (
            <View key={index} style={styles.codeSnippet} wrap={false}>
              <Text style={styles.codeTitle}>{snippet.title}</Text>
              <Text style={styles.codeDescription}>{snippet.description}</Text>
              <View style={styles.codeBlock}>
                <Text>{snippet.code}</Text>
              </View>
              {snippet.fileToModify && (
                <Text style={{ fontSize: 9, color: '#718096', marginTop: 6 }}>
                  File: {snippet.fileToModify}
                </Text>
              )}
            </View>
          ))}
        </Page>
      )}

      {/* Implementation Guide */}
      {report.plainEnglishGuide.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Implementation Guide</Text>
          {report.plainEnglishGuide.map((section, index) => (
            <View key={index} style={styles.guideSection} wrap={false}>
              <Text style={styles.guideTitle}>
                {index + 1}. {section.title}
              </Text>
              <Text style={styles.guideDescription}>{section.description}</Text>
              {section.steps.map((step, stepIndex) => (
                <Text key={stepIndex} style={styles.guideStep}>
                  {stepIndex + 1}. {step}
                </Text>
              ))}
            </View>
          ))}
        </Page>
      )}

      {/* Footer on last page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.footer}>
          Report ID: {report.id} | Generated by AI Ready Website | {report.email}
        </Text>
      </Page>
    </Document>
  );
}
