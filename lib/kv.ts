import { kv } from '@vercel/kv';
import { Order, ReportData } from '@/types/report';

/**
 * Store order information
 */
export async function saveOrder(order: Order): Promise<void> {
  const key = `order:${order.sessionId}`;
  await kv.set(key, order);

  // Also add to email index for lookups
  const emailKey = `email:${order.email}`;
  await kv.sadd(emailKey, order.reportId);
}

/**
 * Get order by session ID
 */
export async function getOrder(sessionId: string): Promise<Order | null> {
  const key = `order:${sessionId}`;
  return await kv.get<Order>(key);
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  sessionId: string,
  status: Order['status'],
  errorMessage?: string
): Promise<void> {
  const order = await getOrder(sessionId);
  if (!order) {
    throw new Error(`Order not found for session ${sessionId}`);
  }

  const updatedOrder: Order = {
    ...order,
    status,
    errorMessage,
    completedAt: status === 'completed' ? new Date().toISOString() : order.completedAt,
  };

  await kv.set(`order:${sessionId}`, updatedOrder);
}

/**
 * Save report data
 */
export async function saveReport(report: ReportData): Promise<void> {
  const key = `report:${report.id}`;
  await kv.set(key, report);
}

/**
 * Get report by ID
 */
export async function getReport(reportId: string): Promise<ReportData | null> {
  const key = `report:${reportId}`;
  return await kv.get<ReportData>(key);
}

/**
 * Get all report IDs for an email
 */
export async function getReportsByEmail(email: string): Promise<string[]> {
  const emailKey = `email:${email}`;
  const reportIds = await kv.smembers(emailKey);
  return reportIds as string[];
}

/**
 * Check if report exists
 */
export async function reportExists(reportId: string): Promise<boolean> {
  const key = `report:${reportId}`;
  const exists = await kv.exists(key);
  return exists === 1;
}
