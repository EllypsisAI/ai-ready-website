import { NextRequest, NextResponse } from 'next/server';
import { getReport, reportExists } from '@/lib/kv';

/**
 * GET /api/reports/status?reportId=xxx
 * Check the status of a report generation
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Check if report exists
    const exists = await reportExists(reportId);

    if (!exists) {
      // Report doesn't exist yet - still processing
      return NextResponse.json({
        status: 'processing',
        reportId,
        message: 'Report is being generated',
      });
    }

    // Report exists - fetch it
    const report = await getReport(reportId);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'completed',
      reportId,
      report: {
        id: report.id,
        url: report.url,
        overallScore: report.overallScore,
        pagesAnalyzed: report.pagesAnalyzed,
        generatedAt: report.generatedAt,
      },
    });
  } catch (error) {
    console.error('[STATUS] Failed to check report status:', error);
    return NextResponse.json(
      { error: 'Failed to check report status' },
      { status: 500 }
    );
  }
}
