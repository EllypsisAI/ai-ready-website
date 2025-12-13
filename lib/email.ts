import { Resend } from 'resend';
import type { ReportData } from '@/types/report';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReportEmailParams {
  report: ReportData;
  reportUrl: string;
  pdfUrl?: string;
}

/**
 * Send report completion email to customer
 */
export async function sendReportEmail({
  report,
  reportUrl,
  pdfUrl,
}: SendReportEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] Resend API key not configured, skipping email');
    return { success: false, error: 'Email not configured' };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'reports@aireadywebsite.com';

  try {
    const emailHtml = generateReportEmailHTML(report, reportUrl, pdfUrl);

    const response = await resend.emails.send({
      from: fromEmail,
      to: report.email,
      subject: `Your AI Readiness Report is Ready (${report.overallScore}% Score)`,
      html: emailHtml,
    });

    console.log('[EMAIL] Report email sent successfully:', response);
    return { success: true, messageId: response.id };
  } catch (error) {
    console.error('[EMAIL] Failed to send report email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Generate HTML email template
 */
function generateReportEmailHTML(
  report: ReportData,
  reportUrl: string,
  pdfUrl?: string
): string {
  const scoreColor = report.overallScore >= 80 ? '#10B981' : report.overallScore >= 50 ? '#F59E0B' : '#EF4444';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Readiness Report is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🔥 Your AI Readiness Report is Ready!
              </h1>
            </td>
          </tr>

          <!-- Score Box -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center; background-color: #FFF5F2;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">Your AI Readiness Score</p>
              <h2 style="margin: 0; color: ${scoreColor}; font-size: 64px; font-weight: 700;">
                ${report.overallScore}%
              </h2>
              <p style="margin: 15px 0 0; color: #666666; font-size: 14px;">
                Based on analysis of ${report.pagesAnalyzed} pages
              </p>
            </td>
          </tr>

          <!-- Report Summary -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 20px; font-weight: 600;">
                What's in Your Report
              </h3>
              <ul style="margin: 0; padding: 0; list-style: none;">
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #FF6B35; font-weight: 600;">📊 ${report.roadmap.length} Prioritized Action Items</span>
                  <br>
                  <span style="color: #6b7280; font-size: 14px;">Ranked by impact to help you focus on what matters</span>
                </li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #FF6B35; font-weight: 600;">⚡ ${report.quickWins.length} Quick Wins</span>
                  <br>
                  <span style="color: #6b7280; font-size: 14px;">Fast improvements you can make today</span>
                </li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #FF6B35; font-weight: 600;">💻 ${report.codeSnippets.length} Ready-to-Use Code Snippets</span>
                  <br>
                  <span style="color: #6b7280; font-size: 14px;">Copy-paste solutions to common issues</span>
                </li>
                <li style="padding: 10px 0;">
                  <span style="color: #FF6B35; font-weight: 600;">📖 Plain English Implementation Guide</span>
                  <br>
                  <span style="color: #6b7280; font-size: 14px;">Step-by-step instructions for everyone</span>
                </li>
              </ul>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td>
                    <a href="${reportUrl}" style="display: inline-block; padding: 16px 32px; background-color: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                      View Full Report
                    </a>
                  </td>
                  ${pdfUrl ? `
                  <td>
                    <a href="${pdfUrl}" style="display: inline-block; padding: 16px 32px; background-color: #374151; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px;">
                      Download PDF
                    </a>
                  </td>
                  ` : ''}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Issues Preview -->
          <tr>
            <td style="padding: 0 30px 40px;">
              <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; font-weight: 600;">
                Top Priority Items
              </h3>
              ${report.roadmap.slice(0, 3).map((item, index) => `
                <div style="margin-bottom: 15px; padding: 15px; background-color: #FFF5F2; border-left: 4px solid #FF6B35; border-radius: 6px;">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="display: inline-block; width: 30px; height: 30px; line-height: 30px; background-color: #FF6B35; color: #ffffff; border-radius: 50%; text-align: center; font-weight: 700; margin-right: 12px;">
                      ${item.priority}
                    </span>
                    <strong style="color: #1f2937; font-size: 16px;">${item.title}</strong>
                  </div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    ${item.description}
                  </p>
                  <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                    Impact: ${item.impact} • Effort: ${item.effort}
                  </p>
                </div>
              `).join('')}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Report for <strong>${report.url}</strong>
              </p>
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px;">
                Generated on ${new Date(report.generatedAt).toLocaleDateString()} • Report ID: ${report.id}
              </p>
              <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px;">
                Questions? Reply to this email or visit our support page.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  url: string,
  sessionId: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] Resend API key not configured, skipping email');
    return { success: false };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'reports@aireadywebsite.com';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Payment Confirmed - Generating Your AI Readiness Report',
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 12px;">
    <h1 style="color: #FF6B35;">Payment Confirmed! 🎉</h1>
    <p>Thank you for your purchase! We're now analyzing your website: <strong>${url}</strong></p>
    <p>Your comprehensive AI readiness report is being generated and will be ready in 2-3 minutes.</p>
    <p>You'll receive another email as soon as it's complete, but you can also track progress here:</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/report/pending?session_id=${sessionId}"
       style="display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
      Track Progress
    </a>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Session ID: ${sessionId}
    </p>
  </div>
</body>
</html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send payment confirmation:', error);
    return { success: false };
  }
}
