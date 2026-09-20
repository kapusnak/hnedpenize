/**
 * Known crawler / preview / uptime User-Agents that should not count as flyer QR scans.
 * Practical filter, not a complete bot database.
 */
const CRAWLER_UA_RE =
  /googlebot|google-inspectiontool|google-extended|storebot-google|adsbot-google|mediapartners-google|bingbot|bingpreview|slurp|duckduckbot|baiduspider|yandex(bot|images|mobilebot)|sogou|exabot|facebot|facebookexternalhit|facebookcatalog|twitterbot|linkedinbot|pinterestbot|slackbot|telegrambot|whatsapp|applebot|iframely|embedly|preview\/|pingdom|uptimerobot|site24x7|gtmetrix|lighthouse|chrome-lighthouse|pagespeed|ahrefsbot|semrushbot|dotbot|mj12bot|bytespider|petalbot|gptbot|chatgpt-user|ccbot|claudebot|anthropic-ai|amazonbot|ia_archiver|archive\.org_bot|curl\/|wget\/|python-requests|python-urllib|go-http-client|libwww-perl|scrapy|headlesschrome|phantomjs|puppeteer|playwright|\bbot\b|\bcrawler\b|\bspider\b/i

export function isCrawlerUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  return CRAWLER_UA_RE.test(userAgent)
}
