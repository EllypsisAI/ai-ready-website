import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import OpenAI from 'openai';
import {
  analyzeMultiplePages,
  aggregateAnalysis,
  discoverPages,
} from '@/lib/analysis';
import {
  saveReport,
  updateOrderStatus,
  getOrder,
} from '@/lib/kv';
import type {
  ReportData,
  RoadmapItem,
  QuickWin,
  CodeSnippet,
  GuideSection,
  AIInsight,
  PageAnalysis,
} from '@/types/report';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generate AI-powered insights for a page
 */
async function generateAIInsights(page: PageAnalysis): Promise<AIInsight[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] OpenAI API key not configured, skipping AI insights');
    return [];
  }

  try {
    const failedChecks = page.checks.filter(c => c.status === 'fail' || c.status === 'warning');

    if (failedChecks.length === 0) {
      return [];
    }

    const prompt = `Analyze these AI readiness issues for the URL: ${page.url}

Issues found:
${failedChecks.map(c => `- ${c.label}: ${c.details} (Score: ${c.score}/100)`).join('\n')}

For each issue, provide:
1. A specific action item to fix it
2. Estimated impact on AI comprehension (high/medium/low)

Return a JSON array of insights with this structure:
[{
  "id": "issue-id",
  "label": "Issue Name",
  "score": 45,
  "status": "fail",
  "details": "Brief explanation",
  "recommendation": "What to do",
  "actionItems": ["Specific step 1", "Specific step 2"]
}]

Keep recommendations specific and actionable.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI readiness expert. Provide specific, actionable recommendations in valid JSON format only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    // Handle both array and object responses
    const insights = Array.isArray(parsed) ? parsed : (parsed.insights || []);

    return insights;
  } catch (error) {
    console.error('[AI] Failed to generate insights:', error);
    return [];
  }
}

/**
 * Generate implementation roadmap
 */
async function generateRoadmap(
  pages: PageAnalysis[],
  url: string
): Promise<RoadmapItem[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] OpenAI API key not configured, skipping roadmap');
    return [];
  }

  try {
    const allIssues = pages.flatMap(p =>
      p.checks
        .filter(c => c.status !== 'pass')
        .map(c => ({ page: p.url, check: c }))
    );

    const prompt = `Create a prioritized roadmap for improving AI readiness for: ${url}

Issues across ${pages.length} pages:
${allIssues.slice(0, 20).map(i => `- ${i.page}: ${i.check.label} (${i.check.score}/100)`).join('\n')}

Create 5-8 roadmap items prioritized by impact. Return JSON:
{
  "roadmap": [{
    "priority": 1,
    "title": "Fix heading hierarchy",
    "description": "Ensure each page has one H1...",
    "impact": "high",
    "effort": "low",
    "category": "Content Structure",
    "affectedPages": ["url1", "url2"]
  }]
}

Priorities: 1 (highest) to N (lowest)
Impact/Effort: high, medium, low
Categories: Content Structure, Metadata, Accessibility, Technical SEO`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI readiness consultant. Create prioritized, actionable roadmaps in valid JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    return parsed.roadmap || [];
  } catch (error) {
    console.error('[AI] Failed to generate roadmap:', error);
    return [];
  }
}

/**
 * Generate quick wins
 */
async function generateQuickWins(pages: PageAnalysis[]): Promise<QuickWin[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] OpenAI API key not configured, skipping quick wins');
    return [];
  }

  try {
    const easyFixes = pages.flatMap(p =>
      p.checks
        .filter(c => c.status !== 'pass' && c.score > 40)
        .map(c => ({ page: p.url, check: c }))
    );

    const prompt = `Identify 3-5 quick wins for AI readiness improvement.

Current issues (partial list):
${easyFixes.slice(0, 15).map(i => `- ${i.check.label}: ${i.check.details}`).join('\n')}

Return JSON with quick, high-impact fixes:
{
  "quickWins": [{
    "title": "Add meta descriptions",
    "description": "Add 120-160 character descriptions to pages without them",
    "estimatedImpact": 15,
    "timeToImplement": "30 minutes"
  }]
}

Focus on changes that:
- Take < 2 hours to implement
- Have measurable score impact
- Don't require major refactoring`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an optimization expert. Identify quick, high-impact improvements in valid JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    return parsed.quickWins || [];
  } catch (error) {
    console.error('[AI] Failed to generate quick wins:', error);
    return [];
  }
}

/**
 * Generate code snippets
 */
async function generateCodeSnippets(pages: PageAnalysis[]): Promise<CodeSnippet[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] OpenAI API key not configured, skipping code snippets');
    return [];
  }

  try {
    const topIssues = pages
      .flatMap(p => p.checks)
      .filter(c => c.status !== 'pass')
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    const prompt = `Generate 3-5 code snippets to fix these AI readiness issues:

${topIssues.map(i => `- ${i.label}: ${i.details}`).join('\n')}

Return JSON with practical code examples:
{
  "snippets": [{
    "title": "Add semantic HTML structure",
    "description": "Replace divs with semantic elements",
    "language": "html",
    "code": "<main>\\n  <article>...</article>\\n</main>",
    "fileToModify": "index.html",
    "relatedCheck": "semantic-html"
  }]
}

Supported languages: html, javascript, typescript, css, json
Keep code practical and copy-paste ready.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a web development expert. Provide practical, working code examples in valid JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    return parsed.snippets || [];
  } catch (error) {
    console.error('[AI] Failed to generate code snippets:', error);
    return [];
  }
}

/**
 * Generate plain English guide
 */
async function generateGuide(pages: PageAnalysis[], url: string): Promise<GuideSection[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] OpenAI API key not configured, skipping guide');
    return [];
  }

  try {
    const issues = pages.flatMap(p => p.checks.filter(c => c.status !== 'pass'));
    const categories = Array.from(new Set(issues.map(i => i.label)));

    const prompt = `Create a beginner-friendly implementation guide for: ${url}

Issues to address:
${categories.slice(0, 10).join(', ')}

Return JSON with 4-6 guide sections:
{
  "guide": [{
    "title": "Improve Content Structure",
    "description": "Make your content easier for AI to understand",
    "steps": [
      "Open your homepage HTML file",
      "Find the main heading (usually in <h1> tags)",
      "Ensure there's only one H1 per page"
    ],
    "relatedChecks": ["heading-structure"]
  }]
}

Write for non-technical users. Use simple language.
Each section should have 3-5 clear, actionable steps.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a technical writer. Create clear, beginner-friendly guides in valid JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    return parsed.guide || [];
  } catch (error) {
    console.error('[AI] Failed to generate guide:', error);
    return [];
  }
}

/**
 * Main report generation handler
 */
export async function POST(request: NextRequest) {
  try {
    const { reportId, url, email } = await request.json();

    if (!reportId || !url || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`[GENERATE] Starting report generation for ${reportId}`);

    // Step 1: Discover pages
    console.log('[GENERATE] Step 1/6: Discovering pages...');
    const discoveredUrls = await discoverPages(url, 20);
    console.log(`[GENERATE] Found ${discoveredUrls.length} pages`);

    // Step 2: Analyze pages
    console.log('[GENERATE] Step 2/6: Analyzing pages...');
    const pages = await analyzeMultiplePages(discoveredUrls);
    console.log(`[GENERATE] Analyzed ${pages.length} pages`);

    // Step 3: Generate AI insights for each page
    console.log('[GENERATE] Step 3/6: Generating AI insights...');
    const pagesWithInsights = await Promise.all(
      pages.map(async (page) => ({
        ...page,
        aiInsights: await generateAIInsights(page),
      }))
    );

    // Step 4: Aggregate analysis
    console.log('[GENERATE] Step 4/6: Aggregating results...');
    const aggregatedChecks = aggregateAnalysis(pages);
    const overallScore = Math.round(
      pages.reduce((sum, p) => sum + p.overallScore, 0) / pages.length
    );

    // Step 5: Generate premium deliverables
    console.log('[GENERATE] Step 5/6: Generating premium content...');
    const [roadmap, quickWins, codeSnippets, plainEnglishGuide] = await Promise.all([
      generateRoadmap(pages, url),
      generateQuickWins(pages),
      generateCodeSnippets(pages),
      generateGuide(pages, url),
    ]);

    // Step 6: Create and save report
    console.log('[GENERATE] Step 6/6: Saving report...');
    const report: ReportData = {
      id: reportId,
      url,
      email,
      createdAt: new Date().toISOString(),
      overallScore,
      siteWideScore: overallScore,
      pagesAnalyzed: pages.length,
      pages: pagesWithInsights,
      aggregatedChecks,
      roadmap,
      quickWins,
      codeSnippets,
      plainEnglishGuide,
      generatedAt: new Date().toISOString(),
    };

    await saveReport(report);

    // Update order status - find order by report ID
    // Note: We need to update the KV helpers to support this lookup
    // For now, we'll mark it completed immediately
    console.log(`[GENERATE] Report ${reportId} completed successfully`);

    return NextResponse.json({
      success: true,
      reportId,
      message: 'Report generated successfully',
    });
  } catch (error) {
    console.error('[GENERATE] Report generation failed:', error);

    // Try to update order status to failed
    try {
      const { reportId } = await request.json();
      // We'd need session ID here - this is a limitation we'll address
      console.error(`[GENERATE] Failed to generate report ${reportId}`);
    } catch (e) {
      // Ignore
    }

    return NextResponse.json(
      { error: 'Report generation failed' },
      { status: 500 }
    );
  }
}
