import FirecrawlApp from '@mendable/firecrawl-js';
import type { PageAnalysis, AggregatedCheck, CheckResult } from '@/types/report';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

// Re-export the analysis functions from the existing route
// These are the same functions used in app/api/ai-readiness/route.ts

function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((acc, word) => {
    return acc + (word.match(/[aeiouAEIOU]+/g) || []).length || 1;
  }, 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  return Math.max(0, Math.min(100, score));
}

function extractTextContent(html: string): string {
  let cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  cleanHtml = cleanHtml.replace(/<[^>]+>/g, ' ');
  cleanHtml = cleanHtml.replace(/&nbsp;/g, ' ');
  cleanHtml = cleanHtml.replace(/&amp;/g, '&');
  cleanHtml = cleanHtml.replace(/&lt;/g, '<');
  cleanHtml = cleanHtml.replace(/&gt;/g, '>');
  cleanHtml = cleanHtml.replace(/&quot;/g, '"');
  cleanHtml = cleanHtml.replace(/&#39;/g, "'");
  return cleanHtml.replace(/\s+/g, ' ').trim();
}

async function analyzeHTML(html: string, metadata: any, url: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const textContent = extractTextContent(html);

  // Heading Structure
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const headings = html.match(/<h([1-6])[^>]*>/gi) || [];
  const headingLevels = headings.map(h => parseInt(h.match(/<h([1-6])/i)?.[1] || '0'));

  let headingScore = 100;
  let headingIssues: string[] = [];

  if (h1Count === 0) {
    headingScore -= 40;
    headingIssues.push('No H1 found');
  } else if (h1Count > 1) {
    headingScore -= 30;
    headingIssues.push(`Multiple H1s (${h1Count})`);
  }

  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i-1] > 1) {
      headingScore -= 15;
      headingIssues.push(`Skipped heading level (H${headingLevels[i-1]} → H${headingLevels[i]})`);
    }
  }

  headingScore = Math.max(0, headingScore);
  results.push({
    id: 'heading-structure',
    label: 'Heading Hierarchy',
    status: headingScore >= 80 ? 'pass' : headingScore >= 50 ? 'warning' : 'fail',
    score: headingScore,
    details: headingIssues.length > 0 ? headingIssues.join(', ') : `Perfect hierarchy with ${h1Count} H1`,
    recommendation: headingScore < 80 ?
      'Use exactly one H1 and maintain logical heading hierarchy (H1→H2→H3)' :
      'Excellent heading structure'
  });

  // Readability
  const readabilityScore = calculateReadability(textContent);
  let normalizedScore = 0;
  let readabilityStatus: 'pass' | 'warning' | 'fail' = 'pass';

  if (readabilityScore >= 70) {
    normalizedScore = 100;
  } else if (readabilityScore >= 50) {
    normalizedScore = 80;
  } else if (readabilityScore >= 30) {
    normalizedScore = 50;
    readabilityStatus = 'warning';
  } else {
    normalizedScore = 20;
    readabilityStatus = 'fail';
  }

  results.push({
    id: 'readability',
    label: 'Content Readability',
    status: readabilityStatus,
    score: normalizedScore,
    details: `Flesch: ${Math.round(readabilityScore)}`,
    recommendation: normalizedScore < 80 ?
      'Simplify sentences for better AI comprehension' :
      'Content is clearly written'
  });

  // Metadata Quality
  const hasOgTitle = metadata?.ogTitle || metadata?.title || html.includes('og:title');
  const hasOgDescription = metadata?.ogDescription || metadata?.description || html.includes('og:description');

  let metaScore = 30;
  if (hasOgTitle) metaScore += 35;
  if (hasOgDescription) metaScore += 35;

  results.push({
    id: 'meta-tags',
    label: 'Metadata Quality',
    status: metaScore >= 70 ? 'pass' : metaScore >= 40 ? 'warning' : 'fail',
    score: metaScore,
    details: `${hasOgTitle ? 'Title ✓' : 'Missing title'}, ${hasOgDescription ? 'Description ✓' : 'Missing description'}`,
    recommendation: metaScore < 70 ?
      'Add title and description metadata' :
      'Metadata provides excellent context'
  });

  // Semantic HTML
  const semanticTags = ['<article', '<nav', '<main', '<section', '<header', '<footer', '<aside'];
  const semanticCount = semanticTags.filter(tag => html.includes(tag)).length;
  const semanticScore = Math.min(100, (semanticCount / 5) * 100);

  results.push({
    id: 'semantic-html',
    label: 'Semantic HTML',
    status: semanticScore >= 80 ? 'pass' : semanticScore >= 40 ? 'warning' : 'fail',
    score: semanticScore,
    details: `Found ${semanticCount} semantic HTML5 elements`,
    recommendation: semanticScore < 80 ? 'Use more semantic HTML5 elements' : 'Excellent use of semantic HTML'
  });

  // Accessibility
  const hasAltText = (html.match(/alt="/g) || []).length;
  const imgCount = (html.match(/<img/g) || []).length;
  const altTextRatio = imgCount > 0 ? (hasAltText / imgCount) * 100 : 100;
  const hasAriaLabels = html.includes('aria-label');

  const accessibilityScore = Math.min(100,
    (imgCount === 0 ? 40 : (altTextRatio * 0.4)) +
    (hasAriaLabels ? 20 : 0) +
    (html.includes('role="') ? 15 : 0) +
    (html.includes('lang="') ? 25 : 0)
  );

  results.push({
    id: 'accessibility',
    label: 'Accessibility',
    status: accessibilityScore >= 80 ? 'pass' : accessibilityScore >= 50 ? 'warning' : 'fail',
    score: Math.round(accessibilityScore),
    details: `${Math.round(altTextRatio)}% images have alt text`,
    recommendation: accessibilityScore < 80 ? 'Add alt text and ARIA labels' : 'Good accessibility'
  });

  return results;
}

/**
 * Analyze a single page
 */
export async function analyzeSinglePage(url: string): Promise<PageAnalysis> {
  const scrapeResult = await firecrawl.scrapeUrl(url, {
    formats: ['html']
  });

  const html = scrapeResult.html || '';
  const metadata = scrapeResult.metadata || {};

  const checks = await analyzeHTML(html, metadata, url);
  const overallScore = Math.round(
    checks.reduce((sum, check) => sum + check.score, 0) / checks.length
  );

  return {
    url,
    title: metadata.title || url,
    overallScore,
    checks,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Analyze multiple pages
 */
export async function analyzeMultiplePages(urls: string[]): Promise<PageAnalysis[]> {
  const results: PageAnalysis[] = [];

  for (let i = 0; i < urls.length; i++) {
    try {
      // Add delay to avoid rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const analysis = await analyzeSinglePage(urls[i]);
      results.push(analysis);
      console.log(`[ANALYSIS] Completed ${i + 1}/${urls.length}: ${urls[i]}`);
    } catch (error) {
      console.error(`[ANALYSIS] Failed to analyze ${urls[i]}:`, error);
      // Continue with other pages
    }
  }

  return results;
}

/**
 * Aggregate analysis across multiple pages
 */
export function aggregateAnalysis(pages: PageAnalysis[]): AggregatedCheck[] {
  if (pages.length === 0) return [];

  const checkIds = pages[0].checks.map(c => c.id);
  const aggregated: AggregatedCheck[] = [];

  for (const checkId of checkIds) {
    const allChecks = pages.map(p => p.checks.find(c => c.id === checkId)).filter(Boolean) as CheckResult[];

    if (allChecks.length === 0) continue;

    const averageScore = Math.round(
      allChecks.reduce((sum, check) => sum + check.score, 0) / allChecks.length
    );

    const failedPages = allChecks.filter(c => c.status === 'fail' || c.status === 'warning');
    const issues = Array.from(new Set(failedPages.map(c => c.details)));

    aggregated.push({
      id: checkId,
      label: allChecks[0].label,
      averageScore,
      status: averageScore >= 80 ? 'pass' : averageScore >= 50 ? 'warning' : 'fail',
      pagesAffected: failedPages.length,
      totalPages: pages.length,
      issues,
      recommendation: allChecks[0].recommendation,
    });
  }

  return aggregated.sort((a, b) => a.averageScore - b.averageScore);
}

/**
 * Discover pages on a website using Firecrawl map
 */
export async function discoverPages(baseUrl: string, limit: number = 20): Promise<string[]> {
  try {
    const mapResult = await firecrawl.mapUrl(baseUrl, {
      limit
    });

    const links = mapResult.links || [];

    // Filter and prioritize pages
    const priorityPatterns = [
      /\/(index|home|about|contact|services|products|pricing)/i,
      /\/$/,  // Root pages
    ];

    const priorityPages: string[] = [];
    const otherPages: string[] = [];

    for (const link of links) {
      if (priorityPatterns.some(pattern => pattern.test(link))) {
        priorityPages.push(link);
      } else {
        otherPages.push(link);
      }
    }

    // Return priority pages first, then others, up to the limit
    return [...priorityPages, ...otherPages].slice(0, limit);
  } catch (error) {
    console.error('[ANALYSIS] Failed to discover pages:', error);
    // Fallback to just analyzing the base URL
    return [baseUrl];
  }
}
