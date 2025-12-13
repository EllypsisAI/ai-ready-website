import { NextRequest, NextResponse } from 'next/server';
import { getReport } from '@/lib/kv';

/**
 * GET /api/reports/[reportId]
 * Fetch a specific report by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    const report = await getReport(reportId);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Optional: Add email verification
    // You could check if the requester's email matches the report's email
    // by passing it as a query parameter or using authentication

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('[REPORTS] Failed to fetch report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
